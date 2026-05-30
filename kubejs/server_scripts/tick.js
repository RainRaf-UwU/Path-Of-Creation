// LevelEvents.tick(event => {
//   const level = event.level
//   if (level.isClientSide()) return          // 只跑服务端

//   for (let iter = level.entities.iterator(); iter.hasNext();) {
//     const entity = iter.next()
//     if (!entity.isLiving()) continue

//     // 取脚下方块（脚底偏下 0.1 格，确保踩进流体）
//     const y = Math.floor(entity.y - 0.1)
//     const block = level.getBlock(entity.x, y, entity.z)
//     if (!block || block.id !== 'rain:void_fluid') continue

//     if (entity.tickCount % 10 !== 0) continue

//     entity.attack(2, 'minecraft:out_of_world')
//   }
// })