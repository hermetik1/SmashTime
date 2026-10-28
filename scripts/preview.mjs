import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('out');
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.txt':'text/plain','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.ico':'image/x-icon','.woff2':'font/woff2'};
http.createServer(async(req,res)=>{
 if(process.env.SMASHTIME_PUBLIC_PREVIEW==='1'&&req.url.startsWith('/api/')){
  if(req.method!=='GET'||req.url!=='/api/index.php?action=public'){res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Diese lokale Vorschau zeigt nur öffentliche Inhalte.'}));return;}
  try{const upstream=await fetch('http://s1110988816.online.de/api/index.php?action=public');res.writeHead(upstream.status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(await upstream.text());}catch{res.writeHead(502,{'Content-Type':'application/json'});res.end('{}');}return;
 }
 const reviewUpload=process.env.SMASHTIME_PREVIEW_API_PORT==='18884'&&/^\/assets\/uploads\/[a-f0-9]{32}\.webp(?:\?.*)?$/.test(req.url);
 if(req.url.startsWith('/api/')||reviewUpload){const proxy=http.request({hostname:'127.0.0.1',port:Number(process.env.SMASHTIME_PREVIEW_API_PORT||18881),path:req.url,method:req.method,headers:req.headers},upstream=>{res.writeHead(upstream.statusCode,upstream.headers);upstream.pipe(res);});proxy.on('error',()=>{res.writeHead(502);res.end('{}');});req.pipe(proxy);return;}
 try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep)&&file!==root)throw new Error();const stat=await fs.stat(file);if(stat.isDirectory())file=path.join(file,'index.html');const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}
}).listen(Number(process.env.SMASHTIME_PREVIEW_PORT||3089),'127.0.0.1',()=>console.log('Production preview: http://localhost:'+(process.env.SMASHTIME_PREVIEW_PORT||3089)));

