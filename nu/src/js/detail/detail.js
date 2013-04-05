/*(function(window, undefined) {
	"use strict";
	var f = window.Frontender;
	f.$script
		.ready(['jquery', 'scroller', 'bootstrap', 'sticky'], function() {
			var $ = f.jQuery;
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
		})
	;
}(this, void 0));*/
(function(window, undefined) {
	"use strict";
	var f = window.Frontender;
	var $s = f.$script;

				$s('js/detail/collections/SidebarItems.js', 'SidebarItems');
				$s('js/detail/views/SidebarItemView.js', 'SidebarItemView');
				$s('js/detail/models/SidebarItem.js', 'SidebarItem');
			$s('js/detail/views/SidebarContentView.js', 'SidebarContentView');

			$s('js/detail/views/SidebarFooterView.js', 'SidebarFooterView');

		$s('js/detail/views/SidebarView.js', 'SidebarView');

			$s('js/detail/views/HeaderView.js', 'HeaderView');
		$s('js/detail/views/MainView.js', 'MainView');

	$s('js/detail/views/AppView.js', 'AppView');

	$s.ready(['jquery', 'AppView'], function() {
		var $ = f.jQuery;
		$(function() {
			new f.AppView();
		});
	});
}(this, void 0));