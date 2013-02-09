/**
 * @author Philipp
 *
 *
 * config_layout.js - 20.01.2012
 */
(function(pack, window, undefined) {
	"use strict";
	
	pack.layout('config_layout', ['filemanager'], {
		config: {},
		_init: function(fm) {
			var that = this;
			this.fm = fm;
			this.readConfig(function(result) {
				if(!result.ok) {
					that.writeConfig();
				}
			});
			that.setConfigJSON();
		},
		readConfig: function(cb) {
			var that = this;
			that.fm.readContent(true, that.configjson, function(result) {
				if(result.ok) {
					that.config = result.parsed;
					cb && cb({ok: true});
				} else {
					that.config = that.defaultConfig;
					cb && cb({ok: false});
				}
			});
		},
		writeConfig: function(cb) {
			var that = this;
			that.fm.writeContent(that.configjson, JSON.stringify(that.config, null, '\t'), false, cb);
		}
	});
}(packager, window));