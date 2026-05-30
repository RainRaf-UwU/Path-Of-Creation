

ServerEvents.recipes(e=>{
    e.shaped('ae2:entropy_manipulator',[
        "AB ",
        "CD ",
        "  D"
    ],{
        A:'appflux:harden_insulating_resin',
        B:'mekanism:advanced_energy_cube',
        C:'alltheores:steel_gear',
        D:'minecraft:iron_ingot'
    })

    e.shaped('immersiveengineering:workbench',[
        "AAA",
        "BCB",
        "DDE",
    ],{
        A:'extendedcrafting:black_iron_ingot',
        B:'mekanism:alloy_infused',
        C:'minecraft:crafting_table',
        D:'#minecraft:logs',
        E:'#minecraft:fences'
    })

      e.shaped('aether:altar',[
        'AAA',
        'ABA',
        'AAA'
    ],{
        A:'aether:holystone',
        B:'aether:ambrosium_shard'
    });

    e.shaped('minecraft:enchanted_golden_apple',[
        'AAA',
        'ABA',
        'AAA'
    ],{
        A:'minecraft:gold_block',
        B:'minecraft:apple'
    });

    e.shaped('rain:white_upgrade',[
        'AAA',
        'ABA',
        'AAA'
    ],{
        A:'minecraft:iron_bars',
        B:'minecraft:iron_ingot'
    });

     e.shaped('custommachinery:custom_machine_item[custommachinery:machine="custommachinery:copy_factory"]',[
        'A '
    ],{
        A:'custommachinery:custom_machine_item[custommachinery:machine="custommachinery:void_mining_machine"]'
    });

     e.shaped('custommachinery:custom_machine_item[custommachinery:machine="custommachinery:part_time_job"]',[
        ' A'
    ],{
        A:'custommachinery:custom_machine_item[custommachinery:machine="custommachinery:void_mining_machine"]'
    });

    e.shaped('actuallyadditions:empowerer',[
        'ACB',
        'ADB',
        'FEF'
    ],{
        A:'minecraft:basalt',
        B:'minecraft:cobbled_deepslate',
        C:'actuallyadditions:restonia_crystal',
        D:'actuallyadditions:double_battery',
        E:'actuallyadditions:display_stand',
        F:'actuallyadditions:iron_casing'
    });

     e.shaped('3x immersiveengineering:nugget_netherite',[
        'AAA',
        'AAA',
        'AAA'
    ],{
        A:'mysticalagriculture:netherite_essence'
    });

     e.shaped('minecraft:netherite_ingot',[
        'AAA',
        'AAA',
        'AAA'
    ],{
        A:'immersiveengineering:nugget_netherite'
    });

    e.shaped('allthemodium:vibranium_upgrade_smithing_template',[
        'ABA',
        'ACA',
        'AAA'
    ],{
        A:'allthemodium:vibranium_ingot',
        B:'allthemodium:allthemodium_block',
        C:'allthemodium:ancient_stone'
    });

    e.shaped('allthemodium:allthemodium_upgrade_smithing_template',[
        'ABA',
        'ACA',
        'AAA'
    ],{
        A:'allthemodium:allthemodium_ingot',
        B:'minecraft:netherite_block',
        C:'minecraft:deepslate'
    });

    e.shaped('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:wither"]',[
        'AAA'
    ],{
        A:'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:wither_skeleton"]'
    })
    e.shaped('3x glassential:glass_slab',[
        'AA'
    ],{
        A:"minecraft:glass"
    })

     e.shaped('minecraft:chainmail_helmet',[
        'AAA',
        'A A'
    ],{
        A:'rain:fire'
    })

    e.shaped('minecraft:chainmail_boots',[
        'A A',
        'A A'
    ],{
        A:'rain:fire'
    })

    e.shaped('minecraft:chainmail_leggings',[
        'AAA',
        'A A',
        'A A'
    ],{
        A:'rain:fire'
    })

    e.shaped('minecraft:chainmail_chestplate',[
        'A A',
        'AAA',
        'AAA'
    ],{
        A:'rain:fire'
    })

    e.shaped('unusualend:bolok_spawn_egg',[
        'AAA',
        'ABA',
        'AAA'
    ],{
        A:'unusualend:bolok_scale',
        B:'draconicevolution:advanced_dislocator'
    })

    e.shaped('allthemodium:suspicious_soul_sand',[
        'AAA',
        'CBA',
        'CCC'
    ],{
        A:'utilitarian:soul_snad',
        B:'alltheores:ruby',
        C:'minecraft:soul_soil'
    })
    e.shaped('minecraft:pig_spawn_egg',[
        'AAA',
        'ABA',
        'AAA'
    ],{
        A:'farmersdelight:fried_egg',
        B:'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:pig"]'
    })
})