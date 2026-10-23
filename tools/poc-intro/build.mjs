import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import crypto from 'node:crypto';

const here=path.dirname(fileURLToPath(import.meta.url));
const args=process.argv.slice(2);
const option=(key,fallback)=>{const n=args.indexOf(key);return n<0?fallback:args[n+1];};
const jdk=option('--jdk');
if(!jdk)throw Error('Pass --jdk <Java 21 directory> and --classpath-file <safe javac argument file>');
const cpFile=option('--classpath-file',path.resolve(here,'../poc-cursor/build/javac.args'));
const cpLines=fs.readFileSync(cpFile,'utf8').split(/\r?\n/).map(s=>s.replace(/^"|"$/g,''));
const jei=fs.readdirSync(path.resolve(here,'../../mods')).find(n=>n.startsWith('[JEI')&&n.endsWith('.jar'));
if(!jei)throw Error('Installed JEI is required to compile the manual integration');
const mods=fs.readdirSync(path.resolve(here,'../../mods'));
const integrationLibraries=['ftb-quests-','ftb-teams-','ftb-library-','ExtendedCrafting-'].map(part=>{
  const name=mods.find(n=>n.includes(part)&&n.endsWith('.jar'));
  if(!name)throw Error('Missing installed integration: '+part);
  return path.resolve(here,'../../mods',name);
});
const classpath=[cpLines[cpLines.indexOf('-classpath')+1],path.resolve(here,'../../mods',jei),...integrationLibraries].join(path.delimiter);
if(!classpath||classpath.split(path.delimiter).some(p=>!fs.existsSync(p)))throw Error('Missing compile libraries');
const work=path.resolve(option('--work',path.join(os.tmpdir(),'poc-intro-build')));
fs.mkdirSync(work,{recursive:true});
const build=fs.mkdtempSync(path.join(work,'compile-'));
const classes=path.join(build,'classes');fs.mkdirSync(classes);
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(path.join(p,d.name)):[path.join(p,d.name)]);
const run=(tool,values)=>{
  const result=spawnSync(path.join(jdk,'bin',tool+(process.platform==='win32'?'.exe':'')),values,{cwd:work,windowsHide:true});
  if(result.stdout?.length)process.stdout.write(new TextDecoder(process.platform==='win32'?'gbk':'utf-8').decode(result.stdout));
  if(result.stderr?.length)process.stderr.write(new TextDecoder(process.platform==='win32'?'gbk':'utf-8').decode(result.stderr));
  if(result.error)throw result.error;
  if(result.status!==0)throw Error(tool+' exited with '+result.status);
};
const quote=value=>'"'+String(value).replaceAll('\\','/').replaceAll('"','\\"')+'"';
const sources=walk(path.join(here,'src/main/java')).filter(p=>p.endsWith('.java'));
const argfile=path.join(build,'javac.args');
fs.writeFileSync(argfile,['--release','21','-encoding','UTF-8','-proc:none','-classpath',classpath,'-d',classes,...sources].map(quote).join('\n'));
run('javac',['@'+argfile]);
fs.cpSync(path.join(here,'src/main/resources'),classes,{recursive:true});
// The editable KubeJS language files are the sole source for story wording.
// Package a generated fallback so offline previews and missing resource overrides still work.
const storyTranslations={};
for(const locale of ['zh_cn','en_us']){
  const language=JSON.parse(fs.readFileSync(path.resolve(here,'../../kubejs/assets/rain/lang',locale+'.json'),'utf8'));
  const entries=Object.fromEntries(Object.entries(language).filter(([key])=>key.startsWith('poc_intro.story.')));
  if(!Object.keys(entries).length||Object.values(entries).some(value=>typeof value!=='string'||!value.trim()))throw Error('Missing story translations: '+locale);
  storyTranslations[locale]=entries;
  const target=path.join(classes,'assets/poc_intro/lang',locale+'.json');
  const base=JSON.parse(fs.readFileSync(target,'utf8'));
  fs.writeFileSync(target,JSON.stringify({...base,...entries},null,2)+'\n');
}
if(JSON.stringify(Object.keys(storyTranslations.zh_cn).sort())!==JSON.stringify(Object.keys(storyTranslations.en_us).sort()))throw Error('Story language keys differ');
for(const name of ['story.json','chapter1.json']){
  const story=JSON.parse(fs.readFileSync(path.join(classes,'assets/poc_intro',name),'utf8'));
  const keys=[...story.nodes.flatMap(node=>[node.text,...(node.choices||[]).map(choice=>choice.text)]),...Object.values(story.labels)];
  for(const key of keys)for(const locale of ['zh_cn','en_us'])if(!storyTranslations[locale][key])throw Error('Missing '+locale+' translation: '+key);
}
const test=args.includes('--test'),preview=args.includes('--preview');
if(test||preview){
  const tests=path.join(build,'tests');fs.mkdirSync(tests);
  const files=walk(path.join(here,'src/test/java')).filter(p=>p.endsWith('.java'));
  const af=path.join(build,'test-javac.args');
  fs.writeFileSync(af,['--release','21','-encoding','UTF-8','-proc:none','-classpath',classes+path.delimiter+classpath,'-d',tests,...files].map(quote).join('\n'));
  run('javac',['@'+af]);
  const gson=classpath.split(path.delimiter).filter(p=>p.includes('/gson/')||p.includes('\\gson\\'));
  const testCp=[tests,classes,...gson].join(path.delimiter);
  if(test){
    run('java',['-ea','-Djava.awt.headless=true','-cp',testCp,'creation.intro.IntroTest']);
    run('java',['-ea','-Djava.awt.headless=true','-cp',testCp,'creation.intro.ChapterStoryTest']);
    for(const entry of ['IntroProgressTest','HookAudit'])run('java',['-ea','-Djava.awt.headless=true','-cp',[tests,classes,classpath].join(path.delimiter),'creation.intro.'+entry]);
    run('java',['-ea','-Djava.awt.headless=true','-cp',testCp,'creation.intro.ManualTest']);
  }
  if(preview)run('java',['-Djava.awt.headless=true','-cp',testCp,'creation.intro.PreviewMain',path.join(work,'preview'),option('--table-texture',path.join(work,'ultimate_table_top.png'))]);
  if(preview)run('java',['-Djava.awt.headless=true','-Dpoc.manual.images='+path.resolve(here,'../../design/manual-20261020'),'-Dpoc.manual.keybindings='+option('--manual-keys',''),'-cp',testCp,'creation.intro.ManualPreview',path.join(work,'manual-preview'),'live-data']);
}
fs.mkdirSync(path.join(classes,'META-INF/licenses'),{recursive:true});
fs.copyFileSync(path.resolve(here,'../../LICENSE'),path.join(classes,'META-INF/licenses/POC-LICENSE'));
const output=path.resolve(option('--output',path.join(work,'poc-intro-1.0.0.jar')));
run('jar',['--create','--file',output,'--date=2026-10-20T00:00:00Z','-C',classes,'.']);
const hash=crypto.createHash('sha256').update(fs.readFileSync(output)).digest('hex');
fs.writeFileSync(path.join(work,'build-result.json'),JSON.stringify({jar:output,size:fs.statSync(output).size,sha256:hash,classes,tests:test,preview},null,2));
console.log(JSON.stringify({jar:output,size:fs.statSync(output).size,sha256:hash}));
