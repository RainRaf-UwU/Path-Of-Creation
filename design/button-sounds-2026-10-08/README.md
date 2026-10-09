# 按钮点击音效

已为本地整合包接入一枚原创电子机械点击声：短促的机械轻击叠加柔和电子音，100 毫秒、44.1 kHz 单声道 Ogg Vorbis，约 5 KB。由 `build_click.py` 程序合成，不使用第三方采样。`button_click_preview.wav` 可直接试听。

游戏资源只有两个新增文件：

- `kubejs/assets/minecraft/sounds.json`
- `kubejs/assets/minecraft/sounds/ui/poc_button_click.ogg`

只覆盖 `minecraft:ui.button.click`，设置 `replace: true` 以替换原有音频列表。沿用已安装的 KubeJS 自动加载和资源优先级方案，无需新增模组或手动启用资源包。

本机字节码已确认：原版 AbstractWidget、FancyMenu 主菜单自定义按钮和 FTB Library / FTB Quests 按钮调用该点击事件。原版设置页、世界选择页及共用该事件的模组按钮会使用新音效。独立声音事件或完全不播放声音的特殊控件不在本次事件覆盖范围内。

按钮点击使用游戏的主音量通道，不受菜单背景音乐的「音乐」滑块控制。保留原有个人音量和全部 FancyMenu 配置，也保留菜单布局、背景音乐、按钮动作及链接。

在已启动的游戏中按 **F3+T** 重载资源后试听，也可重启游戏。分别点击主菜单、世界选择、设置和任务书按钮，确认音量合适且每次只响一次。禁用的按钮应继续不响应。实际游戏播放尚未验收；本轮没有启动或控制游戏。

已核对输出 OGG 完整解码、格式、时长和峰值；使用真实 Minecraft 资源管理器及现有优先级 Mixin 检查声音定义顺序和音频来源/字节；序列化字段按本机 Minecraft 1.21.1 字节码核对。尝试离线初始化完整 SoundManager 注册流程时需要 NeoForge 模组加载生命周期，因此没有将此项记为通过。现有 KubeJS 日志仅作为安装前基线。

验证结果在 `verification.json`，本地安装记录和保护文件哈希在 `.cache/button-sounds-20261008/installation.json`。Git 提交仅包含按钮音效及复现资料，不修改版本号、更新清单或创建正式 Release。

回退时仅移除以上两个新增游戏资源文件，然后 F3+T 或重启；若 `sounds.json` 后续增加了其他声音，只移除其中的 `ui.button.click` 条目。不要删除整个 `kubejs/assets/minecraft` 目录。

重建：

```powershell
python design/button-sounds-2026-10-08/build_click.py --ffmpeg E:/minecraft/ffmpeg-9.0.2-essentials_build/bin/ffmpeg.exe
```

FancyMenu 的自定义点击声音功能参考[官方全局自定义说明](https://docs.fancymenu.net/docs/en-US/global-customizations)。本次接入采用 Minecraft 共享声音事件，具体调用路径以本机模组为准。
