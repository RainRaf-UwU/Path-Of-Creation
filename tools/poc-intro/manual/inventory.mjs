import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {Zip} from './zip.mjs';
const root=process.cwd(),out=process.argv[2]||'D:/codex-work/manual-20261020';fs.mkdirSync(out,{recursive:true});
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(path.join(p,d.name)):[path.join(p,d.name)]);
let mods=[],items={},langs={zh_cn:{},en_us:{}},tags={};
function scan(zip,file){for(let name of zip.entries.keys()){
 if(/META-INF\/(neoforge\.mods|mods)\.toml$/.test(name)){let s=zip.read(name).toString('utf8');for(let part of s.split('[[mods]]').slice(1)){let id=part.match(/modId\s*=\s*["']([^"']+)/)?.[1],display=part.match(/displayName\s*=\s*["']([^"']+)/)?.[1];if(id)mods.push({id,name:display||id,file});}}
 let m=name.match(/^assets\/([^/]+)\/models\/item\/(.+)\.json$/);if(m)items[m[1]+':'+m[2]]={file,model:name};
 m=name.match(/^assets\/[^/]+\/lang\/(zh_cn|en_us)\.json$/);if(m){try{Object.assign(langs[m[1]],zip.json(name));}catch{}}
 m=name.match(/^data\/([^/]+)\/tags\/item\/(.+)\.json$/);if(m){try{for(let v of zip.json(name).values||[]){if(typeof v!=='string'||v.startsWith('#'))continue;(tags[v]??=[]).push(m[1]+':'+m[2]);}}catch{}}
 if(/^META-INF\/jarjar\/.+\.jar$/.test(name))scan(new Zip(zip.read(name)),file+'!'+name);
}}
for(let file of fs.readdirSync(path.join(root,'mods')).filter(n=>n.endsWith('.jar')))scan(new Zip(path.join(root,'mods',file)),file);
for(let file of walk(path.join(root,'kubejs/assets')).filter(p=>/\/lang\/(zh_cn|en_us)\.json$/.test(p.replaceAll('\\','/')))){let locale=path.basename(file,'.json');try{Object.assign(langs[locale],JSON.parse(fs.readFileSync(file,'utf8')));}catch{}}
for(let file of walk(path.join(root,'kubejs/assets')).filter(p=>p.replaceAll('\\','/').includes('/models/item/')&&p.endsWith('.json'))){let rel=path.relative(path.join(root,'kubejs/assets'),file).replaceAll('\\','/'),m=rel.match(/^([^/]+)\/models\/item\/(.+)\.json$/);if(m)items[m[1]+':'+m[2]]={file:rel};}
let refs={};for(let dir of ['kubejs/server_scripts','kubejs/startup_scripts','kubejs/data','config/ftbquests/quests/chapters'])for(let file of walk(path.join(root,dir))){if(!/\.(js|json|snbt)$/.test(file))continue;let s=fs.readFileSync(file,'utf8');for(let id of new Set(s.match(/[a-z][a-z0-9_]*:[a-z0-9_./-]+/g)||[])){(refs[id]??=[]).push(path.relative(root,file).replaceAll('\\','/'));}}
fs.writeFileSync(path.join(out,'inventory.json'),JSON.stringify({mods,items,langs,tags,refs},null,2));
let hashes={};for(let dir of ['mods','kubejs/server_scripts','kubejs/startup_scripts','kubejs/data','config/ftbquests/quests','tools/poc-intro/src'])for(let file of walk(path.join(root,dir)))hashes[path.relative(root,file)]=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');fs.writeFileSync(path.join(out,'before-hashes.json'),JSON.stringify(hashes,null,2));fs.cpSync('tools/poc-intro',path.join(out,'before-source'),{recursive:true});fs.copyFileSync('mods/poc-intro-1.0.0.jar',path.join(out,'before-poc-intro.jar'));
console.log(JSON.stringify({mods:mods.length,items:Object.keys(items).length,references:Object.keys(refs).length,files:Object.keys(hashes).length}));
