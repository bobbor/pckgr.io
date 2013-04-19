(function(window) {
	var F = window.Sluraff;

	var s4 = function() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	};

	F.guid = function() {
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	};
}(this));