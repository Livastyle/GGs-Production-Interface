function init(){
	startCWS('ws://ggs-casino.com:8083', cprocess);
}

window.onload = init;
var sv = {"1":"","2":""};

var _displayCoins = {1:0,2:0};
var _finalCoins = {1:0,2:0};
var _displayPercent = 50;

var displayCoinsTimeout;


function cprocess(data){
	console.log(data);
	if(data.type != "set")
		return;
	
	_finalCoins[1] = 0;
	_finalCoins[2] = 0;
	if(!data.value){
		// no set
		
		$("#main").removeClass("visible");
	}else{
		insertName(1, data.value.p1);
		insertName(2, data.value.p2);
		
		if(data.value.bets){
			for(index in data.value.bets){
				var betObj = data.value.bets[index];
				_finalCoins[betObj.player] += parseInt(betObj.coins);
			}
		}
		$("#main").addClass("visible");
		displayCoins();
	}
}

function displayCoins(){
	if(displayCoinsTimeout)
		clearTimeout(displayCoinsTimeout);
	
	// calc display coins
	calcDisplayPercent();
	calcDisplayCoins(1);
	calcDisplayCoins(2);
	
	
	
	// display
	$("#coinsp1").text(_displayCoins[1]);
	$("#coinsp2").text(_displayCoins[2]);
	var total = _displayCoins[1] + _displayCoins[2];
	var percent = _displayCoins[1]/total;
	
	$("#barp1").css("width", (percent*100)+"%");
	$("#barp2").css("width", (100 - percent*100)+"%");
	$("#sep").css("left", (percent*100)+"%");
	
	if(percent < .02 || percent > .98 || total == 0){
		$("#sep").css("opacity",0);
	}else{
		$("#sep").css("opacity",1);
	}
	
	
	// trigger next tick
	if(_displayCoins[2] != _finalCoins[2] || _displayCoins[1] != _finalCoins[1]){
		displayCoinsTimeout = setTimeout(displayCoins, 1000/30);
	}

}

function calcDisplayPercent(){
	var step = 1;
	var total = _finalCoins[1] + _finalCoins[2];
	var percent = (_finalCoins[1]/total)*100;
	
	var diff = Math.abs(percent-_displayPercent);
	
	if(diff < step){
		_displayPercent = percent;
	}else{
		if(_displayPercent > percent){
			_displayPercent -= step;
		}else{
			_displayPercent += step;
		}
	}
	
	
}


function calcDisplayCoins(num){
	if(_displayCoins[num] == _finalCoins[num])
		return;
	
	var p = _displayPercent;
	if(num == 2)
		p = 100-_displayPercent;
	
	
	_displayCoins[num] = Math.round(((_finalCoins[1]+_finalCoins[2]) / 100) * p);
	
	console.log(num + " - " + _displayCoins[num] + " - " + _finalCoins[num]);
	
	/*
	var diff = Math.abs(_displayCoins[num]-_finalCoins[num]);
	var diffLength = diff.toString().length;
	var add = 0;
	for(var i =0; i < diffLength;i++){
		add += Math.pow(10, i);
	}
	
	add = add * (_displayCoins[num]<_finalCoins[num] ? 1 : -1);
	add = Math.ceil(add * 0.3);
	_displayCoins[num] += add;
	*/

	
	
	
	
}

function insertName(num, val){
	
	if(sv[num] == val)
		return;
	sv[num] = val;
	
	var $b = $("#playername"+num+" ");
	var $bs = $("#playername"+num+"  span");
	
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
        setTimeout(function(){startCWS(websocketServerLocation, callback)}, 5000);
    };
}