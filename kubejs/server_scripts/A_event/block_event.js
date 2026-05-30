BlockEvents.placed('minecraft:end_portal_frame',e=>{
    const{block,player} = e

    if (player.offHandItem.id == 'rain:fazhang' &&
        player.mainHandItem.id == 'minecraft:ender_eye'
    ) return
    block.set('minecraft:air')
})


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
// end.forEach(ork>{
    BlockEvents.broken(e=>{
     const{block} = e
        end.forEach(ork=>{
            if(block.id == ork){
                // e.cancel()
                block.set('minecraft:air')
            }
        })
    })
// })
// BlockEvents.broken()