ServerEvents.recipes(e=>{
    e.custom({
  "neoforge:conditions": [
    {
      "type": "neoforge:item_exists",
      "item": 'mysticalagriculture:lapis_lazuli_essence'
    }
  ],
  "type": "industrialforegoing:dissolution_chamber",
  "input": [
    {
      "item":'minecraft:gold_ingot'
    },
    {
      "item":'minecraft:gold_ingot'
    },
    {
      "item":'minecraft:gold_ingot'
    },
    {
      "item":'minecraft:gold_ingot'
    },
    {
      "item":'mysticalagriculture:dye_essence'
    },
    {
      "item": 'mysticalagriculture:dye_essence'
    },
    {
      "item": 'mysticalagriculture:dye_essence'
    },
    {
      "item": 'mysticalagriculture:dye_essence'
    }
  ],
  "inputFluid": {
    "amount": 1000,
    "fluid": 'minecraft:water'
  },
  "output": {
    "components": {
      "titanium:augments": {
        "Speed": 3.0
      }
    },
    "count": 4,
    "id": 'mysticalagriculture:lapis_lazuli_essence'
  },
  "processingTime": 200
})

 e.custom({
  "neoforge:conditions": [
    {
      "type": "neoforge:item_exists",
      "item": 'mysticalagriculture:lapis_lazuli_essence'
    }
  ],
  "type": "industrialforegoing:dissolution_chamber",
  "input": [
    {
      "item":'minecraft:gold_ingot'
    },
    {
      "item":'minecraft:gold_ingot'
    },
    {
      "item":'minecraft:gold_ingot'
    },
    {
      "item":'minecraft:gold_ingot'
    },
    {
      "item":'mysticalagriculture:dye_essence'
    },
    {
      "item": 'mysticalagriculture:dye_essence'
    },
    {
      "item": 'mysticalagriculture:dye_essence'
    },
    {
      "item": 'mysticalagriculture:dye_essence'
    }
  ],
  "inputFluid": {
    "amount": 1000,
    "fluid": 'allthemodium:molten_allthemodium'
  },
  "outputFluid": {
    "amount": 500,
    "id": 'allthemodium:soul_lava'
  },
  "output": {
    "components": {
      "titanium:augments": {
        "Speed": 3.0
      }
    },
    "count": 4,
    "id": 'mysticalagriculture:lapis_lazuli_essence'
  },
  "processingTime": 200
})
})