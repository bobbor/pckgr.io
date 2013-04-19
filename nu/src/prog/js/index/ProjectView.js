/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  F        = window.Sluraff
		, $        = window.jQuery
		, _        = window._
		, Backbone = window.Backbone
		, gui      = require('nw.gui')
	;

	F.defs.ProjectView = Backbone.View.extend({
		tagName: 'section',
		className: 'project',
		template: _.template($('#projectView-template').html()),
		events: {
			"click button.delete": "clear",
			"click button.detail": "openDetails"
		},
		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		clear: function() {
			this.model.destroy();
		},
		openDetails: function() {
			var that = this;
			if(this.model.window) {
				this.model.window.focus();
				return;
			}
			var win = gui.Window.open('detail.html', {
				title: 'Details',
				toolbar: true,
				height: 430,
				width: 830
			});
			this.model.window = win;
			win.on('loaded', function() {
				win.window.Sluraff.basis = that.model;
				win.window.SluraffBridge = function(inst, method, val) {
					F.inst[inst][method](val);
				}
			});
		}
	});
}(this));