import fs from 'node:fs';import {Zip} from './zip.mjs';
const file='D:/codex-work/manual-20261020/inventory.json',i=JSON.parse(fs.readFileSync(file));
function enrich(z){for(let name of z.entries.keys()){
 let m=name.match(/^assets\/([^/]+)\/blockstates\/(.+)\.json$/);if(m){let id=m[1]+':'+m[2];if(i.items[id])i.items[id].block=true;}
 m=name.match(/^assets\/([^/]+)\/lang\/(zh_cn|en_us)\.json$/);if(m){try{let json=z.json(name);for(let [key,v] of Object.entries(json)){let normalized=key.replace(/^([^.]+)\.([^.]+)\.(name\.)?/,(_,a,b,c)=>a+'.'+b+'.');i.langs[m[2]][normalized]??=v;}}catch{}}
 m=name.match(/^assets\/([^/]+)\/lang\/(zh_cn|en_us)\.lang$/);if(m){for(let line of z.read(name).toString('utf8').split(/\r?\n/)){let eq=line.indexOf('=');if(eq>0&&!line.startsWith('#'))i.langs[m[2]][line.slice(0,eq)]=line.slice(eq+1);}}
 if(/^META-INF\/jarjar\/.+\.jar$/.test(name))enrich(new Zip(z.read(name)));
}}
for(let name of fs.readdirSync('mods').filter(n=>n.endsWith('.jar')))enrich(new Zip('mods/'+name));
for(let name of fs.readdirSync('resourcepacks').filter(n=>n.endsWith('.zip')&&n.includes('Language'))){let z=new Zip('resourcepacks/'+name);for(let file of z.entries.keys()){let m=file.match(/\/lang\/(zh_cn|en_us)\.json$/);if(m)try{Object.assign(i.langs[m[1]],z.json(file));}catch{}}}
// SolarFlux registers panel items and models dynamically from these built-in panel definitions.
for(let key of Object.keys(i.langs.en_us).filter(k=>/^block\.solarflux\.sp_/.test(k)&&!k.includes('.sp_tf.'))){let id='solarflux:'+key.slice('block.solarflux.'.length);i.items[id]={file:i.mods.find(m=>m.id==='solarflux').file,block:true,dynamic:'config/solarflux/panels.cfg'};}
fs.writeFileSync(file,JSON.stringify(i,null,1));console.log('Enriched blockstate evidence and installed translations');
