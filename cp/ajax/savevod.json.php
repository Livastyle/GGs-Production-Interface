<?php
header('Content-Type: application/json');

include("./ajaxloader.php");



$object = array(
	"success" => false,
	"vod" => ""
);

$vod = $_POST['vod'];


$c1 = array();
foreach($vod['p1'] as $p){
	$c1[$p] = array();
	foreach($vod['chars'][$p] as $c){
		array_push($c1[$p], $c);
	}
}

$c2 = array();
foreach($vod['p2'] as $p){
	$c2[$p] = array();
	foreach($vod['chars'][$p] as $c){
		array_push($c2[$p], $c);
	}
}

$casters = array();

// make them DB friendly (json)
$p1 =		json_encode($vod['p1']);
$p2 =		json_encode($vod['p2']);
$c1 =		json_encode($c1);
$c2 =		json_encode($c2);
$casters =	((isset($vod['casters']) && is_array($vod['casters'])) ? json_encode($vod['casters']) : "[]");
$done = 	($vod['done']=="true" ? 1 : 0);
if($vod['id'] == 0){
	$cmd = "INSERT INTO `vods` (`id`,`yt`,`smashgg_setid`,`game`,`p1`,`p2`,`c1`,`c2`,`round`,`casters`,`time`,`done`,`file`,`event`) VALUES (NULL,'".$sql->escape($vod['yt'])."','".$sql->escape($vod['smashgg_setid'])."','".$sql->escape($vod['game'])."','".$sql->escape($p1)."','".$sql->escape($p2)."','".$sql->escape($c1)."','".$sql->escape($c2)."','".$sql->escape($vod['round'])."','".$sql->escape($casters)."','".time()."','".$done."','".$sql->escape($vod['file'])."','".$sql->escape($vod['event'])."');";
	if($sql->query($cmd)){
		$vodID = $sql->last_id();
		$vod['id'] = $vodID;
	}
}else{
	$cmd = "UPDATE `vods` SET 
	`yt` = '".$sql->escape($vod['yt'])."', 
	`smashgg_setid` = '".$sql->escape($vod['smashgg_setid'])."',
	`game` = '".$sql->escape($vod['game'])."',
	`p1` = '".$sql->escape($p1)."',
	`p2` = '".$sql->escape($p2)."',
	`c1` = '".$sql->escape($c1)."',
	`c2` = '".$sql->escape($c2)."',
	`round` = '".$sql->escape($vod['round'])."',
	`event` = '".$sql->escape($vod['event'])."',
	`casters` = '".$sql->escape($casters)."',
	`file` = '".$sql->escape($vod['file'])."',
	`done` = '".$done."'
	WHERE `id` = '".$sql->escape($vod['id'])."'";
	$sql->query($cmd);
}

// get VOD object from database
if($vod['id'] > 0){
	$cmd = "SELECT * FROM `vods` WHERE `id` = '".$sql->escape($vod['id'])."'";
	$res = $sql->query($cmd);
	if($sql->num_rows($res) == 1){
		$object['success'] = true;
		$row = $sql->fetch($res);
		
		$row['id']		= intval($row['id']);
		$row['p1']		= json_decode($row['p1'], true);
		$row['p2']		= json_decode($row['p2'], true);
		$row['c1']		= json_decode($row['c1'], true);
		$row['c2']		= json_decode($row['c2'], true);
		$row['casters']	= json_decode($row['casters'], true);
		$row['done']	= ($row['done'] == 1);
		
		$object['vod'] = $row;
	}
}

echo json_encode($object);

?>