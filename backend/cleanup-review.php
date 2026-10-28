<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli')exit(1);
require '/home/www/smashtime-private/bootstrap.php';
$db=database();
// Fixed test-only table names. Production tables and accounts are never touched.
foreach(['st_review_audit','st_review_login_attempts','st_review_content','st_review_admins'] as $table)$db->exec('DROP TABLE IF EXISTS '.$table);
foreach(['credentials.json'] as $name){$file='/home/www/smashtime-review/'.$name;if(is_file($file))unlink($file);}
echo "Isolated review tables and credentials removed.\n";
