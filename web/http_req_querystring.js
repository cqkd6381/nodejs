var http = require('http');
var url = require('url');
var querystring = require('querystring');
var server = http.createServer(function(req,res){
	res.setHeader('Content-Type','text/html;charset=utf-8');
	var query = querystring.parse(url.parse(req.url).query);
	// var query = url.parse(req.url,true).query;
	res.end(JSON.stringify(query));
});

server.listen(8080);
console.log("Server running at http://127.0.0.1:8080?foo=bar&baz=val");