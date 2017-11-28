<?php
header('Content-Type: application/json');

include("./ajaxloader.php");


$object = array(
	"success" => false
);

try {
	$res = file_put_contents("./../../themes/".$_POST['theme']."/thumbnail-template.json", $_POST['thumbnail']);
	if($res !== false)
		$object['success'] = true;
} catch (Exception $e) {
	$object['error'] = $e;
}

echo json_encode ($object);
?>