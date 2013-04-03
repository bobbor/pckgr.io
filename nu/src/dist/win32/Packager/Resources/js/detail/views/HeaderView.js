(function(window, undefined) {
	var f = window.Frontender;
	var $s = f.$script;
	$s.ready(['jquery', '_', 'backbone'], function() {
		f.HeaderView = f.Backbone.View.extend({
			events: {
				'change input': 'adjustName',
				'input input': 'adjustName'
			},
			initialize: function() {
				this.input = f.$('input', this.el);
				this.input.val(f.projectData.get('name'));
			},
			adjustName: function() {
				f.projectData.set('name',this.input.val())
			}
		});
	});
}(this, void 0));