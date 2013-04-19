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
			if(global.windows.detail[id]) {
				global.windows.detail[id][0].close(true);
			}
			this.model.destroy();
		},
		openDetails: function() {
			var that = this;
			var id = this.model.id;

			if(global.windows.detail[id]) {
				global.windows.detail[id][0].focus();
				return;
			}
			var win = gui.Window.open('detail.html?id='+id, {
				title: this.model.get('name'),
				toolbar: true,
				height: 550,
				width: 950
			});
			global.windows.detail[id] = [win, this.model];
			win.on('close', function() {
				this.hide();
				global.windows.detail[id] = !1;
				this.close(true);
			});
			win.showDevTools();
		}
	});
}(this));