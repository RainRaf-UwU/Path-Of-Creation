//无尽贪婪
const blocks = ['avaritia:end_crafting_table', 'avaritia:nether_crafting_table', 'avaritia:densest_neutron_collector', 'avaritia:neutron', 'avaritia:neutron_collector', 'avaritia:compressed_crafting_table', 'avaritia:extreme_crafting_table', 'avaritia:double_compressed_crafting_table', 'avaritia:blaze_cube_block', 'avaritia:denser_neutron_collector', 'avaritia:dense_neutron_collector', 'avaritia:infinity', 'avaritia:sculk_crafting_table', 'avaritia:neutron_compressor', 'avaritia:crystal_matrix', 'avaritia:extreme_smithing_table', 'avaritia:infinity_clock', 'avaritia:diamond_lattice_block', 'avaritia:star_fuel_block', 'avaritia:refined_coal_block', 'avaritia:soul_farmland', 'avaritia:infinity_chest', 'avaritia:compressed_chest']
const mainitem = 'mekanism:configurator'

BlockEvents.broken(blocks, event => {
    const player = event.player
    const block = event.block

    if (player) {
        player.tell(Text.green(Text.translate('avaritia.kubejs.info')).append(Text.aqua(Item.of(mainitem).displayName)).append(Text.green(Text.translate('avaritia.kubejs.info1'))))
        event.cancel()
    }
})
BlockEvents.leftClicked(blocks, event => {
    const player = event.player
    const block = event.block

    if (!player || !player.isPlayer()) {
        return;
    }
    if (player.mainHandItem.id == mainitem) {
        block.popItem(block.getItem())
        block.set('air')
    }
})
ServerEvents.recipes(event => {
    const { kubejs, extendedcrafting } = event.recipes

    kubejs.shaped('avaritia:diamond_lattice', ['a a', ' b ', 'a a'], { a: 'minecraft:diamond', b: 'minecraft:netherite_scrap' })

    //组合
    event.custom(
        {
            "type": "extendedcrafting:combination",
            "power_cost": 100000000,
            "power_rate": 1000000,
            "input": {
                "item": "avaritia:neutron"
            },
            "ingredients": [
                {
                    "item": "avaritia:neutron_gear"
                },
                {
                    "item": "avaritia:crystal_matrix"
                },
                {
                    "item": 'mekanism:pellet_polonium'
                },
                {
                    "item": "avaritia:neutron_gear"
                },
                {
                    "item": "avaritia:crystal_matrix"
                },
                {
                    "item": 'mekanism_extras:absolute_control_circuit'
                },
                {
                    "item": "avaritia:neutron_gear"
                },
                {
                    "item": "avaritia:crystal_matrix"
                },
                {
                    "item": 'mekanism:pellet_polonium'
                },
                {
                    "item": "avaritia:neutron_gear"
                },
                {
                    "item": "avaritia:crystal_matrix"
                },
                {
                    "item": 'mekanism_extras:absolute_control_circuit'
                }
            ],
            "result": {
                "id": 'avaritia:neutron_compressor'
            }
        }
    )

    //工作台

    // event.custom(
    //     {
    //         "type": "extendedcrafting:shaped_table",
    //         "pattern": [
    //             "AAA",
    //             "ABA",
    //             "AAA"
    //         ],
    //         "key": {
    //             "A": {
    //                 "item": "projecte:aeternalis_fuel"
    //             },
    //             "B": {
    //                 "item": "avaritia:neutron_ingot"
    //             }
    //         },
    //         "result": {
    //             "id": "avaritia:refined_coal",
    //             "count": 32
    //         }
    //     }
    // )

    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "key": {
                "A": {
                    "item": "avaritia:crystal_matrix"
                },
                "B": {
                    "item": "avaritia:infinity_nugget"
                },
                "C": {
                    "item": "avaritia:crystal_matrix_ingot"
                },
                "E": {
                    "item": "avaritia:endest_pearl"
                },
                "N": {
                    "item": "avaritia:neutron_ingot"
                },
                "P": {
                    "item": "avaritia:neutron_pile"
                },
                "X": {
                    "item": "avaritia:infinity_catalyst"
                }
            },
            "pattern": [
                "   PPP   ",
                " NPCCCPN ",
                " PABBBAP ",
                "PCBBXBBCP",
                "PCBXEXBCP",
                "PCBBXBBCP",
                " PABBBAP ",
                " NPCCCPN ",
                "   PPP   "
            ],
            "result": {
                "id": "avaritia:enhancement_core"
            }
        }
    )
    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "key": {
                "a": {
                    "item": "avaritia:neutron_ingot"
                },
                "b": {
                    "item": "avaritia:crystal_matrix_ingot"
                },
                "c": {
                    "item": "avaritia:crystal_matrix"
                },
                "d": {
                    "item": "avaritia:endest_pearl"
                },
                "e": {
                    "item": "avaritia:infinity_catalyst"
                }
            },
            "pattern": [
                "  aaa  ",
                " cbbbc ",
                "ab d ba",
                "abdedba",
                "ab d ba",
                " cbbbc ",
                "  aaa  "
            ],
            "result": {
                "id": "avaritia:neutron_ring"
            }
        }
    )
    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "key": {
                "a": {
                    "item": "minecraft:coal"
                },
                "b": {
                    "item": "avaritia:neutron_nugget"
                }
            },
            "pattern": [
                "     ",
                " aaa ",
                " aba ",
                " aaa ",
                "     "
            ],
            "result": {
                "id": "avaritia:refined_coal"
            },
        }
    )
    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "key": {
                "a": {
                    "item": "minecraft:coal_block"
                },
                "b": {
                    "item": "minecraft:magma_block"
                },
                "c": {
                    "item": "minecraft:lava_bucket"
                },
                "d": {
                    "item": "avaritia:eternal_singularity"
                },
                "e": {
                    "item": "avaritia:refined_coal_block"
                }
            },
            "pattern": [
                "         ",
                "  aaaaa  ",
                " abbcbba ",
                " abeeeba ",
                " acedeca ",
                " abeeeba ",
                " abbcbba ",
                "  aaaaa  ",
                "         "
            ],
            "result": {
                "id": "avaritia:star_fuel"
            },
        }
    )

    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "pattern": [
                " ABA ",
                "ACDCA",
                "BDEDB",
                "ACDCA",
                " ABA "
            ],
            "key": {
                "A": {
                    "item": "minecraft:blaze_powder"
                },
                "B": {
                    "item": "minecraft:fire_charge"
                },
                "C": {
                    "item": "mysticalagriculture:wither_skeleton_essence"
                },
                "D": {
                    "item": "minecraft:blaze_rod"
                },
                "E": {
                    "item": "minecraft:ancient_debris"
                }
            },
            "result": {
                "id": 'avaritia:blaze_cube'
            }
        }
    )
    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "pattern": [
                "  A  ",
                " AAA ",
                "AABAA",
                " AAA ",
                "  A  "
            ],
            "key": {
                "A": {
                    "item": "avaritia:neutron_pile"
                },
                "B": {
                    "tag": "c:music_discs"
                }
            },
            "result": {
                "id": 'avaritia:record_fragment'
            }
        }
    )
    // event.custom(
    //     {
    //         "type": "extendedcrafting:shaped_table",
    //         "pattern": [
    //             " AA AA ",
    //             "AABCBAA",
    //             "ABCDCBA",
    //             " CDEDC ",
    //             "ABCDCBA",
    //             "AABCBAA",
    //             " AA AA "
    //         ],
    //         "key": {
    //             "A": {
    //                 "item": "avaritia:crystal_matrix"
    //             },
    //             "B": {
    //                 "item": "actuallyadditions:empowered_restonia_crystal_block"
    //             },
    //             "C": {
    //                 "item": "kubejs:prediction_nexus"
    //             },
    //             "D": {
    //                 "item": "occultism:mining_dim_core"
    //             },
    //             "E": {
    //                 "item": "megacells:cell_component_256m"
    //             }
    //         },
    //         "result": {
    //             "id": 'avaritia:neutron_collector'
    //         }
    //     }
    // )
    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "pattern": [
                "ABBCBBA",
                "BCDDDCB",
                "BDEEEDB",
                "CDEFEDC",
                "BDEEEDB",
                "BCDDDCB",
                "ABBCBBA"
            ],
            "key": {
                "A": {
                    "item": "avaritia:neutron_gear"
                },
                "B": {
                    "item": "minecraft:ender_pearl"
                },
                "C": {
                    "item": "avaritia:diamond_lattice"
                },
                "D": {
                    "item": "actuallyadditions:emeradic_crystal_block"
                },
                "E": {
                    "item": "avaritia:neutron_collector"
                },
                "F": {
                    "item": "avaritia:endest_pearl"
                }
            },
            "result": {
                "id": 'avaritia:dense_neutron_collector'
            }
        }
    )
    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "pattern": [
                "AB   BA",
                "BACCCAB",
                " CDDDC ",
                " CDEDC ",
                " CDDDC ",
                "BACCCAB",
                "AB   BA"
            ],
            "key": {
                "A": {
                    "item": "mysticalagradditions:creative_essence"
                },
                "B": {
                    "item": "avaritia:blaze_cube"
                },
                "C": {
                    "item": "avaritia:blaze_cube_block"
                },
                "D": {
                    "item": "avaritia:dense_neutron_collector"
                },
                "E": {
                    "item": "avaritia:neutron_gear"
                }
            },
            "result": {
                "id": 'avaritia:denser_neutron_collector'
            }
        }
    )
    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "pattern": [
                "AABBBAA",
                "ABCCCBA",
                "BCDDDCB",
                "BCDEDCB",
                "BCDDDCB",
                "ABCCCBA",
                "AABBBAA"
            ],
            "key": {
                "A": {
                    "item": "avaritia:neutron_gear"
                },
                "B": {
                    "item": "mekmm:uu_matter"
                },
                "C": {
                    "item": "advanced_ae:quantum_alloy_block"
                },
                "D": {
                    "item": "avaritia:denser_neutron_collector"
                },
                "E": {
                    "items": "avaritia:singularity",
                    "components": {
                        "avaritia:singularity_id": "avaritia:redstone"
                    },
                    "type": "neoforge:components"
                }
            },
            "result": {
                "id": 'avaritia:densest_neutron_collector'
            }
        }
    )
    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "pattern": [
                "         ",
                "  AAAAA  ",
                " ABBBBBA ",
                " A CBC A ",
                " ABBBBBA ",
                " ABBBBBA ",
                " AB B BA ",
                "         ",
                "         "
            ],
            "key": {
                "A": {
                    "item": "avaritia:neutron_ingot"
                },
                "B": {
                    "item": "avaritia:infinity_ingot"
                },
                "C": {
                    "item": "avaritia:infinity_catalyst"
                }
            },
            "result": {
                "id": 'avaritia:infinity_helmet'
            }
        }
    )
    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "pattern": [
                " AA   AA ",
                "AAA   AAA",
                "AAAAAAAAA",
                " ABBBBBA ",
                " ABBCBBA ",
                " ABBBBBA ",
                " ABBBBBA ",
                " ABBBBBA ",
                "  AAAAA  "
            ],
            "key": {
                "A": {
                    "item": "avaritia:neutron_ingot"
                },
                "B": {
                    "item": "avaritia:infinity_ingot"
                },
                "C": {
                    "item": "avaritia:crystal_matrix"
                }
            },
            "result": {
                "id": 'avaritia:infinity_chestplate'
            }
        }
    )
    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "pattern": [
                "AAAAAAAAA",
                "ABBBCBBBA",
                "ABAACAABA",
                "ABA   ABA",
                "ADA   ADA",
                "ABA   ABA",
                "ABA   ABA",
                "ABA   ABA",
                "AAA   AAA"
            ],
            "key": {
                "A": {
                    "item": "avaritia:neutron_ingot"
                },
                "B": {
                    "item": "avaritia:infinity_ingot"
                },
                "C": {
                    "item": "avaritia:infinity_catalyst"
                },
                "D": {
                    "item": "avaritia:crystal_matrix_ingot"
                }
            },
            "result": {
                "id": 'avaritia:infinity_pants'
            }
        }
    )
    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "pattern": [
                "         ",
                " AAA AAA ",
                " ABA ABA ",
                " ABA ABA ",
                "AABA ABAA",
                "ABBA ABBA",
                "AAAA AAAA",
                "         ",
                "         "
            ],
            "key": {
                "A": {
                    "item": "avaritia:neutron_ingot"
                },
                "B": {
                    "item": "avaritia:infinity_ingot"
                }
            },
            "result": {
                "id": 'avaritia:infinity_boots'
            }
        }
    )
    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "key": {
                "A": {
                    "item": "avaritia:crystal_matrix"
                },
                "B": {
                    "item": "avaritia:neutron"
                },
                "I": {
                    "item": "avaritia:infinity_ingot"
                },
                "N": {
                    "item": "avaritia:neutron_ingot"
                },
                "X": {
                    "item": "avaritia:infinity_catalyst"
                }
            },
            "pattern": [
                "    II   ",
                "   II  B ",
                "  IIIAA  ",
                "  IIAXA  ",
                "  I AAII ",
                "   N  II ",
                "  N      ",
                " N       ",
                "A        "
            ],
            "result": {
                "id": "avaritia:infinity_axe"
            },
        }
    )
    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "key": {
                "A": {
                    "item": "avaritia:crystal_matrix"
                },
                "C": {
                    "item": "avaritia:crystal_matrix_ingot"
                },
                "I": {
                    "item": "avaritia:infinity_ingot"
                },
                "N": {
                    "item": "avaritia:neutron_ingot"
                },
                "P": {
                    "item": "avaritia:neutron_pile"
                },
                "X": {
                    "item": "avaritia:infinity_catalyst"
                }
            },
            "pattern": [
                "      III",
                "  AAIINNP",
                " AXA   C ",
                " AA   C  ",
                " I   C   ",
                " I  C    ",
                "IN C     ",
                "INC      ",
                "IP       "
            ],
            "result": {
                "id": "avaritia:infinity_bow"
            },
        }
    )
    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "key": {
                "A": {
                    "item": "avaritia:crystal_matrix"
                },
                "C": {
                    "item": "avaritia:crystal_matrix_ingot"
                },
                "I": {
                    "item": "avaritia:infinity_ingot"
                },
                "N": {
                    "item": "avaritia:neutron_ingot"
                },
                "P": {
                    "item": "avaritia:neutron_pile"
                },
                "X": {
                    "item": "avaritia:infinity_catalyst"
                }
            },
            "pattern": [
                "   IIIIIP",
                " AC N  C ",
                " CXN  C  ",
                "I NIPC   ",
                "IN PCN   ",
                "I  CNIN  ",
                "I C  NNA ",
                "IC    AAN",
                "P      NN"
            ],
            "result": {
                "id": "avaritia:infinity_crossbow"
            },
        }
    )
    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "key": {
                "A": {
                    "item": "avaritia:crystal_matrix"
                },
                "I": {
                    "item": "avaritia:infinity_ingot"
                },
                "N": {
                    "item": "avaritia:neutron_ingot"
                },
                "X": {
                    "item": "avaritia:infinity_catalyst"
                }
            },
            "pattern": [
                " IIIIIIAA",
                "  IIIIAXA",
                "      AAI",
                "     N II",
                "    N    ",
                "   N     ",
                "  N      ",
                " N       ",
                "A        "
            ],
            "result": {
                "id": "avaritia:infinity_hoe"
            },
        }
    )
    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "key": {
                "A": {
                    "item": "avaritia:crystal_matrix"
                },
                "B": {
                    "item": "avaritia:neutron"
                },
                "I": {
                    "item": "avaritia:infinity_ingot"
                },
                "N": {
                    "item": "avaritia:neutron_ingot"
                },
                "X": {
                    "item": "avaritia:infinity_catalyst"
                }
            },
            "pattern": [
                " IIIIII B",
                "    IIAA ",
                "     AXAI",
                "     AAII",
                "    N  II",
                "   N    I",
                "  N     I",
                " N      I",
                "A        "
            ],
            "result": {
                "id": "avaritia:infinity_pickaxe"
            },
        }
    )
    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "key": {
                "A": {
                    "item": "avaritia:crystal_matrix"
                },
                "C": {
                    "item": "avaritia:crystal_matrix_ingot"
                },
                "I": {
                    "item": "avaritia:infinity_ingot"
                },
                "N": {
                    "item": "avaritia:neutron_ingot"
                },
                "X": {
                    "item": "avaritia:infinity_catalyst"
                }
            },
            "pattern": [
                "      III",
                "     IIII",
                "    CIIII",
                "    ACII ",
                "   AXAC  ",
                "   NA    ",
                "  N      ",
                " N       ",
                "A        "
            ],
            "result": {
                "id": "avaritia:infinity_shovel"
            },
        }
    )
    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "key": {
                "A": {
                    "item": "avaritia:crystal_matrix"
                },
                "B": {
                    "item": "avaritia:neutron"
                },
                "C": {
                    "item": "avaritia:crystal_matrix_ingot"
                },
                "I": {
                    "item": "avaritia:infinity_ingot"
                },
                "N": {
                    "item": "avaritia:neutron_ingot"
                },
                "X": {
                    "item": "avaritia:infinity_catalyst"
                }
            },
            "pattern": [
                "      NNN",
                "     NIIN",
                "    NIIIN",
                "   NIIIN ",
                "CCNIIIN  ",
                " AACIN   ",
                " ABAN    ",
                " NAAC    ",
                "X   C    "
            ],
            "result": {
                "id": "avaritia:infinity_sword"
            },
        }
    )

    // event.custom(
    //     {
    //         "type": "extendedcrafting:shaped_table",
    //         "pattern": [
    //             "   AAA   ",
    //             " AABBBAA ",
    //             " ABBBBBA ",
    //             "ABBBCBBBA",
    //             "ABBCDCBBA",
    //             "ABBBCBBBA",
    //             " ABBBBBA ",
    //             " AABBBAA ",
    //             "   AAA   "
    //         ],
    //         "key": {
    //             "A": {
    //                 "item": "minecraft:end_stone"
    //             },
    //             "B": {
    //                 "item": "minecraft:ender_pearl"
    //             },
    //             "C": {
    //                 "item": "avaritia:neutron_ingot"
    //             },
    //             "D": {
    //                 "item": "forbidden_arcanus:dark_nether_star"
    //             }
    //         },
    //         "result": {
    //             "id": 'avaritia:endest_pearl'
    //         }
    //     }
    // )
    event.custom(
        {
            "type": "extendedcrafting:shaped_table",
            "key": {
                "a": {
                    "item": "avaritia:crystal_matrix_ingot"
                },
                "b": {
                    "item": "avaritia:crystal_matrix"
                },
                "c": {
                    "item": "avaritia:neutron_ingot"
                },
                "d": {
                    "item": "avaritia:neutron_pile"
                },
                "e": {
                    "item": "avaritia:infinity_nugget"
                },
                "f": {
                    "item": "avaritia:infinity_ingot"
                },
                "g": {
                    "item": "avaritia:infinity_catalyst"
                },
                "h": {
                    "item": "minecraft:netherite_upgrade_smithing_template"
                },
                "i": {
                    "item": "minecraft:sentry_armor_trim_smithing_template"
                },
                "j": {
                    "item": "minecraft:dune_armor_trim_smithing_template"
                },
                "k": {
                    "item": "minecraft:coast_armor_trim_smithing_template"
                },
                "l": {
                    "item": "minecraft:wild_armor_trim_smithing_template"
                },
                "m": {
                    "item": "minecraft:ward_armor_trim_smithing_template"
                },
                "n": {
                    "item": "minecraft:eye_armor_trim_smithing_template"
                },
                "o": {
                    "item": "minecraft:vex_armor_trim_smithing_template"
                },
                "p": {
                    "item": "minecraft:tide_armor_trim_smithing_template"
                },
                "q": {
                    "item": "minecraft:snout_armor_trim_smithing_template"
                },
                "r": {
                    "item": "minecraft:rib_armor_trim_smithing_template"
                },
                "s": {
                    "item": "minecraft:spire_armor_trim_smithing_template"
                },
                "t": {
                    "item": "minecraft:wayfinder_armor_trim_smithing_template"
                },
                "u": {
                    "item": "minecraft:shaper_armor_trim_smithing_template"
                },
                "v": {
                    "item": "minecraft:silence_armor_trim_smithing_template"
                },
                "w": {
                    "item": "minecraft:raiser_armor_trim_smithing_template"
                },
                "x": {
                    "item": "minecraft:host_armor_trim_smithing_template"
                }
            },
            "pattern": [
                " aaabaaa ",
                " accecca ",
                " acefeca ",
                "dijkelmnd",
                "dogphqgrd",
                "dstufvwxd",
                " acdfdca ",
                " accecca ",
                " aaabaaa "
            ],
            "result": {
                "id": "avaritia:upgrade_smithing_template"
            },
        }
    )
    // event.custom(
    //     {
    //         "type": "extendedcrafting:shapeless_table",
    //         "ingredients": [
    //             {
    //                 "item": "minecraft:apple"
    //             },
    //             {
    //                 "item": "minecraft:golden_apple"
    //             },
    //             {
    //                 "item": "minecraft:bread"
    //             },
    //             {
    //                 "item": "minecraft:sweet_berries"
    //             },
    //             {
    //                 "item": "minecraft:cake"
    //             },
    //             {
    //                 "item": "minecraft:carrot"
    //             },
    //             {
    //                 "item": "minecraft:chorus_fruit"
    //             },
    //             {
    //                 "item": "minecraft:glistering_melon_slice"
    //             },
    //             {
    //                 "item": "minecraft:glow_berries"
    //             },
    //             {
    //                 "item": "minecraft:beetroot"
    //             },
    //             {
    //                 "item": "minecraft:honey_bottle"
    //             },
    //             {
    //                 "item": "minecraft:kelp"
    //             },
    //             {
    //                 "item": "minecraft:poisonous_potato"
    //             },
    //             {
    //                 "item": "ars_nouveau:source_berry_pie"
    //             },
    //             {
    //                 "item": "ars_nouveau:source_berry_roll"
    //             },
    //             {
    //                 "item": "pneumaticcraft:sourdough_bread"
    //             },
    //             {
    //                 "item": "farmersdelight:tomato"
    //             },
    //             {
    //                 "item": "farmersdelight:cabbage"
    //             },
    //             {
    //                 "item": "avaritia:neutron_nugget"
    //             }
    //         ],
    //         "result": {
    //             "id": 'avaritia:ultimate_stew'
    //         }
    //     }
    // )
    event.custom(
        {
            "type": "extendedcrafting:shapeless_table",
            "ingredients": [
                {
                    "item": "minecraft:beef"
                },
                {
                    "item": "minecraft:porkchop"
                },
                {
                    "item": "minecraft:mutton"
                },
                {
                    "item": "minecraft:chicken"
                },
                {
                    "item": "minecraft:rabbit"
                },
                {
                    "item": "minecraft:cod"
                },
                {
                    "item": "minecraft:salmon"
                },
                {
                    "item": "minecraft:tropical_fish"
                },
                {
                    "item": "minecraft:pufferfish"
                },
                {
                    "item": "arsdelight:wilden_meat"
                },
                {
                    "item": "arsdelight:chimera_meat"
                },
                {
                    "item": "minecraft:rotten_flesh"
                },
                {
                    "item": "minecraft:spider_eye"
                },
                {
                    "item": "minecraft:egg"
                },
                {
                    "item": "avaritia:neutron_nugget"
                }
            ],
            "result": {
                "id": 'avaritia:cosmic_meatballs'
            }
        }
    )
})