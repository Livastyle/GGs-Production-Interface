<?php
header('Content-Type: application/json');

include("./ajaxloader.php");


function insertCostume(&$charlist, $costume){
	foreach($charlist as $key => $character){
		if($costume['character'] == $character['id']){
			array_push($charlist[$key]['costumes'], $costume['name']);
			return;
		}
	}
}

$object = array(
	"count" => 0,
	"list" => array()
);

$characterIDs = array();



$cmd = "SELECT * FROM `characters` ".((isset($_POST['game']) && $_POST['game']>0) ? "WHERE `game` = '".$sql->escape($_POST['game'])."'" : "")." ORDER BY `position` ASC";
$res = $sql->query($cmd);
$object["count"] = $sql->num_rows($res);
if($object["count"] > 0){
	while($row = $sql->fetch($res)){
		$row['costumes'] = array();
		array_push($characterIDs, $row['id']);
		array_push($object["list"], $row);
	}
}
if(count($characterIDs) > 0){
	$cmd = "SELECT * FROM `character-costumes` WHERE `character` IN (".implode(',', $characterIDs).")";
	$res = $sql->query($cmd);
	if($sql->num_rows($res) > 0){
		while($row = $sql->fetch($res)){
			insertCostume($object["list"], $row);
		}
	}
}
echo json_encode ($object);
?>