"""Plan, render, and apply a new top-down layout for quest chapters 1–5."""

from __future__ import annotations

import argparse
import json
import math
import re
from collections import defaultdict

from audit_progression import CHAPTERS, MAIN_FILES, QUEST_BLOCK, QUEST_ID, ROOT, read_chapters, validate


EXITS = ["2ABCB6", "6AA429", "28147A", "681912", "2B9722"]
MILESTONES = [
    {"3EDAA2": (2.0, "pentagon"), "002125": (2.0, "diamond"), "454676": (2.0, "gear"),
     "1D0AC5": (2.0, "gear"), "2AC0DE": (2.0, "gear"), "651986": (2.0, "gear"),
     "180E89": (2.5, "diamond"), "2ABCB6": (2.5, "pentagon")},
    {"6AF2EC": (2.0, "pentagon"), "14FA88": (2.0, "gear"), "7BFB44": (2.0, "gear"),
     "48143F": (2.0, "gear"), "1E064E": (2.0, "gear"), "536D18": (2.0, "gear"),
     "7C3401": (2.0, "diamond"), "6AA429": (2.5, "pentagon")},
    {"355A5C": (2.0, "pentagon"), "5B1046": (2.0, "gear"), "7D6B41": (2.0, "gear"),
     "600342": (2.0, "gear"), "50BAE0": (2.0, "diamond"), "39C66C": (2.0, "gear"),
     "30C1C5": (2.0, "gear"), "6662A1": (2.0, "gear"), "5E81D8": (2.5, "gear"),
     "7B8A74": (3.0, "diamond"), "28147A": (2.5, "pentagon")},
    {"2BC011": (2.0, "pentagon"), "38AA3A": (1.5, "gear"), "3B5276": (2.0, "diamond"),
     "56B1B6": (2.0, "gear"), "2E3EB6": (2.0, "gear"), "35C3C6": (2.0, "gear"),
     "6927F4": (2.0, "gear"), "523053": (2.0, "gear"), "410253": (2.0, "gear"),
     "3BC498": (3.0, "diamond"), "681912": (2.5, "pentagon"),
     "34ED20": (2.0, "diamond")},
    {"360B7C": (2.0, "pentagon"), "2DA877": (2.0, "gear"), "79EE25": (2.0, "gear"),
     "15C325": (2.0, "gear"), "4D2988": (2.0, "gear"), "557AF5": (2.0, "gear"),
     "28D8B4": (2.5, "gear"), "3446EC": (2.5, "diamond"), "0BFA4B": (3.0, "diamond"),
     "2B9722": (3.0, "pentagon")},
]
LEFT_NAMESPACES = [
    {"minecraft", "mysticalagriculture", "alltheores", "silentgear"},
    {"industrialforegoing", "mob_grinding_utils", "aether", "mysticalagriculture", "pylons"},
    {"occultism", "oritech", "mysticalagriculture", "alltheores"},
    {"stellaris", "industrialforegoing", "justdirethings", "mysticalagriculture", "allthemodium"},
    {"mekanism", "mekmm", "rain", "industrialforegoing"},
]
RIGHT_NAMESPACES = [
    {"create", "ftbfiltersystem", "actuallyadditions", "ae2"},
    {"ae2", "enderio", "actuallyadditions", "solarflux", "dailyshop"},
    {"naturesaura", "ars_nouveau", "draconicevolution", "ars_caelum"},
    {"hostilenetworks", "powah", "oritech", "solarflux"},
    {"avaritia", "ae2", "draconicevolution", "extendedcrafting"},
]


def resolve(prefix: str, chapter: dict[str, dict]) -> str:
    matches = [quest_id for quest_id in chapter if quest_id.startswith(prefix)]
    if len(matches) != 1:
        raise ValueError(f"Expected one quest for {prefix}, found {matches}")
    return matches[0]


def depths(chapter: dict[str, dict]) -> dict[str, int]:
    memo = {}

    def depth(quest_id: str) -> int:
        if quest_id not in memo:
            parents = [dep for dep in chapter[quest_id]["dependencies"] if dep in chapter]
            memo[quest_id] = max((depth(dep) + 1 for dep in parents), default=0)
        return memo[quest_id]

    for quest_id in chapter:
        depth(quest_id)
    return memo


def spine(chapter: dict[str, dict], rank: dict[str, int], exit_prefix: str) -> set[str]:
    result = set()
    current = resolve(exit_prefix, chapter)
    while True:
        result.add(current)
        parents = [dep for dep in chapter[current]["dependencies"] if dep in chapter]
        if not parents:
            return result
        current = max(parents, key=lambda dep: (rank[dep], dep))


def node_role(quest_id: str, main: set[str], milestone: dict[str, tuple[float, str]]) -> dict:
    selected = next((style for prefix, style in milestone.items() if quest_id.startswith(prefix)), None)
    if selected:
        size, shape = selected
        role = "milestone"
    elif quest_id in main:
        size, shape, role = 1.5, "rsquare", "main"
    else:
        size, shape, role = 1.0, "", "branch"
    return {"size": size, "shape": shape, "role": role}


def preferred_side(quest_id: str, chapter: dict[str, dict], placed: dict[str, dict], chapter_index: int) -> int:
    parents = [placed[dep]["x"] for dep in chapter[quest_id]["dependencies"] if dep in placed and "x" in placed[dep] and abs(placed[dep]["x"]) > 3]
    if parents and all(value * parents[0] > 0 for value in parents):
        return -1 if parents[0] < 0 else 1
    item = next(iter(chapter[quest_id]["task_items"]), "")
    namespace = item.split(":", 1)[0]
    if namespace in LEFT_NAMESPACES[chapter_index]:
        return -1
    if namespace in RIGHT_NAMESPACES[chapter_index]:
        return 1
    return -1 if int(quest_id[-1], 16) % 2 == 0 else 1


def plan_chapter(chapter: dict[str, dict], chapter_index: int) -> dict[str, dict]:
    rank = depths(chapter)
    main = spine(chapter, rank, EXITS[chapter_index])
    placed = {quest_id: node_role(quest_id, main, MILESTONES[chapter_index]) for quest_id in chapter}
    total_levels = max(rank.values()) + 1
    row_count = 3 if total_levels <= 21 else 4
    row_length, step_x, step_y = math.ceil(total_levels / row_count), 7.5, 18.0
    row_origin = (row_length - 1) * step_x / 2

    def anchor(level: int) -> tuple[float, float]:
        row, column = divmod(level, row_length)
        direction = 1 if row % 2 == 0 else -1
        x = -row_origin + column * step_x if direction == 1 else row_origin - column * step_x
        return x, row * step_y + (0.8 if column % 3 == 1 else -0.6 if column % 3 == 2 else 0.0)

    for quest_id in main:
        x, y = anchor(rank[quest_id])
        placed[quest_id].update(x=x, y=y)
    special = set()
    if chapter_index == 3:
        tutorial = resolve("38AA3A", chapter)
        collection = resolve("3B5276", chapter)
        legacy = resolve("34ED20", chapter)
        placed[tutorial].update(x=-32.0, y=4.0, role="tutorial")
        placed[collection].update(x=-32.0, y=9.0, role="collection")
        placed[legacy].update(x=-30.0, y=-6.0, role="legacy")
        special.update((tutorial, collection, legacy))
        models = sorted(
            quest_id for quest_id, quest in chapter.items()
            if quest_id not in special and quest["task_items"] == ["hostilenetworks:data_model"]
            and quest["dependencies"] == [tutorial]
        )
        for index, quest_id in enumerate(models):
            placed[quest_id].update(x=-37.0 + (index % 3) * 5.0, y=14.0 + (index // 3) * 4.0, role="model")
            special.add(quest_id)
    levels = defaultdict(list)
    for quest_id in chapter:
        if quest_id not in special and quest_id not in main:
            levels[rank[quest_id]].append(quest_id)
    for level in sorted(levels):
        center_x, center_y = anchor(level)
        for quest_id in sorted(levels[level], key=lambda item: (preferred_side(item, chapter, placed, chapter_index), item)):
            parents = [placed[dep] for dep in chapter[quest_id]["dependencies"] if dep in placed and "x" in placed[dep]]
            branch_parents = [parent for parent in parents if parent["role"] == "branch"]
            side = preferred_side(quest_id, chapter, placed, chapter_index)
            if branch_parents:
                parent_level = min((rank[dep] for dep in chapter[quest_id]["dependencies"] if dep in chapter), default=level - 1)
                parent_row = anchor(parent_level)[1]
                side = -1 if branch_parents[0]["y"] < parent_row else 1
            offsets = [0, -3.5, 3.5, -7.0, 7.0, -10.5, 10.5, -14.0, 14.0, -17.5, 17.5]
            viable = []
            for direction in (side, -side):
                for distance_y in (3.75, 6.75):
                    y = center_y + direction * distance_y
                    for offset_x in offsets:
                        x = center_x + offset_x
                        if any(abs(x - node["x"]) < (placed[quest_id]["size"] + node["size"]) / 2 + 1.25
                               and abs(y - node["y"]) < (placed[quest_id]["size"] + node["size"]) / 2 + 1.25
                               for other_id, node in placed.items() if other_id != quest_id and "x" in node):
                            continue
                        parent_distance = min((math.hypot(x - parent["x"], y - parent["y"]) for parent in parents), default=0)
                        score = abs(offset_x) * 0.45 + distance_y * 0.35 + parent_distance * 0.25
                        if direction != side:
                            score += 4.0
                        viable.append((score, x, y))
            if not viable:
                for direction in (side, -side):
                    for distance_y in (9.75, 12.75):
                        y = center_y + direction * distance_y
                        for offset_x in offsets:
                            x = center_x + offset_x
                            if any(abs(x - node["x"]) < (placed[quest_id]["size"] + node["size"]) / 2 + 1.25
                                   and abs(y - node["y"]) < (placed[quest_id]["size"] + node["size"]) / 2 + 1.25
                                   for other_id, node in placed.items() if other_id != quest_id and "x" in node):
                                continue
                            viable.append((100 + abs(offset_x) + distance_y, x, y))
            if not viable:
                raise ValueError(f"No free lane for {quest_id} at rank {level}")
            _, x, y = min(viable)
            placed[quest_id].update(x=x, y=y)
    if len(placed) != len(chapter) or any("x" not in node for node in placed.values()):
        raise ValueError("Unplaced quest")
    for quest_id, quest in chapter.items():
        if quest["shape"] == "heart" and placed[quest_id]["role"] == "branch":
            placed[quest_id].update(shape="heart", size=quest["size"])
    if chapter_index in (0, 2):
        for node in placed.values():
            node["x"] = round(node["x"] * 1.2, 2)
    return placed


def verify_layout(chapter: dict[str, dict], placed: dict[str, dict]) -> None:
    for quest_id, quest in chapter.items():
        node = placed[quest_id]
        for other_id, other in placed.items():
            if other_id <= quest_id:
                continue
            if abs(node["x"] - other["x"]) < (node["size"] + other["size"]) / 2 + 1.0 and \
               abs(node["y"] - other["y"]) < (node["size"] + other["size"]) / 2 + 1.0:
                raise ValueError(f"Quest overlap: {quest_id} and {other_id}")


def render(chapter: dict[str, dict], placed: dict[str, dict], number: int) -> None:
    from PIL import Image, ImageDraw, ImageFont

    scale = 22
    min_x = min(node["x"] - node["size"] / 2 for node in placed.values()) - 4
    max_x = max(node["x"] + node["size"] / 2 for node in placed.values()) + 10
    min_y = min(node["y"] - node["size"] / 2 for node in placed.values()) - 4
    max_y = max(node["y"] + node["size"] / 2 for node in placed.values()) + 4
    width, height = int((max_x - min_x) * scale), int((max_y - min_y) * scale)
    image = Image.new("RGB", (width, height), "#101a24")
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 13)
    points = {quest_id: ((node["x"] - min_x) * scale, (node["y"] - min_y) * scale)
              for quest_id, node in placed.items()}
    main = spine(chapter, depths(chapter), EXITS[number - 1])
    for quest_id, quest in chapter.items():
        for dep in quest["dependencies"]:
            if dep in chapter:
                color = "#b49258" if quest_id in main and dep in main else "#425969"
                draw.line((*points[dep], *points[quest_id]), fill=color, width=3 if color == "#b49258" else 1)
    for quest_id, quest in chapter.items():
        node = placed[quest_id]
        x, y = points[quest_id]
        radius = node["size"] * 9
        color = "#cda55c" if node["role"] == "milestone" else "#68c9c9" if node["role"] == "main" else "#4e8491"
        if node["role"] in ("model", "legacy"):
            color = "#987ac3"
        outline_width = 3 if node["size"] >= 2 else 2
        if node["shape"] in ("diamond", "pentagon", "gear"):
            sides = {"diamond": 4, "pentagon": 5, "gear": 16}[node["shape"]]
            polygon_points = []
            for index in range(sides):
                angle = math.pi * 2 * index / sides - math.pi / 2
                length = radius * (0.82 if node["shape"] == "gear" and index % 2 else 1)
                polygon_points.append((x + math.cos(angle) * length, y + math.sin(angle) * length))
            draw.polygon(polygon_points, fill="#21404f", outline=color, width=outline_width)
        elif node["shape"] == "rsquare":
            draw.rounded_rectangle((x-radius, y-radius, x+radius, y+radius), radius=radius / 3,
                                   fill="#21404f", outline=color, width=outline_width)
        else:
            draw.ellipse((x-radius, y-radius, x+radius, y+radius), fill="#21404f", outline=color, width=outline_width)
        if node["role"] not in ("main", "milestone", "tutorial", "collection", "legacy"):
            continue
        label = quest["title"] or (quest["task_items"][0].split(":")[-1] if quest["task_items"] else quest_id[:6])
        if len(label) > 13:
            label = label[:12] + "…"
        draw.text((x+radius+3, y-7), label, fill="#d8e3e6", font=font)
    output = ROOT / "design/previews" / f"{number}-candidate.png"
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output)
    print(f"Rendered {output.relative_to(ROOT)}: {width}x{height}")


def apply_block(block: str, node: dict) -> str:
    newline = "\r\n" if "\r\n" in block else "\n"
    for axis in ("x", "y"):
        block, count = re.subn(rf"(?m)^(\t\t\t{axis}: )-?[\d.]+d(?=\r?$)",
                               lambda match: match.group(1) + f"{node[axis]:.2f}d", block)
        if count != 1:
            raise ValueError(f"Missing coordinate {axis}")
    block = re.sub(r'(?m)^\t\t\t(?:shape: "[^"]*"|size: [\d.]+d)\r?\n', "", block)
    visual = ""
    if node["shape"]:
        visual += f'\t\t\tshape: "{node["shape"]}"{newline}'
    if node["size"] != 1.0:
        visual += f'\t\t\tsize: {node["size"]:.1f}d{newline}'
    block, count = re.subn(r"(?m)^\t\t\ttasks: ", lambda _: visual + "\t\t\ttasks: ", block, count=1)
    if count != 1:
        raise ValueError("Missing tasks in quest block")
    return block


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=("plan", "apply", "verify"))
    args = parser.parse_args()
    quests = read_chapters()
    errors = validate(quests)
    if errors:
        raise ValueError("; ".join(errors))
    manifest_path = ROOT / "design/quest-layout.json"
    if args.mode == "plan":
        manifest = {}
        for index, filename in enumerate(MAIN_FILES):
            chapter = {quest_id: quest for quest_id, quest in quests.items() if quest["chapter"] == filename}
            placed = plan_chapter(chapter, index)
            verify_layout(chapter, placed)
            render(chapter, placed, index + 1)
            manifest[filename] = placed
            print(f"Planned {filename}: {len(chapter)} quests, {max(node['y'] for node in placed.values()):.0f} units high")
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        return
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    for filename in MAIN_FILES:
        chapter = {quest_id: quest for quest_id, quest in quests.items() if quest["chapter"] == filename}
        placed = manifest[filename]
        if set(placed) != set(chapter):
            raise ValueError(f"Manifest IDs do not match {filename}")
        verify_layout(chapter, placed)
        path = CHAPTERS / filename
        if args.mode == "apply":
            source = path.read_bytes().decode("utf-8-sig")
            edits = []
            for match in QUEST_BLOCK.finditer(source):
                block = match.group()
                quest_id = QUEST_ID.search(block).group(1)
                edits.append((match.start(), match.end(), apply_block(block, placed[quest_id])))
            for start, end, replacement in reversed(edits):
                source = source[:start] + replacement + source[end:]
            path.write_bytes(source.encode("utf-8"))
        else:
            for quest_id, quest in chapter.items():
                node = placed[quest_id]
                if any(not math.isclose(quest[key], node[key], abs_tol=0.001) for key in ("x", "y", "size")) or \
                   quest["shape"] != node["shape"]:
                    raise ValueError(f"Layout mismatch: {quest_id}")
        print(f"{args.mode}: {filename}: {len(chapter)} quests")


if __name__ == "__main__":
    main()
