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
	var helpers = require('swig/lib/helpers');

	var scopedstyle = function(indent, parser) {
		var myArg = parser.parseVariable(this.args[0]),
			output = [];

		output.push(helpers.setVar('__myArg', myArg));
		output.push('_output += "<style scoped>";');
		output.push('_output += "@import url(";');
		output.push('_output += "./js/features/compass/templates/";');
		output.push('_output += __myArg;');
		output.push('_output += ");";');
		output.push('_output += "</style>";');
		return output.join('');
	};
	scopedstyle.ends = false;


	swig.init({
		root: './prog/js/features',
		tags: {
			scopedstyle: scopedstyle
		}
	});

	return {
		extraKlass: 'console',
		render: function(conf) {
			var t;
			try {
				t = swig.compileFile('compass/templates/coreTemplate.html');
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