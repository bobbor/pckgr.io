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

	$(function() {
		F = _.extend({}, F, window.opener.Frontender);

		$(function() {
			var createProcess = new F.defs.ProcessView({
				el: $('#content')
			});
		})
	});
}(this))