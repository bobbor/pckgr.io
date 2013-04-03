(function(window, undefined) {
	var Frontender = window.Frontender;
	var $s = Frontender.$script;
	$s.ready(['jquery', '_', 'backbone'], function() {
		Frontender.SidebarFooterView = Frontender.Backbone.View.extend({
			events: {
				"click button": "newFeature"
			},
			newFeature: function() {
				var create = Ti.UI.createWindow("app://feature.html");
				create.open();
				create.setTitle('Create a new Project');
			}
		})
	});
}(this, void 0));