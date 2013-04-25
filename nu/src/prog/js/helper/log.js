(function(window, undefined) {
	"use strict";
	var oldlog = console.log;
	var oldwarn = console.warn;
	var olderror = console.error;

	function getLineNumber() {
		function getErrorObject(){
			try { throw Error(''); } catch(err) { return err; }
		}
		var err = getErrorObject();
		var stack = err.stack.split('\n');
		stack = stack.slice(5,stack.length-1);
		return ['\n  ', stack[0]];
	}

	var bg_log = function(bg) {
		bg = bg || '#fff';
		return function(fg) {
			fg = fg || '#000';
			return function() {
				oldlog.apply(console,
					['%cLOG', 'color: '+fg+';background-color: '+bg, ' :']
						.concat(Array.prototype.slice.call(arguments))
						.concat(getLineNumber())
					)
				;
			}
		}
	};

	console.warn = function() {
		oldwarn.apply(console,
			['%c   WARN :', 'background-color: #ff0;color: #333']
				.concat(Array.prototype.slice.call(arguments))
				.concat(getLineNumber())
			)
		;
	};

	console.error = function() {
		olderror.apply(console,
			['%c  ERROR :', 'background-color: red;color:white']
				.concat(Array.prototype.slice.call(arguments))
			)
		;
	};







	var simple = bg_log('#fff');
	var bluebg = bg_log('#06f');
	var redbg = bg_log('#d00');
	var greenbg = bg_log('#0d0');
	var yellowbg = bg_log('#ee0');
	console.blue = simple('#06f');
	console.red = simple('#d00');
	console.green = simple('#0d0');
	console.yellow = simple('#ee0');
	console.ablue = bluebg('#000');
	console.ared = redbg('#000');
	console.agreen = greenbg('#000');
	console.ayellow = yellowbg('#000');
	console.log = console.blue;

}(this, void 0));