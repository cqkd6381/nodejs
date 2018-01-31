var http = require('http');
var fs = require('fs');
var server = http.createServer(function(req,res){
	res.setHeader('Content-Type','text/html;charset=utf-8');
	fs.readFile('./index.html',function(err,data){
		if(err){
			res.end(err.toString());
		}else{
			res.end(data);
		}
	})
});

server.listen(8080);
console.log("Server running at http://127.0.0.1:8080");