// 记录加入时间
const joinTimes = new Map()

PlayerEvents.loggedIn(event => {
    const uuid = event.player.uuid.toString()
    if (!joinTimes.has(uuid)) {
        joinTimes.set(uuid, event.player.level.time)
    }
})

PlayerEvents.tick(event => {
    const { player, server } = event
    if (!server) return
    
    const uuid = player.uuid.toString()
    const joinTime = joinTimes.get(uuid)
    
    // 未记录或已超时或已获得
    if (joinTime === undefined || joinTime === null) return
    
    const elapsed = player.level.time - joinTime
    
    // 超过5分钟
    if (elapsed > 6000) {
        joinTimes.set(uuid, null)
        return
    }
    
    // 掉入虚空
    if (player.y < -64) {
        server.runCommandSilent(`advancement grant ${player.username} only rain:question_mark`)
        joinTimes.set(uuid, null)
    }
})