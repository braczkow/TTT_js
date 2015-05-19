var ws = require("nodejs-websocket");

var GameController = require('./scripts/GameController');

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
    });
	
    ws_connection.on("close", function (code, reason) {
        console.log("closed.");
		
		// var playerId = connToPlayerId[ws_connection];
		// console.log("onClose: player " + playerId + " quit");
		
		// var opponentId = playerToPlayer[playerId];
		// console.log("onClose: opponentId: " + opponentId);
		
		// if (opponentId) {
			// console.log("Inform opponent, that player quit.");
			// var opponentConnection = playerIdToConn[opponentId];
			// if (opponentConnection) {
				// opponentConnection.sendText(JSON.stringify({ type: "opponent_quit" }));
			// }
		// }
				
    });
}).listen(8001).on('error', function(err) { console.log("caught erro: " + err); } );
