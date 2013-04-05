(function(window, undefined) {
	var f = window.Frontender;
	var $s = f.$script;

	f.$.fn.extend({
		setText: function(txt) {
			return this.each(function(idx, elm) {
				var oldText = f.$(elm).text();
				var html = f.$(elm).html();

				html = html.replace(oldText, txt);
				f.$(elm).html(html);
			});
		}
	});
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
				if(future <= 0) {
					this.next.setText('Finish');
				} else if(future > 0) {
					this.next.setText('Next');
				}
			}
		})
	});
}(this, void 0))