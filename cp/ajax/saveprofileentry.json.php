<?php
header('Content-Type: application/json');

include("./ajaxloader.php");


$profileID = 0;

$object = array(
	"success" => false
);


file_put_contents("./../../theme.txt", $_POST['theme']);




$_POST['playlist'] = $sql->utf8encodeArray($_POST['playlist']);
$_POST['scoreboarddata'] = $sql->utf8encodeArray($_POST['scoreboarddata']);


//$object["scoreboarddata"] = $_POST['scoreboarddata'];
$_POST['scoreboarddata'] = json_encode($_POST['scoreboarddata']);
$_POST['playlist'] = json_encode($_POST['playlist']);

if(isset($_POST['id'])){
	$profileID = $_POST['id'];
}

if($profileID > 0){
	
	$cmd = "UPDATE `profile` SET
	`name` = '".$sql->escape($_POST['name'])."',
	`theme` = '".$sql->escape($_POST['theme'])."',
	`autoupdatetime` = '".$sql->escape($_POST['autoupdatetime'])."',
	`scoreboarddata` = '".$sql->escape($_POST['scoreboarddata'])."',
	`casinodata` = '".$sql->escape($_POST['casinodata'])."',
	`playlist` = '".$sql->escape($_POST['playlist'])."',
	`smashgg` = '".$sql->escape($_POST['smashgg'])."',
	`twitter` = '".$sql->escape($_POST['twitter'])."',
	`dest_xml` = ".$sql->escape($_POST['dest_xml']).",
	`dest_json` = ".$sql->escape($_POST['dest_json']).",
	`dest_curl` = ".$sql->escape($_POST['dest_curl']).",
	`dest_text` = ".$sql->escape($_POST['dest_text']).",
	`dest_websocket` = ".$sql->escape($_POST['dest_websocket'])."
	WHERE `id` = '".$sql->escape($profileID)."'";
	$object["cmd"] = $cmd;
	if($sql->query($cmd)){
		$object['success'] = true;
	}
}else{
	$cmd = "INSERT INTO `profile` (`id`, `name`, `active`, `theme`, `autoupdatetime`, `scoreboarddata`, `casinodata`, `playlist`, `smashgg`, `twitter`, `dest_xml`, `dest_json`, `dest_curl`, `dest_text`, `dest_websocket`) VALUES (NULL, '".$sql->escape($_POST['name'])."', '0', '".$sql->escape($_POST['theme'])."', '".$sql->escape($_POST['autoupdatetime'])."', '".$sql->escape($_POST['scoreboarddata'])."', '".$sql->escape($_POST['casinodata'])."', '".$sql->escape($_POST['playlist'])."', '".$sql->escape($_POST['smashgg'])."', '".$sql->escape($_POST['twitter'])."', '".$sql->escape($_POST['dest_xml'])."', '".$sql->escape($_POST['dest_json'])."', '".$sql->escape($_POST['dest_curl'])."', '".$sql->escape($_POST['dest_text'])."', '".$sql->escape($_POST['dest_websocket'])."')";
	if($sql->query($cmd)){
		$profileID = $sql->last_id();
		$object['success'] = true;
	}
}

$object['id'] = $profileID;

echo json_encode ($object);
?>