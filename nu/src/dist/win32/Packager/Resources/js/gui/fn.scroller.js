(function(window, undefined) {
	"use strict";
	var f = window.Frontender;
	f.$script
		.ready(['jquery', 'ScrollerClass'], function() {
			var $ = f.jQuery;
			var Scroller = f.Scroller;
			$.fn.scroller = function(method, opts) {
				return this.each(function() {
					var inst = $.data(this, 'scroller');
					if(!inst) {
						inst = Scroller(this);
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
		});
}(this, void 0))