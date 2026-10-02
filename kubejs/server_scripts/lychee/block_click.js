ServerEvents.recipes(e=>{
   e.custom(
        {
            "type": "lychee:block_clicking",
            "item_in": {
                "item":'minecraft:snow_block'
            },
            "block_in": 'naturesaura:conversion_catalyst',
            "post": [
                {
                    "type": "drop_item",
                    "id": 'mysticalagriculture:ice_essence',
                    "count": 1,
                    "if": {
                        "type": "chance",
                        "chance": 0.5
                    }
                }
            ]
        }
    )

    e.custom(
        {
            "type": "lychee:block_clicking",
            "item_in": {},
            "block_in":'minecraft:cobblestone',
            "post":[
                {
                    "type": "place",
                    "block": 'minecraft:water',
                    "if": {
                        "type": "chance",
                        "chance": 0.005
                    }
                }
            ]
        }
    )

     e.custom(
        {
            "type": "lychee:block_clicking",
            "item_in": {"item":'mysticalagriculture:dirt_seeds'},
            "block_in":'minecraft:cobblestone',
            "post":[
                {
                    "type": "drop_item",
                    "id":'mysticalagriculture:stone_seeds'
                }
            ]
        }
    )

    e.custom(
        {
            "type": "lychee:block_clicking",
            "item_in": {
                "item":'ae2:terminal'
            },
            "block_in": 'naturesaura:conversion_catalyst',
            "post": [
                {
                    "type": "drop_item",
                    "id": 'ae2:pattern_encoding_terminal',
                    "count": 1
                    
                },
                {
                    "type": "drop_item",
                    "id":'ae2:crafting_terminal',
                    "count": 1
                    
                }
            ]
        }
    )

})
