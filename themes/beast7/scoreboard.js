window.onload = init;

var firstload = true;

var currentPlaystyle = "";
var currentGame = "";
var rotationcurrentlogo = 0;
var nameAnimationTimeout = [];
var scoreAnimationTimeout = [];

var sv = {
	"names": {
		1:"",
		2:"",
	},
	"score": {
		1:0,
		2:0
	},
	"country": {
		1:"",
		2:"",
		12:"",
		22:""
	},
	"character": {
		1:"",
		2:"",
		12:"",
		22:""
	},
	"team": {
		1:"",
		2:"",
		12:"",
		22:""
	},
	"round":"",
	"event":"",
	"caster":""
};



$(window).on('hashchange', function() {
	if(location.hash === "#used"){
		return;
	}
	if(location.hash === "#toggle"){
		if($("#main").hasClass("visible")){
			location.hash = "#hidden";
		}else{
			location.hash = "#visible";
		}
		$(window).trigger('hashchange');
	}else{
		if(location.hash !== "#visible"){
			$("#main").removeClass("visible");
		}else{
			$("#main").addClass("visible");
		}
	}
	location.hash = "#used";
});

function init(){
	startWS('ws://'+serverip+':5000', process);
	
	logoRotation(1);
	setInterval("logoRotation()", 6000);
}

function logoRotation(force){
	rotationcurrentlogo++;
	if(force != undefined)
		rotationcurrentlogo = force;
	
	var logoCount = $(".logorotation .item").length;
	if(rotationcurrentlogo > logoCount){
		rotationcurrentlogo = 1;
	}
	$(".logorotation .item").removeClass("visible");
	
	$(".logorotation .item:nth-child("+rotationcurrentlogo+")").addClass("visible");
	
}



function process(data){
	console.log(data);
	if(currentPlaystyle != data.playstyle){
		$("#main").removeClass(currentPlaystyle).addClass(data.playstyle);
		currentPlaystyle = data.playstyle;
		sv.round = Math.random();
		sv.event = Math.random();
	}
	if(currentGame != data.game){
		$("#main").removeClass("game"+currentGame).addClass("game"+data.game);
		currentGame = data.game;
		sv.round = Math.random();
		sv.event = Math.random();
	}
	
	
	
	var doubles = (data.playstyle == 'doubles');
	
	var playerTarget = getPlayerTarget(data);
	
	insertPlayerName(1, data);
	insertPlayerName(2, data);
	
	insertFlag(1, playerTarget[1], data);
	insertFlag(2, playerTarget[2], data);
	
	insertCharacter(1, playerTarget[1], data);
	insertCharacter(2, playerTarget[2], data);
	
	insertTeam(1, playerTarget[1], data);
	insertTeam(2, playerTarget[2], data);
	
	if(doubles){
		insertFlag(12, playerTarget[12], data);
		insertFlag(22, playerTarget[22], data);
		
		insertCharacter(12, playerTarget[12], data);
		insertCharacter(22, playerTarget[22], data);
		
		insertTeam(12, playerTarget[12], data);
		insertTeam(22, playerTarget[22], data);
	}
	
	setPlayerScore(1, data);
	setPlayerScore(2, data);
	
	insertRound(data);
	
	insertCaster(data);
	
	
	if(firstload){
		firstload = false;
		if(location.hash.length == 0){
			$("#main").addClass("visible");
		}
	}
	

}

function insertRound(data){
	var eventString = data.fields.event.value;
	var roundString = data.fields.round.value;
	var $parentBox;
	if(data.playstyle == "singles" && (data.game == 1 || data.game == 5)){
		$parentBox = $("#melee_singles_container");
	}else{
		$parentBox = $("#board");
	}
	
	var $eventBox = $parentBox.find(".event_display");
	var $eventSpan = $eventBox.find("span");	
	
	var $roundBox = $parentBox.find(".round_display");
	var $roundSpan = $roundBox.find("span");
	
	if(sv.event != eventString){
		sv.event = eventString;
		
		$eventBox.css("opacity","0");
		setTimeout(function(){
			$eventSpan.text(eventString).css("font-size", $eventBox.css("font-size"));
			setTimeout(function(){
				while($eventSpan.width() > $eventBox.width())
					$eventSpan.css("font-size", "-=1px");
				$eventBox.css("opacity","1");
			},10);
		},100);
		
	}
	if(sv.round != roundString){
		sv.round = roundString;

		$roundBox.css("opacity","0");
		setTimeout(function(){
			$roundSpan.text(roundString).css("font-size", $roundBox.css("font-size"));
			setTimeout(function(){
				while($roundSpan.width() > $roundBox.width())
					$roundSpan.css("font-size", "-=1px");
				$roundBox.css("opacity","1");
			},10);
		},100);
		
	}

}
function insertCaster(data){
	
	var $cont = $("<div />");
	var casterStr = "";
	
	for(index in data.caster){
		var co = data.caster[index];
		if(co.nickname.length > 0){
			casterStr += co.nickname+"-";
			$cont.append('<div class="item"><div class="nickname"><span>'+co.nickname+'</span></div><div class="flag" style="background-image:url(\'./../assets/flags/lowres/'+co.country+'.png\')"></div></div>');
		}
	}
	
	if(sv.caster == casterStr)
		return;
	sv.caster = casterStr;
	
	$(".commentary_display").html($cont);
	setTimeout(function(){
		$cont.children(".item").each(function(k,v){
			var $nameItem = $(v).children(".nickname");
			var $nameItemSpan = $nameItem.children("span");

			$nameItemSpan.css("font-size", $nameItem.css("font-size"));

			while($nameItem.width() < $nameItemSpan.width()){
				$nameItemSpan.css("font-size", "-=1px");
			}
			
		});
		
	},10);
}

function setPlayerScore(playerNum, data){
	var value = data.score[playerNum];
	if(sv.score[playerNum] == value)
		return;
	sv.score[playerNum] = value;
	
	if(scoreAnimationTimeout[playerNum])
		clearTimeout(scoreAnimationTimeout[playerNum]);
	
	$("#score_bg"+playerNum).addClass("hidden");
	scoreAnimationTimeout[playerNum] = setTimeout(function(){
		$("#score_bg"+playerNum+" .inner").text(value);
		$("#score_bg"+playerNum).removeClass("hidden");
	},200);
}

function insertPlayerName(teamNum, data){
	var value = "";
	var nameArr = [];
	if(data.player[teamNum].generateddisplayname.length > 0)
		nameArr.push(data.player[teamNum].generateddisplayname);
	if(data.playstyle == "doubles"){
		if(data.player[teamNum+"2"].generateddisplayname.length > 0)
			nameArr.push(data.player[teamNum+"2"].generateddisplayname);
	}
	value = nameArr.join(" &nbsp;&nbsp;&nbsp;&nbsp; ");
	
	if(data.state[teamNum] == 1){
		value += " [W]";
	}
	if(data.state[teamNum] == 2){
		value += " [L]";
	}
	
	if(sv.names[teamNum] == value)
		return;
	sv.names[teamNum] = value;
	if(nameAnimationTimeout[teamNum])
		clearTimeout(nameAnimationTimeout[teamNum]);
	var $item = $("#pf"+teamNum);
	var $span = $("#pf"+teamNum+" span");
	$item.addClass("hidden");
	nameAnimationTimeout[teamNum] = setTimeout(function(){
		$span.html(value).css("font-size", $item.css("font-size"));
		$item.addClass("hiddentop").removeClass("hidden");
		nameAnimationTimeout[teamNum] = setTimeout(function(){
			while($span.width() > $item.width())
				$span.css("font-size", "-=1px");
			$item.removeClass("hiddentop");
		},50);
	},300);
}

function insertFlag(player, target, data) {
	var country = 0;
	if(data.player[player])
		country = data.player[player].country;
	
	if(sv.country[player] == country)
		return;
	sv.country[player] = country;
	
	var url = themePath+'/flags/'+target+'/'+country+'.png';
	$("#flag"+target).css("background-image","url('"+url+"')");
}

function insertCharacter(player, target, data){
	var character = "";
	var dir = "./../assets/icons/characters/"+data.game+"/";
	if(data.player[player] && data.player[player].character.cid != "0")
		character = dir+data.player[player].character.cid+"_"+data.player[player].character.ccid+".png";
	
	if(sv.character[player] == character)
		return;
	sv.character[player] = character;
	$("#char"+target).css("background-image","url('"+character+"')");
}

function insertTeam(player, target, data){
	var html = '';
	var dir = "./../assets/teams/";
	// logo.php?tid="+teamID+"&s=50
	
	if(data.player[player] && data.player[player].teams && data.player[player].teams.length > 0){
		for(index in data.player[player].teams){
			var teamObj = data.player[player].teams[index];
			html += '<div class="item" style="background-image:url(\''+dir+'logo.php?tid='+teamObj.id+'&s=50&inline=1&bg=red'+'\');"></div>';
		}
	}
	

	if(sv.team[player] == html)
		return;
	sv.team[player] = html;
	
	$("#team"+target).html(html);
}



function getPlayerTarget(data){
	var target = {1:1,12:12,2:2,22:22};
	if(data.playstyle == "doubles"){
		target[2] = 22;
		target[22] = 2;
	}
	return target;
}
