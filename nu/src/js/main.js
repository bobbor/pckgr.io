(function() {
	requirejs.config({
		baseUrl: 'js',
		shim: {
			'lib/jsp': ['lib/mousewheel'],
			'lib/mousewheel': ['lib/jquery'],
			'gui/fn.scroller': ['lib/jquery'],
			'gui/fn.collapse': ['lib/jquery'],
			'gui/fn.stickHead': ['lib/jquery'],
			'gui/fn.detailsSwitcher': ['lib/jquery'],
			'lib/bootstrap': ['lib/jquery'],
			'lib/jquery': {
				exports: '$'
			},
			'lib/underscore': {
				exports: '_'
			},
			'lib/backbone': {
				deps: ['lib/underscore', 'lib/jquery'],
				exports: 'Backbone'
			},
			'app': {
				deps: ['lib/underscore', 'lib/backbone']
			}
		}
	});

	require(['app'], function(App) {
		window.pckgr = new App();
	});
}());
