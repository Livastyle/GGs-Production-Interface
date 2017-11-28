<?php
header('Content-Type: application/json');

include("./ajaxloader.php");

$object = array(
	"success" => false
);

if($_POST['id'] == 0){
	$cmd = "INSERT INTO `games` (`id`,`name`,`short`) VALUES (NULL, '".$sql->escape($_POST['name'])."', '".$sql->escape($_POST['shortname'])."');";
}else{
	$cmd = "UPDATE `games` SET `name` = '".$sql->escape($_POST['name'])."', `short` = '".$sql->escape($_POST['shortname'])."' WHERE `id` = '".$sql->escape($_POST['id'])."'";
}

if($sql->query($cmd)){
	$object['success'] = true;
}

echo json_encode ($object);

?>