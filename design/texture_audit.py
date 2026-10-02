"""Inventory and preview pack-owned pixel textures at inventory scale."""

from __future__ import annotations

import json
import io
import subprocess
from collections import Counter
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "design/texture-audit"


def assets() -> list[Path]:
    roots = [ROOT / "kubejs/assets", ROOT / "resourcepacks"]
    return sorted(path for folder in roots if folder.exists() for path in folder.rglob("*.png"))


def category(path: Path) -> str:
    relative = path.relative_to(ROOT).as_posix()
    if "/textures/item/" in relative:
        return "item"
    if "/textures/block/" in relative:
        return "block"
    return "other"


def inventory(paths: list[Path]) -> list[dict]:
    result = []
    for path in paths:
        with Image.open(path) as image:
            image.load()
            rgba = image.convert("RGBA")
            pixels = list(rgba.get_flattened_data())
            visible = [pixel for pixel in pixels if pixel[3]]
            result.append({
                "path": path.relative_to(ROOT).as_posix(),
                "category": category(path),
                "size": list(image.size),
                "mode": image.mode,
                "visible_bbox": list(rgba.getbbox()) if rgba.getbbox() else None,
                "colors": len(set(visible)),
                "partial_alpha_pixels": sum(0 < pixel[3] < 255 for pixel in pixels),
                "transparent_pixels": len(pixels) - len(visible),
            })
    return result


def sheet(paths: list[Path], name: str) -> None:
    columns, cell_w, cell_h = 7, 170, 132
    rows = (len(paths) + columns - 1) // columns
    canvas = Image.new("RGB", (columns * cell_w, rows * cell_h), "#14202b")
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 13)
    for index, path in enumerate(paths):
        x, y = (index % columns) * cell_w, (index // columns) * cell_h
        draw.rectangle((x + 2, y + 2, x + cell_w - 2, y + cell_h - 2), outline="#395061")
        for cy in range(4):
            for cx in range(4):
                color = "#263541" if (cx + cy) % 2 else "#314351"
                draw.rectangle((x + 21 + cx * 20, y + 7 + cy * 20,
                                x + 40 + cx * 20, y + 26 + cy * 20), fill=color)
        with Image.open(path) as source:
            rgba = source.convert("RGBA")
            if rgba.height > rgba.width and rgba.height % rgba.width == 0:
                rgba = rgba.crop((0, 0, rgba.width, rgba.width))
            scale = min(80 / rgba.width, 80 / rgba.height)
            preview = rgba.resize((max(1, int(rgba.width * scale)),
                                   max(1, int(rgba.height * scale))), Image.Resampling.NEAREST)
            canvas.paste(preview, (x + 21 + (80 - preview.width) // 2,
                                   y + 7 + (80 - preview.height) // 2), preview)
        label = path.stem
        if len(label) > 22:
            label = label[:21] + "…"
        draw.text((x + 8, y + 94), label, fill="#d7e2e5", font=font)
        draw.text((x + 8, y + 113), str(path.relative_to(ROOT).parent).replace("\\", "/")[-24:],
                  fill="#819aaa", font=font)
    output = OUTPUT / f"{name}-contact.png"
    canvas.save(output)
    print(f"{name}: {len(paths)} textures -> {output.relative_to(ROOT)}")


def animation_sheet(paths: list[Path]) -> None:
    canvas = Image.new("RGB", (5 * 164, len(paths) * 162), "#14202b")
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 13)
    for row, path in enumerate(paths):
        with Image.open(path) as source:
            count = source.height // source.width
            frame_ids = sorted({0, count // 4, count // 2, 3 * count // 4, count - 1})
            for col, frame_id in enumerate(frame_ids):
                frame = source.crop((0, frame_id * source.width, source.width,
                                     (frame_id + 1) * source.width)).convert("RGBA")
                frame = frame.resize((128, 128), Image.Resampling.NEAREST)
                x, y = col * 164, row * 162
                draw.rectangle((x + 17, y + 4, x + 145, y + 132), fill="#36434c")
                canvas.paste(frame, (x + 18, y + 5), frame)
                draw.text((x + 20, y + 136), f"{path.stem[:14]} #{frame_id}", fill="#d7e2e5", font=font)
    output = OUTPUT / "animation-frames.png"
    canvas.save(output)
    print(f"animations: {len(paths)} spritesheets -> {output.relative_to(ROOT)}")


def comparison_sheet() -> None:
    candidates = sorted((OUTPUT / "candidate").rglob("*.png"))
    candidates = [path for path in candidates if "/textures/" not in path.relative_to(OUTPUT / "candidate").as_posix()]
    if not candidates:
        return
    columns, cell_w, cell_h = 5, 220, 150
    canvas = Image.new("RGB", (columns * cell_w, ((len(candidates) + columns - 1) // columns) * cell_h), "#14202b")
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 13)
    for index, candidate in enumerate(candidates):
        relative = candidate.relative_to(OUTPUT / "candidate")
        x, y = index % columns * cell_w, index // columns * cell_h
        draw.rectangle((x + 1, y + 1, x + cell_w - 2, y + cell_h - 2), outline="#395061")
        tracked_path = (Path("kubejs/assets/rain/textures") / relative).as_posix()
        original = subprocess.run(["git", "show", f"HEAD:{tracked_path}"], cwd=ROOT,
                                  capture_output=True, check=False)
        for col, source in enumerate((original.stdout if original.returncode == 0 else None, candidate)):
            if source is None:
                draw.text((x + col * 108 + 15, y + 40), "missing", fill="#ef8176", font=font)
                continue
            with Image.open(io.BytesIO(source) if isinstance(source, bytes) else source) as image:
                rgba = image.convert("RGBA")
                if rgba.height > rgba.width and rgba.height % rgba.width == 0:
                    rgba = rgba.crop((0, 0, rgba.width, rgba.width))
                rgba.thumbnail((84, 84), Image.Resampling.NEAREST)
                preview = rgba.resize((84, 84), Image.Resampling.NEAREST)
                backdrop = Image.new("RGB", (84, 84), "#344651")
                backdrop.paste(preview, (0, 0), preview)
                canvas.paste(backdrop, (x + 13 + col * 108, y + 8))
        draw.text((x + 12, y + 99), relative.stem[:25], fill="#d7e2e5", font=font)
        draw.text((x + 12, y + 121), "before / candidate", fill="#829aaa", font=font)
    output = OUTPUT / "comparison.png"
    canvas.save(output)
    print(f"comparison: {len(candidates)} PNGs -> {output.relative_to(ROOT)}")


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    paths = assets()
    data = inventory(paths)
    (OUTPUT / "inventory.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n",
                                           encoding="utf-8")
    print("Total PNGs:", len(paths), "categories:", dict(Counter(entry["category"] for entry in data)))
    for entry in data:
        print(f"{entry['path']} {entry['size']} {entry['colors']} colors "
              f"{entry['partial_alpha_pixels']} partial-alpha")
    for name in ("item", "block", "other"):
        sheet([path for path in paths if category(path) == name], name)
    animation_sheet([path for path in paths if path.with_suffix(path.suffix + ".mcmeta").exists()])
    comparison_sheet()


if __name__ == "__main__":
    main()
