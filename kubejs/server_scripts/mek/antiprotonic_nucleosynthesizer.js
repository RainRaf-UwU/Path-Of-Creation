ServerEvents.recipes(e=>{


    //[input_gas,num,time,input_item,num,output_item,num]
    const list_1 = [
        ["mekanism:antimatter",5,500,'allthemodium:allthemodium_ingot',1,'allthemodium:unobtainium_allthemodium_alloy_ingot',1],
        ["mekanism:antimatter",100,1000,'allthemodium:allthemodium_block',1,'allthemodium:unobtainium_allthemodium_alloy_block',1],
        ["mekanism:antimatter",5,500,'allthemodium:vibranium_ingot',1,'allthemodium:unobtainium_vibranium_alloy_ingot',1],
        ["mekanism:antimatter",100,1000,'allthemodium:vibranium_block',1,'allthemodium:unobtainium_vibranium_alloy_block',1],
        ["rain:empowered_oil_gas",10000,500,'mekmm:empty_crystal',64,'mekmm:uu_matter',1]

    ]

    list_1.forEach(([input_gas,num1,time,input_item,num2,output_item,num3])=>{
        e.custom({
        "type":"mekanism:nucleosynthesizing",
        "chemical_input":{"amount":num1,"chemical":input_gas},
        "duration":time,
        "item_input":{"count":num2,"item":input_item},
        "output":{"count":num3,"id":output_item},
        "per_tick_usage":false
    })
    })

    // e.custom({
    //     "type":"mekanism:nucleosynthesizing",
    //        "fluid_input": {
    //                 "amount": 1000,
    //                 "fluid": "actuallyadditions:empowered_oil"
    //             },
    //     "duration":500,
    //     "item_input":{"count":1,"item":'allthemodium:unobtainium_ingot'},
    //     "output":{"count":1,"id":'allthemodium:vibranium_allthemodium_alloy_ingot'},
    //     "per_tick_usage":false
    // })

   
})