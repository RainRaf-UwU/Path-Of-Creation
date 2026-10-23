// Hand-maintained instructions. Key names are resolved from the active client's KeyMapping.
export const keybinds={
 'key.sneak':['潜行','Sneak','下文“潜行＋右键”使用这个潜行键。','Used wherever the instructions say sneak + right-click.'],
 'key.jei.showRecipe':['查看合成配方','Show recipes','鼠标悬停在物品上。','Hover an ingredient.'],
 'key.jei.showUses':['查看物品用途','Show uses','鼠标悬停在物品上。','Hover an ingredient.'],
 'key.jei.bookmark':['添加或移除书签','Toggle bookmark','鼠标悬停在物品上。','Hover an ingredient.'],
 'key.jei.focusSearch':['聚焦 JEI 搜索','Focus JEI search','打开有 JEI 的物品界面。','Open an inventory with JEI.'],
 'key.jei.toggleOverlay':['显示或隐藏 JEI','Toggle JEI overlay','在物品界面使用。','Use in an inventory screen.'],
 'key.jei.recipeBack':['返回上一配方','Previous recipe','已经打开 JEI 配方页时使用。','Use while viewing recipes.'],
 'key.ftbquests.quests':['打开任务书','Open quests','未分配时可用背包左上角的任务书按钮。','If unbound, use the quest button in the inventory.'],
 'key.ftbquests.gui.next_chapter':['下一章节','Next chapter','任务书界面内。','Inside the quest book.'],
 'key.ftbquests.gui.prev_chapter':['上一章节','Previous chapter','任务书界面内。','Inside the quest book.'],
 'key.ftbquests.gui.search':['搜索任务','Search quests','任务书界面内。','Inside the quest book.'],
 'key.ftbquests.gui.recenter':['重新居中任务图','Recenter quest graph','任务书界面内。','Inside the quest book.'],
 'key.ftbultimine':['连锁挖掘','Ultimine','按住后看预览，再破坏起始方块。','Hold, inspect the preview, then break the first block.'],
 'ftbultimine.change_shape.next':['下一个挖掘形状','Next mining shape','是否需同时按住连锁键，由客户端配置决定。','Holding Ultimine may be required by the client setting.'],
 'ftbultimine.change_shape.prev':['上一个挖掘形状','Previous mining shape','是否需同时按住连锁键，由客户端配置决定。','Holding Ultimine may be required by the client setting.'],
 'key.mekanism.mode':['切换手持工具模式','Change held-item mode','配置器需手持并潜行；其他工具见下文。','Hold and sneak for the Configurator; see the tool instructions.'],
 'key.mekanism.module_tweaker':['打开模块调节器','Open module tweaker','用于已装备且支持模块的 Meka 装备。','For equipped modular Meka gear.'],
 'key.mekanism.head_mode':['切换头部装备模式','Head equipment mode','穿戴支持此操作的头部装备。','Wear compatible head equipment.'],
 'key.mekanism.chest_mode':['切换胸部装备模式','Chest equipment mode','穿戴支持此操作的胸部装备。','Wear compatible chest equipment.'],
 'key.mekanism.legs_mode':['切换腿部装备模式','Leg equipment mode','穿戴支持此操作的腿部装备。','Wear compatible leg equipment.'],
 'key.mekanism.feet_mode':['切换足部装备模式','Feet equipment mode','穿戴支持此操作的足部装备。','Wear compatible foot equipment.'],
 'key.mekanism.key_boost':['喷气背包加速','Jetpack boost','需相应装备、可用燃料或能量。','Requires compatible gear and fuel or energy.'],
 'key.buildinggadgets2.settings_menu':['打开工具设置','Open gadget settings','手持或副手持有建筑工具。','Hold a gadget in either hand.'],
 'key.buildinggadgets2.undo':['撤销上一次操作','Undo gadget action','持有工具；仅对该工具支持的操作生效。','Hold the gadget; only supported actions can be undone.'],
 'key.buildinggadgets2.anchor':['锁定或解除预览位置','Toggle anchor','先对准目标位置，再锁定预览。','Aim at the intended position before anchoring.'],
 'key.buildinggadgets2.range':['调整工具范围','Change gadget range','持有支持范围设置的工具。','Hold a gadget supporting this setting.'],
 'key.modularrouters.configure':['配置模块','Configure module','路由器 GUI 内悬停模块；也可按鼠标中键。','Hover a module in the router GUI; middle-click also works.'],
 'key.modularrouters.moduleInfo':['查看模块信息','Show module information','按模块提示要求使用。','Use in the context described by the module tooltip.'],
 'key.sophisticatedbackpacks.open_backpack':['打开背包','Open backpack','携带或装备可用背包。','Carry or equip an accessible backpack.'],
 'key.sophisticatedbackpacks.toggle_upgrade_1':['切换第 1 个可切换升级','Toggle first switchable upgrade','需要安装支持开关的升级。','Requires an installed switchable upgrade.'],
 'key.sophisticatedbackpacks.toggle_upgrade_2':['切换第 2 个可切换升级','Toggle second switchable upgrade','序号按可切换升级顺序，不是固定某种升级。','The index follows switchable upgrades, not a fixed upgrade type.'],
 'key.dankstorage.construction':['切换放置模式','Toggle construction mode','手持 Dank；选择存储物品后再使用。','Hold a Dank and select a stored item.'],
 'key.dankstorage.pickup_mode':['切换拾取模式','Cycle pickup mode','持有 Dank，并检查当前提示状态。','Hold a Dank and inspect the displayed state.'],
 'key.dankstorage.lock_slot':['锁定槽位','Lock slot','在 Dank 界面中悬停目标槽位。','Hover the target slot inside the Dank screen.'],
 'create.keyinfo.toolmenu':['蓝图工具菜单','Schematic tool menu','手持已部署蓝图时，按住并用滚轮选择工具。','Hold a deployed schematic; hold the key and scroll between tools.'],
 'create.keyinfo.toolbelt':['工具箱快捷菜单','Toolbox menu','需要附近有可用工具箱。','Requires an accessible nearby toolbox.'],
 'key.oritech.augment_screen':['打开强化界面','Open augment screen','用于角色强化系统。','For the player augment system.']
};
const native=(mod,path)=>`installed:${mod}!${path}`;
const mekanism=[native('Mekanism-1.21.1-10.7.19.85','mekanism/common/item/ItemConfigurator.class'),native('Mekanism-1.21.1-10.7.19.85','mekanism/client/key/MekanismKeyHandler.class'),'https://wiki.aidancbrady.com/wiki/Configurator'];
const create=[native('create-1.21.1-6.0.10','assets/create/lang/en_us.json'),native('create-1.21.1-6.0.10','assets/create/lang/zh_cn.json')];
const gadgets=[native('buildinggadgets2-1.3.9','com/direwolf20/buildinggadgets2/client/events/EventKeyInput.class'),native('buildinggadgets2-1.3.9','com/direwolf20/buildinggadgets2/common/items/BaseGadget.class'),'https://github.com/Direwolf20-MC/BuildingGadgets2'];
// group, slug, Chinese title, English title, related item IDs, key IDs, zh body, en body, sources.
export const topics=[
['controls','reading','手册操作与按键显示','Reading the manual',[],[],
`操作步骤
右键手持的 ECHO 科技手册打开；旧世界或书本遗失时输入 /pocmanual 找回并打开。左栏选模组，中栏选机器，右栏阅读；三个区域分别响应滚轮。Ctrl+F 聚焦搜索，右键搜索框或点击 × 清空，↑/↓ 选择条目。

长文与图片
PageUp / PageDown 按页滚动正文，Home / End 到正文开头或结尾。鼠标左键按住正文拖动也能滚动。点击配图放大，滚轮缩放，拖动平移，←/→ 切图，Esc 返回文章；小窗口使用“查看配图”。底部物品左键或 R 查看配方，右键或 U 查看用途。

按键显示
青色方括号显示当前客户端实际绑定，包含 Ctrl、Alt、Shift 等修饰键。改键后重新查看即可更新。“未分配”表示还没有绑定；“未注册”表示当前客户端没有这个映射。下文的“潜行”使用你在设置中绑定的潜行键。

搜索示例
@ae2 可同时检索本体与附属；&mekanism:configurator 精确缩小物品 ID。空格为同时满足，| 为任意满足，-词语排除。点击 ? 查看完整规则。`,
`Right-click the ECHO manual, or use /pocmanual to recover and open it. Choose a family, then an entry. Each pane scrolls independently. Ctrl+F focuses search; right-click or × clears it; Up/Down selects an entry.

PageUp/PageDown scroll the article; Home/End jumps to either end. Drag the article to scroll. Click an illustration to zoom; use the wheel, drag, Left/Right, and Esc. Related items open recipes with left-click/R and uses with right-click/U.

The bracketed bindings come from the active client, including modifiers. Unbound and missing mappings are distinct. Sneak means your configured sneak key. Search supports @mod, &item:id, AND spaces, OR | and negative terms.`,['project:ManualScreen.java','project:ManualImageScreen.java']],
['controls','jei','JEI：查配方、用途与书签','JEI recipes, uses and bookmarks',[],['key.jei.showRecipe','key.jei.showUses','key.jei.bookmark','key.jei.focusSearch','key.jei.toggleOverlay','key.jei.recipeBack'],
`操作步骤
鼠标悬停在材料、机器或产物上查配方；查用途能反向确认某个中间产物要送到哪台机器。配方上方的分类页签用于切换加工方式，左侧机器图标表示设备类别，不能把加工配方直接放进工作台。

合成与书签
在支持配方转移的合成界面，配方的 + 按钮会把现有材料整理进槽位；缺少材料时会标记缺项。它不生成材料，也不替代机器的输入面、流体和能量。书签保存在左侧，适合跟踪反复制作的中间材料。

本包特殊配方
右键交互、雷击、流体转化等世界配方要读页面条件：主副手、是否潜行、放置方块还是掉落物、概率与高度。图标只是索引，具体数量和条件以本包 JEI 与说明为准。

常见问题
列表消失先检查 JEI 显示开关；搜索不到先清空文字和 @ 模组筛选。不要在手册搜索框内按 R/U：聚焦输入时会输入文字，移开焦点并指向底部物品再使用。`,
`Hover an ingredient for recipes or uses. Uses help identify the next machine in a chain. Recipe tabs represent different processing types; machine recipes do not run in a crafting table.

The + button transfers available ingredients only in compatible crafting screens. It does not supply missing ingredients, fluids, power or machine configuration. Bookmark frequently used intermediates.

Read the conditions on this pack's world-interaction recipes: hands, sneaking, placed blocks versus dropped items, height and probability. If the list disappears, check the overlay toggle; if results disappear, clear search filters. While the manual search box is focused, R/U types text instead of opening recipes.`,['installed:jei-19.57.0.450!mezz/jei','project:kubejs/server_scripts/jei_world_interactions.js','https://github.com/mezz/JustEnoughItems']],
['controls','conflicts','按键冲突与未分配功能','Key conflicts and unbound actions',[],['key.sneak'],
`操作步骤
打开“选项 → 控制 → 按键绑定”，用搜索框输入模组名或动作名称；本包安装了 Controlling，可按冲突状态缩小范围。先确认所需动作是否未分配，再检查同一个按键是否分配给多个动作。

生效条件
相同按键在不同界面、持有不同工具时可能各有用途。世界里的装备按键、GUI 内模块配置和 JEI 悬停按键不是同一种上下文；只有在相同上下文抢占时才需要改键。建议只改冲突动作，不必重置全部按键。

本实例重点检查
背包、地图路标与装备可能共用 B；饰品、Oritech 强化与通用机械胸部装备可能共用 G；建筑工具撤销与 JEI 用途可能共用 U。若工具设置键包含 Shift 等修饰键，必须同时按下。实际键位以各条目上方的青色按键表为准。

故障排查
按键没反应时依次检查：是否处于聊天/搜索输入、是否拿着正确工具、是否需要潜行、是否穿戴装备、是否未绑定、是否冲突。`,
`Open Options → Controls → Key Binds and search by mod or action. Controlling can narrow the list to conflicts. Check unbound actions before changing keys.

Different screens and held tools have different contexts. Reusing a key is a problem when active contexts overlap. This instance shares B among backpack, waypoint and some equipment actions, and G among several equipment systems. Gadget settings also use a modifier in the current snapshot. The live table is authoritative.

If an action does nothing, check text input focus, held tool, sneaking requirement, worn equipment, missing binding and conflicting actions in that order.`,['installed:Controlling-19.0.5!com/blamejared/controlling','preview:options.txt key_ lines only']],
['controls','quests','任务书：查找、切章与完成条件','Quest navigation and completion',[],['key.ftbquests.quests','key.ftbquests.gui.search','key.ftbquests.gui.next_chapter','key.ftbquests.gui.prev_chapter','key.ftbquests.gui.recenter'],
`操作步骤
打开任务书后先读任务说明，再看任务中的检测项目。前置依赖没有完成时，获得目标物品也不一定立刻解锁后续任务。箭头与连线表示依赖，不能用任务图上的距离判断先后。

完成与奖励
物品检测、勾选确认、击杀或进度类目标各有不同条件。需要交付的物品任务可能消耗材料，以任务窗口为准。完成后检查奖励图标是否还待领取；团队进度与个人奖励按任务设置处理。

导航
使用章节切换、搜索和重新居中功能定位。任务书内的 + / - 用于缩放视图；拖动空白区域平移。手册是机器操作索引，任务书是本包推进条件，两者配合 JEI 使用。

故障排查
检查所在队伍、依赖、任务类型以及目标物品是否包含特定数据。不要用编辑模式的完成/重置快捷键代替生存流程。`,
`Read each quest's text and detection tasks. An item may not unlock a dependent quest until its prerequisites are complete. Connections represent dependencies.

Item, checkmark, kill and advancement tasks have different requirements. Submission tasks may consume ingredients. Check whether completed rewards still need claiming, and distinguish team progress from personal rewards.

Use search, chapter navigation and recentering. Zoom with the quest controls and drag empty space to pan. For missing completion, inspect the team, prerequisites, task type and required item data.`,['installed:ftb-quests-2101.1.36','project:config/ftbquests/quests']],
['controls','ultimine','连锁挖掘：形状与空岛边界','Ultimine shapes and skyblock boundaries',[],['key.ftbultimine','ftbultimine.change_shape.next','ftbultimine.change_shape.prev'],
`操作步骤
按住连锁键，对准方块，确认高亮预览后再挖掘。预览显示本次形状与选中范围；改变形状后重新检查，不要只看最先破坏的那一格。

形状切换
用上方的前后形状键切换；是否需要同时按住连锁键取决于客户端“Require Ultimine Key for Shape Cycling”设置。本包以当前配置允许的形状、方块和范围为准，不假定所有方块都能连锁。

故障排查
不出现预览时检查绑定、工具、可挖掘方块规则和服务端限制；执行提前结束还可能与工具耐久、饥饿及当前允许上限有关。空岛底板、承重结构和存储区旁先核对预览边界，留出站立点。`,
`Hold Ultimine, inspect the highlighted selection, then break the starting block. Recheck the preview after changing shape.

The client option “Require Ultimine Key for Shape Cycling” determines whether the Ultimine key must also be held when using the shape keys. Allowed blocks, shapes and limits follow this instance's configuration.

For no preview, check the binding, tool, block rules and server restrictions. Early termination may involve durability, hunger or configured limits. On a skyblock, inspect the selection around platforms and storage and keep a place to stand.`,['installed:ftb-ultimine-2101.1.15!assets/ftbultimine/lang/en_us.json','project:config/ftbultimine-client.snbt','project:config/ftbultimine-server.snbt']],
['mekanism','configurator','配置器：模式、管道与机器侧面','Configurator modes and connections',['mekanism:configurator'],['key.sneak','key.mekanism.mode'],
`操作步骤
1. 给配置器充能并持在手中。潜行并按“切换手持工具模式”，查看工具提示中的当前模式；物品、流体、化学品、能量、清空、旋转与扳手功能不能混用。
2. 在对应资源的配置模式中，右键机器侧面读取其配置；潜行＋右键循环该面可用的输入、输出或禁用状态。
3. 调整管道时对准机器与管道之间的连接段，潜行＋右键切换 Normal / Pull / Push / None。对准中间的管身和对准接口是不同目标。

输入与输出
机器 GUI 的侧面配置先选资源类型，再选侧面；灌注原料与主物品可能是不同通道。设为输出后还要检查该资源自动弹出，或在来源处让管道 Pull。只把机器设成输出不会让普通库存自行抽取。

注意事项
清空模式会把机器物品弹出，不等于清空所有化学品；扳手模式潜行＋右键可拆卸支持的设备，操作前确认模式和指向。多方块没有成型时尝试对框架使用配置器读取诊断。`,
`Charge and hold the Configurator. Sneak and press the held-item mode key; inspect the selected mode before interacting.

In the matching resource configuration mode, right-click a machine face to inspect it and sneak-right-click to cycle its supported states. On transmitters, target the connection segment and sneak-right-click through Normal, Pull, Push and None. The central pipe body is a different target.

In machine side configuration, select the resource type before the face. Infusion material may use a different channel from the main ingredient. Enable auto-ejection or configure the source connection to Pull. Empty mode ejects items; wrench mode can dismantle supported equipment. Using it on an unformed multiblock may provide a diagnostic.`,mekanism],
['mekanism','gauge-dropper','滴量器：取出、注入与清空储槽','Gauge Dropper operations',['mekanism:gauge_dropper'],[],
`操作步骤
打开通用机械机器 GUI，把滴量器拿在鼠标光标上，对准流体或化学品储槽操作。左键从储槽取出可容纳的介质，右键把滴量器中的介质送入兼容储槽；操作后悬停滴量器确认内容和数量。

故障排查
不能混装不兼容介质。机器因残留错误介质而卡住时，先移走错误输入并停掉上游，再用滴量器取出；否则抽掉后会立即又被灌入。按住 Shift＋左键储槽可删除储槽内容（GUI 检查的是 Shift，不随潜行改键），执行前确认这批介质确实不要了。

注意事项
滴量器只处理兼容的 GUI 储槽，不能当作世界水桶或任意模组通用管道。携带介质的滴量器会保留内容，不要只凭物品外观判断为空。`,
`Pick up the Gauge Dropper on the cursor in a Mekanism machine GUI. Left-click a compatible fluid or chemical gauge to draw from it; right-click to insert the dropper's contents. Inspect the tooltip afterward.

Stop the incorrect upstream input before removing a contaminating chemical. Shift-left-clicking a gauge can delete its contents (the GUI checks Shift, independently of the sneak binding); verify the target first. Incompatible media cannot be mixed. The dropper works with compatible GUI gauges rather than as a universal world bucket.`,[native('Mekanism-1.21.1-10.7.19.85','mekanism/client/gui/element/gauge/GuiTankGauge.class')]],
['mekanism','configuration-card','配置卡：复制机器设置','Configuration Card',['mekanism:configuration_card'],['key.sneak'],
`操作步骤
潜行＋右键源机器，把它支持的配置写入配置卡；查看卡片提示确认已经记录。对目标机器右键应用，再打开目标 GUI 核对侧面、红石和弹出等设置。

适用范围
配置卡复制机器支持导出的设置，不复制库存、储槽中的介质、能量或升级，也不会替你把加工配方送入机器。目标必须支持卡中对应的机器配置，不能把任意两类设备视为通用模板。

故障排查
复制后不运行时检查目标机器朝向：相对面配置正确，不代表世界中的管道已经接到了同一个方向。再确认目标供电、输入介质和输出空间。`,
`Sneak-right-click the source machine to store supported configuration, inspect the card, then right-click a compatible target to apply it. Open the target GUI to verify the result.

The card does not copy inventories, tank contents, energy or upgrades. Only compatible configuration can be transferred. After copying, check machine orientation and actual pipe connections, then power, inputs and output space.`,[native('Mekanism-1.21.1-10.7.19.85','mekanism/common/item/ItemConfigurationCard.class')]],
['mekanism','atomic-disassembler','原子分解机：切速与连锁模式','Atomic Disassembler',['mekanism:atomic_disassembler'],['key.mekanism.mode'],
`操作步骤
充能后手持工具，按模式切换键查看当前挖掘模式。不同模式改变挖掘速度与能耗；关闭模式、普通/慢速/快速模式和范围挖掘模式的可用性受当前配置限制。

使用条件
工具需要可用能量。范围模式会作用于预期以外的相连方块，切换后先检查工具提示，不要把它与 FTB 连锁键混为一谈。装备状态、模式和目标方块共同影响能否挖掘。

故障排查
完全不挖时检查是否处于关闭模式、电量是否足够以及方块保护；能挖但速度不符先确认当前模式。当前客户端实际模式键见上表，不沿用旧 Wiki 默认的 M。`,
`Charge and hold the tool, then use the held-item mode key to inspect and cycle mining modes. Speed, energy cost and available area-mining modes follow the installed configuration.

Check the mode before mining connected blocks. This tool's mode and FTB Ultimine are separate systems. If mining fails, inspect disabled mode, charge and protection; if speed differs, inspect the selected mode. Do not assume an old guide's default M key.`,[native('Mekanism-1.21.1-10.7.19.85','mekanism/common/item/gear/ItemAtomicDisassembler.class'),...mekanism]],
['mekanism','meka-gear','Meka 工具与装甲：模块和模式','Meka modules and modes',['mekanism:meka_tool','mekanism:mekasuit_helmet','mekanism:mekasuit_bodyarmor','mekanism:mekasuit_pants','mekanism:mekasuit_boots'],['key.mekanism.module_tweaker','key.mekanism.head_mode','key.mekanism.chest_mode','key.mekanism.legs_mode','key.mekanism.feet_mode','key.mekanism.key_boost'],
`准备
模块用模块装配台安装到支持它的工具或护甲中。放入目标装备与对应模块，在 GUI 中执行安装；重复模块能否叠加、最多几层，取决于模块本身。安装模块不等于所有功能都已启用。

配置步骤
装备目标物品，打开模块调节器，选择部件和模块，调整启用状态、采掘范围、速度或具体行为。需要能量或燃料的模块先补足资源，再检查它对应部件的模式键。

故障排查
头、胸、腿、脚分别有自己的模式切换键。切胸部模式不会替你切换所有部件；喷气加速也要满足喷气功能和资源条件。工具无范围效果时检查模块是否实际安装、是否启用、范围参数与服务端限制。`,
`Install compatible modules using the Modification Station and its GUI. Stack limits and compatibility belong to each module. Installation does not guarantee that a feature is enabled.

Equip the gear, open the module tweaker, choose the item and module, and configure enabled state, range, speed or behavior. Supply required power or fuel. Head, chest, legs and feet have separate mode actions. For missing area mining, check installation, enabled state, range and server settings.`,[native('Mekanism-1.21.1-10.7.19.85','mekanism/client/key/MekanismKeyHandler.class'),native('Mekanism-1.21.1-10.7.19.85','assets/mekanism/lang/en_us.json')]],
['create','wrench','扳手：旋转、拆卸与接口朝向','Wrench rotation and dismantling',['create:wrench'],['key.sneak'],
`操作步骤
手持扳手右键支持的机械动力方块，围绕点击面的轴调整朝向。潜行＋右键拆卸支持的部件并回收；传送带、漏斗、管道及其他连接组件依照它们自己的可调整状态响应。

输入与输出
漏斗送不出、机械臂取不到物品时先看箭头与接口朝向。转动机器会改变连接关系，齿轮、轴、皮带和流体口都要重新核对。对准不同面可能得到不同旋转轴。

故障排查
没有反应先确认目标支持扳手以及是否在领地保护范围内。不要把所有模组扳手当作机械动力扳手的完全替代品；各自支持的拆卸和旋转逻辑不同。`,
`Right-click a supported Create component with the wrench to rotate it around the clicked face. Sneak-right-click dismantles supported components. Belts, funnels, pipes and other connections have their own adjustable states.

Inspect arrows and face directions when a funnel or Mechanical Arm cannot transfer. Rotation can change shaft, gear, belt and fluid connections. If nothing happens, check support and protection; other mods' wrenches are not necessarily equivalent.`,create],
['create','goggles','工程师护目镜：看转速与应力','Engineer Goggles and kinetic diagnostics',['create:goggles','create:stressometer','create:speedometer'],[],
`操作步骤
佩戴工程师护目镜，对准机械动力机器和传动组件读取信息。转速表观察转速与旋转方向，应力表观察动力网络负载；它们与护目镜提供的是诊断，不会自动增加动力。

故障排查
整条线停转：先确认动力源正在输出，再检查是否过载、传动是否断开、齿轮或轴是否接反。提高转速也会提高许多机器的应力需求，不能只给末端加变速器就认为所有设备都会更快。

加工停住
网络仍转而机器不加工时，检查所需最低转速、旋转方向、物品位置、配方条件和输出空间。应力足够只说明能驱动，不代表加工条件满足。流体设备另查泵方向、管路和目标储槽。`,
`Wear Engineer Goggles and look at Create machinery and transmission components. Speedometers show speed and direction; Stressometers show network load. These are diagnostics, not power sources.

For a stopped network, check the source, overstress, broken connections and opposed rotation. Higher speed often increases stress requirements. If the network turns but processing stops, check minimum speed, direction, ingredients, placement and output space; inspect pump directions and tanks for fluid machines.`,create],
['create','ponder','思索：查看动态机器教程','Ponder tutorials',['create:wrench','create:mechanical_press','create:mechanical_arm'],[],
`操作步骤
在物品界面把鼠标悬停在机械动力物品上，按住提示中的 W 打开思索。该按键是当前模组提示中的固定入口，不是本手册给所有模组统一绑定的“教程键”。

阅读方法
等待动画逐段演示，结合高亮方块和说明理解输入、输出及结构。遇到多个主题可切换主题查看，同一机器可能把基础工作方式与自动化分成不同场景。

配方区别
思索展示工作原理；其中出现的物品组合不一定就是本包改过的实际配方。制作和加工数量继续查本包 JEI，不能照搬原版思索材料数量。`,
`Hover a Create item and hold the W shown in its tooltip to open Ponder. Follow the animation, highlighted blocks and captions; inspect additional scenes for automation details.

Ponder explains mechanics. Its example ingredients may differ from this modpack's recipes, so use the pack's JEI entries for actual ingredients and quantities.`,create],
['create','schematic-tools','蓝图：部署、移动、旋转与开炮','Deploying and printing schematics',['create:schematic','create:schematic_and_quill','create:schematic_table','create:schematicannon'],['create.keyinfo.toolmenu'],
`操作步骤
用蓝图与笔选择区域并保存，或在蓝图桌把已存在的蓝图写入空白蓝图。手持蓝图部署预览，按住蓝图工具菜单键并滚轮选择移动、旋转等工具，再按屏幕提示调整。确认位置、朝向和高度后才交给加农炮。

输入与输出
在加农炮 GUI 放入已经部署的蓝图，提供火药，在相邻库存放材料。放入书或剪贴板可制作材料清单。设置替换策略、是否跳过缺料以及如何处理原有方块后启动。

故障排查
不施工先检查蓝图是否部署、目标是否在可施工范围、火药、材料和红石状态。预览位置错误应先暂停并取回蓝图重新部署；蓝图记录结构，不会免除材料消耗。`,
`Select and save a region with Schematic and Quill, or write an existing file using the Schematic Table. Deploy the preview. Hold the schematic menu key and scroll between manipulation tools, then follow the on-screen instructions to set position and rotation.

Insert the deployed schematic into the cannon, supply gunpowder and adjacent material inventories, and print a material list with a book or clipboard. Review replacement and missing-material policies before starting. For no construction, inspect deployment, reach, fuel, materials and redstone.`,create],
['buildinggadgets2','building','建筑工具：取样、模式与定位','Building Gadget',['buildinggadgets2:gadget_building'],['key.buildinggadgets2.settings_menu','key.buildinggadgets2.range','key.buildinggadgets2.anchor','key.buildinggadgets2.undo'],
`操作步骤
1. 给工具充 FE，把要放的方块放进可用库存。潜行＋右键已有方块进行取样，检查工具显示的选择。
2. 打开设置选择铺面、线、墙等可用模式和参数，观察世界中的放置预览。范围键与菜单可调整工具支持的范围。
3. 对准起点，必要时用定位键锁住预览，再右键执行。执行后解除定位继续下一段。

故障排查
红色或缺失预览时查材料、FE、替换条件及受保护区域。撤销只对工具记录且支持的操作有效；不要把撤销当作任意世界改动的完整备份。设置键带修饰键时必须同时按下，拿着其他物品则不会打开工具菜单。`,
`Charge the gadget and provide building blocks in an accessible inventory. Sneak-right-click a block to select it. Open settings, choose a mode and range, then inspect the preview. Anchor if needed and right-click to build; release the anchor afterward.

For missing or red previews, check materials, FE, placement rules and protection. Undo only covers supported recorded gadget operations. If settings do not open, hold the gadget and use the full binding including modifiers.`,gadgets],
['buildinggadgets2','exchange','交换工具：替换方块与匹配范围','Exchanging Gadget',['buildinggadgets2:gadget_exchanging'],['key.buildinggadgets2.settings_menu','key.buildinggadgets2.range','key.buildinggadgets2.anchor','key.buildinggadgets2.undo'],
`操作步骤
给工具充能并准备目标建材；潜行＋右键取样要换成的方块。打开设置选择替换范围与匹配规则，对准原有方块检查预览，再右键执行。

注意事项
替换方块类型与替换的空间范围是两项条件，先确认取样不是旧方块。机器、库存和带方块实体的目标可能受到工具限制；不要假定替换会迁移其内容和全部数据。

故障排查
只替换少量方块时查连接/表面等当前模式、建材数量、FE 与目标限制。需要恢复时使用工具支持的撤销动作，再核对原物品是否已回收。`,
`Charge the gadget, supply replacement blocks, and sneak-right-click to select the replacement. Choose range and matching rules, inspect the highlighted targets, then right-click.

The selected replacement and target selection are separate settings. Inventories and block entities may be restricted; do not assume their contents and data migrate. For partial replacement, check the selected mode, materials, power and target support. Use supported undo and verify recovered materials.`,gadgets],
['buildinggadgets2','copy-paste','复制粘贴工具：角点与材料','Copy-Paste Gadget',['buildinggadgets2:gadget_copy_paste'],['key.buildinggadgets2.settings_menu','key.buildinggadgets2.anchor','key.buildinggadgets2.undo'],
`操作步骤
在设置中切到复制，按工具提示选择结构两个角点，确认预览包围了完整范围，再切到粘贴。调整偏移、朝向与位置，必要时锁定预览，再执行放置。

输入与输出
复制记录结构布局，生存粘贴仍需要能量和对应材料。模板管理器用于保存、读取或共享工具支持的模板；模板文件不等于已经准备好的建材。

故障排查
不能切换复制/粘贴先确认拿的是复制粘贴工具，并打开本工具的菜单。工具设置、定位和撤销各有独立绑定。缺一层或多一层时重新检查角点是否包含边界，不要靠连点补救错误选区。`,
`Choose Copy in the settings menu and select the two corners according to the tool prompt. Verify the full bounding region, switch to Paste, then adjust offset, rotation and placement. Anchor the preview if useful.

Survival pasting needs energy and materials. The Template Manager stores or retrieves supported templates; templates do not supply blocks. If the mode cannot be changed, confirm the held gadget and its settings binding. Recheck corner inclusion for missing or extra layers.`,gadgets],
['buildinggadgets2','cut-paste','剪切粘贴工具：搬迁前核对选区','Cut-Paste Gadget',['buildinggadgets2:gadget_cut_paste'],['key.buildinggadgets2.settings_menu','key.buildinggadgets2.anchor','key.buildinggadgets2.undo'],
`操作步骤
选择剪切范围，完整检查两个角点和预览。剪切操作会改动源位置；在目标位置设置偏移与方向，再按工具提示完成粘贴。

注意事项
剪切与复制不同，先确认源结构确实要搬走。对于机器网络，搬迁完成后逐一核对能源连接、物流方向、频道和红石信号；跨模组网络不一定保留对外连接。

故障排查
结构未完整搬入时检查允许处理的方块、选区、能量和目标区域。工具内已有待粘贴数据时先完成或按界面处理，避免用新的选区覆盖正在搬迁的内容。`,
`Select and inspect both corners before cutting. Cutting changes the source area. Set target position, offset and rotation, then follow the gadget's paste prompt.

After moving machines, verify power connections, logistics directions, channels and redstone; external links may need rebuilding. For incomplete movement, inspect supported blocks, selection, energy and destination. Resolve any pending cut data before starting another operation.`,gadgets],
['buildinggadgets2','destruction','破坏工具：范围、预览与撤销','Destruction Gadget',['buildinggadgets2:gadget_destruction'],['key.buildinggadgets2.settings_menu','key.buildinggadgets2.undo'],
`操作步骤
手持破坏工具打开设置；当前安装版会打开专用破坏设置窗口。分别设置各方向范围，回到世界核对高亮区域，再执行工具的破坏操作。

注意事项
破坏工具的用途是批量清除，不能当作保证收回全部掉落物的采矿工具。执行前移走要保留的机器、库存及范围边缘的重要方块。撤销是否可用以当前工具数据和配置为准。

故障排查
菜单与建筑工具的圆盘不同是正常的。无法清除时检查 FE、不可破坏方块、领地权限和当前范围；不要通过盲目扩大范围来排错。`,
`Open settings while holding the Destruction Gadget. The installed version uses a dedicated destruction settings screen. Set directional extents and inspect the world preview before executing.

This is a clearing tool, not a guarantee of mining drops. Remove important machines and inventories from the selected area. Undo availability depends on the tool and configuration. For no effect, check FE, protected or unsupported blocks, permissions and selection size.`,gadgets],
['modularrouters','module-controls','路由器：模块配置、顺序与目标','Router modules and targeting',['modularrouters:modular_router'],['key.modularrouters.configure','key.modularrouters.moduleInfo'],
`操作步骤
右键打开路由器，把拉取、发送、放置等模块依次装入模块槽。模块从左到右执行；通常先把物品拉入一格缓存，再用后面的发送模块移出。路由器升级与模块自身参数分开设置。

模块配置
在 GUI 悬停已安装模块，按配置键或鼠标中键即可编辑，不必拆出。方向、过滤黑白名单、数量与红石控制属于各模块的配置。需要远程目标的模块，按该模块提示进行绑定，不能只填一个方向就认为已绑定远处库存。

故障排查
缓存为空先看前面的拉取模块、来源库存和过滤；缓存有物品但送不走，查发送目标、接收面、空间和模块过滤。低耗模式空闲后降低检查频率；红石设为“从不”时速度升级也不会让它工作。`,
`Install modules in execution order: typically pull into the single buffer slot, then send out with a later module. Router upgrades and module parameters are separate.

Hover an installed module and use the configure key or middle-click to edit direction, filters, quantities and redstone behavior. Remote modules need the binding described by their own tooltips.

For an empty buffer, inspect the pull module and source filter. For a blocked buffer, inspect the sender, destination side, space and filter. Eco mode slows idle checks; a router set to Never ignores speed upgrades.`,[native('modular-routers-13.2.7','assets/modularrouters/patchouli_books/book/en_us/entries/intro/modular_router.json')]],
['sophisticatedbackpacks','backpack-controls','精妙背包：打开、放置与升级开关','Backpack access and upgrade toggles',['sophisticatedbackpacks:backpack'],['key.sophisticatedbackpacks.open_backpack','key.sophisticatedbackpacks.toggle_upgrade_1','key.sophisticatedbackpacks.toggle_upgrade_2'],
`操作步骤
携带或装备背包后用打开键进入；也可手持右键使用，潜行放置为方块后再打开。背包里的升级槽放功能升级，右侧面板配置每个升级的规则。

升级操作
拾取、磁铁、补货、喂食、压缩与虚空升级各自有启用状态和过滤。快捷开关的 1、2 是“可切换升级”的顺序，不固定代表磁铁或拾取；改装背包后先核对对应关系。

故障排查
按打开键却出现路标或其他界面时，查同键冲突。物品没有自动进入时，查背包是否可访问、升级是否启用、过滤模式与剩余空间；有压缩升级时还要检查压缩规则。把背包放到地上不等于已自动建立对周围库存的物流。`,
`Carry or equip a backpack and use its open binding, or right-click it in hand. Sneak-place it as a block to open it in the world. Install upgrades and configure their individual panels.

Pickup, magnet, refill, feeding, compression and void upgrades have separate switches and filters. Toggle indices follow the installed switchable upgrades rather than fixed upgrade types. For no pickup, inspect accessibility, enabled state, filters and space. If the open key triggers a waypoint, resolve the conflicting binding.`,[native('sophisticatedbackpacks-3.26.7.2182','net/p3pp3rf1y/sophisticatedbackpacks/client/KeybindHandler.class')]],
['dankstorage','dank-controls','Dank：拾取、锁槽与放置模式','Dank pickup, locking and construction',['dankstorage:dank_1'],['key.dankstorage.construction','key.dankstorage.pickup_mode','key.dankstorage.lock_slot'],
`操作步骤
打开 Dank 存入物品；每个槽位能容纳多少由等级决定。槽位锁定保留该槽的物品类型，适合反复收集建材；锁槽不等于把所有物品禁止取出。

拾取与放置
持有 Dank 切换拾取模式，查看提示确认当前是普通、过滤或其他可用模式。放置模式用于直接使用其中所选物品；切换后确认选中槽位与存量再右键使用。普通打开库存与放置模式不是同一个动作。

故障排查
只收部分物品先看拾取模式与锁定槽类型，完全不收再查空间和物品限制。放不出方块时检查当前是否处于放置模式、选中槽位是否为空以及该物品能否放置。`,
`Store items in the Dank; capacity follows its tier. Lock a slot to preserve its assigned item type. Locking is not the same as forbidding extraction.

Cycle pickup mode while holding the Dank and inspect the tooltip. Construction mode uses the selected stored item directly; check selection and stock before right-clicking. For selective pickup, check filters and locked types; for failed placement, check construction mode, selection and whether the item can be placed.`,[native('dankstorage-20','assets/dankstorage/lang/en_us.json')]],
['laserio','connections','LaserIO：扳手连线与传输卡','LaserIO connections and cards',['laserio:laser_wrench','laserio:laser_node'],['key.sneak'],
`操作步骤
潜行＋右键节点或连接器设为起点，再右键另一端建立连接。当前内置手册给出的基础连接距离为 8 格；超距时需要适用的连接器链路。绿色高亮表示当前选中端。

输入与输出
在节点对应侧放入物品、流体、能量或红石卡，分别设置 Extract / Insert 与频道。抽取和插入端须能通过同一链路、同一频道找到彼此；面对库存的侧面才是实际交互面。

故障排查
有连线但不传输时，按“节点连通 → 卡片资源类型 → 频道 → Extract/Insert → 库存面与空间”检查。过滤、数量限制、红石控制和超频各自独立；光有节点和连线不会自行传送物品。`,
`Sneak-right-click a node or connector to choose the starting point, then right-click the other endpoint. The installed guide specifies an 8-block basic link range. The selected endpoint is green.

Install the correct resource cards on the interacting sides and configure Extract/Insert and channel. For a connected but idle network, check link, card type, channel, transfer mode, inventory face and space, then filters, limits and redstone. Bare nodes and links do not transfer items without cards.`,[native('laserio-1.9.11','assets/laserio/patchouli_books/laseriobook/zh_cn/entries/laser_wrench.json')]],
['pipez','extraction','Pipez：来源抽取与目标过滤','Pipez extraction endpoints',['pipez:wrench','pipez:item_pipe','pipez:fluid_pipe','pipez:energy_pipe'],['key.sneak'],
`操作步骤
把对应资源管道连接来源与目标。用扳手潜行＋右键来源连接处切换抽取状态；对准不需要的管道连接可断开。抽取由来源端执行，不是在每个目标端都开启抽取。

配置步骤
打开已设为抽取的端点配置，根据升级等级设置速度、过滤、目标和分配方式。升级放在这个抽取端，不是随便插到网络中任意一根管上。基础管道不一定拥有高级过滤功能。

故障排查
不传输先检查来源箭头/抽取状态、管道资源类型和目标接收面；再看来源有无内容、目标空间、过滤及红石模式。来源和目标都设抽取会造成非预期流向，先保留单一来源进行定位。`,
`Connect the correct resource pipe between source and destination. Sneak-right-click the source connection with the wrench to switch extraction. Unneeded connections can be disconnected.

Configure the extracting endpoint and install its upgrade there. Available speed, filtering and distribution depend on that upgrade. For no transfer, inspect extraction state, pipe type, receiving face, stock, space, filters and redstone. Start with one source rather than enabling extraction everywhere.`,[native('pipez-1.2.31','de/maxhenkel/pipez/blocks/PipeBlock.class'),'https://github.com/henkelmax/pipez']],
['ae2','diagnostics','ME 网络：离线、频道与自动合成排查','ME network and crafting diagnostics',['ae2:network_tool','ae2:controller','ae2:pattern_provider','ae2:1k_crafting_storage'],[],
`一、终端离线
先检查稳定供电与能源接收，再看线缆是否连通、设备是否真的在同一网络。手持网络工具右键网络组件读诊断，确认频道使用、能量流入/消耗和设备清单。致密线缆的容量不会自动穿过中间的普通线缆瓶颈。

二、看得到物品但无法合成
检查对应样板是否放在可用的样板供应器、是否存在空闲合成 CPU、CPU 存储是否足够。加工样板是把材料送到外部机器；AE2 不能凭样板替机器提供 FE、流体、催化剂或正确的侧面配置。

三、任务等待产物
查看合成监控中等待的具体物品和数量。输出必须回到发起任务的 ME 网络，并匹配样板声明的产物及数据。错误副产物、被别的库存截走、机器没料或输出堵塞，都会让任务一直等待。

四、重复投料
机器一次只能容纳一份加工时，检查供应器阻挡/锁定逻辑及目标库存；不要用增加并行数量掩盖回收链路故障。`,
`For an offline terminal, inspect power, cable continuity and whether devices belong to the same network. Use the Network Tool for channels, energy flow and device inventory. A normal cable between dense segments remains a bottleneck.

For unavailable crafting, inspect the pattern provider, free CPU and crafting storage. Processing patterns still require working external machines, power, fluids, catalysts and side configuration.

For jobs waiting on outputs, identify the exact missing item in the monitor. Products must return to the requesting ME network and match the declared item and data. Check byproducts, diverted outputs and blocked machines. Use blocking or locking behavior where appropriate rather than increasing parallelism to hide a broken return path.`,['installed:appliedenergistics2-19.2.18!assets/ae2/ae2guide','https://guide.appliedenergistics.org/1.21.1/']],
['industrialforegoing','machine-checks','工业先锋：范围、工作条件与附加流体','Industrial Foregoing machine checklist',['industrialforegoing:plant_gatherer','industrialforegoing:plant_sower','industrialforegoing:dissolution_chamber','industrialforegoing:fluid_extractor'],[],
`一、先看工作区
在机器 GUI 开启工作范围预览，核对朝向、高度与是否覆盖目标。范围升级影响支持范围的机器，不会让任意设备忽略位置和目标规则。

二、再看运行条件
检查 FE、红石控制、工作区是否存在有效作物/实体/方块。流体提取器等设备有自己的工作方式，不能给每台设备都套同一套“通电就转”规则。种植机种子、采收机目标高度和产物流向要分别安排。

三、输入输出分开查
溶解室按当前 JEI 准备物品与流体，材料是无序放置；每类流体先确认名称和数量。副产物流体储槽满也会堵住设备。空储槽不代表管道资源类型和接收面就一定正确。

四、附属升级
机器不支持的升级不能强装。水培模拟处理器先在普通水培床训练数据；大型溶解室按本机附属版本是单方块，不能照旧教程搭多方块。`,
`Inspect the displayed working area, facing and height before adding upgrades. Check FE, redstone and valid crops, entities or blocks; machines have different operating requirements.

For the Dissolution Chamber, supply the installed JEI ingredients and fluid. Its ingredients are shapeless. A full byproduct tank can block work. Check resource type and receiving side even when a tank appears empty.

Use only supported upgrades. Train hydroponic simulation data in a normal Hydroponic Bed first. The installed Extra Upgrades large chamber is a single block rather than the structure shown in older guides.`,['project:manual/deep-industrial.mjs','installed:industrialforegoing-3.6.39!assets/industrialforegoing/patchouli_books']],
['oritech','extender-checks','Oritech：扩展坞、机器效率与接口','Oritech extenders and efficiency',['oritech:machine_extender'],[],
`操作步骤
扩展坞必须直接连接机器，或连接到已接入这台机器的另一个扩展坞。它本身没有效率加成，作用是增加可连接的插件位置；仅仅摆在机器附近不会生效。

配置步骤
在机器 UI 左上角悬停机器核心图标，查看机器品质；核心品质决定最大支持的扩展坞数量。接入实际插件后再查看效率、能耗与工作状态变化，并核对物品、流体和能量接口。

故障排查
装了扩展没有变化先检查位置与适用机器，再检查附加组件类型和连接。角色强化屏幕属于另一套系统，按键不会代替机器扩展坞 GUI。当前配方及输入量以本包 JEI 为准。`,
`An extender must connect directly to the machine or another connected extender. It adds attachment positions rather than providing an efficiency bonus itself. Hover the machine-core icon at the top-left of the machine GUI to inspect quality; core quality limits the number of extenders. Connect supported addons, then inspect processing, energy and resource ports.

If an addon has no effect, check position, machine compatibility and addon type. The player augment screen is a separate system and does not replace the extender GUI. Use the pack's JEI for processing ingredients.`,['installed:oritech-1.2.12!assets/oracle_index/books/oritech/content/machines/addons/machine_extender.mdx','project:manual/import-native-details.mjs']],
['oritech','augments','Oritech：人体强化研究与能力开关','Oritech augmentation research and toggles',['oritech:augment_application_block'],['key.oritech.augment_screen'],
`准备
按模组指南搭建人体强化中心，提供研究需要的能量和材料；研究站作为多方块附加结构接入中心。具体结构和材料以当前指南及本包 JEI 为准。

操作步骤
进入已成型的中心打开研究界面，在科技树选择满足前置的项目；材料从玩家库存或机器库存取用。研究完成后还要支付安装所需资源，才会成为角色强化。研究和已安装能力不是同一个状态。

能力开关
已安装强化后，按住上方强化键打开轮盘，悬停要切换的能力，松开按键确认开关。矿石视觉、速度等会影响操作的能力可在此管理。中心界面的 Import 可导入角色已安装的强化；移除强化不会返还安装资源。

故障排查
轮盘没有能力时，先确认项目已经安装而不只是研究完成。研究进度与未安装的研究结果保存在机器内，拆毁中心会丢失这些内容。只关闭能力的开关，不等于移除能力或返还资源。`,
`Build the Cybernetic Augmentation Center and connected multiblock research stations following the installed guide. Supply energy and project ingredients from the player or machine inventory. Choose a project whose prerequisites are satisfied. Completed research still needs the installation resource cost before it becomes a player augment.

Hold the augment binding to open the radial menu, hover an ability and release to toggle it. The center's Import function can import installed augments. Removing an augment does not refund installation resources.

For an empty radial menu, confirm installation rather than research completion. Unapplied research and progress are stored in the machine and are lost if it is destroyed. Toggling an ability off is different from removing it.`,['installed:oritech-1.2.12!assets/oracle_index/books/oritech/content/machines/augmentations/augment_application_block.mdx']],
];
