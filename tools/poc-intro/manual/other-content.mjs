// Chinese explanations cross-checked against the matching installed Patchouli pages.
export const nativeChinese={
 'xnet:simple/controller':`工作流程
给控制器供 FE，通过连接器和网线接入来源、目标库存。打开控制器，新建频道，先选物品、流体、能量或逻辑类型，再把需要的连接器加入这个频道。连接到网线不等于已经加入传输频道。

配置步骤
在频道内选择来源连接器，设为抽取；目标连接器设为插入。每个端点分别设置交互侧、优先级、过滤和传输条件。先用单一来源与单一目标确认方向，再增加其他机器。

故障排查
控制器看不到机器时检查线缆颜色、连接器是否贴住机器与网络连通；能看到却不传输时检查频道是否启用、端点是否加入、资源类型、过滤和目标接收面。`,
 'xnet:simple/connector':`操作步骤
把连接器贴在要交互的机器或库存上，再用相容的网络线连接控制器。连接器本身只提供网络接入，资源如何传输由控制器里的频道决定。

普通与高级
高级连接器提供更多端点配置能力，包括从指定侧与目标交互。需要从不便接线的一面抽取时，先检查该端点是否支持选择交互侧。

故障排查
机器面有严格输入输出限制时，应选择它真正开放的物品、流体或能量面。更换连接器不会绕过机器内部的配方、侧面或红石条件。`,
 'xnet:simple/cables':`操作步骤
使用相同网络的线缆与连接器连成连续路径。普通网络线用于控制器和机器端点；路由线及路由连接器用于路由器之间的路由网络，两者用途不同。

注意事项
不同颜色帮助隔离相邻网络。线缆不是传统管道，没有需要沿途逐格移动的物品缓存；实际传输由频道端点配置执行。故障时从控制器沿线检查断点、颜色和连接器。`,
 'xnet:simple/facade':`操作步骤
伪装板用于遮盖网络连接，保留线路的功能。按物品提示选择伪装外观并应用到支持的位置，维护时使用对应工具检查隐藏的连接器与线缆。

故障排查
伪装外观并不表示它变成了普通实心方块，也不修复网络断点。拆改线路前先确认被遮挡的是哪一段网络，避免将相邻的不同网络混接。`,
 'xnet:simple/redstone_proxy':`操作步骤
红石代理把红石信号操作交给 XNet 频道。先将代理接入控制器网络，再在逻辑或相应端点设置中选择读取、输出的方向及条件。

故障排查
频道读到信号却未控制目标时，检查代理面对的方块、输出方向、频道条件，以及目标机器自身的红石模式。不要把红石读写误当作能量或物品传输。`,
 'xnet:network/router':`工作流程
路由器用于在不同控制器网络之间共享频道。用路由线与路由连接器构成路由网络，然后在路由器 GUI 中发布需要共享的本地频道，并让另一端消费该频道。

配置步骤
核对两端频道类型和发布名称，再分别检查各自控制器的本地抽取、插入端点。路由器共享频道，不会替你自动把所有机器加入频道。

故障排查
本地能传、跨网络不能传时，先查路由网络连接，再查发布/消费关系和名称。普通网线接通不代表路由网络也已经成立。`,
 'xnet:wireless/wireless_router':`操作步骤
在无线路由器上方安装天线；天线等级决定可用传输范围。无线端仍与本地路由网络配合，通过路由器界面发布或消费频道。

故障排查
分别检查两端天线、距离、路由器供电和本地路由连接，再检查频道类型、名称与共享方向。无线链路只连接网络，机器端点的侧面和过滤仍由各自控制器管理。`,
 'xnet:wireless/antennas':`操作步骤
把天线与无线路由器组成对应结构，不同天线等级提供不同范围。使用碟形或更高级天线时按当前模组手册核对组成与朝向。

故障排查
天线不是独立的物品传输器，必须配合无线路由器和已经配置的路由频道。不要只在远处放天线而省略本地路由网络。`,
 'rftoolsstorage:scanner/scanner':`操作步骤
给存储扫描器供电，在 GUI 调整半径并点击 Scan 扫描。把需要访问的库存保留在列表里；可按名称搜索物品，@minecraft 等前缀按模组 ID 筛选。

自动化设置
扫描到库存后，区分普通浏览与标为 Routable 的库存。可路由库存参与自动插入/取出和对应模块视图，列表中还能调整顺序、移除库存。

故障排查
新放箱子没有出现先重新扫描；若启用了要求的 XNet 集成，范围由 XNet 接入关系控制。远程访问需把存储控制模块绑定到扫描器，再装入平板扫描器；扫描器并不把箱内物品搬进自身。`,
 'rftoolsstorage:scanner/modules':`操作步骤
把存储控制模块绑定到目标存储扫描器，然后装进平板扫描器等支持该模块的设备。模块决定远程界面访问哪一台扫描器，不是装入后自动搜索全世界库存。

故障排查
远程列表不正确时，重新核对绑定坐标和目标扫描器、扫描器电量及其已登记的库存。星标或可路由视图只展示符合对应规则的内容。`,
 'rftoolsstorage:scanner/remote':`操作步骤
先在平板管理界面安装并选择已绑定的存储控制模块。普通右键打开远程扫描器界面，潜行＋右键打开平板管理界面。远程操作按当前设置消耗平板中的 FE；可访问库存来自目标扫描器的配置。

故障排查
平板有电但没有库存时检查模块是否绑定、扫描器是否可用、库存是否完成扫描及登记。平板是访问工具，不会凭空增加存储容量。`,
 'rftoolsstorage:modularstorage/modularstorage':`操作步骤
在模块化存储器的模块槽放入存储模块，再向主库存放物品。实际容量由模块等级决定；界面切换可见库存大小不等于扩容。

管理与搬迁
使用 GUI 的搜索、排序和压缩整理库存。物品保存在存储模块内，更换或移动模块前确认其内容；不要把拿走模块误认为物品丢失。

故障排查
放不进物品时先查模块是否安装、容量和剩余可用槽。存储器不是加工机，自动合成要另接合成设备。`,
 'rftoolsstorage:modularstorage/storagemodules':`操作步骤
存储模块插入模块化存储器后提供可用库存。等级决定容量，物品随模块保存，因此模块本身就是需要妥善保管的存储介质。

故障排查
更换模块后内容改变，先查看取出的旧模块，而不是重做一台存储器。整理库存和切换可见界面不改变模块等级。`,
 'rftoolsutility:machines/environmental':`操作步骤
给环境控制器供 FE，在左侧模块槽放入需要的效果模块。当前界面提供七个模块槽；装入更多效果会增加能耗。

配置步骤
顶部滑块设置半径，下方输入最低与最高 Y 高度。目标过滤决定作用于哪些玩家、敌对或被动生物；玩家黑白名单与全体生物模式不同。最后设置红石启用条件并检查电量。

故障排查
范围内没有效果时，先查目标过滤和高度，再查模块是否安装、红石条件与供电。增大作用范围和同时启用多个模块都可能增加负载，不要把扩范围当作修复过滤错误的方法。`,
 'rftoolsutility:machines/crafter':`配置步骤
给自动合成器供 FE，把要执行的配方写入配方槽，在输入库存提供材料。为配方设置结果留在内部、送到输出，或仅保留供下一配方使用的中间产物。

多步合成
按先后顺序安排配方：前面的步骤产出后面的原料，再把最终产物送出。检查容器物品等副产物的去向，避免内部槽位被桶或多余中间产物占满。

故障排查
有材料却不运行时核对配方模式、槽位保留、红石条件与输出空间。JEI 的配方转移只帮助填写配方，不会自动补料或决定中间产物保留方式。`,
 'rftoolsutility:machines/matter_transmitter':`操作步骤
物质传送器是出发端，物质接收器是目的端。分别放置设备并供电，再用拨号设备选择接收器并建立目的地。进入传送器前确认界面中的目标。

故障排查
传送失败时查两端电量、目的地是否可用、拨号结果及权限。只摆一个传送器不会自动为它生成接收位置。`,
 'rftoolsutility:machines/matter_receiver':`操作步骤
把物质接收器放在安全的落脚点，供电并配置名称及访问权限。它是传送目的地，出发端需要通过拨号设备选择这台接收器。

故障排查
目标列表找不到它时检查供电、名称、权限和所在维度的可访问状态。确认上方和周边有安全空间；修改目的地后重新检查出发端的拨号。`,
 'rftoolsutility:machines/dialing_device':`操作步骤
打开拨号设备，选择出发端传送器和目标接收器，核对名称、位置与权限后执行拨号。它配置路线，不是直接代替两端设备完成传送。

故障排查
某一端未出现在列表中时，分别检查该设备的电量、可见性和范围规则。改名、拆迁或换接收器后应重新拨号。`,
 'rftoolsutility:machines/screen':`操作步骤
在屏幕内安装对应显示模块，再由屏幕控制器给屏幕网络供电。每个模块单独决定显示文字、能量、库存或其他内容。

配置步骤
需要读取外部机器的模块先绑定读取目标，按模块设置调整字体、位置、格式和显示条件。多个屏幕组合时检查控制器覆盖与连接关系。

故障排查
空白屏幕先查供电和模块，有标题无数据再查模块绑定目标。显示器读取数据，不会自动操作被显示的机器。`,
 'rftoolsutility:machines/screen_controller':`操作步骤
屏幕控制器负责为相应屏幕提供运行能量。放置后供 FE，并确认屏幕位于控制器可以管理的连接范围内。

故障排查
屏幕无内容先分别核对控制器电量、屏幕是否接入、模块是否安装。增加控制器容量不能修复错误的模块目标或格式。`,
 'rftoolspower:powerstorage/powercell':`操作步骤
能量单元存 FE，在各面配置输入、输出或禁用，再连接对应发电和用电线路。观察储量变化和实际输入输出，区分电池容量与每刻传输上限。

故障排查
有电但不供电时查输出面和下游接收面；一直存不住电先看网络负载。单元等级、接口设置和线缆能力都可能限制传输。`,
 'rftoolspower:powerstorage/powercell_card':`操作步骤
能量单元卡用于连接支持的跨空间能量单元。先在目标单元建立卡片的链接信息，再把相同链接的卡装到需要加入该组的单元。

故障排查
卡片有链接不等于设备所有面都已设置输出。逐个检查成员、储量和面配置；普通单机储电设备不一定支持这类网络卡。`,
 'rftoolspower:powerstorage/dimensionalcell':`操作步骤
空间能量单元按卡片链接组成远程供能系统。先建立相同网络，再分别设置各地单元的输入输出面。

故障排查
远端没电时把问题分成两段：源单元是否获得能量，以及目标单元是否已加入相同链接并正确输出。存量和传输上限按当前等级、配置与界面显示判断。`,
};

export const workflows=[
 ['functionalstorage','drawer-access','抽屉：正面存取与锁定',['functionalstorage:oak_1','functionalstorage:oak_2','functionalstorage:oak_4','functionalstorage:configuration_tool'],`操作步骤
正面右键存入手持物品；从正面取出时按抽屉交互规则操作。多格抽屉的各格分别占一种物品，容量大不等于可放无限种类。

使用配置工具切换锁定或显示模式，再对目标抽屉应用。锁定可保留空槽原本分配的物品类型，适合自动化补料；显示物品数量与实际容量是两项设置。

自动化接控制器或支持的面。抽屉放不进物品时检查锁定类型、槽位分配及容量。`, 'Open a drawer from its front and use the configuration tool to change locking and display modes. Each compartment stores one item type. Locking can preserve an assigned type when empty. Check locked types, compartment assignments and capacity before debugging connected automation.'],
 ['functionalstorage','controller-link','抽屉控制器与链接工具',['functionalstorage:storage_controller','functionalstorage:controller_extension','functionalstorage:linking_tool'],`操作步骤
用链接工具选择控制器，再按工具当前模式把目标抽屉加入控制器。需要框选时先确认工具处于选区模式，并检查所选边界。自动化从控制器或控制器扩展访问已链接的库存。

故障排查
控制器不等于按距离自动吸收所有抽屉：检查是否完成链接、是否仍在允许范围、工具是否误处于解除链接模式。更换控制器后重新核对所属关系，避免同一批抽屉链接错目标。`, 'Select a controller with the Linking Tool, then link the intended drawers using its active mode. Automation accesses linked storage through the controller or its extension. Verify link state, range and whether the tool is in unlink mode after rebuilding a network.'],
 ['functionalstorage','void-capacity','容量升级、虚空升级与物品溢出',['functionalstorage:copper_upgrade','functionalstorage:gold_upgrade','functionalstorage:diamond_upgrade','functionalstorage:void_upgrade'],`配置步骤
把容量升级装入支持的升级槽，查看抽屉的实际容量变化。虚空升级用于处理已满库存继续输入时的溢出，并不额外保存这部分物品。

故障排查
缩减容量或拆升级前先取出超额物品。自动化产线要区分“输出满而停机”与“溢出被虚空删除”；需要保留的材料不要依赖虚空升级作为缓存。锁定类型、容量与虚空处理分别检查。`, 'Install capacity upgrades in supported slots and inspect the resulting capacity. Void upgrades discard overflow rather than storing it. Remove excess stock before reducing capacity; distinguish a blocked output from overflow deliberately deleted by a void upgrade.'],
 ['functionalstorage','pull-push','抽取、推送与收集升级',['functionalstorage:puller_upgrade','functionalstorage:pusher_upgrade','functionalstorage:collector_upgrade'],`操作步骤
在抽屉安装对应功能升级，设置它交互的方向。抽取升级从指定方向取物，推送升级向外送物，收集升级处理附近可收集的掉落物，三种动作不能互相替代。

故障排查
先核对方向和周围容器的实际接收面，再看锁定物品、过滤和剩余容量。抽屉无法容纳的类型不会因为装了抽取升级就自动腾出新格。`, 'Configure the direction of puller or pusher upgrades. Collector upgrades handle dropped items rather than ordinary inventory extraction. Check facing, receiving side, assigned item types, filters and capacity.'],
 ['sophisticatedstorage','controller','精妙存储：控制器与连接器',['sophisticatedstorage:controller','sophisticatedstorage:storage_link','sophisticatedstorage:storage_tool'],`操作步骤
把控制器接到支持的箱柜网络。连续的存储方块可组成网络；跨过不相邻位置时使用该模组的连接器或存储链接，不要把不同模组控制器混用。

工具操作
手持存储工具，潜行＋滚轮切换到链接模式，右键选择控制器，再对需要绑定的存储链接操作。潜行对空气使用可清除已选控制器并进入解除链接模式，之后对目标解除。

故障排查
先查控制器所属、连接路径与范围，再查升级过滤。显示隐藏、锁定与网络链接是不同工具模式。`, 'Connect the controller to supported storage. Use Storage Connectors or Storage Links where appropriate. Sneak-scroll the Storage Tool into linking mode, select the controller and bind the target link. Sneak-use in air clears the selection and enters unlinking mode. Check network membership, path and range separately from locking and display modes.'],
 ['sophisticatedstorage','io','精妙存储：输入口、输出口与过滤',['sophisticatedstorage:storage_input','sophisticatedstorage:storage_output'],`操作步骤
把输入口或输出口接入有效的存储网络，再从这些接口连接外部管道。输入接口负责向网络存物，输出接口负责从网络取物；它们本身不提供一整箱独立容量。

故障排查
接口没反应先检查网络归属和连接，再看管道是抽取还是插入、物品是否符合存储过滤。外部机器只接受指定面时，要连到它允许的一面。`, 'Attach input or output blocks to a valid storage network, then connect external automation. These interfaces access network storage rather than providing their own full inventory. Check network membership, transfer direction and filters.'],
 ['sophisticatedstorage','packing','精妙存储：打包搬迁与还原',['sophisticatedstorage:packing_tape','sophisticatedstorage:storage_tool'],`操作步骤
对需要搬迁的存储使用打包胶带，确认已经处于打包状态，再拆下并放到新位置。打包是保留库存搬迁的操作，重新摆放后按界面或提示解包。

故障排查
当前配置可能让容器默认以打包状态掉落，此时胶带提示会显示禁用原因。搬迁后重新核对控制器链接和周围升级交互方向，不要只检查箱内物品还在就认为网络已经恢复。`, 'Pack a container with Packing Tape before moving it, then unpack as prompted after placement. Some configurations make packed drops the default and disable tape use. Recheck controller links and directional automation after relocation.'],
 ['sophisticatedstorage','compression','精妙存储：压缩、合成与升级过滤',['sophisticatedstorage:compacting_upgrade','sophisticatedstorage:compression_upgrade','sophisticatedstorage:void_upgrade'],`配置步骤
压缩、自动合成和虚空是不同功能升级，分别在自身面板设置允许的物品、配方或过滤。不要因为名称都有“压缩”就认为槽位表示和取出行为完全相同。

故障排查
检查升级是否启用、黑白名单、可用配方、材料及输出空间。拆除影响库存表示或容量的升级前，先按界面要求整理内容；虚空升级删除的溢出物不会保存在隐藏格里。`, 'Configure compacting, compression and void upgrades independently. Their recipe, filter and inventory behaviors differ. Inspect enabled state, filters, ingredients, valid recipes and output space. Follow the GUI requirements before removing upgrades affecting stored contents or capacity.'],
];
