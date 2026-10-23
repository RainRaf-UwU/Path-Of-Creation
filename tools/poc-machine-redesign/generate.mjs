import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {root,capture,blocks,counts,specs} from './inventory.mjs';
export const out=path.join(root,'design/multiblock-redesign-20261023');
const backup=path.join(out,'backup');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
if(!fs.existsSync(backup)){
 fs.mkdirSync(backup,{recursive:true});
 const files=[...specs.map(s=>'kubejs/server_scripts/custom_machine/'+s[0]),'kubejs/server_scripts/quest_building_templates.js','config/ftbquests/quests','tools/poc-dimension-matrix','mods/poc-dimension-matrix-1.0.0.jar','kubejs/data/rain/dimension_matrix','kubejs/assets/rain/dimension_matrix','kubejs/data/custommachinery/machine'];
 for(const f of files){fs.mkdirSync(path.dirname(path.join(backup,f)),{recursive:true});fs.cpSync(path.join(root,f),path.join(backup,f),{recursive:true});}
 const baseline=capture();fs.writeFileSync(path.join(out,'before.json'),JSON.stringify(baseline,null,2));
 const protectedFiles=['kubejs/data/rain/dimension_matrix/structure.json','kubejs/assets/rain/dimension_matrix/visual.json','kubejs/server_scripts/custom_machine/dimension_matrix.js','kubejs/startup_scripts/dimension_matrix.js'];
 fs.writeFileSync(path.join(out,'protected.json'),JSON.stringify(Object.fromEntries(protectedFiles.map(f=>[f,hash(path.join(root,f))])),null,2));
}
const before=JSON.parse(fs.readFileSync(path.join(out,'before.json'),'utf8'));
class Shape{
 constructor(s){this.s=s;this.map=new Map();this.left={};for(const b of blocks(s))this.left[b.c]=(this.left[b.c]||0)+1;}
 put(c,x,y,z){if(!Number.isInteger(x+y+z))throw Error('Noninteger');const k=[x,y,z].join(',');if(this.map.has(k))throw Error('Collision '+k);if(!this.left[c])throw Error('Budget '+c);this.left[c]--;this.map.set(k,{x,y,z,c});}
 batch(c,pts,n=this.left[c]){let done=0;for(const p of pts){if(done===n)break;if(!this.map.has(p.join(','))){this.put(c,...p);done++;}}if(done!==n)throw Error(this.s.id+' insufficient '+c+' '+done+'/'+n);}
 finish(meta){if(Object.values(this.left).some(n=>n))throw Error('Unused '+JSON.stringify(this.left));const b=[...this.map.values()],m=b.find(p=>p.c==='m'),lo=[0,1,2].map(i=>Math.min(...b.map(p=>[p.x,p.y,p.z][i]))),hi=[0,1,2].map(i=>Math.max(...b.map(p=>[p.x,p.y,p.z][i])));const pattern=Array.from({length:hi[1]-lo[1]+1},()=>Array.from({length:hi[2]-lo[2]+1},()=>Array(hi[0]-lo[0]+1).fill(' ')));for(const p of b)pattern[p.y-lo[1]][p.z-lo[2]][p.x-lo[0]]=p.c;const s={...this.s,...meta,focus:meta.focus.map((v,i)=>v-[m.x,m.y,m.z][i]),designOrigin:lo,pattern:pattern.map(f=>f.map(r=>r.join('')))};if(JSON.stringify(counts(s))!==JSON.stringify(counts(this.s)))throw Error('Material drift '+s.id);return s;}
}
const grid=(r,y,zr=r)=>{const p=[];for(let z=-zr;z<=zr;z++)for(let x=-r;x<=r;x++)p.push([x,y,z]);return p;};
const oct=(x,z)=>Math.max(Math.abs(x),Math.abs(z),(.70710678)*(Math.abs(x)+Math.abs(z)));
const disk=(r,y)=>grid(r,y).sort((a,b)=>oct(a[0],a[2])-oct(b[0],b[2])||Math.atan2(a[2],a[0])-Math.atan2(b[2],b[0]));
const foundation=(r,n)=>{const groups=[],seen=new Set();for(const [x,,z]of disk(r,0)){if(x===0&&z===0||seen.has(x+','+z))continue;const g=[[x,0,z],[-z,0,x],[-x,0,-z],[z,0,-x]];g.forEach(p=>seen.add(p[0]+','+p[2]));groups.push(g);}return [...(n%4===1?[[0,0,0]]:[]),...groups.flat()];};
const ring=(r,y,thick=1)=>grid(r,y).filter(([x,,z])=>oct(x,z)>r-thick&&oct(x,z)<=r+.15).sort((a,b)=>Math.atan2(a[2],a[0])-Math.atan2(b[2],b[0]));
const square=(r,y)=>grid(r,y).filter(([x,,z])=>Math.max(Math.abs(x),Math.abs(z))===r);
const stack=(fn,ys)=>ys.flatMap(y=>fn(y));
const ys=(a,b)=>Array.from({length:b-a+1},(_,i)=>i+a);
const towers=(r,w,h)=>{const p=[];for(let y=1;y<=h;y++)for(const x0 of [-r,r])for(const z0 of [-r,r])for(let dz=-w;dz<=w;dz++)for(let dx=-w;dx<=w;dx++)p.push([x0+dx,y,z0+dz]);return p;};
const made=[];
function build(id,fn,meta){const s=before.structures.find(s=>s.id===id),q=new Shape(s);fn(q);made.push(q.finish(meta));}
build('dyeing-0',q=>{
 q.batch('a',foundation(5,q.left.a));q.put('m',0,1,4);
 q.batch('b',ys(1,5).flatMap(y=>[-2,2].flatMap(x=>[-1,1].map(z=>[x,y,z]))));
 q.batch('e',ys(1,5).flatMap(y=>[-3,3].flatMap(x=>[-1,1].map(z=>[x,y,z]))));
 q.batch('c',[-3,-2,2,3].map(x=>[x,1,2]));q.put('d',0,1,3);
 q.batch('f',ys(-2,2).map(x=>[x,6,0]));q.batch('g',[-3,3].flatMap(x=>[-1,1].map(z=>[x,6,z])));
 q.batch('h',[-1,1].flatMap(z=>ys(-2,2).map(x=>[x,7,z])));
 q.batch('i',[-1,0,1].flatMap(x=>[-1,1].map(z=>[x,1,z])));
 q.batch('l',[-1,0,1].flatMap(x=>[-1,1].map(z=>[x,2,z])));
},{name:'双塔光谱工厂',effect:'spectrum',color:[.95,.32,.72],focus:[0,3.5,0],radius:1.25});
build('mining-0',q=>{
 q.batch('a',foundation(4,q.left.a));q.put('m',0,1,3);
 q.batch('c',[...[-2,2].flatMap(x=>ys(1,4).map(y=>[x,y,0])),...ys(-2,2).map(x=>[x,5,0]),...[-2,2].flatMap(x=>[-1,1].map(z=>[x,1,z]))]);
 q.batch('e',[-1,1].flatMap(x=>[-1,0].flatMap(z=>[1,2].map(y=>[x,y,z]))));
 q.batch('b',[-1,0,1].map(x=>[x,4,0]));q.put('g',0,3,0);q.put('d',0,1,2);q.put('h',0,2,2);
},{name:'虚空采矿 III · 悬臂钻井',effect:'drill',color:[.15,.82,1],focus:[0,2.7,1.35],radius:1.2});
build('mining-1',q=>{
 q.batch('a',foundation(5,q.left.a));q.put('m',0,1,6);q.put('e',0,1,5);
 q.batch('f',stack(y=>ring(5,y),[1,8]));
 q.batch('h',stack(y=>square(4,y),[3,7]));q.batch('d',stack(y=>square(4,y),[2,6]));
 q.batch('g',towers(4,0,12));q.batch('c',stack(y=>disk(2,y),[1,8]));q.batch('b',[-1,0,1].flatMap(x=>[-1,1].map(z=>[x,7,z])));
},{name:'虚空采矿 IV · 环形加速器',effect:'accelerator',color:[.25,.65,1],focus:[0,4.4,0],radius:2.7});
build('mining-2',q=>{
 q.batch('a',foundation(9,q.left.a));q.put('m',0,1,10);q.put('I',0,1,9);
 const fire=stack(y=>ring(6,y),[3,6,9,12]).slice(0,q.left.q);for(const [x,y,z]of fire){q.put('r',x,y-1,z);q.put('q',x,y,z);}
 q.batch('r',towers(7,1,17));q.batch('p',stack(y=>ring(5,y),ys(1,18)));
 q.batch('E',stack(y=>ring(8,y),[4,9,14]));q.batch('s',stack(y=>ring(7,y),[5,15]));
 q.batch('v',stack(y=>ring(4,y),[17,18]));q.batch('t',stack(y=>disk(3,y),[1,2]));q.batch('w',stack(y=>ring(3,y),[3,4,5]));
 const nodeChars=['c','d','e','f','g','h','i','j','k','l','n','o'];nodeChars.forEach((c,i)=>q.batch(c,ring(3,6+i)));
 for(const c of Object.keys(q.left).filter(c=>q.left[c]))q.batch(c,stack(y=>ring(4,y),ys(1,19)));
},{name:'虚空采矿 V · 星核采掘阵列',effect:'stellar',color:[.58,.4,1],focus:[0,10,0],radius:3.25});
build('fluid-0',q=>{
 q.batch('a',foundation(5,q.left.a));q.put('m',0,1,5);
 q.batch('f',disk(3,1).filter(p=>q.map.has([p[0],0,p[2]].join(','))));
 q.put('b',-1,1,4);q.put('h',0,1,4);q.put('k',0,2,4);
 q.batch('d',stack(y=>ring(3,y),[2,5]));q.batch('g',stack(y=>ring(3,y),[3,6]));q.batch('i',stack(y=>ring(3,y),[4,7]));
 q.batch('e',stack(y=>ring(2,y),[2,3,4]));q.batch('c',disk(2,8));q.batch('j',disk(2,9));
},{name:'流体处理 · 螺旋分馏塔',effect:'helix',color:[.15,1,.85],focus:[0,4.5,0],radius:3.55});
build('fluid-1',q=>{
 q.batch('a',foundation(10,q.left.a));q.put('m',0,1,12);q.put('F',0,1,11);
 q.batch('h',towers(7,1,18));q.batch('c',stack(y=>ring(10,y),ys(1,16)));
 q.batch('b',stack(y=>ring(9,y),[2,4,6,8,10]));q.batch('u',stack(y=>ring(9,y),[3,5,7,9,11]));
 q.batch('e',stack(y=>ring(8,y),[1,2,3,4,5]));q.batch('d',stack(y=>ring(8,y),[6,7,8]));
 q.batch('g',stack(y=>ring(6,y),[1,17]));q.batch('r',stack(y=>ring(6,y),[7,12]));
 q.batch('l',stack(y=>ring(7,y),[5,10,15]));q.batch('t',stack(y=>disk(4,y),[1,18]));
 for(const c of Object.keys(q.left).filter(c=>q.left[c]))q.batch(c,stack(y=>[...ring(5,y),...ring(4,y),...ring(3,y)],ys(2,17)));
},{name:'流体处理 · 量子裂解穹笼',effect:'quantum',color:[.25,.65,1],focus:[0,9,0],radius:4.2});
build('fluid-2',q=>{
 q.batch('a',foundation(9,q.left.a));q.put('m',0,1,10);q.put('g',0,1,9);q.put('h',0,2,9);
 q.batch('j',stack(y=>ring(7,y),[1,2,3]));q.batch('c',stack(y=>ring(6,y),[2,4,6,8]));
 q.batch('d',stack(y=>ring(6,y),[3,5,7,9]));q.batch('e',stack(y=>disk(3,y),[1,2,3,4]));
 q.batch('i',stack(y=>ring(4,y),[5,6,7]));q.batch('b',stack(y=>ring(5,y),[1,10]));q.batch('f',disk(2,10));
},{name:'流体处理 · 原子重构反应塔',effect:'atomic',color:[1,.65,.15],focus:[0,7.7,0],radius:3.6});
build('fluid-3',q=>{q.put('m',0,1,10);for(const x of [-1,1])for(const y of [1,2,3])q.put('a',x,y,10);},{name:'时间晶体 · 同轴增幅叉',effect:'time',color:[1,.8,.3],focus:[0,2,10],radius:1.2});
build('fluid-4',q=>{
 q.batch('a',foundation(18,q.left.a));q.put('m',0,1,19);q.put('d',0,1,18);
 const fire=disk(6,2).slice(0,q.left.n);for(const[x,y,z]of fire){q.put('l',x,y-1,z);q.put('n',x,y,z);}q.batch('l',disk(6,1));
 q.batch('c',stack(y=>disk(10,y),[1,2]));q.batch('e',stack(y=>disk(10,y),[3,4]));
 q.batch('b',stack(y=>ring(15,y,2),ys(1,19)));
 q.batch('i',stack(y=>ring(13,y),ys(1,16)));q.batch('h',disk(7,17));
 q.batch('j',stack(y=>ring(11,y),[6,12,18]));q.batch('o',stack(y=>ring(10,y),[8,16]));
 q.batch('f',towers(12,0,18));q.batch('g',stack(y=>ring(12,y),[7,13]));q.batch('k',disk(2,18));
},{name:'流体处理 · 低温物质编织环',effect:'cryo',color:[.3,.95,1],focus:[0,11,0],radius:9.8});
// 检测器与真实生产机器共用逐格图纸，控制器类型由各配方决定。
const aliases=['dyeing-0','mining-0','mining-1','fluid-0','fluid-1','fluid-2','fluid-4'];
for(let i=0;i<aliases.length;i++){const base=made.find(s=>s.id===aliases[i]),old=before.structures.find(s=>s.id==='inspector-'+i);made.push({...base,...old,pattern:base.pattern,name:base.name+' · 检测图',effect:'scan',color:[.2,1,.65],focus:base.focus,radius:base.radius});}
// 仅替换数组初始值；所有配方材料、产物、能量、时长与优先级逐字保留。
function arrayEnd(source,start){let depth=0,quote=null,escape=false;for(let i=start;i<source.length;i++){const c=source[i];if(quote){if(escape)escape=false;else if(c==='\\')escape=true;else if(c===quote)quote=null;}else if(c==='"'||c==="'")quote=c;else if(c==='[')depth++;else if(c===']'&&--depth===0)return i+1;}throw Error('Unclosed array');}
for(const[file,variable,,family]of specs){const p=path.join(root,'kubejs/server_scripts/custom_machine',file),original=fs.readFileSync(path.join(backup,'kubejs/server_scripts/custom_machine',file),'utf8'),match=new RegExp('const\\s+'+variable+'\\s*=\\s*\\[').exec(original);if(!match)throw Error(variable);const start=original.indexOf('[',match.index),end=arrayEnd(original,start);const arr=made.filter(s=>s.family===family).sort((a,b)=>a.index-b.index).map(s=>s.pattern);fs.writeFileSync(p,original.slice(0,start)+JSON.stringify(arr,null,2)+original.slice(end));}
fs.writeFileSync(path.join(out,'structures.json'),JSON.stringify(made,null,2));
// 运行时服务端判断与客户端特效读取同一份图纸元数据。
const resource=path.join(root,'tools/poc-dimension-matrix/src/main/resources/machine-redesign.json');fs.writeFileSync(resource,JSON.stringify(made));
console.log(JSON.stringify(made.map(s=>({id:s.id,name:s.name,size:[s.pattern[0][0].length,s.pattern.length,s.pattern[0].length],blocks:blocks(s).length})),null,2));
