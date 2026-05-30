// ServerEvents.recipes(e=>{
//     e.custom({
//   "type": "draconicevolution:fusion_crafting",
//   "catalyst": {
//     "item":'minecraft:end_crystal'
//   },
//   "ingredients": [
//     {
//       "consume": true,
//       "ingredient": {
//         "item": 'mysticalagriculture:inferium_essence'
//       }
//     },
//     {
//       "consume": true,
//       "ingredient": {
//         "item": 'mysticalagriculture:inferium_essence'
//       }
//     },
//     {
//       "consume": true,
//       "ingredient": {
//         "item": 'minecraft:ancient_debris'
//       }
//     },
//     {
//       "consume": true,
//       "ingredient": {
//         "item": 'minecraft:ancient_debris'
//       }
//     },
//     {
//       "consume": true,
//       "ingredient": {
//         "item": 'minecraft:amethyst_block'
//       }
//     },
//     {
//       "consume": true,
//       "ingredient": {
//         "item": 'minecraft:amethyst_block'
//       }
//     },
//     {
//       "consume": true,
//       "ingredient": {
//         "item": 'oritech:dubios_container'
//       }
//     },
//     {
//       "consume": true,
//       "ingredient": {
//         "item ": 'oritech:dubios_container'
//       }
//     }
//   ],
//   "result": {
//     "count": 1,
//     "id": 'mysticalagriculture:infusion_crystal'
//   },
//   "techLevel": "draconium",
//   "totalEnergy": 3200000
// })
// })

ServerEvents.recipes(event=>{
    const Tier = {
        1: "draconium",
        2: "wyvern",
        3: "draconic",
        4: "chaotic"
    }
    fusion_crafting('extendedcrafting:advanced_table','extendedcrafting:elite_table', Tier[1], 20000000,
        [
            ['oritech:advanced_battery', 2],
            ['oritech:superconductor', 2],
            ['oritech:flux_gate', 2],
            ['oritech:dubios_container', 2],
            ['minecraft:ancient_debris', 2],
            ['easy_villagers:villager',2]
        ]
    )

    fusion_crafting('minecraft:end_crystal','mysticalagriculture:infusion_crystal' , Tier[1], 20000000,
        [
            ['mysticalagriculture:inferium_essence', 2],
            ['minecraft:ancient_debris', 2],
            ['minecraft:amethyst_block', 2],
            ['oritech:dubios_container', 2],
            // ['oritech:flux_gate', 2]
        ]
    )

    fusion_crafting('minecraft:blackstone','minecraft:ancient_debris' , Tier[1], 20000000,
        [
            ['minecraft:basalt', 2],
            ['minecraft:cobbled_deepslate', 2],
            ['occultism:otherworld_essence', 2],
            ['draconicevolution:module_core', 2],
            ['minecraft:netherite_ingot', 2],
            ['minecraft:netherite_scrap', 2]
        ]
    )

    fusion_crafting('minecraft:clock','notenoughwands:acceleration_wand' , Tier[1], 20000000,
        [
            ['notenoughwands:advanced_wand_core', 2],
            ['actuallyadditions:empowered_restonia_crystal_block', 2],
            ['actuallyadditions:empowered_restonia_crystal_block', 2],
            ['torcherino:torcherino', 2],
            ['torcherino:torcherino', 2],
            ['oritech:duratium_dust', 1],
            ['oritech:overcharged_crystal', 1]
        ]
    )

    fusion_crafting('ars_nouveau:summon_focus','oritech:refinery_block' , Tier[1], 20000000,
        [
            ['oritech:refinery_module_block', 2],
            ['oritech:refinery_module_block', 2],
            ['oritech:motor', 2],
            ['alltheores:steel_block', 2],
            ['alltheores:steel_block', 2],
            ['minecraft:cauldron', 1]
        ]
    )

    fusion_crafting('extendedcrafting:flux_star','naturesaura:offering_table', Tier[1], 20000000,
        [
            ['actuallyadditions:empowered_emeradic_crystal_block', 2],
            ['actuallyadditions:empowered_emeradic_crystal_block', 2],
            ['oritech:fluxite_block', 2],
            ['aether:ambrosium_block', 2],
            ['easy_villagers:villager', 2],
            ['ars_nouveau:summon_focus', 1]
        ]
    )

    fusion_crafting('draconicevolution:basic_crafting_injector','draconicevolution:wyvern_crafting_injector', Tier[1], 20000000,
        [
            ['minecraft:diamond_block', 2],
            ['minecraft:diamond_block', 2],
            ['draconicevolution:draconium_core', 2],
            ['draconicevolution:draconium_block', 2],
            ['draconicevolution:draconium_block', 2],
            ['rain:god_creation_keepsake', 1],
            ['draconicevolution:wyvern_core', 1]
        ]
    )

    fusion_crafting('minecraft:writable_book','reliquary:alkahestry_tome', Tier[2], 50000000,
        [
            ['minecraft:diamond_block', 2],
            ['extendedcrafting:nether_star_block', 2],
            ['minecraft:ancient_debris', 2],
            ['draconicevolution:draconium_block', 2],
            ['draconicevolution:wyvern_energy_core', 2],
            ['draconicevolution:wyvern_energy_core', 2]

        ]
    )

    fusion_crafting('allthemodium:allthemodium_block','oritech:atomic_forge_block', Tier[2], 50000000,
    [
        ['oritech:overcharged_crystal', 2],
        ['draconicevolution:wyvern_core', 2],
        ['minecraft:ancient_debris', 2],
        ['draconicevolution:draconium_block', 2],
        ['oritech:reinforced_carbon_sheet', 2],
        ['oritech:reinforced_carbon_sheet', 2],
        ['minecraft:ancient_debris', 2]

    ]
)

fusion_crafting('minecraft:iron_block','naturesaura:infused_iron_block', Tier[2], 5000000,
    [
        ['rain:void_mixture', 10]
    ],10,10
)

fusion_crafting('minecraft:gold_block','naturesaura:tainted_gold_block', Tier[2], 5000000,
    [
        ['rain:void_mixture', 10]
    ],10,10
)

fusion_crafting('hostilenetworks:deep_learner','hostilenetworks:loot_fabricator', Tier[2], 50000000,
    [
        ['alltheores:steel_block', 2],
        ['alltheores:enderium_block', 2],
        ['draconicevolution:wyvern_energy_core', 2],
        ['draconicevolution:draconium_block', 2],
        ['draconicevolution:wyvern_core', 2],
    ]
)

fusion_crafting('hostilenetworks:blank_data_model','hostilenetworks:sim_chamber', Tier[2], 50000000,
    [
        ['alltheores:steel_block', 2],
        ['alltheores:enderium_block', 2],
        ['draconicevolution:wyvern_energy_core', 2],
        ['draconicevolution:draconium_block', 2],
        ['draconicevolution:wyvern_core', 2],
    ]
)

fusion_crafting('draconicevolution:wyvern_crafting_injector','draconicevolution:awakened_crafting_injector', Tier[2], 500000000,
    [
        ['oritech:black_hole_block', 1],
        ['minecraft:ancient_debris', 2],
        ['allthemodium:vibranium_upgrade_smithing_template', 1],
        ['draconicevolution:draconium_block', 2],
        ['draconicevolution:wyvern_core', 2],
        ['naturesaura:sky_ingot_block',2],
        ['stellaris:desh_ingot',2]
    ]
)

fusion_crafting('minecraft:sculk_shrieker','minecraft:end_portal_frame', Tier[3], 500000000,
    [
        ['ironfurnaces:rainbow_coal', 1],
        ['draconicevolution:dragon_heart', 1],
        ['minecraft:end_crystal', 1],
        ['stellaris:corronium_ingot', 1],
        ['stellaris:desh_ingot', 1],
        ['naturesaura:sky_ingot_block',1],
        ['extendedcrafting:crystaltine_ingot',1],
        ['minecraft:end_stone',1]
    ]
)

fusion_crafting('ars_caelum:ritual_conjure_island_village','ars_caelum:ritual_conjure_island_end_portal', Tier[3], 500000000,
    [
        ['minecraft:end_portal_frame', 12]
    ]
)

fusion_crafting('naturesaura:infused_iron_block','naturesaura:sky_ingot_block', Tier[2], 5000000,
    [
        ['rain:void_mixture', 10]
    ],2,4
)

fusion_crafting('naturesaura:tainted_gold_block','naturesaura:sky_ingot_block', Tier[2], 50000000,
    [
        ['rain:void_mixture', 14]
    ],2,8
)

fusion_crafting('rain:mineral_upgrade-3','rain:mineral_upgrade-4', Tier[3], 50000000,
    [
        ['draconicevolution:awakened_draconium_block', 4],
        ['draconicevolution:wyvern_core',4],
        ['naturesaura:sky_ingot_block',2],
        ['oritech:black_hole_block',2],
        ['draconicevolution:dragon_heart',2]
    ]
)

fusion_crafting('rain:mineral_upgrade-4','rain:mineral_upgrade-5', Tier[4], 500000000,
    [
        ['allthemodium:unobtainium_vibranium_alloy_block', 2],
        ['rain:data_storage_matrix',2],
        ['easy_villagers:villager',2],
        ['oritech:black_hole_block',2],
        ['tombstone:grave_dust',4]
    ]
)

fusion_crafting('industrialforegoing:machine_frame_advanced','industrialforegoing:machine_frame_supreme', Tier[4], 500000000,
    [
        ['alltheores:cinnabar_block', 2],
        ['silentgear:azure_electrum_block',2],
        ['easy_villagers:villager',2],
        ['oritech:black_hole_block',2],
        ['tombstone:grave_dust',4]
    ]
)

fusion_crafting('artifacts:eternal_steak','ars_nouveau:mendosteen_pod', Tier[4], 500000000,
    [
        ['rain:data_storage_matrix', 2],
        ['mekanism_extras:qio_drive_singularity',2],
        ['easy_villagers:villager',2],
        ['oritech:black_hole_block',2],
        ['rain:data_storage_matrix',2]
    ]
)




     /**
     * 聚合核心
     * @param {string} catalyst 核心输入
     * @param {string} result 输出
     * @param {string} techLevel 等级
     * @param {number} totalEnergy 能量
     * @param {Array<[string, number]|{string, number, 'tag'?}>} ingredients [物品，数量]
     * @param {number} resultCount 输出数量
     * @param {number} catalystCount 输入数量（可选）
     * @param {object} components 数据组件
     * @returns 
     */

    function fusion_crafting(catalyst, result, techLevel, totalEnergy, ingredients, resultCount, catalystCount, components) {
        var catalystObj;
        if (catalystCount && catalystCount > 1) {
            catalystObj = {
                type: "draconicevolution:stack",
                count: catalystCount,
                items: catalyst
            };
        } else {
            catalystObj = { item: catalyst };
        }

        var f_ingredients = [];
        for (var i = 0; i < ingredients.length; i++) {
            var entry = ingredients[i];
            var itemOrTag = (entry[2] === 'tag') ? { tag: entry[0] } : { item: entry[0] };
            for (var j = 0; j < entry[1]; j++) {
                f_ingredients.push({
                    consume: true,
                    ingredient: itemOrTag
                });
            }
        }

        var resultObj = {
            count: resultCount || 1,
            id: result
        };
        if (components) {
            resultObj.components = components
        }

        event.custom({
            type: "draconicevolution:fusion_crafting",
            catalyst: catalystObj,
            result: resultObj,
            techLevel: techLevel,
            totalEnergy: totalEnergy,
            ingredients: f_ingredients
        });

        // console.log("已注册配方: " + result +
        //     " | 催化剂: " + catalyst +
        //     (catalystCount > 1 ? " x" + catalystCount : ""));
    }
})