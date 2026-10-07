# Path of Creation · 创世之径 Logo

更新日期：2026-10-07。当前版本为 V2，使用内置 image_gen 工具基于 V1 和现有标题图编辑生成。

- `path-of-creation-logo-v2.png`：1254×1254 高清方形原图。
- `path-of-creation-icon-256-v2.png`：256×256 PNG，用于启动器版本图标，由原图等比缩小。

新版加入 `config/fancymenu/assets/minecraft_title.png` 的紫红色立体标题设计，保留标题原有的 CREATION / OF / PATH 排列。冷灰色齿轮、青蓝方块和通向方块的阶梯构成主体，背景改为紫色虚空与悬浮空岛剪影。原始标题文件保持不变。

GitHub 根 README 使用 256×256 图标展示 Logo。

## 在 PCL 中使用

打开对应实例的「版本设置 → 概览」，将「图标」改为「自定义」，选择本目录的 `path-of-creation-icon-256-v2.png`。

PCL 会将图片保存到实例的 `PCL/Logo.png`，并在该实例 `PCL/Setup.ini` 中设置 `Logo:PCL\Logo.png` 和 `LogoCustom:True`。手动修改配置后，需要完整退出并重新打开 PCL 以刷新缓存。

本机实例已按上述配置安装图标。PCL 的个人设置仍保留在本地，仓库仅提交设计资源及说明。

## 历史版本

V1 的高清原图和 256×256 图标保留在同一目录，以便对比和恢复。

## V2 生成提示词

```text
Use case: compositing / logo-brand.
Asset type: one finished square launcher logo cover for the Minecraft technology skyblock modpack Path of Creation / 创世之径.
Input images: Image 1 is the previous square cog/cube/path logo and is the edit target. Image 2 is the user's existing transparent title graphic, a supporting insert that must be incorporated with its exact existing lettering, arrangement and magenta-purple block typography.
Primary request: revise Image 1 to feel natural, cohesive and professionally art-directed; incorporate Image 2 into the square image, and redesign the background.
Layout: create a bold cohesive emblem in the upper roughly 70 percent and the exact existing title graphic from Image 2 across the lower roughly 25 percent, separated with breathing room. Title nearly spans the width, preserves its original aspect ratio and is entirely visible. Reuse the supplied title graphic faithfully, with exactly the original words and layout "CREATION" above "PATH" with the small "OF" plaque between them. Do not reword or reverse the words. Do not add new text.
Emblem: retain the concept of a mechanical cog surrounding a luminous isometric voxel cube and a short ascending path. Redesign the oversized orange gold cog into clean brushed dark gunmetal and subtle pale metal bevels, with restrained purple edge reflections. Make the cyan cube have three flat clean block faces with a few broad voxel subdivisions. Use consistent orthographic voxel perspective and believable geometry for the cube and a short connected path of three ascending steps, all sharing one coherent perspective and attached to a small suspended industrial platform. The foreground path must look connected and structurally possible. The cog is an emblem framing this center, readable and symmetrical, and never collides with the title. Remove coarse mottled gold textures and reduce harsh blown-out glow.
Style: polished Minecraft voxel graphic art, crisp graphic silhouettes, controlled simple three-dimensional depth, stylized matte materials, subtle lighting; not photorealistic, not generic glossy AI art. Few large forms remain distinguishable at 40px.
Background: replace the plain navy backdrop with a designed atmospheric charcoal-to-deep-purple void, with a subtle soft violet halo behind the emblem, very faint distant floating-block silhouettes near the side margins, and sparse minimal stars. Quiet and clean; the emblem and title dominate. Match the purple/magenta visual language of the user's title graphic. Keep the cyan cube a complementary focal accent. No gold-orange dominant palette.
Invariants: keep a square canvas; use the exact supplied title design from Image 2 as a faithful inserted artwork, no spelling changes, no warping or clipped edges; retain the cog, cube, ascending-path concept from Image 1; do not alter or add any launcher UI.
Avoid: noise, gritty surfaces, excessive bloom, mismatched perspective, impossible disjoint steps, busy circuitry, tiny fasteners, floating random fragments in the foreground, large empty borders, white backgrounds, mockups, multiple options, watermarks. Output exactly one finished square logo image.
```

## V1 生成提示词

```text
Use case: logo-brand.
Asset type: square launcher icon for the Minecraft technology skyblock modpack "Path of Creation / 创世之径", intended to be displayed beside the version name in PCL at roughly 40 pixels, with a high resolution 1024x1024 master.
Primary request: create one original polished, memorable emblem that expresses creation from a single block, industrial automation, and an ascending path of technological progress.
Composition: a large centered emblem occupies about 82 percent of the square, with generous clean perimeter and a strong simple silhouette. A bold chunky copper-gold mechanical cog frames a single luminous cyan isometric voxel cube in its open center. From the lower foreground, a short broad angular ascending path of three blocklike steps leads into the cube, visually integrated with the cog. The cube is the primary focal point. Design these as one cohesive brand symbol, with very few large forms so it stays readable when tiny.
Style: premium stylized game emblem, crisp vector-like geometry with restrained beveled 3D depth, blocky Minecraft-inspired proportions, precise clean edges, controlled metal highlights, professional branding rather than a game scene.
Scene/backdrop: solid very dark navy square background, subtly lighter behind the emblem only, no busy scenery.
Palette: copper-gold and warm amber cog/path, bright turquoise-cyan cube, deep navy negative space.
Lighting: controlled glow confined to the cube and a subtle cyan reflected rim, warm metallic bevels on the cog, excellent figure-ground contrast.
Text: no letters, no typography, no words. The launcher already shows the modpack name beside the icon.
Constraints: exactly one finished square icon filling the canvas, no presentation board, no multiple options, no mockup, no thin circuitry, no tiny bolts, no particles, no galaxies, no grass, no tools crossed behind, no watermark, no existing modpack logos. Make it distinctive, geometric, and visually balanced.
```
