var net = require("net");

var server = net.createServer(function(socket){
	//新的连接
	socket.on('data',function(data){
		socket.write('start\n');
		var n = 0;
		setInterval(function(){
			n++;
			socket.write('' + n + '\r\n');
		},1000);
	});

	socket.on('end',function(){
		console.log('Disconnect');
	});

	//如果不侦听error事件，服务器将会抛出异常
	socket.on('error',function(){
		console.log('error');
	});

	socket.write('Welcom to node.js!\r\n');
	// socket.pipe(socket);

});

server.listen(1337,function(){
	console.log('server bound');
},'127.0.0.1');

console.log("Server running at http://127.0.0.1:1337");