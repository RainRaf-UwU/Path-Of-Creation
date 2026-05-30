// ItemEvents.rightClicked('rain:music', event => {
//     const { player, level } = event
//     if (!player) return
//     if (event.hand == "OFF_HAND") return

//     const File = Java.type('java.io.File')
//     const System = Java.type('java.lang.System')
//     const sep = File.separator
//     // 注意：System.getProperty('user.dir') 在服务端是服务端根目录，在单人游戏是客户端根目录
//     const basePath = System.getProperty('user.dir') + sep + 'kubejs' + sep + 'music'

//     const folder = new File(basePath)
//     if (!folder.exists()) folder.mkdirs()

//     const files = folder.listFiles()
//     const list = []
//     if (files != null) {
//         for (let i = 0; i < files.length; i++) {
//             const f = files[i]
//             if (f.isFile()) {
//                 const name = f.getName()
//                 const low = name.toLowerCase()
//                 if (low.endsWith('.ogg') || low.endsWith('.mp3') || low.endsWith('.wav')) {
//                     const id = name.replace(/\.[^/.]+$/, '')
//                     list.push({ name: name, id: id })
//                 }
//             }
//         }
//     }

//     const jsonArr = []
//     jsonArr.push({ "text": "=== 音乐播放器 ===\n", "color": "gold", "bold": true })

//     if (list.length === 0) {
//         jsonArr.push({ "text": "目录为空：", "color": "red" })
//         jsonArr.push({ "text": basePath + "\n", "color": "gray" })
//         jsonArr.push({ "text": "把 .ogg 文件放入上面目录，并在资源包 sounds.json 中注册为 custommusic.<文件名>。\n", "color": "yellow" })
//     } else {
//         for (let i = 0; i < list.length; i++) {
//             const it = list[i]
//             const display = it.name
//             const soundId = it.id
            
//             // 文件名
//             jsonArr.push({
//                 "text": (i + 1) + ". " + display + "  ",
//                 "color": "white"
//             })
            
//             // [播放] 按钮 - 使用 run_command，客户端执行 /playsound
//             // 注意：value 里不能包含换行，且命令长度有限制
//             const playCmd = `/playsound custommusic.${soundId} master @s`
//             jsonArr.push({
//                 "text": "[▶播放]",
//                 "color": "aqua",
//                 "bold": true,
//                 "clickEvent": { 
//                     "action": "run_command", 
//                     "value": playCmd 
//                 },
//                 "hoverEvent": { 
//                     "action": "show_text", 
//                     "contents": [{ "text": "点击播放: " + display, "color": "aqua" }] 
//                 }
//             })
            
//             // [停止] 按钮（可选，方便玩家）
//             jsonArr.push({
//                 "text": " [■停止]\n",
//                 "color": "red",
//                 "clickEvent": { 
//                     "action": "run_command", 
//                     "value": `/stopsound @s master custommusic.${soundId}` 
//                 },
//                 "hoverEvent": { 
//                     "action": "show_text", 
//                     "contents": [{ "text": "停止播放: " + display, "color": "red" }] 
//                 }
//             })
//         }
//     }

//     // 添加 [全部停止] 按钮
//     if (list.length > 0) {
//         jsonArr.push({
//             "text": "\n[■ 停止全部音乐]",
//             "color": "red",
//             "bold": true,
//             "clickEvent": { 
//                 "action": "run_command", 
//                 "value": `/stopsound @s master` 
//             },
//             "hoverEvent": { 
//                 "action": "show_text", 
//                 "contents": [{ "text": "停止当前所有音乐", "color": "red" }] 
//             }
//         })
//     }

//     // 复制路径按钮
//     jsonArr.push({
//         "text": "\n\n[📁 复制音乐文件夹路径]",
//         "color": "green",
//         "clickEvent": { 
//             "action": "copy_to_clipboard", 
//             "value": basePath 
//         },
//         "hoverEvent": { 
//             "action": "show_text", 
//             "contents": [{ "text": "点击复制路径到剪贴板", "color": "green" }] 
//         }
//     })

//     jsonArr.push({ 
//         "text": "\n\n提示：音频需在资源包 sounds.json 中注册为 custommusic.<文件名(不含扩展)> 才能播放。\n格式示例：\"custommusic.song1\": { \"sounds\": [{ \"name\": \"kubejs/music/song1\", \"stream\": true }] }", 
//         "color": "gray",
//         "italic": true
//     })

//     // 发送 tellraw - 使用玩家名字字符串
//     const playerName = player.name.getString ? player.name.getString() : player.name.toString()
//     const tellrawStr = JSON.stringify(jsonArr)
//     level.server.runCommandSilent(`tellraw ${playerName} ${tellrawStr}`)
// })