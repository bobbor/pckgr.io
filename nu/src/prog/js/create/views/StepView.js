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

	F.defs.StepView = Backbone.View.extend({
		tagName: 'div',
		className: 'step',
		template: _.template($('#basicStep-template').html()),
		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.model.view = this;
		},
		render: function() {
			this.$el.prop('id', this.model.id);
			this.$el.html(this.template(this.model.toJSON()));
			$('input.input_file', this.el).fileReplace();
			return this;
		}
	})
}(this));