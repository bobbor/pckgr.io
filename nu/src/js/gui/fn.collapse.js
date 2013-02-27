(function(window, undefined) {
	"use strict";
	var $ = window.jQuery;

	$.fn.collapseMe = function() {
		return this.each(function() {
			var $this = $(this);
			var target = $($this.data('collapse'));

			$(document).on('click', '[data-collapse]', function() {
				target.trigger($.Event(target.is('.in') ? 'hide' : 'show'));
				target.closest('.column').andSelf().toggleClass('in');
				target.trigger($.Event(target.is('.in') ? 'shown' : 'hidden'));
			});
		});
	}
}(this, void 0));