function init(){
	startCWS('ws://ggs-casino.com:8083', process);
}

window.onload = init;
var sv = {"1":"","2":""};


function process(data){
	console.log(data);
	if(data.type != "set")
		return;
	
	if(!data.value){
		// no set
		
		insertName(1, "");
		insertName(2, "");
		displayCoins(false);
		
	}else{
		var coins = [0,0,0];
		
		insertName(1, data.value.p1);
		insertName(2, data.value.p2);
		
		if(data.value.bets){
			for(index in data.value.bets){
				var betObj = data.value.bets[index];
				coins[betObj.player] += parseInt(betObj.coins);
			}
		}
		
		
		displayCoins(coins);
	}
	
	
	//
	

}

function displayCoins(coinArr){
	
	if(coinArr === false || (coinArr[1] == 0 && coinArr[2] == 0)){
		$("#bar").css("opacity", "0");
		
		$("#player1 .coins").text(0);
		$("#player2 .coins").text(0);
	}else{
		
		$("#bar").css("opacity", "1");
		
		$("#player1 .coins").text(coinArr[1]);
		$("#player2 .coins").text(coinArr[2]);
		
		var total = coinArr[1] + coinArr[2];
		var percent = (coinArr[1] / total)*100;
		
		$("#barinner").css("width", percent+"%");
	}
}

function insertName(num, val){
	
	if(sv[num] == val)
		return;
	sv[num] = val;
	
	var $b = $("#player"+num+" .playername");
	var $bs = $("#player"+num+" .playername span");
	
	$bs.removeClass("visible");
	setTimeout(function(){
		$bs.text(val).css("font-size", $b.css("font-size"));
		setTimeout(function(){
			while($b.width() < $bs.width())
				$bs.css("font-size", "-=1px");
			$bs.addClass("visible");
		}, 20);
	}, 200);
	
}


function startCWS(websocketServerLocation, callback){
	
	

	
    ws = new WebSocket(websocketServerLocation);
    ws.onmessage = function(evt) { 
		var wsdata = JSON.parse(evt.data);
		callback(wsdata);
	};
    ws.onclose = function(){
        //try to reconnect in 5 seconds
        setTimeout(function(){startCWS(websocketServerLocation)}, 5000);
    };
}