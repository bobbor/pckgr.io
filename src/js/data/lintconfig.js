(function(pack, window, undefined) {
	"use strict";
	var $ = window.jQuery;
	pack.decorate('lintconfig', 'config_layout', ['filemanager'], {
		defaultConfig: {
			asi: false,
			bitwise: false,
			boss: true,
			curly: false,
			eqeqeq: false,
			eqnull: true,
			evil: false,
			forin: true,
			immed: false,
			laxbreak: true,
			newcap: false,
			noarg: true,
			noempty: false,
			nonew: false,
			nomen: false,
			onevar: false,
			plusplus: false,
			regexp: false,
			undef: false,
			sub: true,
			strict: false,
			white: false
		},
		setConfigJSON: function() {
			this.configjson = air.File.applicationStorageDirectory.resolvePath("lint.json");
		},
		toggleOption: function(id, val, cb) {
			var that = this;
			that.config[id] = val;
			cb && cb({ok: true});
		}
	});
}(packager, window));