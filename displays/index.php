<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<script type="text/javascript" src="./../cp/js/jquery-3.1.1.min.js"></script>
		<script type="text/javascript">
		window.onload = init;
		var ws,clientID,rtime;
		var currentDisplay = "";
		
		var timeout = false;
		var delta = 200;
		
		var appRes = {x:0,y:0};
		
		$(window).resize(function() {
			rtime = new Date();
			if (timeout === false) {
				timeout = true;
				setTimeout(resizeend, delta);
			}
		});
		function resizeend() {
			if (new Date() - rtime < delta) {
				setTimeout(resizeend, delta);
			} else {
				timeout = false;
				sendConnect();
				checkDimensions();
			}               
		}
				
		
		function init(){
			clientID = getParameter('id');
			currentDisplay = getParameter('name');
			if(!clientID)
				clientID = Cookies.get("clientid");
			if(!clientID)
				clientID = guid();
			Cookies.set("clientid", clientID, { expires: 7000 });
			
			history.pushState(null, null, "?id="+clientID+"&name="+(currentDisplay ? currentDisplay : ""));
			
			$("#identifer-id").text(clientID);
			
			if(currentDisplay){
				$.ajax({
					url: "displays/"+currentDisplay+"/main.manifest",
					cache:false,
					dataType: 'json'
				}).done(function(data) {
					appRes = data.resolution;
					checkDimensions();
					$.ajax({
						url: "displays/"+currentDisplay+"/main.html",
						cache:false
					}).done(function(content) {
						$("#main").html(content);
						$.ajax({
							url: "displays/"+currentDisplay+"/main.js",
							dataType: 'script',
							async: true
						}).done(function(){
							
						});

						var head  = document.getElementsByTagName('head')[0];
						var link  = document.createElement('link');
						link.rel  = 'stylesheet';
						link.type = 'text/css';
						link.href = "displays/"+currentDisplay+"/main.css";
						link.media = 'all';
						head.appendChild(link);
						startWS('ws://'+location.host+':5000', innerprocess);
					});
				});
			}else{
				startWS('ws://'+location.host+':5000', innerprocess);
			}
			
			
		}
		
		function setupDisplay(name){
			location.href = location.origin + location.pathname +"?id="+getParameter('id')+"&name="+name
		}
		
		function startWS(websocketServerLocation, callback){
			if(ws == undefined || ws.readyState == undefined || ws.readyState === ws.CLOSED){
				ws = new WebSocket(websocketServerLocation);
				ws.onopen = function(){
					sendConnect();
				};
				ws.onmessage = function(evt) { 
					var wsdata = JSON.parse(evt.data);
					callback(wsdata.type, wsdata.data);
				};
				ws.onclose = function(){
					setTimeout(function(){startWS(websocketServerLocation)}, 5000);
				};
			}
		}
		
		function sendConnect(){
			var res = {"width":window.innerWidth, "height":window.innerHeight};
			sendDataToWebsocket({
				"clientID":clientID,
				"resolution":res,
				"currentDisplay":currentDisplay,
				"navigator":{
					"userAgent":navigator.userAgent,
					"language":navigator.language,
					"cores":navigator.hardwareConcurrency,
					"platform":navigator.platform
				}
			}, "connect");
		}
		
		function checkDimensions(){
			var scale = 0;
			var left = 0;
			var top = 0;
			var appAspect = appRes.x/appRes.y;
			var screenAspect = window.innerWidth/window.innerHeight;
			if(appAspect > screenAspect){
				// letterbox
				scale = window.innerWidth / appRes.x;
				top = ((window.innerHeight - (window.innerWidth / appAspect) ) /2);
			}else{
				// pillarbox
				scale =  window.innerHeight / appRes.y;
				left = ((window.innerWidth - (window.innerHeight * appAspect) ) /2);
			}
			
			$("#main").css({
				"left":left+"px",
				"top":top+"px",
				"width":appRes.x+"px",
				"height":appRes.y+"px",
				"transform":"scale("+scale+")"
			});
			console.log("scale("+scale+")");
			
		}
		
		function innerprocess(type, data){
			if(type == 'display'){
				if(data.type == 'auth'){
					sendConnect();
				}
				if(data.type == 'reload' && (data.value == clientID || data.value == null)){
					location.reload();
				}
				if(data.type == 'setup' && data.value.clientID == clientID){
					setupDisplay(data.value.name);
				}
				if(data.type == 'identify' && data.value == clientID){
					$("#identifer").addClass("show");
					setTimeout(function(){
						$("#identifer").removeClass("show");
					},100);
				}
			}
			
			if(typeof(process) == 'function'){
				process(type, data);
			}
			
		}
		
		function sendDataToWebsocket(data, type){
			if(ws != undefined && ws.readyState === ws.OPEN)
				ws.send(JSON.stringify({"type":"display", "data":{"type":type,"value":data}}));
		}

		function getParameter(name) {
			var params = location.search.substr(1).split("&");
			for(k in params){
				var tmp = params[k].split("=");
				if(tmp[0] === name)
					return decodeURIComponent(tmp[1]);
			}
			return null;
		}
		
		function guid() {
			return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
		}

		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		
		</script>
		<style type="text/css">
		* {
			cursor:none;
		}
		body {
			color:#fff;
			font-family: arial;
			font-size:20px;
			background:#000;
		}
		#main {
			position:fixed;
			left:0px;
			top:0px;
			background:#666;
			z-index:1;
			transform-origin:0px 0px;
		}
		
		#identifer {
			position:fixed;
			left:0px;
			right:0px;
			top:0px;
			bottom:0px;
			opacity:0;
			background:#fff;
			z-index:10;	
			transition:all 2100ms 1000ms;
		}
		#identifer.show {
			opacity:1;
			transition:all 100ms;
		}
		#identifer-id {
			position:absolute;
			left:0px;
			right:0px;
			top:calc(50% - 2vw);
			text-align:center;
			font-size: 4vw;
			color:#000;
		}
		</style>
	</head>
	<body>
		<div id="main"><div id="test"></div></div>
		<div id="identifer">
			<div id="identifer-id"></div>
		</div>
	</body>
</html>