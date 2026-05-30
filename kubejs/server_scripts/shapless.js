
ServerEvents.recipes(e=>{
        e.shapeless('occultism:dictionary_of_spirits',['occultism:datura'])
        e.shapeless(Item.of('ae2wtlib:wireless_universal_terminal',1),['merequester:wireless_requester_terminal','ae2wtlib:wireless_pattern_encoding_terminal','extendedae:wireless_ex_pat','ae2:wireless_crafting_terminal','ae2wtlib:wireless_pattern_access_terminal'])
        e.shapeless(Item.of('rain:mini_cobblestone',16),['minecraft:cobblestone','minecraft:cobblestone','minecraft:cobblestone','minecraft:cobblestone'])
        e.shapeless('extendedae:infinity_cobblestone_cell',['rain:fazhang','minecraft:cobblestone']).keepIngredient('rain:fazhang');
        e.shapeless(Item.of('mekanism:bio_fuel',3),['rain:fazhang','minecraft:rotten_flesh']) .keepIngredient('rain:fazhang');
        e.shapeless('minecraft:iron_golem_spawn_egg',['mysticalagriculture:inferium_essence','mysticalagriculture:inferium_essence','mysticalagriculture:inferium_essence','mysticalagriculture:inferium_essence'])
        e.shapeless(Item.of('minecraft:glass_bottle',3),['minecraft:glass','minecraft:glass','minecraft:glass'])
        e.shapeless('rain:void_mixture',['rain:bottle_void','minecraft:ender_pearl']).replaceIngredient({ item: 'rain:bottle_void' }, 'minecraft:glass_bottle')
        e.shapeless('create:hand_crank',['#minecraft:planks','#minecraft:planks','#minecraft:planks','create:andesite_alloy'])
        e.shapeless('create:windmill_bearing',['#minecraft:wooden_slabs','create:andesite_casing','create:shaft'])
        e.shapeless('create:mechanical_press',['create:shaft','create:andesite_casing','minecraft:iron_block'])
        e.shapeless('create:encased_fan',['create:shaft','create:andesite_casing','create:propeller'])
        e.shapeless('create:millstone',['create:cogwheel','create:andesite_casing','create:andesite_casing'])
        e.shapeless('create:mechanical_mixer',['create:cogwheel','create:andesite_casing','create:whisk'])
        e.shapeless('minecraft:bucket',['minecraft:iron_ingot','minecraft:iron_ingot','minecraft:iron_ingot'])
        e.shapeless(Item.of('mekanism:bio_fuel',3),['rain:fazhang','minecraft:spider_eye']).keepIngredient('rain:fazhang')
        e.shapeless(Item.of('mekanism:bio_fuel',3),['rain:fazhang','minecraft:bone']).keepIngredient('rain:fazhang')
        e.shapeless('4x alltheores:enderium_dust',['#c:dusts/lead','#c:dusts/lead','#c:dusts/lead','#c:dusts/platinum','minecraft:ender_pearl','minecraft:ender_pearl','#alltheores:ore_hammers','oritech:enderic_compound','oritech:enderic_compound'])
        e.shapeless('oritech:plastic_sheet',['oritech:plastic_sheet'])
        e.shapeless('industrialforegoing:plastic',['oritech:plastic_sheet'])
        e.shapeless(Item.of('mekanism:bio_fuel',3),['rain:fazhang','minecraft:string']) .keepIngredient('rain:fazhang');
        e.shapeless('custommachinery:custom_machine_item[custommachinery:machine="custommachinery:multi_block_machine"]','rain:god_creation_keepsake')
        e.shapeless('rain:copy_fluid_bucket',['rain:fazhang','minecraft:bucket','rain:copy_fluid_bucket']).keepIngredient('rain:copy_fluid_bucket').keepIngredient('rain:fazhang')
        e.shapeless('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:zombified_piglin"]',['hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:zombie"]','hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:pig"]'])
        e.shapeless('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:zombie"]',['hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:zombie"]','hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:villager"]']).keepIngredient('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:zombie"]')
        e.shapeless('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:allthemodium/piglich"]',['hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:zombified_piglin"]','aether:victory_medal'])
        e.shapeless('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:ars_nouveau/wilden_mobs"]',['ars_nouveau:wilden_spike','ars_nouveau:wilden_wing','ars_nouveau:wilden_horn','ars_nouveau:wilden_tribute'])
        e.shapeless('custommachinery:custom_machine_item[custommachinery:machine="custommachinery:structure_inspector"]',['rain:god_creation_keepsake'])
        e.shapeless('silentgear:netherwood_log',['mysticalagriculture:nether_essence','minecraft:birch_log'])
        e.shapeless('occultism:spirit_fire',['rain:fire','occultism:datura'])

})