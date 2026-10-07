# 创世之径语言支持 / Localization

- FTB Quests：`config/ftbquests/quests/lang/zh_cn.snbt` 与 `en_us.snbt`，290 个对应条目。没有自定义标题的任务使用模组物品名称。
- KubeJS：`kubejs/assets/rain/lang/`，224 个对应条目；普通聊天和奖励名称使用翻译组件。逐字动画通过 `server_scripts/localization.js` 查询目标玩家的 `ClientInformation.language()`，读取对应语言文件；其他语言回退英文，中文地区使用简体中文。
- 更新模组：`tools/poc-updater/src/main/resources/assets/poc_updater/lang/`，29 个界面条目。修改后需要重新编译 JAR。
- 玩家在“选项 → 语言”中切换语言，FTB Quests 的编辑/回退语言覆盖保持空白，再重新打开任务书。启动注册和更新模组改动需要完整重启游戏。

FTB Quests has 290 matching locale entries, KubeJS has 224, and the updater UI has 29. Ordinary text uses Minecraft translation components. Animated story text resolves the recipient's locale before animating its characters. Unknown languages fall back to English; Chinese locales use Simplified Chinese.

## 检查 / Checks

从整合包根目录运行，需要 Python 3 与 Node.js：

```powershell
python tools/localization/check.py
```

检查语言键、值类型、英文残留中文、格式参数、任务图片引用、JavaScript 语法，以及两名不同语言玩家、语言切换和剧情乱码片段匹配。

2026-10-07 额外验证：使用本机 FTB Library 2101.1.37 的 SNBT 解析器读取两种语言和全部章节；使用 Minecraft 1.21.1 翻译组件解析更新按钮、版本参数及模板名称；使用 Rhino 2101.2.8-build.91 与 KubeJS JsonIO 执行语言选择脚本，传入实际 Minecraft `ClientInformation` 类型的中英文设置。591 项任务依赖均能找到对应 ID；本轮任务定义只改模板显示名称，配方与资源获取脚本保持一致。

这些是文件、组件和脚本检查。完整客户端重启后的界面显示与代表性生存流程仍需游戏内验证。建筑模板修复的此前游戏内验证记录见 [修复说明](../../design/building-templates-repair-2026-10-06/README.md)。
