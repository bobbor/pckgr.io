/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  F        = window.Frontender
		, $        = window.jQuery
		, _        = window._
		, Backbone = window.Backbone
	;

	F.defs.SaveFile = Backbone.Collection.extend({
		model: F.defs.Project,
		url: function() {
			return 'data/savefile.frontender';
		},
		initialize: function() {
			this.on('destroy', this.onDestroy, this);
		},
		onDestroy: function(model, collection, options) {
			this.sync('update', collection, options);
		}
	});
}(this));