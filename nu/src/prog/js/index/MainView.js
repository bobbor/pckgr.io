/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  F        = window.Frontender
		, $        = window.jQuery
		, _        = window._
		, Backbone = window.Backbone
		, saveFile = new F.core.SaveFile()
	;

	F.core.MainView = Backbone.View.extend({
		initialize: function() {

			this.listenTo(saveFile, 'add', this.addOne);
			this.listenTo(saveFile, 'reset', this.addAll);
			this.listenTo(saveFile, 'all', this.render);

			this.hint = this.$('#noproject');
			saveFile.fetch();
		},
		render: function() {
			if (saveFile.length) {
				this.hint.hide();
			} else {
				this.hint.show();
			}
		},
		addOne: function(project) {
			var view = new F.core.ProjectView({
					model: project
				});
			this.$el.append(view.render().el);
		},
		addAll: function() {
			var coll = this.$([]);
			saveFile.each(function(project) {
				var view = new F.core.ProjectView({
					model: project
				});
				coll = coll.add(view.render().el);
			}, this);
			this.$el.append(coll);
		}
	});
}(this));