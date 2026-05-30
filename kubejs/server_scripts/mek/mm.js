ServerEvents.recipes(e=>{
    e.custom({
  "type": "mekmm:stamper",
  "input": {
    "count": 1,
    "item": 'silentgear:template_board'
  },
  "mold": {
    "count": 1,
    "item":'mysticalagriculture:prosperity_seed_base'
  },
  "output": {
    "count": 1,
    "id": 'rain:seed_press'
  }
})

e.custom({
  "type": "mekmm:stamper",
  "input": {
    "count": 64,
    "item": 'oritech:packed_wheat'
  },
  "mold": {
    "count": 1,
    "item": 'rain:seed_press'
  },
  "output": {
    "count": 1,
    "id": 'actuallyadditions:canola_seeds'
  }
})

e.custom({
  "type": "mekmm:stamper",
  "input": {
    "count": 64,
    "item":'mysticalagriculture:wood_essence'
  },
  "mold": {
    "count": 1,
    "item": 'rain:seed_press'
  },
  "output": {
    "count": 1,
    "id":'mysticalagriculture:wood_seeds'
  }
})

e.custom({
  "type": "mekmm:stamper",
  "input": {
    "count": 64,
    "item":'mysticalagriculture:ice_essence'
  },
  "mold": {
    "count": 1,
    "item": 'rain:seed_press'
  },
  "output": {
    "count": 1,
    "id":'mysticalagriculture:ice_seeds'
  }
})

e.custom({
  "type": "mekmm:stamper",
  "input": {
    "count": 64,
    "item":'minecraft:deepslate'
  },
  "mold": {
    "count": 1,
    "item": 'rain:seed_press'
  },
  "output": {
    "count": 1,
    "id":'mysticalagriculture:deepslate_seeds'
  }
})

e.custom({
  "type": "mekmm:stamper",
  "input": {
    "count": 64,
    "tag":'c:storage_blocks/silicon'
  },
  "mold": {
    "count": 1,
    "item": 'rain:seed_press'
  },
  "output": {
    "count": 1,
    "id":'mysticalagriculture:silicon_seeds'
  }
})
})