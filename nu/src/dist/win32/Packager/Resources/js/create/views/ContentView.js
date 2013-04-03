(function(window, undefined) {
	var f = window.Frontender;
	var $s = f.$script;

	$s.ready(['jquery', '_', 'backbone'], function() {
		f.ContentView = f.Backbone.View.extend({
			initialize: function() {
				this.activeStep = f.$('.active', this.el);
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
				}
				this.postStepChange();
			},
			postStepChange: function() {
				var future = f.$('.future', this.el).length;
				var past = f.$('.past', this.el).length;
				this.trigger('step_change', past, future);
			}
		})
	});
}(this, void 0))