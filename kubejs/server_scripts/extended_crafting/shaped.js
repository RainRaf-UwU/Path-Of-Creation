ServerEvents.recipes(e=>{
   e.custom({
  "type": "extendedcrafting:shaped_table",
  "pattern": [
   "    AA   ",
   "   AA  A ",
   "   AAABA ",
   "   AABAA ",
   "   ABAA  ",
   "   B     ",
   "  B      ",
   " B       ",
   "B        "
  ],
  "key": {
    "A": {
      "item":'minecraft:cobblestone'
    },
    "B":{
      "tag":"c:rods"
    }
  },
  "result": {
    "id":'minecraft:stone_axe',
    "count": 1
  }})

  e.custom({
  "type": "extendedcrafting:shaped_table",
  "pattern": [
   "      AAA",
   "     AAAA",
   "    AAAAA",
   "     AAA ",
   "    B A  ",
   "   B     ",
   "  B      ",
   " B       ",
   "B        "
  ],
  "key": {
    "A": {
      "item":'minecraft:cobblestone'
    },
    "B":{
      "tag":"c:rods"
    }
  },
  "result": {
    "id":'minecraft:stone_shovel',
    "count": 1
  }})

  // e.custom({
  // "type": "extendedcrafting:shaped_table",
  // "pattern": [
  // " AAAAAAAA",
  // "  AAAAAAA",
  // "      AAA",
  // "     B AA",
  // "    B    ",
  // "   B     ",
  // "  B      ",
  // " B       ",
  // "B        "
  // ],
  // "key": {
  //   "A": {
  //     "item":'minecraft:iron_ingot'
  //   },
  //   "B":{
  //     "tag":"c:rods"
  //   }
  // },
  // "result": {
  //   "id":'minecraft:iron_hoe',
  //   "count": 1  
  // }})

  e.custom({
  "type": "extendedcrafting:shaped_table",
  "pattern": [
 "AAA",
 "ABA",
 "AAA"
  ],
  "key": {
    "A": {
      "tag":'minecraft:planks'
    },
    "B":{
      "item":'create:shaft'
    }
  },
  "result": {
    "id":'create:water_wheel',
    "count": 1  
  }})

  e.custom({
  "type": "extendedcrafting:shaped_table",
  "pattern": [
 "AAA",
 "ABA",
 "AAA"
  ],
  "key": {
    "A": {
      "tag":'minecraft:planks'
    },
    "B":{
      "item":'create:water_wheel'
    }
  },
  "result": {
    "id":'create:large_water_wheel',
    "count": 1  
  }})

  e.custom({
  "type": "extendedcrafting:shaped_table",
  "pattern": [
  " A ",
  "BAB",
  "BBB"
  ],
  "key": {
    "A": {
      "item":'create:andesite_alloy'
    },
    "B":{
      "tag":'c:plates/iron'
    }
  },
  "result": {
    "id":'create:whisk',
    "count": 1  
  }})


  e.custom({
  "type": "extendedcrafting:shaped_table",
  "pattern": [
 "A A",
 "AAA"
  ],
  "key": {
    "A": {
      "item":'create:andesite_alloy'
    }
  },
  "result": {
    "id":'create:basin',
    "count": 1  
  }})

  e.custom({
  "type": "extendedcrafting:shaped_table",
  "pattern": [
 "AAA",
 "AAA"
  ],
  "key": {
    "A": {
      "item":'minecraft:leather'
    }
  },
  "result": {
    "id":'create:belt_connector',
    "count": 2 
  }})

  e.custom({
  "type": "extendedcrafting:shaped_table",
  "pattern": [
   "CADAPADAC",
   "ADGHAMMDA",
   "DIJKOMMMD",
   "ALLLEMMMA",
   "PAOEBEOAP",
   "ANNNEFFFA",
   "DNNNOFFFD",
   "ADNNAFFDA",
   "CADAPADAC"
  ],
  "key": {
    "A": {
      "item":'enderio:redstone_alloy_ingot'
    },
    // "#":{
    //     "item":'minecraft:oak_wood'
    // },
    "B":{
      "item":'minecraft:gold_block'
    },
    "C":{
      "item":'minecraft:redstone_block'
    },
    "D":{
      "item":'create:electron_tube'
    },
    "E":{
    "item":'minecraft:magma_block'
  },
  "I":{
    "item":'minecraft:stone_hoe'
  },
  "F":{
    "item":'appflux:harden_insulating_resin'
  },
  "G":{
    "item":'minecraft:stone_pickaxe'
  },
  "H":{
    "item":'minecraft:stone_axe'
  },
  "J":{
    "item":'minecraft:stone_shovel'  
  },
  "K":{
    "item":'minecraft:stone_sword'
  },
  "L":{
    "item":'minecraft:nether_brick'
  },
  "M":{
    "item":'alltheores:steel_ingot'
  },
  "N":{
    "tag":'c:storage_blocks/silicon'
  },
  "O":{
    "item":'minecraft:soul_sand'
  },
  "P":{
    "item":'flowtech:umbrite_ingot'
  }
  },
  "result": {
    "id": "minecraft:crafting_table",
    "count": 1
  }
  }
   );//工作台

   e.custom({
  "type": "extendedcrafting:shaped_table",
  "pattern": [
    "AAAAAAAAA",
    "A       A",
    "A AAAAA A",
    "A A   A A",
    "A A A A A",
    "A A   A A",
    "A AAAAA A",
    "A       A",
    "AAAAAAAAA"
  ],
  "key": {
    "A": {
      "item": "minecraft:cobblestone"
    }
  },
  "result": {
    "id": 'minecraft:furnace'
  }
})
e.custom({
  "type": "extendedcrafting:shaped_table",
  "pattern": [
    "   AAA   ",
    "  A   A  ",
    " A     A ",
    "A   A   A",
    "B  A A  B",
    "BCCCCCCCB",
    "CCBBBBBCC",
    "CCBBDBBCC",
    "CCBBBBBCC"
  ],
  "key": {
    "A": {
      "item": "minecraft:iron_ingot"
    },
    "B": {
      "item": "minecraft:cobblestone"
    },
    "C": {
      "tag": 'minecraft:logs'
    },
    "D": {
      "item": "minecraft:redstone_block"
    }
  },
  "result": {
    "id":'minecraft:stonecutter'
  }
})

e.custom({
  "type": "extendedcrafting:shaped_table",
  "pattern": [
    "         ",
    "         ",
    "AAAAAAAAA",
    "AAAAAAAAA",
    "BBBBBBBBB",
    "BBBBBBBBB",
    "BBBBBBBBB",
    "BBBBBBBBB",
    "BBBBBBBBB"
  ],
  "key": {
    "A": {
      "item": "minecraft:iron_ingot"
    },
    "B": {
       "tag": 'minecraft:logs'
    }
  },
  "result": {
    "id": 'minecraft:smithing_table'
  }
})
})