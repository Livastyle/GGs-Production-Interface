

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
	insertFlag(12, data);
	insertFlag(22, data);
	
	insertCharacter(1, data);
	insertCharacter(2, data);
	insertCharacter(12, data);
	insertCharacter(22, data);	
	
	setState(1, data);
	setState(2, data);
	
	setPlayerScore(1, data);
	setPlayerScore(2, data);
	
	insertRound(data);	

}

function insertPlayerName(player, data){
	var value = "";
	var playerList = [];
	for(var p = 1;p<=2;p++){
		let pnum = player+(p==2 ? '2' : '');
		let nickname = data.player[pnum].nickname;
		let team = "";
		let teamList = [];
		let val = "";
		
		for(let i in data.player[pnum].teams){
			teamList.push(data.player[pnum].teams[i].prefix);
		}
		team = teamList.join(" ");
		if(teamList.length > 0){
			val = '<span class="team">'+team+"</span> "+nickname;
		}else{
			val = nickname;
		}
		if(val.length > 0)
			playerList.push(val);
	}
	
	
	var pPos = getPlayerPosition(player, data);
	var tpos = 1;
	if(pPos == 2 || pPos ==  22)
		tpos = 2;
	
	if(pPos == 12 || pPos == 22)
		playerList.reverse();

	
	value = playerList.join(" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ");

	if(svIsSet("name"+tpos, value)) return;
	
	insertValueResize({
		value:value,
		field:"#t"+tpos+" .nickname"
	});
}



function setState(player, data){
	var state = data.state[player];
	var pPos = getPlayerPosition(player, data);
	var pnum = 1;
	if(pPos == 2 || pPos ==  22)
		pnum = 2;
	switch(state){
		case "0":
			$("#state"+pnum).removeClass("winners losers");
		break;
		case "1":
			$("#state"+pnum).removeClass("losers").addClass("winners");
		break;
		case "2":
			$("#state"+pnum).removeClass("winners").addClass("losers");
		break;
		
	}
}

function insertFlag(player, data) {
	var pPos = getPlayerPosition(player, data);
	var country = 0;
	if(data.player[player])
		country = data.player[player].country;
	
	if(svIsSet("country"+pPos, country)) return;
	
	var url = './../assets/flags/lowres/'+country+'.png';
	$("#flag"+pPos).css("background-image","url('"+url+"')");
}


function insertCharacter(player, data){
	var character = "";
	var pPos = getPlayerPosition(player, data);
	var dir = "./../assets/characters/stock/1/";
	if(data.player[player] && data.player[player].character.cid != "0")
		character = dir+data.player[player].character.cid+"_"+data.player[player].character.ccid+".png";
	
	if(player == 12 || player == 22){
		var checkPlayer = (player == 12 ? '1' : '2');
		var checkChar = dir+data.player[checkPlayer].character.cid+"_"+data.player[checkPlayer].character.ccid+".png";
		if(checkChar == character){
			$("#char"+pPos).addClass("light");
			$("#t"+checkPlayer).addClass("light");
		}else{
			$("#char"+pPos).removeClass("light");
			$("#t"+checkPlayer).removeClass("light");
		}
	}else{
		$("#char"+pPos).removeClass("light");
		$("#t"+checkPlayer).removeClass("light");
	}
	
	if(svIsSet("character"+pPos, character)) return;
	$("#char"+pPos).css("background-image","url('"+character+"')").attr("data-charid", data.player[player].character.cid);
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

function getPlayerPosition(pnum, data){
	var pos = 0;
	var posList = ["1","12","2","22"];
	for(index in data.seatorder){
		if(data.seatorder[index] == pnum){
			pos = index;
			break;
		}
	}
	return posList[pos];
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
	
	var pPos = getPlayerPosition(player, data);
	var tpos = 1;
	if(pPos == 2 || pPos ==  22)
		tpos = 2;
	
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
	if(svIsSet("score"+tpos, value)) return;

	for(var bon = 1;bon<=5;bon++){	
		let $elm = $("#score"+tpos+" .s"+bon);
		if(bon <= value){
			$elm.addClass("active");
		}else{
			$elm.removeClass("active");
		}
	}
	
}

window.onload = init;