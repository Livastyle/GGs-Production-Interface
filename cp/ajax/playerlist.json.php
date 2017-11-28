<?php
header('Content-Type: application/json');

include("./ajaxloader.php");


// connect teams to players
function getTeams($playerID){
	global $teams,$playerTeamRef;
	$list = array();
	
	foreach($playerTeamRef as $ref){
		if($ref["pid"] == $playerID){
			array_push($list, $teams[$ref["tid"]]);
		}
	}
	return $list;
}

$object = array(
	"count" => 0,
	"list" => array(),
	"idlist" => array(),
	"timestamp" => time()
);

$teams = array();
$playerTeamRef = array();

// get all teams
$cmd = "SELECT * FROM `teams`";
$res = $sql->query($cmd);
while($row = $sql->fetch($res)){
	$teams[$row["id"]] = $row;
}

// get all references between players and teams
$cmd = "SELECT * FROM `player-teams`";
$res = $sql->query($cmd);
while($row = $sql->fetch($res)){
	array_push($playerTeamRef, $row);
}

$cmd = "SELECT `id` FROM `player`";
$res = $sql->query($cmd);
if($sql->num_rows($res) > 0){
	while($row = $sql->fetch($res)){
		array_push($object["idlist"], $row['id']);
	}
}


$cmd = "SELECT 
`player`.*, 
`countries`.`name` AS `countryname`, 
`teamplayer`.`nickname` AS `teampartnername` 

FROM `player` 

LEFT JOIN `countries`
ON `player`.`country` = `countries`.`id`

LEFT JOIN `player` AS `teamplayer`
ON `player`.`teampartner` = `teamplayer`.`id`

WHERE `player`.`modify_time` >= '".$sql->escape($_POST['timestamp'])."'

ORDER BY `nickname` ASC";

$res = $sql->query($cmd);

$object["count"] = $sql->num_rows($res);
if($object["count"] > 0){
	while($row = $sql->fetch($res)){
		$row["teams"] = getTeams($row["id"]);
		array_push($object["list"], $row);
	}
}
echo json_encode ($object);
?>