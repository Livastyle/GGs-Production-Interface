<?php
header('Content-Type: application/json');

include("./ajaxloader.php");


$object = array(
	"success" => false
);

try {
	$data = $_POST['base64'];

	list($type, $data) = explode(';', $data);
	list(, $data)      = explode(',', $data);
	
	$md5 = md5($data);
	$data = base64_decode($data);
	
	$fileExtension = "";
	switch($type){
		case "data:image/jpg":
		case "data:image/jpeg":
			$fileExtension = "jpg";
		break;
		case "data:image/png":
			$fileExtension = "png";
		break;
		case "data:image/gif":
			$fileExtension = "gif";
		break;
	}
	
	$theme = $_POST['theme'];
	$vodID = $_POST['setID']; 
	
	$fileName = $md5.'.'.$fileExtension;
	$fileTnName = $md5.'.jpeg';
	$filePath = 'thumbnails/'.$fileName;
	$fileTnPath = 'thumbnails/tn/'.$fileTnName;
	$relativeFilePath = './../../';
	
	$res = file_put_contents($relativeFilePath.$filePath, $data);
	
	if($res !== false){
		// create and save small version
		$img = imagecreatetruecolor(160, 90);
		switch($type){
			case "data:image/jpg":
			case "data:image/jpeg":
				$src = imagecreatefromjpeg($relativeFilePath.$filePath);
			break;
			case "data:image/png":
				$src = imagecreatefrompng($relativeFilePath.$filePath);
			break;
			case "data:image/gif":
				$src = imagecreatefromgif($relativeFilePath.$filePath);
			break;
		}
		

		imagecopyresampled($img, $src, 0, 0, 0, 0, 160, 90, imagesx($src), imagesy($src));
		imagejpeg($img, $relativeFilePath.$fileTnPath, 80);
		
		$cmd = "SELECT `id` FROM `thumbnails` WHERE `filename` = '".$sql->escape($filePath)."'";
		$res = $sql->query($cmd);
		if($sql->num_rows($res) >= 1)
			$sql->query("DELETE FROM `thumbnails` WHERE `filename` = '".$sql->escape($filePath)."'");

		
		$cmd = "INSERT INTO `thumbnails` (`id`,`filename`,`tn_filename`,`vod`,`theme`,`time`) VALUES (NULL, '".$sql->escape($filePath)."', '".$sql->escape($fileTnPath)."', '".$sql->escape($vodID)."', '".$sql->escape($theme)."', '".time()."');";
		
		if($sql->query($cmd)){
			$tnID = $sql->last_id();
			$object['path'] = $filePath;
			$object['insert_id'] = $tnID;
			$object['success'] = true;
		}else{
			$object['error'] = "Error saving into database";
		}
	}

} catch (Exception $e) {
	$object['error'] = $e;
}

echo json_encode ($object);
?>