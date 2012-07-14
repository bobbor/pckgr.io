(function($) {
	if(typeof packer === "undefined") { packer = {}; }
	var doc = document;
	
	if(typeof Number.prototype.isBetween !== 'function') {
		/**
		 * checks if the given number is between <i>lower</i> and <i>upper</i>
		 * 
		 * @param {Number} lower the lower bound
		 * @param {Number} upper the upper bound
		 * 
		 * @returns {Boolean} if it is Between
		 */
		Number.prototype.isBetween = function(lower, upper) {
			if(lower.pop && lower.push) { // lower is an array
				upper = lower[1];
				lower = lower[0];
			}
			
			return (this >= lower && this <= upper);
		};
	}
	
	/**
	 * makes the tooltip object available to the packer object
	 * 
	 * @function
	 * 
	 * @namespace handles all tooltip related stuff
	 */
	tooltip = function() {
		var _ = lang.getText;
		
		var tooltip;
		var timer;
		var visible;
		function init() {
			tooltip = $('#tooltip');
			$(doc).delegate('[data-title]', 'mouseenter', function(e) {
				if(visible) {
					hide();
				}
				if (globalConfig.config.tooltip) {
					timer = window.setTimeout(function() {
						show(e);
					}, 100);
				}
			});
			
			$(doc).delegate('[data-title]', 'mousemove', function(e) {
				if(visible) {
					var cssObj = {};
					cssObj.top = e.clientY+5;
					cssObj.left = e.clientX+20;
					tooltip.css(cssObj);
					adjustPosition(tooltip[0].getBoundingClientRect(), {
						x: e.clientX, 
						y: e.clientY
					});
				}
			});
			
			$(doc).delegate('[data-title]', 'mouseleave', function(e) {
				window.clearTimeout(timer);
				hide();
			});
		}
		
		function show(e) {
			var elm = $(e.target);
			var cssObj = {};
			
			var title = $(elm).attr('data-title') || $(elm).closest('[data-title]').attr('data-title');
			if (typeof title !== "undefined" && !!title) {
				setTitle(title);
				cssObj.top = e.clientY+5;
				cssObj.left = e.clientX+20;
				cssObj.display = 'block';
				tooltip.css(cssObj);
				adjustPosition(tooltip[0].getBoundingClientRect(), {
					x: e.clientX, 
					y: e.clientY
				});
				visible = true;
			}
		}
		
		function setTitle(text) {
			tooltip.find('p').html(text);
		}
		
		function adjustPosition(dims, mouse) {
			if($('body').width() < dims.left + dims.width) {
				tooltip.css({'left': (mouse.x - dims.width - 20) });
			}
			if($('body').height() < dims.top+ dims.height) {
				tooltip.css({'top': (mouse.y - dims.height - 5) });
			}
		}
		function hide() {
			tooltip.stop(true).css({display: 'none'});
			visible = false;
		}
		return {
			hide: hide,
			init: init
		};
	}();
}(jQuery));