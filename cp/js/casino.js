//{ GGs CASINO

var cws;
var casinoDatabase = {};

function casinoOpenBets(){
	var sendObj = {
		p1:"",
		p2:"",
		p1beta:[],
		p2beta:[]
	};
	
	if(profile.scoreboarddata.playstyle == 'doubles'){
		// 2v2
		
		var po1 = getPlayerById(profile.scoreboarddata.player[1].id, false);
		var po2 = getPlayerById(profile.scoreboarddata.player[2].id, false);
		var po12 = getPlayerById(profile.scoreboarddata.player[12].id, false);
		var po22 = getPlayerById(profile.scoreboarddata.player[22].id, false);
		
		sendObj.p1 = po1.nickname + " + " + po12.nickname;
		sendObj.p2 = po2.nickname + " + " + po22.nickname;
		
		sendObj.p1beta.push(po1,po12);
		sendObj.p2beta.push(po2,po22);
		
	}else if(profile.scoreboarddata.playstyle == 'crews'){
		// TODO: crews support
		console.error("Crews not supported yet");
		return;
	}else{
		// normal 1vs1
		
		var po1 = getPlayerById(profile.scoreboarddata.player[1].id, false);
		var po2 = getPlayerById(profile.scoreboarddata.player[2].id, false);
		
		sendObj.p1 = po1.generateddisplayname;
		sendObj.p2 = po2.generateddisplayname;
		
		sendObj.p1beta.push(po1);
		sendObj.p2beta.push(po2);
	}
	
	if(sendObj.p1.length > 0 && sendObj.p2.length > 0){
		csend({"type":"cmd", "value":{"name":"open","data":sendObj}});
	}
}
function casinoExpire(){
	csend({"type":"cmd", "value":{"name":"expire"}});
}
function casinoSetWinner(player){
	if(!casinoDatabase.set)
		return; // there is no set, cancel
	
	if(player == undefined)
		player = 0; 
	
	if(player == 0){
		if(profile.scoreboarddata.score[1] >  profile.scoreboarddata.score[2])
			player = 1;
		if(profile.scoreboarddata.score[1] <  profile.scoreboarddata.score[2])
			player = 2;
		
		var playersSwapped = casinoCheckPlayerSwap();
		if(playersSwapped == -1) // don't know
			player = 0; 
		if(playersSwapped == 1 && player != 0) // players are swapped
			player = (player == 1 ? 2 : 1); 
	}
	if(player == 0){
		showModal("casino-select-winner-panel");	
	}else{
		csend({"type":"cmd", "value":{"name":"winner","player":player}});
	}
}

function casinoCancelSet(){
	csend({"type":"cmd", "value":{"name":"cancel"}});
}
function casinoReOpenSet(){
	csend({"type":"cmd", "value":{"name":"reopen"}});
}


/*
returns:
-1 = dunno
0 = not swapped
1 = swapped
*/
function casinoCheckPlayerSwap(){
	var p1string = "";
	var p2string = "";	
	var p1stringalt = "";
	var p2stringalt = "";
	
	if(profile.scoreboarddata.playstyle == 'doubles'){
		p1string = profile.scoreboarddata.player[1].nickname + " + " + profile.scoreboarddata.player[12].nickname;
		p2string = profile.scoreboarddata.player[2].nickname + " + " + profile.scoreboarddata.player[22].nickname;
		p1stringalt = profile.scoreboarddata.player[12].nickname + " + " + profile.scoreboarddata.player[1].nickname;
		p2stringalt = profile.scoreboarddata.player[22].nickname + " + " + profile.scoreboarddata.player[2].nickname;
	}else if(profile.scoreboarddata.playstyle == 'crews'){
		// TODO: crews support
		console.error("Crews not supported yet");
		return;
	}else{
		// normal 1vs1
		p1string = profile.scoreboarddata.player[1].generateddisplayname;
		p2string = profile.scoreboarddata.player[2].generateddisplayname;
	}
	
	if((casinoDatabase.set.p1 == p1string || casinoDatabase.set.p1 == p1stringalt) && (casinoDatabase.set.p2 == p2string || casinoDatabase.set.p2 == p2stringalt)){
		return 0;
	}	
	if((casinoDatabase.set.p2 == p1string || casinoDatabase.set.p2 == p1stringalt) && (casinoDatabase.set.p1 == p2string || casinoDatabase.set.p1 == p2stringalt)){
		return 1;
	}
	return -1;
}


function casinoSetChanged(value){
	casinoDatabase = value;
	if(value.set){
		// set given
		$("#casino-select-winner-btn1").text(value.set.p1);
		$("#casino-select-winner-btn2").text(value.set.p2);
		
		$("#sb-casino-reopen").prop("disabled", !(value.set.expired || !value.set.open) || value.set.processing);
		$("#sb-casino-expire").prop("disabled", value.set.expired || value.set.processing);
		$("#sb-casino-open").prop("disabled", true);
		$("#sb-casino-cancelset, #sb-casino-setwinner").prop("disabled", value.set.processing);
		$("#sb-casino-label").text(value.set.p1+" Vs. "+value.set.p2);
	}else{
		// no set
		$("#casino-select-winner-btn1").text();
		$("#casino-select-winner-btn2").text();
		$("#sb-casino-label").text("Currently no set");
		$("#sb-casino-expire, #sb-casino-cancelset, #sb-casino-setwinner, #sb-casino-reopen").prop("disabled", true);
		$("#sb-casino-open").prop("disabled", false);
	}
}

function getCasinoAccessKey(){
	var address = $("#casino-address").val();
	address = address.split(":")[0];
	var casinoGetKeyWindow = window.open("http://"+address+"/getkey?redirect="+location.href,"Get Key", "width=440,height=580,toolbar=no,menubar=no");

	casinoGetKeyWindow.addEventListener('load', function(event) {
		var hash = casinoGetKeyWindow.location.hash;
		casinoGetKeyWindow.close();
		hash = hash.substr(1);
		var hashArr = hash.split('&');
		var data = {};
		for(index in hashArr){
			var temp = hashArr[index].split("=");
			data[temp[0]] = temp[1];
		}
		$("#casino-username").val(data.user_name);
		$("#casino-accesskey").val(data.access_key);
	}); 
}

function initCasino(){
	var jsonData;
	try {
		jsonData = JSON.parse(profile.casinodata);
	}catch(err){
		console.error(err);
	}
	
	if(!jsonData)
		return; // nothing stored in database for casino connect
	
	if(jsonData.address)
		$("#casino-address").val(jsonData.address);
	if(jsonData.username)
		$("#casino-username").val(jsonData.username);
	if(jsonData.accesskey)
		$("#casino-accesskey").val(jsonData.accesskey);
	
	connectCasino();
}
$(window).on("profileloaded", initCasino);

function connectCasino(){

	
	var address = $("#casino-address").val();
	var username = $("#casino-username").val();
	var accesskey = $("#casino-accesskey").val();
	
	if(address.length == 0 || username.length == 0 || accesskey.length == 0)
		return; // not enough data provided for connect, cancel
	
	
	cws = new WebSocket('ws://'+address);
	cws.onopen = function () {
		console.info("Casino WebSocket connected");
		csend({"type":"auth","value":{"user_name":username,"access_token":accesskey}});
	};


	cws.onmessage = function (e) {

		var data = JSON.parse(e.data);
		if(data.type == "db"){
			casinoSetChanged(data.value);
		}
		if(data.type == "status"){
			if(data.value == 1){
				profile.casinodata = JSON.stringify({address:address,username:username,accesskey:accesskey});
				$("#sb-casino").show();
				$("#casinoconnectionstatus").addClass("connected");
			}else{
				$("#sb-casino").hide();
				$("#casinoconnectionstatus").removeClass("connected");
			}
		}

	}
	cws.onclose = function(e){
		$("#sb-casino").hide();
		$("#casinoconnectionstatus").removeClass("connected");
		// TODO : do something, clean up
		if(e.code == 1000){ // user closed

		}else if((e.code >= 1001 && e.code <= 1014) || 4400 == e.code){ // closed by force aka server crash etc

		}else if(e.code >= 4300 && e.code <= 4319){

		}else if(e.code >= 4320 && e.code <= 4339){

		}else {

		}
		setTimeout("connectCasino()", 2000);
		console.log(e);
	}
}

function csend(obj){
	if(cws != undefined && cws.readyState === cws.OPEN){
		try {
			var jsonStr = JSON.stringify(obj);
			cws.send(jsonStr);
		}catch(err){
			alert("error - please contact Liva! ("+err+")");
		}
	}
}

// } GGs CASINO