(function(window) {
	"use strict";
	window.Sluraff.queries = (function(str, group, pair) {
		str || (str = window.location.search);
		group = group || '&';
		pair = pair || '=';

		return str //string
			.replace(/^\?/g, '') //string
			.split(group) //array
			.map(function(item) {return item.split(pair);}) // 2-dim Array
			.join() // string
			.split(',') // array
			.reduce(function(ret, item, idx, src) {idx%2 ? ret[src[idx-1]] = item : ''; return ret}, {}); // object
	}());
}(this));