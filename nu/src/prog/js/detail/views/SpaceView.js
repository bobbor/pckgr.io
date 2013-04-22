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

	F.defs.SpaceView = Backbone.View.extend({
		tagName: 'div',
		className: 'target',
		initialize: function() {
			this.logik = this.model.logic[this.options.logic];
			if(this.logik) {
				this.delegateEvents(this.logik.events);
			}
			this.template = _.template($(this.options.template).html())
		},
		render: function() {
			if(this.logik) {
				this.$el.addClass(this.model.id);
				this.$el.html(this.template(this.logik.view));
			}
			return this;
		}
	});
}(this))