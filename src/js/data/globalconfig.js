(function(pack, window, undefined) {
	"use strict";
	var $ = window.jQuery;
	pack.decorate('globalconfig', 'config_layout', ['filemanager'], {
		defaultConfig: {
			lint: false,
			use_kit: false,
			kit_path: '',
			suppressExisting: false,
			warn_file: false,
			show_recent: true,
			min_tray: true,
			dblpack: false,
			show_warning: true,
			tooltip: true,
			autostart: false,
			defaultApp: false,
			packer: 'closure',
			language: 'de_DE'
		},
		setConfigJSON: function() {
			this.configjson = air.File.applicationStorageDirectory.resolvePath("config.json");
		},
		toggleOption: function(id, val, cb) {
			var that = this;
			that.config[id] = val;
			$('#wrapper')[that.config.show_recent ? 'removeClass' : 'addClass']('norecent');
			$('#wrapper')[that.config.use_kit ? 'addClass' : 'removeClass']('use_kit');
			$('button.lint').css({
				display: that.config.lint ? 'block' : 'none'
			});
			cb && cb({ok: true});
		}
	});
}(packager, window));
