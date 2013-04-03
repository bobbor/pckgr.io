(function(window, undefined) {
	var Frontender = window.Frontender;
	var $s = Frontender.$script;
	$s.ready(['jquery', '_', 'backbone', 'DetailListItemsView'], function() {
		Frontender.DetailListView = Frontender.Backbone.View.extend({
			initialize: function() {
				Frontender.detailListItemsViewInstance = new Frontender.DetailListItemsView({
					el: Frontender.$('#project-items', this.el)
				});
			}
		})
	});
}(this, void 0));