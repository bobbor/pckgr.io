(function(window, undefined) {
	"use strict";
	var F = window.Sluraff;
	var LOG_VERBOSE = 0,
		LOG_INFO = 1,
		LOG_WARN = 2,
		LOG_ERROR = 3,
		LOG_NONE = 4;

	var logNormal = function(){
		if (window.console && window.console.log) {
			if (console.log.apply) {
				console.log.apply(console, arguments);
			}
			else {
				var a = Array.prototype.slice.call(arguments);
				console.log(_.reduce(a, function(p, v) { return p + v; }));
			}
		}
	};
	var logWarn = function(){
		if (window.console && window.console.warn) {
			if (console.warn.apply) {
				console.warn.apply(console, arguments);
			}
			else {
				var a = Array.prototype.slice.call(arguments);
				console.warn(_.reduce(a, function(p, v) { return p + v; }));
			}
		}
	};
	var	logError = function() {
		if (window.console && window.console.error) {
			if (console.error.apply) {
				console.error.apply(console, arguments);
			} else {
				var a = Array.prototype.slice.call(arguments);
				console.error(_.reduce(a, function(p, v) { return p + v; }));
			}
		}
	};

	function getLineNumber() {
		function getErrorObject(){
			try { throw Error(''); } catch(err) { return err; }
		}
		var arr_remove = function(array, from, to) {
			var rest = array.slice((to || from) + 1 || array.length);
			array.length = from < 0 ? array.length + from : from;
			return array.push.apply(array, rest);
		};
		var err = getErrorObject();
		var call_stack = err.stack.split('\n');
		arr_remove(call_stack, 0,4);
		arr_remove(call_stack, 1, -1)
		for(var i = call_stack.length;i--;) {
			call_stack[i] = call_stack[i].slice((call_stack[i].indexOf("at ") || 0)+2, call_stack[i].length);
		}
		return call_stack.join('\n         ');
	}

	F.log = function() {
		logNormal.apply(null,
			['%c   INFO :', 'color: #06e']
				.concat(Array.prototype.slice.call(arguments))
				.concat(['\n\n        ', getLineNumber()])
		);
	};
	F.warn = function() {
		logWarn.apply(null,
			['%c   WARN :', 'background-color: #ff0;color: #333']
				.concat(Array.prototype.slice.call(arguments))
				.concat(['\n\n        ', getLineNumber()])
		);
	};
	F.error = function() {
		logError.apply(null, ['%c  ERROR :', 'background-color: red;color:white'].concat(Array.prototype.slice.call(arguments)));
	};

}(this, void 0));