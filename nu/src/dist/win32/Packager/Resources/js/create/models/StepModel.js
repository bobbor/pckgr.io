(function(window, undefined) {
	var f = window.Frontender;
	f.$script.ready(['jquery', '_', 'backbone'], function() {
		f.StepModel = f.Backbone.Model.extend({
			update: function() {
				console.log(this.view)
				console.log(this.collection)
			}
		});
	});
}(this, void 0))