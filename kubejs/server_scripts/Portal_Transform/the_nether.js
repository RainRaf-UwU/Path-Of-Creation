// ServerEvents.recipes(e=>{
//     e.recipes.portaltransform.item_transform(
//         'minecraft:iron_block',
//         'flowtech:umbrite_nether_ore',
//         [
//                  Byproduct.of('rain:portal_fragment', 0.1, 1, 2) // 副产物 Byproduct.of(副产物, 副产物产出概率, 最小产出数量, 最大产出数量)
//         ], 
//         ["minecraft:overworld", "aether:the_nether"],
//         "any",
//         0.5
//     )
// })

ServerEvents.recipes((event) => {
    const { item_transform } = event.recipes.portaltransform;

    // item_transform("minecraft:cobblestone", "minecraft:prismarine")
    // .chance(0.8)
    // .dimensions(["minecraft:overworld", "minecraft:the_nether"])
    // .byproducts([Byproduct.of("minecraft:redstone", 0.8, 1, 4), Byproduct.of('minecraft:lapis_lazuli', 0.9, 1, 4)])
    // .weather("rain");

    item_transform(
        'minecraft:stone', 
        'allthemodium:ancient_stone',
        [
            Byproduct.of('rain:portal_fragment', 0.1, 1, 2)
        ],
        ["minecraft:overworld", "minecraft:the_nether"]
    );

     item_transform(
        'minecraft:iron_block', 
        'flowtech:umbrite_nether_ore',
        [
            Byproduct.of('rain:portal_fragment', 0.1, 1, 2)
        ],
        ["minecraft:overworld", "minecraft:the_nether"]
    );

     item_transform(
        'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:slime"]', 
        'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:magma_cube"]',
        [
            Byproduct.of('rain:portal_fragment', 0.1, 1, 2)
        ],
        ["minecraft:overworld", "minecraft:the_nether"]
    );

     item_transform(
       'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:pig"]', 
       'hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:hoglin"]',
        [
            Byproduct.of('rain:portal_fragment', 0.1, 1, 2)
        ],
        ["minecraft:overworld", "minecraft:the_nether"]
    );

    // item_transform("minecraft:dirt", "minecraft:stone")
    //     .byproducts([Byproduct.of("minecraft:sand", 0.25, 1, 1)])
    //     .chance(0.5);

    // item_transform("minecraft:stone", "minecraft:diamond").time("night").chance(0.01);
})