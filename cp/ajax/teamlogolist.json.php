<?php
header('Content-Type: application/json');

include("./ajaxloader.php");

$object = array(
	"count" => 0,
	"list" => array()
);

$id = (isset($_POST['id']) ? $_POST['id'] : 0);


$cmd = "SELECT * FROM `team-logos` WHERE `teamid` = '".$sql->escape($id)."'";
$res = $sql->query($cmd);



$dir = "./../../assets/teams/".$id."/";

if($sql->num_rows($res) > 0){
	while($row = $sql->fetch($res)){
		if(file_exists($dir . $row['filename'])){
			$row['path'] = $dir . $row['filename'];
			$imagesize = getimagesize($row['path']);
			$row['width'] = $imagesize[0];
			$row['height'] = $imagesize[1];
			array_push($object["list"], $row);
		}
	}
}

/*
if(is_dir($dir)){
	if ($handle = opendir($dir)) {
		while(false !== ($entry = readdir($handle))) {
			if($entry !== "." && $entry !== ".."){
				$imagesize = getimagesize($dir.$entry);
				array_push($object["list"], array("filename" => $entry, "width" => $imagesize[0], "height" => $imagesize[1]));
			}
		}
	}
}
*/

$object["count"] = count($object["list"]);

echo json_encode ($object);
?>