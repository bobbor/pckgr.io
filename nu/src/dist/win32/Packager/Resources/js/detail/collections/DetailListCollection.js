(function(window, undefined) {
	var f = window.Frontender;
	f.$script.ready(['jquery', '_', 'backbone', 'DetailListItemModel'], function() {
		f.DetailListCollection = f.Backbone.Collection.extend({
			model: f.DetailListItemModel,
			key: 'projectData',
			sync: function(type, model, args) {
				args.success(window.Frontender[this.key].features)
			}
		});
	});
}(this, void 0))