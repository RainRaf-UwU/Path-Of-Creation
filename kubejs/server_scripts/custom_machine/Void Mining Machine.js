ServerEvents.recipes(event => {

  const structure_block = [
    [
["aaaaa","aaaaa","aaaaa","aaaaa","aaaaa"],
["  b  "," ccc ","bcccb"," cdc ","  m  "],
["     "," ccc "," ccc "," ccc ","     "],
["     "," eee "," ege "," eee ","     "],
["     ","     ","  h  ","     ","     "]
   ],
   [
["             ","             ","             ","             ","             ","             ","      a      ","             ","             ","             ","             ","             ","             "],
["             ","             ","             ","             ","             ","      a      ","     aba     ","      a      ","             ","             ","             ","             ","             "],
["             ","             ","             ","             ","      a      ","     aba     ","    abbba    ","     aba     ","      a      ","             ","             ","             ","             "],
["             ","             ","             ","      a      ","     aca     ","    accca    ","   accccca   ","    accca    ","     aca     ","      a      ","             ","             ","             "],
["             ","             ","      a      ","     ada     ","    addda    ","   addddda   ","  adddeddda  ","   addddda   ","    addda    ","     ada     ","      a      ","             ","             "],
["             "," ff       ff "," f         f ","             ","             ","             ","      m      ","             ","             ","             "," f         f "," ff       ff ","             "],
[" ff       ff ","fggdddddddggf","fgddhhhhhddgf"," ddh     hdd "," dh       hd "," dh       hd "," dh       hd "," dh       hd "," dh       hd "," ddh     hdd ","fgddhhhhhddgf","fggdddddddggf"," ff       ff "],
[" ff       ff ","fgghhhhhhhggf","fghh     hhgf"," hh       hh "," h         h "," h         h "," h         h "," h         h "," h         h "," hh       hh ","fghh     hhgf","fgghhhhhhhggf"," ff       ff "],
["             "," ff       ff "," f         f ","             ","             ","             ","             ","             ","             ","             "," f         f "," ff       ff ","             "]
],
[
["                  ","                  ","  aaaaaaaaaaaaaa  ","  aaaaaaaaaaaaaa  ","  aaaaaaaaaaaaaa  ","  aaaaaaaaaaaaaa  ","  aaaaaaaaaaaaaa  ","  aaaaaaaaaaaaaa  ","  aaaaaaaaaaaaaa  ","  aaaaaaaaaaaaaa  ","  aaaaaaaaaaaaaa  ","  aaaaaaaaaaaaaa  ","  aaaaaaaaaaaaaa  ","  aaaaaaaaaaaaaa  ","  aaaaaaaaaaaaaa  ","  aaaaaaaaaaaaaa  ","                  ","                  "],
["                  ","                  ","  bbbbbbbbbbbbbb  ","  bbbbbbbbbbbbbb  ","  cccccccccccccc  ","  dddddddddddddd  ","  eeeeeeeeeeeeee  ","  ffffffffffffff  ","  gggggggggggggg  ","  hhhhhhhhhhhhhh  ","  iiii iiiiiiiii  ","  jjjjjjjjjjjjjj  ","  kkkkkkkkkkkkkk  ","  llllllllllllll  ","  nnnnnnnnnnnnnn  ","  oooooooooooooo  ","                  ","                  "],
["                  ","                  ","  pppppppppppppp  ","  pqqqqqqqqqqqqp  ","  pqqqqqqqqqqqqp  ","  pqqqqqqqqqqqqp  ","  pqqqqqqqqqqqqp  ","  pqqqqqqqqqqqqp  ","  pqqqqqrrqqqqqp  ","  pqqqqqrrqqqqqp  ","  pqqqq qqqqqqqp  ","  pqqqqqqqqqqqqp  ","  pqqqqqqqqqqqqp  ","  pqqqqqqqqqqqqp  ","  pqqqqqqqqqqqqp  ","  pppppppppppppp  ","                  ","                  "],
["                  ","                  ","  pppppppppppppp  ","  p            p  ","  p            p  ","  p            p  ","  p            p  ","  p    rrrr    p  ","  p    rrrr    p  ","  p    rrrr    p  ","  p    rrrr    p  ","  p            p  ","  p            p  ","  p            p  ","  p            p  ","  pppppppppppppp  ","                  ","                  "],
["                  ","                  ","  pppp ppppppppp  ","  p            p  ","  p            p  ","  p            p  ","  p   rrrrrr   p  ","  p   rrrrrr   p  ","  p   rrrrrr   p  ","  p   rrrrrr   p  ","  p   rrrrrr   p  ","  p   rrrrrr   p  ","  p            p  ","  p            p  ","  p            p  ","  pppppppppppppp  ","                  ","                  "],
["                  ","                  ","  pppppppppppppp  ","  p            p  ","  p            p  ","  p  rrrrrrrr  p  ","  p  rrrrrrrr  p  ","  p  rrrrrrrr  p  ","  p  rrrrrrrr  p  ","  p  rrrrrrrr  p  ","  p  rrrrrrrr  p  ","  p  rrrrrrrr  p  ","  p  rrrrrrrr  p  ","  p            p  ","  p            p  ","  pppppppppppppp  ","                  ","                  "],
["                  ","                  ","  pppppppppppppp  ","  p            p  ","  p rrrrrrrrrr p  ","  p rrrrrrrrrr p  ","  p rrrrrrrrrr p  ","  p rrrrrrrrrr p  ","  p rrrrrrrrrr p  ","  p rrrrrrrrrr p  ","  p rrrrrrrrrr p  ","  p rrrrrrrrrr p  ","  p rrrrrrrrrr p  ","  p rrrrrrrrrr p  ","  p            p  ","  pppppppppppppp  ","                  ","                  "],
["                  ","                  ","  ssssssssssssss  ","  srrrrrrrrrrrrs  ","  srrrrrrrrrrrrs  ","  srrrrrrrrrrrrs  ","  srrrrrrrrrrrrs  ","  srrrrrrrrrrrrs  ","  srrrrrrrrrrrrs  ","  srrrrrrrrrrrrs  ","  srrrrrrrrrrrrs  ","  srrrrrrrrrrrrs  ","  srrrrrrrrrrrrs  ","  srrrrrrrrrrrrs  ","  srrrrrrrrrrrrs  ","  ssssssssssssss  ","                  ","                  "],
["                  "," tt            tt "," trrrrrrrrrrrrrrt ","  rrrrrrrrrrrrrr  ","  rrrrrrrrrrrrrr  ","  rrrrrrrrrrrrrr  ","  rrrrrrrrrrrrrr  ","  rrrrrrrrrrrrrr  ","  rrrrrrrrrrrrrr  ","  rrrrrrrrrrrrrr  ","  rrrrrrrrrrrrrr  ","  rrrrrrrrrrrrrr  ","  rrrrrrrrrrrrrr  ","  rrrrrrrrrrrrrr  ","  rrrrrrrrrrrrrr  "," trrrrrrrrrrrrrrt "," tt            tt ","                  "],
["                  "," tu            ut "," uvwwwwwwwwwwwwvu ","  wv          vw  ","  w v        v w  ","  w  v      v  w  ","  w   vxyyyv   w  ","  w   yvAAvB   w  ","  w   xAvvAy   w  ","  w   xAvvAB   w  ","  w   xvAAvB   w  ","  w   vyyyyv   w  ","  w  v      v  w  ","  w v        v w  ","  wv          vw  "," uvwwwwwwwwwwwwvu "," tu            ut ","                  "],
["                  "," tC            Ct "," CC            CC ","                  ","                  ","                  ","                  ","                  ","        DD        ","        DD        ","                  ","                  ","                  ","                  ","                  "," CC            CC "," tC            Ct ","                  "],
["                  "," t              t ","                  ","                  ","                  ","                  ","                  ","                  ","        DD        ","        DD        ","                  ","                  ","                  ","                  ","                  ","                  "," t              t ","                  "],
["                  "," t              t ","                  ","                  ","                  ","                  ","                  ","                  ","        DD        ","        DD        ","                  ","                  ","                  ","                  ","                  ","                  "," t              t ","                  "],
["                  "," t              t ","                  ","                  ","                  ","                  ","                  ","                  ","        DD        ","        DD        ","                  ","                  ","                  ","                  ","                  ","                  "," t              t ","                  "],
["EEE            EEE","EtE            EtE","EEE            EEE","                  ","                  ","                  ","                  ","                  ","        DD        ","        DD        ","                  ","                  ","                  ","                  ","                  ","EEE            EEE","EtE            EtE","EEE            EEE"],
["EEE            EEE","EFE            EFE","EEE            EEE","                  ","                  ","                  ","                  ","                  ","                  ","                  ","                  ","                  ","                  ","                  ","                  ","EEE            EEE","EFE            EFE","EEE            EEE"],
["EEE            EEE","EEE            EEE","EEE            EEE","                  ","                  ","                  ","                  ","       GGGG       ","       GHHG       ","       GHHG       ","       GGGG       ","                  ","                  ","                  ","                  ","EEE            EEE","EEE            EEE","EEE            EEE"],
["                  ","                  ","                  ","                  ","                  ","                  ","                  ","       GGGG       ","       GIIG       ","       GIIG       ","       GGGG       ","                  ","                  ","                  ","                  ","                  ","                  ","                  "],
["                  ","                  ","                  ","                  ","                  ","                  ","                  ","                  ","                  ","        m         ","                  ","                  ","                  ","                  ","                  ","                  ","                  ","                  "]
]
  ]

  const structure_block_key = [
    {"a":"minecraft:bedrock",
"b":"minecraft:ancient_debris",
"c":"minecraft:obsidian",
"d":"minecraft:redstone_block",
"e":"enderio:fluid_tank",
"g":"allthemodium:allthemodium_block",
"h":"minecraft:chest"},
 {"a":"alltheores:steel_block",
"b":"allthemodium:allthemodium_block",
"c":"allthemodium:vibranium_block",
"d":"ae2:quartz_vibrant_glass",
"e":"minecraft:redstone_block",
"f":"alltheores:lead_block",
"g":"stellaris:uranium_block",
"h":"advanced_ae:quantum_alloy_block"},
{
"a":"extendedcrafting:nether_star_block",
"b":"dimstorage:dimensional_chest",
"c":"rain:solid_dim_core",
"d":"oritech:resource_node_lapis",
"e":"oritech:resource_node_iron",
"f":"oritech:resource_node_coal",
"g":"oritech:resource_node_gold",
"h":"oritech:resource_node_emerald",
"i":"oritech:resource_node_diamond",
"j":"oritech:resource_node_copper",
"k":"oritech:resource_node_redstone",
"l":"oritech:resource_node_nickel",
"n":"oritech:resource_node_uranium",
"o":"oritech:resource_node_platinum",
"p":"oritech:industrial_glass_block",
"q":"occultism:spirit_fire",
"r":"alltheores:steel_block",
"s":"avaritia:crystal_matrix",
"t":"allthemodium:piglich_heart_block",
"u":"allthemodium:allthemodium_source_jar",
"v":"extendedcrafting:flux_star_block",
"w":"occultism:tallow_block",
"x":"plushies:shulker_plushie",
"y":"plushies:shulker_plushie",
"A":"occultism:storage_controller_stabilized",
"B":"plushies:shulker_plushie",
"C":"alltheores:ruby_block",
"D":"draconicevolution:energy_pylon",
"E":"extendedcrafting:frame",
"F":"advanced_ae:quantum_core",
"G":"extendedae:entro_block",
"H":"occultism:iesnium_anvil",
"I":"minecraft:redstone_block"
}
  ]


  
  event.recipes.custommachinery.custom_machine('custommachinery:void_mining_machine', 100)
//   .requireItem("cobblestone")
  .produceItem('minecraft:raw_iron').chance(0.3)
  .produceItem('minecraft:raw_gold').chance(0.3)
  .produceItem('minecraft:raw_copper').chance(0.3)
  .requireEnergy(10000)
  .requirePosition("", "(,-64]", "")

  event.recipes.custommachinery.custom_machine('custommachinery:void_mining_machine', 100)
  .requireItem('rain:mineral_upgrade-1').chance(0)
  .produceItem('minecraft:raw_iron').chance(0.3)
  .produceItem('minecraft:raw_gold').chance(0.3)
  .produceItem('minecraft:raw_copper').chance(0.3)
  .produceItem('minecraft:nether_quartz_ore').chance(0.1)
  .produceItem('minecraft:diamond_ore').chance(0.1)
  .requireEnergy(10000)
  .requirePosition("", "(,-64]", "")

  event.recipes.custommachinery.custom_machine('custommachinery:void_mining_machine', 100)
  .requireItem('rain:mineral_upgrade-2').chance(0)
  .produceItem('minecraft:iron_ore').chance(0.5)
  .produceItem('minecraft:copper_ore').chance(0.5)
  .produceItem('mekanism:lead_ore').chance(0.3)
  .produceItem('minecraft:diamond_ore').chance(0.3)
  .produceItem('alltheores:platinum_ore').chance(0.1)
  .requireEnergy(10000)
  .requirePosition("", "(,-64]", "")

  event.recipes.custommachinery.custom_machine('custommachinery:void_mining_machine', 100)
  .requireItem('rain:mineral_upgrade-3').chance(0)
  // .produceItem('minecraft:iron_ore').chance(0.5)
  .produceItem('alltheores:silver_ore').chance(0.5)
  .produceItem('alltheores:aluminum_ore').chance(0.5)
  .produceItem('alltheores:uranium_ore').chance(0.5)
  .produceItem('alltheores:zinc_ore').chance(0.5)
  .produceItem('alltheores:iridium_ore').chance(0.5)
  .requireEnergy(10000)
  // .requireFluid("10x rain:void_fluid")
  .requirePosition("", "(,0]", "")
  .requireStructure(structure_block[0], structure_block_key[0])

   event.recipes.custommachinery.custom_machine('custommachinery:void_mining_machine', 100)
  .requireItem('rain:mineral_upgrade-4').chance(0)
  // .produceItem('minecraft:iron_ore').chance(0.5)
  .produceItem('powah:uraninite_ore_poor').chance(0.9)
  .produceItem('powah:uraninite_ore').chance(0.5)
  .produceItem('powah:uraninite_ore_dense').chance(0.1)
  .produceItem('mysticalagriculture:prosperity_ore').chance(0.5)
  .produceItem('stellaris:moon_desh_ore').chance(0.5)
  .produceItem('stellaris:venus_corronium_ore').chance(0.5)
  .produceItem('mysticalagriculture:soulium_ore').chance(0.5)
  .requireEnergy(10000)
  .requireStructure(structure_block[1], structure_block_key[1])
  // .requireFluid("10x rain:void_fluid")
  .requirePosition("", "(,0]", "")

  event.recipes.custommachinery.custom_machine('custommachinery:void_mining_machine', 100)
  .requireItem('rain:mineral_upgrade-5').chance(0)
  // .produceItem('minecraft:iron_ore').chance(0.5)
  .produceItem('silentgear:azure_silver_ore').chance(0.5)
  .produceItem('immersiveengineering:ore_aluminum').chance(0.5)
  .produceItem('rftoolsbase:dimensionalshard_overworld').chance(0.5)
  .produceItem('alltheores:salt_ore').chance(0.5)
  .produceItem('immersiveengineering:ore_nickel').chance(0.5)
  .produceItem('alltheores:cinnabar_ore').chance(0.5)
  .produceItem('alltheores:peridot_ore').chance(0.5)
  .produceItem('alltheores:ruby_ore').chance(0.5)
  .requireEnergy(10000)
  .requireRadiationPerTick(1)
  .consumeDropsOnStart("10x #c:gems", 10)
  .dimensionWhitelist("minecraft:overworld")
  .mustSeeSky()
  .requireTime("(,12000)")
  .requireSkyLight(15)
  .requireEntities(1, 10, "minecraft:cow", true)
  // .requireFluid("10x rain:void_fluid")
  .requirePosition("", "(,0]", "")
  .requireStructure(structure_block[2], structure_block_key[2])





  //消耗虚无之液
  event.recipes.custommachinery.custom_machine('custommachinery:void_mining_machine', 100)
//   .requireItem("cobblestone")
  .produceItem('minecraft:raw_iron').chance(0.3)
  .produceItem('minecraft:raw_gold').chance(0.3)
  .produceItem('minecraft:raw_copper').chance(0.3)
  .requireEnergy(10000)
  .requireFluid("10x rain:void_fluid")

  event.recipes.custommachinery.custom_machine('custommachinery:void_mining_machine', 100)
  .requireItem('rain:mineral_upgrade-1').chance(0)
  .produceItem('minecraft:raw_iron').chance(0.3)
  .produceItem('minecraft:raw_gold').chance(0.3)
  .produceItem('minecraft:raw_copper').chance(0.3)
  .produceItem('minecraft:nether_quartz_ore').chance(0.3)
  .produceItem('minecraft:diamond_ore').chance(0.1)
  .produceItem('occultism:raw_iesnium').chance(0.1)
  .requireEnergy(10000)
  .requireFluid("10x rain:void_fluid")

   event.recipes.custommachinery.custom_machine('custommachinery:void_mining_machine', 100)
  .requireItem('rain:mineral_upgrade-2').chance(0)
  .produceItem('minecraft:iron_ore').chance(0.5)
  .produceItem('minecraft:copper_ore').chance(0.5)
  .produceItem('mekanism:lead_ore').chance(0.3)
  .produceItem('minecraft:diamond_ore').chance(0.3)
  .produceItem('alltheores:platinum_ore').chance(0.1)
  .requireEnergy(10000)
  .requireFluid("10x rain:void_fluid")


  // event.recipes.custommachinery.custom_machine('custommachinery:void_mining_machine', 100)
  // .requireItem('rain:mineral_upgrade-3').chance(0)
  // // .produceItem('minecraft:iron_ore').chance(0.5)
  // .produceItem('alltheores:silver_ore').chance(0.5)
  // .produceItem('alltheores:aluminum_ore').chance(0.5)
  // .produceItem('alltheores:uranium_ore').chance(0.5)
  // .produceItem('alltheores:zinc_ore').chance(0.5)
  // .produceItem('alltheores:iridium_ore').chance(0.5)
  // .requireEnergy(10000)
  // .requireFluid("10x rain:void_fluid")
  // .requireStructure(structure_block[0], structure_block_key[0])
})


// ServerEvents.recipes(e=>{
//     e.recipes.custommachinery.custom_machine()
// })