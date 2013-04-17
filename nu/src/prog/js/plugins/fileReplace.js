(function(window) {
	"use strict";

	var $ = window.jQuery;

	$.fn.extend({
		"fileReplace": function() {
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
		}
	});
}(this));