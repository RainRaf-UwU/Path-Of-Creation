CustomMachineryEvents.upgrades(e=>{

    const machine_1 = [
        // 'custommachinery:part_time_job',
        'custommachinery:void_mining_machine',
        'custommachinery:copy_factory',
        'custommachinery:atmoic_decomposition_machine',
        'custommachinery:fluid_processing',
        'custommachinery:dyeing_factory',
    ]

    e.create('rain:speed_upgrade',10)
    .machine(machine_1)
    .modifier(CMRecipeModifierBuilder.expInput("custommachinery:energy", 1.1).min(1))
    .modifier(CMRecipeModifierBuilder.expInput("custommachinery:speed", 0.9).min(1))

    e.create('rain:production_upgrade',8)
    .machine(machine_1)
    .modifier(CMRecipeModifierBuilder.addOutput("custommachinery:item",1))
    
    e.create('rain:overclocking_upgrade',10)
    .machine(machine_1)
    .modifier(CMRecipeModifierBuilder.expInput("custommachinery:energy", 1.3).min(1))
    .modifier(CMRecipeModifierBuilder.expInput("custommachinery:speed", 0.7).min(1))

    e.create('rain:energy_upgrade',10)
    .machine(machine_1)
    .modifier(CMRecipeModifierBuilder.expInput("custommachinery:energy", 0.9).min(1))

    e.create('rain:overload_upgrade',10)
    .machine(machine_1)
    .modifier(CMRecipeModifierBuilder.expInput("custommachinery:energy", 1.5).min(1))
    .modifier(CMRecipeModifierBuilder.expInput("custommachinery:speed", 0.5).min(1))
})

// //Use the 'cm_upgrades' event to register custom machine upgrades.
// CustomMachineryEvents.upgrades(event => {

// //Create the upgrade builder and give it the item that will act as upgrade.
// //Use Item.of("item_id") to create the item.
// event.create(Item item)
// //If maxAmount is not specified the default is 64.
// event.create(Item item, int maxAmount)

// //Add a machine or a list of machines that will accept this upgrade, 
// //the machine ID must be "namespace:id" like "custommachinery:my_machine",
// //if the json is located in (my_datapack)/data/custommachinery/machines/my_machine.json
// .machine(String... machineID)

// //You can add a custom tooltip to the machine upgrade item.
// .tooltip(String... tooltips)
// //Use Text.of("text here") for more formatting options,
// //See https://kubejs.com/wiki/kubejs/Text/
// .tooltip(Text... tooltips)

// //Add a modifier to this upgrade.
// //See below for modifier syntax.
// .modifier(CMRecipeModifierBuilder modifier)
// })