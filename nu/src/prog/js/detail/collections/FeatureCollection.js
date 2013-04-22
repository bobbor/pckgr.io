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

	F.defs.FeatureCollection = Backbone.Collection.extend({
		model: F.defs.Feature,
		sync: function(method, model, opts) {
			switch(method) {
				case "read":
					opts.success(F.inst.CoreModel.get('features'));
					break;
				case "update":
					console.log('update collection');
					break;
			}
		}
	});
}(this));