(function(window, undefined) {
	"use strict";
	var f = window.Frontender;
	var $s = f.$script;

	$s('js/models/ProjectItem.js', 'ProjectItem');
	$s('js/collections/ProjectList.js', 'ProjectList');
	$s('js/views/ProjectItemView.js', 'ProjectItemView');

	$s('js/views/FrontFooterView.js', 'FrontFooterView');
	$s('js/views/FrontContentView.js', 'FrontContentView');
	$s('js/views/FrontPageView.js', 'FrontPageView');

	$s.ready(['jquery', 'FrontPageView'], function() {
		var $ = f.jQuery;
		$(function() {
			f.frontPageViewInstance = new f.FrontPageView();
		});
	});
}(this, void 0));