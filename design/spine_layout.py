"""Lay out a two-row mainline with side quests kept outside the route."""

from __future__ import annotations

import argparse
import json
import math
import re
from collections import defaultdict
from itertools import combinations
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from audit_progression import CHAPTERS, MAIN_FILES, QUEST_BLOCK, QUEST_ID, ROOT, read_chapters
from evaluate_layout import intersects
from rebuild_layout import EXITS, depths, spine


MANIFEST_PATH = ROOT / "design/quest-layout.json"
CANDIDATE_PATH = ROOT / "design/quest-layout-mainline-candidate.json"
PREVIEW_DIR = ROOT / "design/previews"
BACKUP_PATH = ROOT / "design/backups/quest-layout-before-spine-2026-09-29.json"


def mainline_order(chapter: dict[str, dict], exit_prefix: str) -> list[str]:
    rank = depths(chapter)
    current = next(quest_id for quest_id in chapter if quest_id.startswith(exit_prefix))
    reverse_path = [current]
    while True:
        parents = [parent for parent in chapter[current]["dependencies"] if parent in chapter]
        if not parents:
            return list(reversed(reverse_path))
        current = max(parents, key=lambda parent: (rank[parent], parent))
        reverse_path.append(current)


def isotonic(values: list[float]) -> list[float]:
    """Least-squares nondecreasing fit, used to separate nodes in a row."""
    blocks: list[list[float | int]] = []
    for index, value in enumerate(values):
        blocks.append([index, index + 1, float(value), 1])
        while len(blocks) >= 2 and blocks[-2][2] / blocks[-2][3] > blocks[-1][2] / blocks[-1][3]:
            right = blocks.pop()
            left = blocks.pop()
            blocks.append([left[0], right[1], left[2] + right[2], left[3] + right[3]])
    result = [0.0] * len(values)
    for start, end, total, count in blocks:
        result[int(start):int(end)] = [float(total) / int(count)] * (int(end) - int(start))
    return result


def branch_components(chapter: dict[str, dict], mainline: set[str]) -> list[set[str]]:
    off_spine = set(chapter) - mainline
    adjacent = {quest_id: set() for quest_id in off_spine}
    for child, quest in chapter.items():
        for parent in quest["dependencies"]:
            if parent in off_spine and child in off_spine:
                adjacent[parent].add(child)
                adjacent[child].add(parent)
    components: list[set[str]] = []
    unseen = set(off_spine)
    while unseen:
        root = unseen.pop()
        component = {root}
        pending = [root]
        while pending:
            quest_id = pending.pop()
            for neighbor in adjacent[quest_id] & unseen:
                unseen.remove(neighbor)
                component.add(neighbor)
                pending.append(neighbor)
        components.append(component)
    return components


def build_layout(chapter: dict[str, dict], styles: dict[str, dict], chapter_index: int) -> tuple[dict, set[str]]:
    """Place the longest dependency path in two rows; place branches outward."""
    mainline = spine(chapter, depths(chapter), EXITS[chapter_index])
    path = mainline_order(chapter, EXITS[chapter_index])
    if set(path) != mainline:
        raise ValueError(f"Mainline order does not match spine in Chapter {chapter_index + 1}")

    # Two equal-width passes make the primary route easy to follow at map scale.
    split = (len(path) + 1) // 2
    top_count, bottom_count = split, len(path) - split
    step = 5.0
    top_x = [(index - (top_count - 1) / 2) * step for index in range(top_count)]
    bottom_x = []
    if bottom_count:
        left, right = top_x[0], top_x[-1]
        bottom_x = [right - (right - left) * index / max(1, bottom_count - 1)
                    for index in range(bottom_count)]

    mainline_row: dict[str, str] = {}
    mainline_x: dict[str, float] = {}
    positions: dict[str, dict] = {}
    for index, quest_id in enumerate(path):
        if index < split:
            mainline_row[quest_id] = "top"
            mainline_x[quest_id] = top_x[index]
            y = -18.0
        else:
            mainline_row[quest_id] = "bottom"
            mainline_x[quest_id] = bottom_x[index - split]
            y = 18.0
        positions[quest_id] = {**styles[quest_id], "x": round(mainline_x[quest_id], 2), "y": y}

    off_spine = set(chapter) - mainline
    components = branch_components(chapter, mainline)
    component_of = {quest_id: index for index, component in enumerate(components) for quest_id in component}
    component_side: list[str] = []
    for component in components:
        attached_rows = {
            mainline_row[parent]
            for quest_id in component
            for parent in chapter[quest_id]["dependencies"]
            if parent in mainline
        }
        if attached_rows == {"top"}:
            side = "top"
        elif attached_rows == {"bottom"}:
            side = "bottom"
        elif attached_rows:
            side = "center"
        else:
            side = "top"
        component_side.append(side)

    # A branch inherits its horizontal anchor from its mainline entry task.
    anchors: dict[str, float] = {}

    def anchor(quest_id: str, active: set[str] | None = None) -> float:
        if quest_id in mainline:
            return mainline_x[quest_id]
        if quest_id in anchors:
            return anchors[quest_id]
        active = set() if active is None else active
        if quest_id in active:
            raise ValueError(f"Cycle while anchoring {quest_id}")
        active.add(quest_id)
        main_parents = [parent for parent in chapter[quest_id]["dependencies"] if parent in mainline]
        branch_parents = [parent for parent in chapter[quest_id]["dependencies"] if parent in off_spine]
        if main_parents:
            value = sum(mainline_x[parent] for parent in main_parents) / len(main_parents)
        elif branch_parents:
            value = sum(anchor(parent, active) for parent in branch_parents) / len(branch_parents)
        else:
            value = top_x[0] - step
        active.remove(quest_id)
        anchors[quest_id] = value
        return value

    branch_depth: dict[str, int] = {}

    def depth(quest_id: str, active: set[str] | None = None) -> int:
        if quest_id in mainline:
            return 0
        if quest_id in branch_depth:
            return branch_depth[quest_id]
        active = set() if active is None else active
        if quest_id in active:
            raise ValueError(f"Cycle while placing {quest_id}")
        active.add(quest_id)
        parents = [parent for parent in chapter[quest_id]["dependencies"] if parent in chapter]
        parent_depths = [1 if parent in mainline else depth(parent, active) + 1 for parent in parents]
        active.remove(quest_id)
        branch_depth[quest_id] = max(parent_depths, default=1)
        return branch_depth[quest_id]

    # Central islands are only for branches that enter from both mainline rows.
    center_depths = [depth(quest_id) for quest_id in off_spine
                     if component_side[component_of[quest_id]] == "center"]
    center_slots = [0.0]
    for index in range(1, max(center_depths, default=1)):
        distance = 3.0 * ((index + 1) // 2)
        center_slots.append(distance if index % 2 else -distance)

    rows: dict[tuple[str, int], list[str]] = defaultdict(list)
    for quest_id in off_spine:
        side = component_side[component_of[quest_id]]
        rows[(side, depth(quest_id))].append(quest_id)

    for (side, level), quest_ids in rows.items():
        quest_ids.sort(key=lambda quest_id: (anchor(quest_id), quest_id))
        ideal = [anchor(quest_id) for quest_id in quest_ids]
        gaps = [0.0]
        for left, right in zip(quest_ids, quest_ids[1:]):
            left_size = float(styles[left].get("size", 1.0))
            right_size = float(styles[right].get("size", 1.0))
            gaps.append(gaps[-1] + max(3.0, (left_size + right_size) / 2 + 1.25))
        fitted = isotonic([target - gap for target, gap in zip(ideal, gaps)])
        if side == "top":
            y = -18.0 - (7.0 + (level - 1) * 3.8)
        elif side == "bottom":
            y = 18.0 + (7.0 + (level - 1) * 3.8)
        else:
            y = center_slots[level - 1]
        for index, quest_id in enumerate(quest_ids):
            positions[quest_id] = {
                **styles[quest_id],
                "x": round(fitted[index] + gaps[index], 2),
                "y": round(y, 2),
            }

    if set(positions) != set(chapter):
        raise ValueError(f"Layout is missing quests in Chapter {chapter_index + 1}")
    return positions, mainline


def metrics(chapter: dict[str, dict], positions: dict[str, dict], mainline: set[str]) -> dict:
    edges = [(parent, child) for child, quest in chapter.items()
             for parent in quest["dependencies"] if parent in chapter]
    shown = [(parent, child) for parent, child in edges if parent in mainline]
    lines = [(parent, child, (positions[parent]["x"], positions[parent]["y"]),
              (positions[child]["x"], positions[child]["y"])) for parent, child in shown]
    crossings = 0
    for first, second in combinations(lines, 2):
        p1, c1, a, b = first
        p2, c2, c, d = second
        if len({p1, c1, p2, c2}) == 4 and intersects(a, b, c, d):
            crossings += 1
    overlaps = []
    ids = list(positions)
    for index, left in enumerate(ids):
        for right in ids[index + 1:]:
            a, b = positions[left], positions[right]
            separation = (float(a.get("size", 1.0)) + float(b.get("size", 1.0))) / 2 + 0.75
            if abs(a["x"] - b["x"]) < separation and abs(a["y"] - b["y"]) < separation:
                overlaps.append((left, right))
    return {"edges": len(edges), "visible": len(shown), "folded": len(edges) - len(shown),
            "crossings": crossings, "overlaps": overlaps}


def render(chapter_number: int, chapter: dict[str, dict], positions: dict[str, dict],
           mainline: set[str], stats: dict) -> None:
    width, height = 2000, 1290
    image = Image.new("RGB", (width, height), "#101721")
    draw = ImageDraw.Draw(image)
    regular = "C:/Windows/Fonts/msyh.ttc"
    bold = "C:/Windows/Fonts/msyhbd.ttc"

    def font(size: int, strong: bool = False):
        path = bold if strong and Path(bold).exists() else regular
        return ImageFont.truetype(path, size)

    for x in range(0, width, 48):
        draw.line((x, 0, x, height), fill="#141e29")
    for y in range(0, height, 48):
        draw.line((0, y, width, y), fill="#141e29")
    draw.rounded_rectangle((38, 30, 1962, 144), radius=22, fill="#182330", outline="#344557", width=2)
    draw.text((70, 48), f"第 {chapter_number} 章：同色连线布局预览", font=font(42, True), fill="#edf4f8")
    draw.text((72, 101), f"{len(chapter)} 个任务 · 连线统一显示 · 主线靠连续折返路径辨认", font=font(23), fill="#aabac8")

    box_x, box_y, box_w, box_h = 38, 168, 1270, 1055
    draw.rounded_rectangle((box_x, box_y, box_x + box_w, box_y + box_h), radius=22,
                           fill="#182330", outline="#344557", width=2)
    map_x, map_y, map_w, map_h = box_x + 24, box_y + 24, 1222, 1008
    draw.rounded_rectangle((map_x, map_y, map_x + map_w, map_y + map_h), radius=16,
                           fill="#111a24", outline="#2c3c4b", width=2)
    for grid_x in range(map_x + 28, map_x + map_w, 44):
        draw.line((grid_x, map_y + 1, grid_x, map_y + map_h - 1), fill="#1a2733")
    for grid_y in range(map_y + 28, map_y + map_h, 44):
        draw.line((map_x + 1, grid_y, map_x + map_w - 1, grid_y), fill="#1a2733")

    min_x = min(node["x"] for node in positions.values()) - 4
    max_x = max(node["x"] for node in positions.values()) + 4
    min_y = min(node["y"] for node in positions.values()) - 4
    max_y = max(node["y"] for node in positions.values()) + 4
    unit = min((map_w - 90) / (max_x - min_x), (map_h - 90) / (max_y - min_y))
    used_w, used_h = (max_x - min_x) * unit, (max_y - min_y) * unit
    offset_x, offset_y = map_x + (map_w - used_w) / 2, map_y + (map_h - used_h) / 2
    points = {quest_id: (offset_x + (node["x"] - min_x) * unit,
                         offset_y + (node["y"] - min_y) * unit)
              for quest_id, node in positions.items()}

    # Every connector has the same color. Only the folded branch-source edges are omitted.
    for child, quest in chapter.items():
        for parent in quest["dependencies"]:
            if parent in mainline:
                x1, y1 = points[parent]
                x2, y2 = points[child]
                draw.line((x1, y1, x2, y2), fill="#55c879", width=3)

    for quest_id, node in positions.items():
        x, y = points[quest_id]
        size = float(node.get("size", 1.0))
        radius = max(5, size * 6.5)
        shape = node.get("shape", "")
        fill, outline = "#1b3029", "#55c879"
        line_width = 3 if quest_id in mainline else 2
        if shape == "rsquare":
            draw.rounded_rectangle((x - radius, y - radius, x + radius, y + radius),
                                   radius=max(2, radius / 4), fill=fill, outline=outline, width=line_width)
        elif shape in ("gear", "pentagon", "diamond"):
            sides = 16 if shape == "gear" else (5 if shape == "pentagon" else 4)
            polygon = []
            for index in range(sides):
                angle = math.tau * index / sides - math.pi / 2
                factor = 0.78 if shape == "gear" and index % 2 else 1.0
                polygon.append((x + math.cos(angle) * radius * factor,
                                y + math.sin(angle) * radius * factor))
            draw.polygon(polygon, fill=fill)
            draw.line(polygon + [polygon[0]], fill=outline, width=line_width, joint="curve")
        else:
            draw.ellipse((x - radius, y - radius, x + radius, y + radius),
                         fill=fill, outline=outline, width=line_width)

    info_x, info_y, info_w, info_h = 1334, box_y, 628, box_h
    draw.rounded_rectangle((info_x, info_y, info_x + info_w, info_y + info_h), radius=22,
                           fill="#182330", outline="#344557", width=2)
    draw.text((info_x + 32, info_y + 32), "不靠连线高光区分主线", font=font(29, True), fill="#edf4f8")
    draw.line((info_x + 30, info_y + 86, info_x + info_w - 30, info_y + 86), fill="#344557", width=2)
    instructions = [
        "上排从左到右，沿右侧转入下排，",
        "下排再从右到左走完主线。",
        "",
        f"主线任务：{len(mainline)} 个",
        f"当前常显连线：{stats['visible']} 条",
        f"支线后续连线折叠：{stats['folded']} 条",
        "",
        "支线入口仍连接主线；支线内部",
        "的后续线路悬停对应任务再展开。",
    ]
    y = info_y + 116
    for line in instructions:
        draw.text((info_x + 40, y), line, font=font(20 if line else 12, bool(line and line.endswith("："))),
                  fill="#d0dce4" if line else "#d0dce4")
        y += 38 if line else 18
    draw.rounded_rectangle((info_x + 30, info_y + 580, info_x + info_w - 30, info_y + info_h - 28),
                           radius=16, fill="#222f39")
    draw.text((info_x + 52, info_y + 604), "主线识别点", font=font(20, True), fill="#c9d7e0")
    draw.text((info_x + 52, info_y + 651), "主线节点用方形/章节造型，尺寸更大；", font=font(18), fill="#b5c3cc")
    draw.text((info_x + 52, info_y + 690), "支线节点保持圆形并排在主线外侧。", font=font(18), fill="#b5c3cc")
    draw.text((info_x + 52, info_y + 746), "预览中的所有连线同色，模拟游戏视图。", font=font(18), fill="#b5c3cc")
    draw.text((info_x + 52, info_y + 784), "实际线路颜色仍由任务状态决定。", font=font(18), fill="#b5c3cc")
    draw.text((48, 1246), f"静态检查：可见连线交叉 {stats['crossings']}；节点重叠 {len(stats['overlaps'])}。", 
              font=font(19), fill="#8fa1ae")

    output = PREVIEW_DIR / f"{chapter_number}-mainline-preview.png"
    image.save(output, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=("preview", "apply"))
    args = parser.parse_args()
    quests = read_chapters()
    current_manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    candidate = {key: dict(value) for key, value in current_manifest.items()}
    summaries = []
    for index, filename in enumerate(MAIN_FILES):
        chapter = {quest_id: quest for quest_id, quest in quests.items() if quest["chapter"] == filename}
        styles = {quest_id: current_manifest[filename][quest_id] for quest_id in chapter}
        positions, mainline = build_layout(chapter, styles, index)
        stats = metrics(chapter, positions, mainline)
        if stats["overlaps"]:
            raise ValueError(f"Chapter {index + 1} has overlapping nodes: {stats['overlaps'][:5]}")
        candidate[filename] = positions | {key: value for key, value in current_manifest[filename].items()
                                            if key not in chapter}
        render(index + 1, chapter, positions, mainline, stats)
        summaries.append((index + 1, len(chapter), len(mainline), stats))

    CANDIDATE_PATH.write_text(json.dumps(candidate, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for index, count, main_count, stats in summaries:
        print(f"Chapter {index}: tasks={count}, mainline={main_count}, visible={stats['visible']}, "
              f"folded={stats['folded']}, crossings={stats['crossings']}, overlaps={len(stats['overlaps'])}")
    print(f"Candidate manifest: {CANDIDATE_PATH}")

    if args.mode == "apply":
        if not BACKUP_PATH.exists():
            BACKUP_PATH.parent.mkdir(parents=True, exist_ok=True)
            BACKUP_PATH.write_bytes(MANIFEST_PATH.read_bytes())
        for filename in MAIN_FILES:
            path = CHAPTERS / filename
            raw = path.read_bytes()
            text = raw.decode("utf-8")
            edits = []
            for match in QUEST_BLOCK.finditer(text):
                block = match.group()
                quest_id = QUEST_ID.search(block).group(1)
                node = candidate[filename].get(quest_id)
                if not node:
                    continue
                updated = block
                for axis in ("x", "y"):
                    updated, count = re.subn(
                        rf"(?m)^(\t\t\t{axis}: )-?[\d.]+d(?=\r?$)",
                        lambda found: found.group(1) + f"{node[axis]:.2f}d",
                        updated,
                    )
                    if count != 1:
                        raise ValueError(f"Expected one {axis} coordinate in {filename}:{quest_id}")
                edits.append((match.start(), match.end(), updated))
            for start, end, updated in reversed(edits):
                text = text[:start] + updated + text[end:]
            path.write_bytes(text.encode("utf-8"))
        MANIFEST_PATH.write_text(CANDIDATE_PATH.read_text(encoding="utf-8"), encoding="utf-8")
        print("Applied coordinates; quest IDs, dependencies, tasks, rewards, and line visibility fields were preserved.")


if __name__ == "__main__":
    main()
