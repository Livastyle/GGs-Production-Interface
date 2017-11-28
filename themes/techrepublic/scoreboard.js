

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
	
	if(data.playstyle == 'doubles'){
		$("#main").addClass("doubles");
	}else{
		$("#main").removeClass("doubles");
	}
	
	insertPlayerName(1, data);
	insertPlayerName(2, data);
	

	
	insertCharacter(1, data);
	insertCharacter(2, data);
	insertCharacter(12, data);
	insertCharacter(22, data);

	
	
	setPlayerScore(1, data.score[1]);
	setPlayerScore(2, data.score[2]);
	
	
	insertInfo("round", data);
	
}

function insertPlayerName(player, data){

	var nickname = data.player[player].nickname;
	var team = "";
	var teamList = [];
	var value = "";
	
	for(let i in data.player[player].teams)
		teamList.push(data.player[player].teams[i].prefix);
	team = teamList.join(" ");
	value = (teamList.length > 0 ? '<span class="team">'+team+'</span> ' : '')+nickname;
	
	if(data.playstyle == 'doubles'){
		var nickname2 = data.player[player+"2"].nickname;
		var team2 = "";
		var teamList2 = [];
		
		for(let i in data.player[player+"2"].teams)
			teamList2.push(data.player[player+"2"].teams[i].prefix);
		team2 = teamList2.join(" ");
		value += '<div class="sep"></div>'+ (teamList2.length > 0 ? '<span class="team">'+team2+'</span> ' : '')+nickname2;
	}
	
	if(svIsSet("name"+player, value)) return;
	insertValueResize({
		value:value,
		field:"#pnf"+player+" .inner"
	});
}



function insertCharacter(num, data){
	var co = data.player[num];
	var value = 0;
	if(co)
		value = co.character.cid;
	if(svIsSet("playercharacter"+num, value)) return;
	var url = themePath+'/characters/'+data.game+'/'+value+'.png';
	$("#c"+num+"").css("background-image","url('"+url+"')");
	if(value == 0){
		$("#c"+num+"").addClass("hidden");
	}else{
		$("#c"+num+"").removeClass("hidden");
	}
}


function setPlayerScore(num, val){
	if(svIsSet("score"+num, val)) return;
	insertValueResize({
		value:val,
		field:"#ps"+num
	});
}


function insertInfo(field, data){
	var val = data[field];
	if(svIsSet("info"+field, val)) return;
	insertValueResize({
		value:val,
		field:"#"+field
	});
}


