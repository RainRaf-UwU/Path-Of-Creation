// ServerEvents.recipes((event) => {
//     event.recipes.portaltransform.item_transform(
//         "minecraft:cobblestone", // 输入物品
//         "minecraft:prismarine", // 输出物品
//         [
//                  Byproduct.of("minecraft:redstone", 0.8, 1, 4) // 副产物 Byproduct.of(副产物, 副产物产出概率, 最小产出数量, 最大产出数量)
//         ], 
//         ["minecraft:overworld", "minecraft:the_nether"], // 维度要求[输入维度, 目标维度]
//         "any", // 天气条件，可以填写的内容有“any”,“rain”，“clear”，“thunder”
//         0.1 // 物品 A 转变为物品 B 的概率
//     );
// })

ServerEvents.recipes(e=>{
    e.recipes.portaltransform.item_transform(
        'minecraft:flint',
        'aether:ambrosium_shard',
        [
                 Byproduct.of('rain:portal_fragment', 0.1, 1, 2) // 副产物 Byproduct.of(副产物, 副产物产出概率, 最小产出数量, 最大产出数量)
        ],
        ["minecraft:overworld", "aether:the_aether"],
        "any",
        0.5
    )

    e.recipes.portaltransform.item_transform(
       'minecraft:diamond',
         'ae2:crafting_unit',
        [
                 Byproduct.of('rain:portal_fragment', 0.1, 1, 2) // 副产物 Byproduct.of(副产物, 副产物产出概率, 最小产出数量, 最大产出数量)
        ],
        ["minecraft:overworld", "aether:the_aether"],
        "any",
        0.5
    )

    e.recipes.portaltransform.item_transform(
        'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:villager"]',
        'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:aether/valkyrie"]',
        [
                 Byproduct.of('rain:portal_fragment', 0.1, 1, 2) // 副产物 Byproduct.of(副产物, 副产物产出概率, 最小产出数量, 最大产出数量)
        ],
        ["minecraft:overworld", "aether:the_aether"],
        "any"
    )
})
