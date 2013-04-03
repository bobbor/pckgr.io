(function(window, undefined) {
	var f = window.Frontender;
	var $s = f.$script;
	$s.ready(['jquery', '_', 'backbone', 'DetailListItemView', 'DetailListCollection'], function() {
		f.DetailListItemsView = f.Backbone.View.extend({
			initialize: function() {
				this.$el.scroller();
				f.Features = new f.DetailListCollection();

				this.listenTo(f.Features, 'add', this.addOne);
				this.listenTo(f.Features, 'reset', this.addAll);
				this.listenTo(f.Features, 'all', this.render);

				f.Features.fetch();
			},
			addOne: function(feature) {
				var view = new f.DetailListItemView({
					model: feature
				});
				this.$el.find('ol').append(view.render().el);
				this.$el.scroller('update');
			},
			addAll: function() {
				f.Features.each(this.addOne, this);
			}
		});
	});
}(this, void 0));