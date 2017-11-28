<?php



$playerID = (isset($_GET['pid']) ? $_GET['pid'] : 0);
$maxSize = (isset($_GET['s']) ? $_GET['s'] : -1);





$filename = "./".$playerID.".jpg";

if(!file_exists($filename)){
	$filename = "./0.jpg";
}

// all good, return header already
header("Content-Type: image/png");


$src = imagecreatefromjpeg($filename);

$resizeInfo = srcResizeInfo($src, $maxSize, $maxSize);

$img = imagecreatetruecolor($resizeInfo["current"][0], $resizeInfo["current"][1]);

imagesavealpha($img, true);
imagealphablending($img, false);


$trans = imagecolorallocatealpha($img, 0, 0, 0, 0);
imagefill($img, 0, 0, $trans);



if($resizeInfo['resize']){
	// do resize
	
	imagecopyresampled($img, $src, 0, 0, 0, 0, $resizeInfo["current"][0], $resizeInfo["current"][1], $resizeInfo["original"][0], $resizeInfo["original"][1]);
	
}else{
	// no resize 
	imagecopy($img, $src, 0, 0, 0, 0, $resizeInfo["current"][0], $resizeInfo["current"][1]);	
}
imagejpeg($img);
imagedestroy($src);
imagedestroy($img);



function srcResizeInfo($src, $maxW, $maxY){
	
	$resizeInfo = array(
		"original" => array(0, 0),
		"current" => array(0, 0),
		"resize" => false,
		"aspect" => 0
	);
	
	$sx = imagesx($src);
	$sy = imagesy($src);
	
	$resizeInfo["original"] = array($sx, $sy);
	
	// get aspect ratio
	$resizeInfo["aspect"] = $sx/$sy;
	
	if(($maxW < $sx && $maxW > 0) || ($maxY < $sy && $maxY > 0)) {
		// check width for max size
		if($sx > $maxW && $maxW > 0){
			$sx = $maxW;
			$sy = ceil($sx / $resizeInfo["aspect"]);
		}
		
		// check height for max size
		if($sy > $maxY && $maxY > 0){
			$sy = $maxY;
			$sx = ceil($sy * $resizeInfo["aspect"]);
		}
		$resizeInfo["resize"] = true;
	}
	
	$resizeInfo["current"] = array($sx, $sy);
	
	return $resizeInfo;
}


?>