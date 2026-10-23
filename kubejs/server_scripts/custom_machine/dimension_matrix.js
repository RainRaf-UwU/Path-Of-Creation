// 图纸、原生结构检查及离线预览共用这一份 11×11×11 坐标。
ServerEvents.recipes(event => {
  const structure = JsonIO.read('kubejs/data/rain/dimension_matrix/structure.json');
  const controller = Item.of('custommachinery:custom_machine_item[custommachinery:machine="custommachinery:dimension_matrix"]');

  event.shaped(controller, ['ACA', 'BDB', 'AEA'], {
    A: 'mekanism:alloy_atomic', B: 'mekanism:teleportation_core',
    C: 'mekanism:ultimate_control_circuit', D: 'rain:solid_dim_core',
    E: 'minecraft:netherite_ingot'
  }).id('rain:dimension_matrix/controller');
  event.shaped('8x rain:dimension_matrix_casing', ['SSS', 'SIS', 'SSS'], {
    S: '#c:ingots/steel', I: 'minecraft:obsidian'
  }).id('rain:dimension_matrix/casing');
  event.shaped('8x rain:dimension_matrix_frame', ['S S', ' O ', 'S S'], {
    S: '#c:ingots/steel', O: 'rain:dimension_matrix_casing'
  }).id('rain:dimension_matrix/frame');
  event.shaped('8x rain:dimension_matrix_conduit', ['CCC', 'FRF', 'CCC'], {
    C: 'rain:dimension_matrix_casing', F: 'ae2:fluix_crystal', R: 'minecraft:redstone_block'
  }).id('rain:dimension_matrix/conduit');
  event.shaped('4x rain:dimension_matrix_anchor', ['FCF', 'AEA', 'FCF'], {
    F: 'rain:dimension_matrix_frame', C: 'ae2:fluix_crystal',
    A: 'mekanism:alloy_atomic', E: 'minecraft:ender_eye'
  }).id('rain:dimension_matrix/anchor');
  ['input','output'].forEach(mode => {
    event.shaped('poc_dimension_matrix:energy_' + mode + '_port', ['CGC','RHR','CBC'], {
      C: 'rain:dimension_matrix_casing', G: 'minecraft:gold_ingot', R: 'minecraft:redstone',
      H: mode === 'input' ? 'minecraft:hopper' : 'minecraft:piston',
      B: 'mekanism:basic_control_circuit'
    }).id('rain:dimension_matrix/energy_' + mode + '_port');
  });
  event.shaped('poc_dimension_matrix:projection_module',['GFG','ACA','RER'],{
    G:'minecraft:tinted_glass',F:'ae2:fluix_crystal',A:'rain:dimension_matrix_casing',C:'ae2:quartz_vibrant_glass',R:'minecraft:redstone_block',E:'mekanism:elite_control_circuit'
  }).id('rain:dimension_matrix/projection_module');
  event.shaped('poc_dimension_matrix:coolant_input_port',['CGC','BHB','CPC'],{
    C:'rain:dimension_matrix_casing',G:'minecraft:glass',B:'minecraft:iron_ingot',H:'mekanism:basic_fluid_tank',P:'minecraft:bucket'
  }).id('rain:dimension_matrix/coolant_input_port');

  // 独立共振产物，不替换现有科技配方；60秒、32,768 FE/t。
  event.recipes.custommachinery.custom_machine('custommachinery:dimension_matrix', 1200)
    .requireStructure(structure.pattern, structure.keys)
    .requireEnergyPerTick(32768)
    .requireItem('16x minecraft:ender_pearl')
    .requireItem('16x minecraft:amethyst_shard')
    .requireItem('4x ae2:fluix_crystal')
    .produceItem('rain:dimension_resonance_crystal')
    .id('rain:dimension_matrix/dimensional_resonance');
});
