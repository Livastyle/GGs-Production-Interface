

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
	"bestof":0,
	"caster":""
};

var rotationcurrentlogo = 0;
var nameAnimationTimeout = [];


function init(){
	

	startWS('ws://'+serverip+':5000', process);
	

	logoRotation(1);
	setInterval("logoRotation()", 6000);

}



function process(data){
	console.log(data);


	
	insertPlayerName(1, data);
	insertPlayerName(2, data);
	
	insertFlag(1, data);
	insertFlag(2, data);
	
	insertCharacter(1, data);
	insertCharacter(2, data);
	
	insertTeam(1, data);
	insertTeam(2, data);	
	
	setState(1, data);
	setState(2, data);
	

	setPlayerScore(1, data);
	setPlayerScore(2, data);
	
	insertRound(data);
	
//	insertCaster(data);
	


	

}

function insertPlayerName(player, data){
	var value = data.player[player].nickname;
	if(sv.names[player] == value)
		return;
	sv.names[player] = value;
	if(nameAnimationTimeout[player])
		clearTimeout(nameAnimationTimeout[player]);
	
	var $item = $("#p"+player+" .nickname");
	var $span = $("#p"+player+" .nickname span");
	$item.addClass("hidden");
	nameAnimationTimeout[player] = setTimeout(function(){
		$span.html(value).css("font-size", $item.css("font-size"));
		nameAnimationTimeout[player] = setTimeout(function(){
			while($span.width() > $item.width())
				$span.css("font-size", "-=1px");
			$item.removeClass("hidden");
		},50);
	},300);

}
function setState(player, data){
	var state = data.state[player];
	
	switch(state){
		case "0":
			$("#state"+player).removeClass("winners losers");
		break;
		case "1":
			$("#state"+player).removeClass("losers").addClass("winners");
		break;
		case "2":
			$("#state"+player).removeClass("winners").addClass("losers");
		break;
		
	}
}

function insertFlag(player, data) {
	var country = 0;
	if(data.player[player])
		country = data.player[player].country;
	
	if(sv.country[player] == country)
		return;
	sv.country[player] = country;
	
	var url = './../assets/flags/lowres/'+country+'.png';
	$("#flag"+player).css("background-image","url('"+url+"')");
}

function insertTeam(player, data){
	var html = '';
	var htmlbg = '';
	var dir = "./../assets/teams/";

	if(data.player[player] && data.player[player].teams && data.player[player].teams.length > 0){
		for(index in data.player[player].teams){
			var teamObj = data.player[player].teams[index];
			html += '<div class="item">'+teamObj.name+'</div>';
			htmlbg += '<div class="item" style="background-image:url(\''+dir+'logo.php?tid='+teamObj.id+'&s=300&inline=1&bg=red'+'\');"></div>';
		}
	}
	
	

	if(sv.team[player] == html)
		return;
	sv.team[player] = html;
	
	if(html.length > 0){
		$("#p"+player).addClass("hasteam");
	}else{
		$("#p"+player).removeClass("hasteam");
	}
	
	$("#team"+player).html(html);
	$("#nicknamebg"+player).html(htmlbg);
}

function insertCharacter(player, data){
	var character = "";
	var dir = "./../assets/characters/stock/1/";
	if(data.player[player] && data.player[player].character.cid != "0" && data.player[player].character.ccid != "0")
		character = dir+data.player[player].character.cid+"_"+data.player[player].character.ccid+".png";
	
	if(sv.character[player] == character)
		return;
	sv.character[player] = character;
	console.log(123);
	$("#char"+player).css("background-image","url('"+character+"')").attr("data-charid", data.player[player].character.cid);
}

function insertRound(data){
	var eventString = data.event;
	var roundString = data.round;


	
	var $eventBox = $("#event");
	var $eventSpan = $("#event span");
	
	var $roundBox = $("#round");
	var $roundSpan = $("#round span");
	
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


function logoRotation(numForce){
	// TODO: implement
	if(numForce)
		rotationcurrentlogo = numForce;
	else
		rotationcurrentlogo++;
	if(rotationcurrentlogo > $("#sponsors .item").length){
		rotationcurrentlogo = 1;
	}	
	
	$("#sponsors .item").css("opacity","0");
	$("#sponsors .item:nth-child("+rotationcurrentlogo+")").css("opacity","1");
	
}


function setPlayerScore(player, data){
	var value = data.score[player];
	if(sv.score[player] == value)
		return;
	sv.score[player] = value;
	$("#score"+player).text(value);
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

window.onload = init;