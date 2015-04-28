var socket = new WebSocket("ws://localhost:8001");

socket.onopen = function() {
	console.log('connected.');
	
	//initialize();
	
};

socket.onmessage = function(message) {
	console.log('on message: ' + message.data);

};

function initialize() {
	socket.send('first message');
}