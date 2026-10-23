import fs from 'node:fs';
import crypto from 'node:crypto';
import {Zip} from './zip.mjs';
import {keybinds,topics} from './control-content.mjs';
const file='tools/poc-intro/src/main/resources/assets/poc_intro/manual.json';
const d=JSON.parse(fs.readFileSync(file)),inv=JSON.parse(fs.readFileSync(process.argv[2]||'D:/codex-work/manual-20261020/inventory.json'));
const original=new Map(d.entries.map(e=>[e.id,structuredClone(e)])),entries=new Map(d.entries.map(e=>[e.id,e]));
if(!d.groups.some(g=>g.id==='controls')){
 const mods=['jei','ftbquests','ftbultimine','controlling'].filter(id=>!d.groups.some(g=>g.mods.includes(id)));
 d.groups.unshift({id:'controls',zh:'操作与按键',en:'Controls and navigation',mods,summary:'查询、按键、任务与常用操作',summaryEn:'Search, key bindings, quests and navigation',search:'快捷键 快捷操作 按键绑定 键位冲突 ECHO manual controls keybind hotkey JEI FTB Quests Ultimine Controlling'});
}
d.keybinds={...(d.keybinds||{}),...Object.fromEntries(Object.entries(keybinds).map(([id,[zh,en,when,whenEn]])=>[id,{zh,en,when,whenEn}]))};
const ownedKeys=new Set(Object.keys(keybinds)),itemControls=new Map();
for(const topic of topics)for(const id of topic[4])itemControls.set(id,[...new Set([...(itemControls.get(id)||[]),...topic[5]])]);
const rewrite=new Set(['mekanism:configurator','pipez:wrench','buildinggadgets2:gadget_building','buildinggadgets2:gadget_exchanging','buildinggadgets2:gadget_copy_paste','buildinggadgets2:gadget_cut_paste','buildinggadgets2:gadget_destruction']);
let added=0,updated=0;const guideIds=[];
const name=(id,lang)=>inv.langs[lang]['item.'+id.replace(':','.')]||inv.langs[lang]['block.'+id.replace(':','.')]||id.split(':')[1].replaceAll('_',' ');
for(const [group,slug,zh,en,items,controls,body,bodyEn,sources] of topics){
 for(const id of items)if(!inv.items[id])throw Error('Missing installed item: '+id);
 for(const key of controls)if(!d.keybinds[key])throw Error('Missing control definition: '+key);
 let id=`controls/${group}/${slug}`,entry=entries.get(id),pictures=[...new Set(items.flatMap(id=>entries.get(id)?.pictures||[]))];
 if(!entry){entry={id};d.entries.push(entry);entries.set(id,entry);added++;}
 Object.assign(entry,{group,zh,en,body,bodyEn,items,tags:[],sources:['manual/control-content.mjs#'+slug,...sources],guide:true,controls,pictures});guideIds.push(id);
 for(const id of items){
  let e=entries.get(id);if(!e){e={id,group,zh:name(id,'zh_cn'),en:name(id,'en_us'),body,bodyEn,items:[id],tags:inv.tags[id]||[],sources:[],guide:false};d.entries.push(e);entries.set(id,e);added++;}
  e.controls=[...new Set([...(e.controls||[]).filter(key=>!ownedKeys.has(key)),...itemControls.get(id)])];
  // Keep detailed native machine articles, adding the controls beside them.
  if(rewrite.has(id)){e.body=body;e.bodyEn=bodyEn;}
  e.sources=[...new Set([...e.sources,'manual/control-content.mjs#'+slug])];updated++;
 }
}
// Put newly authored tutorials before the large variant index in each family.
const order=new Map(guideIds.map((id,i)=>[id,i]));
d.entries.sort((a,b)=>d.groups.findIndex(g=>g.id===a.group)-d.groups.findIndex(g=>g.id===b.group)||Number(b.guide)-Number(a.guide)||(order.get(a.id)??10000)-(order.get(b.id)??10000));
const mediaFile='tools/poc-intro/manual/media-sources.json',media=JSON.parse(fs.readFileSync(mediaFile)),jar=fs.readdirSync('mods').find(n=>n.startsWith('oritech-neoforge-')&&n.endsWith('.jar')),zip=new Zip('mods/'+jar);
const illustrations=[];
for(const [name,caption] of [['cyborg_research_ui','人体强化中心：研究界面'],['cyborg_ui','人体强化：能力轮盘']]){
 const path=`assets/oracle_index/books/oritech/assets/oritech/area/${name}.png`,resource=path.slice(7).replace('oracle_index/','oracle_index:'),bytes=zip.read(path),sha256=crypto.createHash('sha256').update(bytes).digest('hex');
 const preview='images/'+crypto.createHash('sha256').update(resource).digest('hex').slice(0,16)+'.png';
 d.pictures[resource]={resource,width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),caption,captionEn:'Oritech augmentation controls',credit:'Oritech 原模组手册',preview};
 if(!media.images.some(p=>p.resource===resource))media.images.push({resource,jar,path,doc:'assets/oracle_index/books/oritech/content/machines/augmentations/augment_application_block.mdx',sha256});
 fs.mkdirSync('design/manual-20261020/images',{recursive:true});fs.writeFileSync('design/manual-20261020/'+preview,bytes);illustrations.push(resource);
}
for(const id of ['controls/oritech/augments','oritech:augment_application_block']){let e=entries.get(id);if(e)e.pictures=[...new Set([...(e.pictures||[]),...illustrations])];}
media.finalPictures=Object.keys(d.pictures).length;media.illustratedEntries=d.entries.filter(e=>e.pictures?.length).length;
fs.writeFileSync(mediaFile,JSON.stringify(media,null,2));
fs.writeFileSync(file,JSON.stringify(d,null,1));
let changed=d.entries.filter(e=>original.has(e.id)&&JSON.stringify(e)!==JSON.stringify(original.get(e.id))).length;
const result={date:'2026-10-20',topics:topics.length,keyActions:Object.keys(d.keybinds).length,added,updatedTargets:updated,existingEntriesChanged:changed,entriesWithControls:d.entries.filter(e=>e.controls?.length).length,groups:d.groups.length,entries:d.entries.length,guides:d.entries.filter(e=>e.guide).length,illustratedEntries:d.entries.filter(e=>e.pictures?.length).length,guideIds};
fs.writeFileSync('tools/poc-intro/manual/controls-coverage.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
