const banItems = [
   'rain:god_creation_keepsake'
];

const c_4 = [
  'minecraft:command_block'
]



const arr1 =['rain.plot.player.tell.main_plot.text_1', 
    'rain.plot.player.tell.main_plot.text_2',
    'rain.plot.player.tell.main_plot.text_3',  
    'rain.plot.player.tell.main_plot.text_4',
    'rain.plot.player.tell.main_plot.text_5',
    'rain.plot.player.tell.main_plot.text_6',
    'rain.plot.player.tell.main_plot.text_7',
    'rain.plot.player.tell.main_plot.text_8',
    'rain.plot.player.tell.main_plot.text_9',
    'rain.plot.player.tell.main_plot.text_10',
    'rain.plot.player.tell.main_plot.text_11',
    'rain.plot.player.tell.main_plot.text_12',
  ]

const arr2 = [
  "rain.plot.player.tell.main_plot.c_4.text_1",
  "rain.plot.player.tell.main_plot.c_4.text_2",
  "rain.plot.player.tell.main_plot.c_4.text_3",
  "rain.plot.player.tell.main_plot.c_4.text_4",
  "rain.plot.player.tell.main_plot.c_4.text_5",
  "rain.plot.player.tell.main_plot.c_4.text_6",
  "rain.plot.player.tell.main_plot.c_4.text_7"
]


EntityEvents.death(event=>{
  const level = event.level
    if (event.entity.type == 'minecraft:player'){
      if (!event.entity.persistentData.getBoolean("dath")) return
      level.server.runCommandSilent('execute at @p run fill ~-15 ~-15 ~-15 ~15 ~15 ~15 air replace naturesaura:offering_table')
      event.entity.persistentData.putBoolean("dath", false)
      event.player.tell(Text.translate("rain.plot_1.palyer.tell.death").green())
    }
})


PlayerEvents.inventoryChanged(event=>{

    let item = event.getItem()
    const level = event.level
    if (undefined != banItems.find(value=>value==item.id)) {
      //  const key =item.id
    if (event.player.persistentData.getBoolean(item.id)) return
    //  event.player.persistentData.putBoolean(item.id, true)
     event.player.persistentData.putBoolean("dath", true)
      event.getPlayer().getInventory().clear(item)
    //  player.server.playeList
        // const level = event.level
        // level.server.runCommandSilent('execute at @p run fill ~-64 ~-64 ~-64 ~64 ~64 ~64 air replace minecraft:lightning_rod')
        // event.getPlayer().getInventory().clear(item)
        level.server.runCommandSilent('effect give @a minecraft:slowness infinite 255')
        level.server.runCommandSilent('effect give @a minecraft:blindness infinite 255')
        level.server.runCommandSilent('effect give @a minecraft:wither infinite 3')
        level.server.runCommandSilent('weather thunder')
        event.player.tell(Text.translate('rain.plot.player.tell.main_plot.text_1'))

        for(let  i = 1;i<46;i++){
          let arc = arr1[i/4]
          // if (!event.player.persistentData.getBoolean("dath")) returndasdasdasdasd
          event.player.level.server.schedule(i * 1000, () => {
            if (!event.player.persistentData.getBoolean("dath")) return
            level.server.runCommandSilent('execute at @a run particle minecraft:flash ~ ~ ~ 0 9 9 9 9')
            level.server.runCommandSilent('execute at @a run playsound minecraft:entity.lightning_bolt.thunder master @a ~ ~ ~ 1 1')
            level.server.runCommandSilent('damage @a 5 minecraft:lightning_bolt')
                // event.player.tell(Text.translate(arc))
            // if(i % 3 == 0) {event.player.tell(Text.translate(arr[i/3]))}
          })
        if(i % 4 == 0){
          event.player.level.server.schedule(i * 1000,() =>{
          if (!event.player.persistentData.getBoolean("dath")) return
            event.player.tell(Text.translate(arc))
          })
        }
        }
  event.player.level.server.schedule(50000,() =>{
  if (!event.player.persistentData.getBoolean("dath")) return
    level.server.runCommandSilent('effect clear @a')
    event.player.persistentData.putBoolean("dath", false)
    event.player.persistentData.putBoolean(item.id, true)
    event.player.give('rain:god_creation_keepsake')
  })
    }  

  if (undefined != c_4.find(value=>value==item.id)){
      if (event.player.persistentData.getBoolean(item.id)) return
    }
})




PlayerEvents.inventoryChanged(event=>{

    let item = event.getItem()
    const level = event.level
    if (undefined != c_4.find(value=>value==item.id)){
      if (event.player.persistentData.getBoolean(item.id)) return
      level.server.runCommandSilent('effect give @a minecraft:slowness infinite 255')
      level.server.runCommandSilent('effect give @a minecraft:blindness infinite 255')
      level.server.runCommandSilent('weather thunder')
      for(let i = 0;i<29;i++){
        let acc = arr2[i/4]
          if(i % 4 == 0){
          event.player.level.server.schedule(i * 1000,() =>{
            event.player.tell(Text.translate(acc))
          })
        }
      }
      event.player.level.server.schedule(30000,() =>{
    level.server.runCommandSilent('effect clear @a')
    event.player.persistentData.putBoolean(item.id, true)
  })
    }
  })