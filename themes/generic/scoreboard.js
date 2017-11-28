

lastUpdateTime = 0;

playerFields = ["","",""];

playerChars = {"11":"","12":"","21":"","22":""};
playerFlags = {"11":"","12":"","21":"","22":""};

var sv = {"pn1":"","pn2":"","c1":"","c12":"","c2":"","c22":""};

var characterAnimationTimeout = {};

stored_round = "";

playerIconState="flags";
gamehaschars = true;
doubles = false;
globalData = {};
firstload = true;


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
	globalData = data;

	console.debug(data);

	
	var newDoubles = data.playstyle == "doubles";
	if(doubles != newDoubles){
		changeTeamsState(newDoubles);
	}
	

	editPlayerName(1, data);
	editPlayerName(2, data);

	
	editPlayerScore(1, data);
	editPlayerScore(2, data);
	
	editCharacter(1, data);
	editCharacter(12, data);
	editCharacter(2, data);	
	editCharacter(22, data);	
	
	editFlags(1, data);
	editFlags(12, data);	
	editFlags(2, data);
	editFlags(22, data);
	
	editMatch(data);
	
	setState(1, data);
	setState(2, data);
	

	if(firstload){
		firstload = false;
		setTimeout("rotatePlayerIcons()", 400);
		setInterval("rotatePlayerIcons()", 4400);
		$("#main").addClass("visible");
	}
}




function editPlayerScore(player, data){
	var value = data.score[player];
	if($("#p"+player+"score").text() != value){
		$("#p"+player+"score").animate({"opacity":0},200,function(){
			$("#p"+player+"score").text(value).animate({"opacity":1},200);
		});
	}
}

function editPlayerName(player, data){

	var string = "";
	var names = [];
	
	if(data.player[player].nickname)
		names.push(combineNamePrefix(data.player[player].nickname, data.player[player].teams, data.player[player].generateddisplayname, false));
	
	if(data.playstyle == 'doubles'){
		if(data.player[player+"2"].nickname)
			names.push(combineNamePrefix(data.player[player+"2"].nickname, data.player[player+"2"].teams, data.player[player+"2"].generateddisplayname, false));
	}
	string = names.join(" <span class=\"sep\"> / </span> ");
	
	if(svIsSet("name"+player, string)) return;
	insertValueResize({
		value:string,
		field:"#p"+player+"name"
	});
	
}



function editMatch(data){
	var round = data.round;
	if(stored_round == round)
		return;
	stored_round = round;
	
	var $elm = $("#round");
	
	$elm.animate({"opacity":0},200,function(){
		$elm.children("span").text(round).css("font-size", $elm.css("font-size"));
		setTimeout(function(){
			while($elm.children("span").width() > $elm.width()){
				$elm.children("span").css("font-size","-=1px");
			}
			$elm.animate({"opacity":1},200);
		},60);
	});
}





function changeTeamsState(newDoubles){
	if(newDoubles){
		$("#main").addClass("doubles").removeClass("singles");
	}else{
		$("#main").addClass("singles").removeClass("doubles");
	}
	doubles = newDoubles;
}

function setState(player, data){
	var state = data.state[player];
	if(state=="0"){
		$("#p"+player+"state").text("");
	}
	if(state=="1"){
		$("#p"+player+"state").text("Winners");
	}
	if(state=="2"){
		$("#p"+player+"state").text("Losers");
	}
}



function editCharacter(pnum, data){
	
	var charUrl = "";
	if(data.player && data.player[pnum] && data.player[pnum].character){
		charUrl = "./../assets/characters/stock/"+data.game+"/"+data.player[pnum].character.cid + "_" + data.player[pnum].character.ccid + ".png";
	}
	
	
	if(sv["c"+pnum] == charUrl)
		return;
	
	sv["c"+pnum] = charUrl;
	
	if(characterAnimationTimeout[pnum])
		clearTimeout(characterAnimationTimeout[pnum]);
	
	var advancedPnum;

	
	if(pnum == 1)
		advancedPnum = "11";
	if(pnum == 12)
		advancedPnum = "12";
	if(pnum == 2)
		advancedPnum = "21";
	if(pnum == 22)
		advancedPnum = "22";
	
	
	var $pcElm = $("#p"+advancedPnum+"char");
	
	$pcElm.css("opacity", "0");
		
	characterAnimationTimeout[pnum] = setTimeout(function(){
		if(charUrl.length > 0){
			$pcElm.css("background-image", "url('"+charUrl+"')").css("opacity", "1");
		}else{
			$pcElm.css("background-image", "");
		}
	},320);

	
}
function editFlags(player, data){
	var country = 0;
	if(data.player[player])
		country = data.player[player].country;
	
	if(player == 1)
		advancedPnum = "11";
	if(player == 12)
		advancedPnum = "12";
	if(player == 2)
		advancedPnum = "21";
	if(player == 22)
		advancedPnum = "22";
	
	var url = themePath+'/flags/'+country+'.png';
	$("#p"+advancedPnum+"flag").css("background-image","url('"+url+"')");
}

function changeIcon(id, icon){
	$("#"+id).animate({"opacity":0},200,function(){
		$("#"+id).css("background-image", "url('"+icon+"')").animate({"opacity":1},200);
	});
}


function rotatePlayerIcons(){
	
	var data = globalData;
	
	var p1country = data.player[1].countryname;
	var p12country = (data.player[12] ? data.player[12].countryname : "");
	var p2country = data.player[2].countryname;
	var p22country = (data.player[22] ? data.player[22].countryname : "");
	
	var char1 = data.player[1].character.cid;
	var char12 = (data.player[12] ? data.player[12].character.cid : "");
	var char2 = data.player[1].character.cid;
	var char22 = (data.player[22] ? data.player[22].character.cid : "");
	
	
	var characterIconsVisible = true;
	if(char1=="" || char2=="")
		characterIconsVisible=false;
	
	if(doubles){
		if(char12=="" || char22=="")
			characterIconsVisible=false;
	}
	
	var flagIconsVisible = true;
	if(p1country=="" || p2country=="")
		flagIconsVisible=false;
	
	if(doubles){
		if(p12country=="" || p22country=="")
			flagIconsVisible=false;
	}
	
	if(characterIconsVisible && flagIconsVisible){
		if(playerIconState=="character"){
			$(".charIcon").animate({"opacity":1},500);
			$(".flagIcon").animate({"opacity":0},500);
			playerIconState="flags";
			return;
		}
		if(playerIconState=="flags"){
			$(".charIcon").animate({"opacity":0},500);
			$(".flagIcon").animate({"opacity":1},500);
			playerIconState="character";
			return;
		}
	}else if(characterIconsVisible || flagIconsVisible){
		if(characterIconsVisible){
			$(".charIcon").animate({"opacity":1},500);
			$(".flagIcon").animate({"opacity":0},500);	
		}
		if(flagIconsVisible){
			$(".charIcon").animate({"opacity":0},500);
			$(".flagIcon").animate({"opacity":1},500);
		}
	}else{
		$(".charIcon, .flagIcon").animate({"opacity":0},500);
	}
}

