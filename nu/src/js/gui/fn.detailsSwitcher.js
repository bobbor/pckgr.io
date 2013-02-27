(function(window, undefined) {
	"use strict";
	var $ = window.jQuery;

	$.fn.detailsSwitcher = function() {
		return this.each(function() {
			var body = $(document.body);
			$('#project-details').on('click', '.edit-name button', function() {
				body.removeClass('details');
				$('#project-items').scroller('update');
			});
			$('#project-items').on('click', 'li[data-project]', function() {
				body.addClass('details');
				$('#content').scroller('update');
			});
		});
	}
}(this, void 0));