ServerEvents.recipes(e=>{
    e.recipes.ars_nouveau.enchanting_apparatus(     //附魔装置
        [
            'ae2:flawless_budding_quartz',
            'ae2:flawless_budding_quartz',
            'minecraft:amethyst_block',
            'minecraft:amethyst_block',
            'minecraft:amethyst_block',
            'extendedae:silicon_block',
            'extendedae:silicon_block',
           'ars_nouveau:source_gem_block'
        ], // 输入物品
    'minecraft:netherite_upgrade_smithing_template', 
    'ae2:silicon_press', // 输出物品
    1000, //魔源消耗
    true // 是否保持nbt，就像锻造台那样
);



 e.recipes.ars_nouveau.enchanting_apparatus(     //附魔装置
        [
            'ae2:flawless_budding_quartz',
            'ae2:flawless_budding_quartz',
            'minecraft:amethyst_block',
            'minecraft:amethyst_block',
            'minecraft:amethyst_block',
            'ae2:quartz_block',
            'ae2:quartz_block',
            'extendedcrafting:black_iron_block'
        ], // 输入物品
    'minecraft:netherite_upgrade_smithing_template', 
    'ae2:calculation_processor_press', // 输出物品
    1000, //魔源消耗
    true // 是否保持nbt，就像锻造台那样
);

e.recipes.ars_nouveau.enchanting_apparatus(     //附魔装置
        [
            'ae2:flawless_budding_quartz',
            'ae2:flawless_budding_quartz',
            'minecraft:amethyst_block',
            'minecraft:amethyst_block',
            'minecraft:amethyst_block',
            'ars_nouveau:fire_essence',
            'minecraft:diamond_block',
            'minecraft:diamond_block'
        ], // 输入物品
    'minecraft:netherite_upgrade_smithing_template', 
   'ae2:engineering_processor_press', // 输出物品
    1000, //魔源消耗
    true // 是否保持nbt，就像锻造台那样
);

e.recipes.ars_nouveau.enchanting_apparatus(     //附魔装置
        [
           'mysticalagriculture:nature_agglomeratio',
            'mysticalagriculture:nature_agglomeratio',
            'mysticalagriculture:nature_agglomeratio',
           'mysticalagriculture:nature_agglomeratio',
           'mysticalagriculture:inferium_essence',
            'mysticalagriculture:inferium_essence',
            'mysticalagriculture:inferium_essence',
            'mysticalagriculture:inferium_essence'
        ], // 输入物品
   'mysticalagriculture:prosperity_seed_base', 
   'mysticalagriculture:nature_seeds', // 输出物品
    1000, //魔源消耗
    true // 是否保持nbt，就像锻造台那样
);

e.recipes.ars_nouveau.enchanting_apparatus(     //附魔装置
        [
            'ae2:flawless_budding_quartz',
            'ae2:flawless_budding_quartz',
            'minecraft:amethyst_block',
            'minecraft:amethyst_block',
            'minecraft:amethyst_block',
            'ars_nouveau:manipulation_essence',
            'minecraft:gold_block',
            'minecraft:gold_block'
        ], // 输入物品
    'minecraft:netherite_upgrade_smithing_template', 
    'ae2:logic_processor_press', // 输出物品
    1000, //魔源消耗
    true // 是否保持nbt，就像锻造台那样
);

e.recipes.ars_nouveau.enchanting_apparatus(     //附魔装置
        [
            'rain:portal_fragment',
            'rain:portal_fragment',
            'rain:portal_fragment',
            'rain:portal_fragment',
            'rain:white_upgrade',
            'ars_nouveau:source_gem_block',
            'occultism:otherworld_essence',
            'occultism:otherworld_essence'
        ], // 输入物品
    'rain:mineral_upgrade-1', 
    'rain:mineral_upgrade-2', // 输出物品
    1000, //魔源消耗
    true // 是否保持nbt，就像锻造台那样
);

e.recipes.ars_nouveau.imbuement(//灌注
        'ars_nouveau:earth_essence', //输入物品
        'naturesaura:gold_fiber', // 输出物品
        1000, // 魔源消耗
        [
            '#minecraft:leaves',
            'mysticalagriculture:nature_essence',
            'mysticalagriculture:dye_essence',
            'minecraft:amethyst_block',
            'ars_nouveau:summon_focus'
        ] // 基座物品 // 可选
    )
})

// ServerEvents.recipes(e={
//     e.recipes.ars_nouveau.enchanting_apparatus(     //附魔装置
//         [
//             "minecraft:sand",
//             "minecraft:sand",
//             "minecraft:sand",
//             "minecraft:sand",
//         ], // 输入物品
//      'minecraft:gunpowder', 
//     "minecraft:tnt", // 输出物品
//     1000, //魔源消耗
//     true // 是否保持nbt，就像锻造台那样
// );
// })