ServerEvents.recipes(e=>{
    // e.recipes.mekanismCompressing('rain:compress_scrap_box','64x mekmm:scrap_box',{chemical:'rain:transmutation_gas',amount: 200})
    e.custom({
        "type":"mekanism:compressing",
        "chemical_input":{"amount":1,"chemical":'rain:transmutation_gas'},
        "item_input":{"count":64,"item":'mekmm:scrap_box'},
        "output":{"count":1,"id":'rain:compress_scrap_box'},
        "per_tick_usage":true
    })

    e.custom({
        "type":"mekanism:compressing",
        "chemical_input":{"amount":1,"chemical":'mekanism:fissile_fuel'},
        "item_input":{"count":64,"item":'rain:compress_scrap_box'},
        "output":{"count":1,"id":'avaritia:singularity'},
        "per_tick_usage":true
    })
})