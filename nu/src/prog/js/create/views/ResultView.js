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
			var json = _.extend({}, this.model.toJSON());
			var dat = [];

			json.data = json.data || dat;
			jsonloop:
			for(var i = json.data.length; i--;) {
				datloop:
				for(var j = 0; j < dat.length; j++) {
					if(dat[j].name === json.data[i].name) {
						dat[j].vals.push(json.data[i].value);
						continue jsonloop;
					}
				}
				dat.push(json.data[i]);
				dat[dat.length-1].vals = [dat[dat.length-1].value];
				delete dat[dat.length-1].value;
				continue;
			}
			json.data = dat.reverse();
			this.$el.html(this.template(json));
			return this;
		}
	});
}(this));