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

	F.defs.MainView = Backbone.View.extend({
		initialize: function() {

			this.listenTo(F.inst.saveFile, 'add', this.addOne);
			this.listenTo(F.inst.saveFile, 'reset', this.addAll);
			this.listenTo(F.inst.saveFile, 'all', this.render);

			this.hint = this.$('#noproject');
			
			F.inst.saveFile.fetch();
		},
		render: function() {
			if (F.inst.saveFile.length) {
				this.hint.hide();
			} else {
				this.hint.show();
			}
		},
		addOne: function(project) {
			var view = new F.defs.ProjectView({
					model: project
				});
			this.$el.append(view.render().el);
		},
		addAll: function() {
			var coll = this.$([]);
			F.inst.saveFile.each(function(project) {
				var view = new F.defs.ProjectView({
					model: project
				});
				coll = coll.add(view.render().el);
			}, this);
			this.$el.append(coll);
		}
	});
}(this));