/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  F        = window.Frontender
		, $        = window.jQuery
		, _        = window._
		, Backbone = window.Backbone
		, config   = new F.defs.FileBridge('prog/storage/create.json')
	;

	F.defs.CreateSteps = Backbone.Collection.extend({
		model: F.defs.Step,
		fetch: function(method, model, options) {
			config.read(function(success, data) {
				options[success ? 'success': 'error'](data);
			});
		}
	})
}(this));