var GameSession = require('./GameSession');

var GameController = function() {
	console.log("GameController ctor");
	
	var lastId = 0;
	
	var gameSessions = {};
	
	var waitingSession = new GameSession();
	
	this.onConnection = function(connection) {
		console.log("GameController.onConnection");
		
		waitingSession.addPlayerConnection(connection, ++lastId);
		
		if (waitingSession.isInitialized()) {
			console.log("GameController : create new waitingSession");
			
			gameSessions[waitingSession.getSessionId()] = waitingSession;
			waitingSession.startGame();
			
			waitingSession = new GameSession();
		}
		
	};
	
	this.onText = function(text) {
		console.log("GameController.onText : " + text);
	
		console.log("GameController.onText - text type" + typeof(text));

		 		
		var message = JSON.parse(text);
;
		
		
		if (!message.sessionId) {
			console.log("GameController.onText : no sessionId");
			return;
		}

		var gameSession = gameSessions[message.sessionId];
		if (!gameSession) {
			console.log("GameController.onText : no gameSession");
			return;
		}
		
		gameSession.onMessage(message);
	}
	
	
};

module.exports = GameController;
