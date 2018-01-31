var net = require('net');
setInterval(function(){
		
	var client = net.connect({port:1337},function(){
		console.log('client connected');
		// console.log('world!\r\n');
		// socket.write('' + n + '\r\n');
	});

	client.on('data',function(data){
		console.log(data.toString());
		client.end();
	});

	client.on('end',function(){
		console.log('client disconnected');
	});
},3000);