import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {root} from '../poc-machine-redesign/inventory.mjs';
const require=createRequire('C:/Users/44479/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/_poc.cjs');
const JSZip=require('jszip');
const dir=path.join(root,'design/machine-formed-20261023'),cache=path.join(root,'.cache/machine-formed');
const baseline=JSON.parse(fs.readFileSync(path.join(dir,'baseline.json'))),build=JSON.parse(fs.readFileSync(path.join(root,'.cache/dimension-matrix/build/build-result.json')));
const digest=data=>crypto.createHash('sha256').update(data).digest('hex');
const check=(v,message)=>{if(!v)throw Error(message);};
const changed=[],unchanged=[];
const allowed=new Set(['build.mjs','README.md','src/main/java/creation/matrix/MachineFx.java','src/main/java/creation/matrix/MachineFxRenderer.java','src/main/java/creation/matrix/MachineFxAudio.java','src/main/java/creation/matrix/mixin/MachineTileMixin.java','src/main/java/creation/matrix/mixin/MachineRendererMixin.java','src/main/resources/poc_dimension_matrix.mixins.json','src/test/java/creation/matrix/MixinAudit.java']);
for(const [file,hash]of Object.entries(baseline)){
 const now=digest(fs.readFileSync(path.join(root,file)));if(now===hash){unchanged.push(file);continue;}changed.push(file);
 check(file==='mods/poc-dimension-matrix-1.0.0.jar'||file.startsWith('tools/poc-dimension-matrix/')&&allowed.has(file.slice('tools/poc-dimension-matrix/'.length)),'Unexpected change: '+file);
}
check(build.tests,'Candidate has no completed test run');
const candidate=fs.readFileSync(build.output);check(digest(candidate)===build.sha256,'Candidate differs from tested build');
if(process.argv.includes('--installed'))check(digest(fs.readFileSync(path.join(root,'mods/poc-dimension-matrix-1.0.0.jar')))===build.sha256,'Installed JAR is stale');
const oldJar=await JSZip.loadAsync(fs.readFileSync(path.join(dir,'backup/mods/poc-dimension-matrix-1.0.0.jar')),{checkCRC32:true}),jar=await JSZip.loadAsync(candidate,{checkCRC32:true});
let resourceCount=0,preservedClasses=0;
for(const [name,entry]of Object.entries(oldJar.files)){
 if(entry.dir)continue;check(jar.file(name),'Missing JAR entry: '+name);
 if(name==='poc_dimension_matrix.mixins.json')continue;
 if(name.endsWith('.class')){if(name.startsWith('creation/matrix/MachineFx')||/creation\/matrix\/mixin\/Machine(Tile|Renderer)Mixin\./.test(name))continue;preservedClasses++;}else resourceCount++;
 check(Buffer.compare(await entry.async('nodebuffer'),await jar.file(name).async('nodebuffer'))===0,'Changed protected JAR entry: '+name);
}
let classes=0;for(const [name,entry]of Object.entries(jar.files)){if(entry.dir||!name.endsWith('.class'))continue;const bytes=await entry.async('nodebuffer');check(bytes.readUInt16BE(6)===65,'Not Java21: '+name);check(!/(?:Test|Audit|Export|Preview)\b/.test(name),'Test class in runtime JAR: '+name);classes++;}
for(const common of ['MachineFx','FormationMask','FormedMachineScene'])for(const name of Object.keys(jar.files).filter(n=>n==='creation/matrix/'+common+'.class'||n.startsWith('creation/matrix/'+common+'$')&&n.endsWith('.class'))){const bytes=await jar.file(name).async('nodebuffer');check(!bytes.toString('latin1').includes('net/minecraft/client/'),'Client link in common class: '+name);}
const config=JSON.parse(await jar.file('poc_dimension_matrix.mixins.json').async('string'));for(const name of ['AssemblyBlockRenderMixin','AssemblyEntityRenderMixin','AssemblySodiumBlockMixin','AssemblySodiumFluidMixin'])check(config.client.includes(name)&&jar.file('creation/matrix/mixin/'+name+'.class'),'Missing masking mixin '+name);
const layouts=JSON.parse(fs.readFileSync(path.join(root,'kubejs/data/rain/machine_redesign/structures.json'))).filter(l=>l.family!=='inspector'&&l.effect!=='time');
check(layouts.length===8,'Production scope');const animations={};
for(const l of layouts){for(const suffix of ['before.png','formed.png','running.png','assembly.gif'])check(fs.statSync(path.join(dir,'previews',l.id+'-'+suffix)).size>1000,'Missing visual '+l.id+suffix);
 const r=spawnSync('E:/minecraft/ffmpeg-9.0.2-essentials_build/bin/ffprobe.exe',['-v','error','-count_frames','-show_entries','stream=width,height,nb_read_frames:format=duration','-of','json',path.join(dir,'previews',l.id+'-assembly.gif')],{windowsHide:true,encoding:'utf8'});check(r.status===0,r.stderr);const info=JSON.parse(r.stdout);check(+info.streams[0].nb_read_frames===64&&Math.abs(+info.format.duration-8)<.02,'Incomplete animation '+l.id);animations[l.id]=info;
}
let noSodium=false;
if(process.argv.includes('--no-sodium')){
 const args=fs.readFileSync(path.join(build.build,'javac-tests.args'),'utf8').trim().split(/\r?\n/).map(JSON.parse),cp=args[args.indexOf('-classpath')+1].split(path.delimiter).filter(p=>!path.basename(p).includes('sodium-neoforge-')).join(path.delimiter),tests=path.join(build.build,'tests');
 const r=spawnSync('C:/Users/44479/.jdks/loom-ea-25-loom+1-11/bin/java.exe',['-ea','-Djava.awt.headless=true','-cp',tests+path.delimiter+cp,'creation.matrix.MixinAudit',path.join(cache,'no-sodium-transformed')],{cwd:cache,windowsHide:true,encoding:'utf8'});fs.writeFileSync(path.join(cache,'no-sodium-audit.log'),r.stdout+'\n'+r.stderr);check(r.status===0,'No-Sodium transform failed; see cache log');check((r.stdout.match(/PASS real Mixin transform:/g)||[]).length===4&&(r.stdout.match(/SKIP optional Sodium class:/g)||[]).length===2,'Incomplete optional mod audit');noSodium=true;
}
const oldReport=fs.existsSync(path.join(dir,'verification.json'))?JSON.parse(fs.readFileSync(path.join(dir,'verification.json'))):{};
const report={sha256:build.sha256,jarBytes:candidate.length,java21Classes:classes,preservedJarResources:resourceCount,preservedJarClasses:preservedClasses,baselineFiles:Object.keys(baseline).length,changed,unchanged:unchanged.length,productionModels:layouts.map(l=>l.id),animations,completedBuild:build.build,nativeMixinTargets:6,noSodiumAudit:noSodium||oldReport.noSodiumAudit||false,installed:process.argv.includes('--installed'),gameLaunched:false,worldBlocksReplaced:false,scope:'Only visual formation and functional machinery animation; dimension matrix, raw structures, recipes, quests and BG templates unchanged this revision; abandoned inspector excluded'};
fs.writeFileSync(path.join(dir,'verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({...report,animations:Object.keys(animations)},null,2));
