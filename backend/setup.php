<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli'){http_response_code(404);exit;}
require __DIR__.'/bootstrap.php';
$db=database();
$existing=$db->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
echo 'Existing tables: '.count($existing).PHP_EOL;
$db->exec(file_get_contents(__DIR__.'/schema.sql'));
$credentials=json_decode(file_get_contents(__DIR__.'/provision.local.json'),true,512,JSON_THROW_ON_ERROR);
$q=$db->prepare('SELECT id FROM st_admins WHERE email=?');$q->execute([$credentials['email']]);
if(!$q->fetchColumn()){$db->prepare('INSERT INTO st_admins(email,password_hash) VALUES(?,?)')->execute([$credentials['email'],password_hash($credentials['password'],PASSWORD_DEFAULT)]);echo 'Admin created.'.PHP_EOL;}else{echo 'Existing admin preserved.'.PHP_EOL;}
$seed=json_decode(file_get_contents(__DIR__.'/seed.json'),true,512,JSON_THROW_ON_ERROR);
$q=$db->prepare('INSERT IGNORE INTO st_content(id,kind,slug,draft,published,revision) VALUES(?,?,?,?,?,?)');
foreach($seed as $r){$json=json_encode($r,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);$q->execute([$r['id'],$r['kind'],$r['slug'],$json,$r['status']==='published'?$json:null,$r['updated_at']]);}
unlink(__DIR__.'/provision.local.json');
echo 'Database initialized; existing records preserved.'.PHP_EOL;
