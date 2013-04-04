(function(window, undefined) {
	"use strict";
	var f = window.Frontender;
	var $s = f.$script;

	$s('js/home/models/ProjectItem.js', 'ProjectItem');
	$s('js/home/collections/ProjectList.js', 'ProjectList');
	$s('js/home/views/ProjectItemView.js', 'ProjectItemView');

	$s('js/home/views/FooterView.js', 'FooterView');
	$s('js/home/views/ContentView.js', 'ContentView');
	$s('js/home/views/MainView.js', 'MainView');

	$s.ready(['jquery', 'MainView', 'Settings'], function() {
		var $ = f.jQuery;
		$(function() {
			new f.MainView();
		});
	});
}(this, void 0));