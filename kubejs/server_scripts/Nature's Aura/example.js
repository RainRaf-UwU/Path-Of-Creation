// ServerEvents.recipes((event) => {
//     const { naturesaura } = event.recipes
 
//     // 自然祭坛（输出，输入，灵气-可选，时间-可选 催化器-可选）
//     naturesaura.altar('bedrock', 'stone')
//     naturesaura.altar('bedrock', 'stone', 5000)
//     naturesaura.altar('bedrock', 'stone', 5000, 60)
//     naturesaura.altar('bedrock', 'stone', 5000, 60, 'naturesaura:conversion_catalyst')
 
//     // 降生祭坛（实体，输入，灵气-可选，时间-可选）
//     naturesaura.animal_spawner('creeper', ['gunpowder', 'green_dye'])
//     naturesaura.animal_spawner('creeper', ['gunpowder', 'green_dye'], 10000)
//     naturesaura.animal_spawner('creeper', ['gunpowder', 'green_dye'], 10000, 120)
 
//     // 祭祀台（输出，输入，启动物品）
//     naturesaura.offering('diamond', 'coal', 'bedrock')
 
//     // 森林仪式（输出，输入，树苗-可选, 时间-可选）
//     naturesaura.tree_ritual('nether_star', ['blaze_powder', 'obsidian', 'diamond'])
//     naturesaura.tree_ritual('nether_star', ['blaze_powder', 'obsidian', 'diamond'], 'oak_sapling')
//     naturesaura.tree_ritual('nether_star', ['blaze_powder', 'obsidian', 'diamond'], 'oak_sapling', 200)
// })

// StartupEvents.registry('item', (event) => {
//     // 自定义灵气缓存（可存储灵气的物品）
//     event.create('custom_aura_cache', 'naturesaura:aura_cache').setMaxAura(100000)
 
//     // 自定义类似末影之眼的物品（寻找指定范围的结构）
//     event
//         .create('custom_structure_finder', 'naturesaura:structure_finder')
//         .setStructure('aether:bronze_dungeon') // 要寻找的结构
//         .setColor(0xba2800) // 物品实体飞行时的粒子颜色
//         .setRadius(2048) // 搜寻范围
// })

// NaturesAuraEvents.init((event) => {
//     // 自定义灵气类型（灵气类型，维度，灵气颜色，优先级-可选）
//     event.custom('kubejs:aether', 'aether:the_aether', 0xb0c4de)
 
//     // 修改维度的灵气类型（维度， 灵气类型）
//     event.modify('minecraft:overworld', 'kubejs:aether')
// })

// BlockEvents.rightClicked((event) => {
//     const { block, item, level } = event
 
//     AuraBlock.getStoredAura(block.entity) // 获取方块存储的灵气值
//     AuraBlock.drainAura(block.entity, 100000, false) // 抽取方块的灵气
//     AuraBlock.storeAura(block.entity, 100000, false) // 给方块存入灵气
 
//     AuraItem.getStoredAura(item) // 获取物品存储的灵气值
//     AuraItem.drainAura(item, 100000, false) // 抽取物品的灵气
//     AuraItem.storeAura(item.entity, 100000, false) // 给物品存入灵气
 
//     AuraChunk.getAuraInArea(level, block.pos, 16) // 获取范围内的灵气值
//     AuraChunk.drainAura(level, block.pos, 100000) // 抽取区块的灵气
//     AuraChunk.storeAura(level, block.pos, 100000) // 给区块存入灵气
// })