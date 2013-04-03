(function(window, undefined) {
	"use strict";
<<<<<<< Updated upstream
	
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
=======

	define(['lib/jquery', 'gui/index.enhancements'], function($) {
		return {
			init: function() {
				$(function() {
					$('.project').on('click', 'button.detail', function() {
						var details = Ti.UI.createWindow("app://detail.html?foo");
						details.open();
						details.setTitle('some project');

						notification.show();
						return false;
					});
>>>>>>> Stashed changes
				});
			});
		})
	;
}(this, void 0));