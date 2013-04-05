(function(window, undefined) {
	var f = window.Frontender;
	f.$script.ready(['jquery', '_', 'backbone'], function() {
		f.StepView = f.Backbone.View.extend({
			tagName: 'div',
			className: 'step',
			template: f._.template(f.$('#step-markup-template').html()),
			choicetemplate: f._.template(f.$('#step-choice-template').html()),
			resulttemplate: f._.template(f.$('#step-result-template').html()),
			events: {
				'change input': 'update',
				'input input': 'update'
			},
			initialize: function(opts) {
				this.state = opts.state;
				this.listenTo(this.model, 'change:configuration', this.render);
			},
			render: function() {
				var data = this.model.toJSON();
				if(!data.markup) {
					if(data.id !== 'result') {
						data.markup = this.choicetemplate(this.model.toJSON())
					} else {
						data.markup = this.resulttemplate(this.model.toJSON())
					}
				}
				this.$el.html(this.template(data));
				this.$el.addClass(this.state);
				return this;
			},
			update: function(e) {
				var elm = f.$(e.target);
				if(elm.is('[type="checkbox"]')) {
					this.model.set('withKit', elm.prop('checked'));
					return;
				}
				this.model.set({
					name: elm.prop('name'),
					value: elm.val()
				});
			}
		});
	});
}(this, void 0))