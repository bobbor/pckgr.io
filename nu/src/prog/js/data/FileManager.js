(function(F, undefined) {
	"use strict";
	
	var _ = window._;
	var Backbone = window.Backbone;

	var fs = require('fs');

	F.FileHandler = function(path, o, defaults) {
		this.path = o.path.split('/');
		this.base = o.base || process.cwd();
		if(o.create) {
			this.createFolder(this.base, this.path);
		}
		this.defaults = defaults;
	};

	_.extend(F.FileHandler.prototype, Backbone.Events, {
		createFolder: function(curr, remaining) {
			if(remaining.length === 1) {
				return;
			}
			var folder = remaining.shift();
			if(!fs.existsSync(curr+'/'+folder)) {
				fs.mkdirSync(curr+'/'+folder, '755');
			}
			this.createFolder(curr+'/'+folder, remaining);
		},
		checkFolder: function(curr, remaining) {
			if(!remaining.length) {
				return true;
			}
			var folder = remaining.shift();
			if(!fs.existsSync(curr+'/'+folder)) {
				return false;
			}
			return this.checkFolder(curr+'/'+folder, remaining);
		}
	});
}(this.Frontender, void 0));