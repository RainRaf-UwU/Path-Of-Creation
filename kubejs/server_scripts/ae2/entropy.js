ServerEvents.recipes(e=>{
    //冷却
//     e.custom({
//   "type": "ae2:entropy",
//   "input": {
//     "fluid": {
//       "id": "minecraft:flowing_water"
//     }
//   },
//   "mode": "cool",
//   "output": {
//     "drops": [
//       {
//         "count": 1,
//         "id": "minecraft:snowball"
//       }
//     ]
//   }
// })

e.custom({
  "type": "ae2:entropy",
  "input": {
    "fluid": {
      "id":'rain:transmutation_fluid'
    }
  },
  "mode": "cool",
  "output": {
    "drops": [
      {
        "count": 1,
        "id": 'naturesaura:conversion_catalyst'
      }
    ]
  }
})

//加热
})