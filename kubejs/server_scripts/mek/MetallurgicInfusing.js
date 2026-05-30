ServerEvents.recipes(e=>{
    // e.recipes.mekanismMetallurgicInfusing(output, inputItem, infusionInput, infusionAmount)
    e.recipes.mekanismMetallurgicInfusing('mekanism:basic_control_circuit','justdirethings:eclipsealloy_ingot','10x mekanism:refined_obsidian','10x mekanism:refined_obsidian')
    const list_1 = [
        ['mekanism:advanced_control_circuit','mekanism:basic_control_circuit','10x rain:atm_infused'],
        ['mekanism:elite_control_circuit','mekanism:advanced_control_circuit','10x rain:vibranium_infused'],
        ['mekanism:ultimate_control_circuit','mekanism:elite_control_circuit','10x rain:unobtainium_infused']
    ]

    list_1.forEach(([output, inputItem, infusionInput])=>{
        e.recipes.mekanismMetallurgicInfusing(output, inputItem, infusionInput, infusionInput)
    })
})