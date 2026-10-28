import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {Client} from 'ssh2';
import SftpClient from 'ssh2-sftp-client';
const config=JSON.parse(await fs.readFile('ionos-deploy.local.json','utf8'));
const connection={host:config.host,username:config.username,port:config.port||22,privateKey:await fs.readFile(config.privateKeyPath)};
const inventory=await new Promise((resolve,reject)=>{const client=new Client();client.on('error',reject);client.on('ready',()=>client.exec('cd /home/www/public && find . -type f -exec sha256sum {} +',(error,stream)=>{if(error){client.end();reject(error);return;}let output='';stream.on('data',data=>output+=data);stream.on('close',code=>{client.end();if(code)reject(new Error('Remote checksum inventory failed'));else resolve(output);});}));client.connect(connection);});
const remote=new Map(inventory.split('\n').filter(Boolean).map(line=>[line.slice(66).replace(/^\.\//,''),line.slice(0,64)]));
const target='artifacts/cinema-export-'+Date.now();let changed=0,unchanged=0;
async function walk(dir,relative=''){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const rel=path.posix.join(relative,entry.name);const from=path.join(dir,entry.name);if(entry.isDirectory()){if(['node_modules','backend','scripts','artifacts','.git'].includes(entry.name))throw new Error('Private folder in export');await walk(from,rel);continue;}if(!entry.isFile())continue;if(/(?:\.env|\.pem$|\.local\.|credentials|provision)/i.test(entry.name))throw new Error('Private file in export');const data=await fs.readFile(from);const hash=crypto.createHash('sha256').update(data).digest('hex');if(remote.get(rel)===hash){unchanged++;continue;}const dest=path.join(target,rel);await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,data);changed++;}}
await walk('out');await fs.writeFile('artifacts/cinema-upload-path.txt',target);
const sftp=new SftpClient();try{await sftp.connect(connection);await sftp.fastPut('backend/update-cinema-hero.php','/smashtime-private/update-cinema-hero.php');await sftp.chmod('/smashtime-private/update-cinema-hero.php',0o600);}finally{await sftp.end();}
console.log(JSON.stringify({source:target,changed,unchanged}));
