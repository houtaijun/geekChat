var express = require("express"),
    sio = require("socket.io");

var app = express.createServer(
	express.bodyParser(),
	express.static('public')
);

app.listen(3001);

var io = sio.listen(app);

//设置监视器
io.sockets.on('connection',function(socket) {
   socket.on('join',function(name){
	socket.nickname = name;
	console.log(name + "join");
	socket.broadcast.emit('announcement',name + ' 加入群聊。');
   });

   socket.on('text',function(msg){
        socket.broadcast.emit('text',socket.nickname,msg);
   });

});




