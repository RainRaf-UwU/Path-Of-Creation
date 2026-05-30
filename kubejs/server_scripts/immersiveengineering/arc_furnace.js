ServerEvents.recipes(e=>{
    e.custom({
  "neoforge:conditions": [
    {
      "type": "neoforge:not",
      "value": {
        "type": "neoforge:tag_empty",
        "tag": "c:ingots/bronze"
      }
    },
    {
      "type": "neoforge:not",
      "value": {
        "type": "neoforge:tag_empty",
        "tag": "c:ingots/tin"
      }
    }
  ],
  "type": "immersiveengineering:arc_furnace",
  "additives": [
    {
      "item":'immersiveengineering:dust_sulfur'
    }
  ],
  "energy": 51200,
  "input": {
    "basePredicate": {
      "tag": 'c:gears/netherite',
    },
    "count": 1
  },
  "results": [
    {
      "basePredicate": {
        "item": 'minecraft:netherite_scrap'
      },
      "count": 8
    }
  ],
  "time": 100
})

//  e.custom({
//   "neoforge:conditions": [
//     {
//       "type": "neoforge:not",
//       "value": {
//         "type": "neoforge:tag_empty",
//         "tag": "c:ingots/bronze"
//       }
//     },
//     {
//       "type": "neoforge:not",
//       "value": {
//         "type": "neoforge:tag_empty",
//         "tag": "c:ingots/tin"
//       }
//     }
//   ],
//   "type": "immersiveengineering:arc_furnace",
//   "additives": [
//     {
//       "item":'immersiveengineering:dust_sulfur'
//     }
//   ],
//   "energy": 51200,
//   "input": {
//     "basePredicate": {
//       "tag":'c:rods/netherite',
//     },
//     "count": 1
//   },
//   "results": [
//     {
//       "basePredicate": {
//         "item": 'minecraft:netherite_scrap'
//       },
//       "count": 2
//     }
//   ],
//   "time": 100
// })

e.custom({
  "neoforge:conditions": [
    {
      "type": "neoforge:not",
      "value": {
        "type": "neoforge:tag_empty",
        "tag": "c:ingots/bronze"
      }
    },
    {
      "type": "neoforge:not",
      "value": {
        "type": "neoforge:tag_empty",
        "tag": "c:ingots/tin"
      }
    }
  ],
  "type": "immersiveengineering:arc_furnace",
  "additives": [
    {
      "item":'immersiveengineering:dust_sulfur'
    }
  ],
  "energy": 51200,
  "input": {
    "basePredicate": {
      "item":'alltheores:netherite_plate',
    },
    "count": 1
  },
  "results": [
    {
      "basePredicate": {
        "item": 'minecraft:netherite_scrap'
      },
      "count": 2
    }
  ],
  "time": 100
})
})