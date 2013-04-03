(function(window, undefined) {
	var f = window.Frontender;
	f.$script.ready(['jquery', '_', 'backbone', 'FrontContentView', 'FrontFooterView'], function() {
		f.FrontPageView = f.Backbone.View.extend({
			el: '#home',
			initialize: function() {
				f.frontContentViewInstance = new f.FrontContentView({
					el: this.$('#content', this.el)
				});
				f.frontFooterViewInstance = new f.FrontFooterView({
					el: this.$('footer', this.el)
				});
			}
		});
	});
}(this, void 0))