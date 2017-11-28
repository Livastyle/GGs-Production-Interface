<?php
header('Content-Type: application/json');

include("./ajaxloader.php");



$object = array(
	"success" => false,
	"count" => 0,
	"list" => array()
);

$vodIdList = array();
$cmd = "SELECT * FROM `vods` ORDER BY `time` DESC";
$res = $sql->query($cmd);
if($res){
	$object['count'] = $sql->num_rows($res);
	$object['success'] = true;
	while($row = $sql->fetch($res)){
		
		array_push($vodIdList, $row['id']);
		
		$row['p1']		= json_decode($row['p1'], true);
		$row['p2']		= json_decode($row['p2'], true);
		$row['c1']		= json_decode($row['c1'], true);
		$row['c2']		= json_decode($row['c2'], true);
		$row['casters']	= json_decode($row['casters'], true);
		$row['done']	= ($row['done'] == 1);
		$row['tnlist']	= array();
		array_push($object['list'], $row);
	}
}

$tnlist = array();
if(count($vodIdList) > 0){
	$cmd = "SELECT * FROM `thumbnails` WHERE `vod` IN(".implode(",", $vodIdList).") ORDER BY `time` DESC";
	$res = $sql->query($cmd);
	while($row = $sql->fetch($res)){	
		foreach($object['list'] as &$item){
			if($item['id'] == $row['vod']){
				array_push($item['tnlist'], $row);
			}
		}
	}
}

echo json_encode($object);

?>