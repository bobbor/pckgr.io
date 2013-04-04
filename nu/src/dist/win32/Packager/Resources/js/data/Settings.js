(function(window, undefined) {
	var f = window.Frontender;
	f.$script.ready(['jquery', '_', 'backbone'], function() {

		// this is a singleton.
		// the settings get loaded on application start and are shared among
		// all windows.
		f.SettingsClass = f.Backbone.Model.extend({
			defaults: {
				lang: 'de_DE',
				warnings: true,
				tooltips: true,
				kits: {}
			},
			initialize: function() {
				this.file = new f.File('settings.frontender');
				this.fetch();
			},
			fetch: function() {
				var data = this.file.read('JSON')
				if(data) {
					this.set(data);
				}
			}
		});

		if(!f.Settings) {
			f.Settings = new f.SettingsClass();
		}
	});
}(this, void 0));