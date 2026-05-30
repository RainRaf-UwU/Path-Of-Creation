ServerEvents.recipes(e=>{
    e.custom({
  "type": "create:crushing",
  "ingredients": [
    {
      "item": 'minecraft:sand'
    }
  ],
  "processing_time": 250,
  "results": [
    {
      "id": 'ae2:silicon'
    }
    // {
    //   "chance": 0.4,
    //   "id": "minecraft:iron_nugget"
    // }
  ]
})

 e.custom({
  "type": "create:crushing",
  "ingredients": [
    {
      "item": 'minecraft:packed_mud'
    }
  ],
  "processing_time": 250,
  "results": [
    {
      "id":'minecraft:gold_nugget',
      "count":5
    },
    {
      "id":'minecraft:gold_nugget',
      "count":4,
      "chance":0.2
    }
  ]
})

 e.custom({
  "type": "create:crushing",
  "ingredients": [
    {
      "item": 'minecraft:glow_berries'
    }
  ],
  "processing_time": 250,
  "results": [
    {
      "id":'minecraft:glowstone_dust',
      "count":1
    },
    {
      "id":'mysticalagriculture:nature_essence',
      "count":1,
      "chance":0.5
    }
  ]
})

e.custom({
  "type": "create:crushing",
  "ingredients": [
    {
      "item": 'minecraft:iron_ingot'
    }
  ],
  "processing_time": 250,
  "results": [
    {
      "id":'alltheores:iron_dust',
      "count":1
    }
  ]
})
})