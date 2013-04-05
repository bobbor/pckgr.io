(function(window, undefined) {
	var f = window.Frontender;
	f.$script.ready(['jquery', '_', 'backbone'], function() {
		f.ProjectItemView = f.Backbone.View.extend({
			tagName: 'section',
			className: 'project',
			template: f._.template(f.$('#project-template').html()),
			events: {
				"click .detail": "openDetailView",
				"click .btn-danger": "clear"
			},
			initialize: function() {
				this.listenTo(this.model, 'change', this.render);
				this.listenTo(this.model, 'destroy', this.remove);
			},
			render: function() {
				console.log(this.model.toJSON())
				this.$el.html(this.template(this.model.toJSON()));
				return this;
			},
			remove: function() {
				this.$el.remove();
			},
			clear: function() {
				this.model.destroy();
			},
			openDetailView: function() {
				var that = this;
				this.detailsWindow = Ti.UI.createWindow("app://detail.html");
				function transferData() {
					var scoped_window = that.detailsWindow.getDOMWindow();
					var sf = scoped_window.Frontender || (scoped_window.Frontender = {});
					scoped_window.Frontender.projectData = that.model;
					that.detailsWindow.removeEventListener(Ti.PAGE_INITIALIZED, transferData)
				}
				this.detailsWindow.addEventListener(Ti.PAGE_INITIALIZED, transferData)
				this.detailsWindow.open();
			}
		});
	});
}(this, void 0))