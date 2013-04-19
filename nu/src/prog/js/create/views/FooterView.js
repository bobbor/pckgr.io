/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  F           = window.Sluraff
		, $           = window.jQuery
		, _           = window._
		, Backbone    = window.Backbone
		, createSteps = new F.defs.CreateSteps()
	;

	F.defs.CreateFooterView = Backbone.View.extend({
		nextText: 'Next ',
		finishText: 'Finish ',
		events: {
			"click button.back": "goBack",
			"click button.next": "goForth"
		},
		initialize: function() {
			this.back = $('button.back', this.el);
			this.forth = $('button.next', this.el);
		},
		goBack: function() {
			this.trigger('goBack');
		},
		goForth: function() {
			this.trigger('goForth');
		},
		onIndexChange: function(min, current, max) {
			this.back[current <= min ? 'addClass' : 'removeClass']('disabled');
			if(current >= max) { this.forth.ownText(this.finishText).addClass('done');
			} else { this.forth.ownText(this.nextText).removeClass('done'); }
		}
	});
}(this));