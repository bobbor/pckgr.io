(function(window, undefined) {
	var f = window.Frontender;
	var $s = f.$script;
	$s.ready(['jquery', '_', 'backbone', 'DetailListItemView', 'DetailListCollection'], function() {
		f.DetailDetailsView = f.Backbone.View.extend({

		});
	});
}(this, void 0));