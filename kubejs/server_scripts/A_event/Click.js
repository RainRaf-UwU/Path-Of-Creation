// const { $ItemTag } = require("de.ellpeck.actuallyadditions.mod.items.ItemTag");
BlockEvents.rightClicked('minecraft:mangrove_planks',event => {//要右键的方块
    // if (!event.block.hasTag('minecraft:mangrove_planks')) return
    if (event.hand == "OFF_HAND") return
    let player = event.getPlayer()
    if (player == null) return
    let isBreak = false;
    if (event.getItem().hasTag("minecraft:axes")){
        let spawnItem = event.getLevel().createEntity("item")
        spawnItem.pos = event.block.pos
        spawnItem.item = Item.of('minecraft:mangrove_slab', 2);//获得物品
        event.level.destroyBlock(event.block.pos,false)//破坏方块
        spawnItem.spawn();
        event.getItem().setDamageValue(event.getItem().getDamageValue() + 2)
    }
})//样例

BlockEvents.rightClicked('minecraft:oak_planks',event => {//要右键的方块
    // if (!event.block.hasTag('minecraft:oak_planks')) return
    if (event.hand == "OFF_HAND") return
    let player = event.getPlayer()
    if (player == null) return
    let isBreak = false;
    if (event.getItem().hasTag("minecraft:axes")){
        let spawnItem = event.getLevel().createEntity("item")
        spawnItem.pos = event.block.pos
        spawnItem.item = Item.of('minecraft:oak_slab', 2);//获得物品
        event.level.destroyBlock(event.block.pos,false)//破坏方块
        spawnItem.spawn();
        event.getItem().setDamageValue(event.getItem().getDamageValue() + 2)
    }
})//样例

BlockEvents.rightClicked('extendedcrafting:ultimate_table', event => {//要右键的方块
    if (event.hand == "OFF_HAND") return //判断主手
    let player = event.getPlayer() //获取玩家信息
    if (player == null) return  //如果没检测到玩家就退出函数
    let isBreak = false; 
    if (player.mainHandItem.id =='rain:fazhang'){ //判断玩家主手的物品
        let spawnItem = event.getLevel().createEntity("item") //获取物品信息
        spawnItem.pos = event.block.pos//获取方块位置信息
        spawnItem.item = Item.of('minecraft:cobblestone', 8);//获得物品
        // event.level.destroyBlock(event.block.pos,false)  //破坏方块
        spawnItem.spawn(); //刷新物品到主世界
        // event.getItem().setDamageValue(event.getItem().getDamageValue() + 2) //消耗工具耐久2点
        player.swing("main_hand",true)
    }
})//样例

BlockEvents.rightClicked('rain:mini_cobblestone',e=>{
    if (e.hand == "OFF_HAND") return
    let player = e.getPlayer()
    if (player == null) return
    let isBreak = false;
    if (player.mainHandItem.id == 'rain:fazhang'){
        const level = e.level
        level.server.runCommandSilent(`time set 15000`)
    }
})

BlockEvents.leftClicked('rain:mini_cobblestone',e=>{
    if (e.hand == "OFF_HAND") return
    let player = e.getPlayer()
    if (player == null) return
    let isBreak = false;
    if (player.mainHandItem.id == 'rain:fazhang'){
        const level = e.level
         level.server.runCommandSilent(`time set day`)
    }
})

// 1.21.1 NeoForge 测试通过
ItemEvents.rightClicked('minecraft:glass_bottle', event => {//要右键的物品
  const { level, player, hand, item, target } = event  
  if (level.dimension != 'minecraft:overworld') return        // 只演示主世界
  const y = Math.floor(player.y) - 1                         // 玩家脚底
  if (y > -64) return                                   
  const block = level.getBlock(player.x, y, player.z) 
  if (block.id !== 'minecraft:air' && block.id !== 'minecraft:void_air') return  
  
  if (!level.isClientSide()) { 
    player.setItemInHand(hand, item.withCount(item.count - 1))
    player.give('rain:bottle_void')                      
  }
  player.swing(hand)  
  level.playSound(player, 'item.bottle.fill', 1, 1)
})

BlockEvents.leftClicked('minecraft:lightning_rod',e=>{
    if (e.hand == "OFF_HAND") return
    let player = e.getPlayer()
    if (player == null) return
    let isBreak = false;
    if (player.mainHandItem.id == 'rain:fazhang'){
        const level = e.level
         level.server.runCommandSilent('weather clear')
    }
})

BlockEvents.rightClicked('minecraft:lightning_rod',e=>{
    if (e.hand == "OFF_HAND") return
    let player = e.getPlayer()
    if (player == null) return
    let isBreak = false;
    if (player.mainHandItem.id == 'rain:fazhang'){
        const level = e.level
         level.server.runCommandSilent('weather thunder')
    }
})

//清除掉落物
BlockEvents.leftClicked('aether:altar',e=>{
    if (e.hand == "OFF_HAND") return
    let player = e.getPlayer()
    if (player == null) return
    let isBreak = false;
    if (player.mainHandItem.id == 'rain:fazhang'){
        const level = e.level
         level.server.runCommandSilent('kill @e[type=item]')
    }
})

BlockEvents.rightClicked('minecraft:bedrock',event => {//要右键的方块
    // if (!event.block.hasTag('minecraft:bedrock')) return
    if (event.hand == "OFF_HAND") return
    let player = event.getPlayer()
    if (player == null) return
    let isBreak = false;
    if (player.mainHandItem.id == 'rain:fazhang'){
        let spawnItem = event.getLevel().createEntity("item")
        spawnItem.pos = event.block.pos
        spawnItem.item = Item.of('minecraft:bedrock', 1);//获得物品
        event.level.destroyBlock(event.block.pos,false)//破坏方块
        spawnItem.spawn();
        // event.getItem().setDamageValue(event.getItem().getDamageValue() + 2)
    }
})//样例

BlockEvents.leftClicked('minecraft:bone_block',e=>{
    if (e.hand == "OFF_HAND") return
    let player = e.getPlayer()
    if (player == null) return
    let isBreak = false;
    if (player.mainHandItem.id == 'rain:fazhang'){
       let spawnItem = e.getLevel().createEntity("item")
        spawnItem.pos = e.block.pos
    //     // spawnItem.item = Item.of('minecraft:bedrock', 1);//获得物品
        e.level.destroyBlock(e.block.pos,false)//破坏方块
        // e.level.setBlock(pos, Block.getBlock('minecraft:stone'))
    //     spawnItem.spawn();
      const state = Block.getBlock('minecraft:skeleton_skull').defaultBlockState()
      e.level.setBlockAndUpdate(e.block.pos, state)   // ← 推荐
    }
})

BlockEvents.rightClicked('minecraft:grass_block',event => {//要右键的方块
    // if (!event.block.hasTag('minecraft:bedrock')) return
     const { player, block, level } = event;
    // if (event.hand == "OFF_HAND") return
    if (player == null) return
    let isBreak = false;
    if (player.offHandItem.id == 'mysticalagriculture:dye_essence'&&
        player.mainHandItem.id == 'ars_nouveau:summon_focus'
    ) {
        const spawnX = block.pos.x + 0.5
        const spawnY = block.pos.y + 1
        const spawnZ = block.pos.z + 0.5

        level.server.runCommandSilent(
            `summon minecraft:villager ${spawnX} ${spawnY} ${spawnZ}`
        )
        player.tell(Text.translate('kubejs.blockevents.info'))

        player.offHandItem.shrink(1)
        player.mainHandItem.shrink(1)
        block.set('allthemodium:allthemodium_block')
    }
})//样例

/**
 * 对玩家造成无视无敌帧的伤害
 * @param {Player} player   目标玩家
 * @param {float}  amount   伤害量（半心为单位，1 = 0.5 颗心）
 * @param {DamageSource} src 伤害来源，可省略
 */
function hurtNoIFrames(player, amount, src) {
  if(typeof src == 'undefined') src == null
  const source = src || player.damageSources().generic();
  player.attack(source, amount);
  player.invulnerableTime = 0;     // 立刻清无敌帧计时器
}

ItemEvents.rightClicked('occultism:butcher_knife', e => {//要右键的物品
     const { level, player, hand, item, target } = e  
    if (e.hand == "OFF_HAND") return
    let isBreak = false;
    if (player.mainHandItem.id == 'occultism:butcher_knife'&&
        player.shiftKeyDown
    ){
        // level.server.runCommandSilent('effect give @p minecraft:instant_damage 1 1')
        player.swing("main_hand",true)
        hurtNoIFrames(player, 6);
        player.give('occultism:tallow') 
          
    }
})

BlockEvents.rightClicked('oritech:black_hole_block',event => {//要右键的方块
    // if (!event.block.hasTag('minecraft:bedrock')) return
    if (event.hand == "OFF_HAND") return
    let player = event.getPlayer()
    if (player == null) return
    let isBreak = false;
    if (player.mainHandItem.id == 'rain:fazhang'){
        let spawnItem = event.getLevel().createEntity("item")
        spawnItem.pos = event.block.pos
        spawnItem.item = Item.of('oritech:black_hole_block', 1);//获得物品
        event.level.destroyBlock(event.block.pos,false)//破坏方块
        spawnItem.spawn();
        // event.getItem().setDamageValue(event.getItem().getDamageValue() + 2)
    }
})//样例


BlockEvents.rightClicked('rain:aura_generate_machine',event=>{
    const { block, item, level, player, hand } = event
     if (event.hand == "OFF_HAND") return

if (player.mainHandItem.id == 'mysticalagriculture:nature_essence'){
     AuraChunk.storeAura(level, block.pos, 1000)
      player.setItemInHand(hand, item.withCount(item.count - 1))
}  
})

BlockEvents.rightClicked('allthemodium:allthemodium_block',event => {//要右键的方块
    // if (!event.block.hasTag('minecraft:bedrock')) return
     const { player, block, level } = event;
    // if (event.hand == "OFF_HAND") return
    if (player == null) return
    let isBreak = false;
    if (player.offHandItem.id == 'rain:fazhang'&&
        player.mainHandItem.id =='easy_villagers:villager'
    ) {
        const spawnX = block.pos.x + 0.5
        const spawnY = block.pos.y + 1
        const spawnZ = block.pos.z + 0.5

        level.server.runCommandSilent(
            `summon minecraft:cow ${spawnX} ${spawnY} ${spawnZ}`
        )

        player.mainHandItem.shrink(1)
        block.set('minecraft:air')
    }
})

BlockEvents.rightClicked('oritech:black_hole_block',event => {//要右键的方块
     const { player, block, level } = event;
    if (player == null) return
    let isBreak = false;
    if (player.offHandItem.id == 'rain:fazhang'&&
        player.mainHandItem.id =='mysticalagriculture:iron_seeds'
    ) {
       
        player.mainHandItem.shrink(1)
        player.give('mysticalagriculture:steel_seeds')
        // player.give(Item.of('mysticalagriculture:steel_seeds').withchane)
    }
})

ItemEvents.rightClicked(event=>{
    const{player,block,level} = event
    if(player == null) return   
    if(player.mainHandItem.id == 'mysticalagriculture:nature_essence' &&
        event.offHandItem.getItem().hasTag('#c:tools/fishing_rod')
    ){
        if(Math.random() < 0.1){
            player.give('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:cod"]')
        }
    }
})

BlockEvents.rightClicked('minecraft:grass_block',event => {//要右键的方块
     const { player, block, level } = event;
    if (player == null) return
    let isBreak = false;
    if (player.offHandItem.id == 'rain:fazhang'&&
        player.mainHandItem.id =='ars_nouveau:summon_focus'
    ) {
       
        player.mainHandItem.shrink(1)
        player.give('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:ars_nouveau/whirlisprig_se"]')
        
        // player.give(Item.of('mysticalagriculture:steel_seeds').withchane)
    }
})

// ItemEvents.rightClicked(event=>{
//     const{player,block,level} = event
//     if(player == null) return   
//     if(player.mainHandItem.id == 'mysticalagriculture:nature_essence' &&
//         event.offHandItem.getItem().hasTag('#c:tools/fishing_rod')
//     ){
//         if(Math.random() < 0.1){
//             player.give('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:cod"]')
//         }
//     }
// })

BlockEvents.rightClicked('minecraft:chest',event => {//要右键的方块
     const { player, block, level } = event;
    if (player == null) return
    let isBreak = false;
    if (player.offHandItem.id == 'rain:fazhang'&&
        player.mainHandItem.id =='hostilenetworks:blank_data_model'&&
        player.shiftKeyDown
    ) {
       
        player.mainHandItem.shrink(1)
        player.give('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:artifacts/mimic"]')
        // player.give(Item.of('mysticalagriculture:steel_seeds').withchane)
    }
})

BlockEvents.rightClicked('industrialforegoing:pink_slime_block',event => {//要右键的方块
     const { player, block, level } = event;
    if (player == null) return
    let isBreak = false;
    if (player.offHandItem.id == 'rain:fazhang'&&
        player.mainHandItem.id =='hostilenetworks:blank_data_model'&&
        player.shiftKeyDown
    ) {
       
        player.mainHandItem.shrink(1)
        player.give('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:slime"]')
        // player.give(Item.of('mysticalagriculture:steel_seeds').withchane)
    }
})

const bl = [
    'minecraft:barrier',
    'minecraft:command_block',
    'minecraft:chain_command_block',
    'minecraft:repeating_command_block'
]

BlockEvents.leftClicked(event=>{
     const { player, block, level } = event;
     if (player == null) return
     bl.forEach(b => {
        if(block.id == b){
        let spawnItem = event.getLevel().createEntity("item")
        spawnItem.pos = block.pos
        spawnItem.item = Item.of(b, 1);//获得物品
        level.destroyBlock(block.pos,false)//破坏方块
        spawnItem.spawn();
        }
     });
})

BlockEvents.rightClicked('minecraft:barrier',event => {//要右键的方块
     const { player, block, level } = event;
    if (player == null) return
    let isBreak = false;
    if (player.mainHandItem.id == 'rain:fazhang') {
       let spawnItem = event.getLevel().createEntity("item")
        spawnItem.pos = block.pos
        spawnItem.item = Item.of('custommachinery:custom_machine_item[custommachinery:machine="custommachinery:fluid_processing"]', 1);//获得物品
        level.destroyBlock(block.pos,false)//破坏方块
        spawnItem.spawn();
        //  block.set('custommachinery:custom_machine_item[custommachinery:machine="custommachinery:fluid_processing"]')
        }
    })

BlockEvents.rightClicked(event => {
     const { player, block, level } = event;
    if (player == null) return
    let isBreak = false;
    // player.playSound('minecraft:entity.ender_dragon.ambient',1,1)
    // for(let i = 1;i<=20;i++){
    //     // level.server.runCommandSilent('playsound minecraft:item.bucket.empty_milk player @p ~ ~ ~ 3 2 1')
    // }
    let list = [
    'minecraft:chain_command_block',
    'minecraft:command_block',
    'minecraft:repeating_command_block'
    ]
    list.forEach(b => {
        if (player.mainHandItem.id == b
    ) {

        const spawnX = block.pos.x
        const spawnY = block.pos.y + 1
        const spawnZ = block.pos.z
        const block_y = block.offset(0,1,0)

        if(block_y.id != "minecraft:air") return

        player.mainHandItem.shrink(1)

        level.server.runCommandSilent(
            `fill ${spawnX} ${spawnY} ${spawnZ} ${spawnX} ${spawnY} ${spawnZ} ${b}`
        )
    
    }
    });
    

        if(player.mainHandItem.id == 'rain:fire' || 
            player.offHandItem.id == 'rain:fire'
        ){
        const spawnX = block.pos.x
        const spawnY = block.pos.y + 1
        const spawnZ = block.pos.z
        const block_y = block.offset(0,1,0)

        if(block_y.id != "minecraft:air") return

         if(player.mainHandItem.id == 'rain:fire'){
             player.mainHandItem.shrink(1)
             player.swing("main_hand",true)
         }else{
             player.offHandItem.shrink(1)
             player.swing("off_hand",true)
             
         }

         level.server.runCommandSilent( `fill ${spawnX} ${spawnY} ${spawnZ} ${spawnX} ${spawnY} ${spawnZ} minecraft:fire`)

        //  player.swing("main_hand",true)
        }

        

    })

ItemEvents.rightClicked('rain:fazhang',e=>{
    const{ player , hand} = e

    if(hand == "MAIN_HAND"){
        player.swing("main_hand",true)
    }else{
        player.swing("off_hand",true)
    }
})




BlockEvents.leftClicked('naturesaura:conversion_catalyst', event => {//要右键的方块
    if (event.hand == "OFF_HAND") return //判断主手
    let player = event.getPlayer() //获取玩家信息
    if (player == null) return  //如果没检测到玩家就退出函数
    let isBreak = false; 
    if (player.mainHandItem.id =='minecraft:snow_block'){ //判断玩家主手的物品
        let spawnItem = event.getLevel().createEntity("item") //获取物品信息
        spawnItem.pos = event.block.pos//获取方块位置信息
        spawnItem.item = Item.of('mysticalagriculture:ice_essence', 1);//获得物品
        // event.level.destroyBlock(event.block.pos,false)  //破坏方块
        spawnItem.spawn(); //刷新物品到主世界
        // event.getItem().setDamageValue(event.getItem().getDamageValue() + 2) //消耗工具耐久2点
    }
})//样例

// BlockEvents.rightClicked('rain:mini_cobblestone', e => {
//     if (e.hand !== 'MAIN_HAND') return;
//     const p = e.player, item = p?.mainHandItem;
//     if (!item || item.id !== 'rain:fazhang') return;

//     const lvl = e.level;
//     const t   = lvl.dayTime % 24000;
//     const cmd = t > 15000 ? 'time set 2000' : 'time set 15000';

//     lvl.server.commands.performCommand(
//         lvl.server.createCommandSourceStack().withPermission(2), cmd);
//     p.sendPlayerAbilities();      
// });

BlockEvents.rightClicked(e=>{
    const { player, block, level } = e;
    if (player == null) return
    player.swing("main_hand",true)
})

BlockEvents.rightClicked('minecraft:command_block',e=>{
    const { player, block, level } = e;
    if (player == null) return
    if(player.hand == "OFF_HAND") return
    if(player.mainHandItem.id == 'minecraft:debug_stick'){
        block.set('minecraft:chain_command_block')
    }
})

BlockEvents.rightClicked('minecraft:chain_command_block',e=>{
    const { player, block, level } = e;
    if (player == null) return
    if(player.hand == "OFF_HAND") return
    if(player.mainHandItem.id == 'minecraft:debug_stick'){
        block.set('minecraft:command_block')
    }
})