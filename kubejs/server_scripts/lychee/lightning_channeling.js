// ServerEvents.recipes(e=>{
//     e.custom({
//     "type": "lychee:lightning_channeling",
//     "post": "run \"fill ~-3 ~-3 ~-3 ~3 ~3 ~3 stone replace calcite\""
// })
// })//参考

// ServerEvents.recipes(e=>{
//     e.custom({
//   "type": "lychee:lightning_channeling",
//   "item_in": { "item": "minecraft:book" },
// //    "weather": "thunder",           // 必须雷暴天气
//   "post": [
//     "run \"item replace entity @p weapon.mainhand with minecraft:enchanted_book{StoredEnchantments:[{id:\\\"minecraft:channeling\\\",lvl:1}]}\"",
//     "run \"fill ~-3 ~-3 ~-3 ~3 ~3 ~3 air replace minecraft:air\""
//   ]
// })
// })

ServerEvents.recipes(e=>{
    e.custom({
    "type": "lychee:lightning_channeling",
    "post": "run \"fill ~-3 ~-3 ~-3 ~3 ~3 ~3 minecraft:redstone_block replace minecraft:iron_block\""
})

    e.custom({
    "type": "lychee:lightning_channeling",
    "post": "run \"fill ~-3 ~-3 ~-3 ~3 ~3 ~3 minecraft:obsidian replace minecraft:cobblestone\""
})

    e.custom({
    "type": "lychee:lightning_channeling",
    "block_in": { blocks: ["minecraft:gold_block"] },
    "post": "run \"fill ~-3 ~-3 ~-3 ~3 ~3 ~3 solarflux:sp_4 replace minecraft:gold_block\""
})

 e.custom({
    "type": "lychee:lightning_channeling",
    "block_in": { blocks: ["minecraft:gold_block"] },
    "post": "run \"fill ~-3 ~-3 ~-3 ~3 ~3 ~3 ae2:interface replace minecraft:hopper\""
})

e.custom({
    "type": "lychee:lightning_channeling",
    "block_in": { blocks: ["minecraft:gold_block"] },
    "post": "run \"fill ~-3 ~-3 ~-3 ~3 ~3 ~3 industrialforegoing:machine_frame_simple replace industrialforegoing:machine_frame_pity\""
})

e.custom({
    "type": "lychee:lightning_channeling",
    "block_in": { blocks: ["minecraft:gold_block"] },
    "post": "run \"fill ~-3 ~-3 ~-3 ~3 ~3 ~3 actuallyadditions:empowered_enori_crystal_block replace actuallyadditions:enori_crystal_block\""
})

e.custom({
    "type": "lychee:lightning_channeling",
    "block_in": { blocks: ["minecraft:gold_block"] },
    "post": "run \"fill ~-3 ~-3 ~-3 ~3 ~3 ~3 actuallyadditions:empowered_restonia_crystal_block replace actuallyadditions:restonia_crystal_block\""
})

e.custom({
    "type": "lychee:lightning_channeling",
    "block_in": { blocks: ["minecraft:gold_block"] },
    "post": "run \"fill ~-3 ~-3 ~-3 ~3 ~3 ~3 actuallyadditions:empowered_palis_crystal_block replace actuallyadditions:palis_crystal_block\""
})

e.custom({
    "type": "lychee:lightning_channeling",
    "block_in": { blocks: ["minecraft:gold_block"] },
    "post": "run \"fill ~-3 ~-3 ~-3 ~3 ~3 ~3 actuallyadditions:empowered_diamatine_crystal_block replace actuallyadditions:diamatine_crystal_block\""
})

e.custom({
    "type": "lychee:lightning_channeling",
    "block_in": { blocks: ["minecraft:gold_block"] },
    "post": "run \"fill ~-3 ~-3 ~-3 ~3 ~3 ~3 actuallyadditions:empowered_void_crystal_block replace actuallyadditions:void_crystal_block\""
})

e.custom({
    "type": "lychee:lightning_channeling",
    "block_in": { blocks: ["minecraft:gold_block"] },
    "post": "run \"fill ~-3 ~-3 ~-3 ~3 ~3 ~3 actuallyadditions:empowered_emeradic_crystal_block replace actuallyadditions:emeradic_crystal_block\""
})

    // e.custom({
    //      "type": "lychee:lightning_channeling",
    //      "block_in": { blocks: ["minecraft:gold_block"] },
    //      "post": "place  ~-3 ~-3 ~-3 ~3 ~3 ~3 solarflux:sp_4 "
    // })

})

