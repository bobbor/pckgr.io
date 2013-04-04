(function(window, undefined) {
	var f = window.Frontender;
	f.$script.ready(['jquery', '_', 'backbone', 'StepModel', 'File'], function() {
		f.Steps = f.Backbone.Collection.extend({
			model: f.StepModel,
			filename: 'Resources/transfer/create.json',
			initialize: function() {
				this.file = new f.File(this.filename, 'ApplicationDirectory');
			},
			sync: function(type, model, args) {
				console.log('sync', arguments)
				var ret = this.file.read('JSON');
				if(!ret) {
					return;
				}
				args.success(ret)
			}
		});
	});
}(this, void 0))