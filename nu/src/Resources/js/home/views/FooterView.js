(function(window, undefined) {
	var f = window.Frontender;
	f.$script.ready(['jquery', '_', 'backbone'], function() {
		f.FooterView = f.Backbone.View.extend({
			events: {
				"click button[data-action]": "decideActionToTake"
			},
			decideActionToTake: function(e) {
				switch(f.$(e.currentTarget).data('action')) {
					case 'create':
						this.createNewProject();
						break;
					case 'import':
						this.importProject();
						break;
					default:
						break;
				};
			},
			createNewProject: function() {
				var create = Ti.UI.createWindow("app://create.html");
				create.open();
				create.setTitle('Create a new Project');
			},
			importProject: function() {

			}
		});
	});
}(this, void 0));