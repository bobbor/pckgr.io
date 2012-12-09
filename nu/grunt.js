module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-exec');

	grunt.initConfig({
		exec: {
			build: {
				command: 'node node_modules\\requirejs\\bin\\r.js -o require-config.js'
			},
			bundle: {
				command: 'cd build && adt.bat -package -storetype pkcs12 -keystore ..\\cert.p12 -storepass loremipsum -tsa none -target native ..\\bin\\packager.exe application.xml .'
			},
			debug: {
				command: 'adl build\\application.xml'
			}
		}
	});

	grunt.registerTask('copy-require', function() {
		grunt.file.mkdir('build/js/lib');
		grunt.file.copy('node_modules/requirejs/require.js', 'build/js/lib/requirejs/require.js');
		grunt.file.copy('node_modules/jquery-browser/lib/jquery.js', 'build/js/lib/jquery-browser/lib/jquery.js');
	});

	grunt.registerTask('prepare-bundle', function() {
		grunt.file.mkdir('bin/');
	});

	grunt.registerTask('debug', 'exec:build copy-require exec:debug');
	grunt.registerTask('default', 'exec:build copy-require prepare-bundle exec:bundle');
};