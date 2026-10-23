ServerEvents.recipes(e=>{
    e.custom({
      "type": "enderio:alloy_smelting",
      "energy": 3200,
      "experience": 0.3,
      "inputs": [
        { "count": 1, "tag": "c:ingots/iron" },
        { "count": 1, "tag": "c:ingots/copper" },
        { "count": 1, "item": "minecraft:redstone" }
      ],
      "output": { "count": 2, "id": "enderio:conductive_alloy_ingot" }
    }).id('enderio:alloy_smelting/conductive_alloy_ingot')

    e.custom({
  "type": "enderio:alloy_smelting",
  "energy": 4800,
  "experience": 0.3,
  "inputs": [
    {
      "count": 1,
      "item": 'actuallyadditions:restonia_crystal'
    },
    {
      "count": 1,
      "item": 'minecraft:iron_ingot'
    },
    {
      "count": 1,
      "item": 'enderio:conductive_alloy_ingot'
    }
  ],
  "output": {
    "count": 1,
    "id": 'mekanism:alloy_infused'
  }
})
})