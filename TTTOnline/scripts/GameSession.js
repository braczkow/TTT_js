var TTTGameCtrl = require('./TTTGameCtrl');

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
			type : "startGame",
			sessionId : this.getSessionId(),
			playerId : id_one,
			isFirst : true
		};
		connection_one.sendText(JSON.stringify(message));
		
		message.playerId = id_two;
		message.isFirst = false;
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
				
				// if (!playerId || !fieldId) {
					// console.log("GameSession.onMessage : incomplete playerMove");
					// return;
				// }
				
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

module.exports = GameSession;


