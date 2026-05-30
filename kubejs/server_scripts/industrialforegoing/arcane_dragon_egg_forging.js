ServerEvents.recipes(e=>{
    e.custom({
  "neoforge:conditions": [
    {
      "type": "neoforge:item_exists",
      "item": "minecraft:egg"
    }
  ],
  "type": "ifeu:arcane_dragon_egg_forging",
  "input": {
    "count": 1,
    "id": "minecraft:dragon_egg"
  },
  "inputFluid1": {
    "amount": 1000,
    "id": "industrialforegoing:pink_slime"
  },
  "inputFluid2": {
    "amount": 1000,
    "id": "industrialforegoing:essence"
  },
  "output": {
    "count": 1,
    "id": 'oritech:banana'
  },
  "outputFluid": {
    "amount": 100,
    "id": "enderio:fluid_dew_of_the_void_still"
  },
  "processingTime": 200
})
})