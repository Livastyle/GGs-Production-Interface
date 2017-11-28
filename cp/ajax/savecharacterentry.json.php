<?php
header('Content-Type: application/json');

include("./ajaxloader.php");

$object = array(
	"success" => false
);

if($_POST['id'] == 0){
	$res = $sql->query("SELECT MAX(`position`)+1 AS `pos` FROM `characters` WHERE `game` = '".$sql->escape($_POST['game'])."'");
	$row = $sql->fetch($res);
	$cmd = "INSERT INTO `characters` (`id`,`name`,`short`,`game`,`position`) VALUES (NULL, '".$sql->escape($_POST['name'])."', '".$sql->escape($_POST['shortname'])."', '".$sql->escape($_POST['game'])."', '".$row['pos']."');";
	if($sql->query($cmd)){
		$charID = $sql->last_id();
		$object['insert_id'] = $charID;
		$object['success'] = true;
	}
}else{
	$cmd = "UPDATE `characters` SET `name` = '".$sql->escape($_POST['name'])."', `short` = '".$sql->escape($_POST['shortname'])."' WHERE `id` = '".$sql->escape($_POST['id'])."'";
	if($sql->query($cmd)){
		$object['updated_id'] = $_POST['id'];
		$object['success'] = true;
	}
}



echo json_encode ($object);

?>