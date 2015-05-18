define(function(require) {
	
	var TTTGameView = require('TTTGameView');
	var tttGameView = new TTTGameView();
	
	var TTTGameCtrl = require('TTTGameCtrl');
	
	var tttCtrl = new TTTGameCtrl(tttGameView);

	
	for (var i=0; i<9; i++)
	{
		(function() {
			var field = document.getElementById("field_" + i);
			var fieldId = i;
			field.addEventListener("click", function() {
				tttCtrl.onFieldTried(fieldId) 
			});
		}())
	}
	
	var resetButton = document.getElementById("resetButton");
	resetButton.addEventListener("click", function() { 
		tttCtrl.resetGame(); 
	});
	
	
});