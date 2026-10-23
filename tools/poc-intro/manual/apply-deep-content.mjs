import fs from 'node:fs';
const file='tools/poc-intro/src/main/resources/assets/poc_intro/manual.json',d=JSON.parse(fs.readFileSync(file)),inv=JSON.parse(fs.readFileSync('D:/codex-work/manual-20261020/inventory.json'));
const entries=new Map(d.entries.map(e=>[e.id,e])),owner=new Map(d.groups.flatMap(g=>g.mods.map(ns=>[ns,g.id])));
const name=(id,l)=>inv.langs[l]['block.'+id.replace(':','.')]||inv.langs[l]['item.'+id.replace(':','.')]||id.split(':')[1].replaceAll('_',' ');
let updates=0,added=0;const topics=[],unmatched=[];
for(let module of ['deep-mekanism.mjs','deep-industrial.mjs','deep-enderio.mjs','deep-support.mjs']){
 if(!fs.existsSync('tools/poc-intro/manual/'+module))continue;let m=await import('./'+module);
 for(let row of m.rows){let [key,title,pattern,body,bodyEn]=row,group=m.group;if(!group){[group,key,title,pattern,body,bodyEn]=row;}
  let re=new RegExp(pattern),matches=Object.keys(inv.items).filter(id=>owner.get(id.split(':')[0])===group&&re.test(id));
  if(!matches.length){unmatched.push({group,key,pattern});continue;}
  let source='manual/'+module+'#'+key;
  let guideId='deep/'+group+'/'+key,guide=entries.get(guideId);if(!guide){guide={id:guideId,group,zh:title,en:key.replaceAll('-',' '),items:matches.slice(0,8),tags:[],sources:[],guide:true};d.entries.push(guide);entries.set(guideId,guide);added++;}
  Object.assign(guide,{body,bodyEn,topicId:source,detailLevel:'specific',researchSource:m.sources,sources:[source]});
  for(let id of matches){
   let e=entries.get(id);if(!e){e={id,group,zh:name(id,'zh_cn'),en:name(id,'en_us'),items:[id],tags:inv.tags[id]||[],sources:[],guide:false};d.entries.push(e);entries.set(id,e);added++;}
   if(e.detailLevel==='native')continue;
   Object.assign(e,{body,bodyEn,topicId:source,detailLevel:'specific',researchSource:m.sources,sources:[...new Set([...e.sources,source])]});updates++;
  }
  topics.push({group,key,title,pattern,items:matches.length,sources:m.sources});
 }
}
// These blocks have no machine behavior; keep functional glass, conduits and storage.
const excluded=[];d.entries=d.entries.filter(e=>{if(e.guide)return true;let reject=/^ae2:debug_/.test(e.id)||/^create:(?:cut_|polished_|layered_|small_|limestone$|scoria$|scorchia$|asurine$|crimsite$|ochrum$|veridium$)/.test(e.id)||/^enderio:(?:.*_glass(?:_pane)?_(?:black|blue|brown|cyan|gray|green|light_blue|light_gray|lime|magenta|orange|pink|purple|red|white|yellow)|.*_(?:clear_glass|clear_glass_pane))$/.test(e.id);if(reject)excluded.push(e.id);return !reject;});
// Old overview rules must not keep contradicting machine-specific corrections.
for(let e of d.entries){if(e.group==='industrialforegoing')e.body=e.body.replace(/按 JEI 的形状摆放材料，保留空位。?/g,'配方材料无序放置，放齐所需数量。').replace(/严格按配方格位放置材料[^。]*。/g,'配方材料无序放置，放齐所需数量。');}
d.entries.sort((a,b)=>d.groups.findIndex(g=>g.id===a.group)-d.groups.findIndex(g=>g.id===b.group)||Number(b.guide)-Number(a.guide));
fs.writeFileSync(file,JSON.stringify(d,null,1));
fs.writeFileSync('tools/poc-intro/manual/deep-topics.json',JSON.stringify({topics,unmatched,excluded,updates,added},null,2));
console.log(JSON.stringify({topics:topics.length,unmatched,updates,added,excluded:excluded.length,entries:d.entries.length}));
