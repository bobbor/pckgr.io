/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  F        = window.Sluraff
		, $        = window.jQuery
		, _        = window._
		, Backbone = window.Backbone
		, feats    = new F.defs.FeatureCollection()
		, r        = require('path').resolve
	;

	F.defs.ContentSpaceView = Backbone.View.extend({
		render: function() {
			//$('.content').stickHead();
		}
	});
}(this))