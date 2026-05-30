ServerEvents.recipes(e=>{
    e.custom({
        "type":"mekanism:oxidizing",
        "input":{"count":1,"tag":'c:dusts/allthemodium'},
        "output":{"amount":10,"id":"rain:atm_infused"}
    })

    e.custom({
        "type":"mekanism:oxidizing",
        "input":{"count":1,"item":'rain:enriched_atm'},
        "output":{"amount":80,"id":"rain:atm_infused"}
    })

    e.custom({
        "type":"mekanism:oxidizing",
        "input":{"count":1,"tag":'c:dusts/vibranium'},
        "output":{"amount":10,"id":"rain:vibranium_infused"}
    })

    e.custom({
        "type":"mekanism:oxidizing",
        "input":{"count":1,"item":'rain:enriched_vibranium'},
        "output":{"amount":80,"id":"rain:vibranium_infused"}
    })

     e.custom({
        "type":"mekanism:oxidizing",
        "input":{"count":1,"tag":'c:dusts/unobtainium'},
        "output":{"amount":10,"id":"rain:unobtainium_infused"}
    })

     e.custom({
        "type":"mekanism:oxidizing",
        "input":{"count":1,"item":'rain:enriched_unobtainium_infused'},
        "output":{"amount":80,"id":"rain:unobtainium_infused"}
    })
    
    
})