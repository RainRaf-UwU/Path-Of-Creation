"""Measure quest map edge crossings and dependency lengths."""

from __future__ import annotations

import json
import math
from itertools import combinations

from audit_progression import MAIN_FILES, ROOT, read_chapters


def intersects(a: tuple[float, float], b: tuple[float, float],
               c: tuple[float, float], d: tuple[float, float]) -> bool:
    def side(p: tuple[float, float], q: tuple[float, float], r: tuple[float, float]) -> float:
        return (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])

    return side(a, b, c) * side(a, b, d) < 0 and side(c, d, a) * side(c, d, b) < 0


def score(chapter: dict[str, dict], nodes: dict[str, dict]) -> tuple[int, float]:
    edges = [(parent, child) for child, quest in chapter.items()
             for parent in quest["dependencies"] if parent in chapter]
    lines = [(parent, child, (nodes[parent]["x"], nodes[parent]["y"]),
              (nodes[child]["x"], nodes[child]["y"])) for parent, child in edges]
    crossings = sum(
        intersects(a, b, c, d)
        for (p1, c1, a, b), (p2, c2, c, d) in combinations(lines, 2)
        if len({p1, c1, p2, c2}) == 4
    )
    length = sum(math.dist(a, b) for _, _, a, b in lines)
    return crossings, length


def main() -> None:
    quests = read_chapters()
    manifest = json.loads((ROOT / "design/quest-layout.json").read_text(encoding="utf-8"))
    for chapter_number, filename in enumerate(MAIN_FILES, 1):
        chapter = {quest_id: quest for quest_id, quest in quests.items() if quest["chapter"] == filename}
        crossings, length = score(chapter, manifest[filename])
        print(f"Chapter {chapter_number}: {crossings} crossings, {length:.0f} edge units")


if __name__ == "__main__":
    main()
