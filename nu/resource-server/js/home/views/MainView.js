(function(window, undefined) {
	var f = window.Frontender;
	f.$script.ready(['jquery', '_', 'backbone', 'ContentView', 'FooterView'], function() {
		f.MainView = f.Backbone.View.extend({
			el: '#home',
			initialize: function() {
				new f.ContentView({
					el: this.$('#content', this.el)
				});
				new f.FooterView({
					el: this.$('footer', this.el)
				});
			}
		});
	});
}(this, void 0))