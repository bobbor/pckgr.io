(function(window, undefined) {
	var f = window.Frontender;
	var $s = f.$script;
	$s.ready(['jquery', '_', 'backbone', 'HeaderView'], function() {
		f.MainView = f.Backbone.View.extend({
			initialize: function() {
				new f.HeaderView({
					el: f.$('header', this.el)
				});
			}
		});
	});
}(this, void 0));