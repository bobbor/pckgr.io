(function(name, dfn, ctx) {
	if (typeof module != 'undefined' && module.exports) {
		module.exports = dfn();
	} else if (typeof define == 'function' && define.amd) {
		define(dfn);
	} else {
		ctx[name] = dfn();
	}
}('content', function() {

	var _ = require('underscore');
	var swig = require('swig');


	return {
		plugs: ['stickHead'],
		render: function(conf) {
			var t;
			try {
				t = swig.compileFile('packager/templates/coreTemplate.html');
			} catch(o_O) {
				return o_O.render();
			}
			return t.render(conf);
		},
		events: {
			'click button': function() {}
		}
	};

}, this));