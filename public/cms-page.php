<?php
declare(strict_types=1);
ini_set('display_errors','0');
header('Cache-Control: no-cache');
$request=parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
$kind=str_starts_with($request,'/events/')?'events':(str_starts_with($request,'/fighters/')?'fighters':(str_starts_with($request,'/articles/')?'articles':null));
$template=$kind?__DIR__.'/'.$kind.'/detail/index.html':__DIR__.'/index.html';
if(!is_file($template)){http_response_code(503);exit('Die Website wird gerade aktualisiert.');}
$html=file_get_contents($template);
try{
 require '/home/www/smashtime-private/bootstrap.php';$db=database();
 $rows=$db->query('SELECT published FROM st_content WHERE published IS NOT NULL')->fetchAll();$records=array_map(fn($r)=>json_decode($r['published'],true),$rows);
 $origin='http://s1110988816.online.de';
 if(!empty($_SERVER['HTTPS'])&&$_SERVER['HTTPS']!=='off')$origin='https://s1110988816.online.de';
 if($request==='/sitemap.xml'){
  header('Content-Type: application/xml; charset=utf-8');echo '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  foreach(['','events/','fighters/','about/','partners/','media/','contact/'] as $path)echo '<url><loc>'.$origin.'/'.$path.'</loc></url>';
  foreach($records as $r)if(in_array($r['kind'],['events','fighters','articles']))echo '<url><loc>'.htmlspecialchars($origin.'/'.$r['kind'].'/detail/?slug='.rawurlencode($r['slug']),ENT_XML1).'</loc></url>';
  echo '</urlset>';exit;
 }
 $record=null;foreach($records as $r)if(($kind&&$r['kind']===$kind&&$r['slug']===($_GET['slug']??''))||(!$kind&&$r['kind']==='settings')){$record=$r;break;}
 if($record){
  $d=$record['data'];$title=($kind?$d['name']:($d['seoTitle']??'SmashTime — The Night Is Ours')).($kind?' · SmashTime':'');$desc=$kind?($d['bio']??$d['description']??''):($d['seoDescription']??'Live Fight Entertainment. Events, Athleten und Geschichten aus der SmashTime-Arena.');
  $esc=fn($value)=>htmlspecialchars((string)$value,ENT_QUOTES,'UTF-8');
  $html=preg_replace('~<title>.*?</title>~s','<title>'.$esc($title).'</title>',$html);
  $html=preg_replace('~<meta name="description" content="[^"]*"/?\s*>~','',$html);
  $canonical=$origin.($kind?'/'.$kind.'/detail/?slug='.rawurlencode($record['slug']):'/');
  $meta='<meta name="description" content="'.$esc(mb_substr($desc,0,170)).'"/><link rel="canonical" href="'.$esc($canonical).'"/><meta property="og:title" content="'.$esc($title).'"/><meta property="og:description" content="'.$esc(mb_substr($desc,0,200)).'"/><meta property="og:url" content="'.$esc($canonical).'"/>';
  if(!empty($d['image']))$meta.='<meta property="og:image" content="'.$esc(str_starts_with($d['image'],'/')?$origin.$d['image']:$d['image']).'"/>';
  if($kind==='fighters')$meta.='<script type="application/ld+json">'.json_encode(['@context'=>'https://schema.org','@type'=>'Person','name'=>$d['name'],'description'=>$desc,'url'=>$canonical],JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT).'</script>';
  $html=str_replace('</head>',$meta.'</head>',$html);
 }elseif($kind){http_response_code(404);$html=str_replace('</head>','<meta name="robots" content="noindex"/></head>',$html);}
}catch(Throwable $e){error_log('SmashTime page: '.$e->getMessage());}
header('Content-Type: text/html; charset=utf-8');echo $html;
