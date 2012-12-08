(function() {
	requirejs.config({
		baseUrl: '/js',
		paths: {},
		shim: {}
	});
	require(['app'], function(App) {
		window.pckgr = new App();
	});
}());