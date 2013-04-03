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

	$s('js/collections/DetailListCollection.js', 'DetailListCollection');
	$s('js/views/DetailListItemView.js', 'DetailListItemView');
	$s('js/models/DetailListItemModel.js', 'DetailListItemModel');

	$s('js/views/DetailListItemsView.js', 'DetailListItemsView');
	$s('js/views/DetailDetailsView.js', 'DetailDetailsView');
	$s('js/views/DetailListView.js', 'DetailListView');
	$s('js/views/DetailPageView.js', 'DetailPageView');

	$s.ready(['jquery', 'DetailPageView'], function() {
		var $ = f.jQuery;
		$(function() {
			f.detailPageViewInstance = new f.DetailPageView();
		});
	});
}(this, void 0));