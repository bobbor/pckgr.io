(function(window, undefined) {
	"use strict";

	define(['lib/jquery', 'gui/index.enhancements'], function($) {
		return {
			init: function() {
				$(function() {
					$('.project').on('click', 'button.detail', function() {
						var details = Ti.UI.createWindow("app://detail.html?foo");
						details.open();
						details.setTitle('some project');
						return false;
					});
				});
			}
		};
	});
}(this, void 0));