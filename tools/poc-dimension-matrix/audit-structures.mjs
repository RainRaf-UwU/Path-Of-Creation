// 只读：用隔离、无 Java/命令/网络能力的 recipes mock 收集本包原始结构声明。
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const output=path.resolve(process.argv[2]||path.join(root,'.cache/dimension-matrix/audio-jei-20261023/structure-inventory.json'));
const directory=path.join(root,'kubejs/server_scripts/custom_machine');
const records=[],sources={};
function inert(){let proxy;proxy=new Proxy(function(){},{get(){return proxy;},apply(){return proxy;}});return proxy;}
for(const name of fs.readdirSync(directory).filter(n=>n.endsWith('.js'))){
  const source=fs.readFileSync(path.join(directory,name),'utf8');if(!source.includes('.requireStructure('))continue;
  sources[name]=crypto.createHash('sha256').update(source).digest('hex');
  const custom_machine=(machine,time)=>{
    const row={source:name,machine,time,methods:[]};records.push(row);
    let proxy;proxy=new Proxy({},{get(_,method){return(...args)=>{row.methods.push([method,...args]);return proxy;}}});return proxy;
  };
  const event={recipes:{custommachinery:{custom_machine}},shaped:()=>inert(),shapeless:()=>inert()};
  const sandbox={ServerEvents:{recipes:f=>f(event)},JsonIO:{read:p=>{
    if(p!=='kubejs/data/rain/dimension_matrix/structure.json')throw Error('Unexpected JSON input '+p);
    return JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
  }},Item:{of:s=>s},Text:inert(),console:{log(){}}};
  vm.runInNewContext(source,sandbox,{timeout:1000,filename:name});
}
const unique=new Map();
for(const row of records)for(const op of row.methods.filter(m=>m[0]==='requireStructure')){
  const key=JSON.stringify([row.machine,op[1],op[2]]);
  if(!unique.has(key))unique.set(key,{machine:row.machine,source:row.source,pattern:op[1],keys:op[2]});
}
const structures=[...unique.values()];
const invalid=structures.filter(row=>row.pattern.flat().join('').split('m').length-1!==1);
const summary={families:[...new Set(structures.map(row=>row.machine))],unique_definitions:structures.length,valid_definitions:structures.length-invalid.length,legacy_invalid:invalid.map(row=>({source:row.source,machine:row.machine,reason:'missing controller m'}))};
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify({sources,structures,summary},null,2)+'\n');
console.log(JSON.stringify(summary));
