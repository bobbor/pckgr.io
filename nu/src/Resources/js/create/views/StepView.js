(function(window, undefined) {
	var f = window.Frontender;
	f.$script.ready(['jquery', '_', 'backbone'], function() {
		f.StepView = f.Backbone.View.extend({
			tagName: 'div',
			className: 'step',
			template: f._.template(f.$('#step-markup-template').html()),
			choicetemplate: f._.template(f.$('#step-choice-template').html()),
			resulttemplate: f._.template(f.$('#step-result-template').html()),
			initialize: function(opts) {
				this.state = opts.state;
				this.listenTo(this.model, 'change', this.update);
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
			update: function() {

			}
		});
	});
}(this, void 0))