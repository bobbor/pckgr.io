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

	if(Array.prototype.remove === void 0) {
		Array.prototype.remove = function(from, to) {
			var rest = this.slice((to || from) + 1 || this.length);
			this.length = from < 0 ? this.length + from : from;
			return this.push.apply(this, rest);
		};
	}
	F.defs.ResultView = Backbone.View.extend({
		tagName: 'div',
		className: 'step',
		template: _.template($('#result-template').html()),
		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.model.view = this;
		},
		render: function() {
			this.$el.prop('id', this.model.id);
			var json = this.model.toJSON();
			if(json.data) {
				this.$el.html(this.template(json));
			}
			return this;
		}
	});
}(this));