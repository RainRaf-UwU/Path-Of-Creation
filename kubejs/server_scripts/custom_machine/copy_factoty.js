ServerEvents.recipes(e=>{
    e.recipes.custommachinery.custom_machine('custommachinery:copy_factory',100)
    .requireItem('minecraft:crafting_table').chance(0)
    .requireFluid("10x rain:copy_fluid").chance(0)
    .requireEnergy(10000)
    .produceItem('minecraft:crafting_table')

    e.recipes.custommachinery.custom_machine('custommachinery:copy_factory',100)
    .requireItem('extendedcrafting:advanced_table').chance(0)
    .requireFluid("10x rain:copy_fluid").chance(0)
    .requireEnergy(10000)
    .produceItem('extendedcrafting:advanced_table')

     e.recipes.custommachinery.custom_machine('custommachinery:copy_factory',100)
    .requireItem('ars_nouveau:creative_source_jar').chance(0)
    .requireFluid("10x rain:copy_fluid").chance(0)
    .requireEnergy(10000)
    .produceItem('ars_nouveau:creative_source_jar')

     e.recipes.custommachinery.custom_machine('custommachinery:copy_factory',100)
    .requireItem('ars_nouveau:wilden_tribute').chance(0)
    .requireFluid("10x rain:copy_fluid").chance(0)
    .requireEnergy(10000)
    .produceItem('ars_nouveau:wilden_tribute')

     e.recipes.custommachinery.custom_machine('custommachinery:copy_factory',100)
    .requireItem('extendedcrafting:elite_table').chance(0)
    .requireFluid("10x rain:copy_fluid").chance(0)
    .requireEnergy(10000)
    .produceItem('extendedcrafting:elite_table')

     e.recipes.custommachinery.custom_machine('custommachinery:copy_factory',100)
    .requireItem('rain:god_creation_keepsake').chance(0)
    .requireFluid("10x rain:copy_fluid").chance(0)
    .requireEnergy(10000)
    .produceItem('rain:god_creation_keepsake')

    e.recipes.custommachinery.custom_machine('custommachinery:copy_factory',100)
    .requireItem('extendedcrafting:elite_table').chance(0)
    .requireFluid("10x rain:copy_fluid").chance(0)
    .requireEnergy(10000)
    .produceItem('extendedcrafting:elite_table')

     e.recipes.custommachinery.custom_machine('custommachinery:copy_factory',100)
    .requireItem('ifeu:fluid_crafting_table').chance(0)
    .requireFluid("10x rain:copy_fluid").chance(0)
    .requireEnergy(10000)
    .produceItem('ifeu:fluid_crafting_table')

     e.recipes.custommachinery.custom_machine('custommachinery:copy_factory',100)
    .requireItem('extendedcrafting:ultimate_table').chance(0)
    .requireFluid("10x rain:copy_fluid").chance(0)
    .requireEnergy(10000)
    .produceItem('extendedcrafting:ultimate_table')

})

// event.recipes.custommachinery.custom_machine('custommachinery:void_mining_machine', 100)
// //   .requireItem("cobblestone")//输入
//   .produceItem('minecraft:raw_iron').chance(0.3)
//   .produceItem('minecraft:raw_gold').chance(0.3)
//   .produceItem('minecraft:raw_copper').chance(0.3)
//   .requireEnergy(10000)
//   .requirePosition("", "(,-64]", "")