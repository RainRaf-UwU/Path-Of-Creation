ServerEvents.recipes(event => {
    event.custom(
        {
            "type": "lychee:dripstone_dripping",
            "source_block": 'allthemodium:allthemodium_block',
            "target_block": 'minecraft:netherite_block',
            "post": [
                {
                    "type": "place",
                    "block": 'allthemodium:allthemodium_block'
                }
            ]
        }
    )

    event.custom(
        {
            "type": "lychee:dripstone_dripping",
            "source_block": 'minecraft:command_block',
            "target_block":'minecraft:barrier',
            "post": [
                {
                    "type": "drop_item",
                    "id":'allthemodium:unobtainium_nugget'
                }
            ]
        }
    )
})