<?php


function getTheme(){
	global $themePath;
	
	$theme = file_get_contents("./../theme.txt");
	if(!file_exists($themePath."/".$theme."/manifest.json")){
		$theme = "default";
	}
	$manifest = file_get_contents($themePath."/".$theme."/manifest.json");
	$data = json_decode($manifest, true);
	
	if(!isset($data['base'])){
		$data['base'] = "";
	}
	if(!empty($data['base'])){
		if(file_exists($themePath."/".$data['base']."/manifest.json")){
			$baseManifest = file_get_contents($themePath."/".$data['base']."/manifest.json");
			$baseData = json_decode($baseManifest, true);
			$data = array_merge($baseData, $data);
			$data['basepath'] = $themePath."/".$data['base'];
		}
	}
	$data['name'] = $theme;
	$data['path'] = $themePath."/".$theme;
	return $data;
}

function themeLoad($theme, $file){
	
	$filepath = $theme['path'].$file;
	$basefilepath = "";
	if(isset($theme['basepath'])){
		$basefilepath = $theme['basepath'].$file;
	}
	if(file_exists($filepath)){
		@include($filepath);
	}else if(file_exists($basefilepath)){
		@include($basefilepath);
	}
}



?>