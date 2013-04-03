(function(window, undefined) {
	"use strict";
	var f = window.Frontender;
	f.$script.ready(['jquery','scrollpane'], function() {
		var $ = f.jQuery;

		f.Scroller = function(el) {
			var $el = $(el);
			var api, timer;

			function update() {
				_resetTimer();
				$el.jScrollPane({
					mouseWheelSpeed: 15
				});
				api = $el.data('jsp');
			}

			function destroyPane() {
				if(api) {
					api.destroy();
					window.setTimeout(function() {
						$el.removeAttr('style');
					}, 100)
				}
				api = null;
			}

			function _resetTimer() {
				var bar = $('.jspVerticalBar', el);
				if(timer) {
					window.clearTimeout(timer);
				}
				bar.removeClass('hidden');
				timer = window.setTimeout(function() {
					bar.addClass('hidden');
				}, 1000);
			}

			$el.on('scroll', function() {
				_resetTimer();
			});
			$(window).on('resize', function() {
				update();
			});
			update();

			return {
				update: update,
				destroyPane: destroyPane
			}

		};
	});
}(this, void 0))