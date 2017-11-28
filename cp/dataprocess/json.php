<?php

$data = $_POST['data'];

$data["timestamp"] = time();

$filename = $_POST['dest']."/controller.json";
file_put_contents($filename, json_encode($data));
echo 1;
?>