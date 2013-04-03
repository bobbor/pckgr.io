(function() {
	$script
		.ready(['jquery', 'Scroller'], function() {
			$.fn.scroller = function(method, opts) {
				return this.each(function() {
					var inst = $.data(this, 'scroller');
					if(!inst) {
						inst = new Frontender.Scroller(this, method);
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
}())