ServerEvents.recipes(event => {
    const { kubejs } = event.recipes

    const add = [
        'minecraft:torchflower_seeds',
        'minecraft:pitcher_pod'
    ]

    add.forEach(item => {
        event.custom(
            {
                type: "farmingforblockheads:market",
                category: "farmingforblockheads:seeds",
                preset: 'farmingforblockheads:custom_presets',
                result: {
                    item: item
                }
            }
        )
    });
})