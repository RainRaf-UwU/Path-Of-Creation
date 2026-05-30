ServerEvents.recipes(e=>{
    e.custom({
  "type": "extendedcrafting:shaped_table",
  "pattern": [
    "AAAAAAA",
    "ABBBBBA",
    "ABCCCBA",
    "ABCCCBA",
    "ABCCCBA",
    "ABBBBBA",
    "AAAAAAA"
  ],
  "key": {
    "A": {
      "item": "actuallyadditions:empowered_palis_crystal_block"
    },
    "B": {
      "item": "mysticalagriculture:prudentium_essence"
    },
    "C": {
      "item": "mysticalagriculture:prosperity_seed_base"
    }
  },
  "result": {
    "id": 'mysticalagriculture:lapis_lazuli_seeds'
  }
})

e.custom({
  "type": "extendedcrafting:shaped_table",
  "pattern": [
    "ABBCBBA",
    "B  D  B",
    "B  E  B",
    "CDEFEDC",
    "B  E  B",
    "B  D  B",
    "ABBCBBA"
  ],
  "key": {
    "A": {
      "item": "minecraft:ancient_debris"
    },
    "B": {
      "item": "naturesaura:gold_powder"
    },
    "C": {
      "item": "minecraft:ender_pearl"
    },
    "D": {
      "item": "oritech:advanced_battery"
    },
    "E": {
      "item": "draconicevolution:draconium_core"
    },
    "F": {
      "item": "rain:speed_upgrade"
    }
  },
  "result": {
    "id":'rain:overclocking_upgrade'
  }
})

e.custom({
  "type": "extendedcrafting:shaped_table",
  "pattern": [
    "ABCBA",
    "BDDDB",
    "CDEDC",
    "BDDDB",
    "ABCBA"
  ],
  "key": {
    "A": {
      "item": "allthemodium:allthemodium_nugget"
    },
    "B": {
      "item": "minecraft:iron_block"
    },
    "C": {
      "item": "alltheores:steel_block"
    },
    "D": {
      "item": "minecraft:diamond_block"
    },
    "E": {
      "item": "draconicevolution:draconium_core"
    }
  },
  "result": {
    "id": 'draconicevolution:basic_crafting_injector'
  }
})
e.custom({
  "type": "extendedcrafting:shaped_table",
  "pattern": [
    "ABBBA",
    "BCCCB",
    "BCDCB",
    "BCCCB",
    "ABBBA"
  ],
  "key": {
    "A": {
      "item": "actuallyadditions:empowered_emeradic_crystal_block"
    },
    "B": {
      "item": "allthemodium:allthemodium_nugget"
    },
    "C": {
      "item": "draconicevolution:draconium_core"
    },
    "D": {
      "item": "actuallyadditions:empowered_palis_crystal_block"
    }
  },
  "result": {
    "id": 'draconicevolution:crafting_core'
  }
})
e.custom({
  "type": "extendedcrafting:shaped_flux_crafter",
  "power_required": 1000000,
  "power_rate": 400,
  "pattern": [
    "AAA",
    "AAA",
    "AAA"
  ],
  "key": {
    "A": {
      "item": "oritech:fluxite"
    }
  },
  "result": {
    "id": 'oritech:fluxite_block'
  }
})
})