// // 充能台
// ServerEvents.recipes(event => {
//     // .energizing([inputs, ...], output, energy)
//     event.recipes.powah.energizing(["minecraft:cobblestone"], "minecraft:tnt", 1000)
// })
//  
// // 冷却剂
// PowahEvents.registerCoolants(event => {
//     // .addFluid(fluid, coolness)
// event.addFluid("minecraft:lava", 10);
//      
//     // .addSolid(fluid, coolness)
// event.addSolid("minecraft:cobblestone", 10);
// })
//  
// // 热源
// PowahEvents.registerHeatSource(event => {
//     // .add(block, hotness)
// event.add("minecraft:cobblestone", 10);
// })
//  
// // 岩浆流体
// PowahEvents.registerMagmaticFluid(event => {
//     // .add(fluid, hotness)
// event.add("minecraft:water", 10);
// })