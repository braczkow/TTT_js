define(function(require) {
	console.log('we are here');
	
	var socket = io();
	
	socket.on('ack', function(msg) {
		console.log('msg : ' + msg);
	});

	socket.emit('text', "blabla");


	var TTTGameView = require("TTTGameView");
	var tttView;

	var gameInitialized = false;

	var sessionId;
	var playerId;

	//socket.onopen = function() {
	//	console.log('connected.');
	//	
	//};

	socket.on('text', function(text) {
		console.log('onmessage:  ' + text);
		var message = JSON.parse(text);
		
		if (!message.type) {
			console.log("onmessage : empty type");
			return;
		}
		
		switch (message.type) {
			case "startGame" :
			console.log("onmessage : gameStarted");
				sessionId = message.sessionId;
				playerId = message.playerId;
				
				for (var i=0; i<9; i++)
				{
					(function() {
						var field = document.getElementById("field_" + i);
						var fieldId = i;
						field.addEventListener("click", function() {
							var message = 
							{
								type : "playerMove",
								fieldId : fieldId,
								playerId : playerId,
								sessionId : sessionId
							};
						
							console.log("on click: about to send");	
							var text = JSON.stringify(message);
							
							socket.emit('text', text);
						});
					}())
				}
				
				console.log("startGame : registered onClick");
					
				tttView = new TTTGameView(sessionId[0], sessionId[1]);
			
			break;
			
			case "updateField" :
				console.log("onmessage : updateField");
				
				var fieldId = message.fieldId;
				var playerId = message.playerId;
				
				tttView.updateField(fieldId, playerId);
			
			break;
			
			case "showWinner" : 
				console.log("onmessage : showWinner");
				
				var winnerId = message.playerId;
				
				tttView.showWinner(winnerId);
			
			break;
			
			default:
				console.log("onmessage : unknown message type");
		}
	});
		

});
