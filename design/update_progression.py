"""Apply the reviewed chapter 1–5 dependency and task corrections."""

from __future__ import annotations

import argparse
import re
from pathlib import Path

from audit_progression import CHAPTERS, MAIN_FILES, QUEST_BLOCK, QUEST_ID, read_chapters, validate


# Short IDs are resolved against the current quest inventory to make the change list readable.
ADD = {
    "7F40C4": ["5E4917"],
    "0155C7": ["5A1066"],
    "3A3F70": ["7ECF85"],
    "76C68B": ["6F8CD7"],
    "34F71A": ["5E4917"],
    "7845A9": ["016B79"],
    "554B35": ["7ECF85"],
    "71C69D": ["528E4F"],
    "5D8E35": ["775FBB"],
    "25ECF0": ["528E4F"],
    "72502E": ["528E4F"],
    "1CBEDD": ["528E4F", "749E9F"],
    "199742": ["7BFB44"],
    "035353": ["520908"],
    "520908": ["6AF2EC"],
    "46E87C": ["6AF2EC"],
    "35BD77": ["714AD7"],
    "1A18B3": ["7BFB44"],
    "0634B0": ["6AF2EC"],
    "0D4A17": ["6AF2EC"],
    "7080E3": ["6AF2EC"],
    "7E88F3": ["7BFB44"],
    "1FB989": ["714AD7"],
    "04385E": ["714AD7"],
    "4280D1": ["714AD7"],
    "63660F": ["355A5C"],
    "01B7DA": ["476641"],
    "0FE83C": ["476641"],
    "0AEA0C": ["62544B"],
    "42791C": ["355A5C"],
    "42F9ED": ["078BA8"],
    "2BC011": ["28147A"],
    "38AA3A": ["2BC011"],
    "3B5276": ["38AA3A"],
    "088D64": ["154C9D"],
    "176381": ["38AA3A"],
    "412E86": ["38AA3A"],
    "415651": ["38AA3A"],
    "63E7BA": ["38AA3A"],
    "2D3FEE": ["38AA3A"],
    "66C557": ["38AA3A"],
    "0FFD72": ["38AA3A"],
    "6EBF14": ["38AA3A"],
    "4ADBE5": ["38AA3A"],
    "3A96E0": ["38AA3A"],
    "566E2B": ["38AA3A"],
    "114CC5": ["38AA3A"],
    "1EECD0": ["38AA3A"],
    "550FC7": ["38AA3A"],
    "7ACBB2": ["38AA3A"],
    "592930": ["38AA3A"],
    "78784B": ["1DC65E"],
    "44A7AA": ["6927F4"],
    "360B7C": ["681912"],
    "587B18": ["360B7C"],
    "5DF45B": ["360B7C"],
    "2522B1": ["28D8B4"],
    "02E101": ["2522B1"],
    "70FFC2": ["2522B1"],
    "525260": ["360B7C"],
    "2DA877": ["525260"],
    "032BAB": ["28D8B4"],
    "062E85": ["28D8B4"],
    "4703AF": ["28D8B4"],
    "103C0F": ["28D8B4"],
    "50BC80": ["2522B1"],
}
REPLACE = {"66F00B": ("3B7EE0", "7568A5")}
REMOVE = {"3B7EE0", "1AECCC"}
CHECKMARK = {"5A1226"}


def resolve(prefix: str, quests: dict[str, dict]) -> str:
    matches = [quest_id for quest_id in quests if quest_id.startswith(prefix)]
    if len(matches) != 1:
        raise ValueError(f"Expected one quest ID for {prefix}, found {matches}")
    return matches[0]


def resolve_existing(prefix: str, quests: dict[str, dict]) -> str | None:
    matches = [quest_id for quest_id in quests if quest_id.startswith(prefix)]
    if len(matches) > 1:
        raise ValueError(f"Ambiguous quest ID for {prefix}: {matches}")
    return matches[0] if matches else None


def update_block(block: str, quest_id: str, quests: dict[str, dict]) -> str:
    newline = "\r\n" if "\r\n" in block else "\n"
    dependencies = list(quests[quest_id]["dependencies"])
    prefix = quest_id[:6]
    if prefix in REPLACE:
        old, new = REPLACE[prefix]
        old_id, new_id = resolve_existing(old, quests), resolve(new, quests)
        if old_id in dependencies:
            dependencies = [new_id if dep == old_id else dep for dep in dependencies]
        elif new_id not in dependencies:
            raise ValueError(f"Neither old nor new dependency exists on {quest_id}")
    for added in ADD.get(prefix, []):
        dep = resolve(added, quests)
        if dep not in dependencies:
            dependencies.append(dep)
    if dependencies != quests[quest_id]["dependencies"]:
        if len(dependencies) == 1:
            dep_text = f'\t\t\tdependencies: ["{dependencies[0]}"]'
        else:
            dep_text = "\t\t\tdependencies: [" + newline
            dep_text += newline.join(f'\t\t\t\t"{dep}"' for dep in dependencies)
            dep_text += newline + "\t\t\t]"
        old_deps = re.search(r"(?ms)^\t\t\tdependencies: \[(?:[^\r\n]*\]|.*?^\t\t\t\])", block)
        if old_deps:
            block = block[:old_deps.start()] + dep_text + block[old_deps.end():]
        else:
            block = block.replace("\t\t{" + newline, "\t\t{" + newline + dep_text + newline, 1)
    if prefix in CHECKMARK:
        task_ids = quests[quest_id]["task_ids"]
        if len(task_ids) != 1:
            raise ValueError(f"Expected one task for {quest_id}")
        task_text = f'\t\t\ttasks: [{{{newline}\t\t\t\tid: "{task_ids[0]}"{newline}\t\t\t\ttype: "checkmark"{newline}\t\t\t}}]{newline}'
        block, count = re.subn(r"(?ms)^\t\t\ttasks: .*?(?=^\t\t\tx: )", lambda _: task_text, block)
        if count != 1:
            raise ValueError(f"Could not replace task for {quest_id}")
    return block


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    quests = read_chapters()
    removed = {quest_id for prefix in REMOVE if (quest_id := resolve_existing(prefix, quests))}
    changed = {resolve(prefix, quests) for prefix in [*ADD, *REPLACE, *CHECKMARK]}
    for filename in MAIN_FILES:
        path = CHAPTERS / filename
        source = path.read_bytes().decode("utf-8-sig")
        edits = []
        for match in QUEST_BLOCK.finditer(source):
            block = match.group()
            quest_id_match = QUEST_ID.search(block)
            if not quest_id_match:
                raise ValueError(f"Unparsed quest block in {filename}")
            quest_id = quest_id_match.group(1)
            if quest_id in removed:
                end = match.end() + (2 if source[match.end():].startswith("\r\n") else 1)
                edits.append((match.start(), end, ""))
            elif quest_id in changed:
                edits.append((match.start(), match.end(), update_block(block, quest_id, quests)))
        for start, end, replacement in reversed(edits):
            source = source[:start] + replacement + source[end:]
        print(f"{filename}: {len(edits)} edits")
        if args.apply:
            path.write_bytes(source.encode("utf-8"))
    if args.apply:
        updated = read_chapters()
        errors = validate(updated)
        if errors:
            raise ValueError("; ".join(errors))
        print("All dependencies resolve; no cycles or duplicate IDs")


if __name__ == "__main__":
    main()
