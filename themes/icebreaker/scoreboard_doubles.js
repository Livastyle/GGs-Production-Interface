

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


var nameAnimationTimeout = [];


function init(){
	startWS('ws://'+serverip+':5000', process);
	$("#main").addClass("visible");
}



function process(data){
	console.log(data);


	
	insertPlayerName(1, data);
	insertPlayerName(2, data);
	insertPlayerName(12, data);
	insertPlayerName(22, data);
	
	insertFlag(1, data);
	insertFlag(2, data);
	insertFlag(12, data);
	insertFlag(22, data);
	
	insertCharacter(1, data);
	insertCharacter(2, data);
	insertCharacter(12, data);
	insertCharacter(22, data);
	
	checkCharacterDitto(1, data);
	checkCharacterDitto(2, data);
	
	insertTeam(1, data);
	insertTeam(2, data);	
	insertTeam(12, data);	
	insertTeam(22, data);	
	
	setState(1, data);
	setState(2, data);
	
	
	setPlayerScore(1, data);
	setPlayerScore(2, data);
	
	insertRound(data);
	
//	insertCaster(data);
	


	

}

function insertPlayerName(player, data){
	var value = data.player[player].generateddisplayname;
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

function setBestOf(data){
	var value = data.fields.bestof.value;
	if(sv.bestof == value)
		return;
	sv.bestof = value;
	
	var setVal = Math.ceil(value/2);
	
	$(".scorefield").html('');
	for(i = 0;i<setVal;i++)
		$(".scorefield").append('<div class="item"></div>');
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
	var hasTeam = false;

	if(data.player[player] && data.player[player].teams && data.player[player].teams.length > 0){
		for(index in data.player[player].teams){
			var teamObj = data.player[player].teams[index];
			html += '<div class="item">'+teamObj.name+'</div>';
			htmlbg += '<div class="item" style="background-image:url(\''+dir+'logo.php?tid='+teamObj.id+'&s=50&inline=1&bg=blue'+'\');"></div>';
		}
	}
	


	if(sv.team[player] == html)
		return;
	sv.team[player] = html;

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
	$("#char"+player).css("background-image","url('"+character+"')").attr("data-charid", data.player[player].character.cid);
}
function checkCharacterDitto(player, data){

	var p1cid = data.player[player].character.cid;
	var p2cid = data.player[player+"2"].character.cid;
	
	if(p1cid == p2cid){
		$("#char"+player+", #char"+player+"2").addClass("ditto");
	}else{
		$("#char"+player+", #char"+player+"2").removeClass("ditto");
	}
}

function insertRound(data){

	var roundString = data.event + " - " + data.round;

	var $roundBox = $("#roundinfo");
	var $roundSpan = $("#roundinfo span");
	

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


function setPlayerScore(player, data){
	var value = data.score[player];
	if(sv.score[player] == value)
		return;
	sv.score[player] = value;
	$("#score"+player).text(value);
}


window.onload = init;