// ServerEvents.recipes(event =>{
// //魔改应在此处
// })
// 以下是全部支持的类型：

// ServerEvents.recipes(event => {
// event.recipes.ars_nouveau.enchanting_apparatus(//附魔装置
//         [
//             "minecraft:sand",
//             "minecraft:sand",
//             "minecraft:sand",
//             "minecraft:sand",
//         ], // 输入物品
//     "minecraft:gunpowder", // 反应物
//     "minecraft:tnt", // 输出物品
//     1000, //魔源消耗
//     // true // 是否保持nbt，就像锻造台那样
// );

// event.recipes.ars_nouveau.enchantment(//附魔
//         [
//             "minecraft:sand",
//             "minecraft:sand",
//             "minecraft:sand", 
//             "minecraft:sand",
//         ], // 输入物品
//         "minecraft:vanishing_curse", // 应用的附魔
//         1, // 附魔等级
//         1000, //魔源消耗
//     );

// event.recipes.ars_nouveau.crush(//魔符压印器
//         "minecraft:tnt", // 输入方块
//         [{
//             item:'occultism:datura',
//             chance: 1  
//         }], // 掉落物品表
//            true // 是否掉落在世界中
//     );

//     // 可以直接使用 `/ars-tome id` 在这种情况下 `/ars-tome kubejs:not_glow`
//    //这是在基础的新生魔艺模组下面的一个实例
//     event.recipes.ars_nouveau.caster_tome(
//         "Not-Glow Trap", // 名字,
//         [
//             "ars_nouveau:glyph_touch",
//             "ars_nouveau:glyph_rune",
//             "ars_nouveau:glyph_snare",
//             "ars_nouveau:glyph_extend_time",
//             "ars_nouveau:glyph_light"
//         ], //魔咒
//         "Doesn't snare the target and grant other targets Glowing.", // 描述
//         16718260, // 颜色
//         {
//             "family": "ars_nouveau:default",
//             "pitch": 1.0,
//             "volume": 1.0
//         },
//     ).id("kubejs:not_glow")

//     event.recipes.ars_nouveau.imbuement(//灌注
//         "minecraft:sand", //输入物品
//         "minecraft:tnt", // 输出物品
//         1000, // 魔源消耗
//         [
//             "minecraft:gunpowder" 
//         ] // 基座物品 // 可选
//     )
// })