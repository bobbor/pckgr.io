/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  $   = window.jQuery
		, F   = window.Frontender
		, app = {
			go: function() {

			},
			ready: function() {
				var mainView = new F.core.MainView({
					el: $('#content')
				});
			}
		}
	;

	app.go();
	$(app.ready);

}(this));