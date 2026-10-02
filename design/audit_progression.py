"""Inventory FTB Quests chapters and validate their dependency graph."""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CHAPTERS = ROOT / "config/ftbquests/quests/chapters"
MAIN_FILES = [
    "1111.snbt",
    "149B7FC09F5F2520.snbt",
    "66900C421E317CA4.snbt",
    "1F9CADE08E41FAE2.snbt",
    "1306DE3D8C100552.snbt",
]
QUEST_BLOCK = re.compile(r"(?ms)^\t\t\{\r?\n.*?^\t\t\}")
QUEST_ID = re.compile(r'(?m)^\t\t\tid: "([0-9A-F]{16})"\r?$')
DEP = re.compile(r"(?ms)^\t\t\tdependencies: \[([^]]*)\]")
ITEM = re.compile(r'(?<![\w])id: "([a-z0-9_.-]+:[a-z0-9_./-]+)"')
OBJECT_ID = re.compile(r'(?<![\w])id: "([0-9A-F]{16})"')
TYPE = re.compile(r'type: "([a-z0-9_]+)"')
LANG_TITLE = re.compile(r'(?m)^\tquest\.([0-9A-F]{16})\.title: "(.*)"\r?$')


def check_delimiters(source: str, label: str) -> None:
    """Catch truncated strings or brackets before extracting quest blocks."""
    stack = []
    quoted = False
    escaped = False
    pairs = {"}": "{", "]": "[", ")": "("}
    for character in source:
        if quoted:
            if escaped:
                escaped = False
            elif character == "\\":
                escaped = True
            elif character == '"':
                quoted = False
        elif character == '"':
            quoted = True
        elif character in "{[(":
            stack.append(character)
        elif character in "}])":
            if not stack or stack.pop() != pairs[character]:
                raise ValueError(f"Mismatched SNBT delimiter in {label}")
    if quoted or stack:
        raise ValueError(f"Unclosed SNBT string or delimiter in {label}")


def read_chapters() -> dict[str, dict]:
    language_dir = ROOT / "config/ftbquests/quests/lang"
    for language in ("zh_cn.snbt", "en_us.snbt"):
        check_delimiters((language_dir / language).read_text(encoding="utf-8-sig"), language)
    titles = dict(LANG_TITLE.findall((language_dir / "zh_cn.snbt").read_text(encoding="utf-8-sig")))
    quests = {}
    for path in sorted(CHAPTERS.glob("*.snbt")):
        source = path.read_text(encoding="utf-8-sig")
        if path.name in MAIN_FILES:
            check_delimiters(source, path.name)
        for match in QUEST_BLOCK.finditer(source):
            block = match.group()
            quest_id_match = QUEST_ID.search(block)
            if not quest_id_match:
                raise ValueError(f"Unparsed quest at {path}:{match.start()}")
            quest_id = quest_id_match.group(1)
            if quest_id in quests:
                raise ValueError(f"Duplicate quest ID: {quest_id}")
            dep_match = DEP.search(block)
            task_match = re.search(r"(?ms)^\t\t\ttasks: (.*?)(?=^\t\t\tx: )", block)
            reward_match = re.search(r"(?ms)^\t\t\trewards: (.*?)(?=^\t\t\t(?:shape|size|tasks|x): )", block)
            task_text = task_match.group(1) if task_match else ""
            reward_text = reward_match.group(1) if reward_match else ""
            coords = {}
            for axis in ("x", "y"):
                coord = re.search(rf"(?m)^\t\t\t{axis}: (-?\d+(?:\.\d+)?)d\r?$", block)
                coords[axis] = float(coord.group(1)) if coord else None
            shape = re.search(r'(?m)^\t\t\tshape: "(.*)"\r?$', block)
            size = re.search(r"(?m)^\t\t\tsize: ([\d.]+)d\r?$", block)
            quests[quest_id] = {
                "chapter": path.name,
                "title": titles.get(quest_id, ""),
                "dependencies": re.findall(r'"([0-9A-F]{16})"', dep_match.group(1)) if dep_match else [],
                "task_items": ITEM.findall(task_text),
                "task_types": TYPE.findall(task_text),
                "task_ids": OBJECT_ID.findall(task_text),
                "reward_items": ITEM.findall(reward_text),
                "reward_types": TYPE.findall(reward_text),
                "reward_ids": OBJECT_ID.findall(reward_text),
                "dependency_type": re.search(r'(?m)^\t\t\tdependency_type: "(.*)"', block).group(1) if "dependency_type:" in block else "AND",
                "optional": "\t\t\toptional: true" in block,
                "hide": "\t\t\thide: true" in block,
                "shape": shape.group(1) if shape else "",
                "size": float(size.group(1)) if size else 1.0,
                **coords,
            }
    return quests


def validate(quests: dict[str, dict]) -> list[str]:
    errors = []
    for quest_id, quest in quests.items():
        for dep in quest["dependencies"]:
            if dep not in quests:
                errors.append(f"Missing dependency: {quest_id} -> {dep}")
        if quest_id in quest["dependencies"]:
            errors.append(f"Self dependency: {quest_id}")
    active, done = set(), set()

    def visit(quest_id: str) -> None:
        if quest_id in active:
            errors.append(f"Cycle through {quest_id}")
            return
        if quest_id in done:
            return
        active.add(quest_id)
        for dep in quests[quest_id]["dependencies"]:
            if dep in quests:
                visit(dep)
        active.remove(quest_id)
        done.add(quest_id)

    for quest_id in quests:
        visit(quest_id)
    object_ids = [identifier for quest in quests.values() for identifier in [*quest["task_ids"], *quest["reward_ids"]]]
    for identifier, count in Counter(object_ids).items():
        if count > 1:
            errors.append(f"Duplicate task/reward ID: {identifier} ({count})")
    start = "3EDAA2878D281801"
    if start in quests:
        reached = {start}
        while True:
            unlocked = {quest_id for quest_id, quest in quests.items()
                        if quest_id not in reached and quest["dependencies"]
                        and (any(dep in reached for dep in quest["dependencies"])
                             if quest["dependency_type"] == "OR"
                             else all(dep in reached for dep in quest["dependencies"]))}
            if not unlocked:
                break
            reached.update(unlocked)
        for quest_id, quest in quests.items():
            if quest["chapter"] in MAIN_FILES and quest_id not in reached:
                errors.append(f"Unreachable from Chapter 1: {quest_id}")
    return errors


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", action="store_true", help="Emit the full inventory")
    parser.add_argument("--details", type=int, choices=range(1, 6), help="List quests in one chapter")
    args = parser.parse_args()
    quests = read_chapters()
    errors = validate(quests)
    if args.json:
        print(json.dumps({"quests": quests, "errors": errors}, ensure_ascii=False, indent=2))
        return
    children = defaultdict(list)
    for quest_id, quest in quests.items():
        for dep in quest["dependencies"]:
            children[dep].append(quest_id)
    if args.details:
        filename = MAIN_FILES[args.details - 1]
        for quest_id, quest in quests.items():
            if quest["chapter"] != filename:
                continue
            tasks = ", ".join(quest["task_items"]) or ", ".join(quest["task_types"])
            rewards = ", ".join(quest["reward_items"])
            dependencies = ",".join(dep[:6] for dep in quest["dependencies"]) or "ROOT"
            print(f"{quest_id[:6]} | {quest['title'] or '-'} | {tasks} | <- {dependencies} | -> {len(children[quest_id])} | reward {rewards}")
        return
    for chapter_number, filename in enumerate(MAIN_FILES, 1):
        chapter = {quest_id: quest for quest_id, quest in quests.items() if quest["chapter"] == filename}
        roots = [quest_id for quest_id, quest in chapter.items() if not quest["dependencies"]]
        external = [(quest_id, dep) for quest_id, quest in chapter.items() for dep in quest["dependencies"] if dep not in chapter]
        outbound = [(quest_id, child) for quest_id in chapter for child in children[quest_id] if child not in chapter]
        print(f"CHAPTER {chapter_number} {filename}: {len(chapter)} quests, {len(roots)} roots, {len(external)} inbound, {len(outbound)} outbound")
        for quest_id in roots:
            quest = chapter[quest_id]
            print(f"  ROOT {quest_id} {quest['title']} {','.join(quest['task_items']) or ','.join(quest['task_types'])}")
        for quest_id, dep in external:
            print(f"  IN {quest_id} {chapter[quest_id]['title']} <- {dep} {quests[dep]['title'] if dep in quests else 'MISSING'}")
        for quest_id, child in outbound:
            print(f"  OUT {quest_id} {chapter[quest_id]['title']} -> {child} {quests[child]['title']}")
    print("ERRORS", len(errors))
    for error in errors:
        print(error)


if __name__ == "__main__":
    main()
