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

	F.defs.SaveFile = Backbone.Collection.extend({
		model: F.defs.Project,
		url: function() {
			return 'data/savefile.sluraff';
		},
		initialize: function() {
			this.on('destroy', this.onDestroy, this);
		},
		onDestroy: function(model, collection, options) {
			this.sync('update', collection, options);
		},
		create: function() {
			var that = this;
			this.once('sync', function(model) {
				that.trigger('create', model);
			});
			Backbone.Collection.prototype.create.apply(this, arguments);
		}
	});
}(this));