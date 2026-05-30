// ServerEvents.recipes(e=>{

// })
//虚空采矿机-3
BlockEvents.placed('rain:structure_void_mining_machine-3',e=>{
    const { block, level, player } = e;

    if (!player || !player.isPlayer()) return;
    

    const place_block_pos = block.pos.above(1)

    if (player.getOffHandItem().id !== "rain:fazhang") {
            player.tell(Text.red(Text.translate('rain.structure_block.player.tell.text_0_0')).append(Text.aqua(Item.of("rain:fazhang").displayName)).append(Text.red(Text.translate('rain.structure_block.player.tell.text_0_1'))));
            player.tell(Text.gold(Text.translate('rain.structure_block.player.tell.text_info')));
    
            e.cancel();
            return;
        }

     block.set('minecraft:air')

     const bx = block.x
     const by = block.y
     const bz = block.z
     //第一层
     e.server.runCommandSilent(`fill ${bx - 2} ${by} ${bz + 1} ${bx + 2} ${by} ${bz + 5} minecraft:bedrock`)

     //第二层
     e.server.runCommandSilent(`fill ${bx - 2} ${by + 1} ${bz + 3} ${bx - 2} ${by + 1} ${bz + 3} minecraft:ancient_debris`)
     e.server.runCommandSilent(`fill ${bx + 2} ${by + 1} ${bz + 3} ${bx + 2} ${by + 1} ${bz + 3} minecraft:ancient_debris`)
     e.server.runCommandSilent(`fill ${bx} ${by + 1} ${bz + 5} ${bx} ${by + 1} ${bz + 5} minecraft:ancient_debris`)
     e.server.runCommandSilent(`fill ${bx + 1} ${by + 1} ${bz + 2} ${bx + 1} ${by + 1} ${bz + 4} minecraft:obsidian`)
     e.server.runCommandSilent(`fill ${bx - 1} ${by + 1} ${bz + 2} ${bx - 1} ${by + 1} ${bz + 4} minecraft:obsidian`)
     e.server.runCommandSilent(`fill ${bx} ${by + 1} ${bz + 3} ${bx} ${by + 1} ${bz + 4} minecraft:obsidian`)
     e.server.runCommandSilent(`fill ${bx} ${by + 1} ${bz + 2} ${bx} ${by + 1} ${bz + 2} minecraft:redstone_block`)

     //第三层
     e.server.runCommandSilent(`fill ${bx + 1} ${by + 2} ${bz + 2} ${bx - 1} ${by + 2} ${bz + 4} minecraft:obsidian`)

     //第四层
     e.server.runCommandSilent(`fill ${bx + 1} ${by + 3} ${bz + 2} ${bx - 1} ${by + 3} ${bz + 4} enderio:fluid_tank`)
     e.server.runCommandSilent(`fill ${bx} ${by + 3} ${bz + 3} ${bx} ${by + 3} ${bz + 3} allthemodium:allthemodium_block`)

     //第五层
     e.server.runCommandSilent(`fill ${bx} ${by + 4} ${bz + 3} ${bx} ${by + 4} ${bz + 3} minecraft:chest`)
    //   e.server.runCommandSilent(`fill ${bx - 2} ${by} ${bz + 1} ${bx + 2} ${by} ${bz + 5} minecraft:bedrock`)


})

//染色工厂
BlockEvents.placed('rain:structure_dyeing',e=>{
     const { block, level, player } = e;

    if (!player || !player.isPlayer()) return;
    

    const place_block_pos = block.pos.above(1)

    if (player.getOffHandItem().id !== "rain:fazhang") {
            player.tell(Text.red(Text.translate('rain.structure_block.player.tell.text_0_0')).append(Text.aqua(Item.of("rain:fazhang").displayName)).append(Text.red(Text.translate('rain.structure_block.player.tell.text_0_1'))));
            player.tell(Text.gold(Text.translate('rain.structure_block.player.tell.text_info')));
    
            e.cancel();
            return;
        }

     block.set('minecraft:air')

     const bx = block.x
     const by = block.y
     const bz = block.z

     //第一层
     e.server.runCommandSilent(`fill ${bx - 3} ${by} ${bz + 1} ${bx + 3} ${by} ${bz + 7} minecraft:bedrock`)

     //第二层
     e.server.runCommandSilent(`fill ${bx - 2} ${by + 1} ${bz + 3} ${bx + 2} ${by + 1} ${bz + 6} minecraft:iron_block`)
     e.server.runCommandSilent(`fill ${bx - 2} ${by + 1} ${bz + 2} ${bx + 2} ${by + 1} ${bz + 2} mekanism:ultimate_fluid_tank`)
     e.server.runCommandSilent(`fill ${bx} ${by + 1} ${bz + 2} ${bx} ${by + 1} ${bz + 2} minecraft:redstone_block`)

     //第三层
     e.server.runCommandSilent(`fill ${bx - 2} ${by + 2} ${bz + 3} ${bx + 2} ${by + 2} ${bz + 6} alltheores:steel_block`)
     e.server.runCommandSilent(`fill ${bx - 2} ${by + 2} ${bz + 2} ${bx + 2} ${by + 2} ${bz + 2} advanced_ae:quantum_alloy_block`)

     //第四层
      e.server.runCommandSilent(`fill ${bx - 2} ${by + 3} ${bz + 3} ${bx - 2} ${by + 3} ${bz + 3} alltheores:nickel_block`)
      e.server.runCommandSilent(`fill ${bx + 2} ${by + 3} ${bz + 3} ${bx + 2} ${by + 3} ${bz + 3} alltheores:nickel_block`)
      e.server.runCommandSilent(`fill ${bx - 2} ${by + 3} ${bz + 6} ${bx - 2} ${by + 3} ${bz + 6} alltheores:nickel_block`)
      e.server.runCommandSilent(`fill ${bx + 2} ${by + 3} ${bz + 6} ${bx + 2} ${by + 3} ${bz + 6} alltheores:nickel_block`)
      e.server.runCommandSilent(`fill ${bx - 1} ${by + 3} ${bz + 6} ${bx + 1} ${by + 3} ${bz + 6} alltheores:platinum_block`)
      e.server.runCommandSilent(`fill ${bx - 1} ${by + 3} ${bz + 3} ${bx + 1} ${by + 3} ${bz + 3} alltheores:platinum_block`)
      e.server.runCommandSilent(`fill ${bx - 2} ${by + 3} ${bz + 4} ${bx - 2} ${by + 3} ${bz + 5} alltheores:platinum_block`)
      e.server.runCommandSilent(`fill ${bx + 2} ${by + 3} ${bz + 4} ${bx + 2} ${by + 3} ${bz + 5} alltheores:platinum_block`)
      e.server.runCommandSilent(`fill ${bx - 1} ${by + 3} ${bz + 4} ${bx + 1} ${by + 3} ${bz + 5} naturesaura:golden_leaves`)

      //第五层
      e.server.runCommandSilent(`fill ${bx - 1} ${by + 4} ${bz + 4} ${bx + 1} ${by + 4} ${bz + 5} oritech:machine_core_7`)

})

BlockEvents.placed('rain:structure_fluid_processing_primering',e=>{
     const { block, level, player } = e;

    if (!player || !player.isPlayer()) return;
    

    const place_block_pos = block.pos.above(1)

    if (player.getOffHandItem().id !== "rain:fazhang") {
            player.tell(Text.red(Text.translate('rain.structure_block.player.tell.text_0_0')).append(Text.aqua(Item.of("rain:fazhang").displayName)).append(Text.red(Text.translate('rain.structure_block.player.tell.text_0_1'))));
            player.tell(Text.gold(Text.translate('rain.structure_block.player.tell.text_info')));
    
            e.cancel();
            return;
        }

     block.set('minecraft:air')

     const bx = block.x
     const by = block.y
     const bz = block.z

     //第一层
    e.server.runCommandSilent(`fill ${bx} ${by} ${bz + 4} ${bx} ${by} ${bz + 4} alltheores:steel_block`)

    //第二层
    e.server.runCommandSilent(`fill ${bx} ${by+1} ${bz + 3} ${bx} ${by+1} ${bz + 5} alltheores:steel_block`)
    e.server.runCommandSilent(`fill ${bx-1} ${by+1} ${bz + 4} ${bx+1} ${by+1} ${bz + 4} alltheores:steel_block`)
    e.server.runCommandSilent(`fill ${bx} ${by+1} ${bz + 4} ${bx} ${by+1} ${bz + 4} minecraft:chest`)
})


