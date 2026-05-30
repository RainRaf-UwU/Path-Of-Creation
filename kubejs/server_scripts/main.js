// ServerEvents.recipes(event => {
//     event.shaped('minecraft:stone', [
//         'G S',   // 第一行：草方块、空、雪球
//         '   ',   // 第二行：全空
//         '   '    // 第三行：全空
//     ], {
//         G: 'minecraft:grass_block',
//         S: 'minecraft:snowball'
//     });
// });//测试用//合成样板
ServerEvents.recipes(e=>{

  

  e.custom({
  "type": "extendedcrafting:shaped_table",
  "pattern": [
   " AAA ",
   "AABAA",
   "ABCBA",
   "AABAA",
   " AAA "
  ],
  "key": {
    "A": {
      "item":'create:andesite_alloy'
    },
    "B":{
      "tag":'minecraft:planks'
    },
    "C":{
      "tag":'c:stones'
    }
  },
  "result": {
    "id":'create:crushing_wheel',
    "count": 2
  }})

  e.custom({
  "type": "extendedcrafting:shaped_table",
  "pattern": [
   "AAA",
   "AAA",
   "AAA"
  ],
  "key": {
    "A": {
      "item":'mekanism:bio_fuel'
    }
  },
  "result": {
    "id":'mekanism:block_bio_fuel',
    "count": 1
  }})

  e.custom({
  "type": "extendedcrafting:shaped_table",
  "pattern": [
   "       AA",
   "      AAA",
   " A   AAA ",
   "A   AAA  ",
   " A AAA   ",
   "  AAA    ",
   "  BA     ",
   "AB  A A  ",
   "BA   A   "
  ],
  "key": {
    "A": {
      "item":'minecraft:cobblestone'
    },
    "B":{
      "tag":"c:rods"
    }
  },
  "result": {
    "id":'minecraft:stone_sword',
    "count": 1
  }})

   e.custom({
  "type": "extendedcrafting:shaped_table",
  "pattern": [
  " AAAAAA B",
  "    AAAA ",
  "      AAA",
  "     B AA",
  "    B  AA",
  "   B    A",
  "  B     A",
  " B       ",
  "B        ",
  ],
  "key": {
    "A": {
      "item":'minecraft:cobblestone'
    },
    "B":{
      "tag":"c:rods"
    }
  },
  "result": {
    "id":'minecraft:stone_pickaxe',
    "count": 1
  }})
});//待定//合成扩展mod

ServerEvents.recipes(e=>{
    e.shaped('pipez:infinity_upgrade',[
        'AAA',
        'AAA',
        'AAA'
    ],{
        A:'pipez:ultimate_upgrade'
    });
    
    // e.shaped(Item.of('rain:stone_stick',4),[
    //   "A",
    //   "A"],{
    //     A:'minecraft:cobblestone'
    //   }
    // )//无限管道升级

    e.shaped('minecraft:lightning_rod',[
      "A",
      "A"
    ],{
      A:'minecraft:copper_ingot'
    })

    e.shaped(Item.of('minecraft:cobblestone_slab',3),[
      "AA"
    ],{
      "A":'minecraft:cobblestone'
    })

    e.shaped('clickmachine:click_machine',[
      "AAA",
      "ABA",
      "ACA"
    ],{
      "A":'minecraft:diorite',
      "B":'minecraft:chorus_fruit',
      "C":'minecraft:redstone_block'
    })

    e.shaped('custommachinery:custom_machine_item[custommachinery:machine="custommachinery:void_mining_machine"]',[
      "BCB",
      "BEB",
      "AAA"
    ],{
      "A":'minecraft:iron_block',
      "B":'minecraft:redstone',
      "C":'rain:void_mixture',
      // "D":,
      "E":'enderio:void_chassis'
    })

    e.shaped('pipez:infinity_upgrade',[
        'AAA',
        'ABA',
        'AAA'
    ],{
        A:'aether:holystone',
        B:'enderio:void_chassis'
    });

     e.shaped('minecraft:netherite_upgrade_smithing_template',[
        'ACA',
        'ABA',
        'AAA'
    ],{
        A:'minecraft:netherite_scrap',
        B:'minecraft:netherrack',
        C:'minecraft:diamond'
    });

    e.shaped('rain:aura_generate_machine',[
        'CCC',
        'ABA',
        'DDD'
    ],{
        A:'naturesaura:aura_cache',
        B:'mysticalagriculture:nature_essence',
        C:'naturesaura:infused_iron_block',
        D:'naturesaura:tainted_gold_block'
    });

   

    
});//普通合成\

//熔炉配方
ServerEvents.recipes(e=>{
  e.smelting('minecraft:smooth_stone_slab','minecraft:cobblestone_slab',1000,200)
  e.smelting('minecraft:leather','minecraft:rotten_flesh',1000,200)
  e.smelting('immersiveengineering:ingot_hop_graphite','immersiveengineering:dust_hop_graphite',1000,200)
  e.smelting('mysticalagriculture:inferium_essence','mekanism:block_bio_fuel',1000,200)
})

// kubejs/server_scripts/eat_cobble.js
// 1.21.1 NeoForge KubeJS

// kubejs/server_scripts/eat_cobble.js  1.21.1 NeoForge
// ItemEvents.ate(event => {
//     const { player, item, server } = event;
//     if (!item.is('minecraft:cobblestone')) return;

//     event.cancel();                                // 不计饥饿
//     player.getMainHandItem().shrink(1);            // 吃掉一个
//     player.give(Item.of('2x minecraft:gravel'));   // 给 2 砾石

//     // 声音 + 粒子（服务端命令发包）
//     server.runCommandSilent(`execute as ${player.username} run playsound minecraft:entity.generic.eat neutral @s`);
//     server.runCommandSilent(`execute as ${player.username} run particle minecraft:block minecraft:cobblestone ^ ^1.5 ^ 0.2 0.2 0.2 0.05 20`);
// });

// // 把圆石临时变成可吃
// ItemEvents.modification(event => {
//     event.modify('minecraft:cobblestone', item => {
//         item.foodProperties = b => b
//             .nutrition(0).saturation(0)
//             .alwaysEdible().fastToEat();
//     });
// });

// 监听 ItemFoodEaten 事件（1.21 NeoForge 专用事件）
// ② 监听吃完发砂砾（server 端）
// ItemEvents.foodEaten('rain:mini_cobblestone', e => {
//   // * @type {$player}
//   /**
//  * @type {$player}
//  * @deprecated
//  */
//     let player = foode.getplayer()
//     e.player.give('minecraft:gravel', 2)
// })

// kubejs/server_scripts/extended_shapeless.js
