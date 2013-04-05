(function(window, undefined) {
	var f = window.Frontender;
	f.$script.ready(['jquery', '_', 'backbone', 'SidebarView', 'MainView'], function() {
		f.AppView = f.Backbone.View.extend({
			el: 'body',
			initialize: function() {
				new f.SidebarView({
					el: this.$('#project-listing', this.el)
				});
				new f.MainView({
					el: this.$('#project-details', this.el)
				});
			}
		});
	});
}(this, void 0))