<?php
header('Content-Type: application/json');

include("./ajaxloader.php");


$playerID = 0;

$object = array(
	"success" => false
);

$playerID = intval($_POST['id']);
if($playerID > 0){
	$cmd = "DELETE FROM `player` WHERE `id` = '".$sql->escape($playerID)."'";
	if($sql->query($cmd)){
		$object['success'] = true;
	}
}
$sql->query("DELETE FROM `player-teams` WHERE `pid` = '".$sql->escape($playerID)."'");

echo json_encode ($object);

?>