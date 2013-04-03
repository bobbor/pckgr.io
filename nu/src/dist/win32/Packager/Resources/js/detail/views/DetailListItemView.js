(function(window, undefined) {
	var f = window.Frontender;
	f.$script.ready(['jquery', '_', 'backbone'], function() {
		f.DetailListItemView = f.Backbone.View.extend({
			tagName: 'li',
			template: f._.template(f.$('#feature-template').html()),
			initialize: function() {
				this.listenTo(this.model, 'change', this.render);
				this.listenTo(this.model, 'destroy', this.remove);
			},
			render: function() {
				this.$el.attr('data-target', this.model.get('name'));
				this.$el.html(this.template(this.model.toJSON()));
				return this;
			},
			remove: function() {
				this.$el.remove();
			},
			clear: function() {
				this.model.destroy();
			}
		});
	});
}(this, void 0))