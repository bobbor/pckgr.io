/**
 * @author Philipp
 *
 *
 * namespace.js - 19.01.2012
 */

(function(window, undefined) {
	"use strict";
	
	var _ = window._;
	var ns = {};
	var templates = {};
	
	window.packager = {
		define: function(name, deps, proto) {
			if(ns[name]) {return;}
			ns[name] = function() {
				if(ns['inst_'+name]) {
					return ns['inst_'+name];
				}
				ns['inst_'+name] = this;
				for(var i = 0, len = deps.length; i < len; i++ ) {
					deps[i] = new ns[deps[i]]();
				}
				for(var prop in proto) {
					ns['inst_'+name][prop] = proto[prop];
				}
				delete ns['inst_'+name]._init;
				proto._init.apply(ns['inst_'+name], deps);
				return ns['inst_'+name];
			};
		},
		init: function(whaaaat) {
			if(!ns[whaaaat]) { return; }
			return new ns[whaaaat]();
		},
		layout: function(name, deps, proto) {
			if(templates[name]) {return;}
			templates[name] = {
				deps: deps,
				proto: proto
			};
		},
		decorate: function(name, layout, deps, proto) {
			return packager.define(name, 
					_.uniq(deps.concat(templates[layout].deps)),
					_.extend({}, templates[layout].proto, proto)
				);
		}
	};
	
}(window));