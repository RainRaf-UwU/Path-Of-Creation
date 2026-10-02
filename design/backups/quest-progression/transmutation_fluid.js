ServerEvents.recipes(e=>{
e.custom({
  "type": "lychee:item_inside",
  "item_in": { item: 'minecraft:cobblestone' ,
    count:16
  },
  "block_in": { blocks: ["rain:transmutation_fluid"] },
   "post": [
     "place minecraft:lava /.1",
    ]
})

  e.custom({
  "type": "lychee:item_inside",
  "item_in": { item: 'minecraft:iron_ingot' },
  "block_in": { blocks: ["rain:transmutation_fluid"] },
   "post": [
     "drop minecraft:copper_ingot ",
     "drop mysticalagriculture:dye_essence /.5"
    ]
})

  e.custom({
  "type": "lychee:item_inside",
  "item_in": { tag: 'minecraft:logs' },
  "block_in": { blocks: ["rain:transmutation_fluid"] },
   "post": [
     "drop minecraft:chest /.5",
    ]
})
  
 
   e.custom({
  "type": "lychee:item_inside",
  "item_in": { item: 'minecraft:stone_sword' },
  "block_in": { blocks: ["rain:transmutation_fluid"] },
   "post": [
     "drop minecraft:trident",
    ]
})

 e.custom({
  "type": "lychee:item_inside",
  "item_in": { item: 'mekanism:block_bio_fuel' },
  "block_in": { blocks: ["rain:transmutation_fluid"] },
   "post": [
     "drop mysticalagriculture:nature_essence ",
     "drop mysticalagriculture:wood_essence "
    ]
})

 e.custom({
  "type": "lychee:item_inside",
  "item_in": { item: 'minecraft:beetroot' },
  "block_in": { blocks: ["rain:transmutation_fluid"] },
   "post": [
     "drop minecraft:sweet_berries /.5",
    ]
})
   e.custom({
  "type": "lychee:item_inside",
  "item_in": { item: 'extendedcrafting:ultimate_table' },
  "block_in": { blocks: ["rain:transmutation_fluid"] },
   "post": [
     "place rain:copy_fluid",
    ]
})

 e.custom({
  "type": "lychee:item_inside",
  "item_in": { item: 'mysticalagriculture:nature_essence' },
  "block_in": { blocks: ["rain:transmutation_fluid"] },
   "post": [
     "drop minecraft:wheat /.2",
     "drop minecraft:beetroot /.2",
     "drop minecraft:sweet_berries /.2",
     "drop minecraft:sugar_cane /.3",
     "drop minecraft:cactus /.3"
    ]
})

// e.custom({
//   "type": "lychee:item_inside",
//   "item_in": { item: 'mysticalagriculture:wood_essence' },
//   "block_in": { blocks: ["rain:transmutation_fluid"] },
//    "post": [
//      "drop 'minecraft:oak_log' /.1",
//      "drop 'minecraft:spruce_log' /.1",
//      "drop 'minecraft:birch_log' /.1",
//      "drop 'minecraft:jungle_log' /.1",
//      "drop 'minecraft:acacia_log' /.1",
//      "drop 'minecraft:cherry_log' /.1"
//     ]
// })

e.custom({
  "type": "lychee:item_inside",
  "item_in": { item: 'minecraft:charcoal' },
  "block_in": { blocks: ["rain:transmutation_fluid"] },
   "post": [
     "drop minecraft:coal",
    ]
})
  e.custom(
        {
            "type":  "lychee:item_inside",
            "item_in": {
                "item": 'mysticalagriculture:dye_essence'
            },
            "block_in": "rain:transmutation_fluid",
            "post": [
                {
                    "type": "drop_item",
                    "id": 'minecraft:red_dye',
                    "count": 2,
                    "if": {
                        "type": "chance",
                        "chance": 0.2
                    }
                },
                {
                    "type": "drop_item",
                    "id": 'minecraft:lime_dye',
                    "count": 2,
                    "if": {
                        "type": "chance",
                        "chance": 0.8
                    }
                }
            ]
        }
    )

    e.custom({
  "type": "lychee:item_inside",
  "item_in": { item: 'minecraft:iron_block' },
  "block_in": { blocks: ["rain:transmutation_fluid"] },
   "post": [
     "drop minecraft:iron_helmet /.5",
     "drop minecraft:iron_chestplate /.5",
     "drop minecraft:iron_leggings /.5",
     "drop minecraft:iron_boots /.5"
    ]
})

e.custom(
        {
            "type":  "lychee:item_inside",
            "item_in": {
                "item": 'silentgear:blueprint_paper'
            },
            "block_in": "rain:transmutation_fluid",
            "post": [
                {
                    "type": "drop_item",
                    "id": 'immersiveengineering:blueprint',
                    "components": { "immersiveengineering:blueprint": "bullet" },
                    "count": 1,
                    "if": {
                        "type": "chance",
                        "chance": 0.1
                    }
                },
                {
                    "type": "drop_item",
                    "id": 'immersiveengineering:blueprint',
                    "components": { "immersiveengineering:blueprint": "molds" },
                    "count": 1,
                    "if": {
                        "type": "chance",
                        "chance": 0.1
                    }
                },
                {
                    "type": "drop_item",
                    "id": 'immersiveengineering:blueprint',
                    "components": { "immersiveengineering:blueprint": "bannerpatterns" },
                    "count": 1,
                    "if": {
                        "type": "chance",
                        "chance": 0.1
                    }
                },
                {
                    "type": "drop_item",
                    "id": 'immersiveengineering:blueprint',
                    "components": { "immersiveengineering:blueprint": "components" },
                    "count": 1,
                    "if": {
                        "type": "chance",
                        "chance": 0.1
                    }
                },
                {
                    "type": "drop_item",
                    "id": 'immersiveengineering:blueprint',
                    "components": { "immersiveengineering:blueprint": "warning_sign" },
                    "count": 1,
                    "if": {
                        "type": "chance",
                        "chance": 0.1
                    }
                },
                {
                    "type": "drop_item",
                    "id": 'immersiveengineering:blueprint',
                    "components": { "immersiveengineering:blueprint": "specialBullet" },
                    "count": 1,
                    "if": {
                        "type": "chance",
                        "chance": 0.1
                    }
                },
                {
                    "type": "drop_item",
                    "id": 'immersiveengineering:blueprint',
                    "components": { "immersiveengineering:blueprint": "automatons" },
                    "count": 1,
                    "if": {
                        "type": "chance",
                        "chance": 0.1
                    }
                }
            ]
        }
    )

    e.custom({
  "type": "lychee:item_inside",
  "item_in": { item: 'rain:cosmic_coin',
    count:27, 
  },
  "block_in": { blocks: ["rain:transmutation_fluid"] },
   "post": [
     {
                    "type": "drop_item",
                    "id": 'mekanism:creative_fluid_tank',
                    "components": { "mekanism:fluids": { "fluid_tanks": [{ "amount": 2147483647, "id": "industrialforegoing:ether_gas" }] } },
                    "count": 1,
                    "if": {
                        "type": "chance",
                        "chance": 0.2
                    }
                },
    ]
})

 e.custom({
  "type": "lychee:item_inside",
  "item_in": { item:'ae2:interface'},
  "block_in": { blocks: ["rain:transmutation_fluid"] },
   "post": [
     "drop ae2:import_bus /.5",
     "drop ae2:export_bus /.5"
    ]
})

e.custom({
  "type": "lychee:item_inside",
  "item_in": { item:'occultism:chalk_white'},
  "block_in": { blocks: ["rain:transmutation_fluid"] },
   "post": [
     "drop occultism:chalk_rainbow /.5",
     "drop occultism:chalk_void /.5"
    ]
})

e.custom({
  "type": "lychee:item_inside",
  "item_in": { item:'rain:god_creation_keepsake'},
  "block_in": { blocks: ["rain:transmutation_fluid"] },
   "post": [
     "drop rain:fazhang"
    ]
})

e.custom({
  "type": "lychee:item_inside",
  "item_in": { item:'actuallyadditions:atomic_reconstructor'},
  "block_in": { blocks: ["rain:transmutation_fluid"] },
   "post": [
     "place rain:atomic_reconstruct_fluid"
    ]
})

 



// e.custom({
//   "type": "lychee:item_inside",
//   "item_in": { item:'minecraft:diamond'},
//   "block_in": { blocks: ["rain:transmutation_fluid"] },
//    "post": [
//      "drop ae2:crafting_unit /.5"
//     ]
// })
})



