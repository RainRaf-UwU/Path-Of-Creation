// ServerEvents.recipes(event => {
//     // 基础示例：将圆石在从主世界进入下界的传送门中（入口位于繁茂洞穴）时，有75%概率转换为海晶石，
//     // 并有80%概率掉落1-4个红石，无特定天气要求。
//     event.recipes.portaltransform.item_transform(
//         "minecraft:cobblestone",                     // 输入物品的ID (必需)
//         "minecraft:prismarine",                      // 输出物品的ID (必需)
//         [                                            // 副产物列表 (可选, 可以是空数组 [])
//             Byproduct.of("minecraft:redstone", 0.8, 1, 4) // 参数: 物品ID, 出现概率 (0.0-1.0), 最小数量, 最大数量
//             // 你可以添加更多 Byproduct.of(...) 来定义多种副产物
//         ],
//         ["minecraft:overworld", "minecraft:the_nether"], // 维度条件 (可选): [当前维度ID, 目标维度ID]
//                                                         // 如果是空数组 [] 或省略此参数，则表示无特定维度要求。
//         "any",                                       // 天气条件 (可选): "any", "clear", "rain", "thunder"
//                                                         // 如果省略此参数，默认为 "any"。
//         ["minecraft:lush_caves"],                    // 生物群系条件 (可选): 入口所在的必需生物群系列表
//                                                         // 如果省略此参数，表示无特定生物群系要求。
//         { min: -16 },                                 // 高度条件 (可选): 允许的最低 Y 值, 也可以提供 { max: 80 } 或 { min: 0, max: 64 }
//         "night",                                     // 时间条件 (可选): 传入关键字字符串 ("day", "night", "noon", "midnight")
//                                                       // 或者使用数组指定范围，例如 [13000, 23000]
//         {                                             // 催化剂条件 (可选): 需要在范围内存在的方块/方块列表
//             blocks: ["minecraft:beacon"],            // 可以是单个方块 ID 或数组
//             horizontal_range: 2,                      // 水平范围 (默认 3)
//             vertical_range: 1                         // 垂直范围 (默认 1)
//         },
//         {                                             // 能量需求 (可选): 转换时消耗的能量数值及搜索范围
//             amount: 100000,                           // 每次成功转换需要消耗的 FE 数量
//             horizontal_range: 4,                      // 搜索水平范围 (默认 2)
//             vertical_range: 2                         // 搜索垂直范围 (默认 1)
//         },
//         { components: { "minecraft:enchantments": { "minecraft:fire_aspect": 1 } } }, // 物品数据条件 (可选): ItemPredicate JSON 对象
//         0.8                                          // 转换成功概率 (可选, 0.0-1.0)
//                                                         // 如果省略此参数，默认为 1.0 (100%)。
//     );

//     // 沙子在任何维度之间转换时，若天气为晴朗，则100%转换为玻璃，无副产物。
//     event.recipes.portaltransform.item_transform(
//         "minecraft:sand",
//         "minecraft:glass",
//         [],                                          // 无副产物
//         [],                                          // 无特定维度求 (注要意：KubeJS中定义时，如果JSON中是可选且有默认值，这里需要显式提供一个符合类型的值，如空数组代表无要求)
//         "clear",                                     // 天气条件：晴天
//         null,                                        // 生物群系条件：null 或 undefined 表示无要求
//         1.0                                          // 转换概率 (1.0可以省略，因为是默认值)
//     );

//     // 示例3：泥土在任何条件下（任何维度、任何天气）通过传送门时，有50%概率变成石头，25%概率变成沙子（作为副产物）。
//     event.recipes.portaltransform.item_transform(
//         "minecraft:dirt",
//         "minecraft:stone",
//         [
//             Byproduct.of("minecraft:sand", 0.25, 1, 1) // 25%概率掉落1个沙子
//         ],
//         /// 如果维度、天气、概率都使用默认值，可以省略这些参数，但KubeJS的API调用可能需要按顺序提供或使用更明确的构建器（如果支持）。
//         // 根据当前API，如果想省略中间参数，可能需要提供null或者默认值。
//         // 查阅 `PortalItemTransformRecipeSchema.java` 和 KubeJS 插件实现，参数定义如下：
//         // 1. input (Ingredient) - 必需
//         // 2. result (ItemStack) - 必需
//         // 3. byproducts (List<Byproducts>) - 可选, 默认为空列表
//         // 4. dimensions (Dimensions) - 可选, 默认为 Dimensions.empty() (即无要求)
//         // 5. weather (Weather) - 可选, 默认为 Weather.ANY
//         // 6. biomes (Biomes) - 可选, 默认为无要求
//         // 7. height (Height) - 可选, 默认为无要求
//         //    使用 `.height([min, max])` 来设置高度范围，可通过 `null` 省略某一端
//         // 8. time (TimeCondition) - 可选, 默认为无要求
//         //    使用 `.time("day")`、`.time("night")`、`.time("noon")`、`.time("midnight")` 或 `.time([start, end])`
//         // 9. catalyst (Catalyst) - 可选, 默认为无要求 (在范围内检测指定方块)
//         // 10. energy (EnergyRequirement) - 可选, 默认为无要求 (检测并消耗能量)
//         // 11. item_predicate (ItemPredicate) - 可选, 默认为无要求
//         // 12. transform_chance (Float) - 可选, 默认为 1.0F
//         // 因此，如果你想指定转换概率而不指定维度和天气，你需要为维度和天气提供其“空”或“任意”的表示。
//         // 例如，使用空数组 `[]` 代表任意维度，使用 `"any"` 代表任意天气，使用 null 代表任意生物群系。
//         [],       // 任意维度
//         "any",    // 任意天气
//         null,     // 任意生物群系
//         0.5       // 50% 转换概率
//     );
// });