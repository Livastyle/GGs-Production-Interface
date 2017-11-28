<?php
header('Content-Type: application/json');

include("./ajaxloader.php");

$object = array(
	"success" => false
);

if (isset($_FILES['file'])){
	$object['uploadsuccess'] = false;
	$cmd = "SELECT `game` FROM `characters` WHERE `id` = '".$sql->escape($_POST['character'])."'";
	$res = $sql->query($cmd);
	if($sql->num_rows($res) == 1){
		$row = $sql->fetch($res);
		
		$gamefolder = './../../assets/characters/stock/'.$row['game'];
		
		$filename = $gamefolder.'/'.$_POST['character'].'_'.$_POST['name'].'.png';
		
		// generate folder if not existing
		if(!file_exists($gamefolder))
			mkdir($gamefolder, 0777, true);
		
		// delete icon file if present
		if(file_exists($filename))
			unlink($filename);
		
		// move uploaded file to game folder
		if(move_uploaded_file($_FILES['file']['tmp_name'], $filename)){
			$object['uploadsuccess'] = true;
		}
	}
	
}


if($_POST['id'] == 0){
	$cmd = "INSERT INTO `character-costumes` (`id`,`name`,`character`) VALUES (NULL, '".$sql->escape($_POST['name'])."', '".$sql->escape($_POST['character'])."');";
	if($sql->query($cmd)){
		$costumeID = $sql->last_id();
		$object['insert_id'] = $costumeID;
		$object['success'] = true;
	}
}else{
	$cmd = "UPDATE `character-costumes` SET `name` = '".$sql->escape($_POST['name'])."', `character` = '".$sql->escape($_POST['character'])."' WHERE `id` = '".$sql->escape($_POST['id'])."'";
	if($sql->query($cmd)){
		$object['updated_id'] = $_POST['id'];
		$object['success'] = true;
	}
}



echo json_encode ($object);

?>