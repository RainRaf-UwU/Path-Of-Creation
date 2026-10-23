import fs from 'node:fs';import path from 'node:path';import{spawnSync}from'node:child_process';import{root}from'./inventory.mjs';
const ffmpeg=process.argv[2];if(!ffmpeg)throw Error('Pass ffmpeg path');
const assets=path.join(root,'tools/poc-dimension-matrix/src/main/resources/assets/poc_dimension_matrix');
const dir=path.join(root,'design/multiblock-redesign-20261023/audio');fs.mkdirSync(dir,{recursive:true});
const rate=44100,tau=2*Math.PI;let report={};
const sine=(f,t)=>Math.sin(tau*f*t);
function wave(samples){const b=Buffer.alloc(44+samples.length*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(samples.length*2,40);samples.forEach((v,i)=>b.writeInt16LE(Math.round(Math.max(-1,Math.min(1,v))*32767),44+2*i));return b;}
const samples={};
for(const name of ['start','stop','mining','dyeing','fluid','inspector']){
 const duration=name==='start'?1.25:name==='stop'?.65:2;const s=new Float64Array(rate*duration);
 for(let i=0;i<s.length;i++){const t=i/rate;let v=0;
  if(name==='start'){const env=Math.sin(Math.PI*t/duration)**1.3;v=env*(.23*sine(90+180*t,t)+.12*sine(440,t)+.08*sine(880,t));}
  else if(name==='stop')v=Math.sin(Math.PI*t/duration)**2*(.22*sine(220-160*t,t)+.08*sine(95,t));
  else if(name==='mining')v=(.24*sine(65,t)+.12*sine(130,t)+.045*sine(1140,t))*(.8+.2*sine(8,t));
  else if(name==='dyeing')v=.13*sine(220,t)+.08*sine(330,t)+.065*sine(880,t)*(.5+.5*sine(3,t));
  else if(name==='fluid')v=.18*sine(80,t)+.07*sine(160,t)+.05*sine(480,t)*(.6+.4*sine(5,t));
  else v=.1*sine(600,t)*(.5+.5*sine(4,t))+.06*sine(900,t)+.05*sine(120,t);
  s[i]=v;
 }
 samples[name]=s;const wav=path.join(dir,'fx_'+name+'.wav'),ogg=path.join(assets,'sounds/fx_'+name+'.ogg');fs.writeFileSync(wav,wave(s));
 const r=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',wav,'-ac','1','-c:a','libvorbis','-q:a','5',ogg],{windowsHide:true});if(r.status)throw Error(r.stderr.toString());
 report[name]={duration,channels:1,sample_rate:rate,peak:Math.max(...s.filter((v,i)=>i%10===0).map(Math.abs)),loop:name!=='start'&&name!=='stop'};
}
const soundFile=path.join(assets,'sounds.json'),sounds=JSON.parse(fs.readFileSync(soundFile));for(const name of Object.keys(samples))sounds['fx_'+name]={subtitle:'subtitles.poc_dimension_matrix.fx_'+name,sounds:[{name:'poc_dimension_matrix:fx_'+name,attenuation_distance:32}]};fs.writeFileSync(soundFile,JSON.stringify(sounds,null,2)+'\n');
const labels={start:['多方块：系统启动','Multiblock system starting'],stop:['多方块：制动停机','Multiblock powering down'],mining:['虚空采矿机：相位钻掘','Void miner phase drilling'],dyeing:['染色工厂：光谱调制','Dyeing factory spectral modulation'],fluid:['流体处理机：反应循环','Fluid processor circulation'],inspector:['结构检测器：扫描','Structure inspector scanning']};
for(const[locale,ix]of[['zh_cn',0],['en_us',1]]){const p=path.join(assets,'lang',locale+'.json'),lang=JSON.parse(fs.readFileSync(p));for(const[name,label]of Object.entries(labels))lang['subtitles.poc_dimension_matrix.fx_'+name]=label[ix];fs.writeFileSync(p,JSON.stringify(lang,null,2)+'\n');}
// 每类一段9秒试听：启动、运行、停机；与游戏相同源音，离线示例音高固定。
const demo=new Float64Array(rate*36);let start=0;for(const family of ['mining','dyeing','fluid','inspector']){for(const[name,offset,len]of[['start',0,1.25],[family,1.5,5.5],['stop',7,.65]]){const clip=samples[name];for(let i=0;i<len*rate;i++)demo[Math.floor((start+offset)*rate)+i]+=clip[i%clip.length]*.7;}start+=9;}
const demoPath=path.join(dir,'machine-sound-preview.wav');fs.writeFileSync(demoPath,wave(demo));const r=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',demoPath,'-c:a','libvorbis','-q:a','5',path.join(dir,'machine-sound-preview.ogg')],{windowsHide:true});if(r.status)throw Error('encode failed');fs.writeFileSync(path.join(dir,'audit.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
