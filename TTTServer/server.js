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
 
 
var server = ws.createServer(function (conn) {
    console.log("createServer: connected.");
	
	playerId++;
	
	connToPlayerId[conn] = playerId;
	playerIdToConn[playerId] = conn;
	
	if (freePlayerId === -1) {
		console.log("createServer: none is waiting");
		freePlayerId = playerId;
		playerToPlayer[playerId] = -1;
		
		var messageToThisPlayer = 
		{
			type: "opponent_NA"
		}
		conn.sendText(JSON.stringify(messageToThisPlayer));
		
	}
	else {
		playerToPlayer[freePlayerId] = playerId;
		playerToPlayer[playerId] = freePlayerId;
		
		var playerA = (playerId < freePlayerId ? playerId : freePlayerId);
		var playerB = (playerId > freePlayerId ? playerId : freePlayerId);
		
		var gameSession = 
		{
			gameState:[0, 0, 0, 0, 0, 0, 0, 0, 0], 
			playerA: playerA,
			playerB: playerB,
		};
		
		gameSessions[[playerA, playerB]] = gameSession;
		
		var messageToFreePlayer = 
		{
			type: "opponent_init",
			opponentId: playerId
		};
		playerIdToConn[freePlayerId].sendText(JSON.stringify(messageToFreePlayer));	
		
		var messageToThisPlayer = 
		{
			type: "opponent_init",
			opponentId: freePlayerId
		}
		conn.sendText(JSON.stringify(messageToThisPlayer));
		
		freePlayerId = -1;
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
		
		var playerId = connToPlayer[conn];
		console.log("onClose: player " + playerId + " quit");
		
		var opponentId = playerToPlayer[playerId];
		console.log("onClose: opponentId: " + opponentId);
		
		if (opponentId) {
			console.log("Inform opponent, that player quit.");
			var opponentConnection = playerToConn[opponentId];
			if (opponentConnection) {
				opponentConnection.sendText(JSON.stringify({ type: "opponent_quit" }));
			}
		}
				
    })
}).listen(8001).on('error', function(err) { console.log("caught erro: " + err); } );
