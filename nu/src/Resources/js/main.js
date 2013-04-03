(function() {
	var $s = window.Frontender.$script;
	var f = window.Frontender;
	$s('js/lib/jquery.js', 'jquery', function() {
		f.jQuery = window.jQuery.noConflict(true);
		f.$ = f.jQuery;
	});
	$s('js/lib/underscore.js', '_', function() {
		f._ = window._.noConflict(true);
	});
	$s('js/lib/mousewheel.js', 'mousewheel'); // depends on jquery
	$s('js/lib/jsp.js', 'scrollpane'); // depends on jquery and mousewheel
	$s('js/gui/Scroller.js', 'ScrollerClass'); // depends on jquery and scrollpane

	$s('js/gui/fn.stickHead.js', 'sticky'); // depends on jquery
	$s('js/lib/bootstrap.js', 'bootstrap'); //depends on jquery

	$s('js/gui/fn.scroller.js', 'scroller'); // depends on jquery and ScrollerClass

	$s('js/lib/backbone.js', 'backbone', function() {
		f.Backbone = window.Backbone.noConflict(true);
	}); // depends on jquery and underscore
	$s('js/data/fsBridge.js', 'File');

	$s(['js/lib/jquery.js', 'js/lib/underscore.js', 'js/lib/backbone.js'], 'oo');
}());
