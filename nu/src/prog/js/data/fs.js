/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  F           = window.Frontender
		, $           = window.jQuery
		, _           = window._
		, Backbone    = window.Backbone
		, fs          = require('fs')
		, p           = require('path')
	;

	F.core.File = Backbone.Collection.extend({
		sync: function(method, model, options) {
			var folderExists = function(path)         { return fs.existsSync(path.join(p.sep)); };
			var folderCreate = function(path, isLast) { return  fs.mkdirSync(path.join(p.sep)); };

			var createFile = function(model, callback) {
				var   ret
					, i
					, path = p.resolve(model.url())
				;
				path = path.split(p.sep);

				generatorLoop:
				for(i = 1; i < path.length; i++) {
					if(!folderExists(path.slice(0,i))) {
						ret = folderCreate(path.slice(0,i));
						if(ret) {
							callback(false, ret);
						}
					}
				}
				var err = fs.writeFileSync(model.url(), JSON.stringify(model.get('projects')));
				if(err) {callback(false, err); }
				callback(true);
			};
			switch(method) {
				case "create":
					createFile(model, function(success, extra) {
						options[success ? 'success' : 'error'](extra);
					});
					break;
				case "read":
					fs.readFile(model.url(), function(err, data) {
						if(err) {
							return options.error(err);
						}
						if(options.parse) {
							return options.success(JSON.parse(data));
						}
						return options.success(data);
					});
					break;
				case "update":
					F.warn('Wants to update something - needs to be implemented');
					break;
				case "delete":
					F.warn('Wants to delete something - needs to be implemented');
					break;
			}
		}
	});
}(this));