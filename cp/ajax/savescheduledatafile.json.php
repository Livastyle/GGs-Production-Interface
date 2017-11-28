<?php
header('Content-Type: application/json');

include("./ajaxloader.php");



$object = array(
	"success" => false,
	"path" => "./../../themes/".$_POST['theme']."/schedule-data.json",
	"list" => $_POST['list']
);


$object["success"] = (file_put_contents("./../../themes/".$_POST['theme']."/schedule-data.json", $_POST['list']) !== FALSE);

echo json_encode($object);

?>