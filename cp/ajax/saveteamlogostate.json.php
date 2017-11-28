<?php
header('Content-Type: application/json');

include("./ajaxloader.php");


$object = array(
	"success" => false
);


$type = "";
switch($_POST['type']){
	case "logo": $type = "logo"; break;
	case "inline": $type = "inline"; break;
}

$teamfolder = './../../assets/teams/'.$_POST['teamid'].'/';



if(!empty($type)){
	
	
	// set all others to zero
	$cmd = "UPDATE `team-logos` SET `".$type."` = '0' WHERE `teamid` = '".$sql->escape($_POST['teamid'])."'";
	$sql->query($cmd);
	
	unlink($teamfolder.$type.".png");
	
	if($_POST['state'] == 1){
		$cmd = "SELECT `filename` FROM `team-logos` WHERE `id` = '".$sql->escape($_POST['id'])."'";
		$res = $sql->query($cmd);
		$row = $sql->fetch($res);
		$filename = $row['filename'];
		copy($teamfolder.$filename, $teamfolder.$type.".png");
	}
	$cmd = "UPDATE `team-logos` SET `".$type."` = '".$sql->escape($_POST['state'])."' WHERE `id` = '".$sql->escape($_POST['id'])."'";

	if($sql->query($cmd)){
		$object['success'] = true;
	}

}
echo json_encode ($object);

?>