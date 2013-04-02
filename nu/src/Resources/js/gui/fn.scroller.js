(function() {
	define(['gui/Scroller'], function(Scroller) {
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
	})
}())