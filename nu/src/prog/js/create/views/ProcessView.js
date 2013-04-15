/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  F           = window.Frontender
		, $           = window.jQuery
		, _           = window._
		, Backbone    = window.Backbone
		, createSteps = new F.defs.CreateSteps()
	;

	F.defs.ProcessView	 = Backbone.View.extend({
		events: {
			"click button.prev": "goBack",
			"click button.next": "goForth"
		},
		initialize: function() {

			this.listenTo(createSteps, 'add', this.addOne);
			this.listenTo(createSteps, 'reset', this.addAll);
			
			this.back = $('button.prev', this.el);
			this.forth = $('button.next', this.el);

			createSteps.fetch();

			this.changeIndex(0);
		},
		addOne: function(model) {
			console.log('addOne');
			var view = new F.defs.StepView({
				model: model
			});
			this.$el.append(view.render().el);
		},
		addAll: function() {
			createSteps.each(this.addOne);
		},
		goBack: function() {
			if(!this.index <= 0) {
				this.changeIndex(this.index--);
			}
		},
		goForth: function() {
			if(!this.index >= createSteps.length-1) {
				this.changeIndex(this.index++);
			}
		},
		changeIndex: function(idx) {
			this.index = idx;
			createSteps.each(function(model, idx) {
				console.log(model.toJSON())
			});
			this.back[this.index <= 0 ? 'addClass' : 'removeClass']('disabled');
			this.forth[this.index >= createSteps.length-1 ? 'addClass' : 'removeClass']('disabled');
		}
	})

}(this));