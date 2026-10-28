import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import SftpClient from 'ssh2-sftp-client';
const config=JSON.parse(await fs.readFile('ionos-deploy.local.json','utf8'));
const credentials={email:'review-'+crypto.randomBytes(6).toString('hex')+'@example.test',password:crypto.randomBytes(30).toString('base64url')};
await fs.writeFile('backend/review.local.json',JSON.stringify(credentials));
const files={
 'api/index.php':(await fs.readFile('public/api/index.php','utf8')).replaceAll('st_','st_review_').replace("$dir='/home/www/public/assets/uploads'","$dir='/home/www/smashtime-review/assets/uploads'"),
 'schema.sql':(await fs.readFile('backend/schema.sql','utf8')).replaceAll('st_','st_review_'),
 'seed.json':await fs.readFile('backend/seed.json'),
 'reference.json':await fs.readFile('backend/reference-content.json'),
 'credentials.json':JSON.stringify(credentials),
 'router.php':`<?php $_SERVER['HTTPS']='on'; return false;`,
 'setup.php':`<?php
 if(PHP_SAPI!=='cli')exit(1);require '/home/www/smashtime-private/bootstrap.php';$db=database();
 $db->exec(file_get_contents(__DIR__.'/schema.sql'));$credentials=json_decode(file_get_contents(__DIR__.'/credentials.json'),true);
 $db->prepare('INSERT INTO st_review_admins(email,password_hash) VALUES(?,?)')->execute([$credentials['email'],password_hash($credentials['password'],PASSWORD_DEFAULT)]);
 $seed=json_decode(file_get_contents(__DIR__.'/seed.json'),true);$input=json_decode(file_get_contents(__DIR__.'/reference.json'),true);$map=[];
 foreach($seed as $r)$map[$r['id']]=$r;foreach($input['records'] as $r)$map[$r['id']]=$r;$map['website']['data']=array_replace($map['website']['data'],$input['settings']);
 foreach($map as $r){$r['updated_at']=gmdate('Y-m-d\\TH:i:s').'Z';$json=json_encode($r,JSON_UNESCAPED_UNICODE);$db->prepare('INSERT INTO st_review_content(id,kind,slug,draft,published,revision) VALUES(?,?,?,?,?,?) ON DUPLICATE KEY UPDATE draft=VALUES(draft),published=VALUES(published),revision=VALUES(revision)')->execute([$r['id'],$r['kind'],$r['slug'],$json,$r['status']==='published'?$json:null,$r['updated_at']]);}echo "Isolated review tables ready.\\n";`,
};
const sftp=new SftpClient();try{await sftp.connect({...config,privateKey:await fs.readFile(config.privateKeyPath)});await sftp.mkdir('/smashtime-review/api',true);await sftp.chmod('/smashtime-review',0o700);for(const [name,content] of Object.entries(files)){await sftp.put(Buffer.from(content),'/smashtime-review/'+name);await sftp.chmod('/smashtime-review/'+name,0o600);}console.log('Private isolated review prepared.');}finally{await sftp.end();}
