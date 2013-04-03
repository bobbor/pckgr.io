(function(window, undefined) {
	"use strict";
	
	$script
		.ready(['jquery', 'scroller'], function() {
			$(function() {
				$('.wrapper').scroller();
				$('.project').on('click', 'button.detail', function() {
					/*var details = Ti.UI.createWindow("app://detail.html?foo");
					details.open();
					details.setTitle('some project');
					*/
					alert('open details');
					return false;
				});
			});
		})
	;
}(this, void 0));