<?php
header('Content-Type: application/json');

include("./ajaxloader.php");

$teamID = intval($_POST['id']);

$object = array(
	"success" => false
);

if (isset($_FILES['file']) && $teamID > 0){
	$object['uploadsuccess'] = false;

	$teamfolder = './../../assets/teams/'.$teamID.'/';
	
	$filename = md5(time()).'.png';
	
	// generate folder if not existing
	if(!file_exists($teamfolder))
		mkdir($teamfolder, 0777, true);
	
	// delete icon file if present
	if(file_exists($teamfolder.$filename))
		$filename = md5(time() + 1).'.png';
	
	// move uploaded file to game folder
	if(move_uploaded_file($_FILES['file']['tmp_name'], $teamfolder.$filename)){
		$object['uploadsuccess'] = true;
	}
}

if($object['uploadsuccess']){
	$cmd = "INSERT INTO `team-logos` (`id`,`teamid`,`filename`,`logo`,`inline`) VALUES (NULL, '".$teamID."', '".$sql->escape($filename)."','0','0');";
	if($sql->query($cmd))
		$object['success'] = true;
}

echo json_encode ($object);
?>