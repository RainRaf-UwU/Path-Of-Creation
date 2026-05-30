ServerEvents.recipes(e=>{
    e.custom({
  "type": "actuallyadditions:laser",
  "energy": 20000,
  "ingredient": {
    "tag": 'c:seeds'
  },
  "result": {
    "id": 'mysticalagriculture:prosperity_seed_base'
  }
})

e.custom({
  "type": "actuallyadditions:laser",
  "energy": 20000,
  "ingredient": {
    "item": 'minecraft:stone'
  },
  "result": {
    "id": 'minecraft:bedrock'
  }
})

// e.custom({
//   "type": "actuallyadditions:laser",
//   "energy": 20000,
//   "ingredient": {
//     "item": 'ae2:terminal'
//   },
//   "result": {
//     "id": 'ae2:crafting_terminal'
//   }
// })

e.custom({
  "type": "actuallyadditions:laser",
  "energy": 20000,
  "ingredient": {
    "item": 'minecraft:chest'
  },
  "result": {
    "id": 'ae2:storage_bus'
  }
})

e.custom({
  "type": "actuallyadditions:laser",
  "energy": 20000,
  "ingredient": {
    "item":'ae2:blank_pattern'
  },
  "result": {
    "id":'ae2:pattern_provider'
  }
})

e.custom({
  "type": "actuallyadditions:laser",
  "energy": 20000,
  "ingredient": {
    "tag":'minecraft:saplings'
  },
  "result": {
    "id":'integrateddynamics:menril_sapling'
  }
})

e.custom({
  "type": "actuallyadditions:laser",
  "energy": 20000,
  "ingredient": {
    "item":'minecraft:crafting_table'
  },
  "result": {
    "id":'ae2:molecular_assembler'
  }
})

e.custom({
  "type": "actuallyadditions:laser",
  "energy": 20000,
  "ingredient": {
    "item":'rain:seed_press'
  },
  "result": {
    "id":'rain:atomic_reconstruction_chamber'
  }
})


 e.remove({type:"create:splashing",input:'minecraft:gravel',output:'minecraft:flint'})

//    e.custom({
//   "type": "lychee:item_inside",
//   "item_in": { item:'ae2:terminal'},
//   "block_in": { blocks: ["rain:transmutation_fluid"] },
//    "post": [
//      "drop ae2:pattern_encoding_terminal ",
//      "drop ae2:crafting_terminal "
//     ]
// })

})