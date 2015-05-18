var socket = new WebSocket("ws://localhost:8001");

var connectionInitialized = false;

var opponentInitialized = false;

var sessionId;
var playerId;

socket.onopen = function() {
	console.log('connected.');
	
	connectionInitialized = true;
	
};

socket.onmessage = function(text) {
	console.log('onMessage:  ' + text.data);
	
	var message = JSON.parse(text.data);
	
	sessionId = message.sessionId;
	
	playerId = message.playerId;

};

function initialize() {
	socket.send('first message');
}

var field = document.getElementById("field_0");
field.addEventListener("click", function() {
	console.log("onClick");
	
	console.log("About to post field tried");
	
	var message = 
	{
		type : "playerMove",
		fieldId : 1,
		playerId : playerId,
		sessionId : sessionId
	};
	
	var text = JSON.stringify(message);
	
	socket.send(text);
});