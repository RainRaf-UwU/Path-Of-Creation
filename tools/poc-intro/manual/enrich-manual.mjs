import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {Zip} from './zip.mjs';
const catalog='tools/poc-intro/src/main/resources/assets/poc_intro/manual.json',data=JSON.parse(fs.readFileSync(catalog)),inv=JSON.parse(fs.readFileSync('D:/codex-work/manual-20261020/inventory.json'));
const pictures={},byItem=new Map(),details=new Map(),evidence=[],gallery='design/manual-20261020/images';fs.mkdirSync(gallery,{recursive:true});
const docsDir='D:/codex-work/manual-20261020/reference-docs';fs.mkdirSync(docsDir,{recursive:true});
const joins=(text,cn)=>text.trim().split(/\n\s*\n/).map(p=>p.split('\n').map(s=>s.trim()).join(cn?'':' ')).join('\n\n');
function prose(text,cn){let body=text.replace(/^---[\s\S]*?---\s*/,''),skip=false,out=[];
 for(let line of body.split(/\r?\n/)){
  let heading=line.match(/^(?:#{1,6}\s+|\*\*)(.+?)(?:\*\*)?\s*$/)?.[1];
  if(heading){skip=/^(crafting|recipes?|合成|配方|制作配方|效率|efficiency)$/i.test(heading);if(!skip&&!/^#/.test(line))out.push('\n'+heading.replaceAll('*','')+'\n');continue;}
  if(skip||/^\s*\||^\s*---\s*$/.test(line))continue;
  if(/<(?:Recipes?For|BlockImage|ItemImage|GameScene|ImportStructure|IsometricCamera|ItemLink|Row|\/Row)/.test(line))continue;
  out.push(line.replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/<[^>]+>/g,'').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/\*\*/g,''));
 }
 let paragraphs=joins(out.join('\n').replace(/\n(?=- )/g,'\n\n'),cn).split('\n\n').filter(p=>p&&!/主要进展|main progression|每秒|per second|RF\/t|FE\/t|\d+\s*RF|显著消耗更多资源|significantly more resources/.test(p));
 return paragraphs.join('\n\n').replace(/AE2\s*\/\s*RS2/g,'AE2').slice(0,cn?1400:2800).trim();
}
function picture(zip,jar,resource,caption,credit,doc){let match=resource.match(/^assets\/([^/]+)\/(.+\.png)$/);if(!match||!zip.entries.has(resource))return null;let b=zip.read(resource);if(b.length<24||b.readUInt32BE(0)!==0x89504e47)return null;let width=b.readUInt32BE(16),height=b.readUInt32BE(20);if(width<100||height<50)return null;let id=match[1]+':'+match[2],file=crypto.createHash('sha256').update(id).digest('hex').slice(0,16)+'.png';pictures[id]={resource:id,width,height,caption:caption||'机器操作示意',captionEn:'Machine reference',credit,preview:'images/'+file};fs.writeFileSync(path.join(gallery,file),b);evidence.push({resource:id,jar,path:resource,doc,sha256:crypto.createHash('sha256').update(b).digest('hex')});return id;}
for(let ns of ['ae2','oritech','powah']){
 let jar=inv.mods.find(m=>m.id===ns).file,z=new Zip('mods/'+jar);
 let paths=[...z.entries.keys()].filter(n=>ns==='ae2'?n.startsWith('assets/ae2/ae2guide/')&&n.endsWith('.md'):ns==='oritech'?n.startsWith('assets/oracle_index/books/oritech/content/')&&n.endsWith('.mdx'):n.startsWith('assets/powah/guides/powah/book/')&&!/\/_[a-z]+_/.test(n)&&n.endsWith('.md'));
 for(let doc of paths){let en=z.read(doc).toString('utf8'),front=en.match(/^---([\s\S]*?)---/)?.[1]||'',ids=[...front.matchAll(/(?:^|\n)\s*(?:-\s*|id:\s*)([a-z0-9_]+:[a-z0-9_.\/-]+)/g)].map(m=>m[1]);
  if(!ids.length)continue;let related=front.match(/related_items:\s*\[([^\]]*)\]/)?.[1];if(related)ids.push(...related.match(/[a-z0-9_]+:[a-z0-9_./-]+/g)||[]);
  let zhPath=ns==='powah'?doc.replace('/book/','/book/_zh_cn/'):ns==='oritech'?doc.replace('/content/','/translated/zh_cn/content/'):'';
  let zh=zhPath&&z.read(zhPath)?.toString('utf8');
  if(zh&&ns!=='ae2'){let cnText=prose(zh,true),enText=prose(en,false);if(cnText.length>20)for(let id of ids)details.set(id,{body:cnText,bodyEn:enText,source:jar+'!'+zhPath});}
  let images=[];
  for(let m of en.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)){let p=path.posix.normalize(path.posix.join(path.posix.dirname(doc),m[2]));if(!z.entries.has(p)&&ns==='powah')p='assets/powah/textures/gui/book/images/'+path.posix.basename(m[2]);let id=picture(z,jar,p,m[1]||front.match(/title:\s*(.+)/)?.[1],ns.toUpperCase()+' 原模组手册',doc);if(id)images.push(id);}
  for(let m of en.matchAll(/<ModAsset\s+location="oritech:([^"\s]+)"/g)){let p='assets/oracle_index/books/oritech/assets/oritech/'+m[1]+'.png';let id=picture(z,jar,p,front.match(/title:\s*(.+)/)?.[1], 'Oritech 原模组手册',doc);if(id)images.push(id);}
  for(let id of ids){byItem.set(id,[...new Set([...(byItem.get(id)||[]),...images])].slice(0,5));}
  if(images.length||zh)fs.writeFileSync(path.join(docsDir,ns+'-'+path.posix.basename(doc)),zh||en);
 }
}
// Concise installed-AE2 summaries; no default recipe quantities are copied.
const extra={
 'ae2:inscriber':['接入 AE 或 FE。上下槽放对应压印模板/中间件，中央槽放待加工材料。\n\n开启分面模式：顶面访问上槽，底面访问下槽；四个侧面负责中央输入和成品输出。关闭分面后内部过滤会自动分槽。\n\n在 GUI 可启用自动输出并调整输入缓存；并联多台时选小缓存，避免一台占满原料。模板和加工步骤从 JEI 查看。','Supply AE or FE. Put presses/components in the upper and lower slots and the main ingredient in the center. In sided mode, top/bottom access their slots; horizontal sides feed the center and extract output. Configure auto-eject and buffer size in the GUI.'],
 'ae2:pattern_provider':['把编码样板装入供应器，供电并接入有空闲频道的 ME 网络。供应器必须直接面对能接收一整批原料的机器或容器。\n\n加工完成后，通过输入总线、接口或供应器回收槽把产物送回网络；只把产物放进存储总线连接的箱子，可能无法使合成任务完成。\n\n开启阻挡模式可在目标库存仍有原料时停止投送新批次。用扳手切换定向输出，或在 GUI 设置优先级。','Install encoded patterns and connect the provider to a powered ME network with a free channel. It must face an inventory that can accept a complete batch. Return processed results through an import bus, interface or provider return slot. Blocking mode waits while the target contains ingredients.'],
 'ae2:charger':['从顶面或底面接入 AE/FE，也可在该面安装曲柄手动供能。任意面可送入待充能物品；自动抽取时只会抽出已处理结果。用扳手旋转机器可调整供电方向。','Power from the top or bottom with AE/FE, or attach a crank there. Any face accepts items and extraction returns completed results only. Rotate with a wrench to change the power orientation.']
};
let enhanced=0,illustrated=0;
for(let e of data.entries){if(!e.guide&&details.has(e.id)){let text=details.get(e.id);e.body=text.body;e.bodyEn=text.bodyEn||e.bodyEn;e.sources.push(text.source);enhanced++;}if(extra[e.id]){[e.body,e.bodyEn]=extra[e.id];e.sources.push('AE2 installed ae2guide + official 1.21.1 player guide');enhanced++;}
 let links=e.guide?[...new Set(e.items.flatMap(id=>byItem.get(id)||[]))].slice(0,5):(byItem.get(e.id)||[]);if(links.length){e.pictures=links;illustrated++;}}
data.pictures=pictures;fs.writeFileSync(catalog,JSON.stringify(data,null,1));
fs.writeFileSync('tools/poc-intro/manual/media-sources.json',JSON.stringify({policy:'运行时引用已安装模组资源；仅离线预览提取 PNG，不复制进 POC JAR；正文摘编同版本内置中英手册。网页只做交叉参考，未搬运网页图片。',webReferences:['https://www.mcmod.cn/item/546119.html','https://guide.appliedenergistics.org/1.21.1/items-blocks-machines/inscriber','https://guide.appliedenergistics.org/1.21.1/tips-and-tricks'],images:evidence,enhancedEntries:enhanced,illustratedEntries:illustrated},null,2));
console.log(JSON.stringify({pictures:Object.keys(pictures).length,enhancedEntries:enhanced,illustratedEntries:illustrated}));
