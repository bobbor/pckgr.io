/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  F        = window.Sluraff
		, $        = window.jQuery
		, _        = window._
		, Backbone = window.Backbone
	;

	F.defs.CreateSteps = Backbone.Collection.extend({
		model: F.defs.Step,
		url: function() {
			return 'storage/create.json';
		},
		initialize: function() {
			this.on('destroy', this.onDestroy, this);
		},
		onDestroy: function(model, collection, options) {
			this.sync('update', collection, options);
		}
	});
}(this));