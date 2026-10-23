import fs from'node:fs';import path from'node:path';import{createRequire}from'node:module';import{spawnSync}from'node:child_process';import crypto from'node:crypto';import{root,blocks,counts}from'./inventory.mjs';
const require=createRequire('C:/Users/44479/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/_poc.cjs'),JSZip=require('jszip');
const dir=path.join(root,'design/multiblock-redesign-20261023'),cache=path.join(root,'.cache/machine-redesign'),layouts=JSON.parse(fs.readFileSync(path.join(dir,'structures.json'))),before=JSON.parse(fs.readFileSync(path.join(dir,'before.json'))).structures,main=layouts.filter(s=>s.family!=='inspector');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),installed=fs.readFileSync(path.join(root,'mods/poc-dimension-matrix-1.0.0.jar')),jar=await JSZip.loadAsync(installed),oldJar=await JSZip.loadAsync(fs.readFileSync(path.join(dir,'backup/mods/poc-dimension-matrix-1.0.0.jar')));
function check(b,s){if(!b)throw Error(s);}
check((await jar.file('machine-redesign.json').async('string'))===JSON.stringify(layouts),'Installed structure metadata mismatch');
for(const[name,p]of[['dimension-matrix-structure.json','kubejs/data/rain/dimension_matrix/structure.json'],['dimension-matrix-visual.json','kubejs/assets/rain/dimension_matrix/visual.json']])check(sha(await jar.file(name).async('nodebuffer'))===sha(fs.readFileSync(path.join(root,p))),'Dimension matrix resource '+name);
for(const name of['power_on','accelerate','full_speed','decelerate','warning']){const p='assets/poc_dimension_matrix/sounds/'+name+'.ogg';check(sha(await jar.file(p).async('nodebuffer'))===sha(await oldJar.file(p).async('nodebuffer')),'Changed dimension matrix audio '+name);}
for(const name of['MachineFx','MachineFx$State','MachineFxScene'])check(!(await jar.file('creation/matrix/'+name+'.class').async('nodebuffer')).includes(Buffer.from('net/minecraft/client/')),'Client reference in common class '+name);
const audio=[];for(const name of['start','stop','mining','dyeing','fluid','inspector']){const p='assets/poc_dimension_matrix/sounds/fx_'+name+'.ogg';check(jar.file(p),'Missing sound '+name);const r=spawnSync('E:/minecraft/ffmpeg-9.0.2-essentials_build/bin/ffprobe.exe',['-v','error','-show_entries','stream=codec_name,sample_rate,channels:format=duration','-of','json',path.join(root,'tools/poc-dimension-matrix/src/main/resources',p)],{encoding:'utf8',windowsHide:true});check(r.status===0,'Audio decode '+name);const data=JSON.parse(r.stdout);check(data.streams[0].channels===1&&data.streams[0].sample_rate==='44100','Audio format '+name);audio.push({name,...data.streams[0],duration:data.format.duration});}
const build=JSON.parse(fs.readFileSync(path.join(root,'.cache/dimension-matrix/build/build-result.json'))),args=fs.readFileSync(path.join(build.build,'javac-tests.args'),'utf8').trim().split(/\r?\n/).map(s=>JSON.parse(s));
const cp=path.join(build.build,'tests')+path.delimiter+args[args.indexOf('-classpath')+1];const result=spawnSync('C:/Users/44479/.jdks/loom-ea-25-loom+1-11/bin/java.exe',['-ea','-Djava.awt.headless=true','-cp',cp,'creation.matrix.MachineRedesignDataAudit',root],{cwd:cache,encoding:'utf8',windowsHide:true});fs.writeFileSync(path.join(cache,'native-data-audit.log'),result.stdout+'\n'+result.stderr);check(result.status===0,'Native data audit '+result.stderr);console.log(result.stdout.trim());
for(const s of main){check(fs.existsSync(path.join(dir,'previews',s.id+'-structure.png')),'Missing structure preview '+s.id);check(fs.existsSync(path.join(dir,'previews',s.id+'-layers.png')),'Missing layer preview '+s.id);if(s.effect!=='time')check(fs.existsSync(path.join(dir,'previews',s.id+'-cycle.gif')),'Missing animation '+s.id);}
check(fs.existsSync(path.join(dir,'previews/inspector-0-cycle.gif')),'Missing inspector preview');
const materialText=main.map(s=>{const old=counts(before.find(v=>v.id===s.id)),next=counts(s);return `## ${s.name}\n\n| 方块 / 状态 | 原数量 | 新数量 |\n|---|---:|---:|\n`+Object.entries(next).map(([id,n])=>`| ${id} | ${old[id]} | ${n} |`).join('\n');}).join('\n\n');fs.writeFileSync(path.join(dir,'materials.md'),'# 新旧材料逐项对照\n\n包括控制器；时间晶体与原子塔共用同一个控制器，组合搭建时只计一次。七种结构检测器图纸与相应主体逐格一致。\n\n'+materialText+'\n');
const table=main.map(s=>`| ${s.name} | ${s.pattern[0][0].length}×${s.pattern.length}×${s.pattern[0].length} | ${blocks(s).length-1} + 1 | [结构](previews/${s.id}-structure.png) · [运行](previews/${s.id}-running.png) · [分层](previews/${s.id}-layers.png)${s.effect==='time'?'':` · [动画](previews/${s.id}-cycle.gif)`} |`).join('\n');
const readme=`# 自定义多方块科技重设计 · 2026-10-23

已写入当前实例，完整重启客户端和服务端后生效。本次没有启动游戏、载入存档、提交或推送 Git。

[打开预览画廊](gallery.html) · [结构总览](previews/structures-overview.png) · [运行效果总览](previews/effects-overview.png) · [材料对照](materials.md) · [音效试听](audio/machine-sound-preview.ogg)

四类多方块共16份声明：8套主体、1套时间晶体附加结构、7套相应检测图。维度方阵的结构、投影参数与配方源文件保持原样；共用扩展JAR增加了其他机器的表现代码。

| 设计 | 外接尺寸（宽×高×深） | 结构方块 + 控制器 | 预览 |
|---|---|---:|---|
${table}

结构检测器使用对应的7套主体形状，运行时显示绿色扫描网格。[检测器动画](previews/inspector-0-cycle.gif)。完整逐层图见 previews/inspector-0-layers.png 至 inspector-6-layers.png。

所有主体的控制器都紧贴红石块，红石块在控制器正后方一格。图纸以正面朝南为规范，支持四个水平朝向。控制器需单独放置，建筑小帮手模板不复制带机器身份的控制器。时间晶体附加结构包含6个时间晶体方块，与原子塔共用控制器；不是独立运行的机器，合并后共622个方块（含1个控制器）。

## 动画与声音

结构完整并通电后用1.5秒渐显；配方实际运行时用1.5秒加速，暂停、缺料或缺电时用1秒制动，断电时用1秒淡出。投影包括光谱双螺旋、相位钻束、交错轨道、星核光菱与扫描网格。全部为虚拟几何，不增加建造材料、世界方块或配方耗能。

四类机器各有原创电子机械循环，另有启动和停机音。待机无常驻循环声，声音随距离衰减，使用“方块”音量并带中英字幕；离开48格、拆机、区块卸载或换世界后释放循环。36秒试听依次为采矿、染色、流体、检测，每类9秒。GIF演示为8秒：启动、运行、制动、淡出；实际运行时长仍由原配方决定。

## 模板与一键搭建

7份任务模板更新为独立的新UUID，当前8处任务奖励引用已替换。进入世界时补齐新模板；已领取的旧官方模板只有在其建筑数据与原版逐状态、逐坐标一致时才安全升级，任何玩家编辑过的数据及其他UUID保留。原始负载、原UUID和任务源文件完整保存在backup/。旧工具已载入的复制缓存需要在模板管理器中重新载入。

虚空采矿III和染色工厂的一键搭建方块同步读取新结构。仍需副手持手杖；控制器放在标记正上方并面向北。搭建前检查位置，已有不同方块时取消。原基础流体处理的简易搭建入口保持原样，它没有这些多方块条件。

## 备份与检查

- backup/：开始修改时的机器脚本、任务、模板、机器参数、共用扩展源码/JAR，以及维度方阵数据与参数副本；包含用户已有修改。
- before.json / structures.json：修改前后全部结构与配方声明快照。
- verification.json：材料数量、红石块相邻、支撑、附加结构兼容与520条功能配方不变检查。
- template-manifest.json：新版与原版UUID映射、任务奖励引用数量。
- delivery.json：已安装JAR摘要、音频格式和原生数据核验结果。

离线检查通过：Java 21目标编译、真实Mixin转换、原有维度方阵全部回归、新特效网格与时序、四朝向矩阵、14份原生FTB SNBT与14份模板NBT解析、逐格模板/一键搭建一致性、安全迁移及重复加载。任务除两个模板UUID字段外与备份解析后完全相等。520条配方的材料、产物、能量、时长、优先级和其他行为未改动。

预览使用实际结构坐标、本机方块贴图以及生产MachineFxScene导出的网格；方块以立方体近似，玻璃透明度和非立方体/实体方块外观仅作示意，不是游戏截图。时间晶体单独图片只展示附加结构。未验证游戏内光影组合、声音混音和实际生存搭建。现有KubeJS日志来自本次修改前，不能作为此次加载通过的证据。

结构字段语义参考 [Custom Machinery官方结构文档](https://frinn.gitbook.io/custom-machinery-1.21/recipes/requirements/structure)，接口与旋转以本机0.10.72及BG2 1.3.9字节码核对。

## 重新生成

从整合包根目录运行 node tools/poc-machine-redesign/generate.mjs、templates.mjs 和 verify.mjs。生成器以backup/基线替换结构数组；修改这些文件后不要直接重跑，否则会按基线重建。

扩展构建沿用 tools/poc-dimension-matrix/build.mjs，增加 --test --machine-preview --machine-audit 可做离线核验与导出。preview.mjs --animate 读取导出的生产网格并输出图片/GIF。sounds.mjs 需要FFmpeg路径。此处没有使用AI生成结构概念图。
`;
fs.writeFileSync(path.join(dir,'README.md'),readme);
const cards=main.map(s=>`<article><h2>${s.name}</h2><p>${s.pattern[0][0].length} × ${s.pattern.length} × ${s.pattern[0].length} · ${blocks(s).length-1}结构方块 + 1控制器</p><img src="previews/${s.id}-running.png" alt="${s.name}运行效果"><nav><a href="previews/${s.id}-structure.png">结构</a><a href="previews/${s.id}-layers.png">逐层图纸</a>${s.effect==='time'?'':`<a href="previews/${s.id}-cycle.gif">启停动画</a>`}</nav></article>`).join('');
fs.writeFileSync(path.join(dir,'gallery.html'),`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>创世之径 · 多方块设计</title><style>body{background:#07111c;color:#d5edf6;font:16px "Microsoft YaHei",sans-serif;margin:30px}h1{color:#dffbff}p{color:#8cb3c4;line-height:1.7}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:24px}article{border:1px solid #254657;background:#0b1825;padding:18px;border-radius:12px}h2{font-size:20px;margin:0}img{width:100%;border-radius:8px}a{color:#79dcf3;margin-right:24px}audio{width:min(600px,100%)}nav{padding:12px 0}footer{margin:30px 0;color:#8cb3c4}</style><h1>创世之径 · 自定义多方块</h1><p>控制器紧贴红石块 · 材料种类与数量不变 · 维度方阵结构不变<br>离线贴图立方体预览；动画直接读取生产特效网格。点击下方入口查看完整图纸和GIF。</p><audio controls src="audio/machine-sound-preview.ogg"></audio><main>${cards}<article><h2>结构检测器 · 扫描网格</h2><p>与7套对应生产机器共用形状</p><img src="previews/inspector-0-cycle.gif" alt="结构检测器扫描动画"><a href="previews/inspector-0-layers.png">逐层图纸</a></article></main><footer><a href="materials.md">材料对照</a><a href="README.md">完整说明与验证范围</a>未启动游戏或读取存档。</footer></html>`);
const archive=new JSZip();const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(path.join(p,d.name)):[path.join(p,d.name)]);for(const p of walk(path.join(dir,'backup')))archive.file(path.relative(dir,p).replaceAll('\\','/'),fs.readFileSync(p),{date:new Date('2026-10-23T00:00:00Z')});for(const file of['before.json','protected.json'])archive.file(file,fs.readFileSync(path.join(dir,file)),{date:new Date('2026-10-23T00:00:00Z')});const backupZip=await archive.generateAsync({type:'nodebuffer',compression:'DEFLATE',compressionOptions:{level:6}});fs.writeFileSync(path.join(dir,'original-multiblocks-backup.zip'),backupZip);
const receipt={installedJar:'mods/poc-dimension-matrix-1.0.0.jar',sha256:sha(installed),backupArchive:{file:'original-multiblocks-backup.zip',sha256:sha(backupZip)},build,checks:{structures:16,functionalRecipesUnchanged:520,controllerAdjacentToRedstone:15,sharedTimeAnnex:true,nativeFtbFiles:14,nativeNbtTemplates:14,taskRewardReferences:8,newTemplates:7,safeLegacyMigrations:7,oneClickHelpers:2,dimensionStructureAndVisualUnchanged:true,dimensionAudioUnchanged:true,realMixinTransform:true,noGameLaunch:true},audio,nativeAudit:result.stdout.trim()};fs.writeFileSync(path.join(dir,'delivery.json'),JSON.stringify(receipt,null,2));
console.log(JSON.stringify({installedSha256:receipt.sha256,gallery:path.join(dir,'gallery.html'),readme:path.join(dir,'README.md')}));
