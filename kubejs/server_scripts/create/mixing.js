ServerEvents.recipes(e=>{
     e.custom({
  "type": "create:mixing",
  "heat_requirement": "heated",
  "ingredients": [
    {
      "item": 'minecraft:sand'
    },{
        "type": "fluid_stack",
      "amount": 100,
      "fluid": 'rain:void_fluid'
    }
  ],
  "results": [
    {
      "id":'minecraft:soul_sand'
    }
  ]
})
})