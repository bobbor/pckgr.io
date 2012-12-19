(function() {
	requirejs.config({
		baseUrl: '/js',
		paths: {},
		shim: {
			'lib/underscore-min': {
				exports: '_'
			},
			'lib/backbone-min': {
				deps: ['lib/underscore-min'],
				exports: 'Backbone'
			},
			'app': {
				deps: ['lib/underscore-min', 'lib/backbone-min']
			}
		}
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


	require(['app', 'lib/gui'], function(App) {
		window.pckgr = new App();
		
		$(function() {
			$('#content, #project-items').scroller();
			
			$('#content').on('click', 'td', function(e) {
				var that = this;
				if($(e.target).is('button, button *')) { return; }
				$('#content td.expanded').filter(function() {
					return !$(this).is(that);
				}).removeClass('expanded');
				$(this).toggleClass('expanded');
				$('#content').scroller('update');
			});

			$('#content').on('buttontoggled', '.btn', function() {
				var cn = 'active'+$(this).index();
				$(this).closest('td')[$(this).is('.active') ? 'addClass' : 'removeClass'](cn);
			});

			(function() {
				var container = $('#content');
				var tables = $('table', container);
				var active, cap, prob, idx;
				var checkOffsets = function(scroll, items) {
					var ret;
					for(var i = 0, len = items.length; i < len; i++) {
						if(scroll > items[i].offsetTop) {
							ret = items[i];
						}
					}
					return ret;
				};
				container.on('jsp-scroll-y', function(e, pos, bottom, top) {
					if(cap) {
						idx = tables.index(active);
						cap.css({
							top: 40 < tables[idx+1].offsetTop-pos ?
								40 : 0 > tables[idx+1].offsetTop-pos ?
									0 : tables[idx+1].offsetTop-pos+2
						});
					}
					prob = checkOffsets(pos, tables);
					if(active == prob) { return; }
					$('.clone').hide();
					active = prob;
					if(!active) { return; }
					if(!$('caption.clone', active).length) {
						$('caption', active).clone().addClass('clone').appendTo(active);
					}
					idx = tables.index(active);
					cap = $('caption.clone', active).show().css({
						top: 40 < tables[idx+1].offsetTop-pos ?
							40 : 0 > tables[idx+1].offsetTop-pos ?
								0 : tables[idx+1].offsetTop-pos+2
					});

				});
			}());
		});
	});
}());
