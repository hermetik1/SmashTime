<?php
declare(strict_types=1);
ini_set('display_errors','0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function respond(array $data,int $status=200): never {http_response_code($status);echo json_encode($data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);exit;}
function fail(string $message,int $status=400): never {respond(['error'=>$message],$status);}
try {
 require '/home/www/smashtime-private/bootstrap.php';
 $db=database();$action=$_GET['action']??'public';$method=$_SERVER['REQUEST_METHOD'];
 if($action==='public'&&$method==='GET') { $rows=$db->query('SELECT published FROM st_content WHERE published IS NOT NULL')->fetchAll();respond(['published'=>array_map(fn($r)=>json_decode($r['published'],true),$rows)]); }
 if(empty($_SERVER['HTTPS'])||$_SERVER['HTTPS']==='off')fail('Für den Organisationsbereich ist eine sichere HTTPS-Verbindung erforderlich.',426);
 session_name('st_control');session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>true,'httponly'=>true,'samesite'=>'Strict']);ini_set('session.use_strict_mode','1');session_start();
 if(isset($_SESSION['last'])&&time()-$_SESSION['last']>3600){$_SESSION=[];session_regenerate_id(true);}
 $_SESSION['last']=time();$_SESSION['csrf']??=bin2hex(random_bytes(32));
 if($action==='session'&&$method==='GET')respond(['authenticated'=>isset($_SESSION['admin']),'csrf'=>$_SESSION['csrf']]);
 if($method==='POST') {
  if(!hash_equals($_SESSION['csrf'],$_SERVER['HTTP_X_CSRF_TOKEN']??''))fail('Sitzung abgelaufen. Bitte Seite neu laden.',403);
  if((int)($_SERVER['CONTENT_LENGTH']??0)>7500000)fail('Anfrage zu groß.',413);
  try{$input=json_decode(file_get_contents('php://input'),true,512,JSON_THROW_ON_ERROR);}catch(JsonException){fail('Ungültige Anfrage: Bitte ein gültiges JSON-Objekt senden.');}
  if(!is_array($input)||array_is_list($input)&&$input!==[])fail('Ungültige Anfrage.');
 }
 if($action==='login'&&$method==='POST'){
  $email=strtolower(trim((string)($input['email']??'')));$fingerprint=hash('sha256',($_SERVER['REMOTE_ADDR']??'').':'.$email);
  $q=$db->prepare('SELECT * FROM st_login_attempts WHERE fingerprint=?');$q->execute([$fingerprint]);$attempt=$q->fetch();
  if($attempt&&$attempt['attempts']>=8&&time()-(int)$attempt['last_attempt']<900)fail('Zu viele Anmeldeversuche. Bitte in 15 Minuten erneut versuchen.',429);
  $q=$db->prepare('SELECT id,password_hash FROM st_admins WHERE email=?');$q->execute([$email]);$user=$q->fetch();
  if(!$user||!password_verify((string)($input['password']??''),$user['password_hash'])){
   $count=$attempt&&time()-(int)$attempt['last_attempt']<900?(int)$attempt['attempts']+1:1;
   $q=$db->prepare('INSERT INTO st_login_attempts VALUES(?,?,?) ON DUPLICATE KEY UPDATE attempts=VALUES(attempts),last_attempt=VALUES(last_attempt)');$q->execute([$fingerprint,$count,time()]);fail('E-Mail oder Passwort ist nicht korrekt.',401);
  }
  $db->prepare('DELETE FROM st_login_attempts WHERE fingerprint=?')->execute([$fingerprint]);session_regenerate_id(true);$_SESSION['admin']=(int)$user['id'];$_SESSION['csrf']=bin2hex(random_bytes(32));respond(['ok'=>true,'csrf'=>$_SESSION['csrf']]);
 }
 if(!isset($_SESSION['admin']))fail('Bitte anmelden.',401);
 if($action==='logout'&&$method==='POST'){$_SESSION=[];session_destroy();respond(['ok'=>true]);}
 if($action==='records'&&$method==='GET'){
  $rows=$db->query('SELECT draft,published FROM st_content')->fetchAll();respond(['drafts'=>array_map(fn($r)=>json_decode($r['draft'],true),$rows),'published'=>array_values(array_map(fn($r)=>json_decode($r['published'],true),array_filter($rows,fn($r)=>$r['published']!==null)))]);
 }
 if($action==='audit'&&$method==='GET')respond(['items'=>$db->query('SELECT action,entity,created_at FROM st_audit ORDER BY id DESC LIMIT 100')->fetchAll()]);
 if($action==='delete'&&$method==='POST'){
  $id=$input['id']??'';
  if(!is_string($id)||!preg_match('/^[a-zA-Z0-9-]{1,100}$/',$id))fail('Ungültiger Eintrag.');
  $db->beginTransaction();
  $rows=$db->query('SELECT id,draft,published,revision FROM st_content ORDER BY id FOR UPDATE')->fetchAll();$target=null;
  foreach($rows as $row)if($row['id']===$id)$target=$row;
  if(!$target)fail('Eintrag nicht gefunden.',404);
  if($target['revision']!==($input['expected']??null))fail('Der Eintrag wurde zwischenzeitlich geändert. Bitte neu laden.',409);
  if(json_decode($target['draft'],true)['status']!=='archived'||$target['published']!==null)fail('Bitte den Eintrag zuerst archivieren.',409);
  foreach($rows as $row){if($row['id']===$id)continue;foreach(['draft','published'] as $version){if(!$row[$version])continue;$r=json_decode($row[$version],true);foreach(['event','featuredEvent','fighterA','fighterB','fighterA2','fighterB2','discipline'] as $key)if(($r['data'][$key]??null)===$id)fail('Der Eintrag wird noch verwendet. Bitte zuerst die Verknüpfungen entfernen.',409);}}
  $db->prepare('DELETE FROM st_content WHERE id=?')->execute([$id]);
  $db->prepare('INSERT INTO st_audit(admin_id,action,entity) VALUES(?,?,?)')->execute([$_SESSION['admin'],'delete',$id]);
  $db->commit();respond(['ok'=>true]);
 }
 if($action==='upload'&&$method==='POST'){
  $bytes=base64_decode((string)($input['content']??''),true);
  if($bytes===false||strlen($bytes)>5000000)fail('Das Bild darf maximal 5 MB groß sein.');
  $image=@getimagesizefromstring($bytes);$extensions=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp'];
  if(!$image||!isset($extensions[$image['mime']])||$image[0]*$image[1]>24000000)fail('Bitte ein gültiges JPG, PNG oder WebP mit maximal 24 Megapixeln auswählen.');
  $decoded=@imagecreatefromstring($bytes);if(!$decoded)fail('Bild konnte nicht verarbeitet werden.');
  $dir='/home/www/public/assets/uploads';if(!is_dir($dir))mkdir($dir,0755,true);
  $name=bin2hex(random_bytes(16)).'.webp';$width=imagesx($decoded);$height=imagesy($decoded);if($width>2000||$height>2400){$scale=min(2000/$width,2400/$height);$resized=imagescale($decoded,(int)($width*$scale),(int)($height*$scale));imagedestroy($decoded);$decoded=$resized;}
  if(!imagewebp($decoded,$dir.'/'.$name,85))fail('Upload fehlgeschlagen.',500);imagedestroy($decoded);respond(['url'=>'/assets/uploads/'.$name]);
 }
 if($action==='password'&&$method==='POST'){
  $q=$db->prepare('SELECT password_hash FROM st_admins WHERE id=?');$q->execute([$_SESSION['admin']]);
  if(!password_verify((string)($input['current']??''),$q->fetchColumn()))fail('Aktuelles Passwort ist falsch.',403);
  if(strlen((string)($input['next']??''))<10)fail('Bitte mindestens 10 Zeichen verwenden.');
  $db->prepare('UPDATE st_admins SET password_hash=? WHERE id=?')->execute([password_hash($input['next'],PASSWORD_DEFAULT),$_SESSION['admin']]);session_regenerate_id(true);respond(['ok'=>true]);
 }
 if($action==='reorder'&&$method==='POST'){
  $event=$input['event']??null;$ids=$input['ids']??null;$expected=$input['expected']??null;$publish=($input['publish']??false)===true;
  if(!is_string($event)||!is_array($ids)||!array_is_list($ids)||!$ids||count($ids)>200||!is_array($expected))fail('Ungültige Fightcard-Reihenfolge.');
  foreach($ids as $id)if(!is_string($id)||!preg_match('/^[a-zA-Z0-9-]{1,100}$/',$id))fail('Ungültiger Kampf.');
  if(count(array_unique($ids))!==count($ids))fail('Jeder Kampf darf nur einmal vorkommen.');
  $db->beginTransaction();$rows=$db->query('SELECT id,kind,draft,published,revision FROM st_content ORDER BY id FOR UPDATE')->fetchAll();$fights=[];$eventExists=false;
  foreach($rows as $row){$draft=json_decode($row['draft'],true);$public=$row['published']?json_decode($row['published'],true):null;
   if($row['id']===$event&&$row['kind']==='events'&&$draft['status']!=='archived')$eventExists=true;
   if($row['kind']!=='fightcards')continue;
   if($public&&($public['data']['event']??null)!==($draft['data']['event']??null)&&in_array($event,[$public['data']['event']??null,$draft['data']['event']??null],true))fail('Ein Kampf wechselt im Entwurf das Event. Bitte zuerst diese Änderung veröffentlichen.',409);
   if($draft['status']!=='archived'&&($draft['data']['event']??null)===$event)$fights[$row['id']]=$row;
  }
  if(!$eventExists)fail('Event nicht verfügbar.',404);
  if(count($ids)!==count($fights)||array_diff($ids,array_keys($fights)))fail('Die Fightcard wurde verändert. Bitte neu laden.',409);
  foreach($fights as $id=>$row)if(($expected[$id]??null)!==$row['revision'])fail('Ein Kampf wurde zwischenzeitlich bearbeitet. Bitte neu laden.',409);
  foreach($ids as $index=>$id){$row=$fights[$id];$draft=json_decode($row['draft'],true);$draft['data']['order']=$index+1;$draft['updated_at']=gmdate('Y-m-d\TH:i:s').sprintf('.%06dZ',(int)((microtime(true)-floor(microtime(true)))*1000000));$public=$row['published']?json_decode($row['published'],true):null;
   if($publish&&$public){$public['data']['order']=$index+1;$public['updated_at']=$draft['updated_at'];}
   if(!$publish&&$public)$draft['status']='draft';
   $db->prepare('UPDATE st_content SET draft=?,published=?,revision=? WHERE id=?')->execute([json_encode($draft,JSON_THROW_ON_ERROR),$public?json_encode($public,JSON_THROW_ON_ERROR):null,$draft['updated_at'],$id]);
   $db->prepare('INSERT INTO st_audit(admin_id,action,entity) VALUES(?,?,?)')->execute([$_SESSION['admin'],$publish?'reorder-publish':'reorder-draft',$id]);
  }
  $db->commit();respond(['ok'=>true]);
 }
 if($action==='save'&&$method==='POST'){
  $r=$input['record']??[];$publish=($input['publish']??false)===true;$kind=$r['kind']??'';$data=$r['data']??[];
  if(!in_array($kind,['fighters','events','disciplines','fightcards','partners','videos','articles','settings'],true)||!preg_match('/^[a-zA-Z0-9-]{1,100}$/',$r['id']??'')||!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/',$r['slug']??'')||strlen($r['slug'])>190||!is_array($data)||!is_string($data['name']??null)||trim($data['name'])==='')fail('Ungültiger Inhalt oder fehlender Name.');
  if(!in_array($r['status']??'',['draft','published','archived'],true))fail('Ungültiger Status.');
  foreach($data as $key=>$value){if(!is_scalar($value)||strlen((string)$value)>20000)fail('Ungültiges Inhaltsfeld.');if(in_array($key,['url','ticket','instagram','source'])&&$value&&!preg_match('~^https?://[^\s]+$~i',(string)$value))fail('Ungültige URL.');if(($key==='image'||str_ends_with($key,'PageImage'))&&$value&&!preg_match('~^(https?://[^\s]+|/assets/[a-zA-Z0-9/_.-]+)$~',(string)$value))fail('Ungültiger Bildpfad.');if(in_array($key,['wins','losses','draws','noContests','rounds','minutes','order','resultRound'])&&$value!==''&&(!ctype_digit((string)$value)))fail('Ungültige Zahl.');}
  foreach(['weight','priceAdvance','priceDoor'] as $decimal){if(isset($data[$decimal])&&$data[$decimal]!==''&&!preg_match('/^\d+(?:\.\d{1,2})?$/',(string)$data[$decimal]))fail('Gewicht und Preise benötigen nichtnegative Zahlen mit höchstens zwei Nachkommastellen.');}
  if($kind==='fightcards'){
   foreach(['format'=>['1 gegen 1','2 gegen 2'],'fightStatus'=>['Geplant','Abgeschlossen','Abgesagt'],'cardRole'=>['Hauptkampf','Co-Hauptkampf','Hauptprogramm','Vorkämpfe'],'resultOutcome'=>['Rote Ecke','Blaue Ecke','Unentschieden','No Contest'],'resultMethod'=>['KO','TKO','Submission','Punkte','Disqualifikation','Sonstiges']] as $key=>$values)if(!empty($data[$key])&&!in_array($data[$key],$values,true))fail('Ungültige Kampfauswahl.');
   $team=($data['format']??'')==='2 gegen 2';$participants=array_values(array_filter([$data['fighterA']??'',$data['fighterB']??'',...($team?[$data['fighterA2']??'',$data['fighterB2']??'']:[])]));
   if(count(array_unique($participants))!==count($participants))fail('Jeder Athlet darf nur einmal in einer Paarung vorkommen.');
   if(!$team&&(!empty($data['fighterA2'])||!empty($data['fighterB2'])))fail('Zusätzliche Athleten benötigen das Format 2 gegen 2.');
   $state=($data['fightStatus']??'')?:(!empty($data['resultConfirmed'])||!empty($data['result'])?'Abgeschlossen':'Geplant');
   if(isset($data['resultRound'])&&$data['resultRound']!==''&&((int)$data['resultRound']<1||(int)$data['resultRound']>(int)(($data['rounds']??'')?:15)))fail('Ergebnisrunde außerhalb der angesetzten Runden.');
   if(!empty($data['resultTime'])){if(!preg_match('/^\d{1,2}:[0-5]\d$/',(string)$data['resultTime']))fail('Ergebniszeit bitte als Minuten:Sekunden eingeben.');[$m,$s]=array_map('intval',explode(':',$data['resultTime']));if(empty($data['resultRound'])||$m*60+$s>(int)(($data['minutes']??'')?:10)*60)fail('Ergebniszeit benötigt eine Runde und muss innerhalb der Rundendauer liegen.');}
   if($state==='Abgesagt'&&(!empty($data['resultConfirmed'])||!empty($data['resultOutcome'])||!empty($data['result'])))fail('Ein abgesagter Kampf kann kein Ergebnis haben.');
   if(!empty($data['resultConfirmed'])&&(empty($data['resultOutcome'])||$state!=='Abgeschlossen'))fail('Bestätigte Ergebnisse benötigen einen Ausgang und den Status Abgeschlossen.');
   if($publish&&!empty($data['resultOutcome'])&&empty($data['resultConfirmed']))fail('Unbestätigte Ergebnisse bitte als Entwurf speichern.');
   if($publish&&$state==='Abgeschlossen'&&!(empty($data['resultOutcome'])?!empty($data['result']):!empty($data['resultConfirmed'])))fail('Bitte Ergebnis vor Veröffentlichung bestätigen.');
   if($publish&&!empty($data['result'])&&$state!=='Abgeschlossen')fail('Ein veröffentlichter Ergebnistext benötigt den Kampfstatus Abgeschlossen.');
   if(!empty($data['resultConfirmed'])&&$team&&count($participants)!==4)fail('Ein bestätigtes Teamergebnis benötigt alle vier Athleten.');
  }
  if($kind==='events'&&(!isset($data['date'])||!preg_match('/^\d{4}-\d{2}-\d{2}$/',$data['date'])))fail('Eventdatum fehlt.');
  if($kind==='events'){$date=DateTimeImmutable::createFromFormat('!Y-m-d',$data['date']);if(!$date||$date->format('Y-m-d')!==$data['date'])fail('Ungültiges Eventdatum.');foreach(['time','doors'] as $timeField){if(!empty($data[$timeField])&&!preg_match('/^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/',$data[$timeField]))fail('Ungültige Uhrzeit.');}}
  foreach(['rounds'=>15,'minutes'=>10] as $field=>$maximum){if(isset($data[$field])&&$data[$field]!==''&&((int)$data[$field]<1||(int)$data[$field]>$maximum))fail('Runden oder Dauer liegen außerhalb des gültigen Bereichs.');}
  if(!empty($data['email'])&&!filter_var($data['email'],FILTER_VALIDATE_EMAIL))fail('Ungültige Kontakt-E-Mail.');
  if($kind==='articles'&&(empty($data['body'])||empty($data['date'])))fail('Artikeltext und Datum fehlen.');
  foreach(['recordVerified','cancelled','showCountdown','titleFight','resultConfirmed'] as $booleanField)if(isset($data[$booleanField])&&!is_bool($data[$booleanField]))fail('Ungültiger Schalter.');
  foreach(['date','recordDate'] as $dateField){if(!empty($data[$dateField])){$dateCheck=DateTimeImmutable::createFromFormat('!Y-m-d',(string)$data[$dateField]);if(!$dateCheck||$dateCheck->format('Y-m-d')!==$data[$dateField])fail('Ungültiges Datum.');}}
  if($kind==='videos'&&empty($data['url']))fail('Video-URL fehlt.');
  if($kind==='settings'&&(empty($data['headline'])||empty($data['headline2'])))fail('Hero-Botschaft fehlt.');
  $db->beginTransaction();
  // Serialize editorial writes so reference validation cannot race another publication.
  $rows=$db->query('SELECT id,kind,draft,published,revision FROM st_content ORDER BY id FOR UPDATE')->fetchAll();$all=[];foreach($rows as $row)$all[$row['id']]=$row;
  $old=$all[$r['id']]??null;
  foreach($all as $row){
   if($row['id']===$r['id']||$row['kind']!==$kind)continue;
   if($kind==='settings')fail('Die Website-Einstellungen existieren bereits. Bitte den vorhandenen Eintrag bearbeiten.',409);
   foreach(['draft','published'] as $version){if($row[$version]&&json_decode($row[$version],true)['slug']===$r['slug'])fail('Diese URL-Kennung ist bereits vergeben.',409);}
  }
  if($old&&$old['kind']!==$kind)fail('Inhaltstyp darf nicht geändert werden.',409);
  if(($old['revision']??null)!==($input['expected']??null))fail('Der Eintrag wurde zwischenzeitlich geändert. Bitte neu laden.',409);
  foreach(['event'=>'events','featuredEvent'=>'events','fighterA'=>'fighters','fighterB'=>'fighters','fighterA2'=>'fighters','fighterB2'=>'fighters','discipline'=>'disciplines'] as $key=>$refKind){if(!empty($data[$key])){$ref=$all[$data[$key]]??null;if(!$ref||$ref['kind']!==$refKind||json_decode($ref['draft'],true)['status']==='archived')fail('Eine Verknüpfung ist nicht verfügbar.');if($publish&&$kind==='fightcards'&&$ref['published']===null)fail('Event, Athleten und Disziplin zuerst veröffentlichen.');}}
  if($kind==='fightcards'){
   if(empty($data['event'])||empty($data['fighterA'])||empty($data['fighterB'])||empty($data['discipline'])||$data['fighterA']===$data['fighterB']||(int)($data['order']??0)<1)fail('Paarung, Event, Disziplin und Position prüfen.');
   foreach($all as $row){
    if($row['id']===$r['id']||$row['kind']!=='fightcards')continue;
    foreach(['draft','published'] as $version){if(!$row[$version])continue;$other=json_decode($row[$version],true);if($r['status']!=='archived'&&$other['status']!=='archived'&&($other['data']['event']??'')===$data['event']&&(int)($other['data']['order']??0)===(int)$data['order'])fail('Diese Position ist bereits in einem Entwurf oder der öffentlichen Fightcard belegt.',409);}
   }
  }
  if($r['status']==='archived'){foreach($all as $row){if($row['id']===$r['id'])continue;foreach(['draft','published'] as $version){if(!$row[$version])continue;$ref=json_decode($row[$version],true);if($ref['status']!=='archived'&&in_array($r['id'],array_intersect_key($ref['data'],array_flip(['event','featuredEvent','fighterA','fighterB','fighterA2','fighterB2','discipline'])),true))fail('Der Eintrag wird noch verwendet.',409);}}}
  $r['updated_at']=gmdate('Y-m-d\TH:i:s').sprintf('.%06dZ',(int)((microtime(true)-floor(microtime(true)))*1000000));$r['status']=$publish?'published':$r['status'];$json=json_encode($r,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);$public=$r['status']==='archived'?null:($publish?$json:($old['published']??null));
  $q=$db->prepare('INSERT INTO st_content(id,kind,slug,draft,published,revision) VALUES(?,?,?,?,?,?) ON DUPLICATE KEY UPDATE slug=VALUES(slug),draft=VALUES(draft),published=VALUES(published),revision=VALUES(revision)');$q->execute([$r['id'],$kind,$r['slug'],$json,$public,$r['updated_at']]);
  $db->prepare('INSERT INTO st_audit(admin_id,action,entity) VALUES(?,?,?)')->execute([$_SESSION['admin'],$publish?'publish':$r['status'],$r['id']]);$db->commit();respond(['ok'=>true]);
 }
 fail('Unbekannte Aktion.',404);
}catch(Throwable $e){if(isset($db)&&$db->inTransaction())$db->rollBack();error_log('SmashTime API: '.$e->getMessage());fail('Serverfehler. Bitte erneut versuchen oder Serverprotokoll prüfen.',500);}
