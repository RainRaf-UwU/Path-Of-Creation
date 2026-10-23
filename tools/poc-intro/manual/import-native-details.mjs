import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {Zip} from './zip.mjs';
const file='tools/poc-intro/src/main/resources/assets/poc_intro/manual.json',data=JSON.parse(fs.readFileSync(file)),inv=JSON.parse(fs.readFileSync('D:/codex-work/manual-20261020/inventory.json')),refs=JSON.parse(fs.readFileSync('D:/codex-work/manual-expanded-20261020/reference-index.json'));
const entries=new Map(data.entries.map(e=>[e.id,e])),owner=new Map(data.groups.flatMap(g=>g.mods.map(ns=>[ns,g.id]))),sources=JSON.parse(fs.readFileSync('tools/poc-intro/manual/media-sources.json'));
const docs=new Map();for(let d of refs)docs.set(d.path,d);
function name(id,cn=true){let k=id.replace(':','.').replaceAll('/','.');let l=inv.langs[cn?'zh_cn':'en_us'];return l['block.'+k]||l['item.'+k]||id.split(':')[1].replaceAll('_',' ');}
function clean(text,ns,cn){
 let value=text.replace(/^---[\s\S]*?---\s*/,'').replace(/<(GameScene|Row|RecipeFor|RecipesFor)\b[^>]*>[\s\S]*?<\/\1>/g,'');
 value=value.replace(/<ItemLink\b[^>]*id="([^"]+)"[^>]*\/?>/g,(_,id)=>name(id.includes(':')?id:ns+':'+id,cn));
 value=value.replace(/<link;[^;>]*;([^;>]+)(?:;[^>]*)?>/g,'$1').replace(/<np>|<br>|\$\(br2\)/g,'\n\n').replace(/\$\(br\)/g,'\n').replace(/\$\(li\d?\)/g,'\n- ');
 value=value.replace(/\$\(k:[^)]+\)/g,cn?'对应按键（见键位设置）':'the configured key').replace(/\$\([^)]+\)|\$\(\)|\/\$/g,'');
 value=value.replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]+)\]\\?\([^)]+\)/g,'$1').replace(/<[^>]*>/g,'').replace(/§[0-9a-fk-or]|&[0-9a-fk-or]/gi,'').replace(/\*\*/g,'').replace(/\{[#][^}]+\}/g,'');
 let lines=value.split(/\r?\n/).filter(line=>!/^\s*\||^\s*---\s*$/.test(line));value=lines.join('\n').replace(/^#{1,6}\s+/gm,'').replace(/\n(?=\s*[-*] )/g,'\n\n');
 return value.trim().split(/\n\s*\n/).map(p=>p.trim().split('\n').map(s=>s.trim()).join(cn?'':' ')).filter(p=>p&&!/^Recipe$|^Crafting$|^合成配方$|^配方$/.test(p)).join('\n\n').replace(/AE2\s*\/\s*RS2/g,'AE2');
}
function put(id,group,zh,en,body,bodyEn,source,items=[id],guide=false,topic){
 if(!group||body.length<25)return null;items=items.filter(id=>inv.items[id]);
 if(!guide&&!inv.items[id])return null;let e=entries.get(id);
 if(!e){e={id,group,zh:zh||name(id),en:en||name(id,false),body,bodyEn:bodyEn||body,items,tags:[...new Set(items.flatMap(id=>inv.tags[id]||[]))],sources:[],guide};data.entries.push(e);entries.set(id,e);}
 e.body=body;e.bodyEn=bodyEn||e.bodyEn;e.sources=[...new Set([...e.sources,source])];e.detailLevel='native';e.topicId=topic||source;e.researchSource=source;return e;
}
const zipCache=new Map();function archive(jar){if(!zipCache.has(jar))zipCache.set(jar,new Zip('mods/'+jar));return zipCache.get(jar);}
let imageCount=0;function image(resource,caption,ns,doc){
 if(!resource?.includes(':')||!resource.endsWith('.png'))return null;let [n,p]=resource.split(':'),asset='assets/'+n+'/'+p;
 if(data.pictures[resource])return resource;
 let candidates=[...new Set(inv.mods.filter(m=>m.id===n||m.id===ns).map(m=>m.file.split('!')[0]))];
 for(let jar of candidates){let z=archive(jar);if(!z.entries.has(asset))continue;let bytes=z.read(asset);if(bytes.length<24||bytes.readUInt32BE(0)!==0x89504e47)continue;let width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);if(width<64||height<32)continue;
  let target=crypto.createHash('sha256').update(resource).digest('hex').slice(0,16)+'.png';fs.writeFileSync('design/manual-20261020/images/'+target,bytes);data.pictures[resource]={resource,width,height,caption:caption||'操作示意',captionEn:'Machine reference',credit:ns+' 原模组手册',preview:'images/'+target};sources.images.push({resource,jar,path:asset,doc,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});imageCount++;return resource;
 }return null;
}
let native=0,mechanisms=0;
for(let d of refs.filter(d=>d.locale==='zh_cn')){
 if(/ae2guide\/.*\.md$/.test(d.path)){
  let enPath=d.path.replace('/_zh_cn/','/'),en=docs.get(enPath)?.text||'',front=d.text.match(/^---([\s\S]*?)---/)?.[1]||'',title=front.match(/title:\s*(.+)/)?.[1]?.trim().replace(/^"|"$/g,'');
  let ids=[...front.matchAll(/(?:^|\n)\s*-\s*([a-z0-9_]+:[a-z0-9_./-]+)/g)].map(m=>m[1]);
  let body=clean(d.text,d.ns,true),bodyEn=clean(en,d.ns,false),source=d.jar+'!'+d.path,linked=[];
  for(let m of d.text.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)){let asset=path.posix.normalize(path.posix.join(path.posix.dirname(enPath),m[2])).replace(/^assets\/([^/]+)\//,'$1:');let pic=image(asset,m[1],d.ns,d.path);if(pic)linked.push(pic);}
  if(ids.length){for(let id of ids){let e=put(id,owner.get(id.split(':')[0]),name(id),null,body,bodyEn,source,[id],false,source);if(e){if(linked.length)e.pictures=[...new Set([...(e.pictures||[]),...linked])].slice(0,8);native++;}}}
  else if(d.ns==='ae2'&&/ae2-mechanics\//.test(d.path)&&!/-index\.md$/.test(d.path)){
   let id='deep/ae2/'+path.posix.basename(d.path,'.md'),items=[...new Set([...d.text.matchAll(/<ItemLink[^>]*id="([^"]+)"/g)].map(m=>m[1].includes(':')?m[1]:'ae2:'+m[1]))].slice(0,8);
   let e=put(id,'ae2',title,path.posix.basename(d.path,'.md').replaceAll('-',' '),body,bodyEn,source,items,true,source);if(e){e.pictures=linked;mechanisms++;}
  }
 }
 if(d.path.includes('/patchouli_books/')&&d.path.includes('/entries/')&&d.path.endsWith('.json')){
  let json;try{json=JSON.parse(d.text);}catch{continue;}let icon=typeof json.icon==='string'?json.icon.split('[')[0]:json.icon?.item;if(!icon||!owner.has(icon.split(':')[0]))continue;
  let enDoc=docs.get(d.path.replace('/zh_cn/','/en_us/')),enJson;try{enJson=JSON.parse(enDoc?.text||'{}');}catch{enJson={};}
  let text=(json.pages||[]).map(p=>p.text||'').join('\n\n'),enText=(enJson.pages||[]).map(p=>p.text||'').join('\n\n');
  let e=put(icon,owner.get(icon.split(':')[0]),name(icon),null,clean(text,d.ns,true),clean(enText,d.ns,false),d.jar+'!'+d.path,[icon],false,d.jar+'!'+d.path);if(!e)continue;
  let linked=[];for(let page of json.pages||[])for(let p of page.images||[]){let id=image(p,page.title||json.name,d.ns,d.path);if(id)linked.push(id);}if(linked.length)e.pictures=[...new Set([...(e.pictures||[]),...linked])].slice(0,8);native++;
 }
 if(d.ns==='immersiveengineering'&&/manual\/zh_cn\/.+\.txt$/.test(d.path)){
  let lines=d.text.split(/\r?\n/),title=lines[0].trim(),body=clean(lines.slice(2).join('\n'),'immersiveengineering',true),enDoc=docs.get(d.path.replace('/zh_cn/','/en_us/')),enText=enDoc?.text.split(/\r?\n/).slice(2).join('\n')||'';
  let stem=path.posix.basename(d.path,'.txt'),matches=data.entries.filter(e=>e.group==='immersiveengineering'&&(e.zh===title||e.id==='immersiveengineering:'+stem));
  if(!matches.length&&/^(crusher|squeezer|fermenter|refinery|mixer|sawmill|metal_press|arc_furnace|assembler|garden_cloche|excavator|diesel_generator|silo|tank|automated_engineers_workbench|bottling_machine|alloy_kiln|cokeoven|blastfurnace|basic_wiring)$/.test(stem)){
   let id='deep/immersiveengineering/'+stem,items=Object.keys(inv.items).filter(id=>id.startsWith('immersiveengineering:')&&(id.endsWith(':'+stem)||id.includes(stem.replace('garden_','')))).slice(0,6);let e=put(id,'immersiveengineering',title,stem.replaceAll('_',' '),body,clean(enText,d.ns,false),d.jar+'!'+d.path,items,true);if(e)mechanisms++;
  }
  for(let e of matches){put(e.id,e.group,null,null,body,clean(enText,d.ns,false),d.jar+'!'+d.path,e.items,e.guide,d.jar+'!'+d.path);native++;}
 }
}
// Actually Additions' machine chapters live in the installed translation table.
for(let key of Object.keys(inv.langs.zh_cn).filter(k=>/^booklet\.actuallyadditions\.chapter\.[^.]+$/.test(k))){
 let title=inv.langs.zh_cn[key];let lines=Object.keys(inv.langs.zh_cn).filter(k=>k.startsWith(key+'.text.')).sort((a,b)=>Number(a.split('.').at(-1))-Number(b.split('.').at(-1)));
 let body=clean(lines.map(k=>inv.langs.zh_cn[k]).join('\n\n'),'actuallyadditions',true),en=clean(lines.map(k=>inv.langs.en_us[k]||'').join('\n\n'),'actuallyadditions',false);if(body.length<45)continue;
 let topic=key.split('.').at(-1);let matched=data.entries.filter(e=>e.group==='actuallyadditions'&&(title.includes(e.zh)&&e.zh.length>2));
 for(let e of matched){put(e.id,e.group,null,null,body,en,'installed actuallyadditions language:'+key,e.items,e.guide,key);native++;}
 if(matched.length||/^(breaker|phantomfaces|phantomBreaker|esd|xpSolidifier|greenhouseGlass|coffeeMachine|crusher|furnaceDouble|lavaFactory|energizer|repairer|coalGen|solarPanel|canola|farmer|laserRelays|empowerer|atomicReconstructor|enchantment)/i.test(topic)){let items=matched.flatMap(e=>e.items).slice(0,8);let e=put('deep/actuallyadditions/'+topic,'actuallyadditions',title,inv.langs.en_us[key]||topic,body,en,'installed actuallyadditions language:'+key,items,true,key);if(e)mechanisms++;}
}
data.entries.sort((a,b)=>data.groups.findIndex(g=>g.id===a.group)-data.groups.findIndex(g=>g.id===b.group)||Number(b.guide)-Number(a.guide));
fs.writeFileSync(file,JSON.stringify(data,null,1));sources.nativeImportedEntries=native;sources.nativeMechanisms=mechanisms;sources.picturesAfterNative=Object.keys(data.pictures).length;fs.writeFileSync('tools/poc-intro/manual/media-sources.json',JSON.stringify(sources,null,2));
console.log(JSON.stringify({nativeImported:native,mechanismPages:mechanisms,newPictures:imageCount,totalEntries:data.entries.length,pictures:Object.keys(data.pictures).length}));
