import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const ffmpeg=process.argv[2];if(!ffmpeg)throw Error('Pass ffmpeg executable path');
const output=path.join(here,'src/main/resources/assets/poc_intro/sounds');fs.mkdirSync(output,{recursive:true});
const rate=44100,temp=fs.mkdtempSync(path.join(os.tmpdir(),'poc-intro-voice-'));
// The player has the initial hi from the user's hirari_02.wav. See assets/audio/.
// Runtime uses this exact sample at fixed pitch; it never rotates between vowels.
function tone(hz,duration){return Float64Array.from({length:Math.ceil(rate*duration)},(_,i)=>{
  const t=i/rate;return (Math.sin(2*Math.PI*hz*t)+.12*Math.sin(4*Math.PI*hz*t))*Math.sin(Math.PI*t/duration)**2;
});}
function write(name,samples,peak){
  const gain=peak/Math.max(...samples.map(Math.abs)),pcm=Buffer.alloc(samples.length*2),wav=Buffer.alloc(44+pcm.length);
  samples.forEach((s,i)=>pcm.writeInt16LE(Math.round(s*gain*32767),i*2));
  wav.write('RIFF');wav.writeUInt32LE(36+pcm.length,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(pcm.length,40);pcm.copy(wav,44);
  const input=path.join(temp,name+'.wav');fs.writeFileSync(input,wav);
  const result=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',input,'-ac','1','-c:a','libvorbis','-q:a','5',path.join(output,name+'.ogg')],{windowsHide:true,encoding:'utf8'});
  if(result.status!==0)throw Error(result.stderr);
}
try{
  const player=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',path.join(here,'assets/audio/player-hi.wav'),'-ac','1','-c:a','libvorbis','-q:a','5',path.join(output,'glyph_self.ogg')],{windowsHide:true,encoding:'utf8'});
  if(player.status!==0)throw Error(player.stderr);
  for(const old of ['glyph_self_e.ogg','glyph_self_i.ogg'])fs.rmSync(path.join(output,old),{force:true});
  write('glyph_system',tone(1160,.028),.55);write('select',tone(1420,.07),.4);
}finally{
  const resolved=fs.realpathSync(temp),parent=fs.realpathSync(os.tmpdir());
  if(path.dirname(resolved)!==parent||!path.basename(resolved).startsWith('poc-intro-voice-'))throw Error('Unexpected temporary sound directory');
  fs.rmSync(resolved,{recursive:true,force:true});
}
console.log('Encoded the fixed player hi sample; generated electronic system and selection sounds.');
