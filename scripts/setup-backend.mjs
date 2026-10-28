import fs from 'node:fs/promises';
import SftpClient from 'ssh2-sftp-client';
const config=JSON.parse(await fs.readFile('ionos-deploy.local.json','utf8'));
const sftp=new SftpClient();
try {
 await sftp.connect({host:config.host,username:config.username,port:config.port||22,privateKey:await fs.readFile(config.privateKeyPath)});
 await sftp.mkdir('/smashtime-private',true);
 await sftp.chmod('/smashtime-private',0o700);
 if(!await sftp.exists('/.smashtime.env')){await sftp.fastPut('.env.server.local','/.smashtime.env');await sftp.chmod('/.smashtime.env',0o600);}
 for(const file of ['bootstrap.php','schema.sql','setup.php','seed.json','provision.local.json']){await sftp.fastPut(`backend/${file}`,`/smashtime-private/${file}`);await sftp.chmod(`/smashtime-private/${file}`,0o600);}
 await sftp.mkdir('/smashtime-staging/api',true);
 await sftp.fastPut('public/api/index.php','/smashtime-staging/api/index.php');
 console.log('Private backend files staged. No credentials printed.');
}finally{await sftp.end();}
