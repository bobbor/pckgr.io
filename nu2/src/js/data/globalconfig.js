(function($) {
	if(typeof packer === "undefined") { packer = {}; }
	packer.globalConfig = function() {
		var configjson = air.File.applicationStorageDirectory.resolvePath("config.json");
		var config = {};
		var defaultConfig = {
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
		};
		
		function readConfig() {
			var result = packer.filemanager.readContent(configjson);
			if(result.ok) {
				try {
					config = JSON.parse(result.content);
				} catch(e) {
					try {
						config = eval('('+result.content+')');
					} catch(ex) {
						config = defaultConfig;
					}
				}
				config = $.extend(true, {}, defaultConfig, config);
				return {
					ok: true,
					config: config
				};
			}
			config = defaultConfig;
			return {
				ok: false,
				config: config
			};
		}
		
		function writeConfig() {
			$('#wrapper')[config.show_recent ? 'removeClass' : 'addClass']('norecent');
			$('#wrapper')[config.use_kit ? 'addClass' : 'removeClass']('use_kit');
			$('button.lint').css({
				display: config.lint ? 'block' : 'none'
			});
			
			if (packer.filemanager.writeContent(configjson, JSON.stringify(config, null, '\t'))) {
				return {
					ok: true,
					config: config
				};
			}
			return {
				ok: false,
				config: config
			};
		}
		function toggleOption(id, val) {
			config[id] = val;
			return writeConfig();
		}
		return {
			init: function() {
				var result = readConfig();
				this.config = result.config;
				if(!result.ok) {
					writeConfig();
				}
			},
			readConfig: readConfig,
			config: config,
			toggleOption: toggleOption
		};
	}();
}(jQuery));
