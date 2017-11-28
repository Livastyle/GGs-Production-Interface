<?php
header('Content-Type: application/json');

include("./ajaxloader.php");

$object = array(
	"count" => 0,
	"list" => array()
);

$cmd = "SELECT * FROM `thumbnails` ORDER BY `time` DESC";
$res = $sql->query($cmd);
$object["count"] = $sql->num_rows($res);
if($object["count"] > 0){
	while($row = $sql->fetch($res)){
		$row['timestamp'] = $row['time'];
		$row['date'] = date('d.m.', $row['timestamp']);
		$row['time'] = date('H:i', $row['timestamp']);
		array_push($object["list"], $row);
	}
}
echo json_encode ($object);
?>