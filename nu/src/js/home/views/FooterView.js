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
				var that = this;
				this.create = Ti.UI.createWindow("app://create.html");
				function transferData() {
					var scoped_window = that.create.getDOMWindow();
					var sf = scoped_window.Frontender || (scoped_window.Frontender = {});
					scoped_window.Frontender.projects = f.Projects;
					that.create.removeEventListener(Ti.PAGE_INITIALIZED, transferData)
				}
				this.create.addEventListener(Ti.PAGE_INITIALIZED, transferData)
				create.open();
			},
			importProject: function() {

			}
		});
	});
}(this, void 0));