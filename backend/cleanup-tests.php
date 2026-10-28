<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli')exit;
require __DIR__.'/bootstrap.php';$db=database();
$ids=json_decode(file_get_contents(__DIR__.'/cleanup.local.json'),true,512,JSON_THROW_ON_ERROR);
$db->beginTransaction();$count=0;
foreach($ids as $id){$q=$db->prepare('SELECT draft FROM st_content WHERE id=?');$q->execute([$id]);$raw=$q->fetchColumn();if(!$raw)continue;$r=json_decode($raw,true);$name=$r['data']['name']??'';if(!str_starts_with($name,'Browserprüfung')&&!str_starts_with($name,'Verification')&&!str_starts_with($name,'Changed draft'))throw new RuntimeException('Refusing to remove non-test data');$db->prepare('DELETE FROM st_content WHERE id=?')->execute([$id]);$db->prepare('DELETE FROM st_audit WHERE entity=?')->execute([$id]);$count++;}
$db->commit();unlink(__DIR__.'/cleanup.local.json');echo 'Removed '.$count.' identified test records.'.PHP_EOL;
