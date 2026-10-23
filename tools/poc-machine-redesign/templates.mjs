import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import{root,blocks}from'./inventory.mjs';
const out=path.join(root,'design/multiblock-redesign-20261023'),backup=path.join(out,'backup');
const oldSource=fs.readFileSync(path.join(backup,'kubejs/server_scripts/quest_building_templates.js'),'utf8');
const legacy=JSON.parse(oldSource.match(/const templates = (\[[\s\S]*?\n    \])/)[1]);
const structures=JSON.parse(fs.readFileSync(path.join(out,'structures.json')));
const ids=['fluid-0','mining-0','dyeing-0','mining-1','fluid-1','fluid-2','mining-2'];
function uuid(text){let b=crypto.createHash('sha256').update(text).digest().subarray(0,16);b[6]=(b[6]&15)|80;b[8]=(b[8]&63)|128;return b.toString('hex').replace(/^(........)(....)(....)(....)(............)$/,'$1-$2-$3-$4-$5');}
function words(id){const b=Buffer.from(id.replaceAll('-',''),'hex');return [0,4,8,12].map(i=>b.readInt32BE(i));}
function fromWords(s){const v=s.match(/-?\d+/g).map(Number);if(v.length!==4)throw Error('UUID words');const b=Buffer.alloc(16);v.forEach((n,i)=>b.writeInt32BE(n,i*4));return b.toString('hex').replace(/^(........)(....)(....)(....)(............)$/,'$1-$2-$3-$4-$5');}
const map={},fresh=[];
legacy.forEach((old,i)=>{
 const s=structures.find(s=>s.id===ids[i]),all=blocks(s),m=all.find(b=>b.c==='m'),palette=[{Name:'minecraft:air'}],indices=new Map(),positions=new Map();
 for(const b of all){if(b.c==='m')continue;const match=b.block.match(/^([^\[]+)(?:\[([^\]]+)\])?$/);let state={Name:match[1]};
  if(match[2])state.Properties=Object.fromEntries(match[2].split(',').map(s=>s.split('=')));
  // 模板中的自然叶保持持久状态；火焰必须先搭支撑再放置。
  if(state.Name==='naturesaura:golden_leaves')state.Properties={persistent:'true',distance:'7',stage:'0',waterlogged:'false'};
  if(state.Name==='minecraft:chest')state.Properties={facing:'south',type:'single',waterlogged:'false'};
  if(state.Name==='actuallyadditions:atomic_reconstructor')state.Properties={facing:'up'};
  const signature=JSON.stringify(state);if(!indices.has(signature)){indices.set(signature,palette.length);palette.push(state);}positions.set([b.x-m.x,b.y-m.y,b.z-m.z].join(','),indices.get(signature));
 }
 const xs=all.map(b=>b.x-m.x),ys=all.map(b=>b.y-m.y),zs=all.map(b=>b.z-m.z);const start={X:Math.min(...xs),Y:Math.min(...ys),Z:Math.min(...zs)},end={X:Math.max(...xs),Y:Math.max(...ys),Z:Math.max(...zs)},list=[];
 // Minecraft BlockPos.betweenClosed：X最快，然后Y，最后Z。与BG2原生解码一致。
 for(let z=start.Z;z<=end.Z;z++)for(let y=start.Y;y<=end.Y;y++)for(let x=start.X;x<=end.X;x++)list.push(positions.get([x,y,z].join(','))||0);
 const value={statelist:list,startpos:start,endpos:end,blockstatemap:palette};
 const snbt=JSON.stringify(value).replace(/"statelist":\[/,'"statelist":[I;');
 const id=uuid(old.uuid+':poc-machine-redesign-v1:'+JSON.stringify(s.pattern));map[old.uuid]=id;
 fresh.push({uuid:id,name:old.name,structure:s.id,old_uuid:old.uuid,snbt});
});
const dataDir=path.join(root,'kubejs/data/rain/machine_redesign');fs.mkdirSync(dataDir,{recursive:true});
fs.writeFileSync(path.join(dataDir,'templates.json'),JSON.stringify({revision:1,templates:[...legacy,...fresh.map(({uuid,name,snbt})=>({uuid,name,snbt}))],migrations:legacy.map((old,i)=>({uuid:old.uuid,original_snbt:old.snbt,updated_snbt:fresh[i].snbt}))},null,2));
fs.writeFileSync(path.join(dataDir,'structures.json'),JSON.stringify(structures,null,2));
const chapterDir=path.join(root,'config/ftbquests/quests/chapters');let rewards=0;
for(const name of fs.readdirSync(chapterDir).filter(n=>n.endsWith('.snbt'))){
 const source=fs.readFileSync(path.join(backup,'config/ftbquests/quests/chapters',name),'utf8');
 const result=source.replace(/("buildinggadgets2:copy_uuid":\s*\[I;)([\s\S]*?)(\]\s*"buildinggadgets2:gadget_uuid":\s*\[I;)([\s\S]*?)(\])/g,(whole,a,copy,b,gadget,c)=>{
  const old=fromWords(gadget),id=map[old];if(!id)return whole;rewards++;const cw=words(uuid(id+':copy')),gw=words(id);let ci=0,gi=0;return a+copy.replace(/-?\d+/g,()=>cw[ci++])+b+gadget.replace(/-?\d+/g,()=>gw[gi++])+c;
 });
 if(result!==source)fs.writeFileSync(path.join(chapterDir,name),result);
}
fs.writeFileSync(path.join(root,'kubejs/server_scripts/quest_building_templates.js'),fs.readFileSync(new URL('./quest-templates.runtime.js',import.meta.url)));
const eventFile='kubejs/server_scripts/A_event/structure_event.js';if(!fs.existsSync(path.join(backup,eventFile))){fs.mkdirSync(path.dirname(path.join(backup,eventFile)),{recursive:true});fs.copyFileSync(path.join(root,eventFile),path.join(backup,eventFile));}
const oldEvent=fs.readFileSync(path.join(backup,eventFile),'utf8');const untouched=oldEvent.slice(oldEvent.indexOf("BlockEvents.placed('rain:structure_fluid_processing_primering'"));
const script=`// 一键搭建与配方/任务模板使用同一份生成图纸；控制器由玩家单独放置。\nfunction pocPlaceRedesignedStructure(event, layoutId) {\n    const {block, player} = event\n    if (!player || !player.isPlayer()) return\n    if (player.getOffHandItem().id !== 'rain:fazhang') {\n        player.tell(Text.red(Text.translate('rain.structure_block.player.tell.text_0_0')).append(Text.aqua(Item.of('rain:fazhang').displayName)).append(Text.red(Text.translate('rain.structure_block.player.tell.text_0_1'))))\n        player.tell(Text.gold(Text.translate('rain.structure_block.player.tell.text_info')))\n        event.cancel()\n        return\n    }\n    const layouts = JsonIO.read('kubejs/data/rain/machine_redesign/structures.json')\n    const layout = layouts.find(value => value.id === layoutId)\n    let origin = null\n    layout.pattern.forEach((floor, y) => floor.forEach((row, z) => { const x = row.indexOf('m'); if (x >= 0) origin = [x, y, z] }))\n    const cells = []\n    layout.pattern.forEach((floor, y) => floor.forEach((row, z) => {\n        for (let x = 0; x < row.length; x++) {\n            const symbol = row.charAt(x)\n            if (symbol === ' ' || symbol === 'm') continue\n            let state = layout.keys[symbol]\n            if (state === 'naturesaura:golden_leaves') state += '[persistent=true]'\n            // 控制器在标记正上方，面向北；CM南向规范图纸旋转180度。\n            cells.push({x: origin[0] - x, y: y - origin[1] + 1, z: origin[2] - z, state: state})\n        }\n    }))\n    if (cells.some(cell => { const id = block.offset(cell.x, cell.y, cell.z).id; return id !== 'minecraft:air' && id !== cell.state.split('[')[0] })) {\n        player.tell(Text.red(Text.translate('rain.structure_block.occupied')))\n        event.cancel()\n        return\n    }\n    block.set('minecraft:air')\n    cells.forEach(cell => event.server.runCommandSilent('setblock ' + (block.x + cell.x) + ' ' + (block.y + cell.y) + ' ' + (block.z + cell.z) + ' ' + cell.state))\n}\nBlockEvents.placed('rain:structure_void_mining_machine-3', event => pocPlaceRedesignedStructure(event, 'mining-0'))\nBlockEvents.placed('rain:structure_dyeing', event => pocPlaceRedesignedStructure(event, 'dyeing-0'))\n\n`;
fs.writeFileSync(path.join(root,eventFile),script+untouched);
for(const[locale,text]of[['zh_cn','结构空间被占用，请清空后重试。控制器放在标记正上方，朝向北。'],['en_us','Structure space is occupied. Clear it and retry. Place the controller directly above the marker, facing north.']]){const p=path.join(root,'kubejs/assets/rain/lang',locale+'.json'),b=path.join(backup,'kubejs/assets/rain/lang',locale+'.json');if(!fs.existsSync(b)){fs.mkdirSync(path.dirname(b),{recursive:true});fs.copyFileSync(p,b);}const original=fs.readFileSync(b,'utf8'),eol=original.includes('\r\n')?'\r\n':'\n',body=original.slice(0,original.lastIndexOf('}')).trimEnd();fs.writeFileSync(p,body+','+eol+'    '+JSON.stringify('rain.structure_block.occupied')+': '+JSON.stringify(text)+eol+'}'+eol);}
fs.writeFileSync(path.join(out,'template-manifest.json'),JSON.stringify({reward_items_updated:rewards,templates:fresh.map(({snbt,...t})=>t),policy:'New UUIDs for rewards. Migrate untouched official legacy templates only after native normalized NBT equality; preserve player edits and unrelated UUIDs. Original payloads backed up. Controller excluded from templates.'},null,2));
console.log(JSON.stringify({templates:fresh.length,rewards,newAndLegacy:legacy.length+fresh.length}));
