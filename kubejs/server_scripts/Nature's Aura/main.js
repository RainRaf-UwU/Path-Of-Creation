ServerEvents.recipes(e=>{
     const { naturesaura } = e.recipes

     naturesaura.altar('aether:zanite_block','minecraft:amethyst_block', 5000, 60, 'naturesaura:crushing_catalyst')

     naturesaura.offering('rain:god_creation_keepsake','rain:fazhang', 'naturesaura:calling_spirit')




      naturesaura.tree_ritual('ars_caelum:ritual_conjure_island_sculk', 
      ['naturesaura:gold_leaf', 
      'naturesaura:gold_leaf', 
      'diamond',
      'minecraft:emerald',
      'minecraft:emerald',
      'alltheores:enderium_ingot',
      'alltheores:enderium_ingot'],
      'occultism:otherworld_sapling')

      naturesaura.altar('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:snow_golem"]','hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:iron_golem"]', 5000, 60, 'naturesaura:conversion_catalyst')
      naturesaura.altar('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:ghast"]','hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:polar_bear"]', 5000, 60, 'naturesaura:conversion_catalyst')
      naturesaura.altar('hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:shulker"]','hostilenetworks:data_model[hostilenetworks:data_model="hostilenetworks:artifacts/mimic"]', 5000, 60, 'naturesaura:conversion_catalyst')


})