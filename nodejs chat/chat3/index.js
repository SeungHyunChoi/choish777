var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log("in.on => "+socket);
  socket.on('chat message', function(msg){
	console.log("socket.on => "+socket);  	
    io.emit('chat message', msg);
	console.log("io.emit => "+socket+ "  = " + msg);  	   
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});