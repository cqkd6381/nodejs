var Websocket = function(url){
	this.options = parseUrl(url);
	this.connect();
};

Websocket.prototype.onopen = function(){
	//todo
};

Websocket.prototype.setSocket = function(socket){
	this.socket = socket;
};

Websocket.prototype.connet = function(){
	var that = this;
	var key = new Buffer(this.options.protocolVersion + '-' + Date.now()).toString('base64');
	var shasum = crypto.createHash('sha1');

	var expected = shasum.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');

	var options = {
		port:this.options.port,
		host:this.options.hostname,
		headers:{
			'Connection':'Upgrade',
			'Upgrade':'websocket',
			'Sec-WebSocket-Version':this.options.protocolVersion,
			'Sec-WebSocket-key':key,
		}
	};

	var req = http.request(options);
	req.end();

	req.on('upgrade',function(res,socket,upgradeHead){
		that.setSocket(socket);
		that.onopen();
	})
}