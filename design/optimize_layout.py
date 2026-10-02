"""Reduce crossings by swapping only ordinary side-quest positions."""

from __future__ import annotations

import argparse
import json
import math
import random

from audit_progression import MAIN_FILES, ROOT, read_chapters
from evaluate_layout import intersects, score


def optimize(chapter: dict[str, dict], nodes: dict[str, dict], seed: int,
             iterations: int = 12000) -> tuple[int, float]:
    rng = random.Random(seed)
    movable = [quest_id for quest_id, node in nodes.items()
               if node["role"] == "branch" and node["size"] == 1.0]
    edges = [(parent, child) for child, quest in chapter.items()
             for parent in quest["dependencies"] if parent in chapter]
    incident = {quest_id: [index for index, edge in enumerate(edges) if quest_id in edge]
                for quest_id in movable}

    def point(quest_id: str) -> tuple[float, float]:
        return nodes[quest_id]["x"], nodes[quest_id]["y"]

    def partial(left: str, right: str) -> tuple[int, float]:
        affected = set(incident[left]) | set(incident[right])
        length = sum(math.dist(point(edges[index][0]), point(edges[index][1])) for index in affected)
        crossings = 0
        for index in affected:
            p1, c1 = edges[index]
            a, b = point(p1), point(c1)
            for other_index, (p2, c2) in enumerate(edges):
                if other_index == index or (other_index in affected and other_index < index):
                    continue
                if len({p1, c1, p2, c2}) < 4:
                    continue
                if intersects(a, b, point(p2), point(c2)):
                    crossings += 1
        return crossings, length

    def exchange(left: str, right: str) -> None:
        nodes[left]["x"], nodes[right]["x"] = nodes[right]["x"], nodes[left]["x"]
        nodes[left]["y"], nodes[right]["y"] = nodes[right]["y"], nodes[left]["y"]

    initial = score(chapter, nodes)
    best = initial
    best_positions = {quest_id: point(quest_id) for quest_id in movable}
    for iteration in range(iterations):
        left, right = rng.sample(movable, 2)
        before = partial(left, right)
        exchange(left, right)
        after = partial(left, right)
        delta = 24 * (after[0] - before[0]) + after[1] - before[1]
        temperature = max(0.2, 12 * (1 - iteration / iterations) ** 2)
        if delta <= 0 or rng.random() < math.exp(-delta / temperature):
            current = score(chapter, nodes) if iteration % 200 == 0 else None
            if current is not None and 24 * current[0] + current[1] < 24 * best[0] + best[1]:
                best = current
                best_positions = {quest_id: point(quest_id) for quest_id in movable}
        else:
            exchange(left, right)
    current = score(chapter, nodes)
    if 24 * current[0] + current[1] < 24 * best[0] + best[1]:
        best = current
        best_positions = {quest_id: point(quest_id) for quest_id in movable}
    for quest_id, (x, y) in best_positions.items():
        nodes[quest_id]["x"], nodes[quest_id]["y"] = x, y
    return initial


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    quests = read_chapters()
    path = ROOT / "design/quest-layout.json"
    manifest = json.loads(path.read_text(encoding="utf-8"))
    for chapter_number, filename in enumerate(MAIN_FILES, 1):
        chapter = {quest_id: quest for quest_id, quest in quests.items() if quest["chapter"] == filename}
        before = optimize(chapter, manifest[filename], seed=chapter_number)
        after = score(chapter, manifest[filename])
        print(f"Chapter {chapter_number}: crossings {before[0]} -> {after[0]}, "
              f"edge units {before[1]:.0f} -> {after[1]:.0f}")
    if args.apply:
        path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
