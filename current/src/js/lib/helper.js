(function(window) {
	var self = this;
	var oldHelperJS = self.HelperJS;
	
	var HelperJS = function(obj) { return new wrapper(obj); };
	self.HelperJS = HelperJS;
	HelperJS.VERSION = '0.1';
	HelperJS.indexOf = function(arr,key) {
		for(var i = 0, len = arr.length; i < len; i++) {
			if(arr[i] === key) {
				return i;
			}
		}
		
		return -1;
	};
	
	HelperJS.lastIndexOf = function(arr, key) {
		for(var i = arr.length; i--; ) {
			if(arr[i] === key) {
				return i;
			}
		}
		
		return -1;
	};
	
	HelperJS.map = function(obj, func, context) {
		var ret = [];
		if(obj === null) { return ret; }
		if(obj.map && HelperJS.isFunction(obj.map)) { return obj.map(func, context); }
		each(obj, function(val, prop, list) {
			ret[ret.length] = func.call(context, val, prop, list);
		});
		return ret;
	};
	
	var each = HelperJS.forEach = function(obj, func, context) {
		
		if(obj.forEach && HelperJS.isFunction(obj.forEach)) { obj.forEach(func, context); }
		else {
			if(!HelperJS.isNaN(obj.length)) { // we got an array here
				for(var i = 0, len = obj.length; i < len; ++i) {
					func.call(context, obj[i], i, obj);
				}
			} else {
				for(var prop in obj) {
					if(obj.hasOwnProperty(prop)) {
						func.call(context, obj[prop], prop, obj);
					}
				}
			}
		}
	};
	
	HelperJS.uniq = function(arr) {
		var ret = [];
		for(var i = 0, len = arr.length; i < len; i++) {
			if(HelperJS.indexOf(ret, arr[i]) === -1) {
				ret.push(arr[i]);
			}
		}
		
		return ret;
	};
	
	HelperJS.sum = function(obj) {
		var result = 0;
		if(!HelperJS.isNaN(obj.length)) {
			for(var i = obj.length; i --; ) {
				if(!HelperJS.isNaN(obj[i])) {
					result += obj[i];
				}
			}
		}
		return result;
	};
	
	HelperJS.toFormattedString = function(arr) {
		var ret = '[ ';
		for(var i = 0, len = arr.length; i < len; i++) {
			ret += ''+i+': ';
			if(typeof arr[i] === "function") {
				ret += arr[i].toSource();
			}
			else if(typeof arr[i] === 'object') {
				
			} else {
				ret += arr[i];
			}
			ret +=', ';
		}
		ret = ret.substring(0, ret.length-2);
		return ret + ' ]';
	};
	
	var merge = function(left, right) {
		var ret = [];
		while(left.length && right.length) {
			if(left[0] < right[0]) {
				ret.push(left.shift());
			} else {
				ret.push(right.shift());
			}
		}
		if(left.length) {
			ret = ret.concat(left);
		}
		
		if(right.length) {
			ret = ret.concat(right);
		}
		return ret;
	};
	
	HelperJS.mergeSort = function(arr) {
		if(arr.length <= 1) {
			return arr;
		} else {
			var half = (arr.length % 2) ? (arr.length-1) / 2 : arr.length / 2 || 1;
			var left = HelperJS.mergeSort(arr.slice(0,half));
			var right = HelperJS.mergeSort(arr.slice(half));
			return merge(left, right);
		}
	};
	
	HelperJS.noConflict = function() {
		if(typeof oldHelperJS !== 'undefined') {
			self.HelperJS = oldHelperJS;	
		} else {
			delete self.HelperJS;
		}
		return HelperJS;
	};
	
	HelperJS.functions = HelperJS.methods = function(obj) {
	    return HelperJS.filter(HelperJS.keys(obj), function(key){ return HelperJS.isFunction(obj[key]); }).sort();
	};
	
	HelperJS.filter = function(obj, func) {
		var ret = [];
		each(obj, function(val, prop) {
			if(func.call(obj, val)) {
				ret.push(val);
			}
		});
		return ret;
	};
	
	HelperJS.isFunction = function(func) {
		return !!(func && func.constructor && func.call && func.apply);
	};
	HelperJS.isString = function(str) {
	    return !!(str === '' || (str && str.charCodeAt && str.substr));
	};
	HelperJS.isArray = function(arr) {
		return !!(arr && arr.pop && arr.push);
	};
	HelperJS.isNumber = function(num) {
		return !!(num === 0 || (num.toExponential && num.toFixed));
	};
	HelperJS.isNaN = function(obj) {
		return obj !== obj;
	};
	
	HelperJS.keys = function(obj) {
		var ret = [];
		if(!obj) { return ret; }
		for(var key in obj) {
			if(obj.hasOwnProperty(key)) {
				ret.push(key);
			}
		}
		return ret;
	};
	
	HelperJS.remove = function(obj, begin, end) {
		if(begin === void 0 && end === void 0) { return obj; }
		if(!HelperJS.isNaN(obj.length)) {
			if(!end) {
				end = begin;
			}
			var left;
			if(begin === 0) {
				left = [];
			} else {
				left = obj.slice(0, begin);
			}
			var right = obj.slice(end+1, obj.length);
			return left.concat(right);
		} else {
			if(HelperJS.isString(begin)) {
				obj[begin] = null;
				delete obj[begin];
				return obj;
			} else if(HelperJS.isArray(begin)) {
				for(var i = begin.length; i--; ) {
					obj[begin[i]] = null;
					delete obj[begin[i]];
				}
				return obj;
			}
		}
	};
	
	HelperJS.locToObj = function(str, del, sep) {
		var ret = str.split(sep);
		var arr = {};
		for(var i = ret.length; i--;) {
			arr[ret[i].split(del)[0]] = ret[i].split(del)[1];
		}
		return arr;
	};
	
	HelperJS.objToLoc = function(obj, del, sep) {
		ret = '';
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop)) {
				ret += ''+prop+''+del+''+obj[prop]+''+sep;
			}
		}
		
		ret = ret.substring(0, ret.length-sep.length);
		return ret;
	};
	
	HelperJS.param = function(obj) {
		return HelperJS.objToLoc(obj, '=', '&');
	};
	/*
	 * CHAINABILITY OF HelperJS
	 */
	
	var wrapper = function(obj) { this.data = obj; };
	HelperJS.prototype = wrapper.prototype;
	
	var addToWrapper = function(name, func) {
		wrapper.prototype[name] = function() {
			var args = Array.prototype.slice.call(arguments);
			Array.prototype.unshift.call(args, this.data);
			return HelperJS(func.apply(HelperJS, args));
		};
	};
	
	each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
		var method = Array.prototype[name];
		wrapper.prototype[name] = function() {
			method.apply(this.data, arguments);
			return HelperJS(this.data);
		};
	});
	
	each(['concat', 'join', 'slice'], function(name) {
		var method = Array.prototype[name];
		wrapper.prototype[name] = function() {
			return HelperJS(method.apply(this.data, arguments));
		};
	});
	
	each(HelperJS.functions(HelperJS), function(funcName) {
		addToWrapper(funcName, HelperJS[funcName]);
	});
	
	
	
	
	
	
	
	
	/*
	 * JQUERY EXTENSIONS
	 */
	if(typeof jQuery !== "undefined" && typeof jQuery.fn !== undefined) {
		var oldJQueryCSS = jQuery.fn.css;
		jQuery.fn.css = function( name, value ) {
			var that = this;
			if(HelperJS.isArray(name)) {
				return HelperJS.map(name, function(val) {
					if(value === void 0) {
						return oldJQueryCSS.call(that, val);
					}
					return oldJQueryCSS.call(that, val, value);
				});
			} else {
				if(value === void 0) {
					return oldJQueryCSS.call(that, name);
				}
				return oldJQueryCSS.call(that, name, value);
			}
		};
	}
	
	var ParkMiller = function(seed) {
		this.s = 0;
		this.s = seed >  0 ? seed % 2147483647 : 1;
	};
	
	ParkMiller.prototype = {
			getSeed: function() {
				this.ready = false;
				return this.s;
			},
			setSeed: function(seed) {
				this.ready = false;
				this.s = seed > 0 ? seed % 2147483647 : 1;
			},
			uniform: function() {
				return ( ( this.s = ( this.s * 16807 ) % 2147483647 ) / 2147483647 );
			},
			standardNormal: function() {
				if ( this.ready ) {
					this.ready = false;
					return this.cache;
				}
				var x = 0;
				var y = 0;
				var w = 0;
				
				do {
					x = ( this.s = ( this.s * 16807 ) % 2147483647 ) / 1073741823.5 - 1;
					y = ( this.s = ( this.s * 16807 ) % 2147483647 ) / 1073741823.5 - 1;
					w = x * x + y * y;
				} while ( w >= 1 || !w );
				w = Math.sqrt ( -2 * Math.log ( w ) / w );
				
				this.ready = true;
				this.cache = x * w;

				return y * w;
			},
			bernoulli: function (p) {
				return ( this.s = ( this.s * 16807 ) % 2147483647 ) < p * 2147483647;
			}
	};
}(window));