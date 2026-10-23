import http from 'node:http';import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(process.argv[2]||'design/manual-20261020'),port=Number(process.argv[3]||1246);
http.createServer((req,res)=>{let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1)||'index.html';}catch{res.writeHead(400);res.end();return;}
 const target=path.resolve(root,name);if(!target.startsWith(root+path.sep)||!/^[-a-zA-Z0-9_.\/]+$/.test(name)||!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);res.end();return;}
 res.writeHead(200,{'Content-Type':{'.html':'text/html; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png'}[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(target).pipe(res);
}).listen(port,'127.0.0.1',()=>console.log('Manual preview http://127.0.0.1:'+port));
