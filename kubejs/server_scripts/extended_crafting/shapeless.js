ServerEvents.recipes(event => {
    const { kubejs,extendedcrafting } = event.recipes
        event.custom(
            {
                "type": "extendedcrafting:shapeless_table",
                "ingredients": [
                    {
                        "item": 'minecraft:stone_sword'
                    },
                    {
                        "item": 'minecraft:stone_shovel'
                    },
                    {
                        "item": 'minecraft:stone_axe'
                    }, 
                    {
                        "item": 'minecraft:stone_hoe'
                    },
                     {
                        "item": 'minecraft:stone_pickaxe'
                    }
                ],
                "result": {
                    "id": 'actuallyadditions:stone_aiot'
                }
            }
        )

        event.custom(
            {
                "type": "extendedcrafting:shapeless_table",
                "ingredients": [
                    {
                        "item": 'minecraft:iron_shovel'
                    },
                    {
                        "item": 'minecraft:iron_pickaxe'
                    },
                    {
                        "item":'minecraft:iron_axe'
                    }, 
                    {
                        "item": 'minecraft:iron_hoe'
                    },
                     {
                        "item": 'minecraft:iron_sword'
                    }
                ],
                "result": {
                    "id": 'actuallyadditions:iron_aiot'
                }
            }
        )

        event.custom(
            {
                "type": "extendedcrafting:shapeless_table",
                "ingredients": [
                    {
                        "item": 'minecraft:cactus'
                    },
                    {
                        "item": 'minecraft:cactus'
                    },
                    {
                        "tag":'c:storage_blocks/silicon'
                    }, 
                    {
                        "item": 'minecraft:bone_meal'
                    },
                     {
                        "item": 'minecraft:glowstone_dust'
                    },{
                        "item":'minecraft:slime_ball'
                    }
                ],
                "result": {
                    "id": 'appflux:insulating_resin'
                }
            }
        )

        //寰宇肉丸

        event.remove({output:'avaritia:cosmic_meatballs'})
        
        event.custom({
            "type": "extendedcrafting:shapeless_table",
            "ingredients":[
                {"item":'farmersdelight:horse_feed'},
                {"item":'farmersdelight:dog_food'},
                {"item":'farmersdelight:rice_roll_medley_block'},
                {"item":'farmersdelight:shepherds_pie'},
                {"item":'farmersdelight:shepherds_pie_block'},
                {"item":'farmersdelight:honey_glazed_ham'},
                {"item":'farmersdelight:steak_and_potatoes'},
                {"item":'farmersdelight:squid_ink_pasta'},
                {"item":'farmersdelight:ratatouille'},
                {"item":'farmersdelight:grilled_salmon'},
                {"item":'farmersdelight:roast_chicken_block'},
                {"item":'farmersdelight:roast_chicken'},
                {"item":'farmersdelight:stuffed_pumpkin_block'},
                {"item":'farmersdelight:stuffed_pumpkin'},
                {"item":'farmersdelight:honey_glazed_ham_block'},
                {"item":'farmersdelight:vegetable_noodles'},
                {"item":'farmersdelight:roasted_mutton_chops'},
                {"item":'farmersdelight:mushroom_rice'},
                {"item":'farmersdelight:pasta_with_mutton_chop'},
                {"item":'farmersdelight:pasta_with_meatballs'},
                {"item":'farmersdelight:bacon_and_eggs'},
                {"item":'farmersdelight:noodle_soup'},
                {"item":'farmersdelight:baked_cod_stew'},
                {"item":'farmersdelight:pumpkin_soup'},
                {"item":'farmersdelight:kelp_roll'},
                {"item":'farmersdelight:kelp_roll_slice'},
                {"item":'farmersdelight:cooked_rice'},
                {"item":'farmersdelight:bone_broth'},
                {"item":'farmersdelight:beef_stew'},
                {"item":'farmersdelight:chicken_soup'},
                {"item":'farmersdelight:vegetable_soup'},
                {"item":'farmersdelight:fish_stew'},
                {"item":'farmersdelight:fried_rice'},
                {"item":'farmersdelight:cod_roll'},
                {"item":'farmersdelight:salmon_roll'},
                {"item":'farmersdelight:cabbage_rolls'},
                {"item":'farmersdelight:stuffed_potato'},
                {"item":'farmersdelight:dumplings'},
                {"item":'farmersdelight:mutton_wrap'},
                {"item":'farmersdelight:bacon_sandwich'},
                {"item":'farmersdelight:hamburger'},
                {"item":'farmersdelight:hamburger'},
                {"item":'farmersdelight:sweet_berry_cookie'},
                {"item":'farmersdelight:honey_cookie'},
                {"item":'farmersdelight:melon_popsicle'}


            ],
            "result": {
                    "id": 'avaritia:cosmic_meatballs'
                }
        })

        event.custom({
            "type": "extendedcrafting:shapeless_table",
            "ingredients":[
                {"item":'minecraft:green_dye'},
                {"item":'minecraft:cyan_dye'},
                {"item":'minecraft:light_blue_dye'},
                {"item":'minecraft:blue_dye'},
                {"item":'minecraft:purple_dye'},
                {"item":'minecraft:magenta_dye'},
                {"item":'minecraft:pink_dye'},
                {"item":'minecraft:lime_dye'},
                {"item":'minecraft:yellow_dye'},
                {"item":'minecraft:orange_dye'},
                {"item":'minecraft:red_dye'},
                {"item":'minecraft:white_dye'},
                {"item":'minecraft:light_gray_dye'},
                {"item":'minecraft:gray_dye'},
                {"item":'minecraft:black_dye'},
                {"item":'minecraft:brown_dye'},
                {"item":'mysticalagriculture:prosperity_seed_base'},
                {"item":'mysticalagriculture:inferium_essence'},
                {"item":'mysticalagriculture:inferium_essence'},
                {"item":'mysticalagriculture:inferium_essence'}
            ],
            "result": {
                    "id": 'mysticalagriculture:dye_seeds'
                }
        })
})