<?php
header('Content-Type: application/json');
include("./ajaxloader.php");

$object = array(
	"success" => false,
	"teamid" => intval($_POST['id'])
);

if($object['teamid'] == 0)
	$cmd = "INSERT INTO `teams` (`id`,`name`,`prefix`) VALUES (NULL, '".$sql->escape($_POST['name'])."', '".$sql->escape($_POST['prefix'])."');";
else
	$cmd = "UPDATE `teams` SET `name` = '".$sql->escape($_POST['name'])."', `prefix` = '".$sql->escape($_POST['prefix'])."' WHERE `id` = '".$sql->escape($object['teamid'])."'";

if($sql->query($cmd))
	$object['success'] = true;

if($object['success'] AND $object['teamid']==0)
	$object['teamid'] = $sql->last_id();

echo json_encode ($object);
?>