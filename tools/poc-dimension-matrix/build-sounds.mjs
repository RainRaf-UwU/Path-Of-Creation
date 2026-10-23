import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../..');
const ffmpeg=process.argv[2];if(!ffmpeg)throw Error('Pass ffmpeg executable path');
const out=path.join(here,'src/main/resources/assets/poc_dimension_matrix/sounds');
const preview=path.join(root,'design/dimension-matrix/audio');
const work=path.join(root,'.cache/dimension-matrix/audio-jei-20261023/audio');
for(const dir of [out,preview,work])fs.mkdirSync(dir,{recursive:true});
const rate=44100,tau=2*Math.PI;
function wav(file,samples){
  const b=Buffer.alloc(44+samples.length*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);
  b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(samples.length*2,40);
  samples.forEach((v,i)=>b.writeInt16LE(Math.round(Math.max(-1,Math.min(1,v))*32767),44+i*2));fs.writeFileSync(file,b);
}
function encode(input,output){const r=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',input,'-ac','1','-c:a','libvorbis','-q:a','5',output],{windowsHide:true,encoding:'utf8'});if(r.status!==0)throw Error(r.stderr);}
const sine=(hz,t,phase=0)=>Math.sin(tau*hz*t+phase);
// 整数/半整数频率与2秒周期严格闭合；气流也由周期谐波合成，无随机接缝。
function rotor(t,mode){
  const fm=.28*sine(2.5,t),pulse=0.88+0.12*sine(9,t);
  const body=.48*sine(100,t,fm)+.28*sine(50,t)+.13*sine(300,t,.3*sine(7,t));
  let air=0;for(let n=0;n<23;n++)air+=sine(157+n*23,t,n*2.399963)/(35+n*3);
  const shimmer=.075*sine(1200,t,1.6*sine(3,t))*(.7+.3*sine(6.5,t));
  if(mode==='accelerate')return body*pulse+air+.045*sine(500,t,.5*sine(4,t));
  if(mode==='full_speed')return body*.88+air*1.7+shimmer+.08*sine(200,t,.35*sine(10,t));
  return body*.7+air*.6+.16*sine(150,t,.5*sine(1.5,t))+.06*sine(650,t)*(.5+.5*sine(5,t));
}
const clips={};let stats={sample_rate:rate,channels:1,origin:'Deterministic original procedural synthesis; no third-party audio samples.',clips:{}};
for(const name of ['power_on','accelerate','full_speed','decelerate','warning']){
  const duration=name==='warning'?.22:2;
  const samples=new Float64Array(Math.round(rate*duration));
  for(let i=0;i<samples.length;i++){
    const t=i/rate;
    if(name==='warning'){
      const envelope=Math.sin(Math.PI*t/duration)**2;
      samples[i]=envelope*(.7*sine(950,t)+.3*sine(1450,t))*(.75+.25*sine(18,t));
    }else if(name==='power_on'){
      const attack=Math.min(1,t/.025),tail=Math.sin(Math.PI*Math.min(1,t/2))**1.3;
      const charge=sine(170,t,2*Math.PI*220*t*t)*Math.exp(-1.7*t);
      const bass=Math.sin(tau*(90*t-17*t*t))*Math.exp(-2.8*t);
      const lock=(sine(600,t)+.45*sine(900,t)) * Math.exp(-40*(t-.72)**2);
      samples[i]=attack*(.45*charge+.5*bass+.13*lock)*tail;
    }else samples[i]=rotor(t,name);
  }
  let peak=0;for(const s of samples)peak=Math.max(peak,Math.abs(s));const gain=(name==='power_on'?.78:.65)/peak;
  for(let i=0;i<samples.length;i++)samples[i]*=gain;
  clips[name]=samples;
  const file=path.join(work,name+'.wav');wav(file,samples);encode(file,path.join(out,name+'.ogg'));
  const periodError=name==='power_on'||name==='warning'?0:Math.abs(rotor(2,name)-rotor(0,name));
  if(periodError>1e-10)throw Error('Nonperiodic loop '+name);
  stats.clips[name]={seconds:duration,peak:name==='power_on'?.78:.65,seam_step:Math.abs(samples[0]-samples[samples.length-1]),period_error:periodError};
}
// 试听顺序：通电0s、加速3–7s、最高速7–11s、减速11–14s。
const demo=new Float64Array(rate*15);let position=0;
const at=(samples,p)=>{const a=Math.floor(p)%samples.length,b=(a+1)%samples.length,f=p-Math.floor(p);return samples[a]*(1-f)+samples[b]*f;};
for(let i=0;i<demo.length;i++){
  const t=i/rate;if(t<2)demo[i]+=clips.power_on[i]*.65;
  if(t<3||t>=14)continue;
  const speed=t<7?(t-3)/4:t<11?1:Math.max(0,1-(t-11)/3);
  const name=t<7?'accelerate':t<11?'full_speed':'decelerate';
  position+=.65+.75*speed;
  const fade=Math.min(1,(t-3)/.2,(14-t)/.2),volume=.22+.35*Math.sqrt(speed);
  let signal=at(clips[name],position);
  if(t>=7&&t<7.2){const mix=(t-7)/.2;signal=at(clips.accelerate,position)*(1-mix)+signal*mix;}
  if(t>=11&&t<11.2){const mix=(t-11)/.2;signal=at(clips.full_speed,position)*(1-mix)+signal*mix;}
  demo[i]+=signal*fade*volume;
}
wav(path.join(preview,'dimension-matrix-audio-demo.wav'),demo);
encode(path.join(preview,'dimension-matrix-audio-demo.wav'),path.join(preview,'dimension-matrix-audio-demo.ogg'));
const alarmDemo=new Float64Array(rate*18);let next=0;
for(let tick=0;tick<18*20;tick++){
  const heat=.4+.6*tick/(18*20-1);if(tick<next)continue;
  const pitch=.7+heat,volume=.25+.7*heat;
  for(let i=0;i<clips.warning.length/pitch;i++){
    const index=Math.round(tick/20*rate)+i;if(index>=alarmDemo.length)break;
    const pos=i*pitch,a=Math.floor(pos),b=Math.min(a+1,clips.warning.length-1),f=pos-a;
    alarmDemo[index]+=(clips.warning[a]*(1-f)+clips.warning[b]*f)*volume;
  }next=tick+Math.round(60-55*(heat-.4)/.6);
}
wav(path.join(preview,'dimension-matrix-overheat-alarm.wav'),alarmDemo);
encode(path.join(preview,'dimension-matrix-overheat-alarm.wav'),path.join(preview,'dimension-matrix-overheat-alarm.ogg'));
fs.writeFileSync(path.join(work,'audio-report.json'),JSON.stringify(stats,null,2)+'\n');
console.log(JSON.stringify(stats));
