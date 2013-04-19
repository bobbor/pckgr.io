(function(window) {
	"use strict";
	var
		  F        = window.Sluraff
		, $        = window.jQuery
		, _        = window._
		, Backbone = window.Backbone
		, http     = require('http')
	;

	F.defs.HTTPBridge = function(url) {
		this.url = url;
	};

	_.extend(F.defs.HTTPBridge.prototype, Backbone.Events, {
		get: function(callback) {
			http.get(this.url, function(res) {
				var data = '';
				res.on('data', function(chunk) {
					data += chunk;
				}).on('end', function() {
					callback(data);
				});
			});
		}
	});
}(this))