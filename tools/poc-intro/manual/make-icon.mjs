import fs from 'node:fs';import path from 'node:path';import zlib from 'node:zlib';
const size=32,pixels=Buffer.alloc(size*size*4);
function rect(x,y,w,h,color){let c=Buffer.from(color.match(/../g).map(v=>parseInt(v,16)));for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)c.copy(pixels,(j*size+i)*4);}
rect(4,3,24,26,'172330ff');rect(5,2,21,26,'294459ff');rect(7,3,17,23,'102538ff');rect(4,3,3,24,'ddbb86ff');rect(7,26,18,3,'172330ff');rect(8,27,16,1,'b6d0d8ff');rect(24,4,2,23,'607987ff');
for(let y=7;y<=22;y++){let w=Math.max(1,6-Math.floor(Math.abs(y-14.5)*.65));rect(15-Math.floor(w/2),y,w,1,y<14?'b6f2eeff':'59cecaff');}rect(15,11,1,8,'e8eff1ff');
function crc(b){let n=0xffffffff;for(let v of b){n^=v;for(let i=0;i<8;i++)n=(n>>>1)^(n&1?0xedb88320:0);}return (n^0xffffffff)>>>0;}
function chunk(type,data){let t=Buffer.from(type),b=Buffer.alloc(data.length+12);b.writeUInt32BE(data.length);t.copy(b,4);data.copy(b,8);b.writeUInt32BE(crc(Buffer.concat([t,data])),b.length-4);return b;}
let ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(size);ihdr.writeUInt32BE(size,4);ihdr[8]=8;ihdr[9]=6;let scan=Buffer.alloc(size*(size*4+1));for(let y=0;y<size;y++)pixels.copy(scan,y*(size*4+1)+1,y*size*4,(y+1)*size*4);
let png=Buffer.concat([Buffer.from('89504e470d0a1a0a','hex'),chunk('IHDR',ihdr),chunk('IDAT',zlib.deflateSync(scan)),chunk('IEND',Buffer.alloc(0))]);
for(let output of ['tools/poc-intro/src/main/resources/assets/poc_intro/textures/item/tech_manual.png','tools/poc-intro/manual/assets/tech_manual.png']){fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,png);}console.log('Created 32×32 transparent book icon from code-native design');
