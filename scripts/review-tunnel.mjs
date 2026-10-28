import fs from 'node:fs/promises';
import net from 'node:net';
import {Client} from 'ssh2';
const config=JSON.parse(await fs.readFile('ionos-deploy.local.json','utf8'));
const client=new Client();
client.on('ready',()=>{net.createServer(socket=>client.forwardOut('127.0.0.1',18884,'127.0.0.1',18883,(error,stream)=>{if(error){socket.destroy();return;}socket.pipe(stream);stream.pipe(socket);socket.on('error',()=>stream.destroy());stream.on('error',()=>socket.destroy());})).listen(18884,'127.0.0.1',()=>console.log('Private review tunnel ready on 127.0.0.1:18884'));});
client.on('error',error=>{console.error(error.message);process.exitCode=1;});
client.connect({host:config.host,username:config.username,port:config.port||22,privateKey:await fs.readFile(config.privateKeyPath)});
