<?php

$twitch_token = "zdyodiw0bqeip8ksnv1js3ea60s1dm";
$twitch_channel = "geekygoonsquad";
$entrysPerRequest = 100;
$total = 0;
$subscriber = array();

$data = file_get_contents("https://api.twitch.tv/kraken/channels/".$twitch_channel."/subscriptions?limit=".$entrysPerRequest."&offset=0&oauth_token=".$twitch_token);
$data = json_decode($data, true);
foreach($data['subscriptions'] as $sub){
	if($sub['user']['name'] != "geekygoonsquad")
		array_push($subscriber, $sub['user']['display_name']);
}
$total=$data['_total'];
for($offset=$entrysPerRequest;$offset<$total;$offset=$offset+$entrysPerRequest){
	$data = file_get_contents("https://api.twitch.tv/kraken/channels/".$twitch_channel."/subscriptions?limit=".$entrysPerRequest."&offset=".$offset."&oauth_token=".$twitch_token);
	$data = json_decode($data, true);
	foreach($data['subscriptions'] as $sub){
		array_push($subscriber, $sub['user']['name']);
	}
}

echo json_encode($subscriber);

if(count($subscriber)>2){
	file_put_contents("subs.json",json_encode($subscriber));
}
?>