<html>
<head>
	<title>Stage striking</title>
	<meta content='width=1400, user-scalable=0' name='viewport' />
	<script type="text/javascript" src="js/jquery-3.1.1.min.js"></script>
	<script type="text/javascript">
	var ws;
	var p = ["","",""];
	var pIDs = [];
	var _playstyle;
	
	var stageList = [];
	var stagesIn = [];
	var strikeActionList = [];
	
	var _game = 0;
	
	var strikeOrderList = {
		3:[1,2],
		5:[1,2,2,1],
		7:[1,1,2,2,2,1]
	};
	
	var strikeOrder = [];
	var currentStriker = 0;
	var firstStriker = 0;
	
	
	function init(){
		startWS('ws://'+location.host+':5000');
		currentStriker = 0;
		
		
		showPanel('flipcoin');
		
	}
	
	function startWS(websocketServerLocation){
		if(ws == undefined || ws.readyState == undefined || ws.readyState === ws.CLOSED){
			ws = new WebSocket(websocketServerLocation);
			ws.onmessage = function(evt) { 
				var wsdata = JSON.parse(evt.data);
				if(wsdata.type == 'scoreboardinfo'){
					console.log('scoreboardinfo');
					console.log(wsdata.data);
					insertScoreboardData(wsdata.data);
				}

			};
			ws.onopen = function(){
				console.log("WS connected");
			}
			ws.onclose = function(){
				console.log("WS CLOSED, reconnect");
				setTimeout(function(){startWS(websocketServerLocation)}, 5000);
			};
		}
	}
	
	function update(){
		var data = {
			"currentStriker":currentStriker,
			"firstStriker":firstStriker,
			"pids":pIDs,
			"strikeorder":strikeOrderList,
			"game":_game,
			"stageList":stageList,
			"strikes":strikeActionList
		};
		ws.send(JSON.stringify({"type":"stagestrike", "data":data}));
	}
	
	function insertScoreboardData(data){
		console.log(data);
		
		var p1 = "";
		var p2 = "";
		
		var ids = [];
		
		_playstyle = data.playstyle;
		
		if(data.playstyle == 'doubles'){
			p1 = data.player[1].nickname +" + "+data.player[12].nickname;
			p2 = data.player[2].nickname +" + "+data.player[22].nickname;
			
			ids.push(data.player[1].id);
			ids.push(data.player[2].id);
			ids.push(data.player[12].id);
			ids.push(data.player[22].id);
		}else{
			p1 = data.player[1].nickname;
			p2 = data.player[2].nickname;
			
			ids.push(data.player[1].id);
			ids.push(data.player[2].id);
		}
		
		if(!compareArray(ids, pIDs)){
			pIDs = ids;
			setValues({
				"game":data.game,
				"p1name":p1,
				"p2name":p2
			});
		}
		
		// set player info
		
		$("#info_player_list").html('').removeClass("singles doubles").addClass(data.playstyle);
		data.seatorder = data.seatorder.reverse();
		for(index in data.seatorder){
			
			var seat = data.seatorder[index];
			var playerObj = data.player[seat];
			
			var $item = $('<div class="item" id="seat_item_'+seat+'" />');
			var $itemInner = $('<div class="inner" />');
			$itemInner.append('<div class="name">'+playerObj.nickname+'</div>');
			$itemInner.append('<div class="country" style="background-image:url(\'./../assets/flags/lowres/'+playerObj.country+'.png\');">'+playerObj.countryname+'</div>');
			$itemInner.append('<div class="character" style="background-image:url(\'./../assets/characters/stock/'+_game+'/'+playerObj.character.cid+'_'+playerObj.character.ccid+'.png\');"></div>');
			$itemInner.append('<div class="twitter">'+playerObj.twitter+'</div>');
			$itemInner.append('<div class="twitch">'+playerObj.twitch+'</div>');
			$itemInner.append('<div class="youtube">'+playerObj.youtube+'</div>');
			
			
			$itemInner.appendTo($item);
			
			
			$item.append('<input class="info-player-moveleft" onclick="moveSeat('+seat+', -1);" type="button" value="move left" />');
			$item.append('<input class="info-player-moveright" onclick="moveSeat('+seat+', 1);" type="button" value="move right" />');
			
			$item.appendTo("#info_player_list");
		}
		
	}
	
	function moveSeat(seat, movement){
		// mirror input
		
		movement = movement*-1;
		
		var $currentItem = $("#seat_item_"+seat);
		if(movement < 0){
			var $swapItem = $currentItem.prev();
			$swapItem.insertBefore($currentItem);
		}else{
			var $swapItem = $currentItem.next();
			$swapItem.insertAfter($currentItem);
		}
		
		
		ws.send(JSON.stringify({"type":"moveseat", "data":{"seat":seat, "movement":movement}}));
	}
	
	function strike(evt){
		var stage = $(evt.target).data("stage");
		var id = "stageitem_"+stage;
		
		console.log(stage);
		console.log(currentStriker +" strikes "+ stage);
		var stageIndex = stagesIn.indexOf(stage);
		if(stageIndex > -1){
			if(stagesIn.length > 1){
				stagesIn.splice(stageIndex, 1);
				$("#"+id).addClass("out");
				modifyStrikeActionList(currentStriker, stage, true);
				if(stagesIn.length == 1){
					setTimeout(function(){
						showPanel('info');
					},300);
				}
			}
		}else{
			stagesIn.push(stage);
			$("#"+id).removeClass("out");
			modifyStrikeActionList(currentStriker, stage, false);
		}
		
		update();
		
		displayCurrentStrikerText();
		
	}
	
	function modifyStrikeActionList(player, stage, inOut){
		if(inOut){
			strikeActionList.push({"player":player, "stage":stage});
		}else{
			var removeIndex = -1;
			for(index in strikeActionList){
				var stageAction = strikeActionList[index];
				if(stageAction.stage == stage){
					removeIndex = index;
				}
			}
			if(removeIndex > -1){
				strikeActionList.splice(removeIndex, 1);
			}
		}
		console.log("strikeActionList:");
		console.log(strikeActionList);
	}
	
	function resetStageStrikes(){
		stagesIn = stageList.concat();
		currentStriker = firstStriker;
		strikeActionList = [];
		
		if(strikeOrder.length+1 != stageList.length){
			alert("Error: strikeOrder length ("+strikeOrder.length+") does not match with stageList length ("+stageList.length+")");
		}
		$("#stagelist .item").removeClass("out");
		
		update();
		displayCurrentStrikerText();
	}
	
	function displayCurrentStrikerText(){
		if(firstStriker == 0){
			displayText = "Please decide who starts before you strike!";
		}else{
			var strikeProgress = stageList.length - stagesIn.length;
			if(stagesIn.length > 1){
				// striking goes on
				var strikeOrderItem = strikeOrder[strikeProgress];
				currentStriker = (strikeOrderItem==firstStriker ? 1 : 2);
				
				var counter = 0;
				while(strikeOrder[strikeProgress+counter] == strikeOrderItem && stagesIn.length-1 > counter){
					
					
					counter++;
				}
				
				displayText = "<b>"+p[currentStriker]+"</b> please strike "+counter+" stage"+(counter > 1 ? 's' : '');
			}else{
				// we have one stage left, striking is over, move on
				displayText = "Good luck, have fun!";
				
			}
		}
		$("#stagestrike_info span").html(displayText);
	}
	
	function showPanel(panel){
		var btnid = "option_"+panel;
		var panelid = "panel_"+panel;
		
		$("#options .item").removeClass("selected");
		$("#"+btnid).addClass("selected");
		$("#main .panel").removeClass("visible");
		$("#"+panelid).addClass("visible");
	}
	
	function setStageStrikeItems(){
		
		$("#stagelist").html('');
		for(index in stageList){
			var stage = stageList[index];
			var $item = $('<div />');
			$item.addClass('item');
			$item.attr('id','stageitem_'+stage);
			$item.data('stage', stage);
			$item.css('background-image', 'url(\'./../assets/stages/'+_game+'/'+stage+'.jpg\')');
			$item.on('click', strike);
			$item.appendTo("#stagelist");
		}
		resetStageStrikes();
	}
	
	function resetStageList(){
		//_game
		//stageList
		
		$.ajax({
			method: 	"POST",
			dataType: 	"json",
			url: 		"./ajax/starterstages.json.php",
			data:		{game:_game,playstyle:_playstyle}
		})
		.done(function(data){
			stageList = [];
			for(index in data.list){
				stageList.push(data.list[index].id);
			}
			firstStriker = 0;
			strikeOrder = strikeOrderList[stageList.length];
		
			setStageStrikeItems();
		});
		
	}
	
	
	function setValues(data){
		
		p[1] = data.p1name;
		p[2] = data.p2name;
		
		if(_game != data.game){
			_game = data.game;
		}
		
		resetStageList();
		$(".player1name").text(data.p1name);
		$(".player2name").text(data.p2name);
		showPanel("flipcoin");
		
	}
	
	function flipCoin(){
		lockScreen(true);
		var rand = Math.floor(Math.random() * 2) + 1 ;
		$("#coin").addClass("rand"+rand);
		$("#coinfield").addClass("anim");
		setTimeout(function(){
			$("#coin").removeClass("rand1 rand2");
			$("#coinfield").removeClass("anim");
			strikeStart(rand, true);
			lockScreen(false);
		},3200);
	}
	function strikeStart(striker, force){
		if(force == undefined)
			force = false;
		if(stagesIn.length == stageList.length || force){
			currentStriker = firstStriker = striker;
			resetStageStrikes();
			displayCurrentStrikerText();
			showPanel("stagestrike");
			update();
		}
	}
	
	function lockScreen(doLock){
		if(doLock){
			$("#screenlock").addClass("lock");
		}else{
			$("#screenlock").removeClass("lock");
		}
	}
	
	function compareArray(a,b){
		if(a.length != b.length)
			return false;
		for(ai in a){
			var inB = false;
			for(bi in b)
				if(b[bi] == a[ai])
					inB = true;
			if(!inB)
				return false;
		}
		return true;
	}
	
	window.onload = init;

	</script>

	<style type="text/css">
	html {
		width:2000px;
	}
		body {
			width:2000px;
			background:#689f38;;
			margin:0;
			padding:0;
			overflow:hidden;
			color:#fff;
background: rgb(104,159,56);
background: -moz-linear-gradient(top,  rgba(104,159,56,1) 1%, rgba(127,204,73,1) 100%);
background: -webkit-linear-gradient(top,  rgba(104,159,56,1) 1%,rgba(127,204,73,1) 100%);
background: linear-gradient(to bottom,  rgba(104,159,56,1) 1%,rgba(127,204,73,1) 100%);
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#689f38', endColorstr='#7fcc49',GradientType=0 );

		}
		#screenlock {
			display:none;
			position:fixed;

		}
		#screenlock.lock {
			display:block;
			left:0px;
			right:0px;
			top:0px;
			bottom:0px;
			z-index:9999999;
			background:rgba(0,0,0,0.01);
			background-image:url('img/lock.png');
			background-repeat:no-repeat;
			background-position:10px 10px;
		}
		#main {
			position:fixed;
			left:0px;
			right:0px;
			top:0px;
			bottom:60px;
		}
		#options {
			position:fixed;
			left:0px;
			right:0px;
			bottom:0px;
			height:60px;
			font-size:0px;
			background:rgba(0,0,0,0.2);
			text-align:center;
		}
		#options .item {
			position:relative;
			display:inline-block;
			height:60px;
			width:80px;
			font-size:14px;
			color:#cdc;
			border-left:1px solid rgba(0,0,0,0.2);
		}
		#options .item:last-child {
			border-right:1px solid rgba(0,0,0,0.2);
		}
		
		#options .item.selected {
			color:#fff;
background: -moz-linear-gradient(top,  rgba(127,204,73,1) 0%, rgba(127,204,73,0.52) 100%);
background: -webkit-linear-gradient(top,  rgba(127,204,73,1) 0%,rgba(127,204,73,0.52) 100%);
background: linear-gradient(to bottom,  rgba(127,204,73,1) 0%,rgba(127,204,73,0.52) 100%);

		}
		
		#options .item .img {
			position:absolute;
			top:6px;
			bottom:20px;
			left:10px;
			right:10px;
			opacity:0.5;
			background-size:contain;
			background-position:50% 50%;
			background-repeat:no-repeat;
		}
		#options .item.selected .img {
			opacity:0.9;
		}
		#options .item .label {
			position:absolute;
			bottom:2px;
			left:0px;
			right:0px;
			
		}
		
		.panel {
			display:none;
		}
		.panel.visible {
			display:block;
		}
		
		#panel_stagestrike {
			position:absolute;
			left:0px;
			right:0px;
			top:30px;
		}		
		
		#stagestrike_info {
			position:absolute;
			left:0px;
			right:0px;
			top:30px;
			height:60px;
			text-align:center;
		}
		#stagestrike_info span {
			display:inline-block;
			background:rgba(0,0,0,0.4);
			border-radius:6px;
			padding:5px 16px;
			font-size:34px;
			font-weight:bold;
		}
		#stagestrike_info span b {
			color:#f44;
			font-size:36px;
		}
		
		#stagelist {
			position:absolute;
			left:0px;
			right:0px;
			top:140px;
			text-align:center;
			font-size:0;
			background:rgba(0,0,0,0.1);
		}
		#stagelist .item {
			display:inline-block;
			margin:20px;
			width:200px;
			height:200px;
			background-size:cover;
			border-radius:3px;
			-webkit-transform:scale(1) rotateX(0deg);
			-webkit-transition:all .2s;
		}
		#stagelist .item.out {
			opacity:0.3;
			-webkit-transform:scale(0.8) rotateY(350deg);
			-webkit-filter:grayscale(1) brightness(0.8);
			-webkit-transition:all 1s;
		}
		
		#p1startbtn,
		#p2startbtn {
			position:absolute;
			bottom:50px;
			width:500px;
			height:100px;
			line-height:100px;
			text-align:center;
			vertical-align:middle;
			font-size:20px;
			background:rgba(0,0,0,0.7);
			border-radius:6px;
			
		}
		#p1startbtn {
			left:100px;
		}
		#p2startbtn {
			right:100px;
		}
		
		#panel_flipcoin .label {
			position:absolute;
			left:0px;
			right:0px;
			text-align:center;
		}
		#panel_flipcoin .label span {
			display:inline-block;
			background:rgba(0,0,0,0.4);
			border-radius:3px;
			padding:5px 10px;
			font-size:16px;
			font-weight:bold;
		}
		
		#flipcoin_button {
			position:absolute;
			left:10px;
			right:10px;
			top:40px;
			height:416px;
		}
		
		#coinfield {
			position:absolute;
			top:0px;
			height:416px;
			width:416px;
			left:calc(50% - 208px);
			-webkit-transform:scale(0.5);
			opacity:0.6;
			-webkit-transition:all .5s;
			
			
			
		}
		
		#coinfield.anim {
			-webkit-transform:scale(1);
			opacity:1;
		}
		
		#coin {
			position:absolute;
			left:58px;
			top:58px;
			width:300px;
			height:300px;
			border-radius:50%;
			background:#fff;
			-webkit-transform:rotateZ(0deg);
			-webkit-transform-origin: 50% 50%;
		}
		
		#coinfield.anim #coin {
			opacity:1;
			-webkit-animation-duration: 2.5s;
			-webkit-animation-fill-mode: forwards;
		}
		
		#coin.rand1 {
			-webkit-animation-name: flipCoinRandom1;
		}
		#coin.rand2 {
			-webkit-animation-name: flipCoinRandom2;
		}
		
		#coin:after {
			content:'';
			position:absolute;
			left:80px;
			right:80px;
			top:80px;
			bottom:80px;
			border:12px dashed #ccc;
			border-radius:50%;
			-webkit-animation-name: flipCoinInnerBounce;
			-webkit-animation-duration: 5s;
			-webkit-animation-iteration-count: infinite;
		}
		#coinfield.anim #coin:after {
			-webkit-animation-name: flipCoinInnerRotate;
			-webkit-animation-timing-function: linear;
		}
		#coinfield.anim #coin:before {
			content:'';
			position:absolute;
			width:120px;
			height:120px;
			background:#fff;
			top:40px;
			left:40px;
			-webkit-transform:skewX(45deg) rotateZ(25deg);
		}
		@-webkit-keyframes flipCoinRandom1 {
			from {
				-webkit-transform:rotateZ(0deg);
				}
			to {
				-webkit-transform:rotateZ(1710deg);
				}
		}
		@-webkit-keyframes flipCoinRandom2 {
			from {
				-webkit-transform:rotateZ(0deg);
			}
			to {
				-webkit-transform:rotateZ(1640deg);
			}
		}
		@-webkit-keyframes flipCoinInnerRotate {
			from {
				-webkit-transform:rotateZ(0deg);
			}
			to {
				-webkit-transform:rotateZ(360deg);
			}
		}
		@-webkit-keyframes flipCoinInnerBounce {
			0% {
				-webkit-transform:scale(1);
			}
			6% {
				-webkit-transform:scale(1);
			}
			8% {
				-webkit-transform:scale(1.2);
			}
			10% {
				-webkit-transform:scale(1);
			}
			12% {
				-webkit-transform:scale(1.1);
			}
			14% {
				-webkit-transform:scale(1);
			}
			60% {
				-webkit-transform:scale(1);
			}
			62% {
				-webkit-transform:scale(1.2);
			}
			64% {
				-webkit-transform:scale(1);
			}
			66% {
				-webkit-transform:scale(1.1);
			}
			68% {
				-webkit-transform:scale(1);
			}
			
			100% {
				-webkit-transform:scale(1);
			}

		}
		
		#panel_info .label {
			position:absolute;
			left:0px;
			right:0px;
			text-align:center;
		}
		#panel_info .label span {
			display:inline-block;
			background:rgba(0,0,0,0.4);
			border-radius:3px;
			padding:5px 10px;
			font-size:26px;
			font-weight:bold;
		}
		
		#info_player_list {
			position:absolute;
			left:0px;
			right:0px;
			top:100px;
			bottom:100px;
		}
		
		#info_player_list .item {
			position:absolute;
			top:0px;
			bottom:0px;
			width:25%;
		}
		#info_player_list.singles .item:nth-child(1) {
			left:20%;
		}
		#info_player_list.singles .item:nth-child(2) {
			right:20%;
		}
		#info_player_list.doubles .item:nth-child(1) {
			left:0%;
		}
		#info_player_list.doubles .item:nth-child(2) {
			left:25%;
		}
		#info_player_list.doubles .item:nth-child(3) {
			left:50%;
		}
		#info_player_list.doubles .item:nth-child(4) {
			left:75%;
		}
		#info_player_list .item .inner {
			position:absolute;
			top:0px;
			bottom:0px;
			left:5px;
			right:5px;
			background:rgba(255,255,255,0.2);
			border:1px solid #eee;
		}
		
		#info_player_list .item .name {
			position:absolute;
			top:10px;
			left:0px;
			right:0px;
			font-size:20px;
			padding:10px 0px;
			text-align:center;
			background:rgba(0,0,0,0.5);
		}
		#info_player_list .item .country {
			position:absolute;
			top:76px;
			left:64px;
			right:2px;
			font-size:20px;
			padding:2px 0px 2px 50px;
			overflow:hidden;
			text-align:left;
			color:#000;
			font-weight:bold;
			white-space:nowrap;
			background-size:contain;
			background-position:0% 50%;
			background-repeat:no-repeat;
		}
		#info_player_list .item .character {
			position:absolute;
			top:70px;
			left:10px;
			width:40px;
			height:40px;
			font-size:20px;
			text-align:center;
			background-color:rgba(0,0,0,0.2);
			background-size:80%;
			background-position:50% 50%;
			background-repeat:no-repeat;
		}

		#info_player_list .item .youtube,
		#info_player_list .item .twitch,
		#info_player_list .item .twitter {
			position:absolute;
			left:20px;
			right:20px;
			font-size:20px;
			overflow:hidden;
			text-align:left;
			color:#000;
			font-weight:bold;
			white-space:nowrap;
		}
		#info_player_list .item .twitter {
			top:140px;
		}
		#info_player_list .item .twitter:before {
			content:'Twitter: ';
		}
		#info_player_list .item .twitch {
			top:170px;
		}
		#info_player_list .item .twitch:before {
			content:'Twitch: ';
		}
		#info_player_list .item .youtube {
			top:200px;
		}
		#info_player_list .item .youtube:before {
			content:'Youtube: ';
		}
		
		#info_player_list .item .info-player-moveleft,
		#info_player_list .item .info-player-moveright {
			position:absolute;
			bottom:20px;
			border:0px;
			width:120px;
			height:70px;
			font-size:20px;
			font-weight:bold;
			background:#fff;
		}
		#info_player_list .item .info-player-moveright {
			right:30px;
		}
		#info_player_list .item .info-player-moveleft {
			left:30px;
		}
		#info_player_list .item:first-child .info-player-moveleft,
		#info_player_list .item:last-child .info-player-moveright {
			display:none;
		}
	</style>
</head>
<body>
	<div id="main">
		<div class="panel" id="panel_flipcoin">
			<div class="label"><span>Touch wheel to determinate who starts striking</span></div>
			<div id="flipcoin_button" onclick="flipCoin();">
				<div id="coinfield">
					<div id="coin"></div>
				</div>
			</div>
			<div class="label" style="top:470px;"><span>or decide manually</span></div>
			<div id="p1startbtn" onclick="strikeStart(1, true);">
				<span class="player1name"></span>
			</div>
			<div id="p2startbtn" onclick="strikeStart(2, true);">
				<span class="player2name"></span>
			</div>
			
		</div>
		<div class="panel" id="panel_stagestrike">
			<div id="stagestrike_info">
				<span></span>
			</div>
			<div id="stagelist">
				<div class="item" id="stageitem_fd" onclick="strike('fd');" style="background-image:url('./../assets/stages/1/fd.jpg');"></div>
				<div class="item" id="stageitem_bf" onclick="strike('bf');" style="background-image:url('./../assets/stages/1/bf.jpg');"></div>
				<div class="item" id="stageitem_dl" onclick="strike('dl');" style="background-image:url('./../assets/stages/1/dl.jpg');"></div>
				<div class="item" id="stageitem_ys" onclick="strike('ys');" style="background-image:url('./../assets/stages/1/ys.jpg');"></div>
				<div class="item" id="stageitem_fod" onclick="strike('fod');" style="background-image:url('./../assets/stages/1/fod.jpg');"></div>
			</div>
		</div>
		<div class="panel" id="panel_info">
			<div class="label" style="top:10px;"><span>Please double check your info and seat order!</span></div>
			<div class="label" style="top:60px;"><span style="font-size:14px;">Only for 1 TV setup! Nevermind on a face 2 face setup</span></div>
			<div id="info_player_list"></div>
		</div>
	</div>
	<div id="options">
		<div class="item" onclick="showPanel('blindpick');" id="option_blindpick">
			<div class="img" style="background-image:url('img/blindpick.png');"></div>
			<div class="label">Blind Pick</div>
		</div>
		<div class="item" onclick="showPanel('flipcoin');" id="option_flipcoin">
			<div class="img" style="background-image:url('img/flipcoin.png');"></div>
			<div class="label">Flip coin</div>
		</div>
		<div class="item" onclick="showPanel('stagestrike');" id="option_stagestrike">
			<div class="img" style="background-image:url('img/stagestrike.png');"></div>
			<div class="label">Striking</div>
		</div>
		<div class="item" onclick="showPanel('info');" id="option_info">
			<div class="img" style="background-image:url('img/info.png');"></div>
			<div class="label">Info</div>
		</div>
		<div class="item" onclick="showPanel('about');" id="option_about">
			<div class="img" style="background-image:url('img/about.png');"></div>
			<div class="label">Upload?</div>
		</div>
	</div>
	<div id="screenlock"></div>
</body>
</html>