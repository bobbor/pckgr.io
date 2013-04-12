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

	F.core.Project = Backbone.Model.extend({
		defaults: function () {
			return {
				name: "some Name",
				features: []
			};
		},
		initialize: function() {}
	});

}(this));