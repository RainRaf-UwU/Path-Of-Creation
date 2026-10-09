// JEI pages for event-driven world interactions. Every recipe is ghost-only:
// actual behavior remains in A_event/*.js, lootjs/lootjs.js and lychee/*.js.
// https://lycheetweaker.readthedocs.io/en/1.21/recipe/#basic-format
ServerEvents.recipes(event => {
    const staff = { item: 'rain:fazhang' }
    const anyItem = { type: 'lychee:always_true' }
    const item = id => ({ item: id })
    const drop = (id, count) => ({ type: 'drop_item', id: id, count: count || 1 })
    const dropModel = id => ({
        type: 'drop_item', id: 'hostilenetworks:data_model',
        components: { 'hostilenetworks:data_model': id }
    })
    const place = block => ({ type: 'place', block: block })
    const display = (id, type, inputs, block, post) => {
        event.custom({
            type: 'lychee:' + type,
            ghost: true,
            item_in: inputs,
            block_in: block,
            post: post,
            comment: 'jei.rain.world_interaction.' + id
        }).id('rain:jei/world_interaction/' + id)
    }
    const right = (id, inputs, block, post) => display(id, 'block_interacting', inputs, block, post)
    const left = (id, inputs, block, post) => display(id, 'block_clicking', inputs, block, post)

    // A_event/Click.js: preserve the hand order and actual output counts.
    ;['mangrove', 'oak'].forEach(wood => {
        right(wood + '_slabs', { tag: 'minecraft:axes' }, 'minecraft:' + wood + '_planks',
            [drop('minecraft:' + wood + '_slab', 2)])
    })
    right('cobblestone', staff, 'extendedcrafting:ultimate_table', [drop('minecraft:cobblestone', 8)])
    right('bottle_void', item('minecraft:glass_bottle'), 'minecraft:air', [drop('rain:bottle_void')])
    right('bedrock', staff, 'minecraft:bedrock', [drop('minecraft:bedrock')])
    left('skeleton_skull', staff, 'minecraft:bone_block', [place('minecraft:skeleton_skull')])
    right('villager', [item('ars_nouveau:summon_focus'), item('mysticalagriculture:dye_essence')],
        'minecraft:grass_block', [place('allthemodium:allthemodium_block'), 'run "summon minecraft:villager"'])
    right('tallow', item('occultism:butcher_knife'), 'minecraft:air', [drop('occultism:tallow')])
    right('black_hole', staff, 'oritech:black_hole_block', [drop('oritech:black_hole_block')])
    right('aura', item('mysticalagriculture:nature_essence'), 'rain:aura_generate_machine', [])
    right('cow', [item('easy_villagers:villager'), staff], 'allthemodium:allthemodium_block',
        ['run "summon minecraft:cow"'])
    right('steel_seeds', [item('mysticalagriculture:iron_seeds'), staff], 'oritech:black_hole_block',
        [drop('mysticalagriculture:steel_seeds')])
    right('nature_essence_cod', [item('mysticalagriculture:nature_essence'), { tag: 'c:tools/fishing_rod' }],
        'minecraft:air', [{
            type: 'drop_item', id: 'hostilenetworks:data_model',
            components: { 'hostilenetworks:data_model': 'hostilenetworks:cod' },
            if: { type: 'chance', chance: 0.1 }
        }])
    right('whirlisprig', [item('ars_nouveau:summon_focus'), staff], 'minecraft:grass_block',
        [dropModel('hostilenetworks:ars_nouveau/whirlisprig')])
    right('mimic', [item('hostilenetworks:blank_data_model'), staff], 'minecraft:chest',
        [dropModel('hostilenetworks:artifacts/mimic')])
    right('slime', [item('hostilenetworks:blank_data_model'), staff], 'industrialforegoing:pink_slime_block',
        [dropModel('hostilenetworks:slime')])
    ;['barrier', 'command_block', 'chain_command_block', 'repeating_command_block'].forEach(block => {
        left('collect_' + block, anyItem, 'minecraft:' + block, [drop('minecraft:' + block)])
    })
    right('fluid_processing', staff, 'minecraft:barrier', [{
        type: 'drop_item', id: 'custommachinery:custom_machine_item',
        components: { 'custommachinery:machine': 'custommachinery:fluid_processing' }
    }])
    // The existing Lychee page covers the separate 50% roll; this event always drops one.
    left('ice_essence', item('minecraft:snow_block'), 'naturesaura:conversion_catalyst',
        [drop('mysticalagriculture:ice_essence')])
    right('chain_command_block', item('minecraft:debug_stick'), 'minecraft:command_block',
        [place('minecraft:chain_command_block')])
    right('command_block', item('minecraft:debug_stick'), 'minecraft:chain_command_block',
        [place('minecraft:command_block')])
    ;['command_block', 'chain_command_block', 'repeating_command_block'].forEach(block => {
        right('place_' + block, item('minecraft:' + block), '*',
            [{ type: 'place', block: 'minecraft:' + block, offsetY: 1 }])
    })
    right('fire', item('rain:fire'), '*', [{ type: 'place', block: 'minecraft:fire', offsetY: 1 }])

    // A_event/command_block_event.js: chance and dynamic components are explained in the badge.
    right('command_block_minecart', [item('hostilenetworks:blank_data_model'), item('minecraft:minecart')],
        'minecraft:command_block', [{
            type: 'drop_item', id: 'hostilenetworks:data_model',
            components: { 'hostilenetworks:data_model': 'hostilenetworks:command_block_minecart' },
            if: { type: 'chance', chance: 0.01 }
        }])
    right('debug_stick', item('naturesaura:ancient_stick'), 'minecraft:command_block',
        [drop('minecraft:debug_stick')])
    right('time_in_a_bottle', item('tiab:time_in_a_bottle'), 'minecraft:command_block',
        [drop('tiab:time_in_a_bottle')])
    // Any model's entity is chosen dynamically by the original handler.
    right('summon_model', [item('hostilenetworks:data_model'), item('ars_nouveau:summon_focus')],
        'minecraft:command_block', [])
    right('remove_radiation', [item('rain:radiation_ning'), staff], 'minecraft:command_block', [])
    right('repeating_command_block', anyItem, 'minecraft:chain_command_block',
        [place('minecraft:repeating_command_block')])

    // lootjs/lootjs.js: fishing results are independent 25% rolls.
    ;['cod', 'squid'].forEach(entity => {
        right('fishing_' + entity, { tag: 'c:tools/fishing_rod' }, 'minecraft:water', [{
            type: 'drop_item', id: 'hostilenetworks:data_model',
            components: { 'hostilenetworks:data_model': 'hostilenetworks:' + entity },
            if: { type: 'chance', chance: 0.25 }
        }])
    })

    // Lightning commands replace blocks in a 7x7x7 area. Their command-only pages
    // do not index the real results, so add ghost pages with block inputs/outputs.
    const lightning = [
        ['redstone_block', 'minecraft:iron_block', 'minecraft:redstone_block'],
        ['obsidian', 'minecraft:cobblestone', 'minecraft:obsidian'],
        ['solar_panel', 'minecraft:gold_block', 'solarflux:sp_4'],
        ['interface', 'minecraft:hopper', 'ae2:interface'],
        ['machine_frame_simple', 'industrialforegoing:machine_frame_pity', 'industrialforegoing:machine_frame_simple']
    ]
    ;['enori', 'restonia', 'palis', 'diamatine', 'void', 'emeradic'].forEach(crystal => {
        lightning.push(['empowered_' + crystal, 'actuallyadditions:' + crystal + '_crystal_block',
            'actuallyadditions:empowered_' + crystal + '_crystal_block'])
    })
    lightning.forEach(row => {
        event.custom({
            type: 'lychee:lightning_channeling', ghost: true,
            // LightningChannelingRecipe has no block_in field. These item icons
            // represent placed blocks, as explained by the comment (never loose items).
            item_in: item(row[1]), post: [place(row[2])],
            comment: 'jei.rain.world_interaction.lightning_' + row[0]
        }).id('rain:jei/world_interaction/lightning_' + row[0])
    })
})
