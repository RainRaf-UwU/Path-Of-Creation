import fs from 'node:fs';
import zlib from 'node:zlib';
export class Zip {
  constructor(input){this.b=Buffer.isBuffer(input)?input:fs.readFileSync(input);this.entries=new Map();let p=this.b.length-22;while(p>=Math.max(0,this.b.length-65558)&&this.b.readUInt32LE(p)!==0x06054b50)p--;if(p<0)throw Error('ZIP directory missing');let n=this.b.readUInt16LE(p+10),off=this.b.readUInt32LE(p+16);for(let i=0;i<n;i++){if(this.b.readUInt32LE(off)!==0x02014b50)throw Error('Bad central directory');let len=this.b.readUInt16LE(off+28),extra=this.b.readUInt16LE(off+30),comment=this.b.readUInt16LE(off+32),name=this.b.toString('utf8',off+46,off+46+len);this.entries.set(name,{method:this.b.readUInt16LE(off+10),size:this.b.readUInt32LE(off+20),offset:this.b.readUInt32LE(off+42)});off+=46+len+extra+comment;}}
  read(name){let e=this.entries.get(name);if(!e)return null;let p=e.offset+30+this.b.readUInt16LE(e.offset+26)+this.b.readUInt16LE(e.offset+28),data=this.b.subarray(p,p+e.size);return e.method===0?data:zlib.inflateRawSync(data);}
  json(name){let b=this.read(name);return b?JSON.parse(b.toString('utf8').replace(/^\uFEFF/,'')):null;}
}
