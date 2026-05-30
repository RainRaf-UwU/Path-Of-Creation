// // kubejs/server_scripts/ban_loot.js
// LootJS.modifiers(event => {
//   // 1. 实体掉落
//   event.addModifier(LootType.ENTITY)
//        .removeLoot('rain:your_item')

//   // 2. 方块掉落
//   event.addModifier(LootType.BLOCK)
//        .removeLoot('rain:your_item')

//   // 3. 箱子 / 结构
//   event.addModifier(LootType.CHEST)
//        .removeLoot('rain:your_item')

//   // 4. 钓鱼
//   event.addModifier(LootType.FISHING)
//        .removeLoot('rain:your_item')

//   // 5. 礼物
//   event.addModifier(LootType.GIFT)
//        .removeLoot('rain:your_item')

//   // 6. 猪灵以物易物
//   event.addModifier(LootType.PIGLIN_BARTER)
//        .removeLoot('rain:your_item')
// })

LootJS.modifiers(event => {
    // Or we can also use a regex
         event
        .addTableModifier(LootType.CHEST)
        .removeLoot('tombstone:bag_of_seeds')

         event
        .addTableModifier(LootType.ENTITY)
        .removeLoot('tombstone:bag_of_seeds')

        event
        .addTableModifier(LootType.FISHING)
        .removeLoot('tombstone:bag_of_seeds')

         event
        .addTableModifier(LootType.BLOCK)
        .removeLoot('tombstone:bag_of_seeds')

        event
        .addTableModifier(LootType.GIFT)
        .removeLoot('tombstone:bag_of_seeds')

        event
        .addTableModifier(LootType.PIGLIN_BARTER)
        .removeLoot('tombstone:bag_of_seeds')

        event.addBlockModifier('minecraft:short_grass')
        .removeLoot('#c:seeds')

        event.addBlockModifier('minecraft:tall_grass')
        .removeLoot('#c:seeds')

        event.addBlockModifier('rain:unlucky_block')
        .removeLoot('rain:unlucky_block')
         .addLoot('rain:cosmic_coin')
        .setCount([1,32])

        event
        .addTableModifier(LootType.FISHING)
        .addLoot('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:cod"]')
        .randomChance(0.25)

        event
        .addTableModifier(LootType.FISHING)
        .addLoot('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:squid"]')
        .randomChance(0.25)

        // event.addBlockModifier('rain:unlucky_block')
        // .addWeight


         event
        .addTableModifier(LootType.CHEST)
        .removeLoot('unusualend:bolok_scale')

         event
        .addTableModifier(LootType.ENTITY)
        .removeLoot('unusualend:bolok_scale')

        event
        .addTableModifier(LootType.FISHING)
        .removeLoot('unusualend:bolok_scale')

         event
        .addTableModifier(LootType.BLOCK)
        .removeLoot('unusualend:bolok_scale')

        event
        .addTableModifier(LootType.GIFT)
        .removeLoot('unusualend:bolok_scale')

        event
        .addTableModifier(LootType.PIGLIN_BARTER)
        .removeLoot('unusualend:bolok_scale')


        //龙研封包合成方块掉落物修复
            const blockId = [
                'packageddraconic:marked_wyvern_injector',
                'packageddraconic:marked_draconium_injector',
                'packageddraconic:marked_draconic_injector',
                'packageddraconic:marked_chaotic_injector'
            ]
        
        
            blockId.forEach(block => {
                event.addBlockModifier(block)
                    .addLoot(block)
            });


        const oreblockConfig = [
                ['minecraft:iron_ore', 'minecraft:raw_iron'],
                ['alltheores:lead_ore', 'alltheores:raw_lead'],
                ['alltheores:tin_ore', 'alltheores:raw_tin'],
                ['alltheores:nickel_ore', 'alltheores:raw_nickel'],
                ['alltheores:aluminum_ore', 'alltheores:raw_aluminum'],
                ['alltheores:zinc_ore', 'alltheores:raw_zinc'],
                ['minecraft:copper_ore', 'minecraft:raw_copper'],
                ['minecraft:gold_ore', 'minecraft:raw_gold']
            ];
        
         oreblockConfig.forEach(([ore, raw]) => {
                event.addBlockModifier(ore)
                    .customAction((context, loot) => {
                        const tool = context.getTool();
                        if (!tool) {
                            loot.addItem(ore);
                            return;
                        }

                
                const toolId = tool.id.toString();
                loot.remove(raw);

                const toolDrops = {
                 'allthemodium:allthemodium_pickaxe':raw,
                 'allthemodium:vibranium_pickaxe':raw
                                };

                const drop = toolDrops[toolId];
                if (drop) {
                       loot.addItem(drop);
                } else {
                      loot.addItem(ore);
                }
                });
                });

                const end = [
                    'alltheores:end_aluminum_ore',
                    'alltheores:end_lead_ore',
                    'alltheores:end_nickel_ore',
                    'alltheores:end_osmium_ore',
                    'alltheores:end_platinum_ore',
                    'alltheores:end_silver_ore',
                    'alltheores:end_tin_ore',
                    'alltheores:end_uranium_ore',
                    'alltheores:end_zinc_ore',
                    'alltheores:end_iridium_ore',
                    'alltheores:end_ruby_ore',
                    'alltheores:end_peridot_ore',
                    'alltheores:end_sapphire_ore',
                    'alltheores:end_cinnabar_ore',
                    'alltheores:end_fluorite_ore',
                    'alltheores:end_salt_ore',
                    'alltheores:end_sulfur_ore',
                    'draconicevolution:end_draconium_ore',
                    'mekanism_extras:end_naquadah_ore',
                    'flowtech:umbrite_end_ore',
                    'allthemodium:unobtainium_ore'
                ]

                 end.forEach(([ore]) => {
                event.addBlockModifier(ore)
                    .customAction((context, loot) => {
                        const tool1 = context.getTool();
                        if (!tool1) {
                            loot.addItem(ore);
                            return;
                        }

                        loot.remove(ore);
                    })
         });

        //   event
        // .addBlockModifier('rain:unlucky_block').addItem('rain:cosmic_coin').enchantWithLevels([1, 64])


})

// LootJS.lootTables(event => {
//     event.create('rain:unlucky_block').createPool(pool => {
//         // Per default it will always be `#minecraft:on_random_loot` for `enchantWithLevels`
//         // 
//     //    pool.addItem('rain:cosmic_coin').setc
//     pool.addBlockModifier('rain:cosmic_coin').enchantWithLevels([1, 64])
//     //    pool.addEntry(
//     //         LootEntry.of("minecraft:diamond_leggings").withWeight(3).enchantWithLevels([20, 39])
//     //     )
//     })
// })

// LootJS.lootTables(event => {
//     event.create('rain:unlucky_block').createPool(pool=>{
//         pool.rolls([1, 2])
//         pool.addEntry(LootEntry.of('rain:cosmic_coin').withWeight(10).setCount([1,64]))
//     })
// })

// LootJS.lootTables(event=>{
//     event.addBlockModifier('rain:unlucky_block')
//     .addEntry(LootEntry.of("minecraft:apple").withWeight(20).setCount([2, 5]))
// })

// ServerEvents.blockLootTables(e=>{
//     e.modifyBlock('minecraft:dirt',loot=>{
//         let pool = [{
//             "type":"minecraft:item",
//             "name":"minecraft:diamond"
//         }]
//         let arr = loot.pools.get(0).asJsonObject.get("entries").asJsonArray
//         arr.addAll(pool)
//     })
// })
// LootJS.modifiers(event=>{
//     event.addBlockModifier
// })
