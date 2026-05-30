// ServerEvents.recipes(e=>{
//     e.custom({
//     "type": "lychee:block_interacting",
//     "item_in": "iron_axe",
//     "block_in": "oak_log",
//     "post": [
//         "drop diamond /.5",
//         "place stripped_oak_log",
//         "damage_item"
//     ]
// })
// })

// ServerEvents.recipes(e=>{
// e.custom({
//   type: "lychee:item_inside",
//   item_in: { item: "minecraft:stick" },
//   block_in: { blocks: ["minecraft:water"] },
//   post: [
//        "place minecraft:lava" 
//   ]
// })
// })//测试用

ServerEvents.recipes(e=>{
    e.custom({
  type: "lychee:item_inside",
  item_in: { item: 'rain:void_mixture' },
  block_in: { blocks: ["minecraft:water"] },
  post: [
       "place rain:void_fluid" 
  ]
})
 
    e.custom({
  "type": "lychee:item_inside",
  "item_in": { item: 'minecraft:gravel' },
  "block_in": { blocks: ["rain:void_fluid"] },
   "post": [
     "drop minecraft:quartz /.1",
     "drop minecraft:nether_quartz_ore /.7"
    ]
})

     e.custom({
  "type": "lychee:item_inside",
  "item_in": { item: 'minecraft:rotten_flesh' },
  "block_in": { blocks: ["rain:transmutation_fluid"] },
   "post": [
     "drop minecraft:mutton /.2",
     "drop minecraft:chicken /.2",
     "drop minecraft:rabbit /.2",
     "drop minecraft:beef /.2"
    ]
})

    e.custom({
  "type": "lychee:item_inside",
  "item_in": { item: 'minecraft:rotten_flesh' },
  "block_in": { blocks: ["rain:void_fluid"] },
   "post": [
     "drop minecraft:chorus_fruit /.1",
    ]
})
   e.custom({
  "type": "lychee:item_inside",
  "item_in": { item: 'minecraft:chorus_fruit' },
  "block_in": { blocks: ["rain:void_fluid"] },
   "post": [
     "place rain:transmutation_fluid",
    ]
})
   e.custom({
  "type": "lychee:item_inside",
  "item_in": { item: 'minecraft:stone' },
  "block_in": { blocks: ["rain:void_fluid"] },
   "post": [
     "drop minecraft:netherrack /.5",
    ]
})

e.custom({
  "type": "lychee:item_inside",
  "item_in": { item: 'minecraft:smooth_stone'},
  "block_in": { blocks: ["rain:void_fluid"] },
   "post": [
     "drop aether:holystone /.2",
    ]
})

e.custom({
  "type": "lychee:item_inside",
  "item_in": { item: 'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:zombie"]'},
  "block_in": { blocks: ["rain:void_fluid"] },
   "post": [
     {
      "type":"drop_item",
      "id":'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:drowned"]'
     }
    ]
})
})
