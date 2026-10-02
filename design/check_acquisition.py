"""Find chapter task items and model IDs that lack local acquisition evidence."""

from __future__ import annotations

import json
import io
import re
import zipfile
from collections import defaultdict
from pathlib import Path

from audit_progression import MAIN_FILES, ROOT, read_chapters


ITEM_ID = re.compile(r"^[a-z0-9_.-]+:[a-z0-9_./-]+$")
MODEL = re.compile(r'"hostilenetworks:data_model": "([a-z0-9_./:-]+)"')
MODEL_COMPONENT = re.compile(r'hostilenetworks:data_model=\\?"(hostilenetworks:[a-z0-9_./-]+)\\?"')


def output_ids(value: object) -> set[str]:
    outputs = set()
    if isinstance(value, dict):
        for key in ("result", "results", "output", "outputs"):
            if key not in value:
                continue
            result = value[key]
            if isinstance(result, str) and ITEM_ID.fullmatch(result):
                outputs.add(result)
            elif isinstance(result, dict):
                for field in ("id", "item"):
                    item = result.get(field)
                    if isinstance(item, str) and ITEM_ID.fullmatch(item):
                        outputs.add(item)
            elif isinstance(result, list):
                for entry in result:
                    if isinstance(entry, dict):
                        for field in ("id", "item"):
                            item = entry.get(field)
                            if isinstance(item, str) and ITEM_ID.fullmatch(item):
                                outputs.add(item)
    return outputs


def main() -> None:
    quests = read_chapters()
    item_to_quests = defaultdict(list)
    reward_items = set()
    for quest_id, quest in quests.items():
        if quest["chapter"] in MAIN_FILES:
            for item in quest["task_items"]:
                item_to_quests[item].append(quest_id)
            reward_items.update(quest["reward_items"])
    sources = defaultdict(list)
    model_defs = set()
    mod_ids = {"minecraft", "rain"}
    for path in (ROOT / "kubejs/data").rglob("*.json"):
        relative = path.relative_to(ROOT / "kubejs/data").as_posix()
        if relative.startswith("hostilenetworks/data_models/"):
            model_defs.add("hostilenetworks:" + relative.removeprefix("hostilenetworks/data_models/").removesuffix(".json"))
        if "/recipe/" not in relative and "/recipes/" not in relative:
            continue
        try:
            for item in output_ids(json.loads(path.read_text(encoding="utf-8-sig"))):
                sources[item].append(relative)
        except (OSError, ValueError):
            pass
    def inspect_archive(archive: zipfile.ZipFile, source_name: str) -> None:
        for name in archive.namelist():
            if name.endswith("mods.toml"):
                try:
                    mod_ids.update(re.findall(r'(?m)^\s*modId\s*=\s*["\']([^"\']+)', archive.read(name).decode("utf-8")))
                except (ValueError, UnicodeDecodeError):
                    pass
            if name.startswith("data/hostilenetworks/data_models/") and name.endswith(".json"):
                model_defs.add("hostilenetworks:" + name.removeprefix("data/hostilenetworks/data_models/").removesuffix(".json"))
            if name.endswith(".jar") and name.startswith("META-INF/jarjar/"):
                try:
                    with zipfile.ZipFile(io.BytesIO(archive.read(name))) as nested:
                        inspect_archive(nested, source_name + ":" + name)
                except (OSError, zipfile.BadZipFile):
                    pass
            if not name.endswith(".json") or not ("/recipe/" in name or "/recipes/" in name):
                continue
            try:
                for item in output_ids(json.loads(archive.read(name))):
                    if item in item_to_quests:
                        sources[item].append(source_name + ":" + name)
            except (ValueError, UnicodeDecodeError):
                pass

    for jar in (ROOT / "mods").glob("*.jar"):
        try:
            with zipfile.ZipFile(jar) as archive:
                inspect_archive(archive, jar.name)
        except (OSError, zipfile.BadZipFile):
            pass
    scripts = [path for path in (ROOT / "kubejs/server_scripts").rglob("*.js")]
    script_text = {path: path.read_text(encoding="utf-8-sig") for path in scripts}
    print(f"Task item IDs: {len(item_to_quests)}; packaged recipe output IDs: {len(sources)}")
    missing_mods = sorted({item.split(":", 1)[0] for item in item_to_quests} - mod_ids)
    print(f"Task item namespaces: {len({item.split(':', 1)[0] for item in item_to_quests})}; missing installed mod namespaces: {missing_mods}")
    missing_reward_mods = sorted({item.split(":", 1)[0] for item in reward_items} - mod_ids)
    print(f"Reward item IDs: {len(reward_items)}; missing installed mod namespaces: {missing_reward_mods}")
    for item, quest_ids in item_to_quests.items():
        if item in sources:
            continue
        mentions = [path.relative_to(ROOT).as_posix() for path, source in script_text.items() if item in source]
        if not mentions:
            print(f"NO_SOURCE {item} chapters={sorted({MAIN_FILES.index(quests[q]['chapter']) + 1 for q in quest_ids})}")
    model_quests = defaultdict(list)
    for path in (ROOT / "config/ftbquests/quests/chapters").glob("*.snbt"):
        if path.name not in MAIN_FILES:
            continue
        for model in MODEL.findall(path.read_text(encoding="utf-8-sig")):
            model_quests[model].append(path.name)
    print(f"Data model IDs in quest tasks: {len(model_quests)}; definitions found: {len(model_defs)}")
    for model, chapters in model_quests.items():
        if model not in model_defs:
            print(f"MISSING_MODEL {model} chapters={sorted(set(chapters))}")
    for path, source in script_text.items():
        for model in MODEL_COMPONENT.findall(source):
            if model not in model_defs:
                print(f"MISSING_SCRIPT_MODEL {model} source={path.relative_to(ROOT).as_posix()}")


if __name__ == "__main__":
    main()
