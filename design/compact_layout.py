"""Compact chapters 1–5 without changing quest progression or saved IDs.

Run preview first, inspect the PNGs, then apply the reviewed candidate.
"""

from __future__ import annotations

import argparse
import json
import math
import re
import shutil
from collections import defaultdict
from itertools import combinations
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

from audit_progression import CHAPTERS, MAIN_FILES, QUEST_BLOCK, QUEST_ID, ROOT, read_chapters, validate
from evaluate_layout import intersects
from rebuild_layout import EXITS, MILESTONES, depths
from spine_layout import mainline_order


OUT = ROOT / "design/compact-layout"
BACKUP = ROOT / "design/backups/quest-layout-2026-10-04"
MAIN_STEP = 3.0
ROW_LEVELS = [(0.0, 8.0, 16.0, 21.5), (0.0, 8.0, 13.5, 21.5),
              (0.0, 8.0, 13.5, 21.5), (0.0, 8.0, 16.0), (0.0, 8.0, 16.0, 24.0)]
TITLES = ["无中生有", "苦尽甘来", "探明真相", "创世之径", "创造模式？"]
FIELDS = re.compile(r'(?m)^\t\t\t(?:x|y|shape|size|hide_dependent_lines): [^\r\n]*\r?\n')


def visual_style(quest_id, main, index):
    milestone = next((style for prefix, style in MILESTONES[index].items()
                      if quest_id.startswith(prefix)), None)
    if quest_id in main:
        size, shape = milestone or (1.5, "rsquare")
        return {"size": min(size, 2.0), "shape": shape, "role": "main"}
    if milestone:
        return {"size": 1.25, "shape": milestone[1], "role": "branch"}
    return {"size": 1.0, "shape": "", "role": "branch"}


def collides(qid, point, placed, styles):
    x, y = point
    for other, node in placed.items():
        if other == qid:
            continue
        gap = (styles[qid]["size"] + styles[other]["size"]) / 2 + 1.0
        if abs(x - node["x"]) < gap - 0.001 and abs(y - node["y"]) < gap - 0.001:
            return True
    return False


def point_segment_distance(point, a, b):
    dx, dy = b[0] - a[0], b[1] - a[1]
    t = max(0.0, min(1.0, ((point[0] - a[0]) * dx + (point[1] - a[1]) * dy)
                     / max(0.001, dx * dx + dy * dy)))
    return math.dist(point, (a[0] + t * dx, a[1] + t * dy))


def choose_fold(chapter, path, index):
    """Choose turns from branch attachments, including later recipe rejoins."""
    off = sorted(set(chapter) - set(path))
    lookup = {qid: number for number, qid in enumerate(off)}
    main_lookup = {qid: number for number, qid in enumerate(path)}
    laplacian = np.zeros((len(off), len(off)))
    boundary = np.zeros((len(off), len(path)))
    all_edges = [(a, b) for b, quest in chapter.items() for a in quest["dependencies"] if a in chapter]
    mixed = [(a, b) for a, b in all_edges if (a in main_lookup) != (b in main_lookup)]
    for a, b in all_edges:
        for qid, neighbor in ((a, b), (b, a)):
            if qid in lookup:
                row = lookup[qid]
                laplacian[row, row] += 1
                if neighbor in lookup:
                    laplacian[row, lookup[neighbor]] -= 1
                else:
                    boundary[row, main_lookup[neighbor]] += 1
    weights = np.linalg.solve(laplacian, boundary)
    row_count = 3 if index == 3 else 4
    best = None
    for turns in combinations(range(4, len(path) - 3), row_count - 1):
        cuts = (0, *turns, len(path))
        counts = [b - a for a, b in zip(cuts, cuts[1:])]
        if min(counts) < 4 or max(counts) > 12:
            continue
        coords = np.zeros((len(path), 2))
        x = 0.0
        stages = {}
        for row, (start, end) in enumerate(zip(cuts, cuts[1:])):
            for number in range(start, end):
                coords[number] = (x, ROW_LEVELS[index][row])
                stages[path[number]] = row
                if number + 1 < end:
                    x += MAIN_STEP * (1 if row % 2 == 0 else -1)
        branch_coords = weights @ coords
        combined = {qid: coords[number] for qid, number in main_lookup.items()}
        combined.update({qid: branch_coords[number] for qid, number in lookup.items()})
        distances = [float(np.linalg.norm(combined[a] - combined[b])) for a, b in mixed]
        width = float(np.ptp(coords[:, 0]))
        score = sum(d * d + 90 * max(0, d - 4.5) ** 4 for d in distances)
        score += 20 * max(distances) ** 2 + width * 2
        score += sum(float(np.linalg.norm(combined[a] - combined[b])) ** 2
                     for a, b in all_edges if a in main_lookup and b in main_lookup)
        if best is None or score < best[0]:
            best = (score, combined, stages, cuts)
    if best is None:
        raise ValueError("No suitable folded route")
    _, combined, stages, cuts = best
    print(f"  Chapter {index + 1} turns={cuts}; harmonic mixed-edge max="
          f"{max(float(np.linalg.norm(combined[a] - combined[b])) for a, b in mixed):.2f}", flush=True)
    return combined, stages


def layout(chapter, index):
    path = mainline_order(chapter, EXITS[index])
    main = set(path)
    styles = {qid: visual_style(qid, main, index) for qid in chapter}
    harmonic, row_of = choose_fold(chapter, path, index)
    placed = {qid: {**styles[qid], "x": float(harmonic[qid][0]), "y": float(harmonic[qid][1]),
                    "stage": row_of[qid]} for qid in path}
    min_x = min(node["x"] for node in placed.values())
    max_x = max(node["x"] for node in placed.values())
    row_count = max(row_of.values()) + 1

    adjacent = defaultdict(list)
    edges = []
    for child, quest in chapter.items():
        for parent in quest["dependencies"]:
            if parent in chapter:
                adjacent[child].append(parent)
                adjacent[parent].append(child)
                edges.append((parent, child))
    main_edges = list(zip(path, path[1:]))
    rank = depths(chapter)
    def anchor(qid):
        return float(harmonic[qid][0]), float(harmonic[qid][1])

    grid = [(round(x * 2.25, 2), ROW_LEVELS[index][row] + offset)
            for x in range(math.floor(min_x / 2.25) - 5, math.ceil(max_x / 2.25) + 6)
            for row in range(row_count) for offset in (-7.25, -5.0, -2.75, 2.75, 5.0, 7.25)]
    grid = sorted(set(grid))
    fixed = set(main)
    if index == 3:
        tutorial = next(k for k in chapter if k.startswith("38AA3A"))
        placed[tutorial] = {**styles[tutorial], "x": -3.25, "y": -5.0, "stage": 0}
        fixed.add(tutorial)
        catalog = [k for k, v in chapter.items() if v["dependencies"] == [tutorial]]
        catalog_slots = [(-7.75 + column * 2.25, -2.75 - row * 2.25)
                         for row in range(4) for column in range(5)
                         if (column, row) not in ((2, 1), (3, 0))]
        for qid, point in zip(catalog, catalog_slots, strict=True):
            placed[qid] = {**styles[qid], "x": point[0], "y": point[1], "stage": 0, "role": "catalog"}
            fixed.add(qid)
    if index == 4:
        finale = path[-1]
        rewards = [p for p in chapter[finale]["dependencies"] if p not in main]
        x = (placed[path[-3]]["x"] + placed[finale]["x"]) / 2
        for number, qid in enumerate(rewards):
            placed[qid] = {**styles[qid], "x": x + ((number % 3) - 1) * MAIN_STEP,
                           "y": placed[finale]["y"] + 3.0 + (number // 3) * 2.25,
                           "stage": row_of[finale], "role": "finale"}
            fixed.add(qid)
    for qid in fixed:
        if collides(qid, (placed[qid]["x"], placed[qid]["y"]), placed, styles):
            raise ValueError(f"Fixed group overlap: {qid}")
    main_contacts = {qid: sum(p in main for p in adjacent[qid]) for qid in chapter}
    # Reserve positions for shared prerequisites and branch hubs before placing
    # the optional leaves; otherwise leaves can push a required bridge far away.
    off = sorted(set(chapter) - fixed,
                 key=lambda qid: (-(main_contacts[qid] >= 2), -len(adjacent[qid]),
                                  -main_contacts[qid], rank[qid], qid))

    def cost(qid, point, lines):
        if collides(qid, point, placed, styles):
            return float("inf")
        # Preserve an unobstructed continuous main route.
        for a, b in main_edges:
            if point_segment_distance(point, (placed[a]["x"], placed[a]["y"]),
                                      (placed[b]["x"], placed[b]["y"])) < styles[qid]["size"] / 2 + 1.0:
                return float("inf")
        neighbors = [p for p in adjacent[qid] if p in placed]
        lengths = [math.dist(point, (placed[p]["x"], placed[p]["y"])) for p in neighbors]
        if any(math.dist(point, (placed[p]["x"], placed[p]["y"])) > 8.75
               for p in neighbors if p in main):
            return float("inf")
        value = sum(d * d + max(0, d - 7) ** 2 * 400 for d in lengths)
        value += sum(1500 * max(0, math.dist(point, (placed[p]["x"], placed[p]["y"])) - 8) ** 2
                     for p in neighbors if p in main)
        ax, ay = anchor(qid)
        value += 0.5 * ((point[0] - ax) ** 2 + (point[1] - ay) ** 2)
        # Penalize crossings and links passing through unrelated nodes.
        for neighbor in neighbors:
            end = (placed[neighbor]["x"], placed[neighbor]["y"])
            for a, b, p1, p2 in lines:
                if neighbor not in (a, b) and qid not in (a, b) and intersects(point, end, p1, p2):
                    value += 50 if neighbor in main or a in main else 25
            for other, node in placed.items():
                if other not in (qid, neighbor):
                    d = point_segment_distance((node["x"], node["y"]), point, end)
                    if d < styles[other]["size"] / 2 + 0.25:
                        value += 80
        return value

    def lines_without(qid):
        return [(a, b, (placed[a]["x"], placed[a]["y"]), (placed[b]["x"], placed[b]["y"]))
                for a, b in edges if a in placed and b in placed and qid not in (a, b)]

    for qid in off:
        lines = lines_without(qid)
        point = min(grid, key=lambda p: cost(qid, p, lines))
        if not math.isfinite(cost(qid, point, lines)):
            raise ValueError(f"No free position for {qid}")
        placed[qid] = {**styles[qid], "x": point[0], "y": point[1],
                       "stage": min(range(row_count), key=lambda r: abs(ROW_LEVELS[index][r] - anchor(qid)[1]))}

    for iteration in range(8):
        moved = 0
        for qid in (off if iteration % 2 == 0 else list(reversed(off))):
            lines = lines_without(qid)
            current = (placed[qid]["x"], placed[qid]["y"])
            neighbors = [placed[p] for p in adjacent[qid] if p in placed]
            ideal = (sum(n["x"] for n in neighbors) / len(neighbors),
                     sum(n["y"] for n in neighbors) / len(neighbors))
            nearby = sorted(grid, key=lambda p: math.dist(p, ideal))[:110]
            best = min([current, *nearby], key=lambda p: cost(qid, p, lines))
            if best != current and cost(qid, best, lines) + 0.01 < cost(qid, current, lines):
                placed[qid].update(x=best[0], y=best[1])
                moved += 1
        if not moved:
            break

    # Show short branch continuation links. Dense catalog spokes and long
    # supplementary links remain available on hover, matching native FTB behavior.
    children = defaultdict(list)
    for a, b in edges:
        children[a].append(b)
    for qid, node in placed.items():
        outgoing = children[qid]
        node["hide_dependent_lines"] = qid not in main and (
            len(outgoing) > 6 or any(math.dist((node["x"], node["y"]),
                (placed[b]["x"], placed[b]["y"])) > 9 for b in outgoing))
    # Hide additional off-spine spokes only when they cut across the main route.
    main_links = [(p, c) for p, c in edges if p in main]
    for qid in set(chapter) - main:
        a = (placed[qid]["x"], placed[qid]["y"])
        for child in children[qid]:
            b = (placed[child]["x"], placed[child]["y"])
            if any(len({qid, child, p, c}) == 4 and intersects(a, b,
                    (placed[p]["x"], placed[p]["y"]), (placed[c]["x"], placed[c]["y"]))
                   for p, c in main_links):
                placed[qid]["hide_dependent_lines"] = True
    return placed, path


def metrics(chapter, nodes, path):
    edges = [(a, b) for b, q in chapter.items() for a in q["dependencies"] if a in chapter]
    branch_edges = [(a, b) for a, b in edges if a not in path or b not in path]
    mixed_lengths = sorted(math.dist((nodes[a]["x"], nodes[a]["y"]),
                               (nodes[b]["x"], nodes[b]["y"])) for a, b in edges if (a in path) != (b in path))
    lengths = sorted(math.dist((nodes[a]["x"], nodes[a]["y"]),
                               (nodes[b]["x"], nodes[b]["y"])) for a, b in branch_edges)
    visible = [(a, b) for a, b in edges if not nodes[a].get("hide_dependent_lines", False)]
    crossings = sum(intersects((nodes[a]["x"], nodes[a]["y"]), (nodes[b]["x"], nodes[b]["y"]),
                              (nodes[c]["x"], nodes[c]["y"]), (nodes[d]["x"], nodes[d]["y"]))
                    for (a, b), (c, d) in combinations(visible, 2) if len({a, b, c, d}) == 4)
    overlaps = [(a, b) for a, b in combinations(nodes, 2)
                if collides(a, (nodes[a]["x"], nodes[a]["y"]), {b: nodes[b]}, nodes)]
    width = max(n["x"] + n["size"] / 2 for n in nodes.values()) - min(n["x"] - n["size"] / 2 for n in nodes.values())
    height = max(n["y"] + n["size"] / 2 for n in nodes.values()) - min(n["y"] - n["size"] / 2 for n in nodes.values())
    return {"quests": len(nodes), "mainline": len(path), "width": round(width, 2), "height": round(height, 2),
            "branch_mean": round(sum(lengths) / len(lengths), 2), "branch_max": round(max(lengths), 2),
            "main_branch_max": round(max(mixed_lengths), 2),
            "branch_p90": round(lengths[int((len(lengths) - 1) * .9)], 2),
            "visible_edges": len(visible), "visible_crossings": crossings, "overlaps": overlaps}


def render(index, chapter, nodes, path, stats, fully_visible=False):
    scale = 30
    gutter = 200
    min_x = min(n["x"] for n in nodes.values()) - 4
    max_x = max(n["x"] for n in nodes.values()) + 4
    min_y = min(n["y"] for n in nodes.values()) - 5
    max_y = max(n["y"] for n in nodes.values()) + 4
    width = max(1400, round((max_x - min_x) * scale) + gutter)
    height = round((max_y - min_y) * scale) + 160
    canvas = Image.new("RGB", (width, height), "#101821")
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 18)
    small = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 13)
    heading = ImageFont.truetype("C:/Windows/Fonts/msyhbd.ttc", 32)
    draw.text((36, 22), f"第 {index + 1} 章 · {TITLES[index]}", fill="#edf4f8", font=heading)
    caption = ("全部连线常显 · 支线就近成组且彼此无交叉 · 大节点为主线，编号仅用于示意图"
               if fully_visible else "紧凑折返主线 · 支线贴近对应节点 · 连线颜色统一，靠节点大小与形状辨认主线")
    draw.text((36, 68), caption, font=font, fill="#a5b8c5")
    points = {qid: (gutter + (n["x"] - min_x) * scale, (n["y"] - min_y) * scale + 110) for qid, n in nodes.items()}
    for x in range(0, width, 30):
        draw.line((x, 108, x, height - 42), fill="#18242e")
    for y in range(110, height - 42, 30):
        draw.line((0, y, width, y), fill="#18242e")
    for child, quest in chapter.items():
        for parent in quest["dependencies"]:
            if parent in nodes and not nodes[parent]["hide_dependent_lines"]:
                draw.line((*points[parent], *points[child]), fill="#73a98b", width=2)
    for qid, node in nodes.items():
        x, y = points[qid]
        radius = node["size"] * scale / 2
        bbox = (x - radius, y - radius, x + radius, y + radius)
        shape = node["shape"]
        if shape == "rsquare":
            draw.rounded_rectangle(bbox, radius=7, fill="#20332c", outline="#80be9c", width=3)
        elif shape in ("gear", "diamond", "pentagon"):
            sides = {"gear": 16, "diamond": 4, "pentagon": 5}[shape]
            poly = [(x + radius * (.78 if shape == "gear" and k % 2 else 1) * math.cos(k * math.tau / sides - math.pi / 2),
                     y + radius * (.78 if shape == "gear" and k % 2 else 1) * math.sin(k * math.tau / sides - math.pi / 2)) for k in range(sides)]
            draw.polygon(poly, fill="#20332c")
            draw.line(poly + [poly[0]], fill="#80be9c", width=3)
        else:
            draw.ellipse(bbox, fill="#1b2a24", outline="#80be9c", width=2)
        label = str(path.index(qid) + 1) if qid in path else ""
        if label:
            box = draw.textbbox((0, 0), label, font=small)
            draw.text((x - (box[2] - box[0]) / 2, y - 9), label, fill="#e3eee7", font=small)
    if fully_visible:
        footer=f"静态布局预览（非游戏截图） · {stats['quests']} 个任务 · 支线最长连接 {stats['branch_max']:.2f} · 支线间交叉 {stats['branch_crossings']} · 节点重叠 {len(stats['overlaps'])}"
    else:
        for row in range(max(nodes[qid]["stage"] for qid in path) + 1):
            y = points[next(qid for qid in path if nodes[qid]["stage"] == row)][1]
            draw.text((24, y - 12), f"主线 {row + 1:02d}  {'→' if row % 2 == 0 else '←'}", font=font, fill="#d2dce3")
        footer=f"静态布局预览（非游戏截图） · {stats['quests']} 个任务 · 支线平均连线 {stats['branch_mean']} · 节点重叠 {len(stats['overlaps'])}"
    draw.text((24, height - 35), footer, font=font, fill="#95aab9")
    canvas.save(OUT / f"{index + 1}-compact.png")


def patch_chapter(source, nodes):
    def update(match):
        block = match.group()
        qid = QUEST_ID.search(block).group(1)
        node = nodes[qid]
        original_logic = FIELDS.sub("", block)
        eol = "\r\n" if "\r\n" in block else "\n"
        for field in ("shape", "size", "hide_dependent_lines"):
            block = re.sub(rf'(?m)^\t\t\t{field}: [^\r\n]*\r?\n', "", block)
        visual = (f'\t\t\tshape: "{node["shape"]}"{eol}' if node["shape"] else "")
        if node["size"] != 1:
            visual += f'\t\t\tsize: {node["size"]}d{eol}'
        if node["hide_dependent_lines"]:
            visual += f'\t\t\thide_dependent_lines: true{eol}'
        block = re.sub(r'(?m)^(\t\t\tid: "[0-9A-F]{16}"\r?\n)', lambda m: m.group() + visual, block, count=1)
        for axis in ("x", "y"):
            block, count = re.subn(rf'(?m)^(\t\t\t{axis}: )-?[\d.]+d(?=\r?$)',
                                  lambda m: m.group(1) + f'{node[axis]:.2f}d', block)
            if count != 1:
                raise ValueError(f"Missing {axis} in {qid}")
        if FIELDS.sub("", block) != original_logic:
            raise ValueError(f"Unexpected gameplay change in {qid}")
        return block
    return QUEST_BLOCK.sub(update, source)


def render_overview(reports):
    canvas = Image.new("RGB", (1980, 1500), "#101821")
    draw = ImageDraw.Draw(canvas)
    title = ImageFont.truetype("C:/Windows/Fonts/msyhbd.ttc", 38)
    font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 23)
    small = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 19)
    draw.text((32, 24), "创世之径 · 第 1–5 章任务布局", font=title, fill="#edf4f8")
    draw.text((32, 78), "主线分段折返，相关支线就近排列；以下为布局示意，游戏中保留原物品图标。", font=font, fill="#b5c5d0")
    for index, filename in enumerate(MAIN_FILES):
        x, y = 24 + (index % 3) * 652, 128 + (index // 3) * 658
        draw.rounded_rectangle((x, y, x + 632, y + 636), radius=16, fill="#18232d", outline="#354653", width=2)
        stats = reports[filename]
        draw.text((x + 20, y + 18), f"第 {index + 1} 章 · {TITLES[index]}", font=font, fill="#edf4f8")
        draw.text((x + 20, y + 55), f"{stats['after']['quests']} 个任务 · 主线 {stats['after']['mainline']} 个", font=small, fill="#a9bcc8")
        preview = Image.open(OUT / f"{index + 1}-compact.png")
        preview = preview.crop((190, 110, preview.width, preview.height - 45))
        preview = ImageOps.contain(preview, (594, 489), Image.Resampling.LANCZOS)
        canvas.paste(preview, (x + (632 - preview.width) // 2, y + 96 + (489 - preview.height) // 2))
        draw.text((x + 20, y + 599), f"主支线最长连线：{stats['before']['main_branch_max']:.2f} → {stats['after']['main_branch_max']:.2f}", font=small, fill="#b5d8c5")
    x, y = 1328, 786
    draw.rounded_rectangle((x, y, x + 632, y + 636), radius=16, fill="#18232d", outline="#354653", width=2)
    draw.text((x + 32, y + 40), "布局调整", font=title, fill="#edf4f8")
    lines = ["主线：大节点连续折返", "主支线连接：最长不超过 8.75 单位", "第四章：数据模型围绕入口成组", "第五章：创造物品在终点下方集中", "", "448 个任务保留原有 ID 与解锁关系", "原配置已备份；需重载游戏确认实机效果"]
    for number, line in enumerate(lines):
        draw.text((x + 32, y + 125 + number * 52), line, font=font if number < 4 else small, fill="#b9cbd6")
    canvas.save(OUT / "overview.png")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=("preview", "apply", "refresh", "check"))
    args = parser.parse_args()
    quests = read_chapters()
    errors = validate(quests)
    if errors:
        raise ValueError(errors)
    OUT.mkdir(parents=True, exist_ok=True)
    candidate_file = OUT / "candidate.json"
    if args.mode == "preview":
        candidate, reports = {}, {}
        for index, filename in enumerate(MAIN_FILES):
            chapter = {k: v for k, v in quests.items() if v["chapter"] == filename}
            nodes, path = layout(chapter, index)
            old = {k: {**v, "hide_dependent_lines": "hide_dependent_lines: true" in next(m.group() for m in QUEST_BLOCK.finditer((CHAPTERS / filename).read_text(encoding="utf-8")) if QUEST_ID.search(m.group()).group(1) == k)} for k, v in chapter.items()}
            stats = metrics(chapter, nodes, path)
            if stats["overlaps"]:
                raise ValueError(stats["overlaps"])
            if stats["main_branch_max"] > 8.75:
                raise ValueError(f"Main/branch connection too long: {filename}")
            candidate[filename] = nodes
            reports[filename] = {"before": metrics(chapter, old, path), "after": stats, "path": path}
            (OUT / f"{index + 1}-nodes.json").write_text(json.dumps(nodes, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            (OUT / f"{index + 1}-metrics.json").write_text(json.dumps(reports[filename], ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            render(index, chapter, nodes, path, stats)
            print(filename, json.dumps({"before": reports[filename]["before"], "after": stats}, ensure_ascii=False), flush=True)
        candidate_file.write_text(json.dumps(candidate, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        (OUT / "metrics.json").write_text(json.dumps(reports, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        render_overview(reports)
        return
    candidate = json.loads(candidate_file.read_text(encoding="utf-8"))
    for filename in MAIN_FILES:
        chapter = {k: v for k, v in quests.items() if v["chapter"] == filename}
        if set(candidate[filename]) != set(chapter):
            raise ValueError(f"Quest list changed since preview: {filename}")
        stats = metrics(chapter, candidate[filename], mainline_order(chapter, EXITS[MAIN_FILES.index(filename)]))
        if stats["overlaps"] or stats["main_branch_max"] > 8.75:
            raise ValueError(f"Invalid node clearance or long main/branch connection: {filename}")
    if args.mode in ("apply", "refresh"):
        active_backup = BACKUP if args.mode == "apply" else BACKUP.with_name(BACKUP.name + "-first-pass")
        if active_backup.exists():
            raise ValueError("Backup already exists; do not overwrite originals")
        active_backup.mkdir(parents=True)
        manifest = ROOT / "design/quest-layout.json"
        shutil.copy2(manifest, active_backup / manifest.name)
        for filename in MAIN_FILES:
            path = CHAPTERS / filename
            shutil.copy2(path, active_backup / filename)
            original = path.read_bytes().decode("utf-8")
            updated = patch_chapter(original, candidate[filename])
            path.write_bytes(updated.encode("utf-8"))
        manifest.write_text(candidate_file.read_text(encoding="utf-8"), encoding="utf-8")
        print("Applied visual fields only. Original chapter files and manifest backed up.")
    else:
        for filename in MAIN_FILES:
            original = (BACKUP / filename).read_bytes().decode("utf-8")
            current = (CHAPTERS / filename).read_bytes().decode("utf-8")
            if FIELDS.sub("", original) != FIELDS.sub("", current):
                raise ValueError(f"Non-visual changes found: {filename}")
            if patch_chapter(current, candidate[filename]) != current:
                raise ValueError(f"Manifest does not match SNBT: {filename}")
        print("PASS: 448 quest IDs, all dependencies/tasks/rewards and other gameplay fields unchanged; "
              "SNBT matches candidate; no node overlaps; main/branch connections <= 8.75 units.")


if __name__ == "__main__":
    main()
