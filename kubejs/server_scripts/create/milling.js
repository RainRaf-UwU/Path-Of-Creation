ServerEvents.recipes(e=>{
   e.custom({
  "type": "create:milling",
  "ingredients": [
    {
      "item": 'minecraft:quartz'
    }
  ],
  "processing_time": 50,
  "results": [
    {
      "id": 'enderio:powdered_quartz'
    }
    // {
    //   "chance": 0.1,
    //   "id": "minecraft:wheat_seeds"
    // }
  ]
})
})