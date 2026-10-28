<?php
declare(strict_types=1);
function database(): PDO {
 $path='/home/www/.smashtime.env';
 if (!is_file($path)) throw new RuntimeException('Server configuration missing');
 $env=parse_ini_file($path,false,INI_SCANNER_RAW);
 return new PDO('mysql:host='.$env['DB_HOST'].';port='.$env['DB_PORT'].';dbname='.$env['DB_NAME'].';charset=utf8mb4',$env['DB_USER'],$env['DB_PASSWORD'],[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_EMULATE_PREPARES=>false,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
}
