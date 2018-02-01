var http = require('http');
var agent = new http.Agent({
	maxSockets:2//设置限制连接数为2，默认为5
});
var options = {
	hostname:'127.0.0.1',
	port:8080,
	path:'/',
	method:'GET',
	agent:agent//自定义代理对象
	// agent:false//脱离连接池的管理，使得请求不受并发限制
};

setInterval(function(){

	var req = http.request(options,function(res){
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data',function(chunk){
			console.log(chunk);
		});
	});

	if(agent.sockets['127.0.0.1:8080:']){
		//连接池中使用中的连接数
		console.log('sockets: ' + agent.sockets['127.0.0.1:8080:'].length);
	}else{
		console.log('sockets: ' + 0);
	}
	
	if(agent.requests['127.0.0.1:8080:']){
		//连接池中处于等待状态的请求数
		console.log('requests: ' + agent.requests['127.0.0.1:8080:'].length);
	}else{
		console.log('requests: ' + 0);
	}
	// req.end();//完成发送请求
},3000);
