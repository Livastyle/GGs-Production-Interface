<?php
header('Content-Type: application/json');

include("./ajaxloader.php");

$object = array(
	"count" => 0,
	"list" => array()
);
$cmd = "SELECT * FROM `countries` ORDER BY `name` ASC";
$res = $sql->query($cmd);
$object["count"] = $sql->num_rows($res);
if($object["count"] > 0){
	while($row = $sql->fetch($res)){
		array_push($object["list"], $row);
	}
}
echo json_encode ($object);
?>