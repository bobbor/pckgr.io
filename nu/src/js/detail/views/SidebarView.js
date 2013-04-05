(function(window, undefined) {
	var Frontender = window.Frontender;
	var $s = Frontender.$script;
	$s.ready(['jquery', '_', 'backbone', 'SidebarContentView', 'SidebarFooterView'], function() {
		Frontender.SidebarView = Frontender.Backbone.View.extend({
			initialize: function() {
				new Frontender.SidebarContentView({
					el: Frontender.$('#project-items', this.el)
				});
				new Frontender.SidebarFooterView({
					el: Frontender.$('footer', this.el)
				});
			}
		})
	});
}(this, void 0));