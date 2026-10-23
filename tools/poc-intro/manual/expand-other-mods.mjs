import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {Zip} from './zip.mjs';
import {nativeChinese,workflows} from './other-content.mjs';
const file='tools/poc-intro/src/main/resources/assets/poc_intro/manual.json',d=JSON.parse(fs.readFileSync(file));
const inv=JSON.parse(fs.readFileSync(process.argv[2]||'D:/codex-work/manual-20261020/inventory.json')),entries=new Map(d.entries.map(e=>[e.id,e])),before=structuredClone(d);
const mods=fs.readdirSync('mods'),archives=new Map(),archive=f=>{if(!archives.has(f))archives.set(f,new Zip('mods/'+f));return archives.get(f);};
const mediaFile='tools/poc-intro/manual/media-sources.json',media=JSON.parse(fs.readFileSync(mediaFile));
function illustrations(e,json,jar,doc){
 for(const resource of (json.pages||[]).flatMap(p=>p.images||[])){
  const [ns,p]=resource.split(':'),asset='assets/'+ns+'/'+p,bytes=archive(jar).read(asset);if(!bytes||bytes.length<24||bytes.readUInt32BE(0)!==0x89504e47)continue;
  const preview='images/'+crypto.createHash('sha256').update(resource).digest('hex').slice(0,16)+'.png';
  if(!d.pictures[resource]){d.pictures[resource]={resource,width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),caption:e.zh,captionEn:e.en,credit:'RF工具 原模组手册',preview};media.images.push({resource,jar,path:asset,doc,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});}
  fs.writeFileSync('design/manual-20261020/'+preview,bytes);e.pictures=[...new Set([...e.pictures,resource])];
 }
}
const owner=new Map(d.groups.flatMap(g=>g.mods.map(ns=>[ns,g.id]))),sources=[],newGuides=[];
const extraNames={'rftoolsstorage:tablet_scanner':'平板扫描器'};
const name=(id,cn=true)=>{if(cn&&extraNames[id])return extraNames[id];const e=entries.get(id);if(e)return cn?e.zh:e.en;const lang=inv.langs[cn?'zh_cn':'en_us'];return lang['block.'+id.replace(':','.')]||lang['item.'+id.replace(':','.')]||id;};
const clean=(text,cn=true)=>String(text||'')
 .replace(/\$\(br2\)|\$\(p\)/g,'\n\n').replace(/\$\(br\)/g,'\n').replace(/\$\(li\d?\)/g,'\n- ')
 .replace(/\$\(k:[^)]+\)/g,cn?'上方当前绑定的按键':'the current binding above').replace(/\$\([^)]*\)/g,'')
 .replace(/<ItemLink[^>]*id="([^"]+)"[^>]*\/?>/g,(_,id)=>name(id,cn)).replace(/<[^>]+>/g,'')
 .replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/§[0-9a-fk-or]/gi,'').replace(/\*\*/g,'')
 .replace(/^#{1,6}\s*/gm,'').replace(/参见后页|详见后页/g,'见下文').replace(/\n{3,}/g,'\n\n').trim();
function put(id,group,zh,en,body,bodyEn,items,source,controls=[]){
 items=[...new Set(items.filter(i=>inv.items[i]))];if(!body||body.length<45||!bodyEn)return null;
 let e=entries.get(id);if(!e){e={id,group,guide:true};d.entries.push(e);entries.set(id,e);newGuides.push(id);}
 const pictures=[...new Set(items.flatMap(id=>entries.get(id)?.pictures||[]))];
 Object.assign(e,{zh,en,body,bodyEn,items,tags:[],controls,pictures,sources:[source],detailLevel:'native',topicId:source});sources.push({entry:id,source,items});return e;
}
const jd=mods.find(n=>n.startsWith('justdirethings-')&&n.endsWith('.jar')),jz=archive(jd);
for(const doc of jz.entries.keys()){
 if(!/\/en_us\/entries\/(mach_|item_|goo_|upgrade_basics|tool_basics)/.test(doc)||!doc.endsWith('.json'))continue;
 const en=jz.json(doc),cn=jz.json(doc.replace('/en_us/','/zh_cn/'));if(!cn)continue;
 const texts=o=>(o.pages||[]).map(p=>p.text||'').filter(Boolean).join('\n\n');
 let body=clean(texts(cn)),bodyEn=clean(texts(en),false);if(body.length<85)continue;
 let icon=(typeof cn.icon==='string'?cn.icon:cn.icon?.item||'').split('[')[0],items=[icon].filter(id=>inv.items[id]);
 if(!items.length)continue;let stem=path.posix.basename(doc,'.json'),controls=[];
 if(/tool_basics|upgrade_basics/.test(stem))controls=['justdirethings.key.toolUI','justdirethings.key.toggle_tool'];
 put('more/justdirethings/'+stem,'justdirethings',clean(cn.name),clean(en.name,false),body,bodyEn,items,jd+'!'+doc.replace('/en_us/','/zh_cn/'),controls);
 // Patch abbreviated fallback descriptions; retain existing machine-specific text and curated controls.
 let item=entries.get(icon);if(item&&/设备通过 GUI|这是结构或端口部件/.test(item.body)){item.body=body;item.bodyEn=bodyEn;item.sources=[...new Set([...item.sources,jd+'!'+doc.replace('/en_us/','/zh_cn/')])];}
}
for(const [key,body] of Object.entries(nativeChinese)){
 const [ns,slug]=key.split(':'),jar=mods.find(n=>n.toLowerCase().includes(ns+'-')&&n.endsWith('.jar')),z=archive(jar);
 const doc=`assets/rftoolsbase/patchouli_books/manual/en_us/entries/${slug}.json`,json=z.json(doc);if(!json)throw Error('Missing native guide '+jar+'!'+doc);
 const icon=(typeof json.icon==='string'?json.icon:json.icon?.item||'').split('[')[0];let items=[icon,...Object.keys(json.extra_recipe_mappings||{})].filter(i=>inv.items[i]);
 const group=ns==='xnet'?'xnet':'rftools',title=name(icon);if(!/[\u3400-\u9fff]/.test(title))throw Error('Untranslated guide '+key+' '+title);
 let e=put('more/'+ns+'/'+slug,group,title+'：操作与配置',json.name,body,clean(json.pages.map(p=>p.text||'').join('\n\n'),false),items,jar+'!'+doc);
 if(e)illustrations(e,json,jar,doc);
 const target=entries.get(icon);if(e&&target){target.body=body;target.bodyEn=e.bodyEn;target.pictures=[...new Set([...(target.pictures||[]),...e.pictures])];target.sources=[...new Set([...target.sources,e.sources[0]])];}
}
const pj=mods.find(n=>n.startsWith('Powah-')&&n.endsWith('.jar')),pz=archive(pj);
for(const doc of pz.entries.keys()){
 if(!/^assets\/powah\/guides\/powah\/book\/(?:generators|storage_transfer|energizing)\/.+\.md$/.test(doc)||doc.endsWith('/index.md'))continue;
 const text=pz.read(doc).toString(),front=text.match(/^---([\s\S]*?)---/)?.[1]||'';
 const items=[...front.matchAll(/-\s*(powah:[a-z0-9_]+)/g)].map(m=>m[1]).filter(i=>inv.items[i]);if(!items.length)continue;
 const sample=items.map(i=>entries.get(i)).find(e=>e?.body&&/[\u3400-\u9fff]/.test(e.body));if(!sample)continue;
 put('more/powah/'+path.posix.basename(doc,'.md'),'powah',sample.zh.replace(/（.*?）/g,'')+'：工作原理',clean(front.match(/title:\s*(.+)/)?.[1]||'Powah',false),sample.body,sample.bodyEn,items,pj+'!'+doc);
}
for(const [group,slug,title,items,body,bodyEn] of workflows){
 const valid=items.filter(id=>inv.items[id]);if(!valid.length)throw Error('No installed workflow item '+slug);
 const jar=inv.items[valid[0]].file,ns=valid[0].split(':')[0];
 put('more/'+group+'/'+slug,group,title,slug.replaceAll('-',' '),body,bodyEn,valid,jar+'!assets/'+ns+'/lang/en_us.json');
 if(group==='functionalstorage'&&slug==='drawer-access')for(const e of d.entries.filter(e=>!e.guide&&e.group===group&&/_(?:1|2|4)$/.test(e.id))){e.body=body;e.bodyEn=bodyEn;e.sources=[...new Set([...e.sources,'manual/other-content.mjs#drawer-access'])];}
}
const sj=mods.find(n=>n.startsWith('Super Factory Manager')&&n.endsWith('.jar')),sz=archive(sj);
const sfmRows=[
 ['first','SFM：第一条搬运程序','a_simple_program.sfml',`准备
把管理器、来源箱与目标箱用物流线连通，用标签枪把来源标为 a、目标标为 b。标签是程序中引用库存的名称，拼写必须与程序一致。

程序
NAME "箱子搬运"
EVERY 20 TICKS DO
  INPUT FROM a
  OUTPUT TO b
END

运行机制
INPUT 记录本轮可以从哪里取物，单独写它不会把物品搬进管理器内部缓存。OUTPUT 才执行从当前输入集合到目标的传输。编辑并保存后查看管理器报错和运行状态；不需要另给这个物品搬运程序添加 FE。

故障排查
先查网络连通、a/b 标签和保存状态，再查目标空间。不要只写 INPUT 然后等待管理器里出现物品。`],
 ['forget','SFM：FORGET 与串线排查','forget.sfml',`工作机制
同一次触发内，前面的 INPUT 选择会继续有效；执行一次 OUTPUT 不会自动清空输入集合。第二段输出如果不清理，就可能把第一批来源也纳入。

操作步骤
两个独立搬运步骤之间写 FORGET，或用 FORGET a 清除指定输入。它忘记的是本轮的来源选择，不会删除箱内物品。

示例
EVERY 20 TICKS DO
  INPUT FROM a
  OUTPUT 1 TO b
  FORGET
  INPUT FROM c
  OUTPUT TO d
END

故障排查
发现 d 里出现 a 的物品时先查输入集合是否清理，再查标签是否误绑。`],
 ['sides','SFM：机器侧面与槽位','slots_and_sides.sfml',`操作步骤
标签确定目标方块，SIDE 进一步确定通过哪一面访问，SLOTS 指定槽位。机器能从 GUI 手动取放，不代表所有自动化面都开放同一槽位。

安装版示例
EVERY 20 TICKS DO
  INPUT FROM a TOP, WEST SIDE SLOTS 0,1,3-4,7-9,21
  OUTPUT TO a BOTTOM SIDE SLOTS 2
END

故障排查
用容器检查器查看目标暴露的槽位与资源，再逐段缩小到一个面、一个槽。槽位编号依设备接口而定，不能照搬另一个模组机器的编号。`],
 ['resources','SFM：物品、流体与资源类型','resource_types.sfml',`工作机制
普通 INPUT 默认处理物品。流体、能量及其他资源需要正确的资源类型前缀，不能用物品搬运语句替代流体操作。

流体示例
EVERY 20 TICKS DO
  INPUT fluid:: FROM a
  OUTPUT fluid:: TO b
END

过滤
fluid::water 选择水；完整资源标识还可写成 sfm:fluid:*:water。物品名可能匹配多个模组，需要精确限定时写出模组 ID。当前安装版模板的资源类型列表由运行时生成，不把模板内占位符当成可运行语句。

故障排查
先用检查器确认容器暴露的是物品、流体还是其他资源，再检查输入输出类型与机器面配置。`],
 ['limits','SFM：数量、保留量与 EACH','limits.sfml',`配置步骤
INPUT 1 FROM a 限制本次选择数量；OUTPUT 5 TO b 限制本次输出。RETAIN 设置需要保留的数量，EACH 进一步决定限制是对每种匹配资源或每个目标分别计算。

安装版例句
INPUT 5 RETAIN 3 stone FROM a
INPUT 5 EACH *ingot FROM a
OUTPUT 1 TO EACH b

这些是不同用法示例，写入程序时仍需放在触发块中，并配套正确的 INPUT / OUTPUT。先确定你要的是每个目标一件，还是所有目标合计一件。

故障排查
只移动少量或一直不补货时，检查库存是否已触及保留量、通配匹配了几种物品、标签是否绑定多个目标。`],
 ['inspect','SFM：标签、检查器与编辑器','a_simple_program.sfml',`操作步骤
用标签枪给真实库存或机器设置标签，程序用同样名称引用。网络工具用于查看线路和连接；容器检查器用于确认面、槽位及资源接口。

故障排查
报找不到标签时检查拼写与绑定；有标签但传输失败时检查连接、资源类型、面、过滤和容量。管理器内编辑文本后要保存并检查编译信息，屏幕上看到新文字不代表正在运行的程序已经更新。

按键
下方动作都以当前设置为准；未分配的功能先到控制设置绑定。程序编辑快捷键只在相应管理器界面生效。`],
];
for(const [slug,title,doc,body] of sfmRows){let path='assets/sfm/template_programs/'+doc,controls=slug==='inspect'?['key.sfm.container_inspector.activation_key','key.sfm.manager.text_editor','key.sfm.toggle_label_view_key']:[];
 put('more/sfm/'+slug,'sfm',title,'SFM '+slug,body,'Installed reference program:\n\n'+sz.read(path).toString().replace(/\$REPLACE_RESOURCE_TYPES_HERE\$/g,'See the generated resource type list in the running editor.'),['sfm:manager','sfm:labelgun','sfm:network_tool','sfm:cable'],sj+'!'+path,controls);}
Object.assign(d.keybinds,{
 'justdirethings.key.toolUI':{zh:'打开工具或装备配置',en:'Open tool or armor settings',when:'按原手册要求持有工具或穿戴对应装备；未分配时先绑定。',whenEn:'Hold the tool or wear the relevant gear; bind this action if unbound.'},
 'justdirethings.key.toggle_tool':{zh:'切换工具能力',en:'Toggle tool abilities',when:'用于持有或装备的对应工具；升级自身按键在配置界面管理。',whenEn:'Use with the relevant equipped tool; ability-specific bindings are managed in its UI.'},
 'key.sfm.container_inspector.activation_key':{zh:'容器检查器',en:'Container inspector',when:'对准需要查看的库存或机器。',whenEn:'Inspect the target inventory or machine.'},
 'key.sfm.manager.text_editor':{zh:'管理器文本编辑器',en:'Manager text editor',when:'在管理器界面内使用。',whenEn:'Use inside the Manager GUI.'},
 'key.sfm.toggle_label_view_key':{zh:'显示或隐藏标签',en:'Toggle label overlay',when:'用于检查机器与库存的标签。',whenEn:'Use to inspect inventory and machine labels.'},
});
// Make focused tutorials discoverable above thousands of level/color variants.
const ranks=new Map(sources.map((s,i)=>[s.entry,i]));d.entries.sort((a,b)=>d.groups.findIndex(g=>g.id===a.group)-d.groups.findIndex(g=>g.id===b.group)||Number(b.guide)-Number(a.guide)||(ranks.get(a.id)??100000)-(ranks.get(b.id)??100000));
d.entries=d.entries.filter(e=>e.id!=='more/rftoolsstorage/modularstorage/remote_module');
media.finalPictures=Object.keys(d.pictures).length;media.illustratedEntries=d.entries.filter(e=>e.pictures?.length).length;fs.writeFileSync(mediaFile,JSON.stringify(media,null,2));
fs.writeFileSync(file,JSON.stringify(d,null,1));
const old=new Map(before.entries.map(e=>[e.id,e])),report={newGuides,sources,importedTutorials:sources.length,addedThisRun:newGuides.length,modifiedExistingEntries:d.entries.filter(e=>old.has(e.id)&&JSON.stringify(e)!==JSON.stringify(old.get(e.id))).length,entries:d.entries.length,operationGuides:d.entries.filter(e=>e.guide).length,keyActions:Object.keys(d.keybinds).length};
fs.writeFileSync('tools/poc-intro/manual/other-mods-coverage.json',JSON.stringify(report,null,2));console.log(JSON.stringify({...report,sources:undefined,newGuides:undefined},null,2));
