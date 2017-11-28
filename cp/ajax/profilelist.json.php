<?php
header('Content-Type: application/json');

include("./ajaxloader.php");

$object = array(
	"list" => array(),
	"count" => array(),
	"current" => null
);

$cmd = "SELECT * FROM `profile` ORDER BY `name` ASC";

$res = $sql->query($cmd);
$object['count'] = $sql->num_rows($res);
while($row = $sql->fetch($res)){
	if($row['active']==1){
		$object['current'] = $row;
	}
	array_push($object['list'], array(
		"id" => $row['id'],
		"name" => $row['name']
	));
}

// fix bool values
$boolVals = array("dest_xml","dest_json","dest_curl","dest_text","dest_websocket");
foreach($boolVals as $boolval){
	$object['current'][$boolval] = boolval($object['current'][$boolval]);
}



$object['current']['playlist'] = json_decode($object['current']['playlist'], true);
$object['current']['scoreboarddata'] = json_decode($object['current']['scoreboarddata'], true);

echo json_encode ($object);
?>