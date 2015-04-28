define( function() {

	function OnlineTTTGameCtrl(tttGameView) {
		console.log("New OnlineTTTGameCtrl created");
		
		var tttView = tttGameView;
		
		var webSocketServerConnection = new WebSocket("ws://localhost:8080/socket";
		
		this.onFieldTried = function(fieldId) {
			console.log("OnlineTTTGameCtrl.onFieldTried : " + fieldId);
			
			
			
		};
		
		this.resetGame = function() {
			console.log("OnlineTTTGameCtrl.resetGame : ");
		
		};
	
	}
	
	return OnlineTTTGameCtrl;
});