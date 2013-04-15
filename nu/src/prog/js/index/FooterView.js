/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  F        = window.Frontender
		, $        = window.jQuery
		, _        = window._
		, Backbone = window.Backbone
		, gui      = require('nw.gui')
	;

	F.defs.FooterView = Backbone.View.extend({
		events: {
			"click button.create": "createNewProject"
		},
		createNewProject: function() {
			var that = this;
			this.createWindow = gui.Window.get(
				window.open('create.html')
			);

			/*F.inst.saveFile.create({
				name: 'Project B',
				features: ['pckgr.io', 'compass']
			});*/
		}
	});
}(this));