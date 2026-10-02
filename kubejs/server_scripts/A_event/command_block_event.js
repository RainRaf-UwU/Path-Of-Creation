// function entity_id(raw){
//     let m1 = raw.match(/"([^"]+)"/)
//     let m2 = m1[1]

//     let sla = m2.indexOf("/")
//     if(sla == -1) return m2.slice(m2.indexOf(':') + 1)
    
//     let arr = m2.slice(0,sla) + ":" + m2.slice(sla + 1)
//     return arr.slice(arr.indexOf(":") + 1)
// }

function entity_id(raw){
    let m1 = raw.slice(raw.indexOf(':') + 1)
    let m2 = m1.slice(0,m1.indexOf("}"))

    let sla = m2.indexOf("/")
    if(sla == -1) return m2

    return m2.slice(0,sla) + ':' + m2.slice(sla + 1)
}

function entity_key(raw){
    let m1 = raw.indexOf(':')
    if(m1 == -1) return "entity.minecraft." + raw


    return "entity." + raw.slice(0,m1) + "." + raw.slice(m1 + 1)
}

function processStoredTime(str) {
    let match = str.match(/stored=(\d+)/);
    if (!match) return null;
    
    let stored = parseInt(match[1], 10);
    let newStored = stored + 360000 * 20;
    
    
    return `tiab:time_in_a_bottle[tiab:stored_time={stored:${newStored},total:${newStored}}]`;
}

BlockEvents.rightClicked('minecraft:command_block',e=>{
    const { player,level,block,hand} = e
    if(player == null) return
    if (hand == "OFF_HAND") return
    // if(level.clientSide) return
    // player.tell(entity_id('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:giant"]'))
    if(player.offHandItem.id == 'ars_nouveau:summon_focus'&&
        player.mainHandItem.id =='hostilenetworks:data_model'
    ){
        let item_id = player.mainHandItem.get('hostilenetworks:data_model')
        let m_id = entity_id(item_id.toString())
        // player.tell(m_id)
        let spawnX = block.pos.x + 0.5
        let spawnY = block.pos.y + 1
        let spawnZ = block.pos.z + 0.5
        level.server.runCommandSilent(`summon ${m_id} ${spawnX} ${spawnY} ${spawnZ}`)
        player.mainHandItem.shrink(1)
        player.offHandItem.shrink(1)
        player.tell(Text.green(Text.translate("cbe.rain.player.tell.info_1")).append(Text.translate(entity_key(m_id))))
    }

    if(player.offHandItem.id == 'minecraft:minecart'&&
        player.mainHandItem.id == 'hostilenetworks:blank_data_model'
    ){
        player.offHandItem.shrink(1)
        if(Math.random() < 0.01){
            player.mainHandItem.shrink(1)
             player.give('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:command_block_minecart"]')
        }
    }

    if(player.offHandItem.id == 'rain:fazhang'&&
        player.mainHandItem.id == 'rain:radiation_ning'
    ){
        player.mainHandItem.shrink(1)
        player.tell(Text.translate("cbe.rain.player.tell.info_2"))
        level.server.schedule(5000,()=>{
            player.tell(Text.translate("cbe.rain.player.tell.info_3"))
            level.server.runCommandSilent("mek radiation removeAll")
        })
    }
    if(player.mainHandItem.id == 'naturesaura:ancient_stick'){
        player.mainHandItem.shrink(1)
        player.give('minecraft:debug_stick')
        if(Math.random() < 0.1){
            block.set('minecraft:air')
        }
    }

    if(player.mainHandItem.id =='tiab:time_in_a_bottle'&&
        player.shiftKeyDown
    ){
        // player.mainHandItem.shrink(1)
        let item_id1 = player.mainHandItem.get('tiab:stored_time')
        let new_item_id = processStoredTime(item_id1.toString())
        player.mainHandItem.shrink(1)
        player.give(new_item_id)
        block.set('minecraft:air')
    }
})