// const { $Block } = require("ca.teamdman.sfml.ast.Block")
// const { $Level } = require("org.slf4j.event.Level")

StartupEvents.registry("item",e=>{
   e.create("rain:radiation_ning") 
   .maxStackSize(1) 
                .food(food => food
                    .saturation(0)
                    .alwaysEdible()
                    .eatSeconds(10)
                     .eaten(foode=>{
                     /**
                     * @type {$player}
                     *  @type {$Block}
                     * @type {$Level}
                      */
                      let player = foode.getPlayer()
                      let level = foode.getLevel() 
                      // let block = foode.getBlock()
                      if (player == null || level.clientSide) return
                        //   player.give(Item.of('minecraft:gravel', 2))
                        player.tell(Text.translate("food.rain.eat.event.info_1"))
                        level.server.runCommandSilent('effect give @p minecraft:slowness 5 255')
                        level.server.runCommandSilent('effect give @p minecraft:blindness 5 255')
                        foode.server.schedule(5000,()=>{
                        let px = Math.floor(player.x)
                        let py = Math.floor(player.y)
                        let pz = Math.floor(player.z)
                          player.tell(Text.translate("food.rain.eat.event.info_2"))
                          level.server.runCommandSilent(`fill ${px} ${py} ${pz} ${px} ${py} ${pz} rain:remmant`)
                          level.server.runCommandSilent(`mek radiation reduce @p 10000`)
                          level.server.runCommandSilent(`playsound random.explode master @p ${px} ${py} ${pz}`)
                        })
                        for(let i = 1;i<=40;i++){
                          foode.server.schedule(5000+i*50,()=>{
                            level.server.runCommandSilent('playsound minecraft:item.bucket.empty_milk player @p ~ ~ ~ 3 2 1')
                          })
                        }
                      
                    })                                                                                                                  
                )
    e.create("rain:soul_eye")
    .food(food=>food
      .saturation(0)
      .alwaysEdible()
      .eatSeconds(3)
      .eaten(ate=>{
        let player = ate.getPlayer()
        let level = ate.getLevel()
        let name = player.name.getString()
        if (player == null || level.clientSide) return
        level.server.runCommandSilent(`gamemode spectator ${name}`)
        ate.server.schedule(10000,()=>{
        level.server.runCommandSilent(`gamemode survival ${name}`)
        })
      })
    )
})