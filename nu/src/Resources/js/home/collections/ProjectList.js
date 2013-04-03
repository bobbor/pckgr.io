(function(window, undefined) {
	var f = window.Frontender;
	f.$script.ready(['jquery', '_', 'backbone', 'ProjectItem', 'File'], function() {
		f.ProjectList = f.Backbone.Collection.extend({
			model: f.ProjectItem,
			filename: 'projects.frontender',

			initialize: function() {
				this.file = new f.File(this.filename);
			},
			sync: function(type, model, args) {
				args.success(this.file.read('JSON'))
			}
		});
	});
}(this, void 0))