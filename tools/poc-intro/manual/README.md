# ECHO 科技手册

右键 `poc_intro:tech_manual` 打开。剧情正常结束后发一本；背包满则掉落在玩家脚边，领取 UUID 写入原 `poc_intro.dat`。断线、超时与准备失败不发放，旧档不补播。`/pocmanual` 可找回书并打开界面，不改变科技进度。

51 个模组族加“操作与按键”，共 52 个分类，附属归本体。正文只写机器、机制和重要功能物品的操作，包含任务未提及的设备。当前 4631 个目录条目，其中 732 个操作主题；颜色和等级变体沿用各自规则，目录条目数不代表独立百科篇数。材料、装饰与纯兼容/优化/前置不作为操作目录。`coverage.json` 记录覆盖、改写和合并数量；当前比上一版新增2083条、改写1433条，合并或剔除1023条。

已从当前 AE2及附属、工业先锋、机械动力Ponder、沉浸工程、实用拓展、Just Dire Things、LaserIO、模块化路由器和动态联合的书/提示补充操作。化工、反应堆、封包、物流和存储模块按机器功能分开维护。多轮跨模组检索记录及版本取舍见 `research-rounds.json`，具体补写源为 `deep-*.mjs`；当前安装版本优先于旧网页默认数值。

143 张原模组图供 238 个条目使用。图片在游戏内直接引用原模组资源，不重复分发；预览图提取到忽略的 design 目录。`media-sources.json` 保存出处、路径和 SHA256，没有搬运网页图片。缩略图点击放大，滚轮缩放、拖动平移、左右键切换、Esc 返回原位置。小窗口用“查看配图”入口。

目录生成顺序：已有扫描清单经 `enrich-inventory.mjs` 完善后，依次运行 `build-catalog.mjs`、`enrich-manual.mjs`、`collect-references.mjs`、`import-native-details.mjs`、`import-native-mechanics.mjs`、`apply-deep-content.mjs`、`finish-catalog.mjs`、`audit-expanded.mjs`，最后依次运行 `apply-controls.mjs`、`expand-other-mods.mjs`、`fix-localization.mjs`。不要只运行基础生成器覆盖已补充的正文。扫描/审计基线保存在本机 `D:/codex-work/manual-20261020/` 和 `D:/codex-work/manual-expanded-20261020/`。

搜索示例：`@ae2`、`@extendedae -无线`、`&mekanism:crusher`、`@create 粉碎 | @powah`。`#` 为真实物品标签、`$` 为提示，`^` / `%` 使用当前 JEI 配置。当前实例 JEI 关闭颜色与创造标签页搜索，因此这两种条件默认无匹配；手册不更改个人配置。普通搜索同时匹配正文与 JEI 可见物品。

物品左键或 R 查配方，右键或 U 查用途。Ctrl+F 聚焦；右键搜索框/× 清空；滚轮分别滚动三栏，上下键选条目，正文也可拖动。手册不暂停世界。

构建使用上级 `build.mjs --test --preview`（需 Java 21、现有安全 classpath 文件和实例 JEI JAR），不需要 Gradle 或新增依赖。生成资源先执行 `manual/make-icon.mjs`。扫描器从安装 JAR 读取模组元数据、物品模型、方块状态、语言和标签，包含 JarJar；不会读取启动器账号配置或存档。

`design/manual-20261020/` 有最终 PNG 与离线交互页面。Java 预览与游戏共用 `ManualUi`，离线字体/物品图标是示意；HTML 仅供检查目录与文本搜索，无法运行 JEI。游戏内机器界面与 JEI 的实际显示需玩家重启后验收。

## 操作与按键补充

本轮新增 28 篇双语操作主题、6 个原目录遗漏的常用工具，修订 37 个已有条目。37 项按键动作供 49 个条目引用，涵盖 JEI、任务书、连锁、通用机械、建筑工具、路由器、背包和 Oritech。游戏内从当前 KeyMapping 显示实际键位，包含修饰键和未分配状态；不修改个人设置。

新增配置器、滴量器、配置卡、机械动力扳手/护目镜、五种建筑工具、人体强化研究及故障排查。原子分解机的当前默认是 N，旧 Wiki 的 M 未照搬；储槽清空是 GUI 固定 Shift+左键，不跟随潜行改键。Oritech 扩展坞只增加插件连接位置，核心品质限制数量；人体强化研究与安装分开说明，配两张原手册界面图。来源随条目保存，23 项安装版资源/字节码出处核对见 `controls-verification.json`。

正文支持 PageUp/PageDown、Home/End，段标题金色、按键青色。`20-controls.png` 是配置器，`21-controls.png` 是建筑工具，`25-controls.png` 是人体强化，`25-controls-small.png` 是小窗口。预览 `keybindings.json` 只含本轮用到的键位显示名，不进入模组 JAR。当前构建和安装哈希以 `localization-verification.json` 为准；`coverage.json` 保留上一轮扩充统计。

## 中文标题与其他模组教程

修复341个标题，支持动态 module/parttype 语言键、蓝图/模板、等级插件、功能玻璃和路径型语言键。经当前注册入口和模型覆盖关系确认后剔除135条状态模型、旧兼容模型或内部占位，其中截图的建筑浆料容器不属于BuildingGadgets2 1.3.9的注册物品。完整逐项清单在 `localization-audit.json`；没有给不存在的物品编造中文名字。网页相关物品按钮也显示中文，悬停可查看ID。

新增82篇教程：Just Dire Things39、RF工具15、XNet8、Powah6、SFM6、功能性存储4、精妙存储4。当前732个操作主题，所有目录标题都有中文；目录总数下降是清理模型假条目的结果。教程根据安装版自带手册和程序模板编写，来源逐篇记录于 `other-mods-coverage.json`。

新增SFM的基础搬运、FORGET、面/槽位、资源类型和数量限制示例；RF工具存储扫描/远程模块/屏幕/传送器；XNet频道、路由、无线天线；JDT机器面板、过滤方式、点击/流体/能量工具。现有42项按键动作，包含JDT配置和SFM检查器/编辑器；预览快照从最终目录自动确定所需动作。

本轮检查：`verify-localization.mjs`，需要工作目录的构建结果、完整测试输出、初始哈希清单和安全按键快照。`27-localized.png`展示动态物品名，`28-localized.png`为XNet，`29-localized.png`为RF扫描器，`30-localized.png`为SFM，`31-localized.png`为JDT，`32-localized.png`为清理后的建筑小帮手。

RF工具版本复查：当前原手册把 storage_module6 标为旧内部模块，已移出正常目录；标准存储模块的内部编号0–3对应玩家界面的1–4级。远程访问使用存储控制模块与平板，普通右键打开扫描、潜行右键管理平板。新增环境控制器半径/Y高度/目标过滤/模块与红石设置，以及一张原手册GUI截图（33-localized.png）。
