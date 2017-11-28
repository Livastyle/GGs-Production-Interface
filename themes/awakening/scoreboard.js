

var rotationcurrentlogo = 0;
var nameAnimationTimeout = [];


function init(){
	
	initSceneVisibleTrigger(function(){
		$("#main").addClass("visible");
	}, function(){
		$("#main").removeClass("visible");
	});
	startWS(process);
	
	roundRotation(true);
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

	
	setState(1, data);
	setState(2, data);
	

	setPlayerScore(1, data);
	setPlayerScore(2, data);
	
	insertRound(data);
	
//	insertCaster(data);
	


	

}

function insertPlayerName(player, data){
	var nickname = data.player[player].nickname;
	var team = "";
	var teamList = [];
	var value = "";
	
	for(let i in data.player[player].teams){
		teamList.push(data.player[player].teams[i].prefix);
	}
	team = teamList.join(" ");
	if(teamList.length > 0){
		value = '<span class="team">'+team+"</span> "+nickname;
	}else{
		value = nickname;
	}

	if(svIsSet("name"+player, value)) return;
	
	insertValueResize({
		value:value,
		field:"#p"+player+" .nickname"
	});
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
	
	if(svIsSet("country"+player, country)) return;
	
	var url = './../assets/flags/lowres/'+country+'.png';
	$("#flag"+player).css("background-image","url('"+url+"')");
}



function insertCharacter(player, data){
	var character = "";
	var dir = "./../assets/characters/stock/1/";
	if(data.player[player] && data.player[player].character.cid != "0")
		character = dir+data.player[player].character.cid+"_"+data.player[player].character.ccid+".png";
	if(svIsSet("character"+player, character)) return;
	$("#char"+player).css("background-image","url('"+character+"')").attr("data-charid", data.player[player].character.cid);
}

function insertRound(data){
	var eventString = data.fields.topinfo.value;
	var roundString = data.round;
	if(!svIsSet("round", roundString)){
		insertValueResize({
			value:roundString,
			field:"#round"
		});
	}	
	if(!svIsSet("event", eventString)){
		insertValueResize({
			value:eventString,
			field:"#bracket"
		});
	}
}


function logoRotation(numForce){
	// TODO: implement
	if(numForce)
		rotationcurrentlogo = numForce;
	else
		rotationcurrentlogo++;
	if(rotationcurrentlogo > $("#sponsors .item").length)
		rotationcurrentlogo = 1;

	$("#sponsors .item").css("opacity","0");
	$("#sponsors .item:nth-child("+rotationcurrentlogo+")").css("opacity","1");
}
function roundRotation(even){
	var timing = 4000;
	if(even){
		$("#round").addClass("visible");
		$("#bracket").removeClass("visible");
		timing = 10000;
	}else{
		$("#bracket").addClass("visible");
		$("#round").removeClass("visible");
	}
	setTimeout(function(){
		console.log(even);
		roundRotation(!even);
	}, timing);
}


function setPlayerScore(player, data){
	var bestof = data.fields.bestof.value;
	var scoreCount = Math.floor(bestof/2)+1;
	for(var bon = 1;bon<=5;bon++){	
		let $elm = $("#score"+player+" .s"+bon);
		if(scoreCount >= bon){
			$elm.removeClass("hidden");
		}else{
			$elm.addClass("hidden");
		}
	}
	
	var value = data.score[player];
	if(svIsSet("score"+player, value)) return;

	for(var bon = 1;bon<=5;bon++){	
		let $elm = $("#score"+player+" .s"+bon);
		if(bon <= value){
			$elm.addClass("active");
		}else{
			$elm.removeClass("active");
		}
	}
	
}

window.onload = init;