StartupEvents.registry("item",e=>{
    e.create('rain:fazhang')
    .glow(true)
    .maxStackSize(1)
    e.create("rain:stone_stick")
    e.create("rain:bottle_void")
    e.create("rain:void_mixture")
    e.create("rain:cosmic_coin")
    e.create("rain:portal_fragment")
    e.create("rain:speed_upgrade")
    e.create('rain:production_upgrade')
    e.create("rain:mineral_upgrade-1")
    e.create("rain:overclocking_upgrade")
    e.create("rain:energy_upgrade")
    e.create("rain:white_upgrade")
    e.create("rain:mineral_upgrade-2")
    e.create("rain:god_creation_keepsake")
    e.create("rain:basic_prophrcy_fragments")
    e.create("rain:mineral_upgrade-3")
    e.create("rain:mineral_upgrade-4")
    e.create("rain:mineral_upgrade-5")
    e.create("rain:creative_storage_cell_false")
    e.create("rain:seed_press")
    e.create("rain:refining_medicine_factory")
    e.create("rain:atomic_reconstruction_chamber")
    e.create("rain:fire")
    e.create("rain:large_fluid_processing")
    e.create("rain:data_storage_matrix")
    e.create("rain:enriched_atm")
    e.create("rain:enriched_unobtainium_infused")
    e.create("rain:enriched_vibranium")
    e.create("rain:compress_scrap_box")
    e.create("rain:prophecy_matrix")
    e.create("rain:overload_upgrade")
    e.create("rain:error_item")
    e.create("rain:rain1")
    e.create("rain:rain2")
    e.create("rain:rain3")
    e.create("rain:rain4")
    e.create("rain:rain5")
    e.create("rain:rain6")
    e.create("rain:rain7")
    e.create("rain:rain8")
    e.create("rain:music")

})
StartupEvents.registry("item",event =>{
   event.create("rain:infinities1_cell","meinfinitycell:infinities_cell").setName(Text.literal("混凝土")).setKeys(KeyList.of().adds(keys =>{
       keys.add(AEKeyHelper.item('minecraft:light_gray_concrete'))
       keys.add(AEKeyHelper.item('minecraft:white_concrete'))
       keys.add(AEKeyHelper.item('minecraft:gray_concrete'))
       keys.add(AEKeyHelper.item('minecraft:black_concrete'))
       keys.add(AEKeyHelper.item('minecraft:brown_concrete'))
       keys.add(AEKeyHelper.item('minecraft:red_concrete'))
       keys.add(AEKeyHelper.item('minecraft:orange_concrete'))
       keys.add(AEKeyHelper.item('minecraft:yellow_concrete'))
       keys.add(AEKeyHelper.item('minecraft:lime_concrete'))
       keys.add(AEKeyHelper.item('minecraft:green_concrete'))
       keys.add(AEKeyHelper.item('minecraft:cyan_concrete'))
       keys.add(AEKeyHelper.item('minecraft:light_blue_concrete'))
       keys.add(AEKeyHelper.item('minecraft:blue_concrete'))
       keys.add(AEKeyHelper.item('minecraft:purple_concrete'))
       keys.add(AEKeyHelper.item('minecraft:magenta_concrete'))
       keys.add(AEKeyHelper.item('minecraft:pink_concrete'))
   }))
   event.create("rain:infinities2_cell","meinfinitycell:infinities_cell").setName(Text.literal("橡木")).setKeys(KeyList.of().adds(keys=>{
    keys.add(AEKeyHelper.item('minecraft:oak_log'))
}))
 event.create("rain:infinities3_cell","meinfinitycell:infinity_cell").fluidType("minecraft:lava")
 
})

// ItemEvents.modification(event => {
//   event.modify('minecraft:apple', item => {
//     item.foodBuilder = food => {
//       food.nutrition(6)        // 饱食度（半鸡腿数）
//       food.saturation(1.2)     // 饱和度
//       food.meat()              // 是否是肉类
//       food.alwaysEdible()      // 任何时候都能吃
//       // food.effect('minecraft:regeneration', 60, 0, 1.0) // 食用后给予药水效果
//     }
//   })
// })

// 注册方块
// ① 注册方块
StartupEvents.registry('block', e => {
    e.create('rain:mini_cobblestone')           // 方块 ID
        .defaultCutout()
        .item(item => item
            .food(food => food
                .saturation(0)
                .alwaysEdible()
                 .eaten(foode=>{
                 /**
                 * @type {$player}
                 * 
                  */
                  let player = foode.getPlayer()
                  if (player != null){
                      player.give(Item.of('minecraft:gravel', 2))
                  }
                  
                })
                // .meatSeconds(1.6)           // 1.6 s
                // .transformsTo('kubejs:mini_cobblestone') // 吃完仍返还本身
            )
        )
        e.create("rain:unlucky_block")
        e.create("rain:aura_generate_machine")
        e.create("rain:solid_dim_core")

})

StartupEvents.registry("block",e=>{
    e.create("rain:msn")
    e.create("rain:haha")
    e.create("rain:error_block")
})
