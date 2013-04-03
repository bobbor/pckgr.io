(function(window, undefined) {
	var f = window.Frontender;
	var $s = f.$script;

	$s.ready(['jquery', '_', 'backbone'], function() {
		f.FooterView = f.Backbone.View.extend({
			events: {
				'click .back': 'goBack',
				'click .next': 'goForward'
			},
			initialize: function() {
				this.back = f.$('button.back', this.el);
				this.next = f.$('button.next', this.el);
			},
			goBack: function() {
				this.trigger('step_back');
			},
			goForward: function() {
				this.trigger('step_forward');
			},
			adjustButtons: function(past, future) {
				if(past <= 0 && !this.back.is('.disabled')) {
					this.back.addClass('disabled');
				} else if(past > 0 && this.back.is('.disabled')) {
					this.back.removeClass('disabled');
				}
				if(future <= 0 && !this.next.is('.disabled')) {
					this.next.addClass('disabled');
				} else if(future > 0 && this.next.is('.disabled')) {
					this.next.removeClass('disabled');
				}
			}
		})
	});
}(this, void 0))