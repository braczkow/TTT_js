var TTTGameCtrl = function(id_one, id_two, tttGameView) {
	var id_one = id_one;
	var id_two = id_two;
	
	var tttView = tttGameView;
	
	var gameState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	var currentPlayer = id_one;
	
	var gameFinished = false;
	
	var tooglePlayer = function() {
		console.log("TTTGame.tooglePlayer currentPlayer (before) = " + currentPlayer);
		
		if (currentPlayer == id_one)
			currentPlayer = id_two;
		else if (currentPlayer == id_two)
			currentPlayer = id_one;
		
		console.log("TTTGame.tooglePlayer currentPlayer (after) = " + currentPlayer);
		
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
			console.log("TTTGameCtrl.onPlayerMove : not this player; currentPlayer = " + currentPlayer + " playerId = " + playerId);
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

module.exports = TTTGameCtrl;

