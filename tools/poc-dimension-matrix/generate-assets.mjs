// 确定性生成结构、原生方块模型、64px像素贴图及共享投影几何。
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const write=(p,s)=>{p=path.join(root,p);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,s);};
const json=(p,v)=>write(p,JSON.stringify(v,null,2)+'\n');
const keys={A:'rain:dimension_matrix_casing',F:'rain:dimension_matrix_frame',C:'rain:dimension_matrix_conduit',N:'rain:dimension_matrix_anchor',P:'poc_dimension_matrix:projection_module',a:'minecraft:air'};
const grid=Array.from({length:11},()=>Array.from({length:11},()=>Array(11).fill('a')));
for(let y=0;y<11;y++)for(let z=0;z<11;z++)for(let x=0;x<11;x++){
  const edgeX=x===0||x===10,edgeZ=z===0||z===10;
  let v='a';
  if(y===0)v=(x===5||z===5||x===1||x===9||z===1||z===9)?'C':'A';
  if((y===1||y===9||y===10)&&(edgeX||edgeZ))v='F';
  if(edgeX&&edgeZ)v=(y%3===0)?'N':'F';
  // 四面中央的导轨与中层约束节点。
  if((edgeX&&z===5)||(edgeZ&&x===5))v=y===5?'N':'C';
  if((y===4||y===6)&&((edgeX&&Math.abs(z-5)<=1)||(edgeZ&&Math.abs(x-5)<=1)))v='F';
  if(y===5&&((edgeX&&Math.abs(z-5)===1)||(edgeZ&&Math.abs(x-5)===1)))v='N';
  if(y===10&&(x===5||z===5))v='C';
  grid[y][z][x]=v;
}
grid[1][10][5]='m';
for(const x of [3,7])for(const z of [3,7])grid[0][z][x]='P';
const base_pattern=grid.map(f=>f.map(r=>r.join('')));
const counts={};for(const f of base_pattern)for(const r of f)for(const c of r)counts[c]=(counts[c]||0)+1;
const symbols=[{a:'b',F:'f',C:'c',N:'n',A:'d'},{a:'q',F:'r',C:'s',N:'t',A:'u'}];
for(let side=0;side<2;side++)for(let y=1;y<=9;y++)for(let z=1;z<=9;z++){
  const x=side===0?0:10,original=grid[y][z][x],symbol=symbols[side][original];
  keys[symbol]=[keys[original],'poc_dimension_matrix:energy_'+(side===0?'input':'output')+'_port'];
  grid[y][z][x]=symbol;
}
const coolantSymbols={a:'z',F:'w',C:'x',N:'y',A:'v'};
for(let y=1;y<=9;y++)for(let x=1;x<=9;x++){
  const original=grid[y][0][x],symbol=coolantSymbols[original];
  keys[symbol]=[keys[original],'poc_dimension_matrix:coolant_input_port'];grid[y][0][x]=symbol;
}
const pattern=grid.map(f=>f.map(r=>r.join('')));
json('kubejs/data/rain/dimension_matrix/structure.json',{size:[11,11,11],controller:[5,1,10],base_pattern,
  ports:{reference_facing:'south',input_x:0,output_x:10,y_min:1,y_max:9,z_min:1,z_max:9,rate:1000000,coolant_z:0,coolant_x_min:1,coolant_x_max:9},projectors:[[3,0,3],[3,0,7],[7,0,3],[7,0,7]],pattern,keys});

// PNG编码：不引入构建包依赖。
const crc=b=>{let c=0xffffffff;for(const n of b){c^=n;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^0xffffffff)>>>0;};
const chunk=(type,b)=>{let t=Buffer.from(type),n=Buffer.alloc(4),c=Buffer.alloc(4);n.writeUInt32BE(b.length);c.writeUInt32BE(crc(Buffer.concat([t,b])));return Buffer.concat([n,t,b,c]);};
function png(n,pixels){let h=Buffer.alloc(13);h.writeUInt32BE(n);h.writeUInt32BE(n,4);h[8]=8;h[9]=6;const raw=Buffer.alloc(n*(n*4+1));for(let y=0;y<n;y++)pixels.copy(raw,y*(n*4+1)+1,y*n*4,(y+1)*n*4);return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',h),chunk('IDAT',zlib.deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);}
const palette={casing:[33,47,65],frame:[45,64,84],conduit:[19,45,63],anchor:[44,34,78],controller:[20,40,58]};
for(const [part,base]of Object.entries(palette)){
  const n=64,b=Buffer.alloc(n*n*4);
  const set=(x,y,c)=>{if(x<0||y<0||x>=n||y>=n)return;for(let k=0;k<3;k++)b[(y*n+x)*4+k]=c[k];b[(y*n+x)*4+3]=255;};
  const rect=(x,y,w,h,c)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)set(i,j,c);};
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){const noise=((x*17+y*31+x*y*3)%7)-3;set(x,y,base.map(v=>v+noise));}
  rect(0,0,64,3,[76,97,116]);rect(0,0,3,64,[60,80,100]);rect(0,61,64,3,[10,18,28]);rect(61,0,3,64,[10,18,28]);
  rect(7,7,50,2,[13,23,36]);rect(7,55,50,2,[13,23,36]);rect(7,7,2,50,[13,23,36]);rect(55,7,2,50,[13,23,36]);
  for(const x of[4,57])for(const y of[4,57]){rect(x,y,3,3,[126,147,164]);rect(x+1,y+1,1,1,[24,33,44]);}
  const cyan=[63,226,244],white=[183,255,255],purple=[169,116,244];
  if(part==='casing'){for(let y=16;y<48;y+=6)rect(16,y,32,2,[17,30,43]);rect(26,9,12,2,cyan);rect(26,53,12,2,cyan);}
  if(part==='frame'){for(const a of[12,48]){rect(a,12,4,40,[89,113,136]);rect(12,a,40,4,[89,113,136]);}rect(21,29,22,6,[18,32,47]);rect(24,31,16,2,cyan);}
  if(part==='conduit'){for(const x of[20,39]){rect(x-3,8,10,48,[10,20,30]);rect(x,8,4,48,cyan);rect(x+1,8,1,48,white);}for(const y of[12,29,46])rect(12,y,40,4,[97,123,143]);}
  if(part==='anchor'){rect(15,15,34,34,[15,20,39]);for(const a of[17,43]){rect(a,17,4,30,purple);rect(17,a,30,4,purple);}rect(25,25,14,14,cyan);rect(28,28,8,8,white);}
  if(part==='controller'){rect(12,12,40,30,[3,14,24]);rect(15,15,34,24,[13,58,77]);for(let y=19;y<35;y+=5)rect(20,y,24-((y%3)*3),2,cyan);for(let x=16;x<48;x+=8)rect(x,48,5,5,x===40?purple:cyan);}
  write('kubejs/assets/rain/textures/block/dimension_matrix_'+part+'.png',png(n,b));
  if(part!=='controller'){
    const id='dimension_matrix_'+part;
    json('kubejs/assets/rain/blockstates/'+id+'.json',{variants:{'':{model:'rain:block/'+id}}});
    json('kubejs/assets/rain/models/block/'+id+'.json',{parent:'minecraft:block/cube_all',textures:{all:'rain:block/'+id}});
    json('kubejs/assets/rain/models/item/'+id+'.json',{parent:'rain:block/'+id});
  }
}
write('kubejs/assets/rain/textures/block/dimension_matrix_white.png',png(1,Buffer.from([255,255,255,255])));
// 原生能量接口：青蓝向内箭头为输入，金橙向外箭头为输出。
const resources='tools/poc-dimension-matrix/src/main/resources/';
for(const mode of ['input','output','coolant']){
  const name=mode==='coolant'?'coolant_input_port':'energy_'+mode+'_port',id='poc_dimension_matrix:'+name;
  for(const active of [false,true]){
    const n=64,b=Buffer.alloc(n*n*4),glow=mode==='output'?[255,172,65]:mode==='coolant'?[80,190,255]:[65,225,247];
    const set=(x,y,c)=>{if(x>=0&&y>=0&&x<64&&y<64){for(let k=0;k<3;k++)b[(y*64+x)*4+k]=c[k];b[(y*64+x)*4+3]=255;}};
    const rect=(x,y,w,h,c)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)set(i,j,c);};
    for(let y=0;y<64;y++)for(let x=0;x<64;x++)set(x,y,[29+(x+y)%3,43+(x+y)%3,59+(x+y)%3]);
    rect(0,0,64,3,[85,108,127]);rect(0,0,3,64,[69,91,112]);rect(61,0,3,64,[10,20,31]);rect(0,61,64,3,[10,20,31]);
    for(const x of [5,56])for(const y of [5,56])rect(x,y,3,3,[137,159,178]);
    rect(10,10,44,44,[9,22,34]);
    const color=active?glow:glow.map(v=>Math.round(v*.62));
    for(let rotation=0;rotation<4;rotation++){
      const point=(x,y)=>{let a=x-32,c=y-32;for(let i=0;i<rotation;i++){const t=a;a=-c;c=t;}set(a+32,c+32,color);};
      const tip=mode!=='output'?44:54;
      for(let x=(mode!=='output'?48:40);x<=(mode!=='output'?55:49);x++)for(let y=30;y<=33;y++)point(x,y);
      for(let k=0;k<7;k++)for(let y=32-k;y<=32+k;y++)point(mode!=='output'?tip+k:tip-k,y);
    }
    rect(22,22,20,20,[14,29,43]);
    for(const v of [23,38]){rect(v,23,3,18,color);rect(23,v,18,3,color);}
    rect(29,29,6,6,active?[207,255,255]:[64,94,117]);
    if(mode==='coolant')for(let y=23;y<=40;y++)for(let x=23;x<=40;x++){const dx=x-32,dy=y-32;if(dx*dx+dy*dy<65)set(x,y,color);if(dx*dx+dy*dy<22)set(x,y,[200,245,255]);}
    const suffix=active?'_active':'';
    write(resources+'assets/poc_dimension_matrix/textures/block/'+name+suffix+'.png',png(n,b));
    json(resources+'assets/poc_dimension_matrix/models/block/'+name+suffix+'.json',{parent:'minecraft:block/cube',textures:{
      particle:'poc_dimension_matrix:block/'+name+suffix,down:'rain:block/dimension_matrix_casing',up:'rain:block/dimension_matrix_conduit',
      north:'poc_dimension_matrix:block/'+name+suffix,south:'rain:block/dimension_matrix_casing',west:'rain:block/dimension_matrix_casing',east:'rain:block/dimension_matrix_casing'}});
  }
  const variants={};for(const[facing,angle]of Object.entries({north:0,east:90,south:180,west:270}))for(const active of [false,true])
    variants['active='+active+',facing='+facing]={model:'poc_dimension_matrix:block/'+name+(active?'_active':''),y:angle};
  json(resources+'assets/poc_dimension_matrix/blockstates/'+name+'.json',{variants});
  json(resources+'assets/poc_dimension_matrix/models/item/'+name+'.json',{parent:'poc_dimension_matrix:block/'+name});
  json(resources+'data/poc_dimension_matrix/loot_table/blocks/'+name+'.json',{type:'minecraft:block',pools:[{rolls:1,entries:[{type:'minecraft:item',name:id}],conditions:[{condition:'minecraft:survives_explosion'}]}]});
}
for(const active of [false,true]){
  const n=64,b=Buffer.alloc(n*n*4),suffix=active?'_active':'';
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    const distance=Math.hypot(x-31.5,y-31.5);let c=[22,37,55];
    if(x<3||y<3||x>60||y>60)c=[85,112,135];
    if(distance<23)c=[8,18,31];
    if(Math.abs(distance-20)<1.7||Math.abs(distance-12)<1.6)c=active?[66,217,255]:[35,104,146];
    if(distance<7)c=active?[211,255,255]:[49,145,199];
    if(Math.abs(x-y)<1&&distance>8&&distance<23)c=[120,110,220];
    for(let k=0;k<3;k++)b[(y*n+x)*4+k]=c[k];b[(y*n+x)*4+3]=255;
  }
  const id='projection_module'+suffix;
  write(resources+'assets/poc_dimension_matrix/textures/block/'+id+'.png',png(n,b));
  json(resources+'assets/poc_dimension_matrix/models/block/'+id+'.json',{parent:'minecraft:block/cube',textures:{particle:'poc_dimension_matrix:block/'+id,up:'poc_dimension_matrix:block/'+id,down:'rain:block/dimension_matrix_casing',north:'rain:block/dimension_matrix_anchor',south:'rain:block/dimension_matrix_anchor',east:'rain:block/dimension_matrix_casing',west:'rain:block/dimension_matrix_casing'}});
}
json(resources+'assets/poc_dimension_matrix/blockstates/projection_module.json',{variants:{'active=false':{model:'poc_dimension_matrix:block/projection_module'},'active=true':{model:'poc_dimension_matrix:block/projection_module_active'}}});
json(resources+'assets/poc_dimension_matrix/models/item/projection_module.json',{parent:'poc_dimension_matrix:block/projection_module'});
json(resources+'data/poc_dimension_matrix/loot_table/blocks/projection_module.json',{type:'minecraft:block',pools:[{rolls:1,entries:[{type:'minecraft:item',name:'poc_dimension_matrix:projection_module'}],conditions:[{condition:'minecraft:survives_explosion'}]}]});
for(const tag of ['mineable/pickaxe','needs_iron_tool'])json(resources+'data/minecraft/tags/block/'+tag+'.json',{replace:false,values:['poc_dimension_matrix:energy_input_port','poc_dimension_matrix:energy_output_port','poc_dimension_matrix:coolant_input_port','poc_dimension_matrix:projection_module']});
json(resources+'data/poc_dimension_matrix/tags/fluid/coolants.json',{replace:false,values:['minecraft:water']});
json(resources+'data/poc_dimension_matrix/damage_type/dimensional_shear.json',{message_id:'dimension_shear',scaling:'never',exhaustion:0});
for(const tag of ['bypasses_armor','bypasses_effects','bypasses_resistance','bypasses_enchantments','bypasses_invulnerability','bypasses_cooldown','bypasses_shield'])json(resources+'data/minecraft/tags/damage_type/'+tag+'.json',{replace:false,values:['poc_dimension_matrix:dimensional_shear']});
json('kubejs/assets/rain/models/machine/dimension_matrix.json',{parent:'minecraft:block/cube',textures:{particle:'rain:block/dimension_matrix_casing',down:'rain:block/dimension_matrix_casing',up:'rain:block/dimension_matrix_anchor',north:'rain:block/dimension_matrix_controller',south:'rain:block/dimension_matrix_casing',west:'rain:block/dimension_matrix_conduit',east:'rain:block/dimension_matrix_conduit'}});
// 用原生JSON模型拼出物品晶体，无外部图像生成依赖。
json('kubejs/assets/rain/models/item/dimension_resonance_crystal.json',{parent:'minecraft:block/block',textures:{all:'rain:block/dimension_matrix_anchor',particle:'rain:block/dimension_matrix_anchor'},elements:[{from:[5,2,5],to:[11,14,11],rotation:{origin:[8,8,8],axis:'y',angle:45},faces:Object.fromEntries(['north','south','west','east','up','down'].map(d=>[d,{texture:'#all'}]))}],display:{gui:{rotation:[30,225,0],scale:[0.9,0.9,0.9]},ground:{translation:[0,3,0],scale:[0.35,0.35,0.35]},fixed:{rotation:[0,180,0],scale:[0.6,0.6,0.6]}}});

const projection={
  kind:'tesseract_hologram', vertices:16, edges:32, faces:24,
  perspective:4.2, scale:1.38,
  maxSpeedDegreesPerSecond:1440,
  spinUpSeconds:4, spinDownSeconds:3,
  fadeInSeconds:4, fadeOutSeconds:3,
  trailSamples:7, trailSeconds:0.09,
  blend:'src_alpha_one', depthTest:true, depthWrite:false
};
json('kubejs/assets/rain/dimension_matrix/visual.json',projection);

const side={TOP:'INPUT',BOTTOM:'INPUT',FRONT:'INPUT',RIGHT:'INPUT',BACK:'INPUT',LEFT:'INPUT'};
json('kubejs/data/custommachinery/machine/dimension_matrix.json',{
  name:{text:{translate:'cm.rain.dimension_matrix.name'}},
  appearance:{'custommachinery:block':'rain:machine/dimension_matrix#standalone','custommachinery:hardness':5,'custommachinery:resistance':12,running:{'custommachinery:light':10}},
  components:[{type:'custommachinery:energy',capacity:100000000,max_input:1000000,max_output:0,config:{...side,input:true}},
    ...[1,2,3].map(i=>({type:'custommachinery:item',id:'input_'+i,mode:'input'})),{type:'custommachinery:item',id:'output',mode:'output',config:{TOP:'OUTPUT',BOTTOM:'OUTPUT',FRONT:'OUTPUT',RIGHT:'OUTPUT',BACK:'OUTPUT',LEFT:'OUTPUT',output:true}}],
  gui:[{type:'custommachinery:background',width:208,height:192},{type:'custommachinery:energy',x:16,y:31,height:54},{type:'custommachinery:config',x:180,y:8},
    ...[1,2,3].map((i)=>({type:'custommachinery:slot',id:'input_'+i,x:42+(i-1)*20,y:48})),{type:'custommachinery:progress',x:110,y:49},{type:'custommachinery:slot',id:'output',x:150,y:45,width:26,height:26},
    {type:'custommachinery:player_inventory',x:23,y:103}],
  tooltips:[{text:{translate:'rain.dimension_matrix.tooltip'}}]
});
for(const[locale,values]of Object.entries({zh_cn:['维度方阵','维度方阵装甲','维度方阵框架','维度方阵相位导轨','维度方阵约束节点','维度共振晶体','11×11×11 · 四维全息投影 · 4秒渐入 / 3秒淡出 · 240 rpm'],en_us:['Dimension Matrix','Matrix Casing','Matrix Frame','Phase Conduit','Containment Anchor','Dimensional Resonance Crystal','11x11x11 · Tesseract hologram · 4s in / 3s out · 240 rpm']})){
  const lang={'cm.rain.dimension_matrix.name':values[0],'rain.dimension_matrix.tooltip':values[6],'item.rain.dimension_resonance_crystal':values[5]};
  ['casing','frame','conduit','anchor'].forEach((p,i)=>lang['block.rain.dimension_matrix_'+p]=values[i+1]);
  Object.assign(lang,locale==='zh_cn'?{
    'block.poc_dimension_matrix.energy_input_port':'维度方阵能量输入接口',
    'block.poc_dimension_matrix.energy_output_port':'维度方阵能量输出接口',
    'poc.matrix.port.input':'能量输入','poc.matrix.port.output':'能量输出',
    'poc.matrix.port.input_hint':'面向控制器正面：放在左侧墙面，外侧接入能量。',
    'poc.matrix.port.output_hint':'面向控制器正面：放在右侧墙面，外侧输出能量。',
    'poc.matrix.port.rate_hint':'同一方阵的输入/输出接口各共享 1,000,000 FE/t。',
    'poc.matrix.port.unbound':'接口未启用：检查对应墙面位置、完整结构（含4个投影模块）及控制器所在区块。',
    'poc.matrix.port.status':'%s接口已连接 · 储能 %s / %s FE'
  }:{
    'block.poc_dimension_matrix.energy_input_port':'Dimension Matrix Energy Input Port',
    'block.poc_dimension_matrix.energy_output_port':'Dimension Matrix Energy Output Port',
    'poc.matrix.port.input':'Energy input','poc.matrix.port.output':'Energy output',
    'poc.matrix.port.input_hint':'Facing the controller front: place in the LEFT wall; connect energy outside.',
    'poc.matrix.port.output_hint':'Facing the controller front: place in the RIGHT wall; energy exits outside.',
    'poc.matrix.port.rate_hint':'Ports on one matrix share 1,000,000 FE/t per transfer direction.',
    'poc.matrix.port.unbound':'Port inactive: check wall side, complete structure and controller chunk.',
    'poc.matrix.port.status':'%s port connected · Energy %s / %s FE'
  });
  const extras=JSON.parse(fs.readFileSync(path.join(root,'tools/poc-dimension-matrix/translations-extra.json'),'utf8'));
  Object.assign(lang,extras[locale]);
  json('tools/poc-dimension-matrix/src/main/resources/assets/poc_dimension_matrix/lang/'+locale+'.json',lang);
}
json('tools/poc-dimension-matrix/src/main/resources/assets/poc_dimension_matrix/sounds.json',Object.fromEntries(
  ['power_on','accelerate','full_speed','decelerate','warning'].map(name=>[name,{subtitle:'subtitles.poc_dimension_matrix.'+name,sounds:[{name:'poc_dimension_matrix:'+name,attenuation_distance:name==='warning'?64:32}]}])));
console.log(JSON.stringify({size:[11,11,11],counts,projection}));
