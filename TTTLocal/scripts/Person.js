define(function() {

	function Person() {
		var age = 14;
		var height = 171;
	
		this.GetAge = function() {
			return age;
		}
		this.GetHeight = function() {
			return height;
		}
	}

	return Person;

});