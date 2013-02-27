(function(window, undefined) {
	"use strict";
	define([
		'gui/fn.scroller',
		'lib/bootstrap',
		'gui/fn.stickHead',
		'gui/fn.detailsSwitcher',
		'gui/fn.collapse'
	], function() {
		$(function() {
			$('#content')
				.stickHead()
				.on('click', '.dropdown-menu a', function(e) {
					var that = this;
					var container = $(that).closest('td');
					var parent = $(that).parent();
					parent.toggleClass('checked');
					$('[data-rel="'+$(that).attr('data-control')+'"]', container)[parent.is('.checked') ? 'show' : 'hide']();
				})
				.add('#project-items, #settings').scroller();
			$(document).detailsSwitcher();
			$('[data-collapse]').collapseMe();

			$('#settings').bind('shown', function() {
				$('#settings').scroller('update');
			});
		});
	});
}(this, void 0));