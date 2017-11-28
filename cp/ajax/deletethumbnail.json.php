<?php
header('Content-Type: application/json');

include("./ajaxloader.php");


$object = array(
	"success" => false
);


$cmd = "SELECT * FROM `thumbnails` WHERE `id` IN(".implode(',', $_POST['idlist']).")";
$res = $sql->query($cmd);
while($row = $sql->fetch($res)){
	if(file_exists("./../../".$row['filename']))
		unlink("./../../".$row['filename']);
	
	if(file_exists("./../../".$row['tn_filename']))
		unlink("./../../".$row['tn_filename']);
}

$cmd = "DELETE FROM `thumbnails` WHERE `id` IN(".implode(',', $_POST['idlist']).")";
if($sql->query($cmd)){
	$object['success'] = true;
}

echo json_encode ($object);
?>