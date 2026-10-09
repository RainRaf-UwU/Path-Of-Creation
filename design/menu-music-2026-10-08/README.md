# 创世之径主菜单配乐

音乐：**虚空初光 / Void Dawn**，约 3 分 37 秒。根据用户选择的「舒缓电子纯音乐」方向，通过 ChatCut / Mureka 生成一首原创配乐。游戏版为 44.1 kHz 双声道 Ogg Vorbis，约 3.8 MiB，响度 -17.6 LUFS，采样峰值 -3.1 dB，带 1.5 秒淡入和 3 秒淡出。

游戏运行文件：

- `config/fancymenu/assets/music/void_dawn.ogg`：本地 Ogg Vorbis 音频，随整合包分发；运行时无需网络。
- `config/fancymenu/customization/poc_title_music.txt`：只绑定 `title_screen` 的独立音频布局。

布局包含一个 Music Controller 和一个 Audio 元素：本界面关闭原版菜单音乐，配乐音量系数 0.45、顺序播放、循环，使用游戏的 `music` 声音通道。离开标题界面后，由 FancyMenu 的音频生命周期结束播放。原菜单、按钮、链接、加载页和世界内音乐配置均未修改。

重启游戏后生效。游戏「选项 → 音乐和声音 → 音乐」需大于 0；接入时本机这一项为 0，本轮保留个人音量设置，可先调至 50% 试听。

更换曲目时，替换同路径 OGG；调节配乐相对音量时，修改布局中的 `volume`（0～1）。回退只需移除上述两个新增运行文件。

验证记录在本目录 `verification.json`。已用本机 FancyMenu 3.9.14 的真实 PropertiesParser、AudioInstance 播放列表和 MusicControllerElementBuilder 校验配置；这是离线配置校验，实际播放、循环、退出标题界面与音量滑块行为仍需游戏重启后确认。

生成项目：[创世之径 · 主菜单配乐](https://app.chatcut.io/zh/editor/1214e4d4-4ea3-45ca-8a47-3195f169dd51)。生成任务 `7eabe1db3d`。完整提示词见 `generation-prompt.txt`。

实现依据：[FancyMenu 官方菜单音乐文档](https://docs.fancymenu.net/docs/en-US/background-music)；具体序列化字段以本机模组 JAR 为准。曲名由本项目命名。

## LMMS 试听项目

按用户指定的 `E:/LMMS1/lmms.exe`（1.3.0-alpha.1.102+g89fc6c960）制作并验证了采样轨道项目，位于 `E:/LMMS1/Path_of_Creation_Void_Dawn/Void_Dawn.mmp`。配套 OGG 在同目录 `resources/void_dawn.ogg`，使用 LMMS 的 `local:` 相对路径；移动时应整体移动项目目录。

完整压缩包：`C:/Users/44479/Downloads/Path_of_Creation_Void_Dawn_LMMS.zip`。在 LMMS 中用「文件 → 打开」打开 MMP，然后按空格播放。这是完整音频采样轨道，支持试听、裁剪和音量调节；原生成音乐没有提供 MIDI 或乐器分轨。

已用该 LMMS 实际离线渲染，退出码 0。音频前、中、后三个 5 秒片段与原配乐的相关性均超过 0.99999998，输出增益约 0.8，与项目 80% 主音量一致。采样片段 216.7 秒；歌曲按小节结束，渲染总长约 219.51 秒。验证与构建脚本位于 `.cache/lmms-void-dawn-20261008/`；没有改动游戏运行文件或已有 LMMS 工程。
