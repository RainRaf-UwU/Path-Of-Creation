ServerEvents.recipes(e=>{
    e.custom({
  "type": "ae2:transform",
  "ingredients": [
    {
      "item": 'minecraft:gravel'
    }
  ],
  "result": {
    "count": 1,
    "id": 'minecraft:sand'
  }
})
e.custom({
  "type": "ae2:transform",
  "circumstance": {
    "type": "explosion"
  },
  "ingredients": [
    {
      "item": 'ae2:meteorite_compass'
    }
  ],
  "result": {
    "count": 1,
    "id": 'ae2:flawless_budding_quartz'
  }
})

e.custom({
  "type": "ae2:transform",
  "circumstance": {
    "type": "explosion"
  },
  "ingredients": [
    {
      "item": 'minecraft:quartz_block'
    },
    {
      "item": 'minecraft:coal'
    }
  ],
  "result": {
    "count": 1,
    "id": 'actuallyadditions:black_quartz'
  }
})




})
