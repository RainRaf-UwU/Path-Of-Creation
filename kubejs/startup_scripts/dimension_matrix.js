// 独立结构件；控制器由 Custom Machinery 注册。
StartupEvents.registry('block', event => {
  ['casing', 'frame', 'conduit', 'anchor'].forEach(part => {
    event.create('rain:dimension_matrix_' + part)
      .hardness(5).resistance(12).soundType('metal')
      .requiresTool(true).tagBlock('minecraft:mineable/pickaxe')
      .tagBlock('minecraft:needs_iron_tool');
  });
});

StartupEvents.registry('item', event => {
  event.create('rain:dimension_resonance_crystal').glow(true);
});
