<?php
$theme = file_get_contents("./../../theme.txt");

$dir = "./../../themes/".$theme."/thumbnail";

if(!is_dir($dir)){
	die("Dir does not exists");
}

if(file_exists($dir."/config.json")){
	$configJson = file_get_contents($dir."/config.json");
	$config = json_decode($configJson, true);
}

$size = array(1280,720);
$game = $_POST['game'];

$doubles = isset($_POST['doubles']);

$round = $_POST['round'];

$name1 = $_POST['name1'];
$name2 = $_POST['name2'];

if($doubles){
	$name12 = $_POST['name12'];
	$name22 = $_POST['name22'];
	
	$name1 .= " + " . $name12;
	$name2 .= " + " . $name22;
}

$char1 = $_POST['char1'];
$char2 = $_POST['char2'];

if($doubles){
	$char12 = $_POST['char12'];
	$char22 = $_POST['char22'];
}

$assetdir = "./../../assets/thumbnail/".$game;

$fontFile = "./../../themes/".$theme."/thumbnail/font.otf";

$topFile = $dir."/top.png";
$bottomFile = $dir."/bottom.png";


$char1File = $assetdir."/".$char1.".png";
$char2File = $assetdir."/".$char2.".png";

if($doubles){
	$char12File = $assetdir."/".$char12.".png";
	$char22File = $assetdir."/".$char22.".png";
}

$m_im = imagecreatetruecolor ($size[0], $size[1]);

$black = imagecolorallocate($m_im, 0, 0, 0);
$white = imagecolorallocate($m_im, 255, 255, 255);
imagefill($m_im, 0, 0, $black);

// copy bottom layer
insertImage($m_im, $bottomFile);

// all coordinates are centered points
$c_x = 262; // char X pos (right will be inverted)
$c_y = 334; // char Y pos
$c_w = 653; // maximal width
$c_h = 592; // maximal height

$c_d_w = 420; // maximal width for doubles
$c_d_s = 220; // space between both characters for doubles

if($doubles){
	$c_d_s = ceil($c_d_s/2);
	insertCharacter($m_im, $char12File,	$c_x+$c_d_s, $c_y, $c_d_w, $c_h, false);
	insertCharacter($m_im, $char1File,	$c_x-$c_d_s, $c_y, $c_d_w, $c_h, false);
	insertCharacter($m_im, $char2File,	$size[0] - $c_x - $c_d_s, $c_y, $c_d_w, $c_h, true);
	insertCharacter($m_im, $char22File,	$size[0] - $c_x + $c_d_s, $c_y, $c_d_w, $c_h, true);
}else{
	insertCharacter($m_im, $char1File,	$c_x, $c_y, $c_w, $c_h, false);
	insertCharacter($m_im, $char2File,	$size[0] - $c_x, $c_y, $c_w, $c_h, true);
}

// copy top layer
insertImage($m_im, $topFile);


// do text stuff

$fontsize = 80;
$width = 570;
$height = 250;
$x = 10;
$y = 700;

// names
insertText($m_im, $x, $y, $fontsize, $width, $height, $fontFile, $name1, $white, false);
insertText($m_im, $x, $y, $fontsize, $width, $height, $fontFile, $name2, $white, true);

// round
insertText($m_im, 359, 145, 60, 550, 200, $fontFile, $round, $white, false);

// render

imagepng($m_im, "./../../thumbnails/".time().".png");
imagedestroy($m_im);
echo 1;
/*
// debug
header("Content-Type: image/png");
imagepng($m_im);
*/


function insertCharacter($im, $file, $x, $y, $w, $h, $mirror){
	if(!file_exists($file))
		return false; // file not there, avoid crash
	
	$src = imagecreatefrompng($file);
	
	$src_w_orig = imagesx($src);
	$src_h_orig = imagesy($src);
	
	$src_w = $src_w_orig;
	$src_h = $src_h_orig;
	
	$aspect = $src_w / $src_h;
	if($src_w > $w){ // fix width
		$src_w = $w;
		$src_h = $src_w / $aspect;
	}
	if($src_h > $h){ // fix height
		$src_h = $h;
		$src_w = $src_h * $aspect;
	}
	
	$dest_x = $x - ceil($src_w / 2); // get final x position
	$dest_y = $y - ceil($src_h / 2); // get final y position
	
	if($mirror)
		imageflip($src, IMG_FLIP_HORIZONTAL);
	
	return imagecopyresampled($im, $src, $dest_x, $dest_y, 0, 0, $src_w, $src_h, $src_w_orig, $src_h_orig);
}

function insertImage($im, $file){
	if(!file_exists($file))
		return false; // file not there, avoid crash
	$src = imagecreatefrompng($file);
	return imagecopyresampled($im, $src, 0, 0, 0, 0, imagesx($im), imagesy($im), imagesx($src), imagesy($src));
}

function insertText($im, $x, $y, $fontsize, $maxWidth, $maxHeight, $fontFile, $text, $color, $mirror){
	$text = trim($text);
	if(strlen($text) == 0 || !file_exists($fontFile))
		return false;
	do {
		$fontsize--;
		$box = imagettfbbox($fontsize, 0, $fontFile, $text);
		$textWidth = $box[2] - $box[0];
		$textHeight = $box[1] - $box[7];
	} while($textWidth > $maxWidth);
	$newX = $x + ceil(($maxWidth - $textWidth)/2);
	if($mirror)
		$newX = (imagesx($im) - $x - $maxWidth) + ceil(($maxWidth - $textWidth)/2);
	$newY = $y - ceil(($maxHeight - $textHeight)/2);
	return ImageTTFText ($im, $fontsize, 0, $newX, $newY, $color, $fontFile, $text);
}

?>