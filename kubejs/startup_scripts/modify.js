ItemEvents.modification(e=>{
    const maxStackSizeitem = ['minecraft:egg','minecraft:debug_stick','minecraft:minecart','minecraft:lingering_potion','minecraft:splash_potion',"minecraft:potion",'minecraft:ender_pearl', 'minecraft:snowball', 'powah:charged_snowball']
    e.modify(maxStackSizeitem, item => {
        item.maxStackSize = 64
        // item.setFood()
    })


    })