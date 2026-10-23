import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
export const specs=[['dyeing_factory.js','structure_b','structure_b_key','dyeing'],['Void Mining Machine.js','structure_block','structure_block_key','mining'],['fluid_processing.js','structure_f','structure_f_key','fluid'],['structure_inspector.js','structure_f','structure_k','inspector']];
export function capture(base=root){
 const all=[],recipes=[];
 for(const [file,patterns,keys,family] of specs){
  const source=fs.readFileSync(path.join(base,'kubejs/server_scripts/custom_machine',file),'utf8');
  const inert=()=>{let p;p=new Proxy(()=>{}, {get:()=>p,apply:()=>p});return p;};
  const event={recipes:{custommachinery:{custom_machine:(machine,time)=>{const r={machine,time,ops:[]};recipes.push(r);let p;p=new Proxy({}, {get:(_,method)=>(...args)=>{r.ops.push([method,...args]);return p;}});return p;}}},shaped:inert(),shapeless:inert()};
  const sandbox={ServerEvents:{recipes:fn=>fn(event)},Item:{of:s=>s},Text:inert(),console:{log(){}},POC_CAPTURE:(p,k)=>p.forEach((pattern,index)=>all.push({id:family+'-'+index,family,index,file,pattern,keys:k[index]})),JsonIO:{read:p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'))}};
  vm.runInNewContext(source.replace(new RegExp('const\\s+'+patterns+'\\s*='),'var '+patterns+' = globalThis.POC_PATTERNS =').replace(new RegExp('const\\s+'+keys+'\\s*='),'var '+keys+' = globalThis.POC_KEYS ='),sandbox,{timeout:3000,filename:file});
  sandbox.POC_CAPTURE(sandbox.POC_PATTERNS,sandbox.POC_KEYS);
 }
 return {structures:JSON.parse(JSON.stringify(all)),recipes:JSON.parse(JSON.stringify(recipes))};
}
export function blocks(s){const out=[];s.pattern.forEach((floor,y)=>floor.forEach((row,z)=>[...row].forEach((c,x)=>{if(c!==' ')out.push({x,y,z,c,block:c==='m'?'controller':s.keys[c]});})));return out;}
export function counts(s){const n={};for(const b of blocks(s))n[b.block]=(n[b.block]||0)+1;return Object.fromEntries(Object.entries(n).sort());}
if(process.argv[1]===fileURLToPath(import.meta.url))for(const s of capture().structures)console.log(JSON.stringify({id:s.id,size:[Math.max(...s.pattern.flat().map(r=>r.length)),s.pattern.length,Math.max(...s.pattern.map(f=>f.length))],count:blocks(s).length,keys:s.keys,counts:counts(s)}));
