(function($) {
	if(typeof packer === "undefined") { packer = {}; }
	packer.lintConfig = function() {
		
		var configjson = air.File.applicationStorageDirectory.resolvePath("lint.json");
		var config = {};
		var defaultConfig = {
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