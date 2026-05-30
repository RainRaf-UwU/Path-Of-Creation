RecipeViewerEvents.addInformation("item",e=>{
    const poral =['rain:portal_fragment']
    e.add(poral,[
        // Text.gold(Text.translate("jei.portal.info_1"))
        Text.red(Text.translate("jei.rain.poral.text-1")).italic()
    ])

    //传送门事件
    e.add('flowtech:umbrite_nether_ore',[
        Text.blue(Text.translate("jei.rain.poral.text-2"))
    ])
    e.add('aether:ambrosium_shard',[
        Text.blue(Text.translate("jei.rain.poral.text-4"))
    ])
    e.add('ae2:crafting_unit',[
        Text.blue(Text.translate("jei.rain.poral.text-3"))
    ])
    e.add('allthemodium:ancient_stone',[
        Text.blue(Text.translatable("jei.rain.ancient_stone.info_0"))
    ])
    e.add('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:enderman"]',[
        Text.blue(Text.translate("jei.rain.poral.text-5"))
    ])
    e.add('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:magma_cube"]',[
        Text.blue(Text.translate("jei.rain.poral.text-6"))
    ])
    e.add('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:hoglin"]',[
        Text.blue(Text.translate("jei.rain.poral.text-7"))
    ])
    e.add('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:aether/valkyrie"]',[
        Text.blue(Text.translate("jei.rain.poral.text-8"))
    ])


    //闪电事件
    e.add('minecraft:obsidian',[
        Text.blue(Text.translate("jei.rain.lightning_channeling.text_1"))
    ])
    const block_1 =['actuallyadditions:empowered_restonia_crystal_block',
        'actuallyadditions:empowered_palis_crystal_block',
        'actuallyadditions:empowered_diamatine_crystal_block',
        'actuallyadditions:empowered_emeradic_crystal_block',
        'actuallyadditions:empowered_enori_crystal_block',
        'actuallyadditions:empowered_void_crystal_block'
    ]
    e.add(block_1,[
        Text.blue(Text.translate("jei.rain.lightning_channeling.text_2"))
    ])
    e.add('ae2:interface',[
        Text.blue(Text.translate("jei.rain.lightning_channeling.text_3"))
    ])
    e.add('industrialforegoing:machine_frame_simple',[
        Text.blue(Text.translate("jei.rain.lightning_channeling.text_4"))
    ])
    e.add('solarflux:sp_4',[
        Text.blue(Text.translate("jei.rain.lightning_channeling.text_5"))
    ])


    //手杖事件
    // e.add('rain:fazhang',[
    //     Text.red(Text.translate("jei.rain.shouzhang.info_0")),
    //     Text.blue(Text.translate("jei.rain.shouzhang.info_1")).italic(),
    //     Text.blue(Text.translate("jei.rain.shouzhang.info_2")).italic(),
    //     Text.blue(Text.translate("jei.rain.shouzhang.info_3")).italic(),
    //     Text.blue(Text.translate("jei.rain.shouzhang.info_4")).italic(),
    //     Text.blue(Text.translate("jei.rain.shouzhang.info_5")).italic()
    // ])

    //右键事件

    const plank_s = [
        'minecraft:mangrove_slab',
        'minecraft:oak_slab'
    ]
    e.add(plank_s,[
        Text.blue(Text.translate("jei.rain.right_click.info_2"))
    ])
        // Text.blue(Text.translate("jei.rain.right_click.info_2"))

    e.add('rain:bottle_void',[
        Text.blue(Text.translatable("jei.rain.right_click.bottle_void"))
    ])
    e.add('occultism:tallow',[
        Text.blue(Text.translatable( "jei.rain.knife.info_0"))
    ])
    e.add('oritech:black_hole_block',[
        Text.blue(Text.translatable( "jei.rain.black_hole.info_0"))
    ])
    e.add('mysticalagriculture:steel_seeds',[
        Text.blue(Text.translate( "jei.rain.right_click.text_1"))
    ])
    e.add('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:ars_nouveau/whirlisprig"]',[
        Text.blue(Text.translate( "jei.rain.right_click.text_2"))
    ])
    e.add('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:artifacts/mimic"]',[
        Text.blue(Text.translate(  "jei.rain.right_click_text_10"))
    ])
    e.add('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:slime"]',[
        Text.blue(Text.translate(  "jei.rain.right_click_text_11"))
    ])
    e.add('custommachinery:custom_machine_item[custommachinery:machine="custommachinery:fluid_processing"]',[
        Text.blue(Text.translate(  "jei.rain.right_click_text_12"))
    ])
    e.add('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:command_block_minecart"]',[
        Text.blue(Text.translate(  "jei.rain.right_click_text_13"))
    ])
    // e.add('minecraft:debug_stick',[
    //     Text.blue(Text.translate(  "jei.rain.right_click_text_15"))
    // ])



    //loot
    const fishing = [
        'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:cod"]',
        'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:squid"]'
    ]
    e.add(fishing,[
        Text.blue(Text.translate("jei.loot.rain.text_1"))
    ])


    const bl = [
    'minecraft:barrier',
    'minecraft:command_block'
     ]
     e.add(bl,[
        Text.blue(Text.translate("jei.rain.left_click_text_1"))
     ])

     const b_mblock=[
        'minecraft:chain_command_block',
        'minecraft:command_block'
     ]
     e.add(b_mblock,[
        Text.blue(Text.translate("jei.rain.right_click_text_15"))
     ])
     e.add('minecraft:debug_stick',[
        Text.blue(Text.translate("jei.rain.right_click_text_14"))
    ])
})