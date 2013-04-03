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

						var notification = Ti.Notification.createNotification({
							'title' : 'Notification from App',
							'message' : 'Click here for updates!',
							'timeout' : 10,
							'icon' : 'app://icons/app/icon-32.png'
						});

						notification.show();
						return false;
					});
				});
			}
		};
	});
}(this, void 0));