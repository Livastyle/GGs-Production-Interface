window.onload = init;


var ws;

function startWS(websocketServerLocation){
    ws = new WebSocket(websocketServerLocation);
    ws.onmessage = function(evt) { 
		var wsdata = JSON.parse(evt.data);

		if(wsdata.type != "scoreboardinfo")
			return;
		var data = wsdata.data;
		// do stuff
		
		
		
		$("#round").text(data.round);
		$("#pn1").text(data.player["1"].generateddisplayname);
		$("#pn2").text(data.player["2"].generateddisplayname);
		$("#ps1").text(data.score["1"]);
		$("#ps2").text(data.score["2"]);
		
	};
    ws.onclose = function(){
        //try to reconnect in 5 seconds
        setTimeout(function(){startWS(websocketServerLocation)}, 5000);
    };
}


function init(){
	startWS('ws://'+serverip+':5000');
	//alert('ws://'+serverip+':5000');
	//load();
}

function load(){
	
	loadDataJSON(function(data){
		

		console.log(data);
		
	},
	function(){
		setTimeout("load()", 1000);
	});
}