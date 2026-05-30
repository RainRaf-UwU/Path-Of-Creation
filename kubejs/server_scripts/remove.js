ServerEvents.recipes(e=>{
    e.remove({input:'#c:dyes/black', input:'minecraft:iron_ingot', output:'extendedcrafting:black_iron_ingot' })
    e.remove({input:'#alltheores:ore_hammers', output:'alltheores:netherite_dust' })
    e.remove({output:'minecraft:soul_sand',mod:"create"})
    e.remove({output:'alltheores:steel_gear',input:'minecraft:iron_nugget'})
    e.remove({type:"mysticalagriculture:infusion"})
    e.remove({type:"immersiveengineering:arc_furnace",output:'minecraft:netherite_scrap'})
    e.remove({input:'minecraft:netherite_scrap', output:'minecraft:netherite_ingot'})
    // e.remove({input:'occultism:miner_foliot_unspecialized[occultism:max_mining_time=400,occultism:rolls_per_operation=1]'})
    e.remove({type:"occultism:miner"})
    e.replaceInput({input:'ars_nouveau:purple_archwood_log',input:'minecraft:glass_bottle'},'ars_nouveau:purple_archwood_log','ars_nouveau:blue_archwood_log');
    // e.replaceInput({input:'ars_nouveau:purple_archwood_log',input:'minecraft:glass_bottle'},'ars_nouveau:purple_archwood_log','ars_nouveau:blue_archwood_log');
    // e.replaceInput({input:'minecraft:ender_pearl',output:'alltheores:enderium_dust'},'minecraft:air','oritech:enderic_compound');
    // e.remove({output:'oritech:duratium_ingot',input:'minecraft:netherite_ingot'})
    e.replaceInput({output:'oritech:foundry_block'},'minecraft:copper_ingot','#c:plastics')
    // e.replaceInput({output:'oritech:duratium_ingot',input:'minecraft:netherite_ingot'},'minecraft:netherite_ingot','allthemodium:allthemodium_ingot')
    e.remove({output:'minecraft:enchanted_book[stored_enchantments={levels:{"minecraft:fortune":1}}]',input:'minecraft:writable_book'})
    // e.remove({type:"minecraft:crafting_shaped",outpwut:'naturesaura:gold_powder'})
    e.remove({input:'draconicevolution:draconium_dust',output:'draconicevolution:draconium_ingot'})
    e.remove({output:'draconicevolution:basic_crafting_injector',input:'draconicevolution:draconium_core'})
    e.remove({output:'extendedcrafting:redstone_ingot',input:'minecraft:iron_ingot'})
    e.remove({type:"oritech:atomic_forge",output:'mekanism:basic_control_circuit'})
    e.remove({output:'ae2wtlib:wireless_universal_terminal',not:{input:'ae2wtlib:wireless_universal_terminal'}})

    
    // e.remove({output:})
    //铸造器
    e.remove({input:'minecraft:netherite_ingot',output:'oritech:duratium_ingot'})
//     // e.remove({type:"oritech:foundry"})
//     // e.remove({mod:'oritech',output:'oritech:duratium_ingot'})
//     // e.remove({ not: { type: "minecraft:crafting_shaped" }, input:'minecraft:netherite_ingot'})
    e.remove({type:"enderio:alloy_smelting",input:'minecraft:netherite_ingot'})


    e.replaceInput({output:'naturesaura:nature_altar'},'minecraft:oak_sapling','occultism:otherworld_sapling')
    e.replaceInput({output:'oritech:fragment_forge_block'},'#c:plastics','oritech:duratium_ingot')
    e.replaceInput({type:"oritech:atomic_forge",output:'oritech:heisenberg_compensator'},'oritech:adamant_ingot','oritech:duratium_ingot')
    // e.replaceInput({type:'draconicevolution:fusion_crafting'},'minecraft:diamond','minecraft:diamond_block')
    e.replaceInput({output:'stellaris:rocket_station'},'minecraft:redstone','alltheores:iridium_block')
    e.replaceInput({output:'stellaris:rocket_nose_cone'},'minecraft:redstone','naturesaura:sky_ingot_block')
    e.replaceInput({output:'industrialforegoing:fluid_extractor'},'industrialforegoing:machine_frame_pity','industrialforegoing:machine_frame_advanced')
    e.replaceInput({output:'naturesaura:field_creator'},'naturesaura:sky_ingot','allthemodium:allthemodium_ingot')
    e.remove({input:'minecraft:ender_pearl',output:'enderio:pulsating_alloy_ingot'})
    e.replaceInput({output:'mekanism:metallurgic_infuser'},'#c:ingots/osmium','mekanism:steel_casing')
    e.replaceInput({output:'mekanism:antiprotonic_nucleosynthesizer'},'mekanism:ultimate_control_circuit','actuallyadditions:canola')
    e.replaceInput({output:'mekanism:antiprotonic_nucleosynthesizer'},'mekanism:pellet_antimatter','minecraft:lingering_potion[potion_contents={potion:"tombstone:discretion"}]')
    e.replaceInput({output:'mekanismgenerators:fission_reactor_port'},'mekanism:elite_control_circuit','avaritia:singularity')

    const id_1 = [
        'enderio:alloy_smelting/pulsating_alloy_ingot',
        'enderio:alloy_smelting/conductive_alloy_ingot',
        'oritech:silicon_blockblock',
        'immersiveengineering:arc_recycling_list020',
        'immesriveengineering:arc_recycling_list040',
        "oritech:compat/immersiveengineering/arcalloying/duration",
        "minecraft:end_rod"
    ]

    id_1.forEach(id_0=>{
        e.remove({id:id_0})
    })

    const output_1 = [
        'oritech:fluxite_block',
        'oritech:refinery_block',
        'draconicevolution:wyvern_crafting_injector',
        'oritech:atomic_forge_block',
        'hostilenetworks:sim_chamber',
        'hostilenetworks:loot_fabricator',
        'powah:energizing_orb',
        'oritech:accelerator_controller',
        'torcherino:double_compressed_torcherino',
        'extendedcrafting:basic_table',
        'extendedcrafting:advanced_table',
        'industrialforegoing:machine_frame_advanced',
        'ars_caelum:ritual_conjure_island_end_portal',
        'notenoughwands:acceleration_wand',
        'extendedcrafting:flux_crafter',
        'oritech:small_tank_block',
        'minecraft:netherite_ingot',
        // 'ae2wtlib:wireless_universal_terminal',
        'minecraft:lightning_rod',
        'minecraft:crafting_table',
        'clickmachine:click_machine',
        'aether:altar',
        'torcherino:torcherino',
        'extendedcrafting:elite_table',
        'naturesaura:offering_table',
        'oritech:assembler_block',
        'mysticalagriculture:dye_seeds',
        'mysticalagriculture:redstone_seeds',
        'actuallyadditions:lens_of_the_miner',
        'industrialforegoing:latex_processing_unit',
        'justdirethings:gooblock_tier1',
        'justdirethings:gooblock_tier2',
        'justdirethings:gooblock_tier3',
        'justdirethings:gooblock_tier4',
        'torcherino:compressed_torcherino',
        'industrialforegoing:animal_rancher',
        'occultism:spirit_attuned_gem',
        'draconicevolution:awakened_crafting_injector',
        'ae2:entropy_manipulator',
        'extendedcrafting:ultimate_table',
        'allthemodium:teleport_pad',
        'draconicevolution:crafting_core',
        'immersiveengineering:workbench',
        'actuallyadditions:empowerer',
        'ars_caelum:ritual_conjure_island_sculk',
        'ifeu:fluid_crafting_table',
        'oritech:steel_ingot',
        'ifeu:fluid_crafting_table',
        'mekanism:steel_casing',
        'oritechthings:particle_accelerator_speed_sensor',
        'oritechthings:advanced_target_designator',
        'sophisticatedstorage:stack_upgrade_omega_tier',
        'actuallyadditions:canola_seeds',
        'mekanism:basic_control_circuit',
        'mekmm:uu_matter',
        'ifeu:rule_controller',
        'draconicevolution:chaotic_crafting_injector',
        'mekanism:pellet_antimatter',
        'industrialforegoing:machine_frame_supreme',
        'avaritia:end_crafting_table',
        'ifeu:fluid_crafting_table',
        'industrialforegoing:machine_frame_simple',
        'mekanism:advanced_control_circuit',
        'mekanism:elite_control_circuit',
        'mekanism:ultimate_control_circuit',
        'minecraft:end_rod',
        'naturesaura:ancient_stick',
        'ars_nouveau:mendosteen_pod',
        'immersiveengineering:toolupgrade_shield_flash',
        'extendedae_plus:infinity_biginteger_cell',
        'avaritia:extreme_crafting_table',
        'minecraft:lodestone',
        'immersiveengineering:warning_sign_shrieker',
        'avaritia:infinity_ingot',
        'avaritia:infinity_catalyst',
        'minecraft:end_stone'
            ]

    output_1.forEach(out =>{
        e.remove({output:out})
    })
    e.remove({id:'minecraft:kjs/hostilenetworks_data_model_11'})
})