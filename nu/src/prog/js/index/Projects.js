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

	F.core.SaveFile = F.core.File.extend({
		model: F.core.Project,
		url: function() {
			return 'data/savefile.frontender';
		}
	});
}(this));