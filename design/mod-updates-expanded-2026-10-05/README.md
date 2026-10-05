# 扩大模组更新记录 · 2026-10-05

本记录为本次修改的最终版本，包含上一轮 9 项更新和本轮 165 项更新，共 **174 项实际模组更新**。新增必要依赖 **ACI 1.3.0**，最终顶层 `mods` 共 **258 个 JAR**。Minecraft 保持 **1.21.1**；NeoForge 从 **21.1.209 升至 21.1.255**；游戏使用 Java 21。

**已同步到 PCL 实际实例：`E:/minecraft/versions/Path of Creation 创世之径 v0.0.4`。** 原实例中的全部 258 个 JAR 与工作树逐个通过 SHA512 对照；相关配置、JS、数据配方、启动 JSON 及 PCL 的加载器版本缓存也已同步。正在打开的 PCL 页面可能保留旧列表，重新打开版本设置即可重新读取。

更新采用对应 Minecraft / NeoForge 的作者发布文件。部分科技模组只发布 beta 分支，沿用其官方分支并实际启动验证；LibX 原本也是 alpha 分支。没有对应新版、已为当前版本或候选改变模组 ID 的文件保留现状。

## 核心更新

- Create：6.0.6 → 6.0.10；Mekanism 及三个官方附属模块：10.7.16.82 → 10.7.19.85。
- KubeJS：2101.7.1-build.181 → 2101.7.2-build.377；Rhino、JEI 和对应脚本附属模组一起更新。
- AdvancedAE、ExtendedAE、ExtendedAE Plus、Applied Flux、Oritech、Industrial Foregoing、Ender IO、FTB 系列等均纳入更新。
- 每个更新文件的版本、作者发布链接、下载链接及 SHA512 见下表与 [manifest.json](manifest.json)。

## 兼容修改

- `kubejs/startup_scripts/main.js`：ME Infinity Cell 的 `KeyList.of()` 改为新版 `KeyList.create()`，迁移两处注册，保留元件 ID 和物品列表。
- `kubejs/server_scripts/Portal_Transform/the_aether.js`：新版加入生物群系等参数条件；将两处转换概率改为 `.chance(0.5)`，保留 50% 概率，避免被误当作生物群系。
- Oritech 的 assembler、atomicforgr、foundry 配方 schema：将旧式列表与注册表元素字符串迁移为 KubeJS 7.2 组件对象，保留字段与默认值。
- `kubejs/data/botanypots/recipe/allthemodium/crop/ancient_soulberries.json`：保留实际存在的灵魂莓播种输入，去除新版 Allthemodium 不再注册的植物物品引用，保留产出和显示规则。
- JEI 配置：清理 `crashingTestItemsEnabled` 与书签列表的两个废弃键；原料列表中仍有效的同名设置保留。
- 上一轮猫渲染回调的 NeoForge 原生事件修复继续保留。

## 保留或限制的版本

- Sodium 0.6.13 / Iris 1.8.12：Sodium 0.8 删除了现有 Iceberg 依赖的顶点接口；新版 Iris 针对 Sodium 0.8，保留现有兼容组合。
- Iris Flywheel Compat：2.0.5 → 2.1.2；2.3.x / 2.4.0 声明了不存在的 access transformer 路径，未采用。
- Ars Delight：2.1.9 → 2.2.1；2.2.2 / 2.2.3 引用未注册的派方块，使 Farmer’s Delight / Create 标签加载失败。
- Unusual End：保留 2.2.1；2.3.1b 引用缺失的 Blueprint 盔甲纹饰材料。较早的 2.2.1r 与原 JAR 字节一致，不计为更新，也无需新增 Blueprint。
- RenderJS：保留已安装的 2101.2.3 分支；可查到的官方文件属于更早的不同分支。

## 尺寸设置

量子计算机 `quantumComputerMaxSize = 10`；ME 控制器 `maxControllerSize = 20`。继续使用 [ME 尺寸补丁源码](../ae2-controller-size-patch/README.md)中的小型补丁，原有结构与连接规则保留。未额外安装 ExpandedAE，避免其样板供应器 Mixin 与当前附属模组组合冲突。

## 验证结果

- NeoForge 21.1.255 隔离客户端实际启动并进入测试世界；保留原实例 ReplayMod 修复后再次验证通过，未写入原实例存档；测试客户端已停止。
- 两个原有传送门转换配方的实际转换概率均为 0.5，保留 50% 概率。
- 9/9 启动、3/3 客户端、101/101 服务端脚本均为 **0 错误、0 警告**。服务端包含 100 个正式脚本与 1 个临时验证脚本；112 个正式 JS 文件通过语法检查。
- 找到 24,004 个配方；新增 1,026、移除 410、修改 20，**KubeJS 失败配方为 0**。
- 实际验证：量子配置值为 10；20×20×20 控制器在线；21×20×20、20×21×20、20×20×21 均为结构冲突。
- 原实例原生配方解析失败 ID 为 924 个，最终 917 个，新增失败 ID 为 0，新增缺失标签 ID 为 0。日志仍有原本已有的可选模组配方、模型和资源警告，不能将整个游戏日志称为零错误。
- 更新文件校验值、必需依赖与版本范围通过检查；顶层没有重复模组 ID。脚本与任务引用中未发现更新删除的物品模型 ID。
- 直接二进制扫描发现的 KubeJS 旧接口引用由附属模组更新解决；AllTheOres 仍含仅用于数据生成的旧 Actually Additions 引用，正常客户端启动与世界加载没有执行该入口。
- 验证覆盖启动、资源和脚本加载、配方生成与尺寸边界，未逐台操作所有机器或迁移正式存档。摘录见 [validation-log.txt](validation-log.txt)。

## 启动与回退

根目录的公开启动描述文件已更新为 NeoForge 21.1.255，并纳入版本控制；原实例的同名文件也已替换。当前机器的 `E:/minecraft/libraries` 已补齐 5 个缺少的新版加载器缓存文件，没有覆盖已有缓存；106 项 Windows 启动依赖的文件及公开 SHA1 均通过核对。

实际同步范围为原实例 `mods` 顶层 JAR、12 个指定的配置/脚本/数据/启动文件及 PCL 中 3 项加载器版本缓存。没有写入原实例存档或账户设置。原实例已有的 `replaymod-1.21.1-neoforge-2.6.26-sodium-fix.jar` 另有 FlawlessFrames 修复，已保留，并同步回工作树和隔离测试实例；它不计入 174 项模组版本更新。

同步前原实例的 **263 个 JAR**、被修改的配置/脚本/启动文件及 PCL 缓存备份在 `E:/minecraft/.codex-validation/58b1-3267-expansion/deployment-backup-20261005-132233`。其中 `deployment-receipt.json` 记录完整的同步前后文件校验值。PCL 窗口捕获超时，未通过界面确认刷新结果；磁盘中的实际实例文件已核验。

加载器安装脚本已在隔离目录实际执行成功。换机器或重新部署时，需要安装 NeoForge 21.1.255。可用 [install-neoforge.ps1](install-neoforge.ps1) 指定 Minecraft 根目录和 Java 21：

```powershell
.\design\mod-updates-expanded-2026-10-05\install-neoforge.ps1 -MinecraftRoot "E:\minecraft" -JavaPath "你的 Java 21 路径\bin\java.exe"
```

工作树扩展更新前 257 个 JAR 的完整备份在 `E:/minecraft/.codex-validation/58b1-3267-expansion/backup-mods`；第一轮替换或整理文件的备份在同级 `previous-backup-mods`。这些目录不随整合包发布，也可通过 Git 恢复原项目文件；回退 PCL 原实例应优先使用上面的 263 个 JAR 实例备份。

## 全部更新版本

| 模组 ID | 更新前 | 更新后 | 来源 |
|---|---|---|---|
| actuallyadditions | 1.3.20 | 1.3.26 | [作者发布页](https://modrinth.com/mod/4K7Q3nqd/version/iNeJmgFj) |
| advanced_ae | 1.5.1-1.21.1 | 1.6.12-1.21.1 | [作者发布页](https://modrinth.com/mod/rxYaglEe/version/ablTMAjP) |
| ae2 | 19.2.17 | 19.2.18 | [作者发布页](https://modrinth.com/mod/XxWD5pD3/version/KDnFUmMm) |
| ae2ct | 1.21.1-1.1.0 | 1.21.1-1.1.1 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/ae2-crafting-tree/files/7182163) |
| ae2importexportcard | 1.21-1.4.0 | 1.21.1-1.9.1 | [作者发布页](https://modrinth.com/mod/qelfSMnn/version/CuP91rXX) |
| ae2jeiintegration | 1.2.0 | 1.2.1 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/ae2-jei-integration/files/7727898) |
| ae2netanalyser | 1.21-2.1.3-neoforge | 1.21-2.1.5-neoforge | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/ae2-network-analyser/files/7622554) |
| ae2wtlib | 19.3.0 | 19.5.1 | [作者发布页](https://modrinth.com/mod/pNabrMMw/version/CxSEpEnO) |
| aeinfinitybooster | 1.21.1-1.0.0.52 | 1.21.1-1.0.0.58 | [作者发布页](https://modrinth.com/mod/VQhDBNs8/version/qpbQk2Iq) |
| ali | 1.21.1-1.3.7 | 2.3.0 | [作者发布页](https://modrinth.com/mod/PEPVViac/version/nmQAgzDw) |
| allthemodium | 2.9.4 | 3.1.1 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/allthemodium/files/9040574) |
| alltheores | 3.1.8 | 3.2.0 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/ato/files/7825464) |
| antiblocksrechiseled | 0.10.4 | 0.10.8 | [作者发布页](https://modrinth.com/mod/uLWeFJiL/version/YROzKpsd) |
| apothic_attributes | 2.9.0 | 2.11.0 | [作者发布页](https://modrinth.com/mod/DGaH8Rh0/version/64fZbLnj) |
| apothic_enchanting | 1.5.0 | 1.6.3 | [作者发布页](https://modrinth.com/mod/pL8MtgqY/version/9ABEeMkc) |
| apothic_spawners | 1.3.2 | 1.4.0 | [作者发布页](https://modrinth.com/mod/DfxVkOAO/version/pWfxcfO2) |
| appflux | 1.21-2.1.3-neoforge | 1.21-2.1.6-neoforge | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/applied-flux/files/8970797) |
| appleskin | 3.0.7+mc1.21 | 3.0.9+mc1.21 | [作者发布页](https://modrinth.com/mod/EsAfCjCV/version/uAKA6Laj) |
| architectury | 13.0.8 | 13.0.11 | [作者发布页](https://modrinth.com/mod/lhGA9TYQ/version/1IiqEQGl) |
| ars_additions | 1.21.1-21.2.3 | 1.21.1-21.3.0 | [作者发布页](https://modrinth.com/mod/GYK6Gk8R/version/aQ0r5GD2) |
| ars_creo | 5.1.0 | 5.4.0 | [作者发布页](https://modrinth.com/mod/fZ324GMc/version/LqOllHms) |
| ars_nouveau | 5.10.6 | 5.13.3 | [作者发布页](https://modrinth.com/mod/TKB6INcv/version/yWDnir1o) |
| ars_ocultas | 2.2.0 | 2.6.1 | [作者发布页](https://modrinth.com/mod/Tsw8vbks/version/FFn9Oxki) |
| arsdelight | 2.1.9 | 2.2.1 | [作者发布页](https://modrinth.com/mod/BwbT0OZE/version/y49FaxA3) |
| artifacts | 13.1.0 | 13.2.5 | [作者发布页](https://modrinth.com/mod/P0Mu4wcQ/version/lMfuK0o7) |
| athena | 4.0.2 | 4.0.6 | [作者发布页](https://modrinth.com/mod/b1ZV3DIJ/version/dJgL278E) |
| avaritia | 1.3.9.0 | 1.4.2 | [作者发布页](https://modrinth.com/mod/QeB3NRC5/version/uY1x1LTC) |
| balm | 21.0.54 | 21.0.66 | [作者发布页](https://modrinth.com/mod/MBAkmtvl/version/CquiaiDj) |
| bookshelf | 21.1.77 | 21.1.81 | [作者发布页](https://modrinth.com/mod/uy4Cnpcm/version/1sdJl7J1) |
| botanypots | 21.1.41 | 21.1.44 | [作者发布页](https://modrinth.com/mod/U6BUTZ7K/version/RjHfHgSn) |
| brandonscore | 3.2.1.307 | 3.2.1.309 | [作者发布页](https://modrinth.com/mod/iFDWVIFV/version/56nwe5IX) |
| carryon | 2.2.2 | 2.2.6 | [作者发布页](https://modrinth.com/mod/joEfVgkn/version/PV8oLZ1q) |
| cobblegengalore | 1.21.1-0.2.7 | 1.21.1-0.2.9 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/cobblegen-galore/files/8523192) |
| codechickenlib | 4.6.1.524 | 4.6.1.529 | [作者发布页](https://modrinth.com/mod/2gq0ALnz/version/vLDGhjNJ) |
| commoncapabilities | 2.10.0 | 2.11.6 | [作者发布页](https://modrinth.com/mod/oFXrCkDI/version/R9PufPlP) |
| compactmachines | 7.0.68 | 7.0.81 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/compact-machines/files/7621553) |
| constructionstick | 1.2.3 | 1.5.0 | [作者发布页](https://modrinth.com/mod/ooyjDLZt/version/5dwDOCYP) |
| cookingforblockheads | 21.1.17 | 21.1.24 | [作者发布页](https://modrinth.com/mod/vJnhuDde/version/MQCIy6VF) |
| create | 6.0.6 | 6.0.10 | [作者发布页](https://modrinth.com/mod/LNytGWDc/version/UjX6dr61) |
| cryonicconfig | 1.0.0+mc1.21.10 | 1.0.0+mc1.21.11 | [作者发布页](https://modrinth.com/mod/oEhQIkOs/version/GW2YX76Y) |
| cucumber | 8.0.15 | 8.0.16 | [作者发布页](https://modrinth.com/mod/Rw1NrDzF/version/8421rqFF) |
| cupboard | 2.9 | 4.2 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/cupboard/files/8889050) |
| custommachinery | 0.10.46 | 0.10.72 | [作者发布页](https://modrinth.com/mod/OrB5XFtI/version/gL6Am0L0) |
| custommachinerymekanism | 1.4.15 | 1.4.17 | [作者发布页](https://modrinth.com/mod/VFxg3xmP/version/bKaAlXiC) |
| cyclopscore | 1.27.0 | 1.30.0 | [作者发布页](https://modrinth.com/mod/Z9DM0LJ4/version/2Z0ruVBB) |
| dailyshop | 1.1.2 | 1.1.3 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/daily-shop/files/7280153) |
| dankstorage | 19 | 20 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/dank-storage/files/7539725) |
| dimstorage | 9.1.0 | 9.1.1 | [作者发布页](https://modrinth.com/mod/8lnmIJH7/version/R7rQFgQh) |
| draconicevolution | 3.1.3.627 | 3.1.4.633 | [作者发布页](https://modrinth.com/mod/nBqivi8H/version/84xwXpNh) |
| dummmmmmy | 1.21-2.0.9 | 1.21-2.1.2 | [作者发布页](https://modrinth.com/mod/Adega8YN/version/DldwQTMc) |
| dynamic_fps | 3.9.5 | 3.11.4 | [作者发布页](https://modrinth.com/mod/LQ3K71Q1/version/T238FZpQ) |
| easy_villagers | 1.21.1-1.1.35 | 1.21.1-1.1.42 | [作者发布页](https://modrinth.com/mod/Kaov2qgi/version/uXQvvtUt) |
| enchdesc | 21.1.9 | 21.1.11 | [作者发布页](https://modrinth.com/mod/UVtY3ZAC/version/IktklYWh) |
| enderio | 8.0.4-alpha | 8.2.12-beta | [作者发布页](https://modrinth.com/mod/49ZofO4f/version/2bHl1dCW) |
| entangled | 1.3.20+a | 1.3.21-neoforge-mc1.21 | [作者发布页](https://modrinth.com/mod/rylMOguI/version/q3eBZMG4) |
| everlastingabilities | 2.5.4 | 2.5.6 | [作者发布页](https://modrinth.com/mod/xDwJf4pi/version/frO6ca1u) |
| explorerscompass | 1.21.1-3.0.3-neoforge | 1.21.1-3.4.0-neoforge | [作者发布页](https://modrinth.com/mod/RV1qfVQ8/version/hIJ2Ev1Q) |
| extendedae | 1.21-2.2.25-neoforge | 1.21-2.2.39-neoforge | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/ex-pattern-provider/files/9044672) |
| extendedae_plus | 1.21.1-1.4.4 | 1.6.3 | [作者发布页](https://modrinth.com/mod/xr109llC/version/AtuOmKkV) |
| extendedcrafting | 7.0.6 | 7.0.9 | [作者发布页](https://modrinth.com/mod/5JMG1gql/version/Oxp773uX) |
| fabric_api | 0.115.6+2.1.4+1.21.1 | 0.116.15+2.3.5+1.21.1 | [作者发布页](https://modrinth.com/mod/Aqlf1Shp/version/V9WdDUTx) |
| fancymenu | 3.7.0 | 3.9.14 | [作者发布页](https://modrinth.com/mod/Wq5SjeWM/version/P9dDosz2) |
| farmersdelight | 1.2.9 | 1.3.4 | [作者发布页](https://modrinth.com/mod/R2OftAxM/version/XTVZDOol) |
| farmingforblockheads | 21.1.9 | 21.1.14 | [作者发布页](https://modrinth.com/mod/4WJZr8JU/version/ljWZyuzV) |
| ftbchunks | 2101.1.11 | 2101.1.22 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/ftb-chunks-forge/files/8791113) |
| ftbfiltersystem | 21.1.3 | 21.1.4 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/ftb-filter-system/files/7429011) |
| ftblibrary | 2101.1.21 | 2101.1.37 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/ftb-library-forge/files/9008089) |
| ftbquests | 2101.1.16 | 2101.1.36 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/ftb-quests-forge/files/8885017) |
| ftbteams | 2101.1.4 | 2101.1.11 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/ftb-teams-forge/files/8724782) |
| ftbultimine | 2101.1.10 | 2101.1.15 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/ftb-ultimine-forge/files/8231400) |
| ftbxmodcompat | 21.1.6 | 21.1.12 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/ftb-xmod-compat/files/8909889) |
| functionalstorage | 1.21.1-1.5.5 | 1.21.1-1.5.7 | [作者发布页](https://modrinth.com/mod/cO40ZIg3/version/FWnouoF2) |
| fusion | 1.2.11+b | 1.3.15+b | [作者发布页](https://modrinth.com/mod/p19vrgc2/version/n2GBQ4li) |
| geckolib | 4.8.2 | 4.9.3 | [作者发布页](https://modrinth.com/mod/8BmcQJ2H/version/Grwn5rUB) |
| glassential | 3.3.2 | 3.4.7 | [作者发布页](https://modrinth.com/mod/kc9FSsYx/version/knYwchce) |
| guideme | 21.1.14 | 21.1.19 | [作者发布页](https://modrinth.com/mod/Ck4E7v7R/version/hFpGwC6q) |
| hammerlib | 21.0.14 | 21.0.17 | [作者发布页](https://modrinth.com/mod/PlkSuVtM/version/xUFPUf7h) |
| hostilenetworks | 6.3.0 | 6.5.1 | [作者发布页](https://modrinth.com/mod/6bLUlbZn/version/ikdLP02G) |
| I18nUpdateMod | 3.6.2 | 3.7.0 | [作者发布页](https://modrinth.com/mod/PWERr14M/version/4ihDUjWs) |
| ifeu | 1.21.1-3.1.005 | 1.21.1-3.3.008 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/industrial-foregoing-extra-upgrades/files/8428353) |
| industrialforegoing | 1.21-3.6.36 | 1.21-3.6.39 | [作者发布页](https://modrinth.com/mod/lWxpUd04/version/7otXKx1D) |
| industrialforegoingadditional | 1.0.1b | 1.2.2 | [作者发布页](https://modrinth.com/mod/JgGKnHow/version/3O6H8QuS) |
| industrialforegoingsouls | 1.10.5 | 1.10.7 | [作者发布页](https://modrinth.com/mod/R6YQjhwo/version/I0j6WSTx) |
| integratedcrafting | 1.3.1 | 1.7.2 | [作者发布页](https://modrinth.com/mod/qwpACdla/version/3WDY9thq) |
| integrateddynamics | 1.28.1 | 1.38.0 | [作者发布页](https://modrinth.com/mod/yYzdQHJI/version/x4BBgMp6) |
| integratedterminals | 1.6.17 | 1.10.0 | [作者发布页](https://modrinth.com/mod/HmLJoQ1K/version/UnVN4YWi) |
| integratedtunnels | 1.9.0 | 1.13.0 | [作者发布页](https://modrinth.com/mod/Etqy1Omb/version/fLWXpCWB) |
| irisflw | 2.0.5 | 2.1.2 | [作者发布页](https://modrinth.com/mod/ndHYMY2K/version/KZZ5gJA4) |
| jade | 15.10.3+neoforge | 15.10.6+neoforge | [作者发布页](https://modrinth.com/mod/nvQzSEkH/version/eYz2YBGT) |
| jadeaddons | 6.1.0+neoforge | 6.1.2+neoforge | [作者发布页](https://modrinth.com/mod/xuDOzCLy/version/O3F6Dkle) |
| jecharacters | 4.5.22 | 4.5.29 | [作者发布页](https://modrinth.com/mod/I7k4B65h/version/XPKoy65e) |
| jei | 19.25.0.322 | 19.57.0.450 | [作者发布页](https://modrinth.com/mod/u6dRKJwZ/version/Tn0dgwL0) |
| jei_mekanism_multiblocks | 7.11 | 7.21 | [作者发布页](https://modrinth.com/mod/kRaE85yQ/version/4OlLf9A1) |
| journeymap | 1.21.1-6.0.0-beta.52 | 1.21.1-6.0.9 | [作者发布页](https://modrinth.com/mod/lfHFW1mp/version/CtFE7hwT) |
| justdirethings | 1.5.5 | 1.5.7 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/just-dire-things/files/7463040) |
| kiwi | 15.7.5+neoforge | 15.8.7+neoforge | [作者发布页](https://modrinth.com/mod/ufdDoWPd/version/tfwJWC8g) |
| kotlinforforge | 5.10.0 | 5.12.0 | [作者发布页](https://modrinth.com/mod/ordsPcFz/version/uhJhCT7X) |
| kubejs | 2101.7.1-build.181 | 2101.7.2-build.377 | [作者发布页](https://modrinth.com/mod/umyGl7zF/version/THIGFPwf) |
| kubejs_actuallyadditions | 1.21.1-0.2.3 | 1.21.1-0.3.0 | [作者发布页](https://modrinth.com/mod/9UjcQ49t/version/qzz8Odsy) |
| kubejs_mekanism | 2101.1.6-build.6 | 2101.1.7-build.18 | [作者发布页](https://modrinth.com/mod/sY2Fy24K/version/sbx1D4Jz) |
| kubejs_naturesaura | 1.0.1 | 1.0.3 | [作者发布页](https://modrinth.com/mod/4UOGHCIr/version/cZivu3om) |
| kubejsarsnouveau | 1.3 | 1.3.2 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/kubejs-ars-nouveau/files/7181937) |
| kubejsoffline | 5.0.7 | 1.21-5.2.3 | [作者发布页](https://modrinth.com/mod/7I1fu1km/version/ViNeqtNX) |
| kubejspowah | 1.3.2 | 1.3.4 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/kubejs-powah/files/7182924) |
| libipn | 6.6.1 | 6.6.3 | [作者发布页](https://modrinth.com/mod/onSQdWhM/version/BGe4KMlE) |
| libx | 1.21.1-6.0.6 | 1.21.1-6.0.15 | [作者发布页](https://modrinth.com/mod/qEH6GYul/version/ADxNEmse) |
| lootjs | 1.21.1-3.4.3 | 1.21.1-3.7.0 | [作者发布页](https://modrinth.com/mod/fJFETWDN/version/5AZDyUSn) |
| lychee | 6.4.2+neoforge | 6.7.0+neoforge | [作者发布页](https://modrinth.com/mod/TdN6LxjM/version/OZ6pOngs) |
| mcjtylib | 1.21-9.0.15 | 1.21-9.0.21 | [作者发布页](https://modrinth.com/mod/1Zu0uTEE/version/9B2CiAN5) |
| megacells | 4.10.1 | 4.11.0 | [作者发布页](https://modrinth.com/mod/jjuIRIVr/version/RPG4EriK) |
| meinfinitycell | 1.21.1-1.0.0 | 1.21.1-2.0.0 | [作者发布页](https://www.curseforge.com/minecraft/mc-mods/me-infinity-cell/files/7278106) |
| mekanism | 10.7.16 | 10.7.19 | [作者发布页](https://modrinth.com/mod/Ce6I4WUE/version/5KzzycBT) |
| mekanism_extras | 1.21.1-1.2.6 | 1.4.1 | [作者发布页](https://modrinth.com/mod/HUZkxNTQ/version/fqPYikeY) |
| mekanismadditions | 10.7.16 | 10.7.19 | [作者发布页](https://modrinth.com/mod/a6F3uASn/version/6mkdykZa) |
| mekanismgenerators | 10.7.16 | 10.7.19 | [作者发布页](https://modrinth.com/mod/OFVYKsAk/version/a6gl7srE) |
| mekanismtools | 10.7.16 | 10.7.19 | [作者发布页](https://modrinth.com/mod/tqQpq1lt/version/v5zlSE9s) |
| mekmm | 1.21.1-1.0.5 | 1.4.1 | [作者发布页](https://modrinth.com/mod/qDJXZJTz/version/RYVVOm3d) |
| merequester | 1.21.1-1.4.1 | 1.21.1-1.5.0 | [作者发布页](https://modrinth.com/mod/E6BFl96N/version/hLs5MFnR) |
| modonomicon | 1.117.2 | 1.120.7 | [作者发布页](https://modrinth.com/mod/692GClaE/version/fbS7CiY6) |
| modularrouters | 13.2.3 | 13.2.7 | [作者发布页](https://modrinth.com/mod/EuTS81Z3/version/wcfqOJTo) |
| monolib | 2.1.0 | 4.1.2 | [作者发布页](https://modrinth.com/mod/9leXt4A5/version/YIL3k0PZ) |
| moonlight | 1.21-2.24.3 | 1.21.1-3.7.0 | [作者发布页](https://modrinth.com/mod/twkfQtEc/version/t6iFh4M3) |
| more_armor_trims | 1.4.1-1.21 | 1.5.4n-1.21.1 | [作者发布页](https://modrinth.com/mod/FGNYBAJ6/version/ivJF2Fpw) |
| mysticalagradditions | 8.0.10 | 8.0.15 | [作者发布页](https://modrinth.com/mod/pl0jGXIx/version/fNQephU4) |
| mysticalagriculture | 8.0.19 | 8.0.28 | [作者发布页](https://modrinth.com/mod/C95ReXie/version/PLakgT6X) |
| mysticalcustomization | 6.0.0 | 6.0.2 | [作者发布页](https://modrinth.com/mod/lNK9A4rh/version/ACBylvtB) |
| naturesaura | 41.9 | 41.10 | [作者发布页](https://modrinth.com/mod/4cJkN3aF/version/kJ1hHmK0) |
| naturescompass | 1.21.1-3.0.2-neoforge | 1.21.1-3.4.0-neoforge | [作者发布页](https://modrinth.com/mod/fPetb5Kh/version/nFniEtJV) |
| neat | 1.21-40-NEOFORGE | 1.21-47-NEOFORGE | [作者发布页](https://modrinth.com/mod/Ins7SzzR/version/kALoScYM) |
| notenoughanimations | 1.10.6 | 1.12.6 | [作者发布页](https://modrinth.com/mod/MPCX6s5C/version/VCuMsK45) |
| occultism | 1.194.0 | 1.224.4 | [作者发布页](https://modrinth.com/mod/sbJh4AZw/version/g2DSjK89) |
| occultism_kubejs | 1.8.0 | 1.11.0 | [作者发布页](https://modrinth.com/mod/u5J68aYW/version/785rsUjd) |
| oracle_index | 0.5.0 | 1.4.0 | [作者发布页](https://modrinth.com/mod/J8MMsNrL/version/7OqGasX2) |
| oritech | 0.19.3 | 1.2.12 | [作者发布页](https://modrinth.com/mod/4sYI62kA/version/lxLMO7bV) |
| oritechthings | 0.0.33 | 0.0.46 | [作者发布页](https://modrinth.com/mod/C7tBAibK/version/vt3nmngK) |
| packagedauto | 4.0.7.19 | 4.0.8.21 | [作者发布页](https://modrinth.com/mod/ugIdhQx4/version/ErYy5Im9) |
| packageddraconic | 4.0.0.0 | 4.0.0.1 | [作者发布页](https://modrinth.com/mod/dNduUQBR/version/ImNmnhkd) |
| packagedexcrafting | 4.0.0.10 | 4.0.0.11 | [作者发布页](https://modrinth.com/mod/qO33ACjS/version/wCCJTI3y) |
| patchouli | 1.21.1-92-NEOFORGE | 1.21.1-93-NEOFORGE | [作者发布页](https://modrinth.com/mod/nU0bVIaL/version/BIogJv2D) |
| pipez | 1.21.1-1.2.19 | 1.21.1-1.2.31 | [作者发布页](https://modrinth.com/mod/iRmWy6ga/version/BPGKb8pi) |
| placebo | 9.9.1 | 9.9.2 | [作者发布页](https://modrinth.com/mod/tCkE8p2N/version/1Ypo4tf4) |
| polymorph | 1.1.0+1.21.1 | 1.2.0+1.21.1 | [作者发布页](https://modrinth.com/mod/tagwiZkJ/version/9yWvrF5o) |
| portaltransform | 0.6.8+1.21.1 | 0.7.2+1.21.1 | [作者发布页](https://modrinth.com/mod/HeFr4Yf2/version/8k5sk4r2) |
| powah | 6.2.6 | 6.2.10 | [作者发布页](https://modrinth.com/mod/KZO4S4DO/version/1prWLuga) |
| probejs | 7.5.1 | 8.0.3 | [作者发布页](https://modrinth.com/mod/JJNYRb4B/version/xC9KUA7R) |
| psi | 2.0.0 | 1.21.1-110 | [作者发布页](https://modrinth.com/mod/pOeA0exL/version/j9TFdTKC) |
| publicguiannouncement | 6.0.1 | 6.0.2 | [作者发布页](https://modrinth.com/mod/EhsqBhQf/version/CGjbp8Ft) |
| pylons | 5.2.1 | 5.4.2 | [作者发布页](https://modrinth.com/mod/A82glthi/version/FD2dgDdO) |
| quarryplus | 21.1.135 | 21.1.164 | [作者发布页](https://modrinth.com/mod/jhxX1zVW/version/p0XlQYuL) |
| rftoolsbase | 1.21-6.0.8 | 1.21-6.0.11 | [作者发布页](https://modrinth.com/mod/hIO8IsD8/version/f8Tk2cfj) |
| rftoolspower | 1.21-7.0.3 | 1.21-7.0.6 | [作者发布页](https://modrinth.com/mod/YWbLuPa1/version/Ujyiiyqz) |
| rftoolsstorage | 1.21-6.0.4 | 1.21-6.0.5 | [作者发布页](https://modrinth.com/mod/tx4M6qRg/version/LWsB9Cy7) |
| rftoolsutility | 1.21-7.0.9 | 1.21-7.0.12 | [作者发布页](https://modrinth.com/mod/7n3HbHSE/version/xOoMr4zS) |
| rhino | 2101.2.7-build.77 | 2101.2.8-build.91 | [作者发布页](https://modrinth.com/mod/sk9knFPE/version/SqkDvOLG) |
| sfm | 4.25.0 | 4.34.0 | [作者发布页](https://modrinth.com/mod/aecUorJQ/version/HWz24fIm) |
| shrink | 2.0.1.47 | 2.0.2.53 | [作者发布页](https://modrinth.com/mod/jzaTHh0C/version/RJlQkOpr) |
| silentgear | 4.0.29 | 4.2.1.1 | [作者发布页](https://modrinth.com/mod/73mSSnCf/version/VRVOMdub) |
| silentlib | 10.5.1 | 10.6.0 | [作者发布页](https://modrinth.com/mod/BQhuHQo4/version/xavD8Lt3) |
| skyblockbuilder | 21.1.18 | 21.1.37 | [作者发布页](https://modrinth.com/mod/por2AZc5/version/NmXF6maO) |
| skyguis | 21.1.6 | 21.1.10 | [作者发布页](https://modrinth.com/mod/3Gdi7Qgq/version/M32FiLBl) |
| sophisticatedbackpacks | 3.25.9 | 3.26.7 | [作者发布页](https://modrinth.com/mod/TyCTlI4b/version/Igmp9PwW) |
| sophisticatedcore | 1.3.87 | 1.5.5 | [作者发布页](https://modrinth.com/mod/nmoqTijg/version/nSoNwJfm) |
| sophisticatedstorage | 1.5.11 | 1.6.1 | [作者发布页](https://modrinth.com/mod/hMlaZH8f/version/Hhf1IKFI) |
| stellaris | 1.4.13 | 1.4.25 | [作者发布页](https://modrinth.com/mod/ItTQpuBn/version/5BraaKfR) |
| supermartijn642corelib | 1.1.18+a | 1.1.24+a | [作者发布页](https://modrinth.com/mod/rOUBggPv/version/y8iP3aUs) |
| tiab | 6.5.0 | 6.5.4 | [作者发布页](https://modrinth.com/mod/LQdpBqdS/version/rG10hU1G) |
| titanium | 4.0.40 | 4.0.50 | [作者发布页](https://modrinth.com/mod/1Ro7m06l/version/zCzYA9mW) |
| tombstone | 9.4.8 | 9.5.6 | [作者发布页](https://modrinth.com/mod/YT5K34AB/version/e68NhQJm) |
| torchmaster | 21.1.5-beta | 21.1.13 | [作者发布页](https://modrinth.com/mod/Tl8ESrhX/version/JmlakQNo) |
| trashcans | 1.0.18+c | 1.1.1 | [作者发布页](https://modrinth.com/mod/4QrnfueM/version/zjFylsMq) |
| trashslot | 21.1.4 | 21.1.11 | [作者发布页](https://modrinth.com/mod/vRYk0bv7/version/HY8Ybozd) |
| waystones | 21.1.23 | 21.1.46 | [作者发布页](https://modrinth.com/mod/LOpKHB2A/version/6Z6MQ6os) |
| xnet | 1.21-7.0.6 | 1.21-7.0.7 | [作者发布页](https://modrinth.com/mod/iu1jkWqa/version/lvCo0M5N) |
| yungsapi | 1.21.1-NeoForge-5.1.6 | 1.21.1-NeoForge-5.1.9 | [作者发布页](https://modrinth.com/mod/Ua7DFN59/version/2prKITKh) |

Modrinth 文件与官方 SHA512 匹配；CurseForge 文件从官方 CDN 下载并记录本地 SHA512，未将本地记录误称为官方校验值。
