(function(window, undefined) {
	"use strict";
	define([
		'gui/fn.scroller',
		'lib/bootstrap',
		'gui/fn.stickHead'
	], function() {
		$(function() {
			$('.content')
				.stickHead()
				.on('click', '.dropdown-menu a', function(e) {
					var that = this;
					var container = $(that).closest('td');
					var parent = $(that).parent();
					parent.toggleClass('checked');
					$('[data-rel="'+$(that).attr('data-control')+'"]', container)[parent.is('.checked') ? 'show' : 'hide']();
					return false;
				})
				.add('#project-items').scroller();
		});
	});
}(this, void 0));