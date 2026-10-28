import fs from 'node:fs/promises';
import Sftp from 'ssh2-sftp-client';
// Update only the isolated review API. Never reseed content or replace accounts.
const config=JSON.parse(await fs.readFile('ionos-deploy.local.json','utf8'));
const sftp=new Sftp();
try{
 await sftp.connect({host:config.host,username:config.username,port:config.port||22,privateKey:await fs.readFile(config.privateKeyPath)});
 const api=(await fs.readFile('public/api/index.php','utf8')).replaceAll('st_','st_review_').replace("$dir='/home/www/public/assets/uploads'","$dir='/home/www/smashtime-review/assets/uploads'");
 await sftp.put(Buffer.from(api),'/smashtime-review/api/index.php.uploading');
 await sftp.chmod('/smashtime-review/api/index.php.uploading',0o600);
 await sftp.posixRename('/smashtime-review/api/index.php.uploading','/smashtime-review/api/index.php');
 console.log('Isolated review API updated; contents and accounts retained.');
}finally{await sftp.end();}
