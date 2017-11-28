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

$playerList = array(
	"count" => 0,
	"list" => array()
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


$cmd = "SELECT 
`player`.*, 
`countries`.`name` AS `countryname`, 
`teamplayer`.`nickname` AS `teampartnername` 

FROM `player` 

LEFT JOIN `countries`
ON `player`.`country` = `countries`.`id`

LEFT JOIN `player` AS `teamplayer`
ON `player`.`teampartner` = `teamplayer`.`id`

ORDER BY `nickname` ASC";


$res = $sql->query($cmd);

$playerList["count"] = $sql->num_rows($res);
if($playerList["count"] > 0){
	while($row = $sql->fetch($res)){
		$row["teams"] = getTeams($row["id"]);
		array_push($playerList["list"], $row);
	}
}



function getPlayerBySmashggId($id){
	global $playerList;

	foreach($playerList["list"] as $player){
		if($player['smashgg'] == $id)
			return $player;
	}
	return null;
}

function getEntrantById($data, $entrantId){
	foreach($data["entities"]["entrants"] as $entrant){
		if($entrant['id'] == $entrantId)
			return $entrant;
	}
	return null;
}



function getPlayerByEntrant($data, $entrant){
	$players = array();
	foreach($entrant['playerIds'] as $pid)
		array_push($players, getPlayerBySmashggId($pid));
	return $players;
}

// get smash.gg data

$eventObj = getSmashggSets($_REQUEST['eventid']);

$object = array(
	"event" => $eventObj
);


function getSmashggSets($eventID){
	$setList = array();
	//$eventObj = json_decode(file_get_contents("https://api.smash.gg/event/".$eventID."?expand%5B%5D=groups&expand%5B%5D=phase"), true);
	$eventObj = json_decode(file_get_contents("https://api.smash.gg/event/".$eventID."?expand%5B%5D=brackets&expand%5B%5D=entrants&random=".rand(1,99999999999999)), true);
/*
	// get last phase
	$phase = null;

	foreach($eventObj['entities']['phase'] as $phaseItem){
		if(!isset($phase) OR $phaseItem['phaseOrder'] > $phase['phaseOrder']){
			$phase = $phaseItem;
		}
	}	
	
	// get phase_group 
	$phase_group = null;
	foreach($eventObj['entities']['groups'] as $groupItem){
		if($groupItem['phaseId'] == $phase['id']){
			$phase_group = $groupItem;
		}
	}

	// get top 8 sets
	$phaseObj = json_decode(file_get_contents("https://api.smash.gg/phase_group/".$phase_group['id']."?expand%5B%5D=sets&expand%5B%5D=entrants"), true);
*/
	$setList = array();
	foreach($eventObj['entities']['sets'] as $setItem){
		if($setItem['lOverallPlacement'] <= 8){
			
			$e1 = getEntrantById($eventObj, $setItem['entrant1Id']);
			$e2 = getEntrantById($eventObj, $setItem['entrant2Id']);
			
			$setItem['entrant1name'] = $e1['name'];
			$setItem['entrant2name'] = $e2['name'];
			
			$setItem['player1'] = getPlayerByEntrant($eventObj, $e1);
			$setItem['player2'] = getPlayerByEntrant($eventObj, $e2);
			
			array_push($setList, $setItem);
		}
	}
	
	$object = array(
		"title" => $eventObj['entities']['event']['name'],
		"list" => $setList
	);
	
	return $object;
	
}


echo json_encode ($object);







/*
{
	id: "2",
	nickname: "Android",
	country: "2",
	displayname: "[A]ndroid",
	twitter: "UGS_Android",
	youtube: "",
	twitch: "ugs_android",
	firstname: "Andreas",
	lastname: "Lindgren",
	smashrankingeu: "android",
	smashgg: "12870",
	tafostats: "0",
	teampartner: "3",
	laststreamactivity: "0",
	countryname: "Sweden",
	teampartnername: "Armada",
	teams: [
		{
			id: "1",
			name: "Alliance",
			prefix: "A"
		}
	]
},
*/
?>