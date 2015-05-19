define(function() {
	
	function TTTGameView()
	{
		var id_one,
			id_two;

		this.showInfo = function(message) {
			console.log('TTTGameView.showInfo');

			var cp = document.getElementById("currentPlayer");
			cp.innerHTML = message;
		};

		this.setIds = function (one, two) {
			console.log('TTTGameView.setIds');

			id_one = one;
			id_two = two;

		};

		
		this.updateField = function(fieldId, playerId) {
			console.log("TTTGameView.UpdateField : " + fieldId + " " + playerId);
		
			console.log('TTTGameView.UpdateField : id_one: ' + id_one + ' id_two: ' + id_two);
			
			
			var field = document.getElementById("field_" + fieldId);
			
			
			if (playerId == id_one) {	
				var img = document.createElement("img");
				img.setAttribute("src", "./img/X.png");
				
				field.appendChild(img);
			} 
			else if (playerId == id_two) {
				var img = document.createElement("img");
				img.setAttribute("src", "./img/O.png");
				
				field.appendChild(img);
			}
		}
		
		this.resetView = function() {
			console.log("TTTGameView.ResetView");
			
			var field;
			var i = 0;
			
			for ( i=0; i<9; i++) {
				field = document.getElementById("field_" + i);
				field.innerHTML = "";
			}
			
			var cp = document.getElementById("currentPlayer");
			cp.innerHTML = "Player 1 round."
			
		}
		
		this.updateCurrentPlayer = function(playerId){
			console.log("TTTGameView.UpdateCurrentPlayer : " + playerId);
			
			var cp = document.getElementById("currentPlayer");
			cp.innerHTML = "Player " + playerId + " round."
			
		}
		
		this.showWinner = function(playerId) {
			console.log("TTTGameView.ShowWinner : " + playerId);
			
			var cp = document.getElementById("currentPlayer");
			cp.innerHTML = "Game finished. Player " + playerId + " won.";
			
		}
	}

	return TTTGameView;
	
});
