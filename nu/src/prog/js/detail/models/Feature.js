/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  F        = window.Sluraff
		, $        = window.jQuery
		, _        = window._
		, Backbone = window.Backbone
		, r        = require('path').resolve
	;

	F.defs.Feature = Backbone.Model.extend({
		initialize: function(attr, opts) {
			this.logic = require(r('prog/js/features/'+attr.id+'/init.js'));
		}
	});
}(this));