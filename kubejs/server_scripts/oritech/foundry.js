ServerEvents.recipes(e=>{
    e.custom({
  "type": "oritech:foundry",
  "fluidInput": {
    "amount": 0,
    "fluid": "minecraft:empty"
  },
  "fluidOutputs": [],
  "ingredients": [
    {
      "item": 'allthemodium:allthemodium_ingot'
    },
    {
      "item": 'minecraft:netherite_ingot'
    }
  ],
  "results": [
    {
      "count": 1,
      "id":'oritech:duratium_ingot'
    }
  ],
  "time": 120
})

e.custom({
  "type": "oritech:foundry",
  "fluidInput": {
    "amount": 0,
    "fluid": "minecraft:empty"
  },
  "fluidOutputs": [],
  "ingredients": [
    {
      "item": 'naturesaura:gold_fiber'
    },
    {
      "item": 'mysticalagriculture:nature_essence'
    }
  ],
  "results": [
    {
      "count": 4,
      "id":'naturesaura:gold_fiber'
    }
  ],
  "time": 120
})

e.custom({
  "type": "oritech:foundry",
  "fluidInput": {
    "amount": 0,
    "fluid": "minecraft:empty"
  },
  "fluidOutputs": [],
  "ingredients": [
    {
      "item": 'naturesaura:gold_fiber'
    },
    {
      "tag": 'minecraft:leaves'
    }
  ],
  "results": [
    {
      "count": 1,
      "id":'naturesaura:golden_leaves'
    }
  ],
  "time": 120
})

  // pulverizer("minecraft:armor_stand", "minecraft:oak_planks", 3, "minecraft:cobblestone", 1, 30);

})