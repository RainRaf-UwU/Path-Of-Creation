// BlockEvents.broken('minecraft:bedrock', event => {
//         const { player, block } = event

//         if (player.isCreative()) {
//             return
//         }
//         block.popItem(block.id)
//     })

// kubejs/server_scripts/break_bedrock.js
// BlockEvents.broken(event => {
//   const { block, player, level } = event
//   if (block.id !== 'minecraft:bedrock') return
//   if (!player) return               // 防止爆炸等方式
//   if (!player.isCreative()) {
//     // 直接在世界掉落 1 个下界合金锭（不注册物品）
//     level.spawnItem(block.location, Item.of('minecraft:netherite_ingot'))
//     // 额外给点经验
//     player.giveExperience(5)
//   }
//   event.expToDrop = 0               // 不再额外给方块经验
// })

// // kubejs/server_scripts/blocks.js  （放 server_scripts，别放 startup）
// BlockEvents.modification(event => {
//   event.modify('minecraft:bedrock', block => {
//     block.destroySpeed = 1.5   // 硬度降到铁镐可挖
//     block.requiresTool = true  // 需要工具
//   })
// })