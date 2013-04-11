(function(F, undefined) {
	"use strict";
	var app = {
		go: function() {
			F = {
				core: {},
				projects: {},
				version: '0.1'
			};
		},
		ready: function() {
			F.core.save = new F.FileHandler('./data/savefile.frontender', {
				create: true
			}, []);
		}
	};

	app.go();
	$(app.ready);

}(this.Frontender, void 0));