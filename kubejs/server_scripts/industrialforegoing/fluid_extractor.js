ServerEvents.recipes(e=>{
    e.custom({
  "type": "industrialforegoing:fluid_extractor",
  "breakChance": 0.01,
  "defaultRecipe": true,
  "input": {
    "item": 'allthemodium:allthemodium_block'
  },
  "output": {
    "amount": 1,
    "id": "allthemodium:molten_allthemodium"
  },
  "result": {
    "Name":'allthemodium:vibranium_block'
  }
})

e.custom({
  "type": "industrialforegoing:fluid_extractor",
  "breakChance": 0.03,
  "defaultRecipe": true,
  "input": {
    "item": 'minecraft:sculk_catalyst'
  },
  "output": {
    "amount": 3,
    "id": "ifeu:liquid_sculk_matter"
  },
  "result": {
    "Name":'minecraft:sculk'
  }
})

e.custom({
  "type": "industrialforegoing:fluid_extractor",
  "breakChance": 0.05,
  "defaultRecipe": true,
  "input": {
    "item": 'allthemodium:suspicious_soul_sand'
  },
  "output": {
    "amount": 5, 
    "id": "mysticalagradditions:molten_soulium"
  },
  "result": {
    "Name":'minecraft:soul_sand'
  }
})
})