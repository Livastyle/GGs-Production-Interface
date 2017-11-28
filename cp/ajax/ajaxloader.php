<?php

define("MAIN", 1);
include("./../config.php");
include("./../func/sql.class.php");
include("./../func/login.class.php");

$sql = new sql($sqlConfig['host'], $sqlConfig['username'], $sqlConfig['password'], $sqlConfig['database']);
$login = new login();


$_POST = $sql->utf8decodeArray($_POST);
?>