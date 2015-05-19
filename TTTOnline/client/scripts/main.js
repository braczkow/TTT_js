define(function(require) {
	console.log('we are here');
	
	var socket = io();
	
	socket.on('ack', function(msg) {
		console.log('msg : ' + msg);
	});

	//socket.emit('text', "blabla");


	var TTTGameView = require("TTTGameView");
	var tttView;

	var gameInitialized = false;

	var sessionId;
	var playerId;

	//socket.onopen = function() {
	//	console.log('connected.');
	//	
	//};

	socket.on('showWinner', function(text) {
		console.log('on showWinner');
		
		var message = JSON.parse(text);

		var winnerId = message.playerId;
					
		tttView.showWinner(winnerId);
	
	});

	socket.on('updateField', function(text) {
		console.log('on updateField');

		var message = JSON.parse(text);

		var fieldId = message.fieldId;
		var playerId = message.playerId;

		tttView.updateField(fieldId, playerId);


	});

	socket.on('startGame', function(text) {
		console.log('on startGame');
	
		var message = JSON.parse(text);
		sessionId = message.sessionId;
		playerId = message.playerId;
		
		console.log('startGame : sessionId : ' + sessionId + ' playerId ' + playerId);
		
		for (var i=0; i<9; i++) {
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
				
					var text = JSON.stringify(message);
					
					console.log("on click: about to send:" + text);
						
					socket.emit('playerMove', text);
				});
			}())
		}
		
		console.log("startGame : registered onClick");
			
		tttView = new TTTGameView(sessionId[0], sessionId[1]);

	});



//	socket.on('text', function(text) {
//		console.log('onmessage:  ' + text);
//		var message = JSON.parse(text);
//		
//		if (!message.type) {
//			console.log("onmessage : empty type");
//			return;
//		}
//		
//		switch (message.type) {
//			case "startGame" :
//			console.log("onmessage : gameStarted");
//				sessionId = message.sessionId;
//				playerId = message.playerId;
//
//				console.log('startGame : sessionId : ' + sessionId + ' playerId ' + playerId);
//				
//				for (var i=0; i<9; i++) {
//					(function() {
//						var field = document.getElementById("field_" + i);
//						var fieldId = i;
//						field.addEventListener("click", function() {
//							var message = 
//							{
//								type : "playerMove",
//								fieldId : fieldId,
//								playerId : playerId,
//								sessionId : sessionId
//							};
//						
//							var text = JSON.stringify(message);
//							
//							console.log("on click: about to send:" + text);
//								
//							socket.emit('playerMove', text);
//						});
//					}())
//				}
//				
//				console.log("startGame : registered onClick");
//					
//				tttView = new TTTGameView(sessionId[0], sessionId[1]);
//			
//			break;
//
//			
//			case "showWinner" : 
//				console.log("onmessage : showWinner");
//				
//							
//			break;
//			
//			default:
//				console.log("onmessage : unknown message type");
//		}
//	});
		

});
