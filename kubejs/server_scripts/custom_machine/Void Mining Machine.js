ServerEvents.recipes(event => {

  const structure_block = [
  [
    [
      "aaaaa",
      "aaaaa",
      "aaaaa",
      "aaaaa",
      "aaaaa",
      "     "
    ],
    [
      "     ",
      "ce ec",
      "ce ec",
      "c   c",
      "  d  ",
      "  m  "
    ],
    [
      "     ",
      " e e ",
      "ce ec",
      "     ",
      "  h  ",
      "     "
    ],
    [
      "     ",
      "     ",
      "c g c",
      "     ",
      "     ",
      "     "
    ],
    [
      "     ",
      "     ",
      "cbbbc",
      "     ",
      "     ",
      "     "
    ],
    [
      "     ",
      "     ",
      "ccccc",
      "     ",
      "     ",
      "     "
    ]
  ],
  [
    [
      "           ",
      "           ",
      "    aaaa   ",
      "  aaaaaa   ",
      "  aaaaaaa  ",
      "  aaaaaaa  ",
      "  aaaaaaa  ",
      "   aaaaaa  ",
      "   aaaa    ",
      "           ",
      "           ",
      "           "
    ],
    [
      "   fffff   ",
      " gff   ffg ",
      " ff     ff ",
      "ff   c   ff",
      "f   ccc   f",
      "f  ccccc  f",
      "f   ccc   f",
      "ff   c   ff",
      " ff     ff ",
      " gff   ffg ",
      "   ffeff   ",
      "     m     "
    ],
    [
      "           ",
      " ddddddddd ",
      " d       d ",
      " d       d ",
      " d       d ",
      " d       d ",
      " d       d ",
      " d       d ",
      " d       d ",
      " ddddddddd ",
      "           ",
      "           "
    ],
    [
      "           ",
      " hhhhhhhhh ",
      " h       h ",
      " h       h ",
      " h       h ",
      " h       h ",
      " h       h ",
      " h       h ",
      " h       h ",
      " hhhhhhhhh ",
      "           ",
      "           "
    ],
    [
      "           ",
      " g       g ",
      "           ",
      "           ",
      "           ",
      "           ",
      "           ",
      "           ",
      "           ",
      " g       g ",
      "           ",
      "           "
    ],
    [
      "           ",
      " g       g ",
      "           ",
      "           ",
      "           ",
      "           ",
      "           ",
      "           ",
      "           ",
      " g       g ",
      "           ",
      "           "
    ],
    [
      "           ",
      " ddddddddd ",
      " d       d ",
      " d       d ",
      " d       d ",
      " d       d ",
      " d       d ",
      " d       d ",
      " d       d ",
      " ddddddddd ",
      "           ",
      "           "
    ],
    [
      "           ",
      " hhhhhhhhh ",
      " h       h ",
      " h       h ",
      " h  bbb  h ",
      " h       h ",
      " h  bbb  h ",
      " h       h ",
      " h       h ",
      " hhhhhhhhh ",
      "           ",
      "           "
    ],
    [
      "   fffff   ",
      " gff   ffg ",
      " ff     ff ",
      "ff       f ",
      "f          ",
      "           ",
      "           ",
      "           ",
      "           ",
      " g       g ",
      "           ",
      "           "
    ],
    [
      "           ",
      " g       g ",
      "           ",
      "           ",
      "           ",
      "           ",
      "           ",
      "           ",
      "           ",
      " g       g ",
      "           ",
      "           "
    ],
    [
      "           ",
      " g       g ",
      "           ",
      "           ",
      "           ",
      "           ",
      "           ",
      "           ",
      "           ",
      " g       g ",
      "           ",
      "           "
    ]
  ],
  [
    [
      "                 ",
      "     aaaaaaaa    ",
      "   aaaaaaaaaaa   ",
      "  aaaaaaaaaaaaa  ",
      " aaaaaaaaaaaaaa  ",
      " aaaaaaaaaaaaaaa ",
      " aaaaaaaaaaaaaaa ",
      " aaaaaaaaaaaaaaa ",
      " aaaaaaa aaaaaaa ",
      " aaaaaaaaaaaaaaa ",
      " aaaaaaaaaaaaaaa ",
      " aaaaaaaaaaaaaaa ",
      "  aaaaaaaaaaaaaa ",
      "  aaaaaaaaaaaaa  ",
      "   aaaaaaaaaaa   ",
      "    aaaaaaaa     ",
      "                 ",
      "                 ",
      "                 "
    ],
    [
      "rrr           rrr",
      "rrr           rrr",
      "rrr           rrr",
      "      ppppp      ",
      "     ppbbbpp     ",
      "    ppbtttbpp    ",
      "   ppbtttttbpp   ",
      "   pbtttttttbp   ",
      "   pb ttttttbp   ",
      "   pbtttttttbp   ",
      "   ppbtttttbpp   ",
      "    ppbtttbpp    ",
      "     ppbbbpp     ",
      "      ppppp      ",
      "rrr           rrr",
      "rrr           rrr",
      "rrr           rrr",
      "        I        ",
      "        m        "
    ],
    [
      "rrr           rrr",
      "rrr           rrr",
      "rrr   rrrrr   rrr",
      "     rpppppr     ",
      "    rppbbbppr    ",
      "   rppb   bppr   ",
      "  rppb     bppr  ",
      "  rpb       qpr  ",
      "  rpu       qpr  ",
      "  rpq       qpr  ",
      "  rppq     qppr  ",
      "   rppq   qppr   ",
      "    rppqqqppr    ",
      "     rpppppr     ",
      "rrr   rrrrr   rrr",
      "rrr           rrr",
      "rrr           rrr",
      "                 ",
      "                 "
    ],
    [
      "rrr           rrr",
      "rrr           rrr",
      "rrr   qqqqq   rrr",
      "     qpppppq     ",
      "    qppuuuppq    ",
      "   qppuwwwuppq   ",
      "  qppuww wwxppq  ",
      "  qpuww   wwxpq  ",
      "  qpyw     wxpq  ",
      "  qpyww   wwxpq  ",
      "  qppyww wwyppq  ",
      "   qppywwwyppq   ",
      "    qppyyyppq    ",
      "     qpppppq     ",
      "rrr   qqqqq   rrr",
      "rrr           rrr",
      "rrr           rrr",
      "                 ",
      "                 "
    ],
    [
      "rrr  EEEEEEE  rrr",
      "rrr EE     EE rrr",
      "rrrEE       EErrr",
      "  EE  ppppp  EE  ",
      " EE  ppAAApp  EE ",
      "EE  ppAwwwApp  EE",
      "E  ppAww wwApp  E",
      "E  pAww   wwBp  E",
      "E  pCw     wBp  E",
      "E  pCww   wwBp  E",
      "E  ppCww wwCpp  E",
      "EE  ppCwwwCpp  EE",
      " EE  ppCCCpp  EE ",
      "  EE  ppppp  EE  ",
      "rrrEE       EErrr",
      "rrr EE     EE rrr",
      "rrr  EEEEEEE  rrr",
      "                 ",
      "                 "
    ],
    [
      "rrr           rrr",
      "rrr  sssssss  rrr",
      "rrr ssrrrrrss rrr",
      "   ssrppppprss   ",
      "  ssrppDDDpprss  ",
      " ssrppC   Dpprss ",
      " srppC     Dpprs ",
      " srpC       Dprs ",
      "  rpD       Dprs ",
      "  rpD       Dprs ",
      "  rppD     Dpprs ",
      "  srppD   Dpprss ",
      "  ssrppDDDpprss  ",
      "   ssrppppprss   ",
      "rrr ssrrrrrss rrr",
      "rrr  sssssss  rrr",
      "rrr           rrr",
      "                 ",
      "                 "
    ],
    [
      "rrr           rrr",
      "rrr           rrr",
      "rrr   qqqqq   rrr",
      "     qpppppq     ",
      "    qppFFFppq    ",
      "   qppDcccFppq   ",
      "  qppDcc ccGppq  ",
      "  qpDcc   ccGpq  ",
      "  qpG      cGpq  ",
      "  qpG     ccGpq  ",
      "  qppG     Gppq  ",
      "   qppG   Gppq   ",
      "    qppGGGppq    ",
      "     qpppppq     ",
      "rrr   qqqqq   rrr",
      "rrr           rrr",
      "rrr           rrr",
      "                 ",
      "                 "
    ],
    [
      "rrr           rrr",
      "rrr           rrr",
      "rrr           rrr",
      "      ppppp      ",
      "     ppGGGpp     ",
      "    ppGdddGpp    ",
      "   ppGdd ddGpp   ",
      "   pGdd   ddGp   ",
      "           dG    ",
      "          ddG    ",
      "     I     H     ",
      "      I   H      ",
      "       IHH       ",
      "                 ",
      "rrr           rrr",
      "rrr           rrr",
      "rrr           rrr",
      "                 ",
      "                 "
    ],
    [
      "rrr           rrr",
      "rrr           rrr",
      "rrr   rrrrr   rrr",
      "     r     r     ",
      "    r       r    ",
      "   r   eee   r   ",
      "  r   ee ee   r  ",
      "  r  ee   ee  r  ",
      "  r        e  r  ",
      "  r       ee  r  ",
      "  r           r  ",
      "   r         r   ",
      "    r       r    ",
      "     r     r     ",
      "rrr   rrrrr   rrr",
      "rrr           rrr",
      "rrr           rrr",
      "                 ",
      "                 "
    ],
    [
      "rrr  EEEEEEE  rrr",
      "rrr EE     EE rrr",
      "rrrEE qqqqq EErrr",
      "  EE q     q EE  ",
      " EE q       q EE ",
      "EE q   fff   q EE",
      "E q   ff ff   q E",
      "E q  ff   ff  q E",
      "  q        f  q E",
      "  q       ff  q E",
      "  q           q E",
      "   q         q EE",
      "    q       q    ",
      "     q     q     ",
      "rrr   qqqqq   rrr",
      "rrr           rrr",
      "rrr           rrr",
      "                 ",
      "                 "
    ],
    [
      "rrr           rrr",
      "rrr           rrr",
      "rrr           rrr",
      "                 ",
      "                 ",
      "       ggg       ",
      "      gg gg      ",
      "     gg   gg     ",
      "           g     ",
      "          gg     ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "rrr           rrr",
      "rrr           rrr",
      "rrr           rrr",
      "                 ",
      "                 "
    ],
    [
      "rrr           rrr",
      "rrr           rrr",
      "rrr   rrrrr   rrr",
      "     r     r     ",
      "    r       r    ",
      "   r   hhh   r   ",
      "  r   hh hh   r  ",
      "  r  hh   hh  r  ",
      "  r        h  r  ",
      "  r       hh  r  ",
      "  r           r  ",
      "   r         r   ",
      "    r       r    ",
      "     r     r     ",
      "rrr   rrrrr   rrr",
      "rrr           rrr",
      "rrr           rrr",
      "                 ",
      "                 "
    ],
    [
      "rrr           rrr",
      "rrr           rrr",
      "rrr   qqqqq   rrr",
      "     q     q     ",
      "    q       q    ",
      "   q   iii   q   ",
      "  q   ii ii   q  ",
      "  q  ii   ii  q  ",
      "  q        i  q  ",
      "  q        i  q  ",
      "  q           q  ",
      "   q         q   ",
      "    q       q    ",
      "     q     q     ",
      "rrr   qqqqq   rrr",
      "rrr           rrr",
      "rrr           rrr",
      "                 ",
      "                 "
    ],
    [
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "       jjj       ",
      "      jj jj      ",
      "     jj   jj     ",
      "           j     ",
      "          jj     ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 "
    ],
    [
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "       kkk       ",
      "      kk kk      ",
      "     kk   kk     ",
      "           k     ",
      "          kk     ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 "
    ],
    [
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "       lll       ",
      "      ll ll      ",
      "     ll   ll     ",
      "           l     ",
      "          ll     ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 "
    ],
    [
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "       nnn       ",
      "      nn nn      ",
      "     nn   nn     ",
      "           n     ",
      "          nn     ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 "
    ],
    [
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "       vvv       ",
      "      vooov      ",
      "     voo oov     ",
      "    voo   oov    ",
      "    v      ov    ",
      "    v     oov    ",
      "     v     v     ",
      "      v   v      ",
      "       vvv       ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 "
    ],
    [
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "       vvv       ",
      "      v   v      ",
      "     v     v     ",
      "    v            ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 ",
      "                 "
    ]
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


  
  // 插卡后只运行对应等级；同时满足高度和液体条件时，优先不耗液的高度配方。
  event.recipes.custommachinery.custom_machine('custommachinery:void_mining_machine', 100)
  .requireEmptyItem('11111')
  .priority(10)
//   .requireItem("cobblestone")
  .produceItem('minecraft:raw_iron').chance(0.3)
  .produceItem('minecraft:raw_gold').chance(0.3)
  .produceItem('minecraft:raw_copper').chance(0.3)
  .requireEnergy(10000)
  .requirePosition("", "(,-64]", "")

  event.recipes.custommachinery.custom_machine('custommachinery:void_mining_machine', 100)
  .requireItem('rain:mineral_upgrade-1').chance(0)
  .priority(20)
  .produceItem('minecraft:raw_iron').chance(0.3)
  .produceItem('minecraft:raw_gold').chance(0.3)
  .produceItem('minecraft:raw_copper').chance(0.3)
  .produceItem('minecraft:nether_quartz_ore').chance(0.1)
  .produceItem('minecraft:diamond_ore').chance(0.1)
  .requireEnergy(10000)
  .requirePosition("", "(,-64]", "")

  event.recipes.custommachinery.custom_machine('custommachinery:void_mining_machine', 100)
  .requireItem('rain:mineral_upgrade-2').chance(0)
  .priority(30)
  .produceItem('minecraft:iron_ore').chance(0.5)
  .produceItem('minecraft:copper_ore').chance(0.5)
  .produceItem('mekanism:lead_ore').chance(0.3)
  .produceItem('minecraft:diamond_ore').chance(0.3)
  .produceItem('alltheores:platinum_ore').chance(0.1)
  .requireEnergy(10000)
  .requirePosition("", "(,-64]", "")

  event.recipes.custommachinery.custom_machine('custommachinery:void_mining_machine', 100)
  .requireItem('rain:mineral_upgrade-3').chance(0)
  .priority(40)
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
  .priority(50)
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
  .priority(60)
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
  .requireEmptyItem('11111')
  .priority(9)
//   .requireItem("cobblestone")
  .produceItem('minecraft:raw_iron').chance(0.3)
  .produceItem('minecraft:raw_gold').chance(0.3)
  .produceItem('minecraft:raw_copper').chance(0.3)
  .requireEnergy(10000)
  .requireFluid("10x rain:void_fluid")

  event.recipes.custommachinery.custom_machine('custommachinery:void_mining_machine', 100)
  .requireItem('rain:mineral_upgrade-1').chance(0)
  .priority(19)
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
  .priority(29)
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