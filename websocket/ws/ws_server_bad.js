var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({ port: 8181 });
var n = 0;
wss.on('connection', function (ws) {
    console.log('client connected');
    ws.on('message', function (message) {
        n++;
        if(n > 1){
            ws.send('you have a online client');
            return false;
        }
    	var i = 0;
    	setInterval(function(){
        	ws.send(n + ' you are ' + i);
        	i++;
    	},2000);
    });
    ws.on('error',function(){
    	console.log('error');
    });
});