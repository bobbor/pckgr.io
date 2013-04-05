(function(window, undefined) {
	var f = window.Frontender;
	var $s = f.$script;

	$s.ready(['jquery', '_', 'backbone', 'Steps', 'StepView'], function() {
		f.ContentView = f.Backbone.View.extend({
			initialize: function() {
				this.steps = new f.Steps();

				this.listenTo(this.steps, 'add', this.addOne);
				this.listenTo(this.steps, 'reset', this.addAll);
				this.listenTo(this.steps, 'all', this.render);
				this.listenTo(this.steps, 'change', this.adjustResult);

				this.steps.fetch();
				this.activeStep = f.$('.active', this.el);
			},
			addOne: function(step, idx) {
				var view = new f.StepView({
					model: step,
					state: idx ? 'future' : 'active'
				});
				view.render()
				f.$('> div', this.el).append(view.render().el);
			},
			addAll: function() {
				this.steps.each(this.addOne, this);
			},
			goBack: function() {
				var prev = this.activeStep.prev('.past');
				if(prev.length) {
					this.activeStep.removeClass('active').addClass('future');
					this.activeStep = prev.removeClass('past').addClass('active');
				}
				this.postStepChange();
			},
			goForward: function() {
				var next = this.activeStep.next('.future');
				if(next.length) {
					this.activeStep.removeClass('active').addClass('past');
					this.activeStep = next.removeClass('future').addClass('active');
					this.postStepChange();
				} else {
					f.projects.create()
				}
			},
			postStepChange: function() {
				var future = f.$('.future', this.el).length;
				var past = f.$('.past', this.el).length;
				this.trigger('step_change', past, future);
			},
			adjustResult: function(model) {
				var result = this.steps.get('result');
				if(model === result) { return; }
				var conf = [];
				this.steps.each(function(step, idx) {
					if(step !== result) {
						conf[idx] = {name: step.get('name'), value: step.get('value'), withKit: step.get('withKit')};
					}
				});
				result.set('configuration', conf);
			}
		})
	});
}(this, void 0))