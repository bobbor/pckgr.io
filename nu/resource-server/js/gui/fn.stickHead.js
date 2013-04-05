(function(window, undefined) {
	"use strict";
	window.Frontender.$script.ready(['jquery'], function() {
		var $ = window.Frontender.jQuery;
		$.fn.stickHead = function() {
			return this.each(function(i, elm) {
				var container = $(elm);
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
						if(tables[idx+1]) {
							cap.css({
								top: 40 < tables[idx+1].offsetTop-pos ?
									40 : 0 > tables[idx+1].offsetTop-pos ?
										0 : tables[idx+1].offsetTop-pos+2
							});
						}
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
					if(tables[idx+1]) {
						cap = $('caption.clone', active).show().css({
							top: 40 < tables[idx+1].offsetTop-pos ?
								40 : 0 > tables[idx+1].offsetTop-pos ?
									0 : tables[idx+1].offsetTop-pos+2
						});
					} else {
						cap = $('caption.clone', active).show();
					}
				});
			});
		};
	});
}(this, void 0));