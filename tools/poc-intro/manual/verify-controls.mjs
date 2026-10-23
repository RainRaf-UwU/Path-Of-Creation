import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {Zip} from './zip.mjs';
import {topics} from './control-content.mjs';
const work=process.argv[2]||'D:/codex-work/manual-controls-20261020';
const localized=process.argv.includes('--localized');
const dataFile='tools/poc-intro/src/main/resources/assets/poc_intro/manual.json',data=JSON.parse(fs.readFileSync(dataFile));
const before=JSON.parse(fs.readFileSync(work+'/before-hashes.json')),build=JSON.parse(fs.readFileSync(work+'/build/build-result.json'));
if(!build.tests||!build.preview)throw Error('A tested build with previews is required');
const buildLog=fs.readFileSync(work+'/build.log','utf8'),manualAssertions=Number(buildLog.match(/PASS (\d+) manual assertions/)?.[1]),narrativeAssertions=Number(buildLog.match(/PASS (\d+) assertions: fresh-world/)?.[1]);
if(!manualAssertions||!narrativeAssertions||!buildLog.includes('PASS actual NBT')||!buildLog.includes('PASS installed bytecode'))throw Error('Incomplete offline test evidence');
const original=JSON.parse(fs.readFileSync(work+'/before/'+dataFile)),inv=JSON.parse(fs.readFileSync('D:/codex-work/manual-20261020/inventory.json'));
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const allowed=new Set(['ManualData.java','ManualUi.java','ManualScreen.java','ManualTest.java','ManualPreview.java']);
let protectedFiles=0,protectedIntro=0;
for(const [file,digest] of Object.entries(before)){
 if(file.startsWith('tools/poc-intro/manual/')||file==='mods/poc-intro-1.0.0.jar'||file===dataFile||localized&&file==='tools/poc-intro/README.md')continue;
 if(file.startsWith('tools/poc-intro/src/')&&allowed.has(path.basename(file)))continue;
 if(hash(fs.readFileSync(file))!==digest)throw Error('Unrelated file changed: '+file);
 protectedFiles++;if(file.startsWith('tools/poc-intro/src/'))protectedIntro++;
}
for(const e of data.entries){
 for(const id of e.items)if(!inv.items[id])throw Error('Unknown installed item: '+id);
 for(const key of e.controls||[])if(!data.keybinds[key])throw Error('Unknown key action: '+key);
 for(const picture of e.pictures||[])if(!data.pictures[picture])throw Error('Unknown picture: '+picture);
}
const bindingSnapshot=JSON.parse(fs.readFileSync(work+'/keybindings.json'));
for(const id of Object.keys(data.keybinds))if(!Object.hasOwn(bindingSnapshot,id))throw Error('No installed mapping evidence: '+id);
const archives=new Map(),mods=fs.readdirSync('mods'),sourceAudit=[];
for(const source of new Set(topics.flatMap(r=>r[8]).filter(s=>s.startsWith('installed:')))){
 const [ref,p='']=source.slice(10).split('!'),at=ref.search(/-\d/),base=(at<0?ref:ref.slice(0,at)).toLowerCase(),version=at<0?'':ref.slice(at+1);
 const jar=mods.find(n=>n.toLowerCase().includes(base)&&n.includes(version)&&n.endsWith('.jar'));if(!jar)throw Error('No source JAR: '+source);
 if(!archives.has(jar))archives.set(jar,new Zip('mods/'+jar));const zip=archives.get(jar);
 const paths=[...zip.entries.keys()].filter(k=>!p||k===p||k.startsWith(p+'/'));if(!paths.length)throw Error('No source resource: '+source);
 sourceAudit.push({source,jar,matchedResources:paths.length,sha256:p&&zip.entries.has(p)?hash(zip.read(p)):null});
}
const media=JSON.parse(fs.readFileSync('tools/poc-intro/manual/media-sources.json'));
if(localized){
 const coverage=JSON.parse(fs.readFileSync('tools/poc-intro/manual/other-mods-coverage.json'));
 for(const row of coverage.sources){let [jarName,p]=row.source.split('!');if(!archives.has(jarName))archives.set(jarName,new Zip('mods/'+jarName));const zip=archives.get(jarName);if(!zip.entries.has(p))throw Error('Missing expanded source: '+row.source);sourceAudit.push({entry:row.entry,source:row.source,sha256:hash(zip.read(p))});}
 for(const e of data.entries)if(!/[\u3400-\u9fff]/.test(e.zh))throw Error('Untranslated title: '+e.id);
}
for(const m of media.images){if(!archives.has(m.jar))archives.set(m.jar,new Zip('mods/'+m.jar));if(hash(archives.get(m.jar).read(m.path))!==m.sha256)throw Error('Image changed: '+m.resource);}
// Parse top-level quest objects without evaluating SNBT or accessing saves.
const quests=new Map();let edges=0;
for(const name of fs.readdirSync('config/ftbquests/quests/chapters').filter(n=>n.endsWith('.snbt'))){
 const text=fs.readFileSync('config/ftbquests/quests/chapters/'+name,'utf8'),start=text.indexOf('quests:');if(start<0)continue;
 let i=text.indexOf('[',start)+1,depth=0,quoted=false,escape=false,from=-1;
 for(;i<text.length;i++){
  const c=text[i];if(escape){escape=false;continue;}if(c==='\\'&&quoted){escape=true;continue;}if(c==='"'){quoted=!quoted;continue;}if(quoted)continue;
  if(c==='{'){if(depth===0)from=i;depth++;}else if(c==='}'){depth--;if(depth===0){
   const block=text.slice(from,i+1);let root='',level=0,array=0,q=false,esc=false;
   for(const ch of block){const visible=level===1&&array===0;if(esc){if(visible)root+=ch;esc=false;continue;}if(ch==='\\'&&q){if(visible)root+=ch;esc=true;continue;}if(ch==='"'){if(visible)root+=ch;q=!q;continue;}if(q){if(visible)root+=ch;continue;}if(visible)root+=ch;if(ch==='{')level++;if(ch==='}')level--;if(ch==='[')array++;if(ch===']')array--;}
   const id=root.match(/\bid:\s*"([0-9A-F]{16})"/)?.[1];if(!id)throw Error('Quest without ID: '+name);
   const dependencies=[...(block.match(/\bdependencies:\s*\[([^\]]*)\]/)?.[1]||'').matchAll(/"([0-9A-F]{16})"/g)].map(m=>m[1]);
   if(quests.has(id))throw Error('Duplicate quest: '+id);quests.set(id,dependencies);edges+=dependencies.length;
  }}else if(c===']'&&depth===0)break;
 }
}
for(const [id,deps] of quests)for(const dep of deps)if(!quests.has(dep))throw Error('Missing dependency '+id+' -> '+dep);
const done=new Set(),visiting=new Set();function visit(id){if(visiting.has(id))throw Error('Quest dependency cycle: '+id);if(done.has(id))return;visiting.add(id);quests.get(id).forEach(visit);visiting.delete(id);done.add(id);}quests.forEach((_,id)=>visit(id));
const jar=new Zip(build.jar);if(hash(fs.readFileSync(build.jar))!==build.sha256)throw Error('Build hash mismatch');
if(JSON.stringify(jar.json('assets/poc_intro/manual.json'))!==JSON.stringify(data))throw Error('Stale manual in JAR');
for(const [name] of jar.entries){if(/(?:Test|Preview|HookAudit)\.class$/.test(name))throw Error('Test class packaged: '+name);if(name.endsWith('.class')&&jar.read(name).readUInt16BE(6)!==65)throw Error('Wrong Java version: '+name);}
if(jar.entries.has('assets/poc_intro/keybindings.json'))throw Error('Personal bindings packaged');
for(const file of fs.readdirSync(work+'/build/manual-preview'))fs.copyFileSync(work+'/build/manual-preview/'+file,'design/manual-20261020/'+file);
fs.copyFileSync(dataFile,'design/manual-20261020/manual.json');fs.copyFileSync('tools/poc-intro/manual/preview.html','design/manual-20261020/index.html');
const html=fs.readFileSync('tools/poc-intro/manual/preview.html','utf8'),script=html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];fs.writeFileSync(work+'/preview-check.mjs',script);
let result=spawnSync(process.execPath,['--check',work+'/preview-check.mjs'],{encoding:'utf8',windowsHide:true});if(result.status)throw Error(result.stderr);
const http=[];for(const file of ['','manual.json','keybindings.json','20-controls.png','21-controls.png','24-controls.png',data.pictures[Object.keys(data.pictures).at(-1)].preview]){
 const response=await fetch('http://127.0.0.1:1246/'+file);if(!response.ok)throw Error('Preview HTTP: '+file);http.push({file,status:response.status});
}
const logs=Object.fromEntries(['startup','client','server'].map(kind=>[kind,fs.readFileSync('logs/kubejs/'+kind+'.log','utf8').match(/Loaded \d+\/\d+ KubeJS .*?with \d+ errors and \d+ warnings/)?.[0]]));
const oldEntries=new Map(original.entries.map(e=>[e.id,e]));
const localization=localized?JSON.parse(fs.readFileSync('tools/poc-intro/manual/localization-audit.json')):null;
const allowedRemoved=new Set(localization?.removed.map(e=>e.id)||[]);
for(const id of oldEntries.keys())if(!data.entries.some(e=>e.id===id)&&!allowedRemoved.has(id))throw Error('Existing entry was removed: '+id);
const report={date:'2026-10-20',jar:'mods/poc-intro-1.0.0.jar',bytes:fs.statSync(build.jar).size,sha256:build.sha256,groups:data.groups.length,entries:data.entries.length,operationGuides:data.entries.filter(e=>e.guide).length,newTutorials:topics.length,newEntries:data.entries.filter(e=>!oldEntries.has(e.id)).length,modifiedExistingEntries:data.entries.filter(e=>oldEntries.has(e.id)&&JSON.stringify(e)!==JSON.stringify(oldEntries.get(e.id))).length,keyActions:Object.keys(data.keybinds).length,entriesWithControls:data.entries.filter(e=>e.controls?.length).length,pictures:Object.keys(data.pictures).length,newPictures:Object.keys(data.pictures).filter(p=>!original.pictures[p]).length,illustratedEntries:data.entries.filter(e=>e.pictures?.length).length,protectedFilesUnchanged:protectedFiles,protectedIntroSourcesAndAudio:protectedIntro,questGraph:{quests:quests.size,dependencies:edges,missing:0,cycles:0},nativeSourceChecks:sourceAudit.length,imageSourceChecks:media.images.length,sourceAudit,preview:{url:'http://127.0.0.1:1246/',states:fs.readdirSync(work+'/build/manual-preview').filter(n=>n.endsWith('.png')).length,http,fontAndItemIcons:'offline approximations',keyNames:'preview-only snapshot; production resolves current KeyMapping'},tests:{compile:'Java 21',manualAssertions,narrativeAssertions,realNbtMigration:'pass',installedApiSignatures:'pass'},existingKubejsLogs:{baselineOnly:true,...logs},runtimeStarted:false,savesTouched:false,recipesChanged:false,questFilesChanged:false};
report.tests.manualAssertions=manualAssertions;report.tests.narrativeAssertions=narrativeAssertions;
if(localized){
 report.newTutorials=data.entries.filter(e=>e.guide&&!oldEntries.has(e.id)).length;
 report.localization={translatedTitles:data.entries.filter(e=>oldEntries.has(e.id)&&oldEntries.get(e.id).zh!==e.zh).length,removedModelAndInternalEntries:[...oldEntries.keys()].filter(id=>!data.entries.some(e=>e.id===id)).length,untranslatedTitles:0,audit:'localization-audit.json'};
 report.expandedGroups=[...new Set(data.entries.filter(e=>e.guide&&!oldEntries.has(e.id)).map(e=>e.group))];
}
report.preview.browserClickValidation=localized?'Not performed. PNGs use production ManualUi; HTTP and module syntax checked.':'Unavailable: only MCP Apps browser exposed, no tabs. PNGs use production ManualUi; HTTP and module syntax checked.';
fs.writeFileSync(work+'/verification.json',JSON.stringify(report,null,2));fs.writeFileSync('tools/poc-intro/manual/'+(localized?'localization-verification.json':'controls-verification.json'),JSON.stringify(report,null,2));
fs.writeFileSync('tools/poc-intro/manual/verification.json',JSON.stringify(report,null,2));
// Install only the verified build; retain the backed-up previous JAR.
fs.copyFileSync(build.jar,'mods/poc-intro-1.0.0.jar');if(hash(fs.readFileSync('mods/poc-intro-1.0.0.jar'))!==build.sha256)throw Error('Installed JAR mismatch');
console.log(JSON.stringify({...report,sourceAudit:undefined},null,2));
