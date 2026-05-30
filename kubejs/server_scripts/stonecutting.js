// ServerEvents.recipes(event => {
//     event.stonecutting('minecraft:golden_apple', '#minecraft:planks');
// });

ServerEvents.recipes(e=>{
    const list_1 = [
        'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:ender_dragon"]',
        'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:phantom"]',
        'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:ars_nouveau/whirlisprig"]',
        'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:wither"]',
        'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:bat"]',
        'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:parrot"]'

    ]

    const list_2 = [
        'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:vindicator"]',
        'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:evoker"]',
        'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:ravager"]',
        'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:illusioner"]'
    ]

    const list_3 = [
        'create:schematicannon',
        'create:adjustable_chain_gearshift',
        'create:chain_conveyor',
        'create:nozzle',
        'create:deployer',
        'create:belt_connector',
        'create:schematic_table',
        'create:depot'

    ]

    list_1.forEach(out_1=>{
        e.stonecutting(out_1,'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:dranconicevolution/dranc_guardian"]')
    })


    list_2.forEach(out_2=>{
        e.stonecutting(out_2,'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:villager"]')
    })

    list_3.forEach(out_3=>
        e.stonecutting(out_3,'create:andesite_casing')
    )
})