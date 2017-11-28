<?php
/*

- logo.png (full logo)	[inline=false:null]
- - logo_red.png 			[bg=red]
- - logo_black.png			[bg=black]
- inline.png (inline logo for scoreboard) [inline=true]
- - inline_red.png		[bg=red]
- - inline_black.png	[bg=black]


*/

$defaultInlineBG = "inline";
$defaultFullBG = "logo";

$teamID = (isset($_GET['tid']) ? $_GET['tid'] : 0);
$bg = (isset($_GET['bg']) ? $_GET['bg'] : "");
$inline = isset($_GET['inline']);
$maxSize = (isset($_GET['s']) ? $_GET['s'] : -1);





// if requested file is not available, try its default bg (if it isnt it already
// if also that is not available, try "other inline".
// if even that fails, fuck it and send 404


$requestedFile = array();
$requestedFile[0] = "./".$teamID."/".($inline ? $defaultInlineBG : $defaultFullBG).(strlen($bg) > 0 ? "_".$bg : "").".png";
$requestedFile[1] = "./".$teamID."/".($inline ? $defaultInlineBG : $defaultFullBG).".png";
$requestedFile[2] = "./".$teamID."/".(!$inline ? $defaultInlineBG : $defaultFullBG).(strlen($bg) > 0 ? "_".$bg : "").".png";
$requestedFile[3] = "./".$teamID."/".(!$inline ? $defaultInlineBG : $defaultFullBG).".png";

$filename = "";
for($i = 0; $i < count($requestedFile); $i++){
	if(file_exists($requestedFile[$i])){
		$filename = $requestedFile[$i];
		break;
	}
}

if(!file_exists($filename)){
	// no logo at all
	// return 404 header
	//header("Content-Type: "); // TODO: return proper 404 header
	header("HTTP/1.0 404 Not Found");
	
	return;
}

// all good, return header already
header("Content-Type: image/png");


$src = imagecreatefrompng($filename);

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
imagepng($img);
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