/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  $        = window.jQuery
		, F        = window.Frontender
		, _        = window._
		, Backbone = window.Backbone
		, version  = new F.defs.FileBridge('prog/version')
		, fs       = require('fs')
		, remote
	;

	F.defs.Updater = function(url) {
		var that = this;
		this.url = url;
		if(!version.exists) {
			version.write("4.0.0.0", function() {}, true);
		}
		version.read(function(success, data) {
			if(!success) {
				that.trigger('read_error');
			}
			that.version = JSON.parse(data);
			remote = new F.defs.HTTPBridge(that.url+'/update?ver='+that.version);
			that.check();
		});
	};
	_.extend(F.defs.Updater.prototype, Backbone.Events, {
		check: function(silent) {
			var that = this;
			remote.get(function(data) {
				if(data.length) {
					that.updateData = JSON.parse(data);
					that.trigger('updateAvailable')
				}
			});
		},
		download: function() {
			if(_.keys(this.updateData.to_add).length) {
				this.recursive_download(this.updateData.to_add, 'prog/temp', '')
			}
		},
		recursive_download: function(obj, target, extra) {
			for(var prop in obj) {
				if(_.isArray(obj[prop])) {
					for(var i = 0;i<obj[prop].length;i++) {
						console.log(target+extra+'/'+obj[prop][i], this.url+'/download'+extra+'/'+obj[prop][i]);
					}
				}
				else {
					this.recursive_download(obj[prop], target, '/'+prop)
				}
			}
		}
	});
}(this));