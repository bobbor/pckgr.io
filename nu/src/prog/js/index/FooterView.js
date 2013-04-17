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
			var win = gui.Window.open('create.html', {
				title: 'Create new Project',
				toolbar: true,
				position: 'mouse',
				height: 350,
				width: 500,
				resizable: false,
				'always-on-top': true
			});
			win.on('loaded', function() {
				win.window.FrontenderBridge = function(inst, method, val) {
					F.inst[inst][method](val);
				}
			})
		}
	});
}(this));