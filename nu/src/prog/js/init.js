/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  $   = window.jQuery
		, F   = window.Frontender
		, gui = require('nw.gui')
		, app = {
			go: function() {
				F.inst.mainWindow = gui.Window.get();
				F.inst.updater = new F.defs.Updater('http://localhost:8080');
				F.inst.updater.on('updateAvailable', function() {
					if(confirm('wanna update?')) {
						F.inst.updater.download();
					}
				})
			},
			ready: function() {
				F.inst.saveFile = new F.defs.SaveFile()
				var mainView = new F.defs.MainView({
					el: $('#content')
				});
				var footer = new F.defs.FooterView({
					el: $('footer')
				});
			}
		}
	;

	app.go();
	$(app.ready);

}(this));