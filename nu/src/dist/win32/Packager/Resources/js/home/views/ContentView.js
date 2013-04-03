(function(window, undefined) {
	var f = window.Frontender;
	f.$script.ready(['jquery', '_', 'backbone', 'scroller', 'ProjectItemView', 'ProjectList'], function() {
		f.ContentView = f.Backbone.View.extend({
			initialize: function() {
				this.$el.scroller();
				f.Projects = new f.ProjectList();

				this.listenTo(f.Projects, 'add', this.addOne);
				this.listenTo(f.Projects, 'reset', this.addAll);
				this.listenTo(f.Projects, 'all', this.render);

				f.Projects.fetch();
			},
			addOne: function(project) {
				var view = new f.ProjectItemView({
					model: project
				});
				var jsp = f.$('.jspPane', this.el);
				if(jsp.length) {
					jsp.append(view.render().el);
					this.$el.scroller('update');
				} else {
					this.$el.append(view.render().el);
				}
			},
			addAll: function() {
				f.Projects.each(this.addOne, this);
			}
		});
	});
}(this, void 0))