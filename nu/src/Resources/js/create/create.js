(function(window, undefined) {
	var f = window.Frontender;
	var $s = f.$script;

	$s('js/create/data/projectgenerator.js', 'generator');
	$s('js/create/data/filemanager.js', 'filemanager');
	$s('js/create/views/FooterView.js', 'FooterView');
	$s('js/create/views/ContentView.js', 'ContentView');
	$s('js/create/views/AppView.js', 'AppView');

	$s.ready(['jquery', '_', 'backbone', 'AppView'], function() {
		var $ = f.jQuery;
		$(function() {
			new f.AppView();
		});
	});
}(this, void 0));