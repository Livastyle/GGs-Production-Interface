<?php
header('Content-Type: application/json');

$object = array(
	"count" => 0,
	"folder" => "./../../assets/music/",
	"list" => array()
);

$finfo = new finfo();
$list = scandir ($object['folder']);

foreach($list as &$val){
	if(is_file($object['folder'].$val) && substr($finfo->file($object['folder'].$val),0,10) == "Audio file"){
		array_push($object['list'], $val);
	}
}
$object['count'] = count($object['list']);
echo json_encode ($object);
?>