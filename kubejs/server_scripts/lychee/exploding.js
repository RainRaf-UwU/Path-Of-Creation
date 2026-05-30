// ServerEvents.recipes(event => {
//     event.custom(
//         {
//             type: "lychee:block_exploding",
//             block_in: 'minecraft:iron_ore',
//             post: [
//                 {
//                     type: "prevent_default"
//                 },
//                 {
//                     type: "random",
//                     rolls: {
//                         min: 1,
//                         max: 1
//                     },
//                     entries: [
//                         {
//                             type: "drop_item",
//                             id: 'ae2:interface',
//                             count: 1,
//                             if: {
//                                 type: "chance",
//                                 chance: 0.5
//                             }
//                         },
//                         {
//                             type: "drop_item",
//                             id: 'ae2:export_bus',
//                             count: 1,
//                             if: {
//                                 type: "chance",
//                                 chance: 0.5
//                             }
//                         },
//                         {
//                             type: "drop_item",
//                             id: 'ae2:import_bus',
//                             count: 1,
//                             if: {
//                                 type: "chance",
//                                 chance: 0.5
//                             }
//                         }
//                     ]
//                 }
//             ]
//         }
//     )
// })

 ServerEvents.recipes(e=>{
    e.custom({
         type: "lychee:block_exploding",
            block_in: 'minecraft:coal_block',
            post: [
                {
                    type: "prevent_default"
                },
                {
                    type: "random",
                    rolls: {
                        min: 1,
                        max: 1
                    },
                    entries: [
                        {
                            type: "drop_item",
                            id: 'minecraft:diamond',
                            count: 1,
                            if: {
                                type: "chance",
                                chance: 0.5
                            }
                        }
                    ]
                }
            ]
    })
 })