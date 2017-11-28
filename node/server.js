var WebSocketServer = require('ws').Server;
var port = 5000;
var pingInterval = 20;
var wss;
var clients = [];
var lastData = {};

wss = new WebSocketServer({ port: port });

console.log("Start up");
wss.on('listening', function (ws) {
	setInterval(wss.pingAll, pingInterval*1000);
	console.log("server is listening on port "+port);
});

wss.broadcast = function broadcast(data) {
	wss.clients.forEach(function each(client) {
		client.send(data);
	});
};
wss.pingAll = function(data) {
	wss.clients.forEach(function each(client) {
		client.ping();
	});
};

wss.on('connection', function(ws) {
	try {
		for(index in lastData){
			ws.send(lastData[index]);
		}		
	}catch(ex){
		console.error(ex);
	}
	ws.on('message', function(data) {
		try {
			var jsonData = JSON.parse(data);
			lastData[jsonData.type] = data;
		}catch(ex){
			console.error(ex);
		}
		try {
			wss.clients.forEach(function(client) {
				if (client != ws) {
					try {
						client.send(data);
					}catch(err){
						console.log(err);
					}
				}
			});
		}catch(ex){
			console.log(ex);
		}
	});
});