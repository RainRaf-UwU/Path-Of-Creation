ServerEvents.recipes(e=>{
    e.recipes.occultism.ritual('custommachinery:custom_machine_item[custommachinery:machine="custommachinery:dyeing_factory"]',
        ['occultism:otherworld_essence',
            'occultism:otherworld_essence',
            'minecraft:cobbled_deepslate',
            'minecraft:basalt',
            'enderio:void_chassis',
            'rain:void_mixture'
        ],
        'occultism:book_of_binding_bound_djinni',
        'occultism:craft_djinni'
    ).dummy('rain:dummy_craftl_1')

    e.recipes.occultism.ritual('ars_nouveau:creative_source_jar',
        ['occultism:otherworld_essence',
            'occultism:otherworld_essence',
            'mysticalagriculture:amethyst_essence',
            'mysticalagriculture:amethyst_essence',
            'rain:void_mixture',
            'rain:void_mixture',
            'minecraft:diamond_block',
            'alltheores:steel_block'
        ],
        'occultism:book_of_binding_bound_marid',
        'occultism:craft_marid'
    ).dummy('rain:dummy_craftl_2')

     e.recipes.occultism.ritual('oritech:small_tank_block',
        ['minecraft:copper_block',
            'minecraft:copper_block',
            'minecraft:copper_block',
            'minecraft:copper_block',
            'actuallyadditions:black_quartz_block',
            'oritech:fluid_pipe',
            'oritech:fluid_pipe',
            'oritech:fluid_pipe',
            'oritech:fluid_pipe'
        ],
        'minecraft:glass',
        'occultism:summon_marid'
    ).dummy('rain:dummy_craftl_2')

    e.recipes.occultism.ritual('minecraft:jungle_planks',
        ['occultism:otherworld_essence',
            'occultism:otherworld_essence',
            'occultism:otherworld_essence',
            'occultism:otherworld_essence'
        ],
        'minecraft:egg',
        "occultism:rain"
    ).dummy('rain:dummy_summon_1')

    e.recipes.occultism.ritual('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:rabbit"]',
        ['minecraft:rabbit',
            'minecraft:rabbit',
           'minecraft:rabbit',
            'minecraft:rabbit',
            'minecraft:rabbit',
            'minecraft:rabbit',
            'minecraft:rabbit' ,
            'minecraft:rabbit'
        ],
        'hostilenetworks:blank_data_model',
        'occultism:summon_marid'
    ).dummy('rain:dummy_craftl_3')

     e.recipes.occultism.ritual('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:sheep"]',
        ['minecraft:mutton',
           'minecraft:mutton',
          'minecraft:mutton',
            'minecraft:mutton',
            'minecraft:mutton',
            'minecraft:mutton',
            'minecraft:mutton' ,
            'minecraft:mutton'
        ],
        'hostilenetworks:blank_data_model',
        'occultism:summon_marid'
    ).dummy('rain:dummy_craftl_4')

    e.recipes.occultism.ritual('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:giant"]',
        ['hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:villager"]',
         'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:villager"]',
         'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:villager"]',
          'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:villager"]',
          'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:villager"]',
           'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:villager"]',
           'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:villager"]' ,
           'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:villager"]',
           'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:villager"]',
           'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:villager"]',
           'actuallyadditions:canola',
          'actuallyadditions:canola'
        ],
        'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:zombie"]',
        'occultism:summon_djinni'
    ).dummy('rain:dummy_craftl_5')

     e.recipes.occultism.ritual('rain:creative_storage_cell_false',
        ['ifeu:creative_chance_addon',
          'mekanism_extras:upgrade_creative',
         'mysticalagriculture:creative_soulium_dagger',
          'ars_nouveau:creative_spell_book',
           'mekanism:creative_energy_cube',
           'ae2:creative_energy_cell',
           'draconicevolution:creative_op_capacitor' 
        ],
        'rain:god_creation_keepsake',
        'occultism:rain'
    ).dummy('rain:dummy_craftl_6')


    // e.recipes.occultism.ritual('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:vindicator"]',
    //     ['occultism:otherworld_essence',
    //         'occultism:otherworld_essence',
    //         'mysticalagriculture:amethyst_essence',
    //         'mysticalagriculture:amethyst_essence',
    //         'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:villager"]'
    //     ],
    //     'minecraft:egg',
    //     'occultism:summon_marid'
    // ).dummy('rain:dummy_summon_1')


//维度矿井
    e.recipes.occultism.miner(WeightedRecipeResult.of('alltheores:nickel_ore', 8, 500),'occultism:miner_foliot_unspecialized')

//灵火净化
     e.recipes.occultism.spirit_fire('occultism:spirit_attuned_gem', 'minecraft:amethyst_shard')
     e.recipes.occultism.spirit_fire( 'mysticalagriculture:coal_essence','minecraft:coal')
})