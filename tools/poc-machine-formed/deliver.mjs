import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {root} from '../poc-machine-redesign/inventory.mjs';
const require=createRequire('C:/Users/44479/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/_poc.cjs'),JSZip=require('jszip');
const dir=path.join(root,'design/machine-formed-20261023'),titles=JSON.parse(fs.readFileSync(path.join(dir,'titles.json'))),verification=JSON.parse(fs.readFileSync(path.join(dir,'verification.json')));
if(!verification.installed)throw Error('Verify the installed JAR before delivery');
const zip=new JSZip(),walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);
for(const f of walk(path.join(dir,'backup')))zip.file(path.relative(dir,f).replaceAll('\\','/'),fs.readFileSync(f));zip.file('baseline.json',fs.readFileSync(path.join(dir,'baseline.json')));
const backup=path.join(dir,'before-formation-backup.zip');fs.writeFileSync(backup,await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE',compressionOptions:{level:6}}));
const instructions=`# 自定义多方块自动成形 · 2026-10-23

8 套生产主体现在会在结构完整后自动切换为整机外观，无需通电或拿工具确认。断电仍保持外壳，配方执行时机械部件加速，停机后约一秒制动；结构破坏后解除成形，恢复原搭建方块外观。服务端首次 tick 即检查，其后每 10 tick 复查，正常 20TPS 下变化最多约 0.5 秒同步。

成形隐藏原结构方块、其方块实体与流体的显示，并绘制统一的实体机械模型。所有原世界方块、NBT、库存、流体、能量与自动化接口保留；没有拆走、复制或重新放置材料。实际碰撞和交互位置仍由原方块提供，因此本次是视觉成形，不会给原本的空气格增加碰撞。

维度方阵沿用原结构与渲染。废案结构检测器已排除，不新增其成形模型或运行效果；已有检测器配方与任务数据保留以免扩大改动范围。

## 机型与实际工艺

|机器|配方用途与对应机构|
|---|---|
|染色工厂|染色本质训练 Hostile Networks 数据模型；本质处理槽、模型卡匣夹具、往复写入头|
|三级虚空采矿机|虚空采矿；门架、升降螺旋钻头与采掘井|
|四级虚空采矿机|更高等级矿物提取；双级采掘转子、导向轴与分离舱|
|五级虚空采矿机|深层矿物提取；多级采掘轴、分离转子与外部散热支撑|
|药剂精炼工厂|药剂配方一次输出三瓶；循环泵、混合观察窗、三瓶灌装工位|
|大型流体处理器|UU、反物质等大型流体转化；进液泵、回流管、封闭反应舱及搅拌叶轮|
|原子再构室|使用原子重构流体重构物品；工作平台、定向照射头与约束观察窗|
|预言矩阵|预言矩阵物质生成模型、命令方块等；计算机柜、冷却总线与结果生成舱|

时间晶体附加模块仍使用原子再构室的共用控制器；安装完整后显示贴合控制台的线圈模块。它不是第九套独立机器。原子机动图后半段包含这个可选模块的展示。

工作机构根据原生配方 RUNNING 状态运动；指示灯和控制面板根据供电显示。移除了旧版漂浮扫描环、光菱和装饰轨道。启动、制动、运行循环声沿用已有资源，并增加成形时的启动声；声音跟随方块音量和运行状态。

## 安装与恢复

已安装：mods/poc-dimension-matrix-1.0.0.jar，${verification.jarBytes.toLocaleString('en-US')} 字节。

SHA256：${verification.sha256}

客户端、服务端均需完整重启，单独 /reload 不能替换 Java 渲染类。现有结构无需重新搭建，已有建筑小帮手模板继续对应相同的搭建图；控制器与红石块仍相邻。本次未再次修改结构、模板、配方、任务或维度方阵文件。

before-formation-backup.zip 保存本次成形改动前的 150 份源文件、任务、数据与旧 JAR。最初形状重设计之前的结构备份仍在 ../multiblock-redesign-20261023/original-multiblocks-backup.zip。两个备份代表不同阶段，均未覆盖。

## 图与检查

打开 gallery.html 查看全部机型的搭建图、完整但未通电、配方运行、成形循环四个状态。previews/ 下可单独打开 PNG 和 GIF。动图约 8 秒、64 帧，依次展示搭建原貌示意 → 未通电成形 → 运行 → 制动停机 → 解除成形。原貌帧复用完整搭建图作为结构示意，并未模拟某一块实际拆除。

整机图在隐藏 GLFW 窗口直接绘制生产 FormedMachineScene 网格，使用深度测试、透明玻璃和加色指示灯；未添加图片专用部件、假辉光或后期效果。搭建图使用原结构坐标与本机材质的贴图立方体近似。所有图均为离线预览，不是游戏截图，未进行游戏或光影包实测。

已通过 Java21 编译、全部原维度方阵回归、8 套主体在无电/运行/停机/破坏状态的几何检查、四朝向与结构成员检查、重叠遮罩和渲染工作线程读取检查、本机 Custom Machinery/原版/Sodium 六个目标的真实 Mixin 转换，以及移除 Sodium 后的四目标回退检查。14 份任务原生 SNBT 与 14 份模板 NBT 检查通过；520 条功能配方、逐种方块数量及模板搭建图保持。所有旧 JAR 中的 ${verification.preservedJarResources} 份非 Mixin 资源及 ${verification.preservedJarClasses} 个未涉及类逐字节保持。详情见 verification.json。

## 维护命令

在整合包目录使用本机 Node.js 与 JDK21+：

FENCE_POWERSHELL
node tools/poc-dimension-matrix/build.mjs --jdk '<JDK目录>' --output '.cache/machine-formed/candidate.jar' --test --machine-audit --assembly-preview
node tools/poc-machine-formed/gpu-preview.mjs
node tools/poc-machine-formed/preview.mjs --animate
node tools/poc-machine-formed/verify.mjs --no-sodium
FENCE_END

gpu-preview.mjs 使用当前机器的 JDK 和离线图形库路径，换机器时需调整；它不启动 Minecraft。prepare.mjs 仅首次保存备份，不覆盖现有基线。verify.mjs --installed 核对已安装 JAR；deliver.mjs 只打包备份与生成本地说明/画廊，不安装或发布。
`;
// Markdown code fences are inserted separately to keep template literals readable.
fs.writeFileSync(path.join(dir,'README.md'),instructions.replace('FENCE_POWERSHELL','```powershell').replace('FENCE_END','```'));
const details={
 'dyeing-0':'本质先进入处理槽，模型固定于夹具，写入头只在配方运行时往复。',
 'mining-0':'门架支撑钻杆，螺旋钻头在采掘井内旋转并轻微进给。',
 'mining-1':'双层分离转子围绕贯穿导向轴工作，外壳承担支撑与散热。',
 'mining-2':'增加采掘级数与分离机构，形成更高的采矿塔。',
 'fluid-0':'侧置循环管路连接混合观察柱，底部布置三瓶灌装位。',
 'fluid-1':'外置进液泵与铜色回流管接入封闭反应舱，内部叶轮随配方旋转。',
 'fluid-2':'照射头朝向中心物料平台，束流仅在配方执行时出现在约束舱内。',
 'fluid-4':'六组计算机柜连接冷却总线，中间结果舱执行实体化工序。'
};
const gallery=`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>创世之径 · 自动成形预览</title><style>
body{margin:0;background:#09121c;color:#dcecf1;font:16px/1.65 "Microsoft YaHei",sans-serif}main{max-width:1700px;margin:auto;padding:28px}h1{font-size:30px;margin:0}p{color:#9bb5c4;margin:8px 0 20px}nav{position:sticky;top:0;background:#09121cf2;padding:12px 0;z-index:2;display:flex;flex-wrap:wrap;gap:10px}button,a{font:inherit;color:inherit}button{border:1px solid #35505f;padding:8px 18px;border-radius:6px;background:#152430;cursor:pointer}button[aria-pressed=true]{background:#315a66;border-color:#73a5af}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,580px),1fr));gap:24px}article{border:1px solid #253c4a;border-radius:10px;overflow:hidden;background:#101e2a}h2{font-size:20px;margin:16px 20px 0}article p{margin:6px 20px 14px}img{display:block;width:100%;height:auto}.pair{display:grid;grid-template-columns:1fr 1fr;gap:1px}footer{margin-top:30px;border-top:1px solid #304858;padding-top:20px;color:#91acbc}a{color:#8ecdd3}figcaption{text-align:center;color:#90aebd}figure{margin:0}
</style><main><h1>创世之径 · 多方块自动成形</h1><p>8 套生产机器：结构完整即可显示整机，断电仍保持外壳。维度方阵保持原样，废案结构检测器已排除。全部画面为实际生产几何的离线预览。</p><nav><button data-mode="pair" aria-pressed="true">前后对照</button><button data-mode="formed">完整 · 未通电</button><button data-mode="running">配方运行</button><button data-mode="assembly">成形与工作动图</button></nav><div class="grid">${Object.entries(titles).map(([id,[name]])=>`<article data-id="${id}"><h2>${name}</h2><p>${details[id]}</p><div class="view"></div></article>`).join('')}</div><footer>成形只替换显示；实际方块、库存、接口和碰撞保留。识别间隔 10 tick。客户端与服务端均需完整重启。<br><a href="README.md">说明与核验</a> · <a href="before-formation-backup.zip">本次改动前备份</a> · <a href="../multiblock-redesign-20261023/original-multiblocks-backup.zip">最初结构备份</a> · <a href="previews/fluid-2-time-addon.png">时间晶体可选模块</a></footer></main><script>
function picture(id,suffix,label){return '<figure><a href="previews/'+id+'-'+suffix+'"><img alt="'+label+'" loading="lazy" src="previews/'+id+'-'+suffix+'"></a><figcaption>'+label+'</figcaption></figure>'}
function show(mode){document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===mode));document.querySelectorAll('article').forEach(a=>{const id=a.dataset.id,v=a.querySelector('.view');v.className='view'+(mode==='pair'?' pair':'');v.innerHTML=mode==='pair'?picture(id,'before.png','搭建原貌')+picture(id,'formed.png','结构完整，未通电也成形'):picture(id,mode+(mode==='assembly'?'.gif':'.png'),mode==='assembly'?'搭建图 → 无电成形 → 运行 → 停机 → 恢复原貌':mode==='formed'?'结构完整 · 未通电':'配方执行中')})}document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.mode)));show('pair');
</script></html>`;
fs.writeFileSync(path.join(dir,'gallery.html'),gallery);
const delivery={jar:'mods/poc-dimension-matrix-1.0.0.jar',sha256:verification.sha256,backup:{file:'before-formation-backup.zip',bytes:fs.statSync(backup).size,sha256:crypto.createHash('sha256').update(fs.readFileSync(backup)).digest('hex')},originalBackup:'../multiblock-redesign-20261023/original-multiblocks-backup.zip',gallery:'gallery.html',overviews:['previews/before-overview.png','previews/formed-overview.png','previews/running-overview.png'],models:Object.keys(titles),gameTested:false};
fs.writeFileSync(path.join(dir,'delivery.json'),JSON.stringify(delivery,null,2));console.log(JSON.stringify(delivery,null,2));
