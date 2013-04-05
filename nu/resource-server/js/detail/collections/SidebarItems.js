(function(window, undefined) {
	var f = window.Frontender;
	f.$script.ready(['jquery', '_', 'backbone', 'SidebarItem'], function() {
		f.SidebarItems = f.Backbone.Collection.extend({
			model: f.SidebarItem,
			key: 'projectData',
			sync: function(type, model, args) {
				args.success(window.Frontender[this.key].get('features'))
			}
		});
	});
}(this, void 0))