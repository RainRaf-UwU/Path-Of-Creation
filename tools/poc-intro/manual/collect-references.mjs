import fs from 'node:fs';import path from 'node:path';import {Zip} from './zip.mjs';
const out='D:/codex-work/manual-expanded-20261020',inv=JSON.parse(fs.readFileSync('D:/codex-work/manual-20261020/inventory.json'));
fs.mkdirSync(path.join(out,'references'),{recursive:true});let docs=[];
const relevant=/^(ae2|advanced_ae|extendedae|extendedae_plus|industrialforegoing|immersiveengineering|modularrouters|rftoolsbase|rftoolsutility|rftoolsstorage|rftoolspower|integrateddynamics|integratedtunnels|integratedcrafting|integratedterminals|actuallyadditions|justdirethings|draconicevolution|sfm|laserio|xnet|hostilenetworks|mekmm|mekanism_extras|mekanism|functionalstorage|sophisticatedbackpacks|sophisticatedstorage)$/;
function scan(z,jar){for(let p of z.entries.keys()){
 let m=p.match(/^assets\/([^/]+)\/(.*)$/);if(m&&relevant.test(m[1])&&/\.(md|txt|json|xml|sfm|sfml|snbt)$/.test(p)&&/ae2guide|manual|patchouli_books|guidebook|infobook|example_program/.test(p)&&!/(?:ja_jp|es_es|ru_ru|fr_fr|de_de|pt_br|tr_tr|zh_tw|ko_kr|it_it|pl_pl)/.test(p)){
  let text=z.read(p).toString('utf8');if(text.length<20||text.length>100000)continue;let locale=p.includes('zh_cn')?'zh_cn':'en_us';docs.push({ns:m[1],jar,path:p,locale,text});
 }
 if(/^META-INF\/jarjar\/.+\.jar$/.test(p))scan(new Zip(z.read(p)),jar+'!'+p);
}}
for(let file of fs.readdirSync('mods').filter(n=>n.endsWith('.jar')))scan(new Zip('mods/'+file),file);
for(let file of fs.readdirSync('resourcepacks').filter(n=>n.includes('Language')&&n.endsWith('.zip')))scan(new Zip('resourcepacks/'+file),'resourcepacks/'+file);
fs.writeFileSync(path.join(out,'reference-index.json'),JSON.stringify(docs,null,1));
const summary={};for(let d of docs){let key=d.ns+' '+d.locale;summary[key]=(summary[key]||0)+1;}
fs.writeFileSync(path.join(out,'reference-counts.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));
// A compact inventory groups tiers/colours but keeps each distinct machine or functional item.
let data=JSON.parse(fs.readFileSync('tools/poc-intro/src/main/resources/assets/poc_intro/manual.json'));let sets={};
for(let g of data.groups){let a=Object.keys(inv.items).filter(id=>g.mods.includes(id.split(':')[0]));sets[g.id]=a.map(id=>({id,block:!!inv.items[id].block,zh:inv.langs.zh_cn['block.'+id.replace(':','.')]||inv.langs.zh_cn['item.'+id.replace(':','.')]||'',inManual:data.entries.some(e=>e.id===id)}));}
fs.writeFileSync(path.join(out,'all-family-items.json'),JSON.stringify(sets,null,1));
