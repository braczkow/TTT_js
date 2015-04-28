define(function() {
	
	function TTTGameView()
	{
		this.UpdateField = function(fieldId, playerNo) {
			console.log("TTTGameView.UpdateField : " + fieldId + " " + playerNo);
			
			var field = document.getElementById("field_" + fieldId);
			
			if (playerNo === 1) {	
				var img = document.createElement("img");
				img.setAttribute("src", "./img/X.png");
				
				field.appendChild(img);
			} 
			else if (playerNo === 2) {
				var img = document.createElement("img");
				img.setAttribute("src", "./img/O.png");
				
				field.appendChild(img);
			}
		}
		
		this.ResetView = function() {
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
		
		this.UpdateCurrentPlayer = function(playerNo){
			console.log("TTTGameView.UpdateCurrentPlayer : " + playerNo);
			
			var cp = document.getElementById("currentPlayer");
			cp.innerHTML = "Player " + playerNo + " round."
			
		}
		
		this.ShowWinner = function(playerNo) {
			console.log("TTTGameView.ShowWinner : " + playerNo);
			
			var cp = document.getElementById("currentPlayer");
			cp.innerHTML = "Game finished. Player " + playerNo + " won.";
			
		}
	}

	return TTTGameView;
	
});