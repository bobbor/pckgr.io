/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  F           = window.Frontender
		, $           = window.jQuery
		, _           = window._
		, Backbone    = window.Backbone
	;

	F.defs.ProcessView = Backbone.View.extend({
		initialize: function() {
			var that = this;
			this.stepData = [];
			this.index = 0;
			this.listenTo(F.inst.createSteps, 'add', this.addOne);
			this.listenTo(F.inst.createSteps, 'reset', this.addAll);
			this.listenTo(F.inst.createSteps, 'sync', function() {
				that.changeIndex(that.index);
			});
			F.inst.createSteps.fetch();
		},
		addOne: function(model) {
			var view;
			if(model.id === 'result') {
				view = new F.defs.ResultView({ model: model });
			} else {
				view = new F.defs.StepView({ model: model });
			}

			this.$el.append(view.render().el);
		},
		addAll: function() {
			F.inst.createSteps.each(this.addOne);
		},
		goBack: function() {
			if(!(this.index <= 0)) {
				this.changeIndex(this.index-1);
			}
		},
		goForth: function() {
			if(!(this.index >= F.inst.createSteps.length-1)) {
				this.changeIndex(this.index+1);
			}
		},
		changeIndex: function(idx) {
			var that = this;
			this.index = ('number' === typeof idx) ? idx : this.index;
			F.inst.createSteps.each(function(model, idx) {
				if(idx < that.index) {
					model.view.$el.addClass('past').removeClass('current future');
				} else if(idx === that.index) {
					model.view.$el.addClass('current').removeClass('past future');
				} else {
					model.view.$el.addClass('future').removeClass('past current');
				}
			});
			this.trigger('indexChange', 0, that.index, F.inst.createSteps.length-1);
		}
	})

}(this));