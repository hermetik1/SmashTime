<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli')exit(1);
require __DIR__.'/bootstrap.php';$db=database();$db->beginTransaction();
try{
 $q=$db->prepare('SELECT * FROM st_content WHERE id=? FOR UPDATE');$q->execute(['website']);$row=$q->fetch();if(!$row)throw new RuntimeException('Website settings missing');
 $backup=__DIR__.'/before-cinema-hero-'.gmdate('Ymd-His').'.json';file_put_contents($backup,json_encode($row,JSON_THROW_ON_ERROR));chmod($backup,0600);
 $revision=gmdate('Y-m-d\TH:i:s').sprintf('.%06dZ',(int)((microtime(true)-floor(microtime(true)))*1000000));$changed=false;
 foreach(['draft','published'] as $key){if(!$row[$key])continue;$r=json_decode($row[$key],true);if(($r['data']['image']??'')==='/assets/pages/heroes/events-hero-v1.webp'){$r['data']['image']='/assets/home/cinema/hero-arena-v2.webp';$changed=true;}if($key==='draft')$r['updated_at']=$revision;$row[$key]=json_encode($r,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);}
 if($changed){$db->prepare('UPDATE st_content SET draft=?,published=?,revision=? WHERE id=?')->execute([$row['draft'],$row['published'],$revision,'website']);$db->prepare('INSERT INTO st_audit(admin_id,action,entity) VALUES(?,?,?)')->execute([0,'hero-update','website']);}
 $db->commit();echo $changed?"Hero background updated; other editorial fields preserved.\n":"A custom hero background is already set; preserved.\n";
}catch(Throwable $e){$db->rollBack();throw $e;}
