(function(window, undefined) {
	"use strict";
	define(['gui/fn.scroller', 'lib/bootstrap', 'gui/fn.stickHead'], function() {
		$(function() {
			$('#content')
				.stickHead()
				.on('click', 'td', function(e) {
					var that = this;
					if($(e.target).is('button, button *')) { return; }
					$('#content td.expanded').filter(function() {
						return !$(this).is(that);
					}).removeClass('expanded');
					$(this).toggleClass('expanded');
					$('#content').scroller('update');
				})
				.on('buttontoggled', '.btn', function() {
					var cn = 'active'+$(this).index();
					$(this).closest('td')[$(this).is('.active') ? 'addClass' : 'removeClass'](cn);
				})
				.add('#project-items').scroller();
		});
	});
}(this, void 0));