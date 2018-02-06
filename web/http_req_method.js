var http = require('http');
var server = http.createServer(function(req,res){
	res.setHeader('Content-Type','text/html;charset=utf-8');
	switch(req.method){
		case 'POST':
			res.end('update');
			//update(req,res);
			break;
		case 'DELETE':
			res.end('remove');
			break;
		case 'PUT':
			res.end('create');
			break;
		case 'GET':
		default:
			res.end('get');
	}
});

server.listen(8080);
console.log("Server running at http://127.0.0.1:8080");