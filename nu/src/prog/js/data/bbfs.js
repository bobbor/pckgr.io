/**

 * Backbone Sync override

 * Part of Frontender
 * Licensed under GPLv2

 * @author bobbor (me@philipp-paul.com)

 */
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

	var origSync = Backbone.sync;

	Backbone.sync = function(method, model, options) {
		if(model.collection) {
			model = model.collection;
		}
		if(model.url().indexOf('http') === 0) {
			origSync.apply(this, arguments);
			return;
		}
		var folderExists = function(path)         { return fs.existsSync(path.join(p.sep)); };
		var folderCreate = function(path, isLast) { return  fs.mkdirSync(path.join(p.sep)); };
		var createFile = function(model, callback) {
			var   ret
				, i
				, path = p.resolve(model.url())
			;
			path = path.split(p.sep);
			if(!path[0]) { // unix and mac fix, where path's begin with the sep
				path[0] = p.sep;
			}
			generatorLoop:
			for(i = 1; i < path.length; i++) {
				if(!folderExists(path.slice(0,i))) {
					ret = folderCreate(path.slice(0,i));
					if(ret) {
						callback(false, ret);
					}
				}
			}
			var err = fs.writeFileSync(model.url(), JSON.stringify(model.toJSON()));
			if(err) {callback(false, err); }
			callback(true);
		};
		switch(method) {
			case "update":
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
			case "delete":
				fs.unlink(model.url(), function(err) {
					if(err) {
						return options.error(err);
					}
					return options.success();
				});
				break;
		}
	};
}(this));