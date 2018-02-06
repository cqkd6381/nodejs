var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var server = http.createServer(function(req,res){
	res.setHeader('Content-Type','text/html;charset=utf-8');
	var pathname = url.parse(req.url).pathname;
	// res.end(pathname);
	fs.readFile(path.join(__dirname,pathname),function(err,file){
		if(err){
			res.writeHead(404);
			res.end('找不到相关文件' + path.join(__dirname,pathname));
			return;
		}
		res.writeHead(200);
		res.end(file);
	});
});

server.listen(8080);
console.log("Server running at http://127.0.0.1:8080");