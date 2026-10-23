import fs from 'node:fs';
import {Zip} from './zip.mjs';
const file='tools/poc-intro/src/main/resources/assets/poc_intro/manual.json',d=JSON.parse(fs.readFileSync(file));
const inv=JSON.parse(fs.readFileSync(process.argv[2]||'D:/codex-work/manual-20261020/inventory.json')),cn=inv.langs.zh_cn,en=inv.langs.en_us;
const archives=new Map(),archive=file=>{if(!archives.has(file))archives.set(file,new Zip('mods/'+file));return archives.get(file);};
const han=s=>/[\u3400-\u9fff]/.test(s||'');
const direct=(id,lang)=>{const [ns,p]=id.split(':');return ['item.','block.','parttype.','module.'].map(prefix=>prefix+ns+'.'+p.replace(/^part_|^module_/,prefix==='parttype.'||prefix==='module.'?'':'$&').replaceAll('/','.')).map(k=>lang[k]).find(v=>v&&!v.includes('%s'));};
const nativeRefs=new Set(),overrides=new Map();
for(const jar of new Set(d.entries.filter(e=>!han(e.zh)&&inv.items[e.id]).map(e=>inv.items[e.id].file))){
 const z=archive(jar);
 for(const name of z.entries.keys()){
  if(name.startsWith('data/')&&name.endsWith('.json'))for(const m of z.read(name).toString().matchAll(/"([a-z0-9_.-]+:[a-z0-9_./-]+)"/g))nativeRefs.add(m[1]);
  if(!/^assets\/[^/]+\/models\/item\/.+\.json$/.test(name))continue;
  let model;try{model=z.json(name);}catch{continue;}
  const [,ns,stem]=name.match(/^assets\/([^/]+)\/models\/item\/(.+)\.json$/);
  for(const o of model.overrides||[]){if(!o.model?.includes(':item/'))continue;overrides.set(o.model.replace(':item/',':'),ns+':'+stem);}
 }
}
const bgItems=new Set(['template_manager','gadget_building','gadget_exchanging','gadget_copy_paste','gadget_cut_paste','gadget_destruction','template','redprint']);
const lenses=new Set(['white','orange','magenta','light_blue','yellow','lime','pink','gray','light_gray','cyan','purple','blue','brown','green','red','black'].map(c=>'industrialforegoing:'+c+'_laser_lens'));
const manualNames={
 'extendedae:infinity_water_cell':'无限水存储元件','extendedae:infinity_cobblestone_cell':'无限圆石存储元件',
 'industrialforegoing:transporter':'传送器','industrialforegoing:clean_hydroponic_simulation_processor':'空白水培模拟处理器',
 'industrialforegoingadditional:block_detector':'方块检测器','industrialforegoingadditional:factory_constructor':'工厂构造机','industrialforegoingadditional:machine_frame_ultimate':'终极机器框架',
 'industrialforegoingadditional:polishing_machine':'抛光机','industrialforegoingadditional:repair_machine':'修复机','industrialforegoingadditional:sifter_machine':'筛分机','industrialforegoingadditional:solidifier':'凝固机','industrialforegoingadditional:upgraded_constructor':'升级构造机',
 'rftoolsstorage:storage_scanner':'存储扫描器','rftoolsstorage:crafting_manager':'合成管理器','rftoolsstorage:modular_storage':'模块化存储器','rftoolsstorage:storage_control_module':'存储控制模块','rftoolsstorage:dump_module':'物品倾倒模块',
 'rftoolsutility:storage_control_module':'存储控制模块','rftoolsutility:elevator_button_module':'电梯按钮模块',
 'xnet:terminal':'XNet 网络终端','hyperbox:hyperbox':'超维盒','compactmachines:machine':'压缩空间机器','compactmachines:new_machine':'压缩空间机器外壳',
 'quarryplus:remote_placer':'远程放置器','quarryplus:filter_module':'过滤模块','quarryplus:presetapplier':'预设应用器','quarryplus:quarry_pickaxe':'采石场镐','quarryplus:repeat_tick_module':'重复刻模块',
 'pylons:protection_pylon':'保护晶塔','stellaris:position_module':'位置模块',
 'morefunctionalstorage:breaker_upgrade':'破坏升级','morefunctionalstorage:dimensional_refill_upgrade':'跨维度补货升级','morefunctionalstorage:placer_upgrade':'放置升级',
 'morefunctionalstorage:refill_upgrade':'补货升级','morefunctionalstorage:speed_upgrade_augment':'速度升级增幅器','morefunctionalstorage:stonecutting_upgrade':'切石升级',
 'silentgear:crude_mixer':'粗制混合机','silentgear:paint_mixer':'涂料混合机',
 'deep/actuallyadditions/esd':'物品分配器',
 'integrateddynamics:menril_wood_stripped':'去皮门瑞欧木','integrateddynamics:menril_log_stripped':'去皮门瑞欧原木',
 'integratedcrafting:part_interface_crafting_enumerated':'枚举合成接口','integratedcrafting:part_crafting_writer':'合成写入器','integratedcrafting:part_interface_crafting':'合成接口','integratedcrafting:part_interface_crafting_attuned':'协调合成接口',
 'integratedtunnels:part_interface_filter_item':'过滤物品接口','integratedtunnels:part_interface_filter_fluid':'过滤流体接口','integratedtunnels:part_interface_filter_energy':'过滤能量接口',
 'integratedterminals:chorus_glass':'紫颂玻璃','integratedterminals:part_terminal_storage':'存储终端','integratedterminals:part_terminal_crafting_job':'合成任务终端','integratedterminals:menril_glass':'门瑞欧玻璃','integratedterminals:terminal_storage_portable':'便携式存储终端',
};
const aliases=new Map(),removed=[],renamed=[],directEvidence=[];
const reasons=new Map();
for(const e of d.entries){
 if(e.guide)continue;const id=e.id,[ns,p]=id.split(':');let reason,base;
 if(ns==='buildinggadgets2'&&!bgItems.has(p))reason='Current 1.3.9 Registration.class registers no such item; legacy/model-only asset';
 else if(ns==='create'&&p.includes('/'))reason='Renderer submodel, not an item';
 else if(/^(sophisticatedstorage|sophisticatedbackpacks):(?:chipped|sawmill)\//.test(id))reason='Compatibility models for mods not installed';
 else if(/^solarflux:twilightforest\//.test(id))reason='Twilight Forest compatibility asset; mod not installed';
 else if(/^solarflux:(photovoltaic_cell_dark_matter|wireless_upgrade)$/.test(id))reason='Unused legacy/optional model; current ItemsSF and installed compatibility modules do not register it';
 else if(/^(mekanism:meka_tool_left|industrialforegoing:infinity_trident_throwing)$/.test(id))reason='Left-hand/throwing renderer model; use the base equipment entry';
 else if(id==='rftoolsstorage:storage_module6')reason='Installed remote_module.json marks this legacy/internal module outside normal progression';
 else if(/^industrialforegoing:laser_lens_inverted\d+$/.test(id))reason='Legacy inverted lens models; current ModuleCore registers the 16 named dye lenses';
 else if(/^industrialforegoing:fluid_transfer_addon_(?:push|pull)_/.test(id)){reason='Fluid-transfer addon directional render state';base='industrialforegoing:fluid_transfer_addon';}
 else if(overrides.has(id)&&!inv.items[id]?.block&&!nativeRefs.has(id)&&!direct(id,en)&&!lenses.has(id)){base=overrides.get(id);reason='Item-model override state with no recipe/tag/localization registry evidence';}
 else if(/^(?:quarryplus:(?:debug_storage|dummy_replacer|creative_generator)|draconicevolution:structure_block|integratedtunnels:dummy_pickaxe|hostilenetworks:data_model_base)$/.test(id))reason='Internal/debug/creative placeholder outside the survival operation catalog';
 if(reason){if(base&&inv.items[base])aliases.set(id,base);removed.push({id,base,reason,model:inv.items[id]?.model,jar:inv.items[id]?.file});reasons.set(id,reason);}
}
const colors={white:'白色',orange:'橙色',magenta:'品红色',light_blue:'淡蓝色',yellow:'黄色',lime:'黄绿色',pink:'粉红色',gray:'灰色',light_gray:'淡灰色',cyan:'青色',purple:'紫色',blue:'蓝色',brown:'棕色',green:'绿色',red:'红色',black:'黑色'};
const wood={oak:'橡木',spruce:'云杉木',birch:'白桦木',jungle:'丛林木',acacia:'金合欢木',dark_oak:'深色橡木',mangrove:'红树木',cherry:'樱花木',bamboo:'竹',crimson:'绯红木',warped:'诡异木'};
function translated(id){
 if(manualNames[id])return manualNames[id];let n=direct(id,cn);if(han(n))return n;const [ns,p]=id.split(':');let m;
 if(ns==='silentgear'&&(m=p.match(/^(.+)_(blueprint|template)$/))){let base=direct(ns+':'+m[1],cn);if(han(base))return base.replace(/^混合材料/,'')+(m[2]==='blueprint'?'蓝图':'模板');}
 if((m=p.match(/^(speed|processing|efficiency)_addon_(?:tier_)?(\d+)$/)))return {speed:'速度',processing:'处理',efficiency:'效率'}[m[1]]+'升级插件（'+m[2]+'级）';
 if(ns==='industrialforegoing'&&(m=p.match(/^range_addon_tier_(\d+)$/)))return '范围升级插件（'+m[1]+'级）';
 if(ns==='industrialforegoing'&&(m=p.match(/^(.+)_laser_lens$/))&&colors[m[1]])return colors[m[1]]+'镭射聚焦透镜';
 if(ns==='industrialforegoing'&&(m=p.match(/^conveyor_(.+)_upgrade$/)))return '传送带'+({splitting:'分流',blinking:'闪烁传送',bouncing:'弹跳',detection:'检测',dropping:'掉落',extraction:'抽取',insertion:'插入'}[m[1]]||'功能')+'升级';
 if(ns==='rftoolsstorage'&&(m=p.match(/^storage_module([0-3])$/)))return '存储模块（'+(Number(m[1])+1)+'级）';
 if(ns==='sophisticatedstorage'&&(m=p.match(/^(.+)_storage_connector$/))&&wood[m[1]])return wood[m[1]]+'存储连接器';
 if(ns==='enderio'&&(m=p.match(/^(clear_glass|fused_quartz)_([de]?)(np|nm|na|p|m|a)$/)))return ({d:'遮光',e:'发光'}[m[2]]||'')+(m[1]==='clear_glass'?'纯净玻璃':'熔融石英玻璃')+'（'+{p:'玩家可通过',np:'阻挡玩家',m:'生物可通过',nm:'阻挡生物',a:'动物可通过',na:'阻挡动物'}[m[3]]+'）';
 return null;
}
for(const e of d.entries){if(reasons.has(e.id))continue;if(!han(e.zh)||/^rftoolsstorage:storage_module[0-3]$/.test(e.id)){let value=translated(e.id);if(value&&e.zh!==value){renamed.push({id:e.id,from:e.zh,to:value});e.zh=value;e.sources=[...new Set([...e.sources,'manual/fix-localization.mjs'])];directEvidence.push({id:e.id,title:value});}}}
d.entries=d.entries.filter(e=>!reasons.has(e.id));
for(const e of d.entries)e.items=[...new Set(e.items.map(id=>aliases.get(id)||id).filter(id=>!reasons.has(id)))];
const unresolved=d.entries.filter(e=>!han(e.zh)).map(e=>({id:e.id,zh:e.zh,en:e.en}));
const auditFile='tools/poc-intro/manual/localization-audit.json',prior=fs.existsSync(auditFile)?JSON.parse(fs.readFileSync(auditFile)):{removed:[],renamed:[]};
const allRemoved=[...new Map([...prior.removed,...removed].map(e=>[e.id,e])).values()],removedIds=new Set(allRemoved.map(e=>e.id)),renameMap=new Map(prior.renamed.map(e=>[e.id,e]));
for(const row of renamed)renameMap.set(row.id,{...row,from:renameMap.get(row.id)?.from||row.from});
const allRenamed=[...renameMap.values()].filter(e=>!removedIds.has(e.id));
const report={removed:allRemoved,renamed:allRenamed,unresolved,renamedCount:allRenamed.length,removedCount:allRemoved.length,entries:d.entries.length};
fs.writeFileSync(file,JSON.stringify(d,null,1));fs.writeFileSync('tools/poc-intro/manual/localization-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({renamed:renamed.length,removed:removed.length,unresolved},null,2));
