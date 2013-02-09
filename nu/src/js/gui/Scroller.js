define(['lib/jsp'], function() {
	function Scroller(el) {
		var that = this;
		this.el = el;
		this.$el = $(this.el);

		this.$el.on('scroll', function() {
			that._resetTimer();
		});

		$(window).on('resize', function() {
			that.update();
		});
		this.update();
	}
	Scroller.prototype = {
		constructor: Scroller,
		update: function() {
			this._resetTimer();
			this.$el.jScrollPane({
				mouseWheelSpeed: 15
			});
		},
		_resetTimer: function() {
			var bar = $('.jspVerticalBar', this.el);
			if(this.timer) {
				window.clearTimeout(this.timer);
			}
			bar.removeClass('hidden');
			this.timer = window.setTimeout(function() {
				bar.addClass('hidden');
			}, 1000);
		}
	};

	return Scroller;
})