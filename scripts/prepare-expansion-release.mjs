import fs from 'node:fs/promises';
import path from 'node:path';
import SftpClient from 'ssh2-sftp-client';
const config=JSON.parse(await fs.readFile('ionos-deploy.local.json','utf8'));
let count=0;
async function check(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory()){if(['node_modules','.git','backend','scripts','artifacts'].includes(entry.name))throw new Error('Private directory in export');await check(file);}else{if(/(?:\.env|\.pem$|\.local\.|credentials|provision)/i.test(entry.name))throw new Error('Private file in export');count++;}}}
await check('out');
const sftp=new SftpClient();try{
 await sftp.connect({...config,privateKey:await fs.readFile(config.privateKeyPath)});
 for(const file of ['import-reference.php','reference-content.json']){await sftp.fastPut('backend/'+file,'/smashtime-private/'+file);await sftp.chmod('/smashtime-private/'+file,0o600);}
 await sftp.fastPut('public/cms-page.php','/smashtime-private/cms-expansion-check.php');
 await sftp.fastPut('backend/bootstrap.php','/smashtime-review/bootstrap.php');
 await sftp.fastPut('backend/reference-content.json','/smashtime-review/reference-content.json');
 await sftp.put(Buffer.from((await fs.readFile('backend/import-reference.php','utf8')).replaceAll('st_','st_review_')),'/smashtime-review/import-reference.php');
 console.log(`Export checked: ${count} production files. Import and PHP metadata staged privately.`);
}finally{await sftp.end();}
