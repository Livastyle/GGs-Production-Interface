<?php
header('Content-Type: application/json');

include("./ajaxloader.php");


$playerID = 0;

$object = array(
	"success" => false,
	"insert_id" => 0
);


if($_POST['id'] == 0){
	$cmd = "INSERT INTO `player` 
	(`id`, `nickname`, `smashgg`, `country`, `displayname`, `twitter`, `youtube`, `twitch`, `firstname`, `lastname`, `smashrankingeu`, `tafostats`, `teampartner`, `laststreamactivity`, `modify_time`) 
	VALUES 
	(NULL,'".$sql->escape($_POST['nickname'])."','".$sql->escape($_POST['smashgg'])."','".$sql->escape($_POST['country'])."','".$sql->escape($_POST['displayname'])."','".$sql->escape($_POST['twitter'])."','".$sql->escape($_POST['youtube'])."','".$sql->escape($_POST['twitch'])."','".$sql->escape($_POST['firstname'])."','".$sql->escape($_POST['lastname'])."','','0','0','".time()."','".time()."')";	
}else{
	$playerID = intval($_POST['id']);
	
	$cmd = "UPDATE `player` SET
	`nickname` = '".$sql->escape($_POST['nickname'])."',
	`smashgg` = '".$sql->escape($_POST['smashgg'])."',
	`displayname` = '".$sql->escape($_POST['displayname'])."',
	`firstname` = '".$sql->escape($_POST['firstname'])."',
	`lastname` = '".$sql->escape($_POST['lastname'])."',
	`twitter` = '".$sql->escape($_POST['twitter'])."',
	`twitch` = '".$sql->escape($_POST['twitch'])."',
	`youtube` = '".$sql->escape($_POST['youtube'])."',
	`country` = '".$sql->escape($_POST['country'])."',
	`modify_time` = '".time()."'
	WHERE `id` = '".$sql->escape($playerID)."'";
	
	
}
if($sql->query($cmd)){
	$object['success'] = true;
}
if($playerID == 0){
	$playerID = $sql->last_id();
	$object['insert_id'] = $playerID;
}


$sql->query("DELETE FROM `player-teams` WHERE `pid` = '".$sql->escape($playerID)."'");



if(isset($_POST['teams']) && count($_POST['teams']) > 0){
	$teamInsertValues = array();
	foreach($_POST['teams'] as $team){
		array_push($teamInsertValues, "('".$sql->escape($playerID)."','".$sql->escape($team['id'])."')");
	}
	$cmd = "INSERT INTO `player-teams` (`pid`,`tid`) VALUES ".implode(',', $teamInsertValues);
	
	$sql->query($cmd);
	
}

echo json_encode ($object);

?>