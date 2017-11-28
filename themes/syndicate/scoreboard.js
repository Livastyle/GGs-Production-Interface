
var subInitDone = false;
var gameSetup = "";
var setupGameName = {
	1:"melee",
	3:"smash4"
};

var sponsors = ["afk","controllerchaos","jimmyjoy","mc","ogd","pressfire","smashboards","splyce","stayokay","twitch","zowie"];
var sponsorRotationCurrent = 0;
var assetsRotationCurrent = 0;

var doubles = false;
window.onload = init;


function init(){
	initSceneVisibleTrigger(function(){
		$("#main").addClass("visible");
	}, function(){
		$("#main").removeClass("visible");
	});
	startWS(process);
}

function process(data){
	console.log(data);
	doubles = data.playstyle == "doubles";
	setupGame(setupGameName[data.game]+"_"+data.playstyle);
	
	if(!subInitDone){
		insertSponsors(sponsors);
		assetsRotation();
		subInitDone = true;
	}
	
/*
	setState(1, data);
	setState(2, data);
	*/
	
	switch(gameSetup){
		case "melee_singles":
			
			insertPlayerName(1, data);
			insertPlayerName(2, data);
			
			insertPlayerFlag(1, data);
			insertPlayerFlag(2, data);
			
			insertPlayerCharacter(1, data);
			insertPlayerCharacter(2, data);
			
		break;
		case "melee_doubles":
		
			insertPlayerName(1, data);
			insertPlayerName(2, data);
			insertPlayerName(12, data);
			insertPlayerName(22, data);
			
			insertPlayerFlag(1, data);
			insertPlayerFlag(2, data);
			insertPlayerFlag(12, data);
			insertPlayerFlag(22, data);
			
			insertPlayerCharacter(1, data);
			insertPlayerCharacter(2, data);
			insertPlayerCharacter(12, data);
			insertPlayerCharacter(22, data);
		
		break;
		case "smash4_singles":
			insertPlayerName(1, data);
			insertPlayerName(2, data);
			
			insertPlayerFlag(1, data);
			insertPlayerFlag(2, data);
			
			insertPlayerCharacter(1, data);
			insertPlayerCharacter(2, data);
		break;
		case "smash4_doubles":
			insertPlayerNameDoubles(1, data);
			insertPlayerNameDoubles(2, data);
			
			insertPlayerFlag(1, data);
			insertPlayerFlag(2, data);
			insertPlayerFlag(12, data);
			insertPlayerFlag(22, data);
			
			insertPlayerCharacter(1, data);
			insertPlayerCharacter(2, data);
			insertPlayerCharacter(12, data);
			insertPlayerCharacter(22, data);
		break;
	}


	
	
	setPlayerScore(1, data.score[1]);
	setPlayerScore(2, data.score[2]);
	
	
	insertInfo("round", data);
	insertInfo("event", data);
	
}

function insertPlayerName(player, data){

	var value = combineNamePrefix(data.player[player].nickname, data.player[player].teams, data.player[player].displayname, false);
	
	if(svIsSet("name"+player, value)) return;
	insertValueResize({
		value:value,
		field:"#pn"+player,
		chield:".inner"
	});
}
function insertPlayerNameDoubles(player, data){
	var valArr = [];
	var p1value = combineNamePrefix(data.player[player].nickname, data.player[player].teams, data.player[player].displayname, false);
	var p2value = combineNamePrefix(data.player[player+"2"].nickname, data.player[player+"2"].teams, data.player[player+"2"].displayname, false);
	
	if(p1value.length > 0)
		valArr.push(p1value);	
	if(p2value.length > 0)
		valArr.push(p2value);
	
	var value = valArr.join('<div class="sep">+</div>');
	if(svIsSet("name"+player, value)) return;
	insertValueResize({
		value:value,
		field:"#pn"+player,
		chield:".inner"
	});
}
function insertPlayerFlag(num, data){
	var co = data.player[num];
	var value = 0;
	if(co)
		value = co.country;
	if(svIsSet("playerflag"+num, value)) return;
	var url = themePath+'/flags/'+value+'.png';
	$("#pflag"+num).css("background-image","url('"+url+"')");
	if(value == 0){
		$("#pflag"+num).addClass("hidden");
	}else{
		$("#pflag"+num).removeClass("hidden");
	}
}

function insertPlayerCharacter(num, data){
	var co = data.player[num];
	var value = 0;
	if(co)
		value = co.character.cid;
	if(svIsSet("playercharacter"+num, value)) return;
	var url = themePath+'/characters/'+data.game+'/'+value+'.png';
	$("#pchar"+num).css("background-image","url('"+url+"')");
	if(value == 0){
		$("#pchar"+num).addClass("hidden");
	}else{
		$("#pchar"+num).removeClass("hidden");
	}
}


function setPlayerScore(num, val){
	if(svIsSet("score"+num, val)) return;
	insertValueResize({
		value:val,
		field:"#pscore"+num
	});
}


function insertInfo(field, data){
	var val = data[field];
	if(svIsSet("info"+field, val)) return;
	insertValueResize({
		value:val,
		field:"#"+field+"val"
	});
}



function setupGame(name){
	if(gameSetup != name && gameSetup != "") location.reload();
	$("#main > div:not(#"+name+")").remove();
	gameSetup = name;
	$("body").css("opacity","1");
}

function assetsRotation(){
	$(".assets").removeClass("mode_character mode_flag");
	var assetDuration = 2;
	switch(assetsRotationCurrent){
		case "character":
			assetsRotationCurrent = "flag";
			assetDuration = 4;
		break;
		default:
		case "flag":
			assetsRotationCurrent = "character";
			assetDuration = 10;
		break;
	}
	setTimeout(assetsRotation, assetDuration*1000);
	$(".assets").addClass("mode_"+assetsRotationCurrent);
}

function insertSponsors(list){
	list.forEach(function(item){
		$("#sponsors .list").append('<div class="item" style="background-image:url(\''+themePath+'/sponsor/'+item+'.png\');"></div>');
	});
	sponsorRotation();
	setInterval(sponsorRotation, 2000);
}
function sponsorRotation(){
	$currentItem = $("#sponsors .list .item:nth-child("+sponsorRotationCurrent+")");
	sponsorRotationCurrent++;
	if(sponsorRotationCurrent > $("#sponsors .list .item").length)
		sponsorRotationCurrent = 1;
	$nextItem = $("#sponsors .list .item:nth-child("+sponsorRotationCurrent+")");
	$currentItem.removeClass("visible");
	$nextItem.addClass("visible");
}

