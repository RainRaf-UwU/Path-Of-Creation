import fs from 'node:fs';import path from 'node:path';import{createRequire}from'node:module';import{spawnSync}from'node:child_process';import{root,blocks,counts}from'./inventory.mjs';
const require=createRequire('C:/Users/44479/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/_poc.cjs');
const{createCanvas,loadImage,GlobalFonts}=require('@napi-rs/canvas'),JSZip=require('jszip');
const out=path.join(root,'design/multiblock-redesign-20261023'),cache=path.join(root,'.cache/machine-redesign');
const sheets=path.join(out,'previews');fs.mkdirSync(sheets,{recursive:true});
GlobalFonts.registerFromPath('C:/Windows/Fonts/msyh.ttc','Microsoft YaHei');
const all=JSON.parse(fs.readFileSync(path.join(out,'structures.json'))),main=all.filter(s=>s.family!=='inspector');
const entries=new Map(),wanted=new Set(main.flatMap(s=>Object.values(s.keys)).map(b=>b.split(':')[0]));wanted.add('minecraft');wanted.add('rain');
const archives=[...fs.readdirSync(path.join(root,'mods')).filter(n=>n.endsWith('.jar')).map(n=>path.join(root,'mods',n)),'E:/minecraft/libraries/net/minecraft/client/1.21.1-20240808.144430/client-1.21.1-20240808.144430-extra.jar'];
console.log('Indexing local block models and textures');
for(const p of archives){const z=await JSZip.loadAsync(fs.readFileSync(p));let kept=0;for(const[name,e]of Object.entries(z.files)){const m=name.match(/^assets\/([^/]+)\/(models\/.*\.json|blockstates\/.*\.json|textures\/.*\.png)$/);if(m&&wanted.has(m[1])){entries.set(name,e);kept++;}}}
function localWalk(p,base=''){for(const d of fs.readdirSync(p,{withFileTypes:true})){const n=path.join(p,d.name),rel=base+d.name;if(d.isDirectory())localWalk(n,rel+'/');else entries.set('assets/'+rel,{async:async()=>fs.readFileSync(n)});}}
localWalk(path.join(root,'kubejs/assets'));
async function json(id){const e=entries.get(id);if(!e)return null;try{return JSON.parse((await e.async('nodebuffer')).toString());}catch{return null;}}
const texCache=new Map(),audit={};
async function texture(id){if(texCache.has(id))return texCache.get(id);const e=entries.get('assets/'+id.replace(':','/textures/')+'.png');if(!e)return null;const image=await loadImage(await e.async('nodebuffer'));const c=createCanvas(image.width,image.width);c.getContext('2d').drawImage(image,0,0,image.width,image.width,0,0,image.width,image.width);texCache.set(id,c);return c;}
async function model(id,seen=new Set()){if(seen.has(id))return{};seen.add(id);const j=await json('assets/'+id.replace(':','/models/')+'.json');if(!j)return{};return{...(j.parent?await model(j.parent.includes(':')?j.parent:'minecraft:'+j.parent,seen):{}),...(j.textures||{})};}
async function skin(block,family){
 const id=block==='controller'?'rain:'+({mining:'void_mining_machine',dyeing:'dyeing_factory',fluid:'fluid_processing',inspector:'structure_inspector'}[family]||'fluid_processing'):block.split('[')[0];
 if(audit[id])return audit[id];
 let modelId;if(block==='controller')modelId='rain:machine/'+id.split(':')[1];else{const state=await json('assets/'+id.replace(':','/blockstates/')+'.json');let variants=state?.variants?Object.values(state.variants)[0]:state?.multipart?.[0]?.apply;if(Array.isArray(variants))variants=variants[0];modelId=variants?.model;}
 let textures=modelId?await model(modelId):{};
 function resolve(v){let n=0;while(v?.startsWith('#')&&n++<10)v=textures[v.slice(1)];return v?.includes(':')?v:v?'minecraft:'+v:null;}
 let sideId=resolve(textures.side||textures.all||textures.wall||textures.front||textures.particle||Object.values(textures)[0]);
 let topId=resolve(textures.top||textures.end||textures.all||textures.particle||sideId);
 let side=sideId?await texture(sideId):null,top=topId?await texture(topId):null;
 if(!side){const needle=id.split(':')[1],prefix='assets/'+id.split(':')[0]+'/textures/';const candidates=[...entries.keys()].filter(p=>p.startsWith(prefix)&&p.endsWith('.png')&&(p.includes('/'+needle+'.png')||p.includes('/'+needle+'/')||p.includes('/'+needle+'_'))).sort((a,b)=>a.length-b.length);if(candidates.length){sideId=candidates[0].slice(7,-4).replace('/textures/',':');side=await texture(sideId);}}
 const fallbackColor=id.includes('glass')?'#80b8c8':id.includes('fire')?'#9278ff':id.includes('gold')?'#c1a862':id.includes('star')?'#d2e4db':id.includes('quantum')?'#5a8b9a':id.includes('ice')?'#6198bd':'#597083';
 const value={side,top:top||side,color:fallbackColor,sideId,topId,transparent:/glass|spirit_fire|minecraft:fire/.test(id),block:id};audit[id]=value;return value;
}
for(const s of all)for(const b of blocks(s))await skin(b.block,s.family);
const project=(p,scale,cx,cy)=>[cx+(p[0]-p[2])*.8660254*scale,cy+((p[0]+p[2])*.33-p[1]*.943)*scale];
const depth=p=>p[0]*.66+p[1]*.49+p[2]*.66;
function frameMesh(id,frame){const p=path.join(cache,'meshes',id+'.bin');if(!fs.existsSync(p))return[];const b=fs.readFileSync(p);let offset=4;const n=b.readInt32BE(0);for(let f=0;f<n;f++){const count=b.readInt32BE(offset);offset+=4;if(f===frame){const out=[];for(let i=0;i<count;i++){const v=[];for(let j=0;j<7;j++)v.push(b.readFloatBE(offset+(i*7+j)*4));out.push(v);}return out;}offset+=count*28;}return[];}
const cubeFaces=[{n:[0,1,0],shade:.05,v:[[0,1,0],[1,1,0],[1,1,1],[0,1,1]],top:true},{n:[1,0,0],shade:.32,v:[[1,1,0],[1,1,1],[1,0,1],[1,0,0]]},{n:[0,0,1],shade:.18,v:[[1,1,1],[0,1,1],[0,0,1],[1,0,1]]}];
const geometry=new Map();
function faces(s){if(geometry.has(s.id))return geometry.get(s.id);const cells=blocks(s),m=cells.find(b=>b.c==='m'),occ=new Map(cells.map(b=>[[b.x,b.y,b.z].join(','),b]));const out=[];
 for(const b of cells){const sk=audit[b.block==='controller'?'rain:'+({mining:'void_mining_machine',dyeing:'dyeing_factory',fluid:'fluid_processing',inspector:'structure_inspector'}[s.family]):b.block.split('[')[0]];for(const f of cubeFaces){const near=occ.get([b.x+f.n[0],b.y+f.n[1],b.z+f.n[2]].join(','));if(near&&!sk.transparent&&near.block===b.block)continue;
   const p=f.v.map(v=>[b.x-m.x+v[0],b.y-m.y+v[1],b.z-m.z+v[2]]);out.push({p,depth:p.reduce((n,v)=>n+depth(v),0)/4,skin:sk,top:f.top,shade:f.shade});
 }}geometry.set(s.id,out);return out;}
function draw(s,mesh=null,width=800,height=650){const c=createCanvas(width,height),ctx=c.getContext('2d');ctx.fillStyle='#07111c';ctx.fillRect(0,0,width,height);const source=faces(s);const coords=source.flatMap(f=>f.p).map(p=>project(p,1,0,0));const minx=Math.min(...coords.map(p=>p[0])),maxx=Math.max(...coords.map(p=>p[0])),miny=Math.min(...coords.map(p=>p[1])),maxy=Math.max(...coords.map(p=>p[1]));const scale=Math.min((width-90)/(maxx-minx),(height-150)/(maxy-miny)),cx=width/2-(minx+maxx)/2*scale,cy=(height+30)/2-(miny+maxy)/2*scale;
 // 背景标尺地平面。
 ctx.strokeStyle='#153041';ctx.lineWidth=1;for(let i=-40;i<=40;i++){const p1=project([i,-1,-40],scale,cx,cy),p2=project([i,-1,40],scale,cx,cy),p3=project([-40,-1,i],scale,cx,cy),p4=project([40,-1,i],scale,cx,cy);ctx.beginPath();ctx.moveTo(...p1);ctx.lineTo(...p2);ctx.moveTo(...p3);ctx.lineTo(...p4);ctx.stroke();}
 const list=[...source];if(mesh)for(let i=0;i<mesh.length;i+=4){const v=mesh.slice(i,i+4),p=v.map(v=>[v[0]+s.focus[0]+.5,v[1]+s.focus[1]+.5,v[2]+s.focus[2]+.5]);list.push({p,depth:p.reduce((n,p)=>n+depth(p),0)/4,fx:v[0]});}
 list.sort((a,b)=>a.depth-b.depth);
 for(const f of list){const p=f.p.map(p=>project(p,scale,cx,cy));ctx.save();ctx.beginPath();ctx.moveTo(...p[0]);for(let i=1;i<p.length;i++)ctx.lineTo(...p[i]);ctx.closePath();
  if(f.fx){const v=f.fx;ctx.globalCompositeOperation='lighter';ctx.fillStyle=`rgba(${Math.round(v[3]*255)},${Math.round(v[4]*255)},${Math.round(v[5]*255)},${v[6]})`;ctx.fill();}
  else{ctx.globalAlpha=f.skin.transparent?.53:1;ctx.fillStyle=f.skin.color;ctx.fill();const img=f.top?f.skin.top:f.skin.side;if(img){ctx.clip();ctx.imageSmoothingEnabled=false;ctx.transform((p[1][0]-p[0][0])/img.width,(p[1][1]-p[0][1])/img.width,(p[3][0]-p[0][0])/img.height,(p[3][1]-p[0][1])/img.height,p[0][0],p[0][1]);ctx.drawImage(img,0,0);ctx.setTransform(1,0,0,1,0,0);}ctx.fillStyle=`rgba(0,0,0,${f.shade})`;ctx.fill();ctx.strokeStyle='rgba(3,13,23,.25)';ctx.lineWidth=.65;ctx.stroke();}
  ctx.restore();
 }
 ctx.fillStyle='#0a1621';ctx.fillRect(0,0,width,67);ctx.fillStyle='#d9f7ff';ctx.font='bold 24px "Microsoft YaHei"';ctx.fillText(s.name,24,32);ctx.font='15px "Microsoft YaHei"';ctx.fillStyle='#79a9bd';ctx.fillText(`${s.pattern[0][0].length} × ${s.pattern.length} × ${s.pattern[0].length}  |  ${blocks(s).length-1} 结构方块 + 1 控制器`,24,56);
 ctx.fillStyle='#9eb5c2';ctx.font='13px "Microsoft YaHei"';ctx.fillText(mesh?'运行状态 / 生产特效网格 / 贴图立方体示意':'静态结构 / 原材料与数量 / 贴图立方体示意',24,height-18);
 return c;
}
const structureSheet=createCanvas(2400,2060),fxSheet=createCanvas(2400,2060);for(const sheet of[structureSheet,fxSheet]){const x=sheet.getContext('2d');x.fillStyle='#07111c';x.fillRect(0,0,2400,2060);x.fillStyle='#e1f8ff';x.font='bold 34px "Microsoft YaHei"';x.fillText(sheet===fxSheet?'创世之径 · 多方块运行效果':'创世之径 · 全新多方块结构',30,48);x.fillStyle='#89aabc';x.font='19px "Microsoft YaHei"';x.fillText('维度方阵保持原样  ·  每套结构的方块种类与数量保持不变  ·  离线预览',30,83);}
for(let i=0;i<main.length;i++){const s=main[i];const normal=draw(s),running=draw(s,s.effect==='time'?null:frameMesh(s.id,32));fs.writeFileSync(path.join(sheets,s.id+'-structure.png'),normal.toBuffer('image/png'));fs.writeFileSync(path.join(sheets,s.id+'-running.png'),running.toBuffer('image/png'));structureSheet.getContext('2d').drawImage(normal,(i%3)*800,110+Math.floor(i/3)*650);fxSheet.getContext('2d').drawImage(running,(i%3)*800,110+Math.floor(i/3)*650);console.log('Rendered '+s.id);}
fs.writeFileSync(path.join(sheets,'structures-overview.png'),structureSheet.toBuffer('image/png'));fs.writeFileSync(path.join(sheets,'effects-overview.png'),fxSheet.toBuffer('image/png'));
// 各主体与检测器的分层搭建图。空白格为不限制，不代表配方要求空气。
for(const s of all){const cell=Math.max(12,Math.min(23,Math.floor(360/s.pattern[0][0].length))),tileW=s.pattern[0][0].length*cell+50,tileH=s.pattern[0].length*cell+45,cols=Math.min(4,s.pattern.length),rows=Math.ceil(s.pattern.length/cols),legend=Object.entries(counts(s)),w=Math.max(cols*tileW,800),h=100+rows*tileH+Math.ceil(legend.length/2)*26+45;const c=createCanvas(w,h),g=c.getContext('2d');g.fillStyle='#08131f';g.fillRect(0,0,w,h);g.fillStyle='#e5f7ff';g.font='bold 25px "Microsoft YaHei"';g.fillText(s.name+' · 逐层图纸',24,36);g.font='15px "Microsoft YaHei"';g.fillStyle='#8ab2c4';g.fillText('从下到上；每层上方为背面，下方为正面；m为控制器。空格不限制。',24,66);
 s.pattern.forEach((floor,y)=>{const bx=(y%cols)*tileW+25,by=95+Math.floor(y/cols)*tileH;g.fillStyle='#c9eef4';g.fillText('Y = '+y,bx,by);floor.forEach((row,z)=>[...row].forEach((ch,x)=>{const px=bx+x*cell,py=by+10+z*cell;g.strokeStyle='#203040';g.strokeRect(px,py,cell,cell);if(ch===' ')return;const block=ch==='m'?'controller':s.keys[ch],sk=Object.values(audit).find(v=>v.block===block.split('[')[0]);g.fillStyle=ch==='m'?'#f7ad51':sk?.color||'#587c90';g.fillRect(px+1,py+1,cell-1,cell-1);if(sk?.top){g.imageSmoothingEnabled=false;g.drawImage(sk.top,px+1,py+1,cell-1,cell-1);g.fillStyle='rgba(0,0,0,.36)';g.fillRect(px+1,py+1,cell-1,cell-1);}g.fillStyle='#ffffff';g.font=`bold ${Math.max(10,cell-7)}px monospace`;g.fillText(ch,px+cell*.27,py+cell*.77);}));});
 g.font='14px "Microsoft YaHei"';legend.forEach(([id,n],i)=>{g.fillStyle='#bfd7e2';const chars=id==='controller'?'m':Object.entries(s.keys).filter(([,v])=>v===id).map(([k])=>k).join('/');g.fillText(`${chars}  ${id} ×${n}`,25+(i%2)*w/2,110+rows*tileH+Math.floor(i/2)*26);});fs.writeFileSync(path.join(sheets,s.id+'-layers.png'),c.toBuffer('image/png'));
}
const renderAudit=Object.fromEntries(Object.entries(audit).map(([k,v])=>[k,{side:v.sideId,top:v.topId,hasTexture:!!v.side,transparent:v.transparent}]));fs.writeFileSync(path.join(out,'texture-preview-audit.json'),JSON.stringify(renderAudit,null,2));
if(process.argv.includes('--animate')){
 const targets=[...main.filter(s=>s.effect!=='time'),all.find(s=>s.id==='inspector-0')];
 const ffmpeg='E:/minecraft/ffmpeg-9.0.2-essentials_build/bin/ffmpeg.exe';
 for(const s of targets){const dir=path.join(cache,'frames',s.id);fs.mkdirSync(dir,{recursive:true});for(let frame=0;frame<64;frame++)fs.writeFileSync(path.join(dir,String(frame).padStart(3,'0')+'.png'),draw(s,frameMesh(s.id,frame),640,520).toBuffer('image/png'));
  const result=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-framerate','8','-i',path.join(dir,'%03d.png'),'-filter_complex','[0:v]split[a][b];[a]palettegen=max_colors=192[p];[b][p]paletteuse=dither=bayer:bayer_scale=3','-loop','0',path.join(sheets,s.id+'-cycle.gif')],{windowsHide:true});if(result.status)throw Error(result.stderr.toString());console.log('Animated '+s.id);
 }
}
console.log('Preview complete: '+sheets);
