// BlockEvents.rightClicked(e=>{

// })
// ========== 全局状态（确保在文件顶部定义）==========
let answerCallback = null
// let isWaitingAnswer = false
let currentScheduleIds = []  // 当前关卡的调度任务ID列表
let currentLevelGlobal = 0   // 当前关卡，用于取消任务时判断

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//功能：输入数组a(支持一维和二维)和字典b，输出坐标数组c和方块数组d，返回字典
function transformArrays(a, b) {
    var matrix = Array.isArray(a[0]) ? a : [a];
    
    var rLayer = -1, rIndex = -1, rPos = -1;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            var pos = matrix[i][j].indexOf('r');
            if (pos !== -1) {
                rLayer = i;
                rIndex = j;
                rPos = pos;
                break;
            }
        }
        if (rLayer !== -1) break;
    }
    
    var c = [];
    var d = [];
    
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            var str = matrix[i][j];
            var y = i - rLayer;
            var z = rIndex - j;
            
            for (var k = 0; k < str.length; k++) {
                var char = str[k];
                var x = k - rPos;
                
                if (char !== ' ') {
                    c.push([x, y, z]);
                    d.push(b[char]);
                }
            }
        }
    }
    
    return { c: c, d: d };
}

//功能：将数组顺时针旋转90度(支持一维和二维)
function rotateClockwise90(a) {
    var matrix = Array.isArray(a[0]) ? a : [a];
    var result = [];
    
    for (var layer = 0; layer < matrix.length; layer++) {
        var layerArr = matrix[layer];
        var rows = layerArr.length;
        var cols = layerArr[0].length;
        
        var newLayer = [];
        for (var newRow = 0; newRow < cols; newRow++) {
            var newStr = '';
            for (var newCol = 0; newCol < rows; newCol++) {
                var oldRow = rows - 1 - newCol;
                var oldCol = newRow;
                newStr += layerArr[oldRow][oldCol];
            }
            newLayer.push(newStr);
        }
        result.push(newLayer);
    }
    
    return Array.isArray(a[0]) ? result : result[0];
}



function bezierMove(server, entityTag, controlPoints, duration) {
    // 手动设置默认值
    if (duration === undefined) duration = 5;
    
    // 验证控制点
    if (!controlPoints || controlPoints.length < 3) {
        console.error("贝塞尔曲线需要至少3个控制点");
        return;
    }
    
    // 二次贝塞尔曲线公式
    function getBezierPoint(t, p0, p1, p2) {
        var u = 1 - t;
        var tt = t * t;
        var uu = u * u;
        return uu * p0 + 2 * u * t * p1 + tt * p2;
    }
    
    var tick = 0;
    var totalTicks = duration * 20;
    var end = controlPoints[controlPoints.length - 1];
    
    function move() {
        if (tick >= totalTicks) {
            // 到达终点，确保精确位置
            server.runCommandSilent('execute as @e[tag=' + entityTag + ',limit=1] at @s run tp @s ' + end.x.toFixed(3) + ' ' + end.y.toFixed(3) + ' ' + end.z.toFixed(3));
            return;
        }
        
        var t = tick / totalTicks;
        
        // 分段贝塞尔曲线计算
        var segmentCount = controlPoints.length - 2;
        var segmentT = t * segmentCount;
        var segmentIndex = Math.min(Math.floor(segmentT), segmentCount - 1);
        var localT = segmentT - segmentIndex;
        
        var p0 = controlPoints[segmentIndex];
        var p1 = controlPoints[segmentIndex + 1];
        var p2 = controlPoints[segmentIndex + 2];
        
        var x = getBezierPoint(localT, p0.x, p1.x, p2.x);
        var y = getBezierPoint(localT, p0.y, p1.y, p2.y);
        var z = getBezierPoint(localT, p0.z, p1.z, p2.z);
        
        // 传送实体
        server.runCommandSilent('execute as @e[tag=' + entityTag + ',limit=1] at @s run tp @s ' + x.toFixed(3) + ' ' + y.toFixed(3) + ' ' + z.toFixed(3));
        
        // 粒子效果（每2tick一次减少粒子密度）
        if (tick % 2 === 0) {
            server.runCommandSilent('particle minecraft:end_rod ' + x.toFixed(1) + ' ' + (y + 0.5).toFixed(1) + ' ' + z.toFixed(1) + ' 0 0 0 0 1 force');
        }
        
        tick++;
        server.schedule(1, move);
    }
    
    move();
}

// 强制伤害抵消回血（最可靠）
// PlayerEvents.tick(event => {
//     const { player } = event

//     if(player.persistentData.getBoolean("test1")) return
    
//     const data = noHealPlayers.get(player.uuid)
//     if (!data) return
    
//     // 记录预期血量
//     const expectedHealth = data.lastHealth
    
//     // 如果血量异常，使用伤害强制修正
//     if (player.health > expectedHealth) {
//         const damage = player.health - expectedHealth
        
//         // 使用魔法伤害（显示为魔法伤害，不明显）
//         // 或者使用setHealth直接设置
//         player.health = expectedHealth
        
//         // 如果还是不行，使用攻击
//         if (player.health > expectedHealth) {
//             // 创建虚拟伤害源
//             player.attack(damage * 1.5)  // 过量伤害确保生效
//         }
//     }
    
//     // 更新记录（只记录更低的值）
//     if (player.health < data.lastHealth) {
//         data.lastHealth = player.health
//         noHealPlayers.set(player.uuid, data)
//     }
// })

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





BlockEvents.rightClicked('minecraft:cobblestone',e=>{
    const{ player, block, hand, level } = e
    if (hand != 'MAIN_HAND') return
    // if(player.persistentData.getBoolean("test1"))

    console.log("test")
    const a = [
        [
            'aaa',
            'aaa',
            'aaa'
        ],[
            ' b ',
            'brb',
            ' b '
        ]];
    const b = {
        'a':'minecraft:birch_planks',
        'b':'minecraft:crafting_table',
        'c':'minecraft:stripped_oak_wood',
        'r':'minecraft:cobblestone'
    };

    

    //使用
    let h2 = transformArrays(a, b)
    let b1 = h2["d"]
    let a1 = h2["c"] //取出坐标数组
    // player.tell(JSON.stringify(h2))

    for(let i = 0;i<b1.length;i++){
        if(block.offset(a1[i][0],a1[i][1],a1[i][2]).id != b1[i].toString()) return
    }


    //执行事件
    if(player.mainHandItem.id == 'minecraft:diamond' && !player.persistentData.getBoolean("test")){
        // if (event.player.persistentData.getBoolean(item.id)) return
    //  event.player.persistentData.putBoolean(item.id, true)
        player.persistentData.putBoolean("test", true)
        // player.tell(h2)

        let name = player.name.getString()
        // player.tell(name)
        level.server.runCommandSilent(`tellraw ${name} {"translate":"rain.player.tell.text1","color":"green"}`)
        level.server.runCommandSilent(`playsound minecraft:entity.ender_dragon.ambient player ${name} ~ ~ ~ 3 2 1`)
        player.mainHandItem.shrink(1)
        player.level.server.schedule(3000,()=>{
             const sX = block.pos.x
             const sY = block.pos.y + 1
             const sZ = block.pos.z
            // player.tell(name)
            level.server.runCommandSilent(`playsound minecraft:entity.ender_dragon.ambient player ${name} ~ ~ ~ 3 2 1`)
            level.server.runCommandSilent(`tellraw ${name} {"translate":"rain.player.tell.text2","color":"green"}`)
            level.server.runCommandSilent(`summon minecraft:lightning_bolt ${sX} ${sY} ${sZ}`)
            level.server.runCommandSilent(`summon minecraft:zombie ${sX} ${sY} ${sZ}`)
            level.server.runCommandSilent(`execute as ${name} at @s run particle minecraft:end_rod ^ ^ ^ 5 5 5 0.2 100000`)
            player.persistentData.putBoolean("test", false)
        })
    }
    // player.tell("222")
})
//[
// "abc",
// "de",
// "fgh"
// ]



// ItemEvents.rightClicked('minecraft:diamond', event => {
//   const { player, server } = event
//   if (!server || player.level.clientSide) return

//   const eyePos = player.getEyePosition(1.0)
//   const lookVec = player.getLookAngle()
//   const distance = 20  // 射程
//   const steps = 40     // 粒子密度

//   for (let i = 0; i < steps; i++) {
//     const t = i / steps
//     const x = eyePos.x + lookVec.x * distance * t
//     const y = eyePos.y + lookVec.y * distance * t
//     const z = eyePos.z + lookVec.z * distance * t
    
//     server.runCommandSilent(`particle minecraft:end_rod ${x} ${y} ${z} 0 0 0 0 1 force`)
//   }
// })
EntityEvents.death(e=>{
    const { player , block ,entity } = e
    if(entity.type != player) return
    if(!player.persistentData.getBoolean(("player_death"))) return
    player.persistentData.putBoolean("player_death",false)
    player.persistentData.putBoolean("EventQuite",true)


})

BlockEvents.rightClicked('rain:msn',e=>{
    const{ player, block, hand, level, server } = e
    if (hand != 'MAIN_HAND') return
    if (!server || player.level.clientSide) return
    player.persistentData.putBoolean("EventQuite",false)
    player.persistentData.putBoolean("test1", false)
    player.persistentData.putBoolean("chat", false)
    player.persistentData.putBoolean("put_answer",false)
    player.persistentData.putBoolean("lel_0",false)
    player.persistentData.putBoolean("answer",false)
    player.persistentData.putBoolean("lel_1",false)
    player.persistentData.putBoolean("lel_2",false)
    player.persistentData.putBoolean("lel_3",false)
    player.persistentData.putBoolean("lel_4",false)
    player.persistentData.putBoolean("lel_5",false)
    player.persistentData.putBoolean("player_death",true)


    const a =[["   a   "," bbbbb "," bbbbb ","abbbbba"," bbbbb "," bbbbb ","   a   "],["   a   ","   c   ","       ","ac r ca","       ","   c   ","   a   "],["   a   ","       ","       ","a     a","       ","       ","   a   "],["   a   ","       ","       ","a     a","       ","       ","   a   "]];
    const b = {"a":"rain:haha","b":"minecraft:stone","c":"rain:test_block1","r":'rain:msn'};

    //使用
    let h2 = transformArrays(a, b)
    let b1 = h2["d"]
    let a1 = h2["c"] //取出坐标数组

    for(let i = 0;i<b1.length;i++){
        if(block.offset(a1[i][0],a1[i][1],a1[i][2]).id != b1[i].toString()) return
    }
    if(player.mainHandItem.id != 'minecraft:diamond' || player.persistentData.getBoolean("test1")) return

    level.server.runCommandSilent("time set day")
    level.server.runCommandSilent("weather clear")
    level.server.runCommandSilent("gamerule naturalRegeneration false")

    // level.server.runCommandSilent(
    //                         `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
    //                         `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
    //                     )

    

// for(let i = 0;i<num_10.length;i++){
//     level.server.runCommandSilent(`fill ${block.pos.x + num_10[i][0] } ${block.pos.y + num_10[i][1] } ${block.pos.z + num_10[i][2] } ${block.pos.x + num_10[i][0] } ${block.pos.y + num_10[i][1] } ${block.pos.z + num_10[i][2] } rain:error_block`)
// }


    
    // return

    // player.tell("111")

    //文字抖动效果开始
  // ============ 可复用的打字机系统 ============

/**
 * 创建打字机效果
 * @param {Player} targetPlayer - 目标玩家
 * @param {string} text - 要显示的文字
 * @param {Object} options - 可选配置
 */
function typewriter(targetPlayer, text, options) {
    if (!options) options = {}
    
    const config = {
        typeSpeed: options.typeSpeed != null ? options.typeSpeed : 100,
        cursorSpeed: options.cursorSpeed != null ? options.cursorSpeed : 60,
        breatheSpeed: options.breatheSpeed != null ? options.breatheSpeed : 50,
        breatheTime: options.breatheTime != null ? options.breatheTime : 3000,
        cursorChar: options.cursorChar != null ? options.cursorChar : "▌",
        colors: options.colors != null ? options.colors : [
            "#FFCCCC", "#FFAAAA", "#FF8888", "#FF6666",
            "#FF4444", "#FF2222", "#FF0000", "#CC0000",
            "#FF0000", "#FF2222", "#FF4444", "#FF6666",
            "#FF8888", "#FFAAAA"
        ],
        sound: options.sound != null ? options.sound : "minecraft:block.note_block.pling",
        onComplete: options.onComplete != null ? options.onComplete : null,
        
        // 基础乱码配置
        glitchEnabled: options.glitchEnabled != null ? options.glitchEnabled : false,
        glitchChance: options.glitchChance != null ? options.glitchChance : 0.3,
        glitchChars: options.glitchChars != null ? options.glitchChars : "▓▒░█▀▄▌▐▖▗▘▙▚▛▜▝▞▟",
        glitchDuration: options.glitchDuration != null ? options.glitchDuration : 3,
        glitchRecover: options.glitchRecover != null ? options.glitchRecover : true,
        
        // ============ 新增：自定义乱码位置 ============
        // 格式: [{start: 0, end: 3}, {start: 10, end: 15}]
        glitchRanges: options.glitchRanges != null ? options.glitchRanges : null,
        
        // ============ 新增：持续乱码的字符串 ============
        // 格式: ["错误", "警告", "失败"] - 这些字符串一旦出现就会持续乱码到结束
        permanentGlitchStrings: options.permanentGlitchStrings != null ? options.permanentGlitchStrings : null
    }
    
    var current = ""
    var index = 0
    var breatheIndex = 0
    var phase = "typing"
    var showCursor = true
    var breatheTimer = 0
    
    // 基础乱码状态
    var glitchState = {
        active: false,
        remaining: 0,
        originalChar: "",
        glitchIndex: -1
    }
    
    // ============ 新增：记录永久乱码位置 ============
    var permanentGlitchRanges = []
    
    var player = targetPlayer
    
    // 获取乱码字符
    function getGlitchChar() {
        var chars = config.glitchChars
        return chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    // 检查是否触发随机乱码
    function shouldTriggerGlitch() {
        return config.glitchEnabled && 
               !glitchState.active && 
               Math.random() < config.glitchChance &&
               index < text.length - 2
    }
    
    // ============ 新增：检查位置是否在自定义范围内 ============
    function isInGlitchRange(pos) {
        if (!config.glitchRanges) return false
        for (var i = 0; i < config.glitchRanges.length; i++) {
            var range = config.glitchRanges[i]
            if (pos >= range.start && pos < range.end) {
                return true
            }
        }
        return false
    }
    
    // ============ 新增：检查位置是否在永久乱码范围内 ============
    function isInPermanentGlitch(pos) {
        for (var i = 0; i < permanentGlitchRanges.length; i++) {
            var range = permanentGlitchRanges[i]
            if (pos >= range.start && pos < range.end) {
                return true
            }
        }
        return false
    }
    
    // ============ 新增：检测并记录永久乱码字符串 ============
    function checkPermanentGlitchStrings() {
        if (!config.permanentGlitchStrings) return
        
        for (var i = 0; i < config.permanentGlitchStrings.length; i++) {
            var glitchStr = config.permanentGlitchStrings[i]
            // 检查当前已打出的文字是否包含该字符串
            var foundIndex = current.indexOf(glitchStr)
            if (foundIndex !== -1) {
                // 检查是否已记录
                var alreadyRecorded = false
                for (var j = 0; j < permanentGlitchRanges.length; j++) {
                    if (permanentGlitchRanges[j].start === foundIndex) {
                        alreadyRecorded = true
                        break
                    }
                }
                if (!alreadyRecorded) {
                    permanentGlitchRanges.push({
                        start: foundIndex,
                        end: foundIndex + glitchStr.length
                    })
                }
            }
        }
    }
    
    function getDisplayText() {
        if (phase === "ended") return current
        if (phase === "typing" && showCursor) {
            return current + config.cursorChar
        }
        return current
    }
    
    function render() {
        if (!player) return
        
        var color = config.colors[breatheIndex % config.colors.length]
        var displayText = ""
        
        // 构建显示文本，处理各种乱码情况
        for (var i = 0; i < current.length; i++) {
            var shouldGlitch = false
            
            // 1. 检查是否在永久乱码范围内
            if (isInPermanentGlitch(i)) {
                shouldGlitch = true
            }
            // 2. 检查是否在自定义乱码范围内
            else if (isInGlitchRange(i)) {
                shouldGlitch = true
            }
            // 3. 检查是否在随机乱码范围内
            else if (config.glitchEnabled && glitchState.active && 
                     i >= glitchState.glitchIndex && 
                     i < glitchState.glitchIndex + (config.glitchDuration - glitchState.remaining)) {
                shouldGlitch = true
            }
            
            if (shouldGlitch) {
                displayText += getGlitchChar()
            } else {
                displayText += current.charAt(i)
            }
        }
        
        // 添加光标
        if (phase === "typing" && showCursor) {
            displayText += config.cursorChar
        }
        
        server.runCommandSilent("title " + player.username + " times 0 50 0")
        server.runCommandSilent("title " + player.username + " subtitle {\"text\":\"" + displayText + "\",\"color\":\"" + color + "\",\"bold\":true}")
        server.runCommandSilent("title " + player.username + " title {\"text\":\"\"}")
    }
    
    function typeTick() {
        if (!player || phase !== "typing") return
        
        showCursor = !showCursor
        
        if (showCursor && index < text.length) {
            // 随机乱码触发
            if (shouldTriggerGlitch()) {
                glitchState.active = true
                glitchState.remaining = config.glitchDuration
                glitchState.glitchIndex = index
            }
            
            // 添加字符
            current += text.charAt(index++)
            
            // 随机乱码计数
            if (glitchState.active) {
                glitchState.remaining--
                if (glitchState.remaining <= 0) {
                    glitchState.active = false
                }
            }
            
            // 检查永久乱码字符串
            checkPermanentGlitchStrings()
            
            // 播放音效
            var pitch
            var isGlitching = isInPermanentGlitch(index - 1) || 
                             isInGlitchRange(index - 1) || 
                             glitchState.active
            if (isGlitching) {
                pitch = (0.5 + Math.random() * 0.3).toFixed(2)
            } else {
                pitch = (1 + index * 0.15).toFixed(2)
            }
            server.runCommandSilent("playsound " + config.sound + " player " + player.username + " ~ ~ ~ 0.4 " + pitch)
        }
        
        render()
        breatheIndex++
        
        if (index >= text.length) {
            phase = "breathing"
            breatheTimer = 0
            showCursor = false
            glitchState.active = false
            server.schedule(config.breatheSpeed, function() { breatheTick() })
            return
        }
        
        server.schedule(config.cursorSpeed, function() { typeTick() })
    }
    
    function breatheTick() {
        if (!player || phase !== "breathing") return
        
        breatheTimer += config.breatheSpeed
        breatheIndex++
        render()
        
        if (breatheTimer >= config.breatheTime) {
            fadeOut()
            return
        }
        
        server.schedule(config.breatheSpeed, function() { breatheTick() })
    }
    
    function fadeOut() {
        phase = "fading"
        var fadeColors = ["#CC0000", "#990000", "#660000", "#330000", "#000000"]
        var step = 0
        
        function doFade() {
            if (!player || step >= fadeColors.length) {
                phase = "ended"
                server.runCommandSilent("title " + player.username + " clear")
                if (config.onComplete) config.onComplete(player)
                return
            }
            
            // 淡出阶段也保持乱码效果
            var displayText = ""
            for (var i = 0; i < current.length; i++) {
                if (isInPermanentGlitch(i) || isInGlitchRange(i)) {
                    displayText += getGlitchChar()
                } else {
                    displayText += current.charAt(i)
                }
            }
            
            server.runCommandSilent("title " + player.username + " times 0 3 0")
            server.runCommandSilent("title " + player.username + " subtitle {\"text\":\"" + displayText + "\",\"color\":\"" + fadeColors[step] + "\",\"bold\":true}")
            server.runCommandSilent("title " + player.username + " title {\"text\":\"\"}")
            
            step++
            server.schedule(80, function() { doFade() })
        }
        
        doFade()
    }
    
    typeTick()
    
    return {
        stop: function() { phase = "ended" },
        getPhase: function() { return phase }
    }
}

// ============ 使用样例 ============

// ============================================
// 样例 1: 指定位置乱码 - 隐藏关键信息
// ============================================
// typewriter(player, "密码是1234，不要告诉任何人", {
//     glitchRanges: [{start: 4, end: 8}],  // "1234"位置乱码
//     glitchChars: "*",
//     colors: ["#00FF00"]
// })

// ============================================
// 样例 2: 多处位置乱码 - 模拟损坏的数据
// ============================================
// typewriter(player, "实验记录第47号：对象表现出极强的攻击性，建议立即终止实验", {
//     glitchRanges: [
//         {start: 0, end: 4},    // "实验记录"
//         {start: 15, end: 17},  // "极强"
//         {start: 26, end: 30}   // "立即终止"
//     ],
//     glitchEnabled: true,
//     glitchChance: 0.2,
//     glitchChars: "▓▒░█",
//     colors: ["#FF0000", "#8B0000"]
// })

// // ============================================
// // 样例 3: 永久乱码 - 敏感词持续隐藏
// // ============================================
// typewriter(player, "警告：检测到高危病毒Trojan.X，系统即将崩溃", {
//     permanentGlitchStrings: ["Trojan.X", "崩溃"],  // 这些词一旦出现就持续乱码
//     glitchChars: "█",
//     colors: ["#FF0000"],
//     typeSpeed: 80
// })

// // ============================================
// // 样例 4: 组合使用 - 位置乱码+永久乱码+随机乱码
// // ============================================
// typewriter(player, "机密文件：Project Omega将于2025年启动，代号Alpha", {
//     // 固定位置乱码（日期）
//     glitchRanges: [{start: 19, end: 29}],
//     // 永久乱码（敏感词）
//     permanentGlitchStrings: ["Project Omega", "Alpha"],
//     // 随机乱码增加氛围
//     glitchEnabled: true,
//     glitchChance: 0.15,
//     glitchChars: "▓▒░█▀▄▌▐",
//     glitchDuration: 2,
//     colors: ["#FFD700", "#FFA500", "#FF8C00"],
//     sound: "minecraft:block.note_block.bit"
// })

// // ============================================
// // 样例 5: 关键词触发持续乱码 - 聊天记录风格
// // ============================================
// typewriter(player, "玩家A: 我发现了隐藏通道 玩家B: 真的吗在哪里 玩家A: 在坐标666 666 666", {
//     permanentGlitchStrings: ["666 666 666"],  // 坐标一旦打出就隐藏
//     glitchChars: "#",
//     colors: ["#00CED1"],
//     typeSpeed: 60
// })

// // ============================================
// // 样例 6: 渐进式信息揭示 - 解谜提示
// // ============================================
// function puzzleReveal(player, fullText, hiddenParts) {
//     // hiddenParts: [{start: 5, end: 10}, {start: 20, end: 25}]
//     typewriter(player, fullText, {
//         glitchRanges: hiddenParts,
//         glitchChars: "?",
//         colors: ["#9370DB", "#8A2BE2"],
//         typeSpeed: 100,
//         breatheTime: 5000
//     })
// }

// // // 使用：
// puzzleReveal(player, "答案藏在紫色方块的后面", [{start: 4, end: 6}])
// // 显示: "答案藏在??方块的后面"

// // ============================================
// // 样例 7: 动态检测永久乱码 - 剧情对话
// // ============================================
// typewriter(player, "神秘人：找到圣剑Excalibur，它将指引你击败黑暗领主Sauron", {
//     permanentGlitchStrings: ["Excalibur", "Sauron"],  // 关键名词持续乱码
//     glitchEnabled: true,
//     glitchChance: 0.25,
//     glitchChars: "▓▒░█",
//     glitchDuration: 3,
//     colors: ["#4B0082", "#8B008B", "#9400D3"],
//     sound: "minecraft:ambient.soul_sand_valley.loop",
//     onComplete: function(p) {
//         server.schedule(40, function() {
//             typewriter(p, "系统提示：检测到禁忌词汇，已自动加密处理", {
//                 glitchEnabled: true,
//                 glitchChance: 0.4,
//                 colors: ["#FF0000"],
//                 typeSpeed: 80
//             })
//         })
//     }
// })

// // ============================================
// // 样例 8: 模拟损坏的日志文件
// // ============================================
// typewriter(player, "Day1:基地建立成功 Day7:发现未知生物 Day15:它们进来了救", {
//     // 日期正常，内容乱码
//     glitchRanges: [
//         {start: 4, end: 10},
//         {start: 18, end: 26},
//         {start: 32, end: 41}
//     ],
//     // 关键词永久乱码
//     permanentGlitchStrings: ["未知生物", "它们进来了"],
//     glitchChars: "▓▒░█▀▄▌▐",
//     colors: ["#2F4F4F", "#696969", "#A9A9A9"],
//     typeSpeed: 120,
//     sound: "minecraft:block.sculk_sensor.clicking"
// })

// // ============================================
// // 样例 9: 多重敏感信息保护
// // ============================================
// typewriter(player, "银行账号6222 8888 6666 密码123456 余额999999元", {
//     permanentGlitchStrings: ["6222 8888 6666", "123456", "999999"],
//     glitchChars: "*",
//     colors: ["#008000"],
//     typeSpeed: 70
// })

// // ============================================
// // 样例 10: 混合模式 - 恐怖氛围
// // ============================================
// function horrorMessage(player, msg, curseWords) {
//     typewriter(player, msg, {
//         // 诅咒词永久乱码
//         permanentGlitchStrings: curseWords,
//         // 随机位置也乱码增加恐怖感
//         glitchEnabled: true,
//         glitchChance: 0.3,
//         glitchChars: "▓▒░",
//         glitchDuration: 2,
//         colors: ["#8B0000", "#4B0000", "#2B0000"],
//         sound: "minecraft:entity.ender_dragon.growl",
//         typeSpeed: 150,
//         breatheTime: 4000
//     })
// }

// // 使用：
// // horrorMessage(player, "我听到它在墙后面低语，它说你的名字", ["它", "你的名字"])
// // "它"和"你的名字"会永久乱码，其他位置随机乱码

// // ============================================
// // 样例 11: 技术文档风格 - 部分数据损坏
// // ============================================
// typewriter(player, "ERROR_CODE: 0x5F3 MODULE: Core_Memory STATUS: Critical_Failure", {
//     glitchRanges: [
//         {start: 12, end: 17},   // 错误码乱码
//         {start: 26, end: 36},   // 模块名乱码
//         {start: 45, end: 59}    // 状态乱码
//     ],
//     glitchChars: "█",
//     colors: ["#FF4500", "#FF6347"],
//     typeSpeed: 50
// })

// // ============================================
// // 样例 12: 对话中的"哔"声屏蔽
// // ============================================
// typewriter(player, "你这个笨蛋！我要把你打成猪头！", {
//     permanentGlitchStrings: ["笨蛋", "猪头"],
//     glitchChars: "哔",
//     colors: ["#FFD700"],
//     sound: "minecraft:block.note_block.banjo"
// })

// 结束

// 使用链式播放
// showSequence(player, ["第一幕", "第二幕", "第三幕"])

// 结束

// 使用链式播放
// showSequence(player, ["第一幕", "第二幕", "第三幕"])

// 结束

// ============ 使用示例 ============

// ServerEvents.commandRegistry(event => {
//     event.register(
//         event.literal("typewriter")
//             .executes(ctx => {
//                 const player = ctx.source.player
//                 if (!player) return 0
                
//                 const server = player.server
                
//                 // 基础用法
//                 typewriter(player, "你好，世界！", {}, server)
                
//                 // 带乱码效果
//                 // typewriter(player, "系统错误...检测到异常...", {
//                 //     glitchEnabled: true,
//                 //     glitchPositions: [0, 5, 10],
//                 //     glitchRate: 0.6,
//                 //     colors: ["#FF0000", "#AA0000"]
//                 // }, server)
                
//                 return 1
//             })
//     )
// })

// 结束
// ============ 使用示例 ============

// 基础调用
// typewriter(player, "你好世界")

// typewriter(player, "系统不稳定", {
//     glitchEnabled: true,           // 启用乱码
//     glitchChance: 0.3,             // 30%概率触发
//     glitchChars: "▓▒░█▀▄▌▐",       // 乱码字符池
//     glitchDuration: 3              // 持续3个字符
// })

// 完整配置
let px = Math.floor(player.x)
let py = Math.floor(player.y)
let pz = Math.floor(player.z)

let name = player.name.getString()
level.server.runCommandSilent(`playsound rain:waring player ${name} ${px} ${py} ${pz} 1 1`)
typewriter(player, "警告！请立刻退出仪式！！！", {
    typeSpeed: 5000,
    cursorChar: "_",
    colors: ["#FF0000", "#AA0000", "#FF0000"],
    breatheTime: 1000,
    // onComplete: function(p) {
    //     console.log(p.username + " 动画完成")
    // }
})

player.level.server.schedule(4000,()=>{
    typewriter(player, "只需破坏中间的方块即可！！！", {
    typeSpeed: 5000,
    cursorChar: "_",
    colors: ["#FF0000", "#AA0000", "#FF0000"],
    breatheTime: 1000,
    // onComplete: function(p) {
    //     console.log(p.username + " 动画完成")
    // }
})
})

player.level.server.schedule(8000,()=>{
    typewriter(player, "你还愣着干什么！！！", {
    typeSpeed: 5000,
    cursorChar: "_",
    colors: ["#FF0000", "#AA0000", "#FF0000"],
    breatheTime: 1000,
    glitchEnabled: true,           // 启用乱码
    glitchChance: 0.8,             // 30%概率触发
    glitchChars: "▓▒░█▀▄▌▐",       // 乱码字符池
    glitchDuration: 3    
    // onComplete: function(p) {
    //     console.log(p.username + " 动画完成")
    // }
})
})

player.level.server.schedule(12000,()=>{
    typewriter(player, "还剩不到30秒！！！", {
    typeSpeed: 5000,
    cursorChar: "_",
    colors: ["#FF0000", "#AA0000", "#FF0000"],
    breatheTime: 1000,
     glitchRanges: [
        {start: 4, end: 6}
    ],
    glitchEnabled: true,
    glitchChance: 1,
    glitchChars: "▓▒░█",
})
})

player.level.server.schedule(16000,()=>{
    typewriter(player, "后果你承担不起！！！", {
    // typeSpeed: 5000,
    cursorChar: "_",
    colors: ["#FF0000", "#AA0000", "#FF0000"],
    breatheTime: 1000,
     glitchEnabled: true,           // 启用乱码
    glitchChance: 0.8,             // 30%概率触发
    glitchChars: "▓▒░█▀▄▌▐",       // 乱码字符池
    glitchDuration: 3    
})
})

player.level.server.schedule(20000,()=>{
    typewriter(player, "你真的会死的！！！", {
    cursorChar: "_",
    colors: ["#FF0000", "#AA0000", "#FF0000"],
    breatheTime: 1000,
    permanentGlitchStrings: ["死"],  // 坐标一旦打出就隐藏
    typeSpeed: 60,
    glitchEnabled: true,           // 启用乱码
    glitchChars: "▓▒░█▀▄▌▐",       // 乱码字符池
    glitchDuration: 3
    // onComplete: function(p) {
    //     console.log(p.username + " 动画完成")
    // }
})
})

player.level.server.schedule(24000,()=>{
    typewriter(player, "我剩余的能量不多了！！！", {
    cursorChar: "_",
    colors: ["#FF0000", "#AA0000", "#FF0000"],
    breatheTime: 1000,
    permanentGlitchStrings: ["能量"],  // 坐标一旦打出就隐藏
    typeSpeed: 60,
    glitchEnabled: true,           // 启用乱码
    glitchChars: "▓▒░█▀▄▌▐",       // 乱码字符池
    glitchDuration: 3
    // onComplete: function(p) {
    //     console.log(p.username + " 动画完成")
    // }
})
})

player.level.server.schedule(28000,()=>{
    typewriter(player, "它的力量正在增强！！！", {
    cursorChar: "_",
    colors: ["#FF0000", "#AA0000", "#FF0000"],
    breatheTime: 1000,
    permanentGlitchStrings: ["它","！"],  // 坐标一旦打出就隐藏
    glitchRanges: [{start: 8, end: 11}],
    typeSpeed: 60,
    glitchEnabled: true,           // 启用乱码
    glitchChars: "▓▒░█▀▄▌▐",       // 乱码字符池
    glitchDuration: 3
    // onComplete: function(p) {
    //     console.log(p.username + " 动画完成")
    // }
})
})

player.level.server.schedule(32000,()=>{
    typewriter(player, "要...坚持.不.住了。", {
    cursorChar: "_",
    colors: ["#FF0000", "#AA0000", "#FF0000"],
    breatheTime: 1000,
    // permanentGlitchStrings: ["."],  // 坐标一旦打出就隐藏
    typeSpeed: 60,
    glitchRanges: [{start: 1, end: 4},{start: 7, end: 8},{start: 9, end: 10}],
    glitchEnabled: true,           // 启用乱码
    glitchChars: "▓▒░█▀▄▌▐",       // 乱码字符池
    glitchDuration: 3
    // onComplete: function(p) {
    //     console.log(p.username + " 动画完成")
    // }
})
})

player.level.server.schedule(36000,()=>{
    typewriter(player, "...已经.不.....。", {
    cursorChar: "_",
    colors: ["#FF0000", "#AA0000", "#FF0000"],
    breatheTime: 1000,
    // permanentGlitchStrings: ["."],  // 坐标一旦打出就隐藏
     glitchRanges: [{start: 0, end: 3},{start: 5, end: 6},{start: 7, end: 12}],
    typeSpeed: 60,
    glitchEnabled: true,           // 启用乱码
    glitchChars: "▓▒░█▀▄▌▐",       // 乱码字符池
    glitchDuration: 3
    // onComplete: function(p) {
    //     console.log(p.username + " 动画完成")
    // }
})
})

player.level.server.schedule(40000,()=>{
    typewriter(player, "..来.不.及.了..。", {
    cursorChar: "_",
    colors: ["#FF0000", "#AA0000", "#FF0000"],
    breatheTime: 1000,
    permanentGlitchStrings: [".",".",".",".",".","."],  // 坐标一旦打出就隐藏
    typeSpeed: 60,
    glitchEnabled: true,           // 启用乱码
    glitchChars: "▓▒░█▀▄▌▐",       // 乱码字符池
    glitchDuration: 3
})
})


// 配置多个错误时间段
var errorPhases = [
    { start: 30000, end: 30100, item: "rain:error_item" },
    { start: 31000, end: 31100, item: "rain:error_item" },
    { start: 32000, end: 32100, item: "rain:error_item" }
]

// 存储每个阶段的保存状态
var savedItemsList = []
var isSavedList = []
var hasRestoredList = []
for (var e = 0; e < errorPhases.length; e++) {
    savedItemsList.push(null)
    isSavedList.push(false)
    hasRestoredList.push(false)
}

// ========== 修复版 ==========
function ErrorEvent(index) {
    // 基准时间偏移
    const baseTime = 24000
    
    // 检测退出（在调度前检查）
    if (player.persistentData.getBoolean("EventQuite")) {
        player.persistentData.putBoolean("EventQuite", false)
        // 恢复所有未恢复的物品
        for (var e = 0; e < errorPhases.length; e++) {
            if (savedItemsList[e] != null && !hasRestoredList[e]) {
                var inv = player.inventory
                for (var n = 0; n < 9; n++) {
                    inv.setItem(n, savedItemsList[e][n])
                }
                hasRestoredList[e] = true
            }
        }
        return
    }
    
    // 计算当前绝对时间（用于判断阶段）
    var currentTime = index * 100 + baseTime
    
    // 执行当前逻辑（固定延迟100ms后执行）
    server.schedule(100, function() {
        var inv = player.inventory
        
        // 再次检查退出
        if (player.persistentData.getBoolean("EventQuite")) {
            player.persistentData.putBoolean("EventQuite", false)
            return
        }
        
        // 检查当前是否在任一错误阶段
        var inErrorPhase = false
        var currentPhaseIndex = -1
        
        for (var e = 0; e < errorPhases.length; e++) {
            var phase = errorPhases[e]
            // 注意：这里用绝对时间比较，phase.start 是相对 24000 的偏移
            if (currentTime >= phase.start && currentTime < phase.end) {
                inErrorPhase = true
                currentPhaseIndex = e
                break
            }
        }
        
        // 在进入错误阶段前保存物品
        for (var e = 0; e < errorPhases.length; e++) {
            var phase = errorPhases[e]
            if (currentTime < phase.start && !isSavedList[e]) {
                savedItemsList[e] = []
                for (var n = 0; n < 9; n++) {
                    savedItemsList[e].push(inv.getItem(n).copy())
                }
                isSavedList[e] = true
            }
        }
        
        // 如果在错误阶段，显示错误物品
        if (inErrorPhase && currentPhaseIndex !== -1) {
            var phase = errorPhases[currentPhaseIndex]
            for (var n = 0; n < 9; n++) {
                inv.setItem(n, phase.item)
            }
            // level.server.runCommandSilent(`playsound rain:zizi player ${name} ${Math.floor(player.x)} ${Math.floor(player.y)} ${Math.floor(player.z)} 3 1`)
            // 错误阶段不执行打乱，但继续调度
        } else {
            // 不在错误阶段，检查是否需要恢复
            var justRestored = false
            for (var e = 0; e < errorPhases.length; e++) {
                var phase = errorPhases[e]
                // 当前时间刚好超过该阶段结束时间，且尚未恢复
                if (currentTime >= phase.end && !hasRestoredList[e] && savedItemsList[e] != null) {
                    for (var n = 0; n < 9; n++) {
                        inv.setItem(n, savedItemsList[e][n])
                    }
                    hasRestoredList[e] = true
                    justRestored = true
                    break  // 一次只恢复一个阶段
                }
            }
            
            // 如果没有恢复操作，执行打乱
            if (!justRestored) {
                var slot = Math.floor(Math.random() * 9)
                player.setSelectedSlot(slot)
                // level.server.runCommandSilent(`stopsound ${name} player rain:zizi`)
                
                var items = []
                for (var n = 0; n < 9; n++) {
                    items.push(inv.getItem(n).copy())
                }
                
                for (var n = items.length - 1; n > 0; n--) {
                    var m = Math.floor(Math.random() * (n + 1))
                    var temp = items[n]
                    items[n] = items[m]
                    items[m] = temp
                }
                
                for (var j = 0; j < 9; j++) {
                    inv.setItem(j, items[j])
                }
            }
        }
        
        // 递归调用（固定间隔100ms）
        ErrorEvent(index + 1)
    })
}

// ========== 启动 ==========
// 在 BlockEvents.rightClicked 中调用
server.schedule(24000, () => {
    ErrorEvent(0)
    level.server.runCommandSilent(`playsound rain:gaige player ${name} ${Math.floor(player.x)} ${Math.floor(player.y)} ${Math.floor(player.z)} 1 1`)
})
// // ErrorEvent(0)
// for (var i = 0; i < 420; i++) {
//     (function(index) {
//         player.level.server.schedule(index * 100 + 24000, function() {
//             var currentTime = index * 100 + 24000
//             var inv = player.inventory
            
//             // 检查当前是否在任一错误阶段
//             var inErrorPhase = false
//             var currentPhaseIndex = -1
            
//             for (var e = 0; e < errorPhases.length; e++) {
//                 var phase = errorPhases[e]
//                 if (currentTime >= phase.start && currentTime < phase.end) {
//                     inErrorPhase = true
//                     currentPhaseIndex = e
//                     break
//                 }
//             }
            
//             // 在进入错误阶段前保存物品（每个阶段只保存一次）
//             for (var e = 0; e < errorPhases.length; e++) {
//                 var phase = errorPhases[e]
//                 if (currentTime < phase.start && !isSavedList[e]) {
//                     // 保存当前快捷栏状态
//                     savedItemsList[e] = []
//                     for (var n = 0; n < 9; n++) {
//                         savedItemsList[e].push(inv.getItem(n).copy())
//                     }
//                     isSavedList[e] = true
//                 }
//             }
            
//             // 如果在错误阶段，显示错误物品
//             if (inErrorPhase && currentPhaseIndex !== -1) {
//                 var phase = errorPhases[currentPhaseIndex]
//                 for (var n = 0; n < 9; n++) {
//                     inv.setItem(n, phase.item)
//                 }
//                 level.server.runCommandSilent(`playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`)
//                 return
//             }
            
//             // 检查是否需要恢复（错误阶段结束后的第一次执行）
//             for (var e = 0; e < errorPhases.length; e++) {
//                 var phase = errorPhases[e]
//                 // 当前时间刚好超过该阶段结束时间，且尚未恢复
//                 if (currentTime >= phase.end && !hasRestoredList[e] && savedItemsList[e] != null) {
//                     // 恢复该阶段保存的物品
//                     for (var n = 0; n < 9; n++) {
//                         inv.setItem(n, savedItemsList[e][n])
//                     }
//                     hasRestoredList[e] = true
//                     // 恢复后立即返回，不打乱（下一tick再打乱）
//                     return
//                 }
//             }
            
//             // 正常打乱
//             var slot = Math.floor(Math.random() * 9)
//             player.setSelectedSlot(slot)
//             level.server.runCommandSilent(`stopsound ${name} player rain:zizi`)
            
//             var items = []
//             for (var n = 0; n < 9; n++) {
//                 items.push(inv.getItem(n).copy())
//             }
            
//             for (var n = items.length - 1; n > 0; n--) {
//                 var m = Math.floor(Math.random() * (n + 1))
//                 var temp = items[n]
//                 items[n] = items[m]
//                 items[m] = temp
//             }
            
//             for (var j = 0; j < 9; j++) {
//                 inv.setItem(j, items[j])
//             }
//         })
//     })(i)
// }
// 屏幕变红
//   server.runCommandSilent(`effect give ${player.username} minecraft:blindness 2 0`)
//   server.runCommandSilent(`effect give ${player.username} minecraft:nausea 5 2`)

// 结束

// 使用链式播放
// showSequence(player, ["第一幕", "第二幕", "第三幕"])

// 结束
  //结束
//   return

    //执行事件
    // if(player.mainHandItem.id == 'minecraft:diamond' && !player.persistentData.getBoolean("test1")){
        // if (event.player.persistentData.getBoolean(item.id)) return
    //  event.player.persistentData.putBoolean(item.id, true)
        player.persistentData.putBoolean("test1", true)
        player.level.server.schedule(42000,()=>{
            // player.tell("你好§kabcdefg 你好")
            level.server.runCommandSilent('/tellraw @a {"text":"仪式：§kabcdefg","obfuscated":false,"color":"red"}')
            server.runCommandSilent(`effect give ${name} minecraft:blindness 2 0`)
        server.runCommandSilent(`effect give ${name} minecraft:nausea 5 2`)
        })

         player.level.server.schedule(46000,()=>{
            level.server.runCommandSilent('/tellraw @a {"text":"危险等级：§kabc","obfuscated":false,"color":"red"}')
        })

        player.level.server.schedule(50000,()=>{
                typewriter(player, "我已经无法§kabcdefg", {
                typeSpeed: 5000,
                cursorChar: "_",
                colors: ["#FF0000", "#AA0000", "#FF0000"],
                breatheTime: 1000,
                // onComplete: function(p) {
                //     console.log(p.username + " 动画完成")
                // }
            })
        })

         player.level.server.schedule(50000,()=>{
                typewriter(player, "1祝2你3好4运5§kabcdefg", {
                typeSpeed: 5000,
                cursorChar: "_",
                colors: ["#FF0000", "#AA0000", "#FF0000"],
                breatheTime: 1000,
                permanentGlitchStrings: ["1","2","3","4","5"],
                // onComplete: function(p) {
                //     console.log(p.username + " 动画完成")
                // }
            })
        })

        player.level.server.schedule(54000,()=>{
                typewriter(player, "你不需要知道我是谁§kabcdefg", {
                typeSpeed: 5000,
                cursorChar: "_",
                colors: ["#FF0000", "#AA0000", "#FF0000"],
                breatheTime: 1000,
                permanentGlitchStrings: ["道"],
                 glitchEnabled: true,
                glitchChance: 1,
                glitchChars: "▓▒░█",
                // onComplete: function(p) {
                //     console.log(p.username + " 动画完成")
                // }
            })
        })

         player.level.server.schedule(58000,()=>{
                typewriter(player, "1我2只3能4跟5你6说这么多了§kabcdefg", {
                typeSpeed: 5000,
                cursorChar: "_",
                colors: ["#FF0000", "#AA0000", "#FF0000"],
                breatheTime: 1000,
                permanentGlitchStrings:["1","2","3","4","5","6"],
                 glitchEnabled: true,
                glitchChance: 1,
                glitchChars: "▓▒░█",
                // onComplete: function(p) {
                //     console.log(p.username + " 动画完成")
                // }
            })
        })

        player.level.server.schedule(62000,()=>{
                typewriter(player, "§kabcdefgjksdasdasdjksdijasdlkasdlasjd", {
                typeSpeed: 500,
                cursorChar: "_",
                colors: ["#FF0000", "#AA0000", "#FF0000"],
                breatheTime: 1000,
                 glitchEnabled: true,
                glitchChance: 1,
                glitchChars: "▓▒░█",
                // onComplete: function(p) {
                //     console.log(p.username + " 动画完成")
                // }
            })
        })

         player.level.server.schedule(66000,()=>{
                player.teleportTo(block.pos.x +1.5,block.pos.y,block.pos.z+0.5)
                level.server.runCommandSilent(`summon minecraft:lightning_bolt ${block.pos.x} ${block.pos.y} ${block.pos.z}`)
                level.server.runCommandSilent(`execute as ${name} at @s run particle minecraft:end_rod ^ ^ ^ 5 5 5 0.2 100000`)
        })
        

        server.schedule(66000,()=>{
            level.server.runCommandSilent(`playsound rain:dark player ${name} ${Math.floor(player.x)} ${Math.floor(player.y)} ${Math.floor(player.z)} 1 1 1`)
        })
        for (let i = 1; i <= 20; i++) {
    // 使用闭包保存当前的 i 值
    (function(index) {
        server.schedule( 66000 + index * 50, () => {
 
            const targetX = block.pos.x + 1.5
            const targetY = block.pos.y + index * 0.05 -0.5
            const targetZ = block.pos.z + 0.5
            

            if (!player || !player.isAlive()) return
            
            player.teleportTo(targetX, targetY, targetZ)
        })
    })(i)
}

 for (let i = 1; i <= 20; i++) {
    // 使用闭包保存当前的 i 值
    (function(index) {
        server.schedule( 67000 + index * 50, () => {
 
            const targetX = block.pos.x + 1.5 + index * 0.05//2.5
            const targetY = block.pos.y + 0.5
            const targetZ = block.pos.z + 0.5
            

            if (!player || !player.isAlive()) return
            
            player.teleportTo(targetX, targetY, targetZ)
        })
    })(i)
}

 for (let i = 1; i <= 40; i++) {
    // 使用闭包保存当前的 i 值
    (function(index) {
        server.schedule( 68000 + index * 50, () => {
 
            const targetX = block.pos.x + 2.5 
            const targetY = block.pos.y + 0.5 + index * 0.05//2.5
            const targetZ = block.pos.z + 0.5
            

            if (!player || !player.isAlive()) return
            
            player.teleportTo(targetX, targetY, targetZ)
        })
    })(i)
}

 for (let i = 1; i <= 20; i++) {
    // 使用闭包保存当前的 i 值
    (function(index) {
        server.schedule( 70000 + index * 50, () => {
 
            const targetX = block.pos.x + 2.5 + index * 0.05 //3.5
            const targetY = block.pos.y + 2.5 
            const targetZ = block.pos.z + 0.5
            

            if (!player || !player.isAlive()) return
            
            player.teleportTo(targetX, targetY, targetZ)
        })
    })(i)
}

for (let i = 1; i <= 200; i++) {
    // 使用闭包保存当前的 i 值
    (function(index) {
        server.schedule( 71000 + index * 50, () => {
 
            const targetX = block.pos.x + 3.5  
            const targetY = block.pos.y + 2.5 + index * 0.05//12.5
            const targetZ = block.pos.z + 0.5
            

            if (!player || !player.isAlive()) return
            
            player.teleportTo(targetX, targetY, targetZ)
        })
    })(i)
}

// //悬停
// for(let i = 1;i<1000;i++){
//     (function(index) {
//         server.schedule( 81000 + index * 50, () => {
 
//             const targetX = block.pos.x + 3.5  
//             const targetY = block.pos.y + 12.5
//             const targetZ = block.pos.z + 0.5
            

//             if (!player || !player.isAlive()) return
            
//             player.teleportTo(targetX, targetY, targetZ)
//         })
//     })(i)
// }
//悬停
function HoverIng(){
     // 检测退出（在调度前检查）
    if (player.persistentData.getBoolean("EventQuite")) {
        player.persistentData.putBoolean("EventQuite", false)
        return
    }
    server.schedule(50,()=>{
        const targetX = block.pos.x + 3.5  
            const targetY = block.pos.y + 12.5
            const targetZ = block.pos.z + 0.5
            

            if (!player || !player.isAlive()) return
            
            player.teleportTo(targetX, targetY, targetZ)
            return HoverIng()
    })
}
server.schedule(81000,()=>{
    HoverIng()
})
//2000pos数组
const AP1 = [
   // 数字2（最左边，z=10~7）
    [-13, 8, 10], [-13, 9, 10], [-13, 10, 10], [-13, 11, 10], [-13, 12, 10], [-13, 13, 10], [-13, 14, 10],
    [-13, 8, 10], [-13, 8, 9], [-13, 8, 8], [-13, 8, 7],
    [-13, 14, 10], [-13, 14, 9], [-13, 14, 8], [-13, 14, 7],
    [-13, 14, 7], [-13, 15, 7], [-13, 16, 7], [-13, 17, 7], [-13, 18, 7],
    [-13, 18, 7], [-13, 18, 8], [-13, 18, 9], [-13, 18, 10],
    // 数字0（第1个，z=5~1）
    [-13, 8, 5], [-13, 9, 5], [-13, 10, 5], [-13, 11, 5], [-13, 12, 5], [-13, 13, 5], [-13, 14, 5], [-13, 15, 5], [-13, 16, 5], [-13, 17, 5], [-13, 18, 5],
    [-13, 8, 5], [-13, 8, 4], [-13, 8, 3], [-13, 8, 2], [-13, 8, 1],
    [-13, 18, 5], [-13, 18, 4], [-13, 18, 3], [-13, 18, 2], [-13, 18, 1],
    [-13, 8, 1], [-13, 9, 1], [-13, 10, 1], [-13, 11, 1], [-13, 12, 1], [-13, 13, 1], [-13, 14, 1], [-13, 15, 1], [-13, 16, 1], [-13, 17, 1], [-13, 18, 1],
    // 数字0（第2个，z=-1~-5）
    [-13, 8, -1], [-13, 9, -1], [-13, 10, -1], [-13, 11, -1], [-13, 12, -1], [-13, 13, -1], [-13, 14, -1], [-13, 15, -1], [-13, 16, -1], [-13, 17, -1], [-13, 18, -1],
    [-13, 8, -1], [-13, 8, -2], [-13, 8, -3], [-13, 8, -4], [-13, 8, -5],
    [-13, 18, -1], [-13, 18, -2], [-13, 18, -3], [-13, 18, -4], [-13, 18, -5],
    [-13, 8, -5], [-13, 9, -5], [-13, 10, -5], [-13, 11, -5], [-13, 12, -5], [-13, 13, -5], [-13, 14, -5], [-13, 15, -5], [-13, 16, -5], [-13, 17, -5], [-13, 18, -5],
    // 数字0（第3个，z=-7~-11）
    [-13, 8, -7], [-13, 9, -7], [-13, 10, -7], [-13, 11, -7], [-13, 12, -7], [-13, 13, -7], [-13, 14, -7], [-13, 15, -7], [-13, 16, -7], [-13, 17, -7], [-13, 18, -7],
    [-13, 8, -7], [-13, 8, -8], [-13, 8, -9], [-13, 8, -10], [-13, 8, -11],
    [-13, 18, -7], [-13, 18, -8], [-13, 18, -9], [-13, 18, -10], [-13, 18, -11],
    [-13, 8, -11], [-13, 9, -11], [-13, 10, -11], [-13, 11, -11], [-13, 12, -11], [-13, 13, -11], [-13, 14, -11], [-13, 15, -11], [-13, 16, -11], [-13, 17, -11], [-13, 18, -11]
]

for(let i = 0;i<AP1.length;i++){
    (function(index) {
        server.schedule(81000 + index * 50, () => {
            level.server.runCommandSilent(`/playsound minecraft:block.amethyst_block.break player ${name} ~ ~ ~ 1 1 1`)
            level.server.runCommandSilent(`fill ${block.pos.x + AP1[index][0] } ${block.pos.y + AP1[index][1] } ${block.pos.z + AP1[index][2] } ${block.pos.x + AP1[index][0] } ${block.pos.y + AP1[index][1] } ${block.pos.z + AP1[index][2] } minecraft:blue_ice`)
        })
    })(i)
       
}

server.schedule(87200,()=>{
    for(let i = 0;i<=AP1.length;i++){
        level.server.runCommandSilent(`fill ${block.pos.x + AP1[i][0] } ${block.pos.y + AP1[i][1] } ${block.pos.z + AP1[i][2] } ${block.pos.x + AP1[i][0] } ${block.pos.y + AP1[i][1] } ${block.pos.z + AP1[i][2] } rain:error_block`)
    }
})
server.schedule(88200,()=>{
    for(let i = 0;i<=AP1.length;i++){
        level.server.runCommandSilent(`fill ${block.pos.x + AP1[i][0] } ${block.pos.y + AP1[i][1] } ${block.pos.z + AP1[i][2] } ${block.pos.x + AP1[i][0] } ${block.pos.y + AP1[i][1] } ${block.pos.z + AP1[i][2] } minecraft:diamond_block`)
    }
})
server.schedule(88700,()=>{
    for(let i = 0;i<=AP1.length;i++){
        level.server.runCommandSilent(`fill ${block.pos.x + AP1[i][0] } ${block.pos.y + AP1[i][1] } ${block.pos.z + AP1[i][2] } ${block.pos.x + AP1[i][0] } ${block.pos.y + AP1[i][1] } ${block.pos.z + AP1[i][2] } rain:error_block`)
    }
})
server.schedule(89000,()=>{
    for(let i = 0;i<=AP1.length;i++){
        level.server.runCommandSilent(`fill ${block.pos.x + AP1[i][0] } ${block.pos.y + AP1[i][1] } ${block.pos.z + AP1[i][2] } ${block.pos.x + AP1[i][0] } ${block.pos.y + AP1[i][1] } ${block.pos.z + AP1[i][2] } minecraft:command_block`)
    }
})
server.schedule(89100,()=>{
    for(let i = 0;i<=AP1.length;i++){
        level.server.runCommandSilent(`fill ${block.pos.x + AP1[i][0] } ${block.pos.y + AP1[i][1] } ${block.pos.z + AP1[i][2] } ${block.pos.x + AP1[i][0] } ${block.pos.y + AP1[i][1] } ${block.pos.z + AP1[i][2] } rain:error_block`)
    }
})
server.schedule(89200,()=>{
    for(let i = 0;i<=AP1.length;i++){
        level.server.runCommandSilent(`fill ${block.pos.x + AP1[i][0] } ${block.pos.y + AP1[i][1] } ${block.pos.z + AP1[i][2] } ${block.pos.x + AP1[i][0] } ${block.pos.y + AP1[i][1] } ${block.pos.z + AP1[i][2] } minecraft:birch_planks`)
    }
})
server.schedule(89300,()=>{
    for(let i = 0;i<=AP1.length;i++){
        level.server.runCommandSilent(`fill ${block.pos.x + AP1[i][0] } ${block.pos.y + AP1[i][1] } ${block.pos.z + AP1[i][2] } ${block.pos.x + AP1[i][0] } ${block.pos.y + AP1[i][1] } ${block.pos.z + AP1[i][2] } rain:error_block`)
    }
})
server.schedule(89400,()=>{
    for(let i = 0;i<=AP1.length;i++){
        level.server.runCommandSilent(`/particle minecraft:explosion_emitter ${block.pos.x + AP1[i][0] } ${block.pos.y + AP1[i][1] } ${block.pos.z + AP1[i][2] } 0 0 0 0 1 normal`)
        level.server.runCommandSilent(`fill ${block.pos.x + AP1[i][0] } ${block.pos.y + AP1[i][1] } ${block.pos.z + AP1[i][2] } ${block.pos.x + AP1[i][0] } ${block.pos.y + AP1[i][1] } ${block.pos.z + AP1[i][2] } minecraft:air`)
    }
})

// var giantX = block.pos.x - 13;
// var giantY = block.pos.y + 6;
// var giantZ = block.pos.z;

// // 计算朝向玩家的 Yaw
// var dx = player.x -  block.pos.x - 13;
// var dz = player.z - block.pos.z;
// var yaw = Math.atan2(dx, dz) * (180 / Math.PI);

// 召唤（pitch 设为 0）
// level.server.runCommandSilent('summon minecraft:giant ' + ( block.pos.x - 13) + ' ' + ( block.pos.y + 6) + ' ' + (block.pos.z) + ' {Tags:["bezier_follower"],NoGravity:1b,NoAI:1b,Silent:1b,Invulnerable:1b,Glowing:1b,Rotation:[' + yaw.toFixed(1) + 'f,0.0f]}');

server.schedule(90400,()=>{
    level.server.runCommandSilent('summon minecraft:giant ' + ( block.pos.x - 13) + ' ' + ( block.pos.y + 6) + ' ' + (block.pos.z) + ' {Tags:["bezier_follower"],NoGravity:1b,NoAI:1b,Silent:1b,Invulnerable:1b,Rotation:[-90f,0.0f]}');
})
// server.schedule(91400,()=>{
//     for(let i = 1;i<=10;i++){
//         level.server.runCommandSilent(`fill ${block.pos.x -13 } ${block.pos.y + 18 } ${block.pos.z + AP1[i][2] } ${block.pos.x + AP1[i][0] } ${block.pos.y + AP1[i][1] } ${block.pos.z + AP1[i][2] } minecraft:repeating_command_block`)
//     }
// })
for(let i = 1;i<10;i++){
    (function(index) {
        server.schedule( 91400 + index * 100, () => {
        level.server.runCommandSilent(`fill ${block.pos.x -13 } ${block.pos.y + 20 } ${block.pos.z -5 + index } ${block.pos.x -13 } ${block.pos.y + 20 } ${block.pos.z -5 + index } minecraft:repeating_command_block`)
        })
    })(i)
}

const num_10 = [
    [-13, 7, -8], [-13, 7, -9], [-13, 7, -10], [-13, 7, -11], [-13, 7, -12], [-13, 7, -13], [-13, 7, -14],
    [-13, 9, -10], [-13, 10, -10], [-13, 11, -10], [-13, 12, -10], [-13, 13, -10], [-13, 14, -10], [-13, 15, -10], [-13, 16, -10], [-13, 17, -10], [-13, 18, -10],
    [-13,18,-9],[-13,17,-8],[-13,16,-7],
    [-13, 7, -16], [-13, 7, -17], [-13, 7, -18], [-13, 7, -19], [-13, 7, -20], [-13, 7, -21],
    [-13, 8, -16], [-13, 9, -16], [-13, 10, -16], [-13, 11, -16], [-13, 12, -16], [-13, 13, -16], [-13, 14, -16], [-13, 15, -16], [-13, 16, -16], [-13, 17, -16], [-13, 18, -16],
    [-13, 18, -16], [-13, 18, -17], [-13, 18, -18], [-13, 18, -19], [-13, 18, -20], [-13, 18, -21],
    [-13, 8, -21], [-13, 9, -21], [-13, 10, -21], [-13, 11, -21], [-13, 12, -21], [-13, 13, -21], [-13, 14, -21], [-13, 15, -21], [-13, 16, -21], [-13, 17, -21], [-13, 18, -21]

]
const num_9 = [
    [-13, 8, -10], [-13, 9, -10], [-13, 10, -10], [-13, 14, -10], [-13, 15, -10], [-13, 16, -10], [-13, 17, -10], [-13, 18, -10], [-13, 19, -10],
    [-13, 8, -10], [-13, 8, -11], [-13, 8, -12], [-13, 8, -13], [-13, 8, -14], [-13, 8, -15],
    [-13, 14, -10], [-13, 14, -11], [-13, 14, -12], [-13, 14, -13], [-13, 14, -14], [-13, 14, -15],
    [-13, 19, -10], [-13, 19, -11], [-13, 19, -12], [-13, 19, -13], [-13, 19, -14], [-13, 19, -15],
    [-13, 8, -15], [-13, 9, -15], [-13, 10, -15], [-13, 11, -15], [-13, 12, -15], [-13, 13, -15], [-13, 14, -15], [-13, 15, -15], [-13, 16, -15], [-13, 17, -15], [-13, 18, -15], [-13, 19, -15]

]
const num_8 = [
    [-13, 8, -10], [-13, 9, -10], [-13, 10, -10],[-13, 11, -10],[-13, 12, -10],[-13, 13, -10], [-13, 14, -10], [-13, 15, -10], [-13, 16, -10], [-13, 17, -10], [-13, 18, -10], [-13, 19, -10],
    [-13, 8, -10], [-13, 8, -11], [-13, 8, -12], [-13, 8, -13], [-13, 8, -14], [-13, 8, -15],
    [-13, 14, -10], [-13, 14, -11], [-13, 14, -12], [-13, 14, -13], [-13, 14, -14], [-13, 14, -15],
    [-13, 19, -10], [-13, 19, -11], [-13, 19, -12], [-13, 19, -13], [-13, 19, -14], [-13, 19, -15],
    [-13, 8, -15], [-13, 9, -15], [-13, 10, -15], [-13, 11, -15], [-13, 12, -15], [-13, 13, -15], [-13, 14, -15], [-13, 15, -15], [-13, 16, -15], [-13, 17, -15], [-13, 18, -15], [-13, 19, -15]

]
const num_7 = [
    [-13, 19, -10], [-13, 19, -11], [-13, 19, -12], [-13, 19, -13], [-13, 19, -14], [-13, 19, -15],
    [-13, 8, -15], [-13, 9, -15], [-13, 10, -15], [-13, 11, -15], [-13, 12, -15], [-13, 13, -15], [-13, 14, -15], [-13, 15, -15], [-13, 16, -15], [-13, 17, -15], [-13, 18, -15], [-13, 19, -15]
]
const num_6 = [
    [-13, 8, -10], [-13, 9, -10], [-13, 10, -10],[-13, 11, -10],[-13, 12, -10],[-13, 13, -10], [-13, 14, -10], [-13, 15, -10], [-13, 16, -10], [-13, 17, -10], [-13, 18, -10], [-13, 19, -10],
    [-13, 8, -10], [-13, 8, -11], [-13, 8, -12], [-13, 8, -13], [-13, 8, -14], [-13, 8, -15],
    [-13, 14, -10], [-13, 14, -11], [-13, 14, -12], [-13, 14, -13], [-13, 14, -14], [-13, 14, -15],
    [-13, 19, -10], [-13, 19, -11], [-13, 19, -12], [-13, 19, -13], [-13, 19, -14], [-13, 19, -15],
    [-13, 8, -15], [-13, 9, -15], [-13, 10, -15], [-13, 11, -15], [-13, 12, -15], [-13, 13, -15], [-13, 14, -15]

]
const num_5 = [
     [-13, 14, -10], [-13, 15, -10], [-13, 16, -10], [-13, 17, -10], [-13, 18, -10], [-13, 19, -10],
    [-13, 8, -10], [-13, 8, -11], [-13, 8, -12], [-13, 8, -13], [-13, 8, -14], [-13, 8, -15],
    [-13, 14, -10], [-13, 14, -11], [-13, 14, -12], [-13, 14, -13], [-13, 14, -14], [-13, 14, -15],
    [-13, 19, -10], [-13, 19, -11], [-13, 19, -12], [-13, 19, -13], [-13, 19, -14], [-13, 19, -15],
    [-13, 8, -15], [-13, 9, -15], [-13, 10, -15], [-13, 11, -15], [-13, 12, -15], [-13, 13, -15], [-13, 14, -15],

]
const num_4 = [
    [-13, 14, -10], [-13, 15, -10], [-13, 16, -10], [-13, 17, -10], [-13, 18, -10], [-13, 19, -10],
    [-13, 14, -10], [-13, 14, -11], [-13, 14, -12], [-13, 14, -13], [-13, 14, -14], [-13, 14, -15],
    [-13, 8, -15], [-13, 9, -15], [-13, 10, -15], [-13, 11, -15], [-13, 12, -15], [-13, 13, -15], [-13, 14, -15], [-13, 15, -15], [-13, 16, -15], [-13, 17, -15], [-13, 18, -15], [-13, 19, -15]

]
const num_3 = [
    [-13, 8, -10], [-13, 8, -11], [-13, 8, -12], [-13, 8, -13], [-13, 8, -14], [-13, 8, -15],
    [-13, 14, -10], [-13, 14, -11], [-13, 14, -12], [-13, 14, -13], [-13, 14, -14], [-13, 14, -15],
    [-13, 19, -10], [-13, 19, -11], [-13, 19, -12], [-13, 19, -13], [-13, 19, -14], [-13, 19, -15],
    [-13, 8, -15], [-13, 9, -15], [-13, 10, -15], [-13, 11, -15], [-13, 12, -15], [-13, 13, -15], [-13, 14, -15], [-13, 15, -15], [-13, 16, -15], [-13, 17, -15], [-13, 18, -15], [-13, 19, -15]

]
const num_2 = [
    [-13, 8, -10], [-13, 9, -10], [-13, 10, -10],[-13, 11, -10],[-13, 12, -10],[-13, 13, -10], [-13, 14, -10],
    [-13, 8, -10], [-13, 8, -11], [-13, 8, -12], [-13, 8, -13], [-13, 8, -14], [-13, 8, -15],
    [-13, 14, -10], [-13, 14, -11], [-13, 14, -12], [-13, 14, -13], [-13, 14, -14], [-13, 14, -15],
    [-13, 19, -10], [-13, 19, -11], [-13, 19, -12], [-13, 19, -13], [-13, 19, -14], [-13, 19, -15],
    [-13, 14, -15], [-13, 15, -15], [-13, 16, -15], [-13, 17, -15], [-13, 18, -15], [-13, 19, -15]

]
const num_1 = [
    [-13, 8, -15], [-13, 9, -15], [-13, 10, -15], [-13, 11, -15], [-13, 12, -15], [-13, 13, -15], [-13, 14, -15], [-13, 15, -15], [-13, 16, -15], [-13, 17, -15], [-13, 18, -15], [-13, 19, -15]
]

const num = [
    num_1,
    num_2,
    num_3,
    num_4,
    num_5,
    num_6,
    num_7,
    num_8,
    num_9,
    num_10
]

// server.schedule(94400, () => {
//                 for(let j = 0;j< num[9].length;j++){
//                 level.server.runCommandSilent(`fill ${block.pos.x + num[9][j][0] } ${block.pos.y + num[9][j][1] +1} ${block.pos.z + num[9][j][2] } ${block.pos.x + num[9][j][0] } ${block.pos.y + num[9][j][1] +1} ${block.pos.z + num[9][j][2] } minecraft:air`)
//             }
//         })

// for(let i = 1;i<=10;i++){
//     (function(index) {
//         if(index == 1){
//             server.schedule(92400 + index * 1000, () => {
//             for(let j = 0;j< num[10-index].length;j++){
//                 level.server.runCommandSilent(`fill ${block.pos.x + num[10-index][j][0] } ${block.pos.y + num[10-index][j][1] + 1 } ${block.pos.z + num[10-index][j][2] } ${block.pos.x + num[10-index][j][0] } ${block.pos.y + num[10-index][j][1] +1 } ${block.pos.z + num[10-index][j][2] } minecraft:blue_ice`)
//             }
//         })
//         }else{
//             server.schedule(92400 + index * 1000, () => {
//                 for(let j = 0;j< num[10-index+1].length;j++){
//                 level.server.runCommandSilent(`fill ${block.pos.x + num[10-index+1][j][0] } ${block.pos.y + num[10-index+1][j][1] } ${block.pos.z + num[10-index+1][j][2] } ${block.pos.x + num[10-index+1][j][0] } ${block.pos.y + num[10-index+1][j][1] } ${block.pos.z + num[10-index+1][j][2] } minecraft:air`)
//             }
//             for(let j = 0;j< num[10-index].length;j++){
//                 level.server.runCommandSilent(`fill ${block.pos.x + num[10-index][j][0] } ${block.pos.y + num[10-index][j][1] } ${block.pos.z + num[10-index][j][2] } ${block.pos.x + num[10-index][j][0] } ${block.pos.y + num[10-index][j][1] } ${block.pos.z + num[10-index][j][2] } minecraft:blue_ice`)
//             }
//         })
//         }
//     })(i)
       
// }


//摩斯密码函数
function mosimm(number,timeline){
    if(number == 1){
        server.schedule(timeline + 1000,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
         server.schedule(timeline + 1100,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1200,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1500,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1600,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1900,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 2000,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 2300,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 2400,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 2700,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
    }
    if(number == 2){
        server.schedule(timeline + 1000,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
         server.schedule(timeline + 1100,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1200,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1300,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1400,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1700,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1800,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 2100,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 2200,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 2500,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
    }
    if(number == 3){
         server.schedule(timeline + 1000,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
         server.schedule(timeline + 1100,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1200,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1300,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1400,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1500,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1600,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1900,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 2000,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 2300,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
    }
    if(number == 4){
        server.schedule(timeline + 1000,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
         server.schedule(timeline + 1100,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1200,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1300,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1400,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1500,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1600,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1700,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1800,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 2100,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
    }
    if(number == 5){
        server.schedule(timeline + 1000,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
         server.schedule(timeline + 1100,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1200,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1300,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1400,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1500,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1600,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1700,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1800,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1900,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
    }
    if(number == 6){
        server.schedule(timeline + 1000,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
         server.schedule(timeline + 1300,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1400,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1500,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1600,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1700,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1800,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1900,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 2000,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 2100,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
    }
    if(number == 7){
        server.schedule(timeline + 1000,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
         server.schedule(timeline + 1300,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1400,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1700,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1800,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1900,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 2000,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 2100,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 2200,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 2300,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
    }
    if(number == 8){
        server.schedule(timeline + 1000,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
         server.schedule(timeline + 1300,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1400,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1700,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1800,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 2100,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 2200,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 2300,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 2400,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 2500,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
    }
    if(number == 9){
        server.schedule(timeline + 1000,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
         server.schedule(timeline + 1300,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1400,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 1700,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 1800,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 2100,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 2200,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 2500,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
        server.schedule(timeline + 2600,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:blue_ice`
                        )

        })
        server.schedule(timeline + 2700,()=>{
            level.server.runCommandSilent(
                            `fill ${block.pos.x -13} ${block.pos.y + 10 } ${block.pos.z + 5} ` +
                            `${block.pos.x -13} ${block.pos.y + 15} ${block.pos.z + 10} minecraft:air`
                        )

        })
    }
}

//摩斯密码声音函数
function mosimmSound(number,timeline){
    if(number == 1){
        server.schedule(timeline + 1000,()=>{
            level.server.runCommandSilent(
                            `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )
                        player.tell("111")

        })
         server.schedule(timeline + 1100,()=>{
            level.server.runCommandSilent(
                            `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1200,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1500,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1600,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1900,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 2000,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 2300,()=>{
            level.server.runCommandSilent(
                            `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 2400,()=>{
            level.server.runCommandSilent(
                            `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 2700,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
    }
    if(number == 2){
        server.schedule(timeline + 1000,()=>{
            level.server.runCommandSilent(
                            `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
         server.schedule(timeline + 1100,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1200,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1300,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1400,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1700,()=>{
            level.server.runCommandSilent(
                            `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1800,()=>{
            level.server.runCommandSilent(
                            `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 2100,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 2200,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 2500,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
    }
    if(number == 3){
         server.schedule(timeline + 1000,()=>{
            level.server.runCommandSilent(
                            `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
         server.schedule(timeline + 1100,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1200,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1300,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1400,()=>{
            level.server.runCommandSilent(
                            `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1500,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1600,()=>{
            level.server.runCommandSilent(
                            `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1900,()=>{
            level.server.runCommandSilent(
                            `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 2000,()=>{
            level.server.runCommandSilent(
                            `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 2300,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
    }
    if(number == 4){
        server.schedule(timeline + 1000,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
         server.schedule(timeline + 1100,()=>{
            level.server.runCommandSilent(
                            `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1200,()=>{
            level.server.runCommandSilent(
                            `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1300,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1400,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1500,()=>{
            level.server.runCommandSilent(
                            `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1600,()=>{
            level.server.runCommandSilent(
                            `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1700,()=>{
            level.server.runCommandSilent(
                            `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1800,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 2100,()=>{
            level.server.runCommandSilent(
                            `stopsound ${name} player rain:zizi`
                        )

        })
    }
    if(number == 5){
        server.schedule(timeline + 1000,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
         server.schedule(timeline + 1100,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1200,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1300,()=>{
            level.server.runCommandSilent(
                            `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1400,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1500,()=>{
            level.server.runCommandSilent(
                            `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1600,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1700,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1800,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1900,()=>{
            level.server.runCommandSilent(
                            `stopsound ${name} player rain:zizi`
                        )

        })
    }
    if(number == 6){
        server.schedule(timeline + 1000,()=>{
            level.server.runCommandSilent(
                            `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
         server.schedule(timeline + 1300,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1400,()=>{
            level.server.runCommandSilent(
                          `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1500,()=>{
            level.server.runCommandSilent(
                            `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1600,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1700,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1800,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1900,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 2000,()=>{
            level.server.runCommandSilent(
                          `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 2100,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
    }
    if(number == 7){
        server.schedule(timeline + 1000,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
         server.schedule(timeline + 1300,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1400,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1700,()=>{
            level.server.runCommandSilent(
                         `stopsound ${name} player rain:zizi`

                        )

        })
        server.schedule(timeline + 1800,()=>{
            level.server.runCommandSilent(
                          `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1900,()=>{
            level.server.runCommandSilent(
                            `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 2000,()=>{
            level.server.runCommandSilent(
                          `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 2100,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 2200,()=>{
            level.server.runCommandSilent(
                          `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 2300,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
    }
    if(number == 8){
        server.schedule(timeline + 1000,()=>{
            level.server.runCommandSilent(
                          `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
         server.schedule(timeline + 1300,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1400,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1700,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1800,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 2100,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 2200,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 2300,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 2400,()=>{
            level.server.runCommandSilent(
                            `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 2500,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
    }
    if(number == 9){
        server.schedule(timeline + 1000,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
         server.schedule(timeline + 1300,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1400,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 1700,()=>{
            level.server.runCommandSilent(
                           `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 1800,()=>{
            level.server.runCommandSilent(
                            `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 2100,()=>{
            level.server.runCommandSilent(
                            `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 2200,()=>{
            level.server.runCommandSilent(
                           `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 2500,()=>{
            level.server.runCommandSilent(
                            `stopsound ${name} player rain:zizi`
                        )

        })
        server.schedule(timeline + 2600,()=>{
            level.server.runCommandSilent(
                          `playsound rain:zizi player ${name} ~ ~ ~ 3 1 1`
                        )

        })
        server.schedule(timeline + 2700,()=>{
            level.server.runCommandSilent(
                            `stopsound ${name} player rain:zizi`
                        )

        })
    }
}
// player.tell("111")
let temp = 0
let time_temp = 0
let currentScheduleIds = []  // 记录当前调度的任务ID，用于取消

// ========== 修改后的 TimeLineLFunction（添加版本号检查）==========
function TimeLineLFunction(line, num, player, levelVersion) {
    temp = 0
    time_temp = line
    
    // 数字 10 的擦除（y+1 层）
    let id1 = server.schedule(line + 2000, () => {
        // 版本号检查：如果关卡已切换，跳过
        if (levelVersion !== undefined && currentLevelGlobal !== levelVersion) return
        if (player.persistentData.getBoolean("put_answer")) return
        
        for (let j = 0; j < num[9].length; j++) {
            level.server.runCommandSilent(
                `fill ${block.pos.x + num[9][j][0]} ${block.pos.y + num[9][j][1] + 1} ${block.pos.z + num[9][j][2]} ` +
                `${block.pos.x + num[9][j][0]} ${block.pos.y + num[9][j][1] + 1} ${block.pos.z + num[9][j][2]} minecraft:air`
            )
        }
    })
    currentScheduleIds.push(id1)

    for (let i = 1; i <= 10; i++) {
        (function(index) {
            let scheduleId = server.schedule(line + index * 1000, () => {
                // 版本号检查
                if (levelVersion !== undefined && currentLevelGlobal !== levelVersion) return
                // 检查是否已回答
                if (player.persistentData.getBoolean("put_answer")) return

                level.server.runCommandSilent(`playsound rain:water player ${name} ${Math.floor(player.x)} ${Math.floor(player.y)} ${Math.floor(player.z)} 1 1 1`)

                if (index == 1) {
                    // 画 10（y+1 层）
                    for (let j = 0; j < num[10 - index].length; j++) {
                        level.server.runCommandSilent(
                            `fill ${block.pos.x + num[10 - index][j][0]} ${block.pos.y + num[10 - index][j][1] + 1} ${block.pos.z + num[10 - index][j][2]} ` +
                            `${block.pos.x + num[10 - index][j][0]} ${block.pos.y + num[10 - index][j][1] + 1} ${block.pos.z + num[10 - index][j][2]} minecraft:blue_ice`
                        )
                    }
                } else {
                    // 擦除上一个
                    let yOffset = (index == 2) ? 1 : 0
                    for (let j = 0; j < num[10 - index + 1].length; j++) {
                        level.server.runCommandSilent(
                            `fill ${block.pos.x + num[10 - index + 1][j][0]} ${block.pos.y + num[10 - index + 1][j][1] + yOffset} ${block.pos.z + num[10 - index + 1][j][2]} ` +
                            `${block.pos.x + num[10 - index + 1][j][0]} ${block.pos.y + num[10 - index + 1][j][1] + yOffset} ${block.pos.z + num[10 - index + 1][j][2]} minecraft:air`
                        )
                    }
                    
                    // 画当前数字（y 层）
                    for (let j = 0; j < num[10 - index].length; j++) {
                        level.server.runCommandSilent(
                            `fill ${block.pos.x + num[10 - index][j][0]} ${block.pos.y + num[10 - index][j][1]} ${block.pos.z + num[10 - index][j][2]} ` +
                            `${block.pos.x + num[10 - index][j][0]} ${block.pos.y + num[10 - index][j][1]} ${block.pos.z + num[10 - index][j][2]} minecraft:blue_ice`
                        )
                    }
                }
                
                time_temp = line + index * 1000
                if (index == 10) temp = 1
            })
            currentScheduleIds.push(scheduleId)
        })(i)
    }
}



// player.tell("211")
// BOSS 战开始
let timeLine = 94400
let lel = 0
let boss = 9
let cout = 0 //判断是否回答

// ========== 新增：取消当前所有调度任务的辅助函数 ==========
function cancelCurrentSchedules(server) {
    // 注意：KubeJS的schedule返回的是回调函数本身，无法真正"取消"
    // 所以我们通过标记关卡版本号来跳过旧任务
    currentLevelGlobal++  // 增加关卡版本号，旧任务检测到版本不匹配就跳过
    currentScheduleIds = []
}

// ========== 修改后的 boss_line 函数 ==========
function boss_line(currentLevel) {
    // 取消之前的所有调度（通过版本号机制）
    cancelCurrentSchedules(server)
    const myLevelVersion = currentLevelGlobal  // 捕获当前版本号

    //提前清除
    for (let j = 0; j < num[9].length; j++) {
            level.server.runCommandSilent(
                `fill ${block.pos.x + num[9][j][0]} ${block.pos.y + num[9][j][1] + 1} ${block.pos.z + num[9][j][2]} ` +
                `${block.pos.x + num[9][j][0]} ${block.pos.y + num[9][j][1] + 1} ${block.pos.z + num[9][j][2]} minecraft:air`
            )
        }
        for (let i = 1; i <= 10; i++) {
            for (let j = 0; j < num[10 - i].length; j++) {
                let yOffset = (i == 1) ? 1 : 0
                level.server.runCommandSilent(
                    `fill ${block.pos.x + num[10 - i][j][0]} ${block.pos.y + num[10 - i][j][1] + yOffset} ${block.pos.z + num[10 - i][j][2]} ` +
                    `${block.pos.x + num[10 - i][j][0]} ${block.pos.y + num[10 - i][j][1] + yOffset} ${block.pos.z + num[10 - i][j][2]} minecraft:air`
                )
            }
        }
    // player.tell("222")
    // 清理之前的状态
    player.persistentData.putBoolean("put_answer", false)
    player.persistentData.putBoolean("answer", false)
    player.persistentData.putBoolean("isWaitingAnswer", true)
    // isWaitingAnswer = true
    
    // 设置当前关卡标记（用于聊天事件判断题目）
    for (let i = 0; i < 10; i++) {
        player.persistentData.putBoolean(`lel_${i}`, i === currentLevel)
    }
    player.persistentData.putBoolean("chat", true)

    let RDA = getRandomInt(1, 1000)
    let RDB = getRandomInt(1, 1000)
    player.persistentData.putInt("RDAB", RDA*RDB)

    let bilibili = "Rainraf_UwU"
    let uid = "1782086081"
    player.persistentData.putString("bilibili",bilibili)
    player.persistentData.putString("uid",uid)

    let RDA3 = getRandomInt(1, 9)
    let RDB3 = getRandomInt(1, 9)
    for(let i = 1;i<=9;i++){
        if(RDA3 == RDB3)  RDB3 = getRandomInt(1, 9)
            else break
    }
    player.persistentData.putInt("RDAB3", RDA3*RDB3)

    let RD41 = getRandomInt(1, 9)
    let RD42 = getRandomInt(1, 9)
    let RD43 = getRandomInt(1, 9)

    let RDF1 = getRandomInt(1, 300)
    let RDF2 = getRandomInt(1, 120)
    for(let i = 1;i<=9;i++){
        if(RD41 == RD42) RD42 = getRandomInt(1, 9)
        if(RD42 == RD43) RD43 = getRandomInt(1, 9)
        if(RD41 == RD43) RD41 = getRandomInt(1, 9)

        if(RD41 != RD42 && RD42 != RD43 && RD41 != RD43)  break
    }
    // let RD44 = getRandomInt(1, 10)
    // let RD45 = getRandomInt(1, 10)
    player.persistentData.putInt("RD412345", RD41*RD42*RD43)

    // player.tell("333")

    let RDF = getRandomInt(0,1)
    // player.tell("2222")
    let notation = ["+","*"]
    let notation_sure = notation[RDF]
    // player.persistentData.putInt("notation_sure", notation_sure)
    let RD51 = getRandomInt(1, 9)
    let RD52 = getRandomInt(1, 9)
    let RD53 = getRandomInt(1, 9)
    let mosinum = getRandomInt(1, 9)
    let mosinumsound = getRandomInt(1, 9)
    for(let i = 1;i<=9;i++){
        if(RD51 == RD52) RD52 = getRandomInt(1, 9)
        if(RD52 == RD53) RD53 = getRandomInt(1, 9)
        if(RD51 == RD53) RD51 = getRandomInt(1, 9)

        if(RD51 != RD52 && RD52 != RD53 && RD51 != RD53)  break
    }
    if(notation_sure == "+"){
        player.persistentData.putInt("RD5123", RD51+RD52+RD53)
        player.persistentData.putInt("RD6123", RD51+RD52+RD53+mosinum)
        player.persistentData.putInt("RD7123", RD51+RD52+RD53+mosinum+mosinumsound)
        player.persistentData.putInt("RD8123", RD51+RD52+RD53+mosinum+mosinumsound+RDF1*RDF2)
    }else{
        player.persistentData.putInt("RD5123", RD51*RD52*RD53)
        player.persistentData.putInt("RD6123", RD51*RD52*RD53*mosinum)
        player.persistentData.putInt("RD7123", RD51*RD52*RD53*mosinum*mosinumsound)
        player.persistentData.putInt("RD8123", RD51*RD52*RD53*mosinum*mosinumsound*RDF1*RDF2)
    }

    // 立即停止倒计时显示（清除数字）
        for (let j = 0; j < num[9].length; j++) {
            level.server.runCommandSilent(
                `fill ${block.pos.x + num[9][j][0]} ${block.pos.y + num[9][j][1] + 1} ${block.pos.z + num[9][j][2]} ` +
                `${block.pos.x + num[9][j][0]} ${block.pos.y + num[9][j][1] + 1} ${block.pos.z + num[9][j][2]} minecraft:air`
            )
        }
        for (let i = 1; i <= 10; i++) {
            for (let j = 0; j < num[10 - i].length; j++) {
                let yOffset = (i == 1) ? 1 : 0
                level.server.runCommandSilent(
                    `fill ${block.pos.x + num[10 - i][j][0]} ${block.pos.y + num[10 - i][j][1] + yOffset} ${block.pos.z + num[10 - i][j][2]} ` +
                    `${block.pos.x + num[10 - i][j][0]} ${block.pos.y + num[10 - i][j][1] + yOffset} ${block.pos.z + num[10 - i][j][2]} minecraft:air`
                )
            }
        }


    
    // 根据关卡显示不同题目
    const questions = ["1+1=", `${RDA} * ${RDB}`, "作者的b站是(uid或名字)：", "§k?§r*§k?§r=", "§kqwert§r(3)*=", "§k123123+4§r(3)?=", "§k123123+4§r(3+1)?=",  "§k123123+4§r(3+2)?=", `${RDF1} * ${RDF2}§k123123+4§r(3+2)?=`, "9+1="]
    const correctAnswers = ["2", `${RDA * RDB}`, "bilibili or uid", `${RDA3 * RDB3}`, `${RD41 * RD42 * RD43}`, `${RD51} ${RD52} ${RD53} ${notation_sure}`, `${RD51} ${RD52} ${RD53} ${mosinum} ${notation_sure}`, "9", "10", "10"]
    
    server.schedule(timeLine, () => {
        // 检查版本号，如果不匹配说明已被取消
        // player.tell("111")
        if (currentLevelGlobal !== myLevelVersion) return
        player.tell(questions[currentLevel] || "1+1=") 
        if(currentLevel == 3){
             typewriter(player, "Day7:发现未知生物 Day15:它们进来了救", {
            // 日期正常，内容乱码
            // glitchRanges: [
            //     {start: 4, end: 10},
            //     {start: 18, end: 26},
            //     {start: 32, end: 41}
            // ],
            // 关键词永久乱码
            permanentGlitchStrings: ["未知生物", "它们进来了"],
            glitchChars: `▓▒░█▀▄▌▐${RDA3}${RDB3}`,
            colors: ["#2F4F4F", "#696969", "#A9A9A9"],
            typeSpeed: 120,
        })
        }
        if(currentLevel == 4){
             typewriter(player, "ERROR123456789", {
            permanentGlitchStrings: ["1","2","3","4","5","6","7","8","9"],
            glitchChars: `▓█▀▄▌▐${RD41}${RD42}${RD43}`,
            colors: ["#2F4F4F", "#696969", "#A9A9A9"],
            typeSpeed: 120,
        })
        }
         if(currentLevel == 5){
             typewriter(player,  "ERROR123456789", {
            permanentGlitchStrings:["1","2","3","4","5","6","7","8","9"],
            glitchChars: `▓▒░█▀▄▌▐${RD51}${RD52}${RD53}${notation_sure}`,
            colors: ["#2F4F4F", "#696969", "#A9A9A9"],
            typeSpeed: 120,
        })
         }
         if(currentLevel == 6){
             typewriter(player,  "ERROR123456789", {
            permanentGlitchStrings:["1","2","3","4","5","6","7","8","9"],
            glitchChars: `▓▒░█▀▄▌▐${RD51}${RD52}${RD53}${notation_sure}`,
            colors: ["#2F4F4F", "#696969", "#A9A9A9"],
            typeSpeed: 120,
        })
        // player.tell(RD51+RD52+RD53+mosinum)
        // player.tell(RD51*RD52*RD53*mosinum)\
        console.log(RD51+RD52+RD53+mosinum)
        console.log(RD51*RD52*RD53*mosinum)
        mosimm(mosinum,0)
        mosimm(mosinum,3000)
        mosimm(mosinum,6000)
         }
         if(currentLevel == 7){
             typewriter(player,  "ERROR123456789", {
            // 日期正常，内容乱码
            // glitchRanges: [
            //     {start: 4, end: 10},
            //     {start: 18, end: 26},
            //     {start: 32, end: 41}
            // ],
            // 关键词永久乱码
            permanentGlitchStrings:["1","2","3","4","5","6","7","8","9"],
            glitchChars: `▓▒░█▀▄▌▐${RD51}${RD52}${RD53}${notation_sure}`,
            colors: ["#2F4F4F", "#696969", "#A9A9A9"],
            typeSpeed: 120,
        })
        // player.tell(RD51+RD52+RD53+mosinum+mosinumsound)
        // player.tell(RD51*RD52*RD53*mosinum*mosinumsound)
        console.log(RD51+RD52+RD53+mosinum+mosinumsound)
        console.log(RD51*RD52*RD53*mosinum*mosinumsound)
        mosimm(mosinum,0)
        mosimm(mosinum,3000)
        mosimm(mosinum,6000)
        mosimmSound(mosinumsound,0)
        mosimmSound(mosinumsound,3000)
        mosimmSound(mosinumsound,6000)
         }
         if(currentLevel == 8){
             typewriter(player,  "ERROR123456789", {
            // 日期正常，内容乱码
            // glitchRanges: [
            //     {start: 4, end: 10},
            //     {start: 18, end: 26},
            //     {start: 32, end: 41}
            // ],
            // 关键词永久乱码
            permanentGlitchStrings:["1","2","3","4","5","6","7","8","9"],
            glitchChars: `▓▒░█▀▄▌▐${RD51}${RD52}${RD53}${notation_sure}`,
            colors: ["#2F4F4F", "#696969", "#A9A9A9"],
            typeSpeed: 120,
        })
        // player.tell(RD51+RD52+RD53+mosinum+mosinumsound+RDF1*RDF2)
        // player.tell(RD51*RD52*RD53*mosinum*mosinumsound*RDF1*RDF2)
        console.log(RD51+RD52+RD53+mosinum+mosinumsound+RDF1*RDF2)
        console.log(RD51*RD52*RD53*mosinum*mosinumsound*RDF1*RDF2)
        mosimm(mosinum,0)
        mosimm(mosinum,3000)
        mosimm(mosinum,6000)
        mosimmSound(mosinumsound,0)
        mosimmSound(mosinumsound,3000)
        mosimmSound(mosinumsound,6000)
         }
    })
    
    // 启动倒计时（传入版本号用于自我检查）
    TimeLineLFunction(timeLine, num, player, myLevelVersion)

    // 超时检测 - 使用局部变量避免重复触发
    let hasHandledTimeout = false
    
    let timeoutId = server.schedule(timeLine + 11000, () => {
        // isWaitingAnswer = false
        player.persistentData.putBoolean("isWaitingAnswer", false)
        // 版本号检查
        if (currentLevelGlobal !== myLevelVersion) return
        // 防止重复处理
        if (hasHandledTimeout || player.persistentData.getBoolean("put_answer")) return
        hasHandledTimeout = true
        
        // 超时惩罚
        // player.tell("§c时间到！回答超时！")
        level.server.runCommandSilent(`playsound rain:incorrect player ${name} ~ ~ ~ 1 1 1`)
        
        for (let i = 1; i < 15; i++) {
            (function(index) {
                server.schedule(index * 100, () => {
                    if (currentLevelGlobal !== myLevelVersion) return  // 额外检查
                    level.server.runCommandSilent(`playsound rain:tnt player ${name} ~ ~ ~ 1 1 1`)
                    let px = Math.floor(player.x)
                    let py = Math.floor(player.y)
                    let pz = Math.floor(player.z)
                    level.server.runCommandSilent(`particle minecraft:explosion_emitter ${px + index - 15} ${py} ${pz} 0 0 0 0 1 normal`)
                })
            })(i)
        }

        //  level.server.runCommandSilent(`playsound rain:nan_man_da_bu player ${name} ~ ~ ~ 1 1 1`)
        
        for (let i = 0; i < 5; i++) {
            (function(index) {
                server.schedule(1500 + index * 50, () => {
                    if (currentLevelGlobal !== myLevelVersion) return  // 额外检查
                    hurtNoIFrames(player, 1)
                })
            })(i)
        }
        
        // 惩罚后重试当前关卡（延迟确保惩罚执行完）
        server.schedule(3000 + 1750, () => {
            if (currentLevelGlobal !== myLevelVersion) return
            timeLine = 0  // 重置时间线，立即开始
            boss_line(currentLevel)
        })
    })
    currentScheduleIds.push(timeoutId)

    // 设置回答回调（使用局部变量防止重复触发）
    let hasHandledAnswer = false
    
    answerCallback = function() {
        // 防止重复触发
        if (hasHandledAnswer) return
        hasHandledAnswer = true
        // isWaitingAnswer = false
        player.persistentData.putBoolean("isWaitingAnswer", false)
        // 检查版本号
        if (currentLevelGlobal !== myLevelVersion) return
        
        let isCorrect = player.persistentData.getBoolean("answer")
        let hasAnswered = player.persistentData.getBoolean("put_answer")
        
        if (!hasAnswered) {
            // 异常情况：回调触发但没有回答标记
            return
        }

        
        if (!isCorrect) {
            // 回答错误 - 惩罚
            // player.tell("§c回答错误！")
            level.server.runCommandSilent(`playsound rain:incorrect player ${name} ~ ~ ~ 1 1 1`)
            
            for (let i = 1; i < 15; i++) {
                (function(index) {
                    server.schedule(index * 100, () => {
                        if (currentLevelGlobal !== myLevelVersion) return
                        level.server.runCommandSilent(`playsound rain:tnt player ${name} ~ ~ ~ 1 1 1`)
                        let px = Math.floor(player.x)
                        let py = Math.floor(player.y)
                        let pz = Math.floor(player.z)
                        level.server.runCommandSilent(`particle minecraft:explosion_emitter ${px + index - 15} ${py} ${pz} 0 0 0 0 1 normal`)
                    })
                })(i)
            }

            for (let i = 0; i < 5; i++) {
                (function(index) {
                    server.schedule(1500 + index * 50, () => {
                        if (currentLevelGlobal !== myLevelVersion) return
                        hurtNoIFrames(player, 1)
                    })
                })(i)
            }
            
            // 惩罚后重试
            server.schedule(3000 + 1750, () => {
                if (currentLevelGlobal !== myLevelVersion) return
                timeLine = 0
                boss_line(currentLevel)
            })
            
        } else {
            // 回答正确 - 庆祝
            // player.tell("§a回答正确！")
            level.server.runCommandSilent(`playsound rain:correct player ${name} ~ ~ ~ 1 1 1`)
            
            for (let i = 1; i < 15; i++) {
                (function(index) {
                    server.schedule(index * 100, () => {
                        if (currentLevelGlobal !== myLevelVersion) return
                        level.server.runCommandSilent(`/playsound rain:tnt player ${name} ~ ~ ~ 1 1 1`)
                        let px = Math.floor(player.x)
                        let py = Math.floor(player.y)
                        let pz = Math.floor(player.z)
                        level.server.runCommandSilent(`/particle minecraft:explosion_emitter ${px - index} ${py} ${pz} 0 0 0 0 1 normal`)
                    })
                })(i)
            }

            server.schedule(1500, () => {
                if (currentLevelGlobal !== myLevelVersion) return
                
                // 清除当前关卡指示器
                level.server.runCommandSilent(`fill ${block.pos.x - 13} ${block.pos.y + 20} ${block.pos.z - 5 + 1} ${block.pos.x - 13} ${block.pos.y + 20} ${block.pos.z - 5 + 1 + currentLevel} minecraft:air`)
                level.server.runCommandSilent(`particle minecraft:explosion_emitter ${block.pos.x - 13} ${block.pos.y + 20} ${block.pos.z - 5 + 1 + currentLevel} 0 0 0 0 1 normal`)
                
                // 进入下一关
                let nextLevel = currentLevel + 1

                if(currentLevel == 2){
                    player.tell("§l关注§aRainraf_UwU§r§l谢谢喵")
                }
                
                // 检查是否完成所有关卡
                if (nextLevel >= boss) {
                    // player.tell("§a§l恭喜！你已完成所有挑战！")
                    player.persistentData.putBoolean("test1", false)
                    player.persistentData.putBoolean("chat", false)
                    for (let i = 0; i < 10; i++) {
                        player.persistentData.putBoolean(`lel_${i}`, false)
                    }
                    return
                }
                if (nextLevel === 2 || nextLevel === 4 || nextLevel === 6 || nextLevel === 7) {
                    level.server.runCommandSilent(`effect give ${name} minecraft:instant_health 10 5`);
                }

                 server.schedule(3000 + 1750, () => {
                if (currentLevelGlobal !== myLevelVersion) return
                // 启动下一关
                timeLine = 0
                boss_line(nextLevel)
            })
            })
        }
    }
}

// player.tell("333")
boss_line(0)
// player.tell("444")

        player.mainHandItem.shrink(1)
        // const eyePos = player.getEyePosition(1.0)
        // const lookVec = player.getLookAngle()
        let distance = 2  // 射程
        let steps = 50     // 粒子密度
        let distance_wight = 3  // 射程宽
        server.schedule(42000,()=>{
            level.server.runCommandSilent(`playsound rain:train player ${name} ${Math.floor(player.x)} ${Math.floor(player.y)} ${Math.floor(player.z)} 1 1 1`)
        })

        for(let j = 0;j < 240;j++){
                player.level.server.schedule(j*100+42000,()=>{
                    for (let i = 0; i < steps; i++) {
                            let t = i / steps
                            //  let x = block.pos.x + distance * t
                            //  let y = block.pos.y + distance * t
                                //  let z = block.pos.z + distance * t
                        
                            level.server.runCommandSilent(`particle minecraft:end_rod ${block.pos.x + distance * t + 0.5} ${block.pos.y+1.5} ${block.pos.z} 0 0 0 1 1 force`)
                            level.server.runCommandSilent(`particle minecraft:end_rod ${block.pos.x - distance * t + 0.5} ${block.pos.y+1.5} ${block.pos.z} 0 0 0 1 1 force`)
                            level.server.runCommandSilent(`particle minecraft:end_rod ${block.pos.x} ${block.pos.y+1.5} ${block.pos.z+ distance * t + 0.5} 0 0 0 1 1 force`)
                            level.server.runCommandSilent(`particle minecraft:end_rod ${block.pos.x} ${block.pos.y+1.5} ${block.pos.z- distance * t + 0.5} 0 0 0 1 1 force`)

                            level.server.runCommandSilent(`particle minecraft:witch ${block.pos.x + distance_wight * t + 0.5} ${block.pos.y + distance * t + 1.5} ${block.pos.z} 0 0 0 10 1 force`)
                            level.server.runCommandSilent(`particle minecraft:witch ${block.pos.x - distance_wight * t + 0.5} ${block.pos.y + distance * t + 1.5} ${block.pos.z} 0 0 0 10 1 force`)
                            level.server.runCommandSilent(`particle minecraft:witch ${block.pos.x } ${block.pos.y + distance * t + 1.5} ${block.pos.z + distance_wight * t + 0.5} 0 0 0 10 1 force`)
                            level.server.runCommandSilent(`particle minecraft:witch ${block.pos.x } ${block.pos.y + distance * t + 1.5} ${block.pos.z - distance_wight * t + 0.5} 0 0 0 10 1 force`)
        //   player.tell(111)
        // return
  }
                })
        }

//         for (let i = 0; i < steps; i++) {
//          let t = i / steps
//         //  let x = block.pos.x + distance * t
//         //  let y = block.pos.y + distance * t
//         //  let z = block.pos.z + distance * t
    
//         level.server.runCommandSilent(`particle minecraft:end_rod ${block.pos.x + distance * t + 0.5} ${block.pos.y+1.5} ${block.pos.z} 0 0 0 0 1 force`)
//         level.server.runCommandSilent(`particle minecraft:end_rod ${block.pos.x - distance * t + 0.5} ${block.pos.y+1.5} ${block.pos.z} 0 0 0 0 1 force`)
//         level.server.runCommandSilent(`particle minecraft:end_rod ${block.pos.x} ${block.pos.y+1.5} ${block.pos.z+ distance * t + 0.5} 0 0 0 0 1 force`)
//         level.server.runCommandSilent(`particle minecraft:end_rod ${block.pos.x} ${block.pos.y+1.5} ${block.pos.z- distance * t + 0.5} 0 0 0 0 1 force`)

//         level.server.runCommandSilent(`particle minecraft:witch ${block.pos.x + distance_wight * t + 0.5} ${block.pos.y + distance * t + 1.5} ${block.pos.z} 0 0 0 0 1 force`)
//         level.server.runCommandSilent(`particle minecraft:witch ${block.pos.x - distance_wight * t + 0.5} ${block.pos.y + distance * t + 1.5} ${block.pos.z} 0 0 0 0 1 force`)
//         level.server.runCommandSilent(`particle minecraft:witch ${block.pos.x } ${block.pos.y + distance * t + 1.5} ${block.pos.z + distance_wight * t + 0.5} 0 0 0 0 1 force`)
//         level.server.runCommandSilent(`particle minecraft:witch ${block.pos.x } ${block.pos.y + distance * t + 1.5} ${block.pos.z - distance_wight * t + 0.5} 0 0 0 0 1 force`)
//         //   player.tell(111)
//         // return
//   }
   return
        player.level.server.schedule(3000,()=>{
             const sX = block.pos.x
             const sY = block.pos.y + 1
             const sZ = block.pos.z
            // player.tell(name)
            level.server.runCommandSilent(`playsound minecraft:entity.ender_dragon.ambient player ${name} ~ ~ ~ 3 2 1`)
            level.server.runCommandSilent(`tellraw ${name} {"translate":"rain.player.tell.text2","color":"green"}`)
            level.server.runCommandSilent(`summon minecraft:lightning_bolt ${sX} ${sY} ${sZ}`)
            level.server.runCommandSilent(`summon minecraft:zombie ${sX} ${sY} ${sZ}`)
            level.server.runCommandSilent(`execute as ${name} at @s run particle minecraft:end_rod ^ ^ ^ 5 5 5 0.2 100000`)
            player.persistentData.putBoolean("test1", false)
        })
    // }
    // player.tell("222")
    })


// 监听所有玩家聊天
PlayerEvents.chat(event => {
    const { player, message, server , level } = event

    // 检查是否在答题状态
    if (!player.persistentData.getBoolean("chat")) return
    if (!player.persistentData.getBoolean("isWaitingAnswer")) return  // 不在等待回答时忽略
    if (player.persistentData.getBoolean("put_answer")) return  // 已经回答过则忽略

    let answered = false
    let isCorrect = false

    // ========== 修复：更健壮的答案检查 ==========
    let msg = message.trim()
    let name = player.name
    
    // 检查各关卡答案
    if (player.persistentData.getBoolean("lel_0")) {
        if (msg === "2" || msg.includes("2")) {
            answered = true
            isCorrect = true
            // player.tell("检测到lel_0正确答案")
            // level.server.runCommandSilent(`playsound rain:correct player ${name} ~ ~ ~ 1 1 1`)
            
        } else if (msg !== "") {  // 任何非空回答都视为错误答案
            answered = true
            isCorrect = false
            // level.server.runCommandSilent(`playsound rain:incorrect player ${name} ~ ~ ~ 1 1 1`)
        }
    } else if (player.persistentData.getBoolean("lel_1")) {
        if (msg === `${ player.persistentData.getInt("RDAB")}` || msg.includes(`${player.persistentData.getInt("RDAB")}`)) {
            answered = true
            isCorrect = true
            // player.tell("检测到lel_1正确答案")
            // level.server.runCommandSilent(`playsound rain:correct player ${name} ~ ~ ~ 1 1 1`)
        } else if (msg !== "") {
            answered = true
            isCorrect = false
            // level.server.runCommandSilent(`playsound rain:incorrect player ${name} ~ ~ ~ 1 1 1`)
        }
    }else if (player.persistentData.getBoolean("lel_2")) {
        if (msg === (player.persistentData.getString("uid") || player.persistentData.getString("bilibili")) || (msg.includes(player.persistentData.getString("uid")) || msg.includes(player.persistentData.getString("bilibili")))) {
            answered = true
            isCorrect = true
            // player.tell("检测到lel_2正确答案")
            // level.server.runCommandSilent(`playsound rain:correct player ${name} ~ ~ ~ 1 1 1`)
        } else if (msg !== "") {
            answered = true
            isCorrect = false
            // level.server.runCommandSilent(`playsound rain:incorrect player ${name} ~ ~ ~ 1 1 1`)
        }
    }else if (player.persistentData.getBoolean("lel_3")) {
        if (msg === `${player.persistentData.getInt("RDAB3")}` || msg.includes(`${player.persistentData.getInt("RDAB3")}`)) {
            answered = true
            isCorrect = true
            // level.server.runCommandSilent(`playsound rain:correct player ${name} ~ ~ ~ 1 1 1`)
        } else if (msg !== "") {
            answered = true
            isCorrect = false
            // level.server.runCommandSilent(`playsound rain:incorrect player ${name} ~ ~ ~ 1 1 1`)
        }
    }else if (player.persistentData.getBoolean("lel_4")) {
        if (msg === `${player.persistentData.getInt("RD412345")}` || msg.includes(`${player.persistentData.getInt("RD412345")}`)) {
            answered = true
            isCorrect = true
            // level.server.runCommandSilent(`playsound rain:correct player ${name} ~ ~ ~ 1 1 1`)
        } else if (msg !== "") {
            answered = true
            isCorrect = false
            // level.server.runCommandSilent(`playsound rain:incorrect player ${name} ~ ~ ~ 1 1 1`)
        }
    }else if (player.persistentData.getBoolean("lel_5")) {
        if (msg === `${player.persistentData.getInt("RD5123")}` || msg.includes(`${player.persistentData.getInt("RD5123")}`)) {
            answered = true
            isCorrect = true
            // level.server.runCommandSilent(`playsound rain:correct player ${name} ~ ~ ~ 1 1 1`)
        } else if (msg !== "") {
            answered = true
            isCorrect = false
            // level.server.runCommandSilent(`playsound rain:incorrect player ${name} ~ ~ ~ 1 1 1`)
        }
    }else if (player.persistentData.getBoolean("lel_6")) {
        if (msg === `${player.persistentData.getInt("RD6123")}` || msg.includes(`${player.persistentData.getInt("RD6123")}`)) {
            answered = true
            isCorrect = true
            // level.server.runCommandSilent(`playsound rain:correct player ${name} ~ ~ ~ 1 1 1`)
        } else if (msg !== "") {
            answered = true
            isCorrect = false
            // level.server.runCommandSilent(`playsound rain:incorrect player ${name} ~ ~ ~ 1 1 1`)
        }
    }else if (player.persistentData.getBoolean("lel_7")) {
        if (msg === `${player.persistentData.getInt("RD7123")}` || msg.includes(`${player.persistentData.getInt("RD7123")}`)) {
            answered = true
            isCorrect = true
            // player.tell("检测到lel_7正确答案")
            // level.server.runCommandSilent(`playsound rain:correct player ${name} ~ ~ ~ 1 1 1`)
        } else if (msg !== "") {
            answered = true
            isCorrect = false
            // level.server.runCommandSilent(`playsound rain:incorrect player ${name} ~ ~ ~ 1 1 1`)
        }
    }else if (player.persistentData.getBoolean("lel_8")) {
        if (msg === `${player.persistentData.getInt("RD8123")}` || msg.includes(`${player.persistentData.getInt("RD8123")}`)) {
            answered = true
            isCorrect = true
            // level.server.runCommandSilent(`playsound rain:correct player ${name} ~ ~ ~ 1 1 1`)
        } else if (msg !== "") {
            answered = true
            isCorrect = false
            // level.server.runCommandSilent(`playsound rain:incorrect player ${name} ~ ~ ~ 1 1 1`)
        }
    }
    // 可以继续添加更多关卡...

    // ========== 调试信息 ==========
    // player.tell("chat事件触发")
    // player.tell("message=" + msg)
    // player.tell("lel_0=" + player.persistentData.getBoolean("lel_0"))
    // player.tell("lel_1=" + player.persistentData.getBoolean("lel_1"))
    // player.tell("answered=" + answered)

    if (answered) {
        // answered = false
        // player.tell("进入answered分支")
        
        // 立即标记已回答，防止重复处理
        player.persistentData.putBoolean("put_answer", true)
        player.persistentData.putBoolean("answer", isCorrect)
        player.persistentData.putBoolean("chat", false)

        // 立即停止倒计时显示（清除数字）
        // for (let j = 0; j < num[9].length; j++) {
        //     level.server.runCommandSilent(
        //         `fill ${block.pos.x + num[9][j][0]} ${block.pos.y + num[9][j][1] + 1} ${block.pos.z + num[9][j][2]} ` +
        //         `${block.pos.x + num[9][j][0]} ${block.pos.y + num[9][j][1] + 1} ${block.pos.z + num[9][j][2]} minecraft:air`
        //     )
        // }
        // for (let i = 1; i <= 10; i++) {
        //     for (let j = 0; j < num[10 - i].length; j++) {
        //         let yOffset = (i == 1) ? 1 : 0
        //         level.server.runCommandSilent(
        //             `fill ${block.pos.x + num[10 - i][j][0]} ${block.pos.y + num[10 - i][j][1] + yOffset} ${block.pos.z + num[10 - i][j][2]} ` +
        //             `${block.pos.x + num[10 - i][j][0]} ${block.pos.y + num[10 - i][j][1] + yOffset} ${block.pos.z + num[10 - i][j][2]} minecraft:air`
        //         )
        //     }
        // }

        // if (isCorrect) {
        //     player.tell("§a回答正确！")
        // } else {
        //     player.tell("§c回答错误！")
        // }

        // 2秒后执行回调（只执行一次）
        if (answerCallback) {
            let callback = answerCallback
            player.level.server.schedule(2000, callback)
            // callback()
            answerCallback = null  // 立即清空，防止重复
            // server.schedule(2000, callback)
        }
    } else {
        player.tell("§e未识别为有效答案，请直接输入数字")
    }
})