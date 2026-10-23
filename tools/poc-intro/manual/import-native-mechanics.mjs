import fs from 'node:fs';
const file='tools/poc-intro/src/main/resources/assets/poc_intro/manual.json',d=JSON.parse(fs.readFileSync(file)),inv=JSON.parse(fs.readFileSync('D:/codex-work/manual-20261020/inventory.json'));
const byId=new Map(d.entries.map(e=>[e.id,e])),owner=new Map(d.groups.flatMap(g=>g.mods.map(ns=>[ns,g.id]))),cn=inv.langs.zh_cn,en=inv.langs.en_us;
const clean=t=>t.replace(/§[0-9a-fk-or]|&[0-9a-fk-or]/gi,'').replace(/<[^>]*>/g,'').replace(/\$\([^)]+\)/g,'').replace(/\\n/g,'\n').trim();
const label=(id,l)=>l['block.'+id.replace(':','.')]||l['item.'+id.replace(':','.')]||id;
let topics=0,attached=0;
function topic(group,key,title,body,bodyEn,items,source){
 if(body.length<(group==='create'?10:45))return;items=items.filter(id=>inv.items[id]);let id='deep/'+group+'/'+key,e=byId.get(id);
 if(!e){e={id,group,zh:title,en:en[source]||key.replaceAll('_',' '),items,tags:[],sources:[],guide:true};d.entries.push(e);byId.set(id,e);}
 Object.assign(e,{body,bodyEn:bodyEn||body,topicId:source,detailLevel:'native',researchSource:source,sources:[source]});topics++;
 for(let item of items){let v=byId.get(item);if(!v){v={id:item,group,zh:label(item,cn),en:label(item,en),items:[item],tags:inv.tags[item]||[],sources:[],guide:false};d.entries.push(v);byId.set(item,v);}
  if(!v.nativeSections){v.nativeSections=[];v.body='';v.bodyEn='';}if(v.nativeSections.includes(source))continue;v.nativeSections.push(source);v.body+=(v.body?'\n\n':'')+title+'\n'+body;v.bodyEn+=(v.bodyEn?'\n\n':'')+(en[source]||key)+'\n'+(bodyEn||body);v.detailLevel='native';v.topicId='native/'+item;v.sources=[...new Set([...v.sources,source])];attached++;
 }
}
const aliases={auto_schedule:['track_station','schedule'],bearing_modes:['mechanical_bearing'],belt_casing:['belt_connector'],belt_directions:['belt_connector'],belt_transport:['belt_connector'],cart_assembler_dual:['cart_assembler'],chain_drive:['encased_chain_drive'],chain_gearshift:['adjustable_chain_gearshift'],cog_speedup:['cogwheel','large_cogwheel'],cogwheel_casing:['cogwheel'],deployer_processing:['deployer'],display_link_redstone:['display_link'],empty_blaze_burner:['empty_blaze_burner'],factory_gauge_crafting:['factory_gauge'],factory_gauge_links:['factory_gauge'],factory_gauge_recipe:['factory_gauge'],factory_gauge_restocker:['factory_gauge'],fan_direction:['encased_fan'],fan_processing:['encased_fan'],fluid_pipe_flow:['fluid_pipe'],fluid_pipe_interaction:['fluid_pipe'],fluid_tank_sizes:['fluid_tank'],fluid_tank_storage:['fluid_tank'],funnel_compat:['andesite_funnel','brass_funnel'],funnel_direction:['andesite_funnel','brass_funnel'],funnel_intro:['andesite_funnel','brass_funnel'],funnel_redstone:['andesite_funnel','brass_funnel'],funnel_transfer:['andesite_funnel','brass_funnel'],gantry_cascaded:['gantry_shaft','gantry_carriage'],gantry_direction:['gantry_shaft','gantry_carriage'],gantry_redstone:['gantry_shaft','gantry_carriage'],hose_pulley_infinite:['hose_pulley'],hose_pulley_level:['hose_pulley'],item_vault_sizes:['item_vault'],item_vault_storage:['item_vault'],linear_chassis_attachment:['linear_chassis'],linear_chassis_group:['linear_chassis'],packager_address:['packager'],portable_storage_interface_redstone:['portable_storage_interface'],radial_chassis:['radial_chassis'],rope_pulley_attachment:['rope_pulley'],rope_pulley_modes:['rope_pulley'],rope_pulley_multi_rope:['rope_pulley'],sail:['white_sail','windmill_bearing'],sail_frame:['sail_frame','windmill_bearing'],shaft_casing:['shaft'],smart_pipe:['smart_fluid_pipe'],spout_filling:['spout'],stabilized_bearings:['mechanical_bearing','stabilized_bearing'],stock_ticker_address:['stock_ticker'],table_cloth:['white_table_cloth'],track_chunks:['track_station'],track_placement:['track'],track_portal:['track'],train_assembly:['track_station'],train_controls:['controls'],train_schedule:['schedule'],train_signal_placement:['track_signal'],train_signal_redstone:['track_signal'],train_signal_signaling:['track_signal'],valve_pipe:['fluid_valve'],windmill_source:['windmill_bearing'],windmill_structure:['windmill_bearing']};
for(let header of Object.keys(cn).filter(k=>/^create\.ponder\..+\.header$/.test(k))){
 let scene=header.split('.')[2];if(/creative/.test(scene))continue;
 let keys=Object.keys(cn).filter(k=>k.startsWith('create.ponder.'+scene+'.text_')).sort((a,b)=>Number(a.split('_').at(-1))-Number(b.split('_').at(-1)));
 let body=keys.map(k=>clean(cn[k])).filter(s=>s.length>5).join('\n\n'),bodyEn=keys.map(k=>clean(en[k]||'')).filter(s=>s.length>5).join('\n\n');
 let itemNames=({crushing_wheels:['crushing_wheel'],postbox:['white_postbox'],smart_observer:['content_observer'],threshold_switch:['stockpile_switch'],piston_pole:['piston_extension_pole']})[scene]||aliases[scene]||[scene];if(!itemNames.some(id=>inv.items['create:'+id])){let prefix=Object.keys(inv.items).filter(id=>id.startsWith('create:')&&scene.startsWith(id.split(':')[1]+'_')).sort((a,b)=>b.length-a.length)[0];if(prefix)itemNames=[prefix.split(':')[1]];}
 topic('create',scene,cn[header],body,bodyEn,itemNames.map(id=>'create:'+id),'create.ponder.'+scene+'.header');
}
// Integrated Dynamics and its addons keep the actual in-game guide in language keys.
for(let [ns,group] of [['integrateddynamics','integrateddynamics'],['integratedtunnels','integrateddynamics'],['integratedcrafting','integrateddynamics'],['integratedterminals','integrateddynamics']]){
 let prefix='info_book.'+ns+'.';
 for(let key of Object.keys(cn).filter(k=>k.startsWith(prefix)&&!k.includes('.text')&&!/\.section\.|\.tag_|\.introduction$|\.tutorials$|\.basics$|\.advanced$/.test(k))){
  let keys=Object.keys(cn).filter(k=>k.startsWith(key+'.text')&&/^\d+$/.test(k.slice((key+'.text').length))).sort((a,b)=>Number(a.slice((key+'.text').length))-Number(b.slice((key+'.text').length)));
  if(!keys.length)continue;let text=keys.map(k=>clean(cn[k])).join('\n\n');if(text.length<50)continue;
  let stem=key.slice(prefix.length),last=stem.split('.').at(-1),snake=last.replace(/[A-Z]/g,m=>'_'+m.toLowerCase());
  let items=Object.keys(inv.items).filter(id=>owner.get(id.split(':')[0])===group&&(id.endsWith(':'+snake)||id.endsWith(':'+last))).slice(0,8);
  topic(group,ns+'-'+stem.replaceAll('.','-'),clean(cn[key]),text,keys.map(k=>clean(en[k]||'')).filter(Boolean).join('\n\n'),items,key);
 }
}
fs.writeFileSync(file,JSON.stringify(d,null,1));console.log(JSON.stringify({nativeTopics:topics,attachedSections:attached,totalEntries:d.entries.length}));
