var fs = require("fs");
var rs = fs.createReadStream('test.md',{highWaterMark:6});
var data = '';
rs.on('data',function(chunk){
	data += chunk;
	console.log(chunk.length);
	console.log(chunk.toString());
});
rs.on('end',function(chunk){
	console.log(data);
});