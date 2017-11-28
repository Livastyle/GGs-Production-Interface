<html>
<head>
	<script type="text/javascript" src="js/jquery-3.1.1.min.js"></script>
	<script type="text/javascript">
	var ws;

	$(window).on('hashchange', function() {
		if(location.hash === "#used")
			return;
		
		var value = "";
		
		if(location.hash === "#resetscore")
			value = "resetScore()";
		if(location.hash === "#score1up")
			value = "modifyScore(1,1)";
		if(location.hash === "#score2up")
			value = "modifyScore(2,1)";
		if(location.hash === "#swapplayers")
			value = "sbSwapPlayers(0)";
		if(location.hash === "#swapplayers1")
			value = "sbSwapPlayers(1)";
		if(location.hash === "#swapplayers2")
			value = "sbSwapPlayers(2)";
		
		if(location.hash === "#createset")
			value = "vodCreateSet();casinoOpenBets();";
		
		if(value.length > 0)
			ws.send(JSON.stringify({"type":"command", "value":value}));
		location.hash = "#used";
	});

	function init(){
		startWS('ws://'+location.host+':5000');
	}
	
	function startWS(websocketServerLocation){
		if(ws == undefined || ws.readyState == undefined || ws.readyState === ws.CLOSED){
			ws = new WebSocket(websocketServerLocation);
			ws.onopen = function(){
				console.log("WS connected");
			}
			ws.onclose = function(){
				console.log("WS CLOSED, reconnect");
				setTimeout(function(){startWS(websocketServerLocation)}, 5000);
			};
		}
	}
	window.onload = init;
	</script>
</head>
<body>
gfd
</body>
</html>