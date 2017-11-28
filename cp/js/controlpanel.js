var DEBUG_MODE = true;

var ws;

var profile = {};
var themeslist = [];
var playerdatabaselist = [];
var teamdatabaselist = [];
var countrydatabaselist = [];
var gamedatabaselist = [];
var characterdatabaselist = [];

var playerSeatingOrder = [];
var dbRefreshTimestamps = {};

var _game,_playstyle,_autoupdate,_autoUpdateTimeout;

var shortcuts = {
	s: function(){
		update();
	},
	d: function(){
		if($("#main").hasClass("sideedit")){
			closePlayerSidePanel();
		}else{
			openPlayerSidePanel(0);
		}
	}
	
};

window.onmousemove = checkMousemove;
window.onload = init;


function checkMousemove(e){
	var $clockItem = $("#clock");
	
	var clockOffset = $clockItem.offset();
	if(clockOffset){
		if(e.clientX > clockOffset.left && e.clientY > clockOffset.top){
			$("#clock").addClass("hidden");
		}else{
			$("#clock").removeClass("hidden");
		}
	}
	
}

function init(){
	holdEvent("checkplayername");
	loadProfile(function(){
		refreshThemesList();
		refreshCountrydatabase();
		refreshMusicList();
	
		changePlaystyle(_playstyle);
		
		initSmashgg();
		
		insertScoreboardData(profile.scoreboarddata);
		
		if(profile.dest_websocket){
			startWS('ws://'+serverip+':5000');
		}
		
		triggerEvent("init");
	});
	

	showContent();
	
	updateClock();
	setInterval("updateClock()", 30000);
}


function startWS(websocketServerLocation){
	if(ws == undefined || ws.readyState == undefined || ws.readyState === ws.CLOSED){
		ws = new WebSocket(websocketServerLocation);
		ws.onmessage = function(evt) { 
			var wsdata = JSON.parse(evt.data);
			
			triggerEvent("ws-"+wsdata.type, {"msg":wsdata.data});
			
			if(wsdata.type == 'scoreboardinfo'){
				insertScoreboardData(wsdata.data);
			}
			if(wsdata.type == 'event'){
				triggerEvent(wsdata.data.name, wsdata.data.val);
			}
			if(wsdata.type == 'moveseat'){
				moveSeatingOrder(wsdata.data.seat, wsdata.data.movement);
			}
			if(wsdata.type == 'command'){
				if(_autoupdate)
					eval(wsdata.value);
			}
			
			
			
		};
		ws.onopen = function(){
			log("WS connected", LOGTYPE.INFO);
			triggerEvent("wsconnected");
		}
		ws.onclose = function(){
			log("WS CLOSED, reconnect", LOGTYPE.INFO);
			setTimeout(function(){startWS(websocketServerLocation)}, 5000);
		};
	}
}

function insertScoreboardData(data){
	profile.scoreboarddata = data;
	sendDataToTopbar(data);
	if(data.game != undefined && _game != data.game){
		changeGame(data.game);
	}
	if(data.playstyle != undefined && _playstyle != data.playstyle){
		changePlaystyle(data.playstyle);
	}
	if(data.player != undefined){
		for(pField in data.player){
			var pObj = data.player[pField];
			var iconurl = "";
			if(pObj.character.cid >= 1 && pObj.character.ccid.length > 0)
				iconurl = "./../assets/characters/stock/"+_game+"/"+pObj.character.cid+"_"+pObj.character.ccid+".png";
			$("#sb-pid"+pField).val(pObj.id);
			$("#sb-charid"+pField).val(pObj.character.cid);
			$("#sb-charcostumeid"+pField).val(pObj.character.ccid);
			$("#sb-pc"+pField).css("background-image", "url('"+iconurl+"')");
			$("#sb-pn"+pField).val(pObj.nickname).trigger("oninput");
		}
	}
	if(data.score != undefined){
		$("#sb-ps1").val(data.score[1]);
		$("#sb-ps2").val(data.score[2]);
	}
	if(data.round != undefined){
		$("#sb-field-round").val(data.round);
	}
	if(data.event != undefined){
		$("#sb-field-event").val(data.event);
	}

	insertFieldValues();
	insertCasterValues();
	triggerEvent("scoreboarddatachanged");
}

//{ PROFILE SAVE/LOAD/MANIPULATE

function loadProfile(selectProfile, callback){
	if(callback == undefined){
		callback = selectProfile;
		selectProfile = 0;
	}
	loadAjax("profilelist", selectProfile, function(data){
		profile = data.current;
		_game = profile.scoreboarddata.game;
		_playstyle = profile.scoreboarddata.playstyle;
		triggerEvent("profileloaded");
		callback();
	});
}

function saveProfile(){
	loadAjax("saveprofileentry", profile, function(data){
		if(data.success){
			log("Profile saved", LOGTYPE.INFO);
		}else{
			alert("saveProfile() error trying to save profile");
		}
	});	
}

//} PROFILE SAVE/LOAD/MANIPULATE 

//{ REFRESH DATABASE

function refreshPlayerdatabase(callback){
	//playerdatabaselist = [];
	if(dbRefreshTimestamps.player === undefined)
		dbRefreshTimestamps.player = 0;
	triggerEvent('refreshplayerdatabase', {state:1});
	loadAjax("playerlist", {"timestamp":dbRefreshTimestamps.player}, function(data){
		playerDatabaseMerge(data);
		dbRefreshTimestamps.player = parseInt(data.timestamp);
		triggerEvent('refreshplayerdatabase', {state:2});
		if(typeof(callback) == "function")
			callback();
	});
}
$(window).on('playerdatabasechanged init', refreshPlayerdatabase);

function playerDatabaseMerge(data) {
	for(var i in data.list){
		var new_po = data.list[i];
		var found = false;
		for(var o in playerdatabaselist){
			var po = playerdatabaselist[o];
			if(po.id == new_po.id){
				playerdatabaselist[o] = new_po;
				found = true;
			}
		}
		if(!found)
			playerdatabaselist.push(new_po);
	}
	for(var i in playerdatabaselist)
		if(data.idlist.indexOf(playerdatabaselist[i].id) === -1)
			playerdatabaselist.splice(i, 1);
}

function refreshTeamdatabase(){
	teamdatabaselist = [];
	triggerEvent('refreshteamdatabase', {state:1});
	loadAjax("teamlist", function(data){
		teamdatabaselist = data.list;
		triggerEvent('refreshteamdatabase', {state:2});
	});
}
$(window).on('teamdatabasechanged init', refreshTeamdatabase);

function refreshCountrydatabase(){
	countrydatabaselist = [];
	triggerEvent('refreshcountrydatabase', {state:1});
	loadAjax("countrylist", function(data){
		countrydatabaselist = data.list;
		triggerEvent('refreshcountrydatabase', {state:2});
	});
}

function refreshGamedatabase(){
	gamedatabaselist = [];
	triggerEvent('refreshgamedatabase', {state:1});
	loadAjax("gameslist", function(data){
		gamedatabaselist = data.list;
		triggerEvent('refreshgamedatabase', {state:2});
	});
}
$(window).on('gamedatabasechanged init', refreshGamedatabase);

function refreshThemesList(){
	themeslist = [];
	triggerEvent('refreshthemeslist', {state:1});
	loadAjax("themeslist", function(data){
		themeslist = data.list;
		triggerEvent('refreshthemeslist', {state:2});
	});
}

function refreshCharacterList(callback){
	characterdatabaselist = [];
	loadAjax("characterlist", function(data){
		characterdatabaselist = data.list;
		resetCharacters();
		if(typeof(callback) == "function")
			callback();
	});
}
$(window).on('characterdatabasechanged init', refreshCharacterList);


//} REFRESH DATABASE

//{ CHANGE 

function changeGame(val){
	
	var gameChange = _game != val;
	
	// dont let garbage let mess with settings
	if(val != undefined && val > 0){
		_game = val;
	}
	
	// if game is already messed up, get ID of first game in list, huge fallback!
	if(_game == undefined || _game <= 0){
		_game = gamedatabaselist[0].id;
	}
	
	if(gameChange)
		resetCharacters();
	$("#gameselect").val(_game);
}

function changeTheme(val){
	profile.theme = val;
	$(".global_themelist").val(profile.theme);
	
	// fix dynamic fields
	insertLowerthirdFields();
	insertCasterFields();
}

function changePlaystyle(mode){
	// dont let garbage let mess with settings
	if(mode != undefined && mode.length > 0){
		_playstyle = mode;
	}
	
	// if game is already messed up, get ID of first game in list, huge fallback!
	if(_playstyle == undefined || _playstyle.length == 0){
		_playstyle = "singles";
	}

	buildSeatingOrderField();
	orderSeatingOrderField();
	
	$('#sb-main').removeClass('singles doubles crews').addClass(_playstyle);
	$("#playstyleselect").val(_playstyle);
}


//} CHANGE 

function buildSeatingOrderField(){
	
	var playerFields = ["1","2"];
	if(_playstyle == "doubles" && playerFields.length == 2){
		playerFields.push("12");
		playerFields.push("22");
	}else if(_playstyle != "doubles" && playerFields.length == 4){
		var toremove = playerFields.indexOf("12");
		if(toremove != -1)
			playerFields.splice(toremove, 1);
		toremove = playerFields.indexOf("22");
		if(toremove != -1)
			playerFields.splice(toremove, 1);
	}
	
	playerSeatingOrder = playerFields;
	
	// insert
	for(fieldIndex in playerFields){
		var pf = playerFields[fieldIndex];
		
		// create if not in
		if($("#sb-player-seating-order #sb-pso-p"+pf).length == 0){
			var $item = $('<div class="item" />');
			$item.attr("id", "sb-pso-p"+pf);
			$item.append('<div class="nickname">'+ $("#sb-pn"+pf).val() +'</div>');
			$item.append('<div class="moveleft" onclick="moveSeatingOrder(\''+pf+'\',-1);">&#8678;</div>');
			$item.append('<div class="moveright" onclick="moveSeatingOrder(\''+pf+'\',1);">&#8680;</div>');
			$("#sb-player-seating-order").append($item);
		}
	}
	
	// remove
	$("#sb-player-seating-order .item").each(function(k,v){
		var pfield = $(v).attr("id").substr(8);
		if(playerFields.indexOf(pfield) == -1){
			$(v).remove();
		}
	});
}

//{ SEATING ORDER

function orderSeatingOrderField(){
	$("#sb-player-seating-order .item").each(function(k,v){
		var pfield = $(v).attr("id").substr(8);
		var pos = playerSeatingOrder.indexOf(pfield);
		if(k != pos && pos >= 0){
			 $(v).insertBefore($("#sb-player-seating-order .item")[pos]);
		}
	});
}

function swapSeatingOrder(elm1, elm2){
	var currentPos1 = playerSeatingOrder.indexOf(elm1+"");
	var currentPos2 = playerSeatingOrder.indexOf(elm2+"");
	var temp = playerSeatingOrder[currentPos1];
	playerSeatingOrder[currentPos1] = playerSeatingOrder[currentPos2];
	playerSeatingOrder[currentPos2] = temp;
	orderSeatingOrderField();
}

function moveSeatingOrder(pField, movement){
	pField = pField.toString();
	var currentPos = playerSeatingOrder.indexOf(pField);
	var newPos = currentPos+movement;
	if(newPos >= 0 && newPos <= playerSeatingOrder.length-1){
		playerSeatingOrder.splice(newPos, 0, playerSeatingOrder.splice(currentPos, 1)[0])
		orderSeatingOrderField();
	}
	triggerEvent("autoupdate");
}

//} SEATING ORDER

function toggleAutoUpdate(value){
	if(value == undefined){
		_autoupdate = !_autoupdate;
	}else{
		_autoupdate = value;
	}
	if(_autoupdate){
		$("#update-area").addClass("autoupdate");
		triggerGlobalEvent("disableAutoUpdate", null, true);
	}else{
		$("#update-area").removeClass("autoupdate");
	}
}

function resetCharacters(){
	console.log("5z7823zh7834gfh834fh678");
	var playerFields = ["1","12","2","22"];
	var doUpdate = false;
	for(pfindex in playerFields){
		var pf = playerFields[pfindex];
		var cid = $("#sb-charid"+pf).val();
		var co = getCharacterById(cid);
		if(co == null || co.game != _game){
			$("#sb-charid"+pf+", #sb-charcostumeid"+pf).val(0);
			$("#sb-pc"+pf).css("background-image","");
			doUpdate = true;
		}
	}
	if(doUpdate)
		triggerEvent("autoupdate");
}


function getCharactersByGame(game, sortby){
	var list = [];
	for(index in characterdatabaselist)
		if(characterdatabaselist[index].game == game)
			list.push(characterdatabaselist[index]);
	if(sortby != undefined && list.length > 0){
		list.sort(function (a, b) {
			if (a[sortby] > b[sortby]) 
				return -1;
			if (a[sortby] < b[sortby])
				return 1;
			return 0;
		});
	}
	return list;
}

function getCharacterById(cid){
	for(index in characterdatabaselist)
		if(characterdatabaselist[index].id == cid)
			return characterdatabaselist[index];
	return null;
}

function isCharacterIdIsInDatabaseList(cid){
	return (getCharacterById(cid) !== null);
}

function sbSwapPlayers(side){
	
	var pn,pid,cid,ccid,score;
	
	if(side == 0){
		pn = $("#sb-pn1").val();
		pid = $("#sb-pid1").val();
		cid = $("#sb-charid1").val();
		ccid = $("#sb-charcostumeid1").val();
		
		$("#sb-pn1").val($("#sb-pn2").val());
		$("#sb-pid1").val($("#sb-pid2").val());
		$("#sb-charid1").val($("#sb-charid2").val());
		$("#sb-charcostumeid1").val($("#sb-charcostumeid2").val());
		
		$("#sb-pn2").val(pn);
		$("#sb-pid2").val(pid);
		$("#sb-charid2").val(cid);
		$("#sb-charcostumeid2").val(ccid);
		
		pn = $("#sb-pn12").val();
		pid = $("#sb-pid12").val();
		cid = $("#sb-charid12").val();
		ccid = $("#sb-charcostumeid12").val();
		
		$("#sb-pn12").val($("#sb-pn22").val());
		$("#sb-pid12").val($("#sb-pid22").val());
		$("#sb-charid12").val($("#sb-charid22").val());
		$("#sb-charcostumeid12").val($("#sb-charcostumeid22").val());
		
		$("#sb-pn22").val(pn);
		$("#sb-pid22").val(pid);
		$("#sb-charid22").val(cid);
		$("#sb-charcostumeid22").val(ccid);
		
		score = $("#sb-ps1").val();
		$("#sb-ps1").val($("#sb-ps2").val());
		$("#sb-ps2").val(score);
		
		swapSeatingOrder("1","2");
		swapSeatingOrder("12","22");
		
	}else{
		pn = $("#sb-pn"+side).val();
		pid = $("#sb-pid"+side).val();
		cid = $("#sb-charid"+side).val();
		ccid = $("#sb-charcostumeid"+side).val();
		
		$("#sb-pn"+side).val($("#sb-pn"+side+"2").val());
		$("#sb-pid"+side).val($("#sb-pid"+side+"2").val());
		$("#sb-charid"+side).val($("#sb-charid"+side+"2").val());
		$("#sb-charcostumeid"+side).val($("#sb-charcostumeid"+side+"2").val());
		
		$("#sb-pn"+side+"2").val(pn);
		$("#sb-pid"+side+"2").val(pid);
		$("#sb-charid"+side+"2").val(cid);
		$("#sb-charcostumeid"+side+"2").val(ccid);
		
		swapSeatingOrder(side, side+"2");
	}
	correctPlayerFields();
}

function correctPlayerFields(){
	var fields = ["1","2","12","22"];
	$.each(fields, function(k,v){
		var pid = $("#sb-pid"+v).val();
		var cid = $("#sb-charid"+v).val();
		var ccid = $("#sb-charcostumeid"+v).val();
		
		var playerObj = getPlayerById(pid);
		if(pid == 0)
			playerObj.nickname = $("#sb-pn"+v).val();
		$("#sb-pn"+v).val(playerObj.nickname).trigger("oninput");
		
		var iconurl = "";
		if(cid >= 1 && ccid.length > 0)
			iconurl = "./../assets/characters/stock/"+_game+"/"+cid+"_"+ccid+".png";
		
		$("#sb-pc"+v).css("background-image", "url('"+iconurl+"')");
	});
	triggerEvent("autoupdate");
}

function resetScore(){
	$("#sb-ps1, #sb-ps2").val(0);
	triggerEvent("autoupdate");
}

function modifyScore(team, amount){
	var value = parseInt($("#sb-ps"+team).val());
	value += amount;
	if(value < 0)
		value = 0;
	$("#sb-ps"+team).val(value);
	triggerEvent("autoupdate");
}

function quickSBScorePlus(team, current){
	current = parseInt(current);
	current++;
	$("#sb-ps"+team).val(current);
	update();
}

/*
clearBoard()
 - clears score, name and characters
*/
function clearBoard(){
	holdEvent("autoupdate");
	resetScore();
	assignCharacter(0,"0",1,1);
	assignCharacter(0,"0",1,2);
	assignCharacter(0,"0",2,1);
	assignCharacter(0,"0",2,2);
	$("#sb-pn1,#sb-pn12,#sb-pn2,#sb-pn22").val("").trigger("oninput");
	releaseEvent("autoupdate");
	triggerEvent("autoupdate");
}

function openCharacterSelectPanel(team, player){
	var onclickFunction;
	var frag = document.createDocumentFragment();
	var internPlayerFieldID = team+(player == 2 ? '2' : '');
	var currentCharId = $("#sb-charid"+internPlayerFieldID).val();
	var charList = getCharactersByGame(_game);
	
	$("#sb-character-select-panel .character-costumes").html('');
	$("#sb-character-select-panel .last-used").html('');
	
	for(index in charList){
		var c = charList[index];
		if(c.costumes.length > 1)
			onclickFunction = 'showCharacterCostumes('+c.id+','+team+','+player+');';
		else
			onclickFunction = 'assignCharacter('+c.id+',\'default\','+team+','+player+');';
		var iconurl = "./../assets/characters/stock/"+_game+"/"+c.id+"_default.png";
		$(frag).append('<div class="item'+(c.costumes.length > 1 ? ' hascostumes' : '')+'" id="sb-characterselect-item-'+c.id+'" style="background-image:url(\''+iconurl+'\');" onclick="'+onclickFunction+'"></div>');
	}
	
	$(frag).append('<div class="item" id="sb-characterselect-item-0" onclick="assignCharacter(0,\'0\','+team+','+player+')"></div>');
	$("#sb-character-select-panel .character-list").html(frag);

	$("#sb-characterselect-item-"+currentCharId).addClass("selected");
	$("#sb-characterselect-item-"+currentCharId+".hascostumes").click();
	
	showModal("sb-character-select-panel");
}

function showCharacterCostumes(charid, team, player){
	var internPlayerFieldID = team+(player == 2 ? '2' : '');
	var characterObj = getCharacterById(charid);
	var frag = document.createDocumentFragment();
	var currentCharId = $("#sb-charid"+internPlayerFieldID).val();
	var currentCostumeId = $("#sb-charcostumeid"+internPlayerFieldID).val();
	
	
	if(characterObj == null){
		alert("unexpected error in showCharacterCostumes()");
		return;
	}
	for(index in characterObj.costumes){
		var costume = characterObj.costumes[index];
		var iconurl = "./../assets/characters/stock/"+_game+"/"+characterObj.id+"_"+costume+".png";
		$(frag).append('<div class="item" id="sb-costumesselect-item-'+characterObj.id+"_"+costume+'" style="background-image:url(\''+iconurl+'\');" onclick="assignCharacter('+characterObj.id+', \''+costume+'\', '+team+', '+player+')">'+costume+'</div>');
	}
	$("#sb-character-select-panel .character-costumes").html(frag);
	$("#sb-character-select-panel .character-list .item").removeClass("selected");
	$("#sb-characterselect-item-"+charid).addClass("selected");
	$("#sb-costumesselect-item-"+currentCharId+"_"+currentCostumeId).addClass("selected");
	
}

function assignCharacter(charid, costume, team, player) {
	var internPlayerFieldID = team+(player == 2 ? '2' : '');
	var iconurl = "./../assets/characters/stock/"+_game+"/"+charid+"_"+costume+".png";
	$("#sb-pc"+internPlayerFieldID).css("background-image",'url("'+iconurl+'")');
	$("#sb-charid"+internPlayerFieldID).val(charid);
	$("#sb-charcostumeid"+internPlayerFieldID).val(costume);
	triggerEvent("autoupdate");
	hideModal();
}

function checkPlayerName(player){
	var playerName = $("#sb-pn"+player).val();
	var playerID = 0;
	var smashggID = 0;
	var playerList = getPlayersByNickname(playerName);
	
	var $playerfield = $("#sb-playerfield"+player);
	
	
	$playerfield.children(".multiname-btn, .editplayer-btn, .smashgg-profile-btn").prop("disabled", true);
	// if there are players, get ID from first (recently used)
	if(playerList.length >= 1){
		playerID = playerList[0].id;
		playerName = playerList[0].nickname;
		smashggID = playerList[0].smashgg;
	}
	
	// if there are more than 1, activate multiname icon
	if(playerList.length > 1){
		$playerfield.children(".multiname-btn").prop("disabled", false);
	}
	
	if(playerID != 0){
		$playerfield.children(".editplayer-btn").prop("disabled", false);
	}
	if(smashggID != 0){
		$playerfield.children(".smashgg-profile-btn").prop("disabled", false);
	}

	$("#sb-pid"+player).val(playerID);
	if(playerName != $("#sb-pn"+player).val())
		$("#sb-pn"+player).val(playerName);
	
	// insert into seating order field
	$("#sb-pso-p"+player+" .nickname").text(playerName);
	
	triggerEvent("autoupdate", {"threshold":true});
}

function openMultiNamePlayerSelectPanel(player){
	var playerName = $("#sb-pn"+player).val();
	var playerID = $("#sb-pid"+player).val();
	var playerList = getPlayersByNickname(playerName);
	var $panel = $("#sb-multiname-selection-panel");

	$panel.children(".wrap").html('');
	for(k in playerList){
		var po = playerList[k];
		var html = '<div class="item'+(playerID == po.id ? ' active' : '')+'" onclick="multiNameSetPlayerId('+po.id+','+player+');">';
		html += '<div class="photo" style="background-image:url(\'./../assets/player/image.php?pid='+po.id+'&s=200\');"></div>';
		html += '<div class="nickname">'+po.nickname+'</div>';
		html += '<div class="fullname">'+po.firstname+' '+po.lastname+'</div>';
		html += '<div class="country">'+po.countryname+'</div>';
		html += '</div>';
		$panel.children(".wrap").append(html);
	}
	showModal("sb-multiname-selection-panel");
}

function multiNameSetPlayerId(pid, pfield){
	var playerObj = getPlayerById(pid);
	$("#sb-pid"+pfield).val(playerObj.id);
	$("#sb-pn"+pfield).val(playerObj.nickname);
	triggerEvent("autoupdate");
	hideModal();
}


function getPlayerById(playerID, fullProfile){
	if(fullProfile === undefined)
		fullProfile = true;
	var playerObj = {"id":"0","nickname":"","country":"0","displayname":"","twitter":"","youtube":"","twitch":"","firstname":"","lastname":"","teams":[]};
	for(index in playerdatabaselist){
		if(playerdatabaselist[index].id == playerID){
			playerObj = playerdatabaselist[index];
			break;
		}
	}
	// if displayname is empty, generate it
	if(playerObj.displayname.length == 0){
		playerObj.generateddisplayname = "";
		// if player has 1 or more teams
		if(playerObj.teams.length > 0){
			var teamPrefixArray = [];
			for(teamindex in playerObj.teams)
				teamPrefixArray.push(playerObj.teams[teamindex].prefix);
			playerObj.generateddisplayname += teamPrefixArray.join(" ") + " | ";
		}
		// add nickname at the end
		playerObj.generateddisplayname += playerObj.nickname;
	}else{
		playerObj.generateddisplayname = playerObj.displayname;
	}
	
	if(!fullProfile){
		return {
			id:						playerObj.id,
			nickname:				playerObj.nickname,
			smashgg:				playerObj.smashgg,
			country:				playerObj.country,
			countryname:			playerObj.countryname,
			twitch:					playerObj.twitch,
			twitter:				playerObj.twitter,
			youtube:				playerObj.youtube,
			generateddisplayname:	playerObj.generateddisplayname
		};
	}
	
	return playerObj;
}
function savePlayer(playerObj){


	loadAjax("saveplayerentry", playerObj, function(data){
		if(data.success){
			triggerGlobalEvent("playerdatabasechanged");
		}else{
			alert("error saving player entry");
		}
	});
}

function getPlayersByNickname(name){
	var nameLow = name.toLowerCase();
	var playerArr = [];
	
	for(k in playerdatabaselist){
		var v = playerdatabaselist[k];
		if(v.nickname.toLowerCase() == nameLow)
			playerArr.push(v);
	}
	
	if(playerArr.length > 1){
		playerArr.sort(function (a, b) {
			if (a.laststreamactivity > b.laststreamactivity) 
				return -1;
			if (a.laststreamactivity < b.laststreamactivity)
				return 1;
			return 0;
		});
		
		// put letter sensitive matched name on top
		for(index in playerArr){
			if(playerArr[index].nickname === name){
				// case sensitive matched!
				playerArr.splice(0, 0, playerArr.splice(index, 1)[0]);
				break;
			}
		}
	}
	return playerArr;
}
function getPlayerBySmashggID(smashggID){
	for(index in playerdatabaselist)
		if(playerdatabaselist[index].smashgg == smashggID)
			return playerdatabaselist[index];
	return null;
}

function getCountryByName(countryName){
	for(index in countrydatabaselist)
		if(countrydatabaselist[index].name.toLowerCase() == countryName.toLowerCase())
			return countrydatabaselist[index];
	return null;
}

function getCountryById(countryID){
	for(index in countrydatabaselist)
		if(countrydatabaselist[index].id == countryID)
			return countrydatabaselist[index];
	return null;
}


function changePlayerState(team, sender){
	var value = 0;
	var $cbxw = $("#pstate"+team+"-winners");
	var $cbxl = $("#pstate"+team+"-losers");
	var $cbxval = $("#sb-pstate"+team);
	
	if(sender == "winners" && $cbxw.prop("checked"))
		$cbxl.prop("checked", false);
	else if($cbxl.prop("checked"))
		$cbxw.prop("checked", false);
	
	if($cbxw.prop("checked"))
		value = 1;
	if($cbxl.prop("checked"))
		value = 2;

	$cbxval.val(value);
	triggerEvent("autoupdate");
}

function prepareSmashggProfile(playerID, btn){
	$(btn).prop("disabled", true);
	var playerObj = getPlayerById(playerID);
	if(playerObj.smashgg && playerObj.smashgg != 0){
		$.ajax({
			url: "http://"+window.location.hostname+":5001/"+playerObj.smashgg,
		}).always(function(){
			$(btn).prop("disabled", false);
		});
	}
}

function openPlayerSidePanel(playerID){
	var nickname = "";
	if(!playerID || playerID == 0){
		var $focused = $(document.activeElement);
		if($focused.hasClass("playername") && typeof($focused.data("pf")) != 'undefined'){
			var pf = $focused.data("pf");
			playerID = $("#sb-pid"+pf).val();
			nickname = $("#sb-pn"+pf).val();
		}
	}
	
	$("#sideedit .save, #sideedit .remove").removeClass("non-enable");
	
	var playerObj = getPlayerById(playerID);
	if(playerID == 0){
		$("#sideedit .title").text('Create new player');
		$("#sideedit .save, #sideedit .remove").addClass("non-enable");
		
		playerObj.nickname = nickname;
	}else{
		$("#sideedit .title").text('Edit player');
	}
	$("#se-userid").val(playerObj.id);
	$("#se-nickname").val(playerObj.nickname);
	$("#se-displayname").val(playerObj.displayname);
	$("#se-firstname").val(playerObj.firstname);
	$("#se-lastname").val(playerObj.lastname);
	$("#se-twitter").val(playerObj.twitter);
	$("#se-twitch").val(playerObj.twitch);
	$("#se-youtube").val(playerObj.youtube);
	$("#se-country").val(playerObj.country);
	$("#se-smashgg-id").val(playerObj.smashgg);
	$("#se-team option").prop("selected", false);
	if(playerObj.teams.length > 0){
		$.each(playerObj.teams, function(k,v){
			$("#se-team option[value='"+v.id+"']").prop("selected", true);
		});
	}

	$("#main").addClass("sideedit");
	$("#sideedit *:not(.non-enable)").prop("disabled", false);
	$("#se-nickname").focus();
}

function savePlayerSidePanel(newEntry){
	var playerID = $("#se-userid").val();
	if(newEntry)
		playerID = 0;
	var playerObj = getPlayerById(playerID);

	// modify data

	playerObj.nickname = $("#se-nickname").val();
	playerObj.displayname = $("#se-displayname").val();
	playerObj.firstname = $("#se-firstname").val();
	playerObj.lastname = $("#se-lastname").val();
	playerObj.twitter = $("#se-twitter").val();
	playerObj.twitch = $("#se-twitch").val();
	playerObj.youtube = $("#se-youtube").val();
	playerObj.country = $("#se-country").val();
	playerObj.smashgg = $("#se-smashgg-id").val();
	playerObj.teams = [];
	var teams = $("#se-team").val();
	if(teams.length > 0)
		for(k in teams)
			playerObj.teams.push(getTeamById(teams[k]));
	savePlayer(playerObj);
	closePlayerSidePanel();
}

function removePlayerSidePanel(){
	var playerID = $("#se-userid").val();
	if(!playerID || playerID <= 0)
		return;
	
	// send data
	loadAjax("removeplayerentry", {id:playerID}, function(data){
		if(data.success){
			closePlayerSidePanel();
			triggerGlobalEvent("playerdatabasechanged");
		}else{
			alert("error removing player entry");
		}
	});
}

function closePlayerSidePanel(){
	$("#main").removeClass("sideedit");
	$("#sideedit *").attr("disabled", true);
}



function getTeamById(teamID){
	for(k in teamdatabaselist)
		if(teamdatabaselist[k].id == teamID)
			return teamdatabaselist[k];
	return null;
}


function gpSelectGame(value){
	var charlist = getCharactersByGame(value);
	var charSelect = $("#gp-characterselect").val();
	
	$("#gp-gameselect, #gp-addcharacter-game").val(value);
	$("#gp-characterselect").html('').prop("disabled", true);
	$("#gp-addcharacter-btn").prop("disabled", false);

	
	if(charlist.length > 0){
		for(k in charlist)
			$("#gp-characterselect").append('<option value="'+charlist[k].id+'">'+charlist[k].name+'</option>');

		$("#gp-characterselect").prop("disabled", false);
		if($("#gp-characterselect option[value='"+charSelect+"']").length > 0){
			$("#gp-characterselect").val(charSelect);
		}else if($("#gp-characterselect option").length > 0){
			$("#gp-characterselect option:first").attr('selected','selected');
		}else{
			$("#gp-characterselect").prop("disabled", true);
		}
	}
	$("#gp-characterselect").change();
}

function gpSelectCharacter(value){
	var charObj = getCharacterById(value);
	
	$("#gp-addcostume-characterid").val(value);
	$("#gp-addcostume-btn").prop("disabled", !(value >= 1));
	$("#gp-costumeselect").html('').prop("disabled", true);
	
	if(charObj == null)
		return;
	if(charObj.costumes.length > 0){
		for(index in charObj.costumes){
			var costume = charObj.costumes[index];
			$("#gp-costumeselect").append('<option value="'+costume+'">'+costume+'</option>');
		}
		$("#gp-costumeselect option:first").attr('selected','selected');
		$("#gp-costumeselect").prop("disabled", false);
	}
	$("#gp-costumeselect").change();
}

function addGame(closePanel){
	var name = $("#gp-addgame-name").val().trim();
	var shortname = $("#gp-addgame-short").val().trim();
	if(name.length == 0 || shortname.length == 0)
		return;
	$("#gp-addGamePanel").prop("disabled", true);
	loadAjax("savegameentry", {"id":"0", "name":name, "shortname":shortname}, function(data){
		$("#gp-addGamePanel").prop("disabled", false);
		$("#gp-addgame-name, #gp-addgame-short").val('');
		if(data.success){
			triggerGlobalEvent("gamedatabasechanged");
			if(closePanel)
				hideModal();
		}else{
			alert("error in addGame();");
		}
	});
}

function addCharacter(closePanel){
	var name = $("#gp-addcharacter-name").val().trim();
	var shortname = $("#gp-addcharacter-short").val().trim();
	var file = $("#gp-addcharacter-file").prop('files')[0];
	var game = $("#gp-addcharacter-game").val().trim();

	if(name.length == 0 || shortname.length == 0 || game == 0 || file == undefined)
		return;
	
	$("#gp-addCharacterPanel").prop("disabled", true);

	loadAjax("savecharacterentry", {"id":"0", "name":name, "shortname":shortname, "game":game}, function(data){
		$("#gp-addCharacterPanel").prop("disabled", false);
		$("#gp-addcharacter-name, #gp-addcharacter-short").val('');
		if(data.success){
			addCostume(closePanel, data.insert_id, 'default', file);
		}else{
			alert("error in addCharacter();");
		}
	});
}

function addCostume(closePanel, characterid, name, file){
	if(characterid == undefined)
		characterid = $("#gp-addcostume-characterid").val();
	if(name == undefined)
		name = $("#gp-addcostume-name").val();
	if(file == undefined)
		file = $("#gp-addcostume-file").prop('files')[0];
	loadAjaxFileUpload("savecostumeentry", {"id":"0", "name":name, "character":characterid}, file, function(data){
		$("#gp-addCostumePanel").prop("disabled", false);
		$("#gp-addcostume-name").val('');
		if(data.success){
			refreshCharacterList(function(){
				$("#gp-gameselect").change();
				if(closePanel)
					hideModal();
			});
		}else{
			alert("error in addCharacter();");
		}
	});
}

function getThemeByName(name){
	for(k in themeslist)
		if(themeslist[k].name == name)
			return themeslist[k];
	return null;
}

function insertCasterFields(){
	var themeObj = getThemeByName(profile.theme);
	var $sbcasters = $("#sb-casters");
	
	if(themeObj.casters == undefined)
		themeObj.casters = 2;
	themeObj.casters = parseInt(themeObj.casters);
	
	var currentCasterCount = $sbcasters.children(".item").length;
	// insert
	for(var index = currentCasterCount;index < themeObj.casters; index++){
		var $item = $('<div class="item" id="caster-item-'+index+'" />');
		$('<select onchange="sbCasterInput(this, \''+index+'\');" class="global_casterlist" />').appendTo($item);
		$('<div class="info"><div class="photo" /><div class="name" /><div class="realname" /><div class="flag" /><div class="twitter" /><div class="twitch" /><div class="edit" /><div class="move-left" /><div class="move-right" /></div>').appendTo($item);
		$item.appendTo($sbcasters);
	}
	// remove
	for(var index = themeObj.casters; index < currentCasterCount; index++)
		$('#caster-item-'+index).remove();
	insertCasterOptions();
}

function insertCasterValues(){
	var casterIDs = {};
	for(index in profile.scoreboarddata.caster)
		if(profile.scoreboarddata.caster[index])
			casterIDs[index] = parseInt(profile.scoreboarddata.caster[index].id);
	for(index in casterIDs)
		$('#caster-item-'+index+" select").val(casterIDs[index]).trigger("onchange");
}

function sbCasterInput(origin, index){
	var value = $(origin).val();
	var playerObj = getPlayerById(value);
	$("#caster-item-"+index+" .info .photo").css("background-image","url('./../assets/player/image.php?pid="+playerObj.id+"&s=70')");
	$("#caster-item-"+index+" .info .name").text(playerObj.nickname);
	$("#caster-item-"+index+" .info .realname").text(playerObj.firstname +" "+playerObj.lastname);
	$("#caster-item-"+index+" .info .twitter").text(playerObj.twitter);
	$("#caster-item-"+index+" .info .twitch").text(playerObj.twitch);
	
	$("#caster-item-"+index+" .info .edit").html('<button onclick="openPlayerSidePanel('+playerObj.id+');"></button>');
	$("#caster-item-"+index+" .info .move-left").html('<button onclick="moveCaster('+index+',-1);">&larr;</button>');
	$("#caster-item-"+index+" .info .move-right").html('<button onclick="moveCaster('+index+',1);">&rarr;</button>');
	
	$("#caster-item-"+index+" .info .flag").css("background-image","url('./../assets/flags/lowres/"+playerObj.country+".png')");

	triggerEvent("autoupdate", {threshold:false});
}

function moveCaster(index, movement){
	var current = parseInt(index);
	var moveWith = current + parseInt(movement);
	
	var casterInputCount = $("#sb-casters .item").length;
	
	if(moveWith < 0 || moveWith >= casterInputCount)
		return;
	
	var idCurrent = $("#sb-casters .item").eq(current).children("select").val();
	var idMoveWith = $("#sb-casters .item").eq(moveWith).children("select").val();
	
	$("#sb-casters .item").eq(current).children("select").val(idMoveWith);
	$("#sb-casters .item").eq(moveWith).children("select").val(idCurrent);
	
	sbCasterInput($("#sb-casters .item").eq(current).children("select"), current);
	sbCasterInput($("#sb-casters .item").eq(moveWith).children("select"), moveWith);
}

function insertCasterOptions(){
	var frag = document.createDocumentFragment();
	$('<option value="0"> - None - </option>').appendTo(frag);
	for(index in playerdatabaselist){
		var v = playerdatabaselist[index];
		$('<option value="'+v.id+'">'+v.nickname+' ('+v.countryname+')</option>').appendTo(frag);
	}
	$(".global_casterlist").html(frag)
	insertCasterValues();
}

function insertLowerthirdFields(){
	var themeObj = getThemeByName(profile.theme);
	var fields = document.createDocumentFragment();
	var sbfields = document.createDocumentFragment();
	
	for(k in themeObj.fields){
		var field = themeObj.fields[k];
		var $newRow = $('<div class="row" id="lt-field-'+field.name+'" />');
		$newRow.append('<div class="label">'+(field.label ? field.label : field.name)+'</div>');
		if(field.type == 'text'){
			$newRow.append('<input type="text" oninput="ltFieldInput(this, \''+field.name+'\');" class="input" value="" />');
		}
		if(field.type == 'dropdown'){
			var $rowSelect = $('<select onchange="ltFieldInput(this, \''+field.name+'\');" class="input" />');
			for(optionKey in field.options){
				var optionVal = field.options[optionKey];
				$rowSelect.append('<option value="'+(optionVal.value ? optionVal.value : optionVal)+'">'+(optionVal.label ? optionVal.label : optionVal)+'</option>');
			}
			$newRow.append($rowSelect);
		}
		if(field.type == 'player'){
			var $item = $('<div class="playerselectfield" />');
			var $rowSelect = $('<select class="playerselectinput" />');
			for(playerIndex in playerdatabaselist){
				var playerObj = playerdatabaselist[playerIndex];
				$rowSelect.append('<option value="'+playerObj.id+'">'+playerObj.nickname+'</option>');
			}
			var $info = $('<div class="info" />');
			$item.append($rowSelect);
			$item.append($info);
			$newRow.append($item);
		}
		if(field.checkbox){
			$newRow.append('<input type="checkbox" onchange="ltFieldCheckbox(this, \''+field.name+'\');" class="checkbox" value="1" />');
		}
		$newRow.appendTo(fields);
		if(field.frontpage && field.type != 'player') // exclude players from frontpage
			$newRow.clone().attr('id', 'sb-lt-field-'+field.name).appendTo(sbfields);
	}
	$("#lt-fields").html(fields);
	$("#sb-lt-fields").html(sbfields);
	insertFieldValues();
}

function updatePlayerSelectField(){
	
	// fill data and display
	
	var frag = document.createDocumentFragment();
	$(frag).append('<option value="0"> - None - </option>');
	for(playerIndex in playerdatabaselist){
		var playerObj = playerdatabaselist[playerIndex];
		$(frag).append('<option value="'+playerObj.id+'">'+playerObj.nickname+'</option>');
	}

	$(".playerselectinput").html(frag);
}
$(window).on('refreshplayerdatabase', function (e) {
    if(e.state==2)
		updatePlayerSelectField();
});




function insertFieldValues(){
	if(profile.scoreboarddata.fields == undefined)
		return;
	for(k in profile.scoreboarddata.fields){
		var field = profile.scoreboarddata.fields[k];
		$("#lt-field-"+k+" .input, #sb-lt-field-"+k+" .input").val(field.value);
		$("#lt-field-"+k+" .checkbox, #sb-lt-field-"+k+" .checkbox").prop("checked", field.checked);
	}
}

function ltFieldInput(origin, ltName){
	var value = $(origin).val();
	if($("#lt-field-"+ltName+" .input").val() != value)
		$("#lt-field-"+ltName+" .input").val(value);
	if($("#sb-lt-field-"+ltName+" .input").val() != value)
		$("#sb-lt-field-"+ltName+" .input").val(value);
	triggerEvent("autoupdate", {threshold:true});
}

function ltFieldCheckbox(origin, ltName){
	var value = $(origin).prop("checked");
	if($("#lt-field-"+ltName+" .checkbox").prop("checked") != value)
		$("#lt-field-"+ltName+" .checkbox").prop("checked", value);
	if($("#sb-lt-field-"+ltName+" .checkbox").prop("checked") != value)
		$("#sb-lt-field-"+ltName+" .checkbox").prop("checked", value);
	triggerEvent("autoupdate");
}

/*
working use cases:
 - loadAjax(module, senddata, callback)
 - loadAjax(module, callback)
*/
function loadAjax(module, senddata, callback) {
	if(callback == undefined){
		callback = senddata;
		senddata = {};
	}
	$.ajax({
		method: 	"POST",
		dataType: 	"json",
		url: 		"./ajax/"+module+".json.php",
		data:		senddata
	})
	.done(function(data) {
		callback(data);
	})
	.fail(function(e1,e2,e3){
		alert("loadAjax() Error: "+e1+" ("+e2+")");
	});
}

function loadAjaxFileUpload(module, senddata, file, callback) {
	var form_data = new FormData();
	form_data.append('file', file);
	
	for(k in senddata)
		form_data.append(k, senddata[k]);

	$.ajax({
		url: "./ajax/"+module+".json.php",
		dataType: 'json',
		cache: false,
		contentType: false,
		processData: false,
		data: form_data,
		method: "POST"
	})
	.done(function(data) {
		callback(data);
	})
	.fail(function(e1,e2,e3){
		alert("Error: "+e1+" ("+e2+")");
	});
}

function showContent(name, btn){
	var page = getParameter("p");
	if(!name)
		name = (page ? page : "scoreboard");
	btn = (btn ? btn : name);
	if(btn != page)
		history.pushState(null, null, "?p="+btn);
	$(".contentpage.visible").trigger('closed');
	$(".contentpage").removeClass("visible");
	$("#content-"+name).addClass("visible");
	$("#nav-menu .item").removeClass("active");
	$("#nav-menu-btn-"+btn).addClass("active");
	$("#content-"+name).trigger('opened');
}

function showModal(panel){
	$("#modal-bg,#modal-cont,#"+panel).show();
}

function hideModal(){
	$("#modal-bg,#modal-cont,.modal").hide();
}

function initModals(){
	$(".modal").detach().appendTo('#modal-cont');
}
$(window).on("init", initModals);



function update(){
	var start = new Date();
	var sendObject = {
		"game":_game,
		"round":"",
		"event":"",
		"playstyle":_playstyle,
		"seatorder":playerSeatingOrder,
		"player":{},
		"caster":[],
		"state":{},
		"score":{}
	};
	
	var playerfields = ["1","2"];
	// add 12 and 22 if playstyle is doubles
	if(_playstyle == 'doubles')
		playerfields.push("12","22");
	
	for(k in playerfields){
		var v = playerfields[k];
		var pid = $("#sb-pid"+v).val();
		var cid = $("#sb-charid"+v).val();
		var ccid = $("#sb-charcostumeid"+v).val();
		var playerObj = getPlayerById(pid);
		// if player not in databank, do manual override
		if(playerObj.id == 0){
			playerObj.nickname = $("#sb-pn"+v).val();
			playerObj.generateddisplayname = $("#sb-pn"+v).val();
		}else{
			playerObj.laststreamactivity = Math.floor(Date.now() / 1000);
		}
		
		playerObj["character"] = {"cid":cid,"ccid":ccid};
		sendObject["player"][v] = playerObj;
	}
	
	sendObject.score["1"] = $("#sb-ps1").val();
	sendObject.score["2"] = $("#sb-ps2").val();	
	
	sendObject.state["1"] = $("#sb-pstate1").val();
	sendObject.state["2"] = $("#sb-pstate2").val();
	
	sendObject.round = $("#sb-field-round").val().trim();
	sendObject.event = $("#sb-field-event").val().trim();
	
	// get theme object
	var themeObj = getThemeByName(profile.theme);
	
	// get lower third values
	sendObject.fields = {};
	for(index in themeObj.fields){
		var fieldRow = themeObj.fields[index];
		var value = {value:"", checked:false};
		
		if(fieldRow.type == "player"){
			var ltfpid = $("#lt-field-"+fieldRow.name+" .playerselectinput").val();
			console.log("#lt-field-"+fieldRow.name+" .playerselectinput");
			value.value = parseInt(ltfpid);
			if(ltfpid != 0)
				value.playerObject = getPlayerById(ltfpid);
		}else{
			value.value = $("#lt-field-"+fieldRow.name+" .input").val();
		}
		if(fieldRow.checkbox)
			value.checked = $("#lt-field-"+fieldRow.name+" .checkbox").is(':checked');
		sendObject.fields[fieldRow.name] = value;
	}
	console.log(sendObject);
	
	
	// get casters values
	if(themeObj.casters == undefined)
		themeObj.casters = 2;
	themeObj.casters = parseInt(themeObj.casters);
	
	for(var index = 0;index < themeObj.casters; index++){
		var id = $("#caster-item-"+index+" select").val();
		sendObject.caster[index] = getPlayerById(id);
	}
	
	// pass sendObject to all send functions

	log(sendObject, LOGTYPE.DEBUG);
	
	// topbar preview
	sendDataToTopbar(sendObject);
	
	// set scoreboard data in profile
	profile.scoreboarddata = sendObject;
	saveProfile();
	
	//websocket
	if(profile.dest_websocket){
		sendDataToWebsocket(sendObject);
	}
	// json file
	if(profile.dest_json){
		sendDataToJSON(sendObject);
	}
	// xml file
	if(profile.dest_xml){
		sendDataToXML(sendObject);
	}
	// curl request
	if(profile.dest_curl){
		sendDataToCURL(sendObject);
	}
	// create text files
	if(profile.dest_text){
		sendDataToTextFiles(sendObject);
	}
	
	tnDrawThumbnail(false);
	
	triggerEvent("update");
	var end = new Date();
	
	console.log("This all took "+(end-start)+"ms");
}

function sendDataToTopbar(data){
	var doubles = (data.playstyle=="doubles");
	$("#quick-sb-control").removeClass("singles doubles").addClass(doubles ? 'doubles' : 'singles');
	$("#qsb-player1").text(data.player["1"].generateddisplayname);
	$("#qsb-player2").text(data.player["2"].generateddisplayname);
	if(doubles){
		$("#qsb-player12").text(data.player["12"].generateddisplayname);
		$("#qsb-player22").text(data.player["22"].generateddisplayname);
	}
	$("#qsb-score1").text(data.score["1"]);
	$("#qsb-score2").text(data.score["2"]);
}

function sendDataToJSON(data){
	$.ajax({
		method: 	"POST",
		dataType: 	"text",
		url: 		"./dataprocess/json.php",
		data:		{"dest":"./../..", "data":data}
	})
	.done(function(data) {
		
	})
	.fail(function(e1,e2,e3){
		alert("Error: "+e1+" ("+e2+")");
	});
}

function sendDataToXML(data){
	$.ajax({
		method: 	"POST",
		dataType: 	"text",
		url: 		"./dataprocess/xml.php",
		data:		{"dest":"./../..", "data":data}
	})
	.done(function(data) {
		
	})
	.fail(function(e1,e2,e3){
		alert("Error: "+e1+" ("+e2+")");
	});
}
	
function sendDataToWebsocket(data, type){
	if(type == undefined)
		type = "scoreboardinfo";
	if(ws != undefined && ws.readyState === ws.OPEN)
		ws.send(JSON.stringify({"type":type, "data":data}));
}

function sendDataToCURL(data){
	// todo: implement
}

function sendDataToTextFiles(data){
	// todo: implement
}

function triggerClick(sender, callback, params){
	var $elm = $(sender);
	$elm.toggleClass("active");
	if(typeof(callback) === 'function'){
		var value = $elm.hasClass("active");
		callback(sender, value, params);
	}
}

function guid() {
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function s4() {
	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function numbersOnly(input){
	var val = parseInt(input.value);
	if(val != val)
		val = 0;
	input.value = val;
}

function lowerCaseNoSpaceOnly(input){
	var val = input.value.trim();
	val = val.toLowerCase(); 
	val = val.replace(/[^a-z0-9!?]/g,'');
	input.value = val;
}

function getTimestamp(){
	return Math.ceil(new Date().getTime() / 1000);
}

function getParameter(name) {
    var params = location.search.substr(1).split("&");
	for(k in params){
		var tmp = params[k].split("=");
		if(tmp[0] === name)
			return decodeURIComponent(tmp[1]);
	}
	return null;
}

function convertSecToTimeString(sec){
	sec = Math.round(sec);
	if(sec < 60)
		return sec+" S";
	var min = Math.floor(sec/60);
	if(sec < 600)
		return min +" M, "+(sec % 60)+" S";
	if(min < 60)
		return min +" M";
	var hours = Math.floor(min / 60);
	if(hours < 24)
		return hours+" H";
	var days = Math.floor(hours / 24);
	return days+" D";
}


function convertBytesToString(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) 
        return bytes + ' B';
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

var LOGTYPE = {LOG:1, INFO:2, ERROR:3, DEBUG:4};
function log(data, type){
	if(!DEBUG_MODE)
		return;
	if(type == undefined)
		type = "log";
	
	switch(type){
		case LOGTYPE.ERROR: console.error(data); break;
		case LOGTYPE.DEBUG: console.debug(data); break;
		case LOGTYPE.INFO: console.info(data); break;
		case LOGTYPE.LOG: 
		default: console.log(data); break;
	}
}

function updateClock(){
	var now = new Date();
	var m = now.getMinutes();
	var h = now.getHours();
	m = (m < 10 ? '0'+m : m)+'';
	h = (h < 10 ? '0'+h : h)+'';
	$("#clock").text(h+':'+m);
}
