var ws = require("nodejs-websocket");



var GameSession = function() {
	console.log("GameSession ctor");
	
	var connection_one = 0;
	var connection_two = 0;
	
	var id_one = 0;
	var id_two = 0;
	
	//var tttCtrl = new TTTGameCtrl();
	
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
	}
		
	
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
		console.log("onMessage: " + text);
		var message = JSON.parse(text);
		
		if (message.type == "field_clicked") {
			console.log("onMessage: field_clicked");
			var fieldId = message.fieldId;
	
			var playerId = connToPlayerId[ws_connection];
			console.log('onMessage: playerId= ' + playerId);	

			var opponentId = playerToPlayer[playerId];
			console.log('onMessage: opponentId = ' + opponentId);
			
			if (opponentId < 0)
			{
				var errMessage = 
				{
					error: "no_opponent"
				};
				
				ws_connection.sendText(JSON.stringify(errMessage));
				return;
			}
			
			var playersTuple = getPlayersTuple(playerId, opponentId),
			gameSession = gameSessions[playersTuple];
			
			console.log('onMessage: gameSession.gameState[fieldId] ' + gameSession.gameState[fieldId]);
			
			if (gameSession.gameState[fieldId] == 0)
			{
				console.log('onMessage: not clicked yet');
				gameSession.gameState[fieldId] = playerId;
			}
		}
		
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
