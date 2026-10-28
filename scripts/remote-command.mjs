import fs from 'node:fs/promises';
import {Client} from 'ssh2';
const config=JSON.parse(await fs.readFile('ionos-deploy.local.json','utf8'));
const client=new Client();
const command=process.argv[2];
if(!command)throw new Error('A fixed remote command is required.');
client.on('ready',()=>client.exec(command,(error,stream)=>{
 if(error){client.end();throw error;}
 stream.on('data',data=>process.stdout.write(data));stream.stderr.on('data',data=>process.stderr.write(data));
 stream.on('close',code=>{client.end();process.exitCode=code;});
}));
client.on('error',error=>{console.error(error.message);process.exitCode=1;});
client.connect({host:config.host,username:config.username,port:config.port||22,privateKey:await fs.readFile(config.privateKeyPath)});
