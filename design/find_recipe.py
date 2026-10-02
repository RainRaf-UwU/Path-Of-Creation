"""Show packaged recipe JSON outputs for a requested item ID."""

from __future__ import annotations

import argparse
import json
import zipfile

from audit_progression import ROOT
from check_acquisition import output_ids


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("item")
    parser.add_argument("--limit", type=int, default=8)
    args = parser.parse_args()
    found = 0
    for path in (ROOT / "kubejs/data").rglob("*.json"):
        if "/recipe/" not in path.as_posix() and "/recipes/" not in path.as_posix():
            continue
        try:
            recipe = json.loads(path.read_text(encoding="utf-8-sig"))
        except (OSError, ValueError):
            continue
        if args.item in output_ids(recipe):
            print(path.relative_to(ROOT).as_posix(), json.dumps(recipe, ensure_ascii=False)[:1800])
            found += 1
            if found >= args.limit:
                return
    for path in (ROOT / "mods").glob("*.jar"):
        try:
            with zipfile.ZipFile(path) as archive:
                for name in archive.namelist():
                    if not name.endswith(".json") or not ("/recipe/" in name or "/recipes/" in name):
                        continue
                    try:
                        recipe = json.loads(archive.read(name))
                    except (ValueError, UnicodeDecodeError):
                        continue
                    if args.item in output_ids(recipe):
                        print(path.name + ":" + name, json.dumps(recipe, ensure_ascii=False)[:1800])
                        found += 1
                        if found >= args.limit:
                            return
        except (OSError, zipfile.BadZipFile):
            pass


if __name__ == "__main__":
    main()
