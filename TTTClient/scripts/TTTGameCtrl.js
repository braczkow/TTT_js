define(function() {
	
	function TTTGameCtrl(tttGameView) {
		console.log("New TTTGameCtrl created");
		var gameState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		var currentPlayer = 1;
		
		var gameFinished = false;
		
		var tttView = tttGameView;

		tttView.UpdateCurrentPlayer(currentPlayer);
		
		var tooglePlayer = function() {
			console.log("TTTGame.tooglePlayer currentPlayer = " + currentPlayer);
			
			if (currentPlayer == 1)
				currentPlayer = 2;
			else if (currentPlayer == 2)
				currentPlayer = 1;
			
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
		}

		this.onFieldTried = function(fieldId)  {
			console.log("TTTGame.onFieldTried");
			
			if (gameFinished) {
				console.log("TTTGame.onFieldTried - gameFinished");
				return;
			}
			
			if (fieldId > 8) {
				console.log("TTTGameCtrl.onFieldTried : invalid fieldId = " + fieldId);
				return;
			}
			
			if (gameState[fieldId] == 0) {
				console.log("TTTGameCtrl.onFieldTried : not clicked yet");
				gameState[fieldId] = currentPlayer;
				
				tttView.UpdateField(fieldId, currentPlayer);

				var wonTheGame = checkIfGameFinished();
				
				if (!wonTheGame) {
					tooglePlayer();
				
					tttView.UpdateCurrentPlayer(currentPlayer);
				} 
				else {
					gameFinished = true;
					tttView.ShowWinner(currentPlayer);
				}
				
				
			}
		};
		
		this.resetGame = function() {
			console.log("TTTGame.resetGame");
			
			gameState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			currentPlayer = 1;
			gameFinished = false;
			
			tttView.ResetView();
			
		};
	}

	return TTTGameCtrl;
});