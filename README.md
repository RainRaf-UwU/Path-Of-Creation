# Path of Creation · 创世之径

简体中文 · [English](docs/en/README.md)

<p align="center">
  <img src="design/branding/path-of-creation-icon-256-v2.png" alt="创世之径" width="256" height="256">
</p>

创世之径是一个以科技和自动化为主的 Minecraft 空岛整合包。从虚空中的一个方块起步，靠方块交互和自定义配方获得资源，再沿着任务书建设产线、发展能源，逐步制作各阶段的终极物品。

[下载 v0.2.0](https://github.com/RainRaf-UwU/Path-Of-Creation/releases/tag/v0.2.0) · [全部版本](https://github.com/RainRaf-UwU/Path-Of-Creation/releases) · [反馈问题](https://github.com/RainRaf-UwU/Path-Of-Creation/issues) · [Discord 社区](https://discord.gg/KjrtbhCSf)

## 玩法

- 单方块空岛开局；通过方块交互、流体转化、雷击和传送门等方式获取资源。条件和产物可在任务书与 JEI 中查看。
- 科技路线包含机械动力、通用机械、应用能源 2、工业先锋、Oritech 和末影接口等模组。
- 自定义机器负责流体处理、复制、染色和虚空采矿；材料与升级串联各个发展阶段。
- 前五章共 448 个任务，支持简体中文和 English (US)。第六章仍在制作中。
- 客户端启动时检查正式版本，支持增量更新。

## 任务进程

| 阶段 | 章节 |
| --- | --- |
| 第一章 | 无中生有 |
| 第二章 | 苦尽甘来 |
| 第三章 | 虚空初光 |
| 第四章 | 创世之径 |
| 第五章 | 创造模式？ |
| 可选第六章 | 登神长阶（制作中） |

每章的终极物品关系到下一章的解锁。遇到陌生材料或特殊操作时，先读任务说明，再查看 JEI 的配方与用途。

## 安装

v0.2.0 使用 **Minecraft 1.21.1、NeoForge 21.1.255、Java 21**。

1. 在支持 NeoForge 的启动器中创建独立实例，安装上述游戏和加载器版本。
2. 在 [Release 页面](https://github.com/RainRaf-UwU/Path-Of-Creation/releases/tag/v0.2.0) 下载 `path-of-creation-update.zip`，解压到实例的游戏目录。
3. 使用 Skyblock Builder 的空岛世界类型创建世界，选择 **Rain** 岛屿模板。
4. 打开 FTB Quests 任务书，从“欢迎”和“第一章：无中生有”开始。

更新 ZIP 包含模组、脚本、配置和资源，需要启动器先装好 Minecraft、NeoForge 和 Java。GitHub 的 `Source code` 压缩包是源码快照，首次安装请使用专用更新 ZIP。

## 更新已有实例

启动游戏后，更新器会提示新版本。选择“立即更新”，等待下载与校验完成，再点击“退出并安装”。安装结束后从启动器重新启动。

更新器优先下载适用的增量包，必要时使用完整包。旧更新器第一次升级需要下载完整包。存档、额外模组和常见个人设置会保留，被替换的文件会备份；升级前请备份重要存档。Minecraft 或 NeoForge 版本变化时，需要在启动器中调整环境。完整说明见 [自动更新 README](tools/poc-updater/README.md)。

## 语言与图标

在“选项 → 语言”中选择简体中文或 **English (US)**，FTB Quests 的语言覆盖选项保持空白，再重开任务书。自定义物品、提示、剧情和更新界面会随游戏语言切换。

PCL 的版本图标可使用 `config/fancymenu/assets/pack_icon.png`。Release 也提供 256×256 图标和高清 Logo。

## v0.2.0 更新

- 新增 47 个 JEI 展示配方，涵盖世界交互、数据模型、钓鱼与雷击转化。
- 调整背包、合成、JEI、任务书与快捷栏界面，加入主菜单和世界加载页面装饰。
- 加入星核光标、青蓝双环点击特效、按钮音效与主菜单音乐《虚空初光》。
- “提示与技巧”扩展到 36 条；第三章更名为“虚空初光”。
- 加入增量更新、完整包回退、文件校验与安装失败回滚。

完整更新记录见 [各版本 Release](https://github.com/RainRaf-UwU/Path-Of-Creation/releases)。

## 项目结构与维护

| 目录 | 内容 |
| --- | --- |
| `kubejs/server_scripts` | 配方、资源获取、游戏事件与自定义机器逻辑 |
| `kubejs/startup_scripts` | 自定义物品、方块及启动注册 |
| `kubejs/client_scripts` | 客户端脚本 |
| `kubejs/assets` / `kubejs/data` | 贴图、模型、语言文件、数据与配方定义 |
| `config/ftbquests/quests` | 任务章节、依赖与中英文文本 |
| `config/skyblockbuilder` | 空岛生成配置与模板 |
| `mods` | 当前模组文件 |
| [tools/poc-updater](tools/poc-updater/README.md) | 自动更新模组源码、发布与安装说明 |
| `tools/poc-cursor` | 专属光标源码与素材 |

正式更新包由 [GitHub Actions](.github/workflows/poc-update-release.yml) 打包发布；操作步骤见 [自动更新 README](tools/poc-updater/README.md)。修改玩法后，需要重载游戏并检查对应的生存流程。

## 致谢

感谢各位模组作者和贡献者，让这个整合包得以完成。感谢 [CFPAOrg 模组简体中文翻译项目](https://github.com/CFPAOrg/Minecraft-Mod-Language-Package) 与汉化贡献者提供的译文，也感谢参与试玩和反馈的玩家。

<details>
<summary>模组列表（261 个 JAR，含依赖库与整合包自定义模组）</summary>

| 模组 | 作者 |
| --- | --- |
| AE2无线终端 · [AE2WTLib](https://github.com/Mari023/AE2WirelessTerminalLibrary/issues) | mari_023, Ridanisaurus |
| AE2输入输出卡 · [AE2 Import Export Card](https://www.curseforge.com/minecraft/mc-mods/ae2-import-export-card) | Ultramega |
| Corail 的墓碑 · [Corail Tombstone](https://www.curseforge.com/minecraft/mc-mods/corail-tombstone/) | Corail31 |
| FTB 区块 · [FTB Chunks](https://go.ftb.team/support-mod-issues) | FTB Team |
| FTB 团队 · [FTB Teams](https://go.ftb.team/support-mod-issues) | FTB Team |
| FTB任务 · [FTB Quests](https://github.com/FTBTeam/FTB-Mods-Issues/issues) | FTB Team |
| FTB备份2 · FTB Backups 2 | CreeperHost |
| JEI物品管理器 · [Just Enough Items](https://www.curseforge.com/minecraft/mc-mods/jei) | mezz |
| KubeJS 离线文档 · [KubeJS Offline](https://www.curseforge.com/minecraft/mc-mods/kubejs-offline) | ILIKEPIEFOO2 |
| MEGA存储单元 · [MEGA Cells](https://github.com/62832/MEGACells/issues) | — |
| ME无限元件 · MEInfinityCell | Y_Xiao233 |
| Minecraft Chromium 嵌入式框架 · [MCEF (Minecraft Chromium Embedded Framework)](https://github.com/CinemaMod/mcef/issues) | — |
| OMNI 存储元件 · AE Omni Cells | Frostbite(Code), MHanHanBing(Art) |
| RF工具：基础 · [RFToolsBase](http://github.com/McJtyMods/RFToolsBase/issues) | — |
| RF工具：存储 · [RFToolsStorage](http://github.com/McJtyMods/RFToolsStorage/issues) | — |
| RF工具：实用设备 · [RFToolsUtility](http://github.com/McJtyMods/RFToolsUtility/issues) | — |
| RF工具：能量 · [RFToolsPower](http://github.com/McJtyMods/RFToolsPower/issues) | — |
| YUNG的末地岛屿优化 · [YUNG's Better End Island](https://www.curseforge.com/minecraft/mc-mods/yungs-better-end-island-neoforge) | YUNGNICKYOUNG, Acarii |
| 不同寻常的末地 · [Unusual End](https://www.curseforge.com/members/sweetygamer/projects) | Sweetygamer, SashaKYotoz |
| 传送石碑／指路石 · [Waystones](https://mods.twelveiterations.com/minecraft/waystones) | BlayTheNinth |
| 传送门嬗变 · PortalTransform | QiHuang02 |
| 修复GPU内存泄漏 · Gpu memory leak fix | Someaddon |
| 傻瓜烹饪／懒人厨房 · [Cooking for Blockheads](https://mods.twelveiterations.com/minecraft/cookingforblockheads) | BlayTheNinth |
| 公开GUI显示 · Public GUI Announcement | AbsolemJackdaw |
| 农场贸易 · [Farming for Blockheads](https://mods.twelveiterations.com/minecraft/farming-for-blockheads) | BlayTheNinth |
| 农夫乐事 · [Farmer's Delight](https://github.com/vectorwing/FarmersDelight) | vectorwing |
| 冰山 · [Iceberg](https://anthonyhilyard.com/) | Grend |
| 刷怪塔实用设备 · Mob Grinding Utils | vadis365, flanks255 |
| 功能性存储 · Functional Storage | Buuz135, Rid |
| 加速火把非官方版 · Torcherino | LukeGrahamLandry#6888, NinjaPhenix, sci4me, Moze_Intel, skniro |
| 动态 FPS · [Dynamic FPS](https://dapprgames.com/mods) | juliand665 & LostLuma |
| 动态联合／集成动力 · [IntegratedDynamics](https://github.com/CyclopsMC/IntegratedDynamics/issues) / [IntegratedDynamics-Compat](https://github.com/CyclopsMC/IntegratedDynamics/issues) | — |
| 合成拓展 · [Extended Crafting](https://blakesmods.com/extended-crafting) | BlakeBr0 |
| 合成树 · AE2:Crafting Tree | Neuvillette |
| 合成辅助 · [Crafting Tweaks](https://mods.twelveiterations.com/mc/craftingtweaks) | BlayTheNinth |
| 圣遗物 · [Reliquary Reincarnations](https://www.curseforge.com/minecraft/mc-mods/reliquary-reincarnations) | P3pp3rF1y |
| 垃圾桶 · [Trash Cans](https://www.curseforge.com/minecraft/mc-mods/trash-cans) | SuperMartijn642 |
| 垃圾槽 · [TrashSlot](https://mods.twelveiterations.com/minecraft/trashslot) | BlayTheNinth |
| 多态合成 · [Polymorph](https://github.com/illusivesoulworks/polymorph) | Illusive Soulworks |
| 天境 · [The Aether](https://modrinth.com/mod/aether) | AlphaMode, baguchi, bconlon, Blodhgarm, Burning Cactus, Drullkus, Hugo Payn, Jaryt, Katie 'Oz' Payn, quek, Raptor, reetam, RENREN, sunsette |
| 奇异饰品 · [Artifacts](https://www.curseforge.com/minecraft/mc-mods/artifacts) | ochotonida |
| 实用拓展 · [Actually Additions](https://github.com/Ellpeck/ActuallyAdditions) | Ellpeck |
| 寂静装备 · [Silent Gear](https://github.com/SilentChaos512/Silent-Gear/issues) | SilentChaos512 |
| 封包合成 · [PackagedAuto](https://www.curseforge.com/minecraft/mc-mods/packagedauto) | TheLMiffy1111 |
| 封包合成拓展 · [PackagedExCrafting](https://www.curseforge.com/minecraft/mc-mods/packagedexcrafting) | TheLMiffy1111 |
| 封包无尽贪婪 · [PackagedAvaritia:Re](https://www.curseforge.com/minecraft/mc-mods/packagedavaritia) | TheLMiffy1111 |
| 封包龙之进化 · [PackagedDraconic](https://www.curseforge.com/minecraft/mc-mods/packageddraconic) | TheLMiffy1111 |
| 工业先锋 · Industrial Foregoing | Buuz135 |
| 工业先锋：更多升级 · Industrial Foregoing: Extra Upgrades | Y_Xiao233 |
| 帕秋莉手册 · [Patchouli](https://github.com/VazkiiMods/Patchouli) | Vazkii |
| 应用能源2 · [Applied Energistics 2](https://appliedenergistics.org) | Team AppliedEnergistics |
| 应用能源：通用机械附属 · [Applied Mekanistics](https://github.com/AppliedEnergistics/Applied-Mekanistics#readme) | ramidzkh |
| 应用通量 · [AppliedFlux](https://github.com/GlodBlock/ExtendedAE) | GlodBlock |
| 建筑小帮手 · [Building Gadgets 2](https://github.com/Direwolf20-MC/BuildingGadgets2) | Direwolf20 |
| 建筑棒 · [Construction Sticks](https://github.com/Mrbysco/ConstructionSticks) | Mrbysco, ShyNieke |
| 护甲上限突破 · OverloadedArmorBar | Jared |
| 探险者指南针 · [Explorer's Compass](https://github.com/MattCzyr/ExplorersCompass) | ChaosTheDude |
| 搬运 · Carry On | Tschipp, PurpliciousCow |
| 新生乐事 · Ars Nouveau's Flavors & Delight | lcy0x1 |
| 新生魔艺 · [Ars Nouveau](https://github.com/baileyholl/Ars-Nouveau) | Bailey Hollingsworth |
| 旅行地图 · [Journeymap](http://journeymap.info) | Techbrew, Mysticdrew |
| 无尽贪婪：重生 · [Re-Avaritia](https://www.curseforge.com/minecraft/mc-mods/re-avaritia) | cnlimiter, IAFEnvoy, Asek3, MikhailTapio, cu6, NadienDev |
| 日光通量：重制版 · [Solar Flux Reborn](https://modrinth.com/mod/4QG5lev4) | Zeitheron |
| 更多功能性存储 · More Functional Storage | Matyrobbrt |
| 更多动画 · [NotEnoughAnimations](https://modrinth.com/mod/not-enough-animations) | tr7zw |
| 更多熔炉 · Iron Furnaces | Qelifern (pizzaatime), XenoMustache |
| 更多盔甲纹饰 · More Armor Trims | Masik16u |
| 更多空间／压缩空间 · [Compact Machines](https://compactmods.dev) | Davenonymous, RobotGryphon |
| 更多魔杖 · [Not Enough Wands](http://github.com/romelo333/notenoughwands1.8.8/issues) | — |
| 更好的进度 · [Better Advancements](https://www.curseforge.com/minecraft/mc-mods/better-advancements) | way2muchnoise |
| 更美观的血条 · [Colorful Hearts](https://github.com/Terrails/colorful-hearts) | Terrails |
| 末影接口 · [Ender IO](https://enderio.com/) | CrazyPants, tterrag, HenryLoenwind, MatthiasM, CyanideX, EpicSquid, Rover656, HypherionSA, liliandev, Ferri_Arnus, dphaldes |
| 机械动力 · [Create](https://www.curseforge.com/minecraft/mc-mods/create) | simibubi |
| 村民物品化／简单村民 · [Easy Villagers](https://www.curseforge.com/minecraft/mc-mods/easy-villagers) | Max Henkel |
| 极简血量显示 · [Neat](https://github.com/VazkiiMods/Neat) | Vazkii, Uraneptus |
| 植物盆栽 · [BotanyPots](https://www.curseforge.com/minecraft/mc-mods/botany-pots) | Darkhax |
| 模块化路由器 · [Modular Routers](https://github.com/desht/ModularRouters/issues) | — |
| 模组秘典 · [Modonomicon](https://www.curseforge.com/minecraft/mc-mods/modonomicon) | Kli Kli |
| 永恒之门 · Gateways To Eternity | Shadows_of_Fire |
| 永恒能力 · [EverlastingAbilities](https://github.com/CyclopsMC/EverlastingAbilities/issues) | — |
| 沉浸工程 · [Immersive Engineering](https://minecraft.curseforge.com/projects/immersive-engineering/) | BluSunrize and Damien A.W. Hazard |
| 火炬大师 · Torchmaster | Xalcon |
| 物品缩放 · [Item Zoom](https://github.com/mezz/ItemZoom/issues?q=is%3Aissue) | — |
| 物品边框 · [Item Borders](https://anthonyhilyard.com/) | Grend |
| 犀牛 · [Rhino](https://kubejs.com) | latvian.dev, Mozilla |
| 玉 🔍 · [Jade](https://www.curseforge.com/minecraft/mc-mods/jade) | Snownee |
| 神秘农业 · [Mystical Agriculture](https://blakesmods.com/mystical-agriculture) | BlakeBr0 |
| 神秘农业扩展 · [Mystical Agradditions](https://blakesmods.com/mystical-agradditions) | BlakeBr0 |
| 神秘学 · [Occultism](https://www.curseforge.com/minecraft/mc-mods/occultism) | Kli Kli |
| 空岛建立者 · [Skyblock Builder](https://github.com/ChaoticTrials/SkyblockBuilder) | MelanX |
| 窗帘 · [curtain](https://github.com/Gu-ZT/Curtain/issues) | Gugle |
| 简易磁铁 · [Simple Magnets](https://www.curseforge.com/minecraft/mc-mods/simple-magnets) | SuperMartijn642 |
| 精妙存储 · [Sophisticated Storage](https://www.curseforge.com/minecraft/mc-mods/sophisticated-storage) | P3pp3rF1y, Ridanisaurus |
| 精妙核心 · [Sophisticated Core](https://www.curseforge.com/minecraft/mc-mods/sophisticated-core) | P3pp3rF1y |
| 精妙背包 · [Sophisticated Backpacks](https://www.curseforge.com/minecraft/mc-mods/sophisticated-backpacks) | P3pp3rF1y, Ridanisaurus |
| 红石笔 · [Redstone Pen](https://github.com/stfwi/redstonepen) | wilechaote |
| 经验机制改革 · [Clumps](https://www.curseforge.com/minecraft/mc-mods/clumps) | Jared |
| 群星 · [Stellaris](https://github.com/st0x0ef/Stellaris/issues) | The Stellaris Team |
| 自动汉化更新 · [I18nUpdateMod](https://github.com/xfl03/I18nUpdateMod3) | [{'name': 'xfl03', 'contact': {'homepage': 'https://github.com/xfl03'}}] |
| 自动连点器 · Click Machine | Shadows_of_Fire |
| 自然灵气 · NaturesAura | Ellpeck |
| 自然罗盘／生物群系指南针 · [Nature's Compass](https://github.com/MattCzyr/NaturesCompass) | ChaosTheDude |
| 苹果皮 · [AppleSkin](https://github.com/squeek502/AppleSkin) | squeek |
| 试验假人 · [MmmMmmMmmMmm](https://github.com/MehVahdJukaar/DuMmmMmmy/issues) | Mehvahdjukaar, Bonusboni, Gooigipunch, Plantkillable |
| 超立方体 · [Tesseract](https://www.curseforge.com/minecraft/mc-mods/tesseract) | SuperMartijn642 |
| 跳舞生长一切 · Twerk It Meal | TicTicBoom |
| 连锁破坏 · [FTB Ultimine](https://go.ftb.team/support-mod-issues) | FTB Team |
| 通用拼音搜索 · [Just Enough Characters](https://github.com/Towdium/JustEnoughCharacters) | Towdium, yzl210, Death-123, vfyjxf_ |
| 通用机械 · [Mekanism](https://aidancbrady.com/mekanism/) | Aidancbrady, Thommy101, Thiakil, pupnewfster, dizzyd |
| 通用机械发电机 · [Mekanism: Generators](https://aidancbrady.com/mekanism/) | Aidancbrady, Thommy101, Thiakil, pupnewfster, dizzyd |
| 通用机械工具 · [Mekanism: Tools](https://aidancbrady.com/mekanism/) | Aidancbrady, Thommy101, Thiakil, pupnewfster, dizzyd |
| 通用机械附加 · [Mekanism: Additions](https://aidancbrady.com/mekanism/) | Aidancbrady, Thommy101, Thiakil, pupnewfster, dizzyd |
| 通用机械：扩展 · [MekanismExtras](https://github.com/lostmyself8/Mekanism-Extras) | Lost Myself |
| 通用机械：更多机器 · [Mekanism: MoreMachine](https://github.com/lostmyself8/Mekanism-MoreMachine) | Lost Myself |
| 通量网络 · [Flux Networks](https://www.curseforge.com/minecraft/mc-mods/flux-networks) | Sonar Sonic, BloCamLimb |
| 配置界面 · [Configured](https://mrcrayfish.com/mods?id=configured) | MrCrayfish |
| 钛 · Titanium | — |
| 钠 · Sodium | JellySquid (jellysquid3), IMS212 |
| 锤子核心 · [HammerLib](https://modrinth.com/mod/PlkSuVtM) | Zeitheron |
| 键位冲突显示 · [Controlling](https://www.curseforge.com/minecraft/mc-mods/controlling) | Jaredlll08 |
| 附魔描述 · [EnchantmentDescriptions](https://www.curseforge.com/minecraft/mc-mods/enchantment-descriptions) | Darkhax |
| 雅言订正／聊天内容替换 · Cute Words | Rinko1231 |
| 集成合成学 · [IntegratedCrafting](https://github.com/CyclopsMC/IntegratedCrafting/issues) | — |
| 集成管道 · [IntegratedTunnels](https://github.com/CyclopsMC/IntegratedTunnels/issues) / [IntegratedTunnels-Compat](https://github.com/CyclopsMC/IntegratedTunnels/issues) | — |
| 集成终端 · [IntegratedTerminals](https://github.com/CyclopsMC/IntegratedTerminals/issues) / [IntegratedTerminals-Compat](https://github.com/CyclopsMC/IntegratedTerminals/issues) | — |
| 高级AE · [Advanced AE](https://github.com/pedroksl/AdvancedAE/issues) | Pedroksl |
| 高级战利品信息显示 · [AdvancedLootInfo](https://github.com/yanny7/advancedlootinfo/issues) | Yanny |
| 鼠标手势 · [Mouse Tweaks](https://minecraft.curseforge.com/projects/mouse-tweaks) | Ivan Molodetskikh (YaLTeR) |
| 龙之进化／龙之研究 · Draconic Evolution | brandon3055 |
| [QuarryPlus](https://github.com/Kotori316/QuarryPlus) | Kotori316 |
| [AdvancedCoreInfo](https://github.com/yanny7/advancedlootinfo) | Yanny |
| AE2 JEI Integration | Tamaized, mezz |
| [AE2NetworkAnalyzer](https://github.com/GlodBlock/ExtendedAE) | GlodBlock |
| [AE2 QoL Recipes](https://github.com/Christofmeg/AE2-QoL-Recipes) | Christofmeg, Lafen99 |
| AEInfinityBooster | Hexeption |
| Allthemodium | thevortex, whatthedrunk |
| AllTheOres | thevortex, whatthedrunk, Satherov |
| [AntiBlocksReChiseled](https://github.com/manmaed/AntiBlocksReChiseled/issues) | manmaed |
| Apothic Attributes | Shadows_of_Fire |
| Apothic Enchanting | Shadows_of_Fire |
| Apothic Spawners | Shadows_of_Fire |
| AppliedSoul | Y_Xiao233 |
| [Architectury](https://github.com/shedaniel/architectury/issues) | shedaniel |
| [Ars Additions](https://github.com/Jarva/Ars-Additions/issues) | Jarva |
| [Ars Caelum](https://github.com/baileyholl/ars-caelum/issues) | Bailey |
| [Ars Creo](https://github.com/baileyholl/ars-creo/issues) | Bailey |
| [Ars Ocultas](https://github.com/dphaldes/Ars-Ocultas/issues) | mystchonky |
| [Ars Énergistique](https://github.com/62832/ArsEnergique/issues) | — |
| [Athena](https://modrinth.com/mod/athena-ctm) | ThatGravyBoat |
| [Balm](https://mods.twelveiterations.com/) | BlayTheNinth |
| [Bookshelf](https://www.curseforge.com/minecraft/mc-mods/bookshelf) | Darkhax |
| [Brandon's Core](https://github.com/Draconic-Inc/BrandonsCore) | brandon3055 |
| [Cloth Config v15 API](https://github.com/architectury/ClothConfig/issues/) | — |
| Cobblegen Galore | LobsterJonn |
| [CodeChicken Lib](https://www.curseforge.com/minecraft/mc-mods/codechicken-lib-1-8) | ChickenBones, covers1624 |
| [CommonCapabilities](https://github.com/CyclopsMC/CommonCapabilities/issues) | — |
| [Cryonic Config](https://github.com/matthewperiut/cryonicconfig/issues) | Slainlight |
| [Cucumber Library](https://blakesmods.com/cucumber) | BlakeBr0 |
| Cupboard mod | Someaddon |
| [Curios API](https://github.com/TheIllusiveC4/Curios) | C4 |
| [Custom Machinery](https://www.curseforge.com/minecraft/mc-mods/custom-machinery) | Frinn |
| [Custom Machinery Mekanism](https://www.curseforge.com/minecraft/mc-mods/custom-machinery-mekanism) | Frinn |
| [Cyclops Core](https://github.com/CyclopsMC/CyclopsCore/issues) | — |
| DailyShop | KaptainWutax |
| Dank Storage | Tfarcenim |
| [Default World Type](https://github.com/ChaoticTrials/DefaultWorldType) | MelanX |
| [DimStorage](https://github.com/Edivad99/DimStorage/issues) | Edivad99 |
| [Dis-Enchanting Table](https://github.com/Cursee-Development) | Lupin, Jason13 |
| [EdivadLib](https://github.com/Edivad99/EdivadLib/issues) | Edivad99 |
| [Entangled](https://www.curseforge.com/minecraft/mc-mods/entangled) | SuperMartijn642 |
| [ExtendedAE](https://github.com/GlodBlock/ExtendedAE) | GlodBlock |
| [ExtendedAE-Plus](https://github.com/GaLicn/ExtendedAE_Plus) | GaLi |
| FancyMenu | Keksuccino |
| FlowTech | BlockLogic Modding |
| [Forgified Fabric API](https://github.com/Sinytra/ForgifiedFabricAPI) / [Forgified Fabric API (dummy)](https://github.com/Sinytra/ForgifiedFabricAPI) | Sinytra, FabricMC |
| [FTB Filter System](https://www.curseforge.com/minecraft/mc-mods/ftb-filter-system) | FTB Team |
| FTB Jei Extras | FTB Team |
| [FTB Library](https://go.ftb.team/support-mod-issues) | FTB Team |
| FTB XMod Compat | FTB Team |
| [Fusion](https://www.curseforge.com/minecraft/mc-mods/fusion-connected-textures) | SuperMartijn642 |
| [GeckoLib 4](http://geckolib.com/) | Gecko, Eliot, AzureDoom, DerToaster, Tslat, Witixin |
| [Glassential-renewed](https://www.curseforge.com/minecraft/mc-mods/glassential-renewed) | Big_Energy |
| [Glodium](https://github.com/GlodBlock/Glodium) | GlodBlock |
| [GuideME](https://github.com/AppliedEnergistics/GuideME/) | — |
| Hostile Neural Networks | Shadows_of_Fire |
| [Hyperbox](https://www.curseforge.com/minecraft/mc-mods/hyperbox) | Commoble |
| [Immersive Energistics](https://github.com/AppliedEnergistics/Immersive-Energistics) | Technici4n |
| Industrial Foregoing Souls | Buuz135, Rid |
| Industrial Foregoing Additional | MrPup(minecraftkus) |
| Iris Flywheel Compat | Leon |
| Iris | coderbot, IMS212 |
| [Item Collectors](https://www.curseforge.com/minecraft/mc-mods/item-collectors) | SuperMartijn642 |
| [Jade Addons](https://www.curseforge.com/minecraft/mc-mods/jade-addons) | Snownee |
| Just Enough Immersive Multiblocks | sguest |
| [JourneyMap Integration](https://www.curseforge.com/minecraft/mc-mods/journeymap-integration) | frankV |
| Just Dire Things | Direwolf20 |
| [Just Enough Mekanism Multiblocks](https://curseforge.com/minecraft/mc-mods/just-enough-mekanism-multiblocks) | gisellevonbingen |
| [Just Enough Resources](https://www.curseforge.com/minecraft/mc-mods/just-enough-resources-jer) | way2muchnoise |
| [Kiwi Library](https://www.curseforge.com/minecraft/mc-mods/kiwi) | Snownee |
| Konkrete | Keksuccino |
| Kotlin for Forge | — |
| [KubeJS Mekanism](https://kubejs.com) | latvian.dev |
| [KubeJS](https://kubejs.com) | latvian.dev |
| [KubeJS Actually Additions](https://github.com/AlmostReliable/kubejs_actuallyadditions/issues) | Almost Reliable |
| KubeJS Assets Override | HP |
| KubeJS Nature's Aura | FalAut |
| kubejsarsnouveau | Bob Varioa |
| KubeJS Powah | BobVarioa |
| [LaserIO](https://github.com/Direwolf20-MC/LaserIO) | Direwolf20, ErrorMikey |
| [libIPN](https://github.com/blackd/libIPN) | Mirinimi |
| [LibX](https://github.com/ModdingX/LibX) | ModdingX |
| [LootJS](https://github.com/AlmostReliable/lootjs/issues) | AlmostReliable |
| [Lychee Tweaker](https://www.curseforge.com/minecraft/mc-mods/lychee) | Snownee |
| [MaxHealthFix](https://www.curseforge.com/minecraft/mc-mods/max-health-fix) | Darkhax |
| [McJtyLib](http://github.com/McJtyMods/McJtyLib/issues) | — |
| [Mekanism Unleashed](https://www.curseforge.com/minecraft/mc-mods/mekanism-unleashed) | WhitePhantom |
| Mekanistic Routers | Matyrobbrt |
| Melody | Keksuccino |
| [ME Requester](https://github.com/AlmostReliable/merequester/issues) | Almost Reliable |
| [More Industrial Foregoing Addons](https://github.com/Christofmeg/MoreIndustrialForegoingAddons) | Christofmeg |
| [MonoLib](https://github.com/Mods-For-Lupin/MonoLib) | Lupin, Jason13 |
| [Moonlight Lib](https://github.com/MehVahdJukaar/moonlight/issues) | MehVahdJukaar |
| [Mystical Customization](https://blakesmods.com/mystical-customization) | BlakeBr0 |
| [Occultism KubeJS](https://www.curseforge.com/minecraft/mc-mods/occultism-kubejs) | Kli Kli |
| Oracle Index | Me! - Rearth |
| [Oritech](https://github.com/Rearth/Oritech/issues) | Me! - Rearth |
| Oritech Things | Lumengrid,muroalparco,MtcLeo05,DevDyna,Sirios_dev |
| oωo | glisco, Blodhgarm, BasiqueEvangelist, Noaaan |
| [Pipez](https://www.curseforge.com/minecraft/mc-mods/pipez) | Max Henkel |
| Placebo | Shadows_of_Fire |
| [Plushie Mod](https://github.com/Link4real/Plushie-Mod/issues) | Link4real, Vento |
| [创世之径 · 光标](https://github.com/RainRaf-UwU/Path-Of-Creation) | RainRaf-UwU |
| [创世之径自动更新](https://github.com/RainRaf-UwU/Path-Of-Creation) | RainRaf-UwU |
| [Polymorphic Energistics](https://github.com/62832/PolymorphicEnergistics/issues) | — |
| [PolyLib](https://github.com/CreeperHost/PolyLib/issues) | CreeperHost |
| [Potentials](https://github.com/Fej1Dev/Potentials/issues) | Fej1Fun |
| [Powah](https://www.curseforge.com/minecraft/mc-mods/powah-rearchitected) | owmii,Technici4n,shartte |
| [PrickleMC](https://www.curseforge.com/minecraft/mc-mods/prickle) | Darkhax |
| [Prism](https://anthonyhilyard.com/) | Grend |
| [ProbeJS](https://github.com/Prunoideae/ProbeJS) | Prunoideae |
| Property Modifier | IchHabeHunger54 |
| [Psi](https://github.com/VazkiiMods/Psi/issues) | Vazkii, Wiiv, WireSegal, Kamefrede, Williewillus, Hubry, Dudblockman, TheidenHD |
| [Pylons](https://www.curseforge.com/minecraft/mc-mods/pylons) | — |
| Path of Creation ME Controller Size | — |
| RenderJS | chen_1335 |
| [Replay Mod](https://github.com/ReplayMod/ReplayMod/issues) | — |
| ScalableCatsForce | — |
| [Searchables](https://www.curseforge.com/minecraft/mc-mods/searchables) | Jaredlll08 |
| [Shrink](https://github.com/gigabit101/Shrink/issues) | Gigabit101 |
| [Silent Lib](https://github.com/SilentChaos512/SilentLib/issues) | SilentChaos512 |
| [Sky GUIs](https://wiki.chaotictrials.de/swl/sky-guis) | MelanX |
| [SmartBrainLib](https://github.com/Tslat/SmartBrainLib/issues) | Tslat |
| Soulplied Energistics | Buuz135 |
| [Super Factory Manager (SFM)](https://github.com/TeamDman/SuperFactoryManager/issues) | TeamDman |
| [SuperMartijn642's Config Library](https://www.curseforge.com/minecraft/mc-mods/supermartijn642s-config-lib) | SuperMartijn642 |
| [SuperMartijn642's Core Lib](https://www.curseforge.com/minecraft/mc-mods/supermartijn642s-core-lib) | SuperMartijn642 |
| Time In A Bottle | RealMangoRage, MangoRage |
| [Time in a bottle Curio Support](https://www.curseforge.com/minecraft/mc-mods/time-in-a-bottle-curio-support) | MangoRage, bananasplit50, JustDoom |
| Utilitarian | LobsterJonn |
| [XNet](http://github.com/McJtyMods/XNet/issues) | — |
| [YUNG's API](https://www.curseforge.com/minecraft/mc-mods/yungs-api-neoforge) | YUNGNICKYOUNG |

名单按当前 `mods` 目录整理；作者署名取自模组元数据，未注明的以“—”表示。各项目链接提供作者资料、源码或反馈入口。

</details>

## 反馈与许可

请在 [Issue](https://github.com/RainRaf-UwU/Path-Of-Creation/issues) 中注明整合包版本、复现步骤，并附上相关日志或截图；上传前移除账户等个人信息。

本仓库原创代码按 [MIT License](LICENSE) 发布。第三方模组、资源包与光影遵循各自许可；CFPAOrg 译文遵循其 [CC BY-NC-SA 4.0 许可](https://github.com/CFPAOrg/Minecraft-Mod-Language-Package/blob/main/LICENSE)。
