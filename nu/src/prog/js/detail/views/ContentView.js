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

	F.defs.ContentView = Backbone.View.extend({
		tagName: 'section',
		className: 'target content',
		initialize: function() {
			this.logik = this.model.logic[this.options.logic];
			if(this.logik && this.logik.events) {
				this.delegateEvents(this.logik.events);
			}
		},
		render: function() {
			if(this.logik) {
				this.$el.addClass(this.model.id);
				if(this.logik.extraKlass) {
					this.$el.addClass(this.logik.extraKlass);
				}
				this.$el.html(this.logik.render(this.model.toJSON().config));
				if(this.logik.plugs) {
					for(var i = 0; i < this.logik.plugs.length; i++) {
						this.$el[this.logik.plugs[i]]();
					}
				}
			}
			return this;
		}
	});
}(this));