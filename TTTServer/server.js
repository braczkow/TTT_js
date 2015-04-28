var ws = require("nodejs-websocket");

var playerId = 0;
var connToPlayerId = {};
var playerIdToConn = {};
var playerToPlayer = {};

var gameSessions = {};

var freePlayerId = -1;

function getPlayersTuple(playerA, playerB) {
	var playerMin = (playerA < playerB ? playerA : playerB);
	var playerMax = (playerA > playerB ? playerA : playerB);
	
	return [playerMin, playerMax];
}

function initializePlayer(conn) {
	console.log("initializePlyaer");
	
	playerId++;
	
	connToPlayerId[conn] = playerId;
	playerIdToConn[playerId] = conn;
	
}
	
function addWaitingPlayer(conn) {
	console.log("addWaitingPlayer");

	freePlayerId = playerId;
	playerToPlayer[playerId] = -1;
	
	var messageToThisPlayer = 
	{
		type: "opponent_NA"
	}
	conn.sendText(JSON.stringify(messageToThisPlayer));
}

function initializeGameSession() {
	console.log("initializeGameSession");
	
	playerToPlayer[freePlayerId] = playerId;
	playerToPlayer[playerId] = freePlayerId;
	
	var playersTuple = getPlayersTuple(playerId, freePlayerId);
	
	console.log("initializeGameSession : playersTuple " + playersTuple);
	
	var gameSession = 
	{
		gameState:[0, 0, 0, 0, 0, 0, 0, 0, 0], 
		playerA: playersTuple[0],
		playerB: playersTuple[1],
	};
	
	gameSessions[playersTuple] = gameSession;

	sendOpponentInit(playersTuple[0], playersTuple[1]);
	
	sendOpponentInit(playersTuple[1], playersTuple[0]);
	
	freePlayerId = -1;
}

function sendOpponentInit(playerA, playerB) {
	console.log("sendOpponentInit");
	
	var message = 
	{
		type: "opponent_init",
		opponentId: playerB
	};
	
	if (playerIdToConn[playerA]) {
		console.log("sendOpponentInit : connection exists.");
		playerIdToConn[playerA].sendText(JSON.stringify(message));	
	}
	else {
		console.log("sendOpponentInit : no connection.");
	}
}
 
 
var server = ws.createServer(function (conn) {
    console.log("createServer: connected.");
	
	initializePlayer(conn);

	if (freePlayerId === -1) {
		addWaitingPlayer(conn);
	}
	else {
		initializeGameSession();
	}
	
	conn.on('error', function(err) {
		console.log('caught error ' + err);
	});
		

    conn.on("text", function (text) {
		
		console.log("onMessage: " + text);
		var message = JSON.parse(text);
		
		if (message.type == "field_clicked") {
			console.log("onMessage: field_clicked");
			var fieldId = message.fieldId;
	
			var playerId = connToPlayerId[conn];
			console.log('onMessage: playerId= ' + playerId);	

			var opponentId = playerToPlayer[playerId];
			console.log('onMessage: opponentId = ' + opponentId);
			
			if (opponentId < 0)
			{
				var errMessage = 
				{
					error: "no_opponent"
				};
				
				conn.sendText(JSON.stringify(errMessage));
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
	
    conn.on("close", function (code, reason) {
        console.log("closed.");
		
		var playerId = connToPlayerId[conn];
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
