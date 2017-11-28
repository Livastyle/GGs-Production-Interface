<?php

function array_to_xml( $data, &$xml_data ) {
    foreach( $data as $key => $value ) {
        if( is_numeric($key) ){
            $key = 'item'.$key;
        }
        if( is_array($value) ) {
            $subnode = $xml_data->addChild($key);
            array_to_xml($value, $subnode);
        } else {
            $xml_data->addChild($key,htmlspecialchars($value));
        }
     }
}

$data = $_POST['data'];

$data["timestamp"] = time();

$filename = $_POST['dest']."/controller.json";
$xml_data = new SimpleXMLElement('<?xml version="1.0"?><data></data>');
array_to_xml($data,$xml_data);
//$xml_data->asXML($_POST['dest']."/controller.xml");

$dom = new DOMDocument("1.0");
$dom->preserveWhiteSpace = false;
$dom->formatOutput = true;
$dom->loadXML($xml_data->asXML());
file_put_contents($_POST['dest']."/controller.xml", $dom->saveXML());


?>