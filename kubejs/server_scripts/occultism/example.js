// 魔精交易

// 1
// event.recipes.occultism.spirit_trade('minecraft:rotten_flesh', 'minecraft:bone')
// 灵火净化（输出物品，输入物品）

// 1
// event.recipes.occultism.spirit_fire('minecraft:emerald_ore', '#forge:gems/emerald')
// 魔精碎矿者(输出物品，输入物品）

// 1
// event.recipes.occultism.crushing('2x #forge:ores/iron','#forge:tools/swords')
// 维度矿井(可获得物品，概率，所需要的矿工等级）

// 1
// 2
// 3
// 4
// event.recipes.occultism.miner(
// Item.of('minecraft:wooden_pickaxe').withChance(100),  
// '#occultism:miners/master'                                             
// )
// 自定义仪式配方

// 1
// 2
// 3
// 4
// 5
// 6
// 7
// 8
// 9
// 10
// 11
// event.recipes.occultism.ritual(
// 'occultism:spirit_lantern', //输出物品
// [    
// "lapis_lazuli",
// "#forge:raw_materials",
// ["minecraft:coal", 'minecraft:charcoal'],
// ],   //输入物品
// '#forge:stone',  //仪式核心输入物品（放在黄金献祭之碗上的）
// 'occultism:craft_afrit'  //五芒星id
// ).dummy("kubejs:dummy_ritual_thing").useItem('minecraft:egg')//额外消耗材料或需献祭生物
// })
// 另附五芒星ID：

// occultism:craft_afrit	塞维拉永囚咒
// occultism:craft_djinni	斯特里格高等束缚
// occultism:craft_foliot	埃兹维斯灵体强迫
// occultism:craft_marid	修菲斯倒转之塔
// occultism:possess_afrit	阿巴拉斯强令召唤术
// occultism:possess_djinni	伊哈根奴役术
// occultism:possess_foliot	海德林诱惑术
// occultism:summon_afrit	阿巴拉斯召唤术
// occultism:summon_djinni	欧菲克斯的召唤
// occultism:summon_foliot	阿维亚之环
// occultism:summon_marid	法特玛极效引诱
// occultism:summon_wild_afrit	阿巴拉斯开环召唤术
// occultism:summon_wild_greater_spirit	奥索林的无约束召唤

//下列代码为主要的代码
ServerEvents.generateData("after_mods", (event) => {
    const pentacles = [
        {
            name: "test1",
            icon: icon[1],
            mapping: {
                0: ritual_props.mid,
                1: ritual_props.white,
                s:ritual_props.crystal
            },
            pattern: [
                [
                    "s1s",
                    "101",
                    "s1s"
                ]
            ],
            x_placement: -5,
            y_placement: -8,
            parents: [
                {
                    draw_arrow: true,
                    entry: "pentacles/pentacle_overview",
                    line_enabled: true,
                    line_reversed: true
                }
            ]
        }
    ]
    pentacles.forEach((pentacle) => {
        pentacle.type = "modonomicon:dense";
        let ground = [];
        let pattern = pentacle.pattern[0];
        for (let i = 0; i < pattern.length; i++) {
            let row = '';
            for (let j = 0; j < pattern[i].length; j++) {
                row += (i + j) % 2 == 0 ? '*' : '+';
            }
            ground.push(row);
        }
        pentacle.pattern.push(ground);
        pentacle.mapping['*'] = { type: 'modonomicon:display', display: 'occultism:otherstone' };
        pentacle.mapping['+'] = { type: 'modonomicon:display', display: 'minecraft:stone' };
        const multiblockPath = `occultism:modonomicon/multiblocks/${pentacle.name}.json`;
        const entryPath = `occultism:modonomicon/books/dictionary_of_spirits/entries/pentacles/${pentacle.name}.json`;
        event.json(multiblockPath,pentacle)
        event.json(entryPath,generatePentacleEntry(pentacle.name, pentacle.x_placement, pentacle.y_placement, pentacle.parents, pentacle.icon))
    });
})
//下列函数为最终处理部分的函数
function generatePentacleEntry(ritual_name, x_placement, y_placement, parents, icon) {
    let entry = {
        name: ritual_name,
        background_u_index: 0,
        background_v_index: 0,
        category: 'pentacles',
        condition: { type: 'modonomicon:none' },
        description: '',
        hide_while_locked: false,
        icon: {
            item: `${icon}`
        },
        name: `book.occultism.dictionary_of_spirits.pentacles.${ritual_name}.name`,
        pages: [
            {
                type: 'modonomicon:text',
                anchor: '',
                show_title_separator: true,
                text: `book.occultism.dictionary_of_spirits.pentacles.${ritual_name}.intro.text`,
                title: `book.occultism.dictionary_of_spirits.pentacles.${ritual_name}.intro.title`,
                use_markdown_in_title: false
            },
            {
                type: 'modonomicon:multiblock',
                anchor: '',
                multiblock_id: `occultism:${ritual_name}`,
                multiblock_name: '',
                show_visualize_button: true,
                text: ''
            }
        ],
        parents: parents,
        x: x_placement,
        y: y_placement
    };
    return entry;
}
//下列函数非必须主要是方便我个人的常量定义使用
// function color(props){
//     return{
//         type: "modonomicon:tag",
//         display: `occultism:chalk_glyph_${props}`,
//         tag:`#occultism:glyphs_${props}`
//     }
// }
//下列为一些我个人所使用的一些定义的常量，不是必须的因素
// const color = [
//     "brown",
//     "red",
//     "orange",
//     "gold",
//     "lime",
//     "green",
//     "cyan",
//     "light_blue",
//     "blue",
//     "purple",
//     "magenta",
//     "pink",
//     "black",
// ]

const ritual_props = {
    mid: {
        type: "modonomicon:tag",
        display: "occultism:golden_sacrificial_bowl",
        tag: "#occultism:center_sacrificial_bowl"
    },
    candle: {
        type: "modonomicon:tag",
        tag: "#minecraft:candles"
    },
    crystal:{
        type: "modonomicon:block",
        block:'occultism:spirit_attuned_crystal' 
    },
    white: {
        type: "modonomicon:tag",
        display: "occultism:chalk_glyph_white",
        tag: "#occultism:foundation_glyphs_any"
    },
    light_gray:{
        type: "modonomicon:tag",
        display: "occultism:chalk_glyph_light_gray",
        tag: "#occultism:foundation_glyphs_no_white"
    },
    gray:{
        type: "modonomicon:tag",
        display: "occultism:chalk_glyph_gray",
        tag: "#occultism:foundation_glyphs_dark"
    }
}
const icon = {
    1:"occultism:ritual_dummy/custom_ritual_summon",
    2:"occultism:ritual_dummy/custom_ritual_possess",
    3:"occultism:ritual_dummy/custom_ritual_craft",
    4:"occultism:ritual_dummy/custom_ritual_misc"
}