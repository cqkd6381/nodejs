var http = require('http');
var fs = require('fs');
var url = require('url');
var server = http.createServer(function(req,res){
	res.setHeader('Content-Type','text/html;charset=utf-8');
	var pathname = url.parse(req.url).pathname;
	var paths = pathname.split('/');
	var controller = paths[1] || 'index';
	var action = paths[2] || 'index';
	var args = paths.slice(3);
	
	if(handles[controller] && handles[controller][action]){
		handles[controller][action].apply(null,[req,res].concat(args));
	}else{
		res.writeHead(500);
		res.end('找不到响应服务器');
	}
});

var handles = {};
handles.index = {};
handles.index.index = function(req,res,foo,bar){
	res.writeHead(200);
	res.end(foo);
}

server.listen(8080);
console.log("Server running at http://127.0.0.1:8080/index/index/a/b/c");