(function() {
	requirejs.config({
		baseUrl: '/js',
		paths: {},
		shim: {}
	});
	(function() {

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
				this.$el.jScrollPane();
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

		$.fn.scroller = function(method, opts) {
			return this.each(function() {
				var inst = $.data(this, 'scroller');
				if(!inst) {
					inst = new Scroller(this, method);
					$.data(this, 'scroller', inst);
				}
				if('string' === typeof method) {
					if(method[0] !== '_' && method in inst) {
						inst[method](opts);
					} else {
						console.log('    jquery.scroller - cannot call method: "'+method+'"');
					}
				}
			});
		};
	}());


	require(['app'], function(App) {
		window.pckgr = new App();
		$(function() {
			$('#content, #project-items').scroller();
			$('#content').on('click', 'td', function(e) {
				var that = this;
				if($(e.target).is('button')) { return; }
				$('#content td.expanded').filter(function() {
					return !$(this).is(that);
				}).removeClass('expanded');
				$(this).toggleClass('expanded');
				$('#content').scroller('update');
			});
		});
	});
}());