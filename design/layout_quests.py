"""Preview and apply collision-free FTB Quest coordinates without changing quest logic."""

from __future__ import annotations

import argparse
import json
import math
import re
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
QUESTS = ROOT / "config/ftbquests/quests/chapters"
FILES = [
    "1111.snbt",
    "149B7FC09F5F2520.snbt",
    "66900C421E317CA4.snbt",
    "1F9CADE08E41FAE2.snbt",
    "1306DE3D8C100552.snbt",
]
QUEST_BLOCK = re.compile(r"(?ms)^\t\t\{\r?\n.*?^\t\t\}")
ID = re.compile(r'(?m)^\t\t\tid: "([0-9A-F]{16})"\r?$')
COORD = re.compile(r"(?m)^(\t\t\t)(x|y): (-?\d+(?:\.\d+)?)d(\r?)$")
SIZE = re.compile(r"(?m)^\t\t\tsize: (\d+(?:\.\d+)?)d\r?$")
DEP = re.compile(r"(?ms)^\t\t\tdependencies: \[([^]]*)\]")


def read_chapter(path: Path) -> tuple[str, dict[str, dict]]:
    source = path.read_bytes().decode("utf-8-sig")
    quests = {}
    for match in QUEST_BLOCK.finditer(source):
        block = match.group()
        quest_id = ID.search(block)
        coords = {key: float(number) for _, key, number, _ in COORD.findall(block)}
        if not quest_id or set(coords) != {"x", "y"}:
            raise ValueError(f"Cannot parse quest block in {path.name} at {match.start()}")
        if quest_id.group(1) in quests:
            raise ValueError(f"Duplicate quest ID in {path.name}: {quest_id.group(1)}")
        dep = DEP.search(block)
        quests[quest_id.group(1)] = {
            "span": match.span(),
            "block": block,
            "x": coords["x"],
            "y": coords["y"],
            "size": float(SIZE.search(block).group(1)) if SIZE.search(block) else 1.0,
            "dependencies": re.findall(r'"([0-9A-F]{16})"', dep.group(1)) if dep else [],
        }
    if not quests:
        raise ValueError(f"No quests found in {path.name}")
    return source, quests


def collides(x: float, y: float, size: float, placed: dict[str, dict]) -> bool:
    return any(
        abs(x - other["x"]) < (size + other["size"]) / 2 + 0.5
        and abs(y - other["y"]) < (size + other["size"]) / 2 + 0.5
        for other in placed.values()
    )


def layout(quests: dict[str, dict]) -> dict[str, dict]:
    internal = set(quests)
    child_counts = {quest_id: 0 for quest_id in quests}
    for quest in quests.values():
        for dep in quest["dependencies"]:
            if dep in internal:
                child_counts[dep] += 1
    isolated = {
        quest_id for quest_id, quest in quests.items()
        if not quest["dependencies"] and child_counts[quest_id] == 0
    }

    # Preserve prominent nodes and branch junctions before moving small satellites.
    order = sorted(
        internal - isolated,
        key=lambda quest_id: (
            -quests[quest_id]["size"],
            -child_counts[quest_id],
            quests[quest_id]["x"],
            quests[quest_id]["y"],
        ),
    )
    placed = {}
    for quest_id in order:
        quest = quests[quest_id]
        original_x, original_y = quest["x"], quest["y"]
        candidates = []
        for dx_step in range(-16, 17):
            for dy_step in range(-16, 17):
                x = round((original_x + dx_step * 0.5) * 2) / 2
                y = round((original_y + dy_step * 0.5) * 2) / 2
                if collides(x, y, quest["size"], placed):
                    continue
                movement = (x - original_x) ** 2 + (y - original_y) ** 2
                alignment = 0.0
                for dep in quest["dependencies"]:
                    if dep not in placed:
                        continue
                    parent = quests[dep]
                    if parent["x"] < original_x - 0.25 and x <= placed[dep]["x"]:
                        alignment += 20
                    if parent["y"] < original_y - 0.25 and y <= placed[dep]["y"]:
                        alignment += 20
                    alignment += 0.03 * math.dist((x, y), (placed[dep]["x"], placed[dep]["y"]))
                candidates.append((movement + alignment, abs(dx_step) + abs(dy_step), x, y))
        if not candidates:
            raise ValueError(f"No space for {quest_id}")
        _, _, x, y = min(candidates)
        placed[quest_id] = {"x": x, "y": y, "size": quest["size"]}

    # Put independent tips and reference items in a separate right-hand rail.
    rail_x = max(node["x"] + node["size"] / 2 for node in placed.values()) + 4
    rail_y = min(node["y"] for node in placed.values())
    for index, quest_id in enumerate(sorted(isolated, key=lambda item: (quests[item]["y"], quests[item]["x"]))):
        quest = quests[quest_id]
        placed[quest_id] = {
            "x": round((rail_x + (index % 2) * 3.5) * 2) / 2,
            "y": round((rail_y + (index // 2) * 3.5) * 2) / 2,
            "size": quest["size"],
        }
    return placed


def render(filename: str, quests: dict[str, dict], placed: dict[str, dict], suffix: str) -> None:
    xs = [node["x"] for node in placed.values()]
    ys = [node["y"] for node in placed.values()]
    scale = 24
    width = int((max(xs) - min(xs) + 5) * scale)
    height = int((max(ys) - min(ys) + 5) * scale)
    image = Image.new("RGB", (width, height), "#101a24")
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 12)
    point = {
        quest_id: ((node["x"] - min(xs) + 2.5) * scale, (node["y"] - min(ys) + 2.5) * scale)
        for quest_id, node in placed.items()
    }
    for quest_id, quest in quests.items():
        for dep in quest["dependencies"]:
            if dep in point:
                draw.line((*point[dep], *point[quest_id]), fill="#435b70", width=1)
    for quest_id, node in placed.items():
        x, y = point[quest_id]
        radius = 9 * node["size"]
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill="#255367", outline="#6bd8d0", width=2)
        draw.text((x + radius + 2, y - 6), quest_id[:4], fill="#d1e1e8", font=font)
    output = ROOT / "design/previews" / f"{FILES.index(filename) + 1}-{suffix}.png"
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output)


def format_coord(value: float) -> str:
    return f"{value:.1f}d"


def apply(source: str, quests: dict[str, dict], placed: dict[str, dict]) -> str:
    for quest_id in reversed(list(quests)):
        start, end = quests[quest_id]["span"]
        block = source[start:end]

        def replace_coord(match: re.Match[str]) -> str:
            return f"{match.group(1)}{match.group(2)}: {format_coord(placed[quest_id][match.group(2)])}{match.group(4)}"

        updated = COORD.sub(replace_coord, block)
        source = source[:start] + updated + source[end:]
    return source


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=["preview", "apply", "verify"])
    args = parser.parse_args()
    manifest_path = ROOT / "design/quest-layout.json"

    if args.mode == "preview":
        manifest = {}
        for filename in FILES:
            _, quests = read_chapter(QUESTS / filename)
            placed = layout(quests)
            render(filename, quests, quests, "before")
            render(filename, quests, placed, "after")
            manifest[filename] = {quest_id: {"x": node["x"], "y": node["y"]} for quest_id, node in placed.items()}
            moved = sum((node["x"], node["y"]) != (quests[quest_id]["x"], quests[quest_id]["y"]) for quest_id, node in placed.items())
            print(f"{filename}: {moved}/{len(quests)} moved")
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        return

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    backup_dir = ROOT / "design/backups/quest-layout"
    if args.mode == "apply":
        backup_dir.mkdir(parents=True, exist_ok=True)
    for filename in FILES:
        source, quests = read_chapter(QUESTS / filename)
        placed = {quest_id: {**manifest[filename][quest_id], "size": quests[quest_id]["size"]} for quest_id in quests}
        if args.mode == "apply":
            shutil.copy2(QUESTS / filename, backup_dir / filename)
            (QUESTS / filename).write_bytes(apply(source, quests, placed).encode("utf-8"))
        else:
            old, old_quests = read_chapter(backup_dir / filename)
            expected = apply(old, old_quests, placed)
            if source != expected:
                raise ValueError(f"Non-coordinate change or coordinate mismatch: {filename}")
            if any(collides(node["x"], node["y"], node["size"], {k: v for k, v in placed.items() if k != quest_id}) for quest_id, node in placed.items()):
                raise ValueError(f"Quest overlap: {filename}")
            print(f"Verified {filename}: {len(quests)} quests")


if __name__ == "__main__":
    main()
