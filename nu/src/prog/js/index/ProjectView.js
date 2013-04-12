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

	F.core.ProjectView = Backbone.View.extend({
		tagName: 'section',
		className: 'project',
		template: _.template($('#projectView-template').html()),
		events: {
			"click button.delete": "clear",
			"click button.details": "openDetails"
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

		}
	});
}(this));