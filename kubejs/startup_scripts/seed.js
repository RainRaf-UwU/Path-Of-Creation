// StartupEvents.registry("block", e => {
//     // event.create("rain:test_crop", "crop")
//     //     .age(3,cbb=>{
//     //         cbb.shape(0,0,0,0,16,2,16)
//     //         cbb.shape(1,0,0,0,16,8,16)
//     //         cbb.shape(2,0,0,0,16,12,16)
//     //         cbb.shape(3,0,0,0,16,16,16)
//     //     })
//     //     .growTick((blockstate, random) => {
//     //         return 25;
//     //     })
//     //     .bonemeal(rtc => {     
//     //         return rtc.random.nextInt(2)
//     //     })
//     //     .crop(Item.of("stone"))
//     //     .survive((blockstate, level, pos) => {
//     //         // 判断区块是否被加载
//     //         if (level.isAreaLoaded(pos,1)){
//     //             // 判断是否能够看到天空
//     //             if(level.canSeeSky(pos)){
//     //                 // 获取天空对作物的光照等级是否小于等于8
//     //                 if (level.getBrightness("sky",pos) <= 8){
//     //                     // 判断方块下面是否为下界合金块
//     //                     if (level.getBlockState(pos.below()).is(Blocks.NETHERITE_BLOCK)){
//     //                         return true
//     //                     }
//     //                 }
//     //             }else{
//     //                 // 判断方块产生的光照等级是否小于等于8
//     //                 if (level.getBrightness("block",pos) <= 8){
//     //                     if (level.getBlockState(pos.below()).is(Blocks.NETHERITE_BLOCK)){
//     //                         return true
//     //                     }
//     //                 }
//     //             }
//     //         }
//     //         return false
//     //     })
//     //     .texture("0", "minecraft:block/wheat_stage0")
//     //     .texture("1", "minecraft:block/wheat_stage3")
//     //     .texture("2", "minecraft:block/wheat_stage5")
//     //     .texture("3", "minecraft:block/wheat_stage7")
//     //     .item(seed => seed.texture("minecraft:wheat_seeds"))

//      e.create('rain:allthemodi um_mesh')
//     // .tag('exdeorum:sieve_meshes')
//     .displayName('§6Allthemodium Mesh')
//     // .maxStackSize(64)
//     .texture('rain:item/allthemodium_mesh')
//     // .glow(true);

// })