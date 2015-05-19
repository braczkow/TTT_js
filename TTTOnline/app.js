var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/client'));


app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});


var GameController = require('./scripts/GameController');

var gameCtrl = new GameController();

console.log('Created game');




io.on('connection', function(socket){
  	console.log('a user connected');

	gameCtrl.onConnection(socket);

	socket.on('text', function(text) {
		console.log('on text: ' + text);

		gameCtrl.onText(text);	

	});

	socket.on('playerMove', function(text) {
		console.log('on playerMove');

		gameCtrl.onPlayerMove(text);

	});
	
	

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


