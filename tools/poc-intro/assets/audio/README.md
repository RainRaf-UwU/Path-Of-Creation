# 玩家逐字短音

`player-hi.wav`是唯一的玩家逐字采样：44.1kHz单声道PCM，80ms，来自用户指定的“hi”音节。每个正文或选项字符均播放同一份声音，播放音高固定1.0，不随机换元音。

来源为用户明确指定的`E:/LMMS1/Samples/amitarovoice_20260604_01/amitarovoice_20260604_01/303_oto/hirari_02.wav`。`player-hi-source.wav`是该文件的原样副本，SHA256为`602666b38f257ca81a772476f78aee646d3540cf6e2c3263eb8a92cf271ed00e`。

原文件约625ms。按开头hi的辅音到元音过渡选取180–260ms区间，排除后续ra/ri，保留短促起音和元音；首尾做3/6ms淡化，归一化峰值0.65。没有改变原声音高或速度；用户原始文件保持不变。

`build-sounds.mjs`直接将处理后的WAV编码为运行资源`glyph_self.ogg`。ECHO和确认短音仍由脚本合成。
