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

	F.defs.DetailsHeaderView = Backbone.View.extend({
		events: {
			"input .edit-name input": "updateName"
		},
		initialize: function() {
			this.inp = $('.edit-name input', this.el);
			this.inp.val(F.inst.CoreModel.get('name'));
		},
		updateName: function() {
			F.inst.CoreModel.set('name', this.inp.val());
			F.inst.CoreModel.save();
		}
	});
}(this));