ServerEvents.recipes(e=>{
    e.custom({
        "type":"mekanism:rotary",
        "chemical_input":{"amount":1,"chemical":"rain:transmutation_gas"},
        "chemical_output":{"amount":1,"id":"rain:transmutation_gas"},
        "fluid_input":{"amount":1,"fluid":"rain:transmutation_fluid"},
        "fluid_output":{"amount":1,"id":"rain:transmutation_fluid"}
    })

    e.custom({
        "type":"mekanism:rotary",
        "chemical_input":{"amount":1,"chemical":"rain:empowered_oil_gas"},
        "chemical_output":{"amount":1,"id":"rain:empowered_oil_gas"},
        "fluid_input":{"amount":1,"fluid":"actuallyadditions:empowered_oil"},
        "fluid_output":{"amount":1,"id":"actuallyadditions:empowered_oil"}
    })

    e.custom({
        "type":"mekanism:rotary",
        "chemical_input":{"amount":1,"chemical":"mekanism:nuclear_waste"},
        "chemical_output":{"amount":1,"id":"mekanism:nuclear_waste"},
        "fluid_input":{"amount":1,"fluid":"rain:unclear_waste"},
        "fluid_output":{"amount":1,"id":"rain:unclear_waste"}
    })

     e.custom({
        "type":"mekanism:rotary",
        "chemical_input":{"amount":1,"chemical":"mekanism:spent_nuclear_waste"},
        "chemical_output":{"amount":1,"id":"mekanism:spent_nuclear_waste"},
        "fluid_input":{"amount":1,"fluid":"rain:spent_unclear_waste"},
        "fluid_output":{"amount":1,"id":"rain:spent_unclear_waste"}
    })

     e.custom({
        "type":"mekanism:rotary",
        "chemical_input":{"amount":1,"chemical":"mekmm:uu_matter"},
        "chemical_output":{"amount":1,"id":"mekmm:uu_matter"},
        "fluid_input":{"amount":1,"fluid":"rain:uu_material"},
        "fluid_output":{"amount":1,"id":"rain:uu_material"}
    })

    e.custom({
        "type":"mekanism:rotary",
        "chemical_input":{"amount":1,"chemical":"rain:remmant_gas"},
        "chemical_output":{"amount":1,"id":"rain:remmant_gas"},
        "fluid_input":{"amount":1,"fluid":"rain:remmant"},
        "fluid_output":{"amount":1,"id":"rain:remmant"}
    })

    e.custom({
        "type":"mekanism:rotary",
        "chemical_input":{"amount":1,"chemical":"mekanism:antimatter"},
        "chemical_output":{"amount":1,"id":"mekanism:antimatter"},
        "fluid_input":{"amount":1,"fluid":"rain:antimatter_fluid"},
        "fluid_output":{"amount":1,"id":"rain:antimatter_fluid"}
    })

    e.custom({
        "type":"mekanism:rotary",
        "chemical_input":{"amount":1,"chemical":"rain:void_gas"},
        "chemical_output":{"amount":1,"id":"rain:void_gas"},
        "fluid_input":{"amount":1,"fluid":"rain:void_fluid"},
        "fluid_output":{"amount":1,"id":"rain:void_fluid"}
    })
})