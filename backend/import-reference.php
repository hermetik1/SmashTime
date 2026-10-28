<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli')exit(1);
require __DIR__.'/bootstrap.php';
$db=database();$input=json_decode(file_get_contents(__DIR__.'/reference-content.json'),true,512,JSON_THROW_ON_ERROR);
$db->beginTransaction();
try{
 $rows=$db->query('SELECT * FROM st_content ORDER BY id FOR UPDATE')->fetchAll();
 // Keep a private full snapshot before touching the editorial data.
 $backup=__DIR__.'/before-reference-'.gmdate('Ymd-His').'.json';file_put_contents($backup,json_encode($rows,JSON_THROW_ON_ERROR));chmod($backup,0600);
 $existing=[];foreach($rows as $row)$existing[$row['id']]=$row;
 $records=$input['records'];
 if(isset($existing['website'])){$settings=json_decode($existing['website']['draft'],true);$settings['data']=$input['settings'];$records[]=$settings;}
 $count=0;
 foreach($records as $record){
  $old=$existing[$record['id']]??null;
  $patch=$record['data'];$draft=$old?json_decode($old['draft'],true):$record;
  $public=$old&&$old['published']?json_decode($old['published'],true):$record;
  $revision=gmdate('Y-m-d\TH:i:s').sprintf('.%06dZ',(int)((microtime(true)-floor(microtime(true)))*1000000));
  $public['data']=array_replace($public['data'],$patch);$public['status']='published';$public['updated_at']=$revision;
  $draft['data']=array_replace($draft['data'],$patch);$draft['updated_at']=$revision;
  $draft['status']=$draft['data']===$public['data']?'published':'draft';
  $json=json_encode($draft,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);$publicJson=json_encode($public,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);
  $db->prepare('INSERT INTO st_content(id,kind,slug,draft,published,revision) VALUES(?,?,?,?,?,?) ON DUPLICATE KEY UPDATE draft=VALUES(draft),published=VALUES(published),revision=VALUES(revision)')->execute([$record['id'],$record['kind'],$record['slug'],$json,$publicJson,$revision]);
  $db->prepare('INSERT INTO st_audit(admin_id,action,entity) VALUES(?,?,?)')->execute([0,'reference-import',$record['id']]);$count++;
 }
 $db->commit();echo "Imported $count records. Private snapshot saved.\n";
}catch(Throwable $e){$db->rollBack();throw $e;}
