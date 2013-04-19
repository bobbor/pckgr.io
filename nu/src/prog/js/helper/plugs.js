(function(window) {
	"use strict";

	var $ = window.jQuery;

	$.fn.extend({
		fileReplace: function() {
			return this.each(function(i, node) {
				var $node = $(node);
				if($node.next('input[type="text"]').length) { return; }
				$node.hide();
				var replace = $('<input type="text" name="'+$node.prop('name')+'" class="'+$node.prop('className')+' file_replace" />').insertAfter(node);
				$(node).prop('name', '');
				$node.on('change', function(e) {
					replace.val($node.val());
				});
			});
		},
		ownText: function(t) {
			return this.each(function() {
				var html = this.innerHTML;
				var text = this.innerText;

				var re = new RegExp(text);
				$(this).html(html.replace(re, t));
			});
		},
		stickHead: function() {
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
				container.on('scroll', function(e, pos) {
					pos = e.target.scrollTop;
					if(cap) {
						idx = tables.index(active);
						if(tables[idx+1]) {
							cap.css({
								top: 40 < tables[idx+1].offsetTop-pos ?
									40 : 0 > tables[idx+1].offsetTop-pos ?
										0 : tables[idx+1].offsetTop-pos-2
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
									0 : tables[idx+1].offsetTop-pos-2
						});
					} else {
						cap = $('caption.clone', active).show();
					}
				});
			});
		}
	});
}(this));