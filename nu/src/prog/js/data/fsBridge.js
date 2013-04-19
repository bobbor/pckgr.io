(function(window) {
	"use strict";
	var
		  F        = window.Sluraff
		, $        = window.jQuery
		, _        = window._
		, Backbone = window.Backbone
		, fs       = require('fs')
		, p        = require('path')
	;

	F.defs.FileBridge = function(path) {
		this.path = path;
		this.exists = fs.existsSync(path);
	};

	_.extend(F.defs.FileBridge.prototype, Backbone.Events, {
		read: function(callback) {
			if(this.exists) {
				return fs.readFile(this.path, 'utf8', function(err, data) {
					if(err) { return callback(false, err); }
					return callback(true, data);
				});
			}
			return callback(false);
		},
		write: function(data, callback, force) {
			var that = this;
			if(this.exists || force) {
				fs.writeFile(this.path, data, 'utf8', function(err) {
					if(err) { return callback(false, err); }
					that.exists = true;
					callback(true);
				});
			}
			callback(false);
		}
	});
}(this))