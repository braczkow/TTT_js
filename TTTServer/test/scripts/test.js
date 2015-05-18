var socket = new WebSocket("ws://localhost:8001");

var connectionInitialized = false;

var opponentInitialized = false;

socket.onopen = function() {
	console.log('connected.');
	
	connectionInitialized = true;
	
};

socket.onmessage = function(text) {
	console.log('onMessage:  ' + text.data);
	
	var message = JSON.parse(text.data);
	
	var res = {
		sessionId : message.sessionId,
		text : "ACK"
	};
	
	socket.send( JSON.stringify(res) );

};

function initialize() {
	socket.send('first message');
}

var field = document.getElementById("field_0");
field.addEventListener("click", function() {
	console.log("onClick");
	
	if (!connectionInitialized) {
		console.log("not initialized.");
		return;
	}
	
	if (!opponentInitialized) {
		console.log("Waiting for opponent.");
		return;
	}
	
	console.log("About to post field tried");
	
	var message = 
	{
		type: "field_clicked",
		fieldId: 1
	};
	
	socket.send(JSON.stringify(message));
});