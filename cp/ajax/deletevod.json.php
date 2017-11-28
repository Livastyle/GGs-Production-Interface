<?php
header('Content-Type: application/json');

include("./ajaxloader.php");



$object = array(
	"success" => false
);

$id = $_POST['id'];

$cmd = "DELETE FROM `vods` WHERE `id` = '".$sql->escape($id)."'";
if($sql->query($cmd)){
	$cmd = "SELECT * FROM `thumbnails` WHERE `vod` = '".$sql->escape($id)."'";
	$res = $sql->query($cmd);
	while($row = $sql->fetch($res)){
		unlink('./../../'.$row['filename']);
		unlink('./../../'.$row['tn_filename']);
	}
	$cmd = "DELETE FROM `thumbnails` WHERE `vod` = '".$sql->escape($id)."'";
	if($sql->query($cmd)){
		$object['success'] = true;
	}
}

echo json_encode($object);

?>