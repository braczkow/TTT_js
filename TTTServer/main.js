var ws = require("nodejs-websocket");
var WeakMap = require('weakmap');

var playerId = 0;
var connToPlayerId = {};
var playerIdToConn = {};
var playerToPlayer = {};

var gameSessions = {};

var freePlayerId = -1;
 
 
var server = ws.createServer(function (conn) {
    console.log("connected.");
	
	playerId++;
	
	connToPlayerId[conn] = playerId;
	playerIdToConn[playerId] = conn;
	
	if (freePlayerId === -1) {
		freePlayerId = playerId;
		playerToPlayer[playerId] = -1;
		
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
			opponentId: playerId
		};
		playerIdToConn[freePlayerId].sendText(JSON.stringify(messageToFreePlayer));	
		
		var messageToThisPlayer = 
		{
			oponenId: freePlayerId
		}
		conn.sendText(JSON.stringify(messageToThisPlayer));
		
		freePlayerId = -1;
	}
	
	conn.on('error', function(err) {
		console.log('caught error ' + err);
	});
		

    conn.on("text", function (message) {
	
		var myId = connToPlayerId[conn];
		console.log('myId= ' + myId);	

		var opponentId = playerToPlayer[myId];
		console.log('opponentId = ' + opponentId);
		
		if (opponentId < 0)
		{
			var errMessage = 
			{
				error: "no_opponent"
			};
			
			conn.sendText(JSON.stringify(errMessage));
			return;
		}
		
		

		
		if (opponentId > 0)
		{			
			var playerA = (myId < opponentId ? myId : opponentId);
			var playerB = (myId > opponentId ? myId : opponentId);
			
			console.log("playerA: ", playerA);
			console.log("playerB: ", playerB);
			
			console.log(gameSessions[[playerA, playerB]].gameState);
		}
		
		
		
    })
	
    conn.on("close", function (code, reason) {
        console.log("closed.");
		//conn.close();
				
    })
}).listen(8001).on('error', function(err) { console.log("caught erro: " + err); } );
