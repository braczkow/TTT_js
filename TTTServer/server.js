var ws = require("nodejs-websocket");

// var TTTRemoteView = function() {
	
	
	// this.updateField = function(fieldId, playerId) {
		// console.log("TTTRemoteView.updateField");
		
		
		
	// };
// };

var TTTGameCtrl = function(id_one, id_two, tttGameView) {
	var id_one = id_one;
	var id_two = id_two;
	
	var tttView = tttGameView;
	
	var gameState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	var currentPlayer = id_one;
	
	var gameFinished = false;
	
	var tooglePlayer = function() {
		console.log("TTTGame.tooglePlayer currentPlayer = " + currentPlayer);
		
		if (currentPlayer == id_one)
			currentPlayer = id_two;
		else if (currentPlayer == id_two)
			currentPlayer = id_one;
		
	};
	
	var checkIfGameFinished = function() {
		console.log("TTTGameCtrl.checkIfGameFinished");
		
		if (checkIfSameOfCurrentPlayer(0, 1, 2))
			return true;
		
		if (checkIfSameOfCurrentPlayer(3, 4, 5))
			return true;
		
		if (checkIfSameOfCurrentPlayer(6, 7, 8))
			return true;
		
		if (checkIfSameOfCurrentPlayer(0, 3, 6))
			return true;
			
		if (checkIfSameOfCurrentPlayer(1, 4, 7))
			return true;
		
		if (checkIfSameOfCurrentPlayer(2, 5, 8))
			return true;
			
		if (checkIfSameOfCurrentPlayer(0, 4, 8))
			return true;
		
		if (checkIfSameOfCurrentPlayer(2, 4, 6))
			return true;
		
		
		return false;
	};
		
	var checkIfSameOfCurrentPlayer = function(a, b, c) {
		if (gameState[a] === currentPlayer &&
			gameState[b] === currentPlayer &&
			gameState[c] === currentPlayer)
			return true;
		
		return false;
	};
	
	this.onPlayerMove = function(playerId, fieldId) {
		console.log("TTTGameCtrl.onPlayerMove");
		
		if (gameFinished) {
			console.log("TTTGame.onPlayerMove - gameFinished");
			return;
		}
		
		if (fieldId > 8) {
			console.log("TTTGameCtrl.onPlayerMove : invalid fieldId = " + fieldId);
			return;
		}
		
		if (playerId != currentPlayer) {
			console.log("TTTGameCtrl.onPlayerMove : not this player");
			return;
		}
		
		if (gameState[fieldId] == 0) {
			console.log("TTTGameCtrl.onPlayerMove : not clicked yet");
			gameState[fieldId] = currentPlayer;
			
			tttView.updateField(fieldId, currentPlayer);

			var wonTheGame = checkIfGameFinished();
			
			if (!wonTheGame) {
				tooglePlayer();
			
				//tttView.updateCurrentPlayer(currentPlayer);
			} 
			else {
				gameFinished = true;
				tttView.showWinner(currentPlayer);
			}
		}
	};
	
};


var GameSession = function() {
	console.log("GameSession ctor");
	
	var connection_one = 0;
	var connection_two = 0;
	
	var id_one = 0;
	var id_two = 0;
	var tttCtrl;
	
	this.addPlayerConnection = function(connection, id) {
		console.log("GameSession.addPlayer");
		
		if (!connection_one) {
			console.log("GameSession : assign connection_one");
			connection_one = connection;
			id_one = id;
		}
		else {
			console.log("GameSession : assign connection_two"); 
			connection_two = connection;
			id_two = id;
		}
	}
	
	this.isInitialized = function() {
		console.log("GameSession.isInitialized");
		
		console.log("returning : " + (id_one > 0 && id_two > 0));
		console.log("" + id_one + " " + id_two);
		
		return (id_one > 0 && id_two > 0);
	}
	
	this.getSessionId = function() {
		console.log("GameSession.getIds");
		
		return [id_one, id_two];
	}
	
	this.startGame = function() {
		console.log("GameSession.startGame");
		
		tttCtrl = new TTTGameCtrl(id_one, id_two, this);
		
		var message = {
			sessionId : this.getSessionId(),
			playerId : id_one
		};
		connection_one.sendText(JSON.stringify(message));
		
		message.playerId = id_two;
		connection_two.sendText(JSON.stringify(message));
		
	};
	
	this.onMessage = function(message) {
		console.log("GameSession.onMessage");
		
		if (!message.type) {
			console.log("GameSession.onMessage : empty type!");
			return;
		}
		
		switch (message.type) {
			case "playerMove" : 
				console.log("GameSession.onMessage : playerMoved");
				
				var playerId = message.playerId;
				var fieldId = message.fieldId;
				
				if (!playerId || !fieldId) {
					console.log("GameSession.onMessage : incomplete playerMove");
					return;
				}
				
				tttCtrl.onPlayerMove(playerId, fieldId);
				
				
				break;
		
		}
		
	}
	
	this.updateField = function(fieldId, playerId) {
		console.log("GameSession.TTTRemoteView.updateField");
		
		var message = {
			type : "updateField",
			fieldId : fieldId,
			playerId : playerId
		};
		
		var text = JSON.stringify(message);
		
		connection_one.sendText(text);
		connection_two.sendText(text);
		
	};
	
	this.showWinner = function(playerId) {
		var message = {
			type : "showWinner",
			playerId : playerId
		};
		
		var text = JSON.stringify(message);
		
		connection_one.sendText(text);
		connection_two.sendText(text);
	};
	
	
};

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
		console.log("GameController.onText");
		
		var message = JSON.parse(text);
		
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

var gameCtrl = new GameController();


var server = ws.createServer(function (ws_connection) {
    console.log("createServer: connected.");
	
	gameCtrl.onConnection(ws_connection);

	
	ws_connection.on('error', function(err) {
		console.log('caught error ' + err);
	});
		

    ws_connection.on("text", function (text) {
		console.log("onText: " + text);
		
		gameCtrl.onText(text);
		
		
    })
	
    ws_connection.on("close", function (code, reason) {
        console.log("closed.");
		
		var playerId = connToPlayerId[ws_connection];
		console.log("onClose: player " + playerId + " quit");
		
		var opponentId = playerToPlayer[playerId];
		console.log("onClose: opponentId: " + opponentId);
		
		if (opponentId) {
			console.log("Inform opponent, that player quit.");
			var opponentConnection = playerIdToConn[opponentId];
			if (opponentConnection) {
				opponentConnection.sendText(JSON.stringify({ type: "opponent_quit" }));
			}
		}
				
    })
}).listen(8001).on('error', function(err) { console.log("caught erro: " + err); } );
