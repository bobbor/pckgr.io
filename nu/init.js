(function() {
	var
		connect = require('connect'),
		http = require('http'),
		app
	;

	app = connect()
		.use(connect['static']('resource-server'))
	;

	http.createServer(app).listen(8080, function() {
		console.log('Running on http://localhost:8080');
	});
}());