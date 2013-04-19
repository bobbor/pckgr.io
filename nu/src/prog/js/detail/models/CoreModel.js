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

	F.defs.CoreModel = Backbone.Model.extend({
		initialize: function() {
			this.bridge = new F.defs.FileBridge(F.basis.get('url'));
		},
		sync: function(method, model, opts) {
			switch(method) {
				case "update":
					this.bridge.write(JSON.stringify(model.toJSON()), function(success) {
						if(!success) {
							alert('could not save project '+model.get('name'));
						}
					});
			}
		}
	});

}(this));