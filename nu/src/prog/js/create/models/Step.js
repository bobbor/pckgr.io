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

	F.defs.Step = Backbone.Model.extend({
		validate: function(r) {
			switch(this.id) {
				case "create-name-01":
				case "create-location-01":
					r = this.view.$el.find('form').serializeArray();
					r = r[0].value
					console.log(r, ''+r===r, r.length, (''+r===r && r.length))
					return (''+r===r && r.length);
			}
			return true;
		}
	});
}(this));