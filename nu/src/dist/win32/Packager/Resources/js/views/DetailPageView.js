(function(window, undefined) {
	var f = window.Frontender;
	f.$script.ready(['jquery', '_', 'backbone', 'DetailListView', 'DetailDetailsView'], function() {
		f.DetailPageView = f.Backbone.View.extend({
			el: 'body',
			initialize: function() {
				f.detailListViewInstance = new f.DetailListView({
					el: this.$('#project-listing', this.el)
				});
				f.detailDetailsViewInstance = new f.DetailDetailsView({
					el: this.$('#project-details', this.el)
				});
			}
		});
	});
}(this, void 0))