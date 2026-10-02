"""Author pack-owned pixel sprites with stable IDs and native dimensions.

Run without flags to build review candidates. Use --apply after inspecting the
contact sheets to copy those candidates into the KubeJS resource namespace.
"""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "kubejs/assets/rain/textures"
CANDIDATES = ROOT / "design/texture-audit/candidate"

INK = "#172330"
DEEP = "#24343f"
SHADOW = "#304353"
STEEL = "#607987"
LIGHT = "#b6d0d8"
GLINT = "#d9e8df"


def sprite(size: int) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    return image, ImageDraw.Draw(image)


def panel(accent: str, size: int = 16) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image, draw = sprite(size)
    scale = size // 16
    def rect(box: tuple[int, int, int, int], color: str) -> None:
        draw.rectangle(tuple(value * scale for value in box), fill=color)
    rect((3, 1, 12, 14), INK)
    rect((2, 2, 13, 13), INK)
    rect((3, 2, 12, 13), STEEL)
    rect((3, 3, 11, 12), LIGHT)
    rect((4, 4, 11, 11), DEEP)
    rect((11, 3, 12, 12), SHADOW)
    rect((3, 12, 12, 13), SHADOW)
    rect((4, 2, 10, 2), GLINT)
    rect((4, 3, 9, 3), accent)
    rect((6, 12, 9, 12), accent)
    return image, draw


def accent_palette(color: str) -> tuple[str, str, str]:
    palettes = {
        "copper": ("#79513e", "#da9660", "#f0c091"),
        "cyan": ("#2f6874", "#57bdc5", "#a8e3df"),
        "green": ("#3e6955", "#74b781", "#b9dcaa"),
        "amber": ("#80603d", "#d5a55e", "#f0d493"),
        "gold": ("#8a683d", "#e2b968", "#f3da92"),
        "violet": ("#61456e", "#a47fc3", "#d7b3dc"),
        "coral": ("#874d4c", "#d97c69", "#f5b38a"),
        "silver": ("#607583", "#9ab3ba", "#e2e9dd"),
    }
    return palettes[color]


def upgrade(kind: str) -> Image.Image:
    dark, mid, bright = accent_palette(kind)
    image, draw = panel(mid)
    if kind == "cyan":  # speed: two short forward chevrons
        for y in (5, 8):
            draw.polygon([(5, y), (8, y), (10, y + 2), (8, y + 4),
                          (5, y + 4), (7, y + 2)], fill=dark)
            draw.line([(5, y), (8, y), (10, y + 2)], fill=bright, width=1)
    elif kind == "green":  # production: two outputs from one input
        draw.rectangle((5, 5, 7, 7), fill=bright)
        draw.rectangle((9, 5, 10, 7), fill=mid)
        draw.rectangle((5, 9, 7, 10), fill=mid)
        draw.rectangle((9, 9, 10, 10), fill=bright)
        draw.line([(7, 7), (9, 9)], fill=dark)
    elif kind == "amber":  # energy: lightning
        draw.polygon([(8, 4), (5, 8), (7, 8), (6, 11), (11, 6),
                      (8, 6)], fill=bright)
        draw.line([(8, 4), (5, 8), (7, 8)], fill=dark)
    elif kind == "violet":  # overclock: clock hand
        draw.ellipse((5, 5, 10, 10), outline=mid, width=1)
        draw.line([(8, 5), (8, 8), (10, 9)], fill=bright, width=1)
        draw.point((8, 8), fill=GLINT)
    elif kind == "coral":  # overload: rising core
        draw.rectangle((6, 8, 9, 11), fill=dark)
        draw.rectangle((7, 6, 8, 9), fill=mid)
        draw.polygon([(5, 7), (7, 4), (9, 4), (11, 7)], fill=bright)
        draw.point((8, 5), fill=GLINT)
    else:  # white upgrade: identifiable neutral diamond
        draw.polygon([(8, 4), (11, 8), (8, 11), (5, 8)], fill=dark)
        draw.polygon([(8, 5), (10, 8), (8, 10), (6, 8)], fill=mid)
        draw.line([(8, 5), (6, 8), (8, 8)], fill=bright)
    return image


def mineral_upgrade(tier: int) -> Image.Image:
    colors = ("copper", "cyan", "violet", "gold", "coral")
    dark, mid, bright = accent_palette(colors[tier - 1])
    image, draw = panel(mid, 32)
    draw.rectangle((8, 8, 23, 23), fill=DEEP)
    draw.rectangle((9, 9, 22, 22), outline=SHADOW)
    # The same pickaxe angle and handle are used at each mining tier.
    draw.line([(12, 23), (18, 12)], fill="#734e39", width=4)
    draw.line([(12, 22), (17, 13)], fill="#a7774a", width=2)
    draw.line([(12, 12), (17, 9), (23, 10)], fill=dark, width=5)
    draw.line([(12, 11), (17, 9), (23, 10)], fill=mid, width=3)
    draw.line([(13, 10), (17, 9), (21, 10)], fill=bright, width=2)
    draw.point((22, 10), fill=GLINT)
    # Tier pips remain legible after 32-to-16 inventory scaling.
    for index in range(tier):
        x = 8 + index * 4
        draw.rectangle((x, 25, x + 2, 26), fill=mid)
        draw.point((x, 25), fill=bright)
    return image


def block_panel() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image = Image.new("RGBA", (16, 16), INK)
    draw = ImageDraw.Draw(image)
    draw.rectangle((1, 1, 14, 14), fill=STEEL)
    draw.line([(1, 14), (14, 14), (14, 1)], fill=SHADOW, width=2)
    draw.line([(2, 1), (13, 1)], fill=LIGHT)
    draw.rectangle((3, 3, 12, 12), fill=DEEP)
    for point in ((2, 2), (13, 2), (2, 13), (13, 13)):
        draw.point(point, fill=GLINT if point == (2, 2) else SHADOW)
    return image, draw


def machine_face(kind: str) -> Image.Image:
    image, draw = block_panel()
    if kind == "side":
        draw.rectangle((4, 4, 6, 6), fill=STEEL)
        draw.rectangle((9, 4, 11, 6), fill=STEEL)
        draw.rectangle((4, 9, 6, 11), fill=STEEL)
        draw.rectangle((9, 9, 11, 11), fill=STEEL)
        draw.line([(7, 4), (7, 11)], fill=SHADOW)
    elif kind == "top":
        draw.rectangle((4, 4, 11, 11), outline=STEEL)
        draw.line([(5, 6), (10, 6)], fill=LIGHT)
        draw.line([(5, 8), (10, 8)], fill=SHADOW)
        draw.line([(5, 10), (10, 10)], fill="#d1a15c")
    elif kind == "bottom":
        draw.rectangle((4, 4, 11, 11), fill=INK)
        draw.line([(4, 4), (11, 11)], fill=SHADOW, width=2)
        draw.line([(11, 4), (4, 11)], fill=STEEL, width=2)
    elif kind == "copy":
        draw.rectangle((4, 5, 8, 10), fill="#4e8996")
        draw.rectangle((7, 4, 11, 9), fill="#a8e3df")
        draw.line([(8, 6), (10, 6)], fill="#2f6874")
        draw.line([(8, 8), (10, 8)], fill="#2f6874")
    elif kind == "dye":
        draw.polygon([(8, 4), (11, 9), (10, 11), (6, 11), (5, 9)], fill="#6d5178")
        draw.polygon([(8, 5), (10, 9), (9, 10), (7, 10), (6, 9)], fill="#bd8bc4")
        draw.point((7, 8), fill="#e4b8d8")
    elif kind == "fluid":
        draw.rectangle((5, 4, 10, 11), outline=LIGHT)
        draw.rectangle((6, 7, 9, 10), fill="#4d9cb2")
        draw.line([(6, 6), (9, 6)], fill="#9cdae0")
        draw.point((7, 8), fill="#9cdae0")
    else:  # void miner
        draw.ellipse((4, 4, 11, 11), fill="#765a9b")
        draw.ellipse((6, 6, 9, 9), fill=INK)
        draw.line([(7, 4), (8, 4)], fill="#c7a2d9")
        draw.point((7, 7), fill="#6ebec0")
    return image


def unlucky_block() -> Image.Image:
    image = Image.new("RGBA", (16, 16), INK)
    draw = ImageDraw.Draw(image)
    draw.rectangle((1, 1, 14, 14), fill="#7e5a3d")
    draw.line([(1, 1), (14, 1), (1, 14)], fill="#c69b59", width=2)
    draw.line([(14, 2), (14, 14), (2, 14)], fill="#463d36", width=2)
    draw.rectangle((3, 3, 12, 12), fill="#534944")
    draw.line([(5, 4), (11, 10)], fill="#9c6e47", width=3)
    draw.line([(10, 4), (4, 10)], fill="#e2bb72", width=3)
    draw.point((5, 4), fill="#f2d491")
    draw.point((10, 10), fill="#553d39")
    return image


def aura_machine() -> Image.Image:
    image, draw = block_panel()
    draw.rectangle((5, 4, 10, 11), outline="#a77a50")
    draw.ellipse((5, 5, 10, 10), fill="#3b745f")
    draw.ellipse((6, 6, 9, 9), fill="#81c993")
    draw.point((7, 6), fill="#c6e7b1")
    draw.line([(4, 7), (4, 9)], fill="#b98c56")
    draw.line([(11, 7), (11, 9)], fill="#805937")
    return image


def portal_fragment() -> Image.Image:
    image, draw = sprite(16)
    draw.polygon([(7, 1), (11, 3), (13, 8), (9, 14), (4, 12), (2, 7)], fill=INK)
    draw.polygon([(7, 2), (10, 4), (12, 8), (9, 13), (5, 11), (3, 7)], fill="#694b96")
    draw.polygon([(7, 2), (9, 4), (8, 9), (4, 7)], fill="#b589d1")
    draw.polygon([(9, 5), (11, 8), (9, 12), (8, 9)], fill="#483e73")
    draw.line([(5, 5), (7, 3), (8, 4)], fill="#e0b7df")
    draw.point((6, 7), fill="#d1a2d8")
    return image


def allthemodium_mesh() -> Image.Image:
    image, draw = sprite(16)
    draw.polygon([(5, 1), (11, 2), (14, 6), (12, 13), (6, 14), (2, 10), (2, 5)], fill=INK)
    draw.polygon([(5, 2), (11, 3), (13, 6), (11, 12), (6, 13), (3, 10), (3, 5)], fill="#9d753e")
    draw.line([(4, 6), (11, 6)], fill="#dfbc6b", width=2)
    draw.line([(4, 9), (11, 9)], fill="#d2a957", width=2)
    draw.line([(6, 3), (6, 12)], fill="#e6c775")
    draw.line([(9, 4), (9, 12)], fill="#8b633b")
    draw.point((5, 4), fill="#f2dc9a")
    return image


def barrier() -> Image.Image:
    image, draw = sprite(16)
    draw.line([(2, 12), (4, 3), (13, 3)], fill=INK, width=3)
    draw.line([(3, 12), (5, 4), (13, 4)], fill="#8b3e48", width=2)
    draw.line([(4, 11), (6, 5), (12, 5)], fill="#de7667", width=2)
    draw.point((6, 5), fill="#f1ae83")
    draw.point((3, 12), fill="#5d313f")
    return image


def missing_item(kind: str) -> Image.Image:
    image, draw = panel("#d8866d" if kind == "error" else "#a7b1d1")
    if kind == "error":
        draw.rectangle((5, 5, 10, 10), fill="#693f4b")
        draw.line([(6, 5), (9, 8), (7, 10)], fill="#e39a7d", width=2)
        draw.point((10, 10), fill="#b45052")
    else:
        draw.ellipse((5, 5, 10, 10), outline="#9bb6d1", width=1)
        draw.line([(8, 5), (8, 10), (10, 9)], fill="#dfd0a7", width=2)
        draw.point((6, 10), fill="#7f96b6")
    return image


def missing_block() -> Image.Image:
    image, draw = block_panel()
    draw.rectangle((5, 5, 10, 10), fill="#744750")
    draw.line([(5, 5), (8, 8), (6, 10)], fill="#ed9b7c", width=2)
    draw.point((10, 10), fill="#ad5158")
    return image


def edited_animation(name: str) -> Image.Image:
    with Image.open(ASSETS / "item" / f"{name}.png") as source:
        image = source.convert("RGBA")
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            red, green, blue, alpha = pixels[x, y]
            if alpha == 0:
                continue
            if name == "god_creation_keepsake":
                pixels[x, y] = (red, green, blue, 255 if alpha >= 128 else 0)
            elif name == "cosmic_coin" and min(red, green, blue) >= 246:
                pixels[x, y] = (226, 231, 221, 255)
    return image


def build() -> dict[str, Image.Image]:
    images: dict[str, Image.Image] = {
        "item/error_item.png": missing_item("error"),
        "item/music.png": missing_item("music"),
        "block/error_block.png": missing_block(),
        "block/unlucky_block.png": unlucky_block(),
        "block/aura_generate_machine.png": aura_machine(),
        "item/portal_fragment.png": portal_fragment(),
        "item/allthemodium_mesh.png": allthemodium_mesh(),
        "item/ruptured_barrier.png": barrier(),
        "item/speed_upgrade.png": upgrade("cyan"),
        "item/production_upgrade.png": upgrade("green"),
        "item/energy_upgrade.png": upgrade("amber"),
        "item/overclocking_upgrade.png": upgrade("violet"),
        "item/overload_upgrade.png": upgrade("coral"),
        "item/white_upgrade.png": upgrade("silver"),
        "item/god_creation_keepsake.png": edited_animation("god_creation_keepsake"),
        "item/cosmic_coin.png": edited_animation("cosmic_coin"),
    }
    for tier in range(1, 6):
        images[f"item/mineral_upgrade-{tier}.png"] = mineral_upgrade(tier)
    for filename, kind in (
        ("machine_side_custom", "side"),
        ("machine_top_customl", "top"),
        ("machine_void_bottom", "bottom"),
        ("copy_front", "copy"),
        ("dyeing_front", "dye"),
        ("fluid_processor_front", "fluid"),
        ("void_mining_front", "void"),
    ):
        images[f"block/{filename}.png"] = machine_face(kind)
    images["textures/item/ruptured_barrier.png"] = images["item/ruptured_barrier.png"]
    return images


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="install reviewed candidates")
    args = parser.parse_args()
    images = build()
    for relative, image in images.items():
        output = CANDIDATES / relative
        output.parent.mkdir(parents=True, exist_ok=True)
        image.save(output, optimize=True)
    if args.apply:
        for relative in images:
            target = ASSETS / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(CANDIDATES / relative, target)
    print(f"{'Applied' if args.apply else 'Built'} {len(images)} PNGs")


if __name__ == "__main__":
    main()
