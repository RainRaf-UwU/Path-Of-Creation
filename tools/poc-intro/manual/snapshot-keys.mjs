// Preview-only. Read a previously filtered map, never package personal settings in the JAR.
import fs from 'node:fs';
const {keybinds}=JSON.parse(fs.readFileSync('tools/poc-intro/src/main/resources/assets/poc_intro/manual.json'));
const file=process.argv[2],out=process.argv[3];if(!file||!out)throw Error('snapshot-keys <filtered key_ JSON> <preview JSON>');
const raw=JSON.parse(fs.readFileSync(file));
const names={'unknown':'未分配','left.shift':'Shift','right.shift':'Right Shift','left.control':'Ctrl','right.control':'Right Ctrl','left.alt':'Alt','right.alt':'Right Alt','grave.accent':'`','backslash':'\\','up':'↑','down':'↓','left':'←','right':'→','space':'Space','tab':'Tab','equal':'+','minus':'-','page.up':'PageUp','page.down':'PageDown','backspace':'Backspace'};
const format=raw=>{if(!raw)return '未注册';let [key,modifier]=raw.split(':');key=key.replace(/^key.keyboard\./,'');return (modifier?({CONTROL:'Ctrl',ALT:'Alt',SHIFT:'Shift'}[modifier]||modifier)+' + ':'')+(names[key]||key.toUpperCase());};
fs.writeFileSync(out,JSON.stringify(Object.fromEntries(Object.keys(keybinds).map(key=>[key,format(raw[key])])),null,2));
console.log('Preview bindings: '+Object.keys(keybinds).length);
