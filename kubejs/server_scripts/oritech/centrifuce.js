ServerEvents.recipes(e=>{
//     e.custom({
//   "type": "oritech:centrifuge_fluid",
//   "fluidInput": {
//     "amount": 100,
//     "fluid": '#c:milk'
//   },
//   "fluidOutputs": [
//     {
//       "amount": 50,
//       "fluid": "oritech:still_silicon_wash"
//     }
//   ],
//   "ingredients": [
//     {
//       "item": "minecraft:gravel"
//     }
//   ],
//   "results": [],
//   "time": 160
// })

e.custom({
  "type": "oritech:centrifuge_fluid",
  "fluidInput": {
    "amount": 100,
    "fluid": '#c:milk'
  },
  "fluidOutputs": [],
  "ingredients": [
    {
      "item": 'draconicevolution:draconium_dust'
    }
  ],
  "results": [{
      "count": 1,
      "id":'draconicevolution:draconium_ingot'
    }],
  "time": 160
})

e.custom({
  "type": "oritech:centrifuge_fluid",
  "fluidInput": {
    "amount": 1000,
    "fluid": 'oritech:still_sheol_fire'
  },
  "fluidOutputs": [],
  "ingredients": [
    {
      "item":'allthemodium:allthemodium_block'
    }
  ],
  "results": [{
      "count": 1,
      "id":'extendedcrafting:flux_crafter'
    }],
  "time": 160
})

e.custom({
  "type": "oritech:centrifuge_fluid",
  "fluidInput": {
    "amount": 100,
    "fluid": 'oritech:still_fuel'
  },
  "fluidOutputs": [ {
    "amount": 100,
    "fluid": 'stellaris:oil'
  }],
  "ingredients": [
    {
      "item":'justdirethings:eclipsealloy_ingot' 
    }
  ],
  "results": [],
  "time": 160
})
})