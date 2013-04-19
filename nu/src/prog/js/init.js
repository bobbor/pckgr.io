/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  $   = window.jQuery
		, F   = window.Sluraff
		, gui = require('nw.gui')
		, fs  = require('fs')
		, app = {
			go: function() {
				F.inst.mainWindow = gui.Window.get();
				F.inst.updater = new F.defs.Updater('http://localhost:8080');
				F.inst.updater.on('updateAvailable', function(current, newversion) {
					if(confirm('an update is available\nfrom version '+current+' to version '+newversion+'\nwanna update?')) {
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
				F.inst.saveFile.on('create', function(model) {
					var file = model.get('url'), data;
					if(!fs.existsSync(file)) {
						data = JSON.parse(JSON.stringify(model.toJSON()));
						delete data.url;
						fs.writeFileSync(file, JSON.stringify(data))
					}
				})
			}
		}
	;

	app.go();
	$(app.ready);

}(this));