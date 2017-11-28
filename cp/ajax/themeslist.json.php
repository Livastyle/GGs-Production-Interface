<?php
header('Content-Type: application/json');

include("./ajaxloader.php");

$object = array(
	"count" => 0,
	"list" => array()
);

$path = "./../../themes";
$content = "";
$themes = scandir($path);

foreach($themes as $theme){
	if(is_dir($path."/".$theme) && file_exists($path."/".$theme."/manifest.json")){
		$defaultManifest = array(
			"name" => "error - no name",
			"casters" => 2,
			"label" => "no label",
			"note" => "",
			"ver" => "N/A",
			"fields" => array(),
			"resolution" => array(1280, 720),
			"preview" => "preview"
		);
		$manifest = json_decode(file_get_contents($path."/".$theme."/manifest.json"), true);
		
		if(!isset($manifest['previewpath']))
			$manifest['previewpath'] = "";
		
		if(isset($manifest['base']) && !empty($manifest['base']) && file_exists($path."/".$manifest['base']."/manifest.json")){
			$baseManifest = json_decode(file_get_contents($path."/".$manifest['base']."/manifest.json"), true);
			$manifest = array_merge($baseManifest, $manifest);
		}
		$manifest = array_merge($defaultManifest, $manifest);
		
		$previewPicArr = array();
		$previewPath = $path."/".$theme."/".$manifest['previewpath'];
		if(is_dir($previewPath)){
			$pictures = scandir($previewPath);
			foreach($pictures as $pic){
				if(is_file($previewPath."/".$pic)){
					$size = getimagesize($previewPath."/".$pic);
					if($size[0] > 10 && $size[1] > 10 && $size[0] < 5000 && $size[1] < 5000)
						array_push($previewPicArr, $manifest['previewpath']."/".$pic);
					
				}
			}
		}
		
		$info = array(
			"name" => $theme,
			"casters" => $manifest['casters'],
			"label" => $manifest['label'],
			"note" => $manifest['note'],
			"ver" => $manifest['ver'],
			"fields" => (isset($manifest['fields']) ? $manifest['fields'] : array()),
			"resolution" => $manifest['resolution'],
			"preview" => $previewPicArr
		);
		array_push($object["list"], $info);
	}
}

$object["count"] = count($object["list"]);


echo json_encode ($object);
?>