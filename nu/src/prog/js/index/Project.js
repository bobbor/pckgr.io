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

	F.defs.Project = Backbone.Model.extend({
		defaults: function () {
			return {
				name: "some Name",
				features: []
			};
		},
		initialize: function() {}
	});

}(this));