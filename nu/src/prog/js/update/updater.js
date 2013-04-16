/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  $        = window.jQuery
		, F        = window.Frontender
		, _        = window._
		, Backbone = window.Backbone
		, version  = new F.defs.FileBridge('prog/version')
		, fs       = require('fs')
		, http     = require('http')
		, p        = require('path')
		, remote
	;

	F.defs.Updater = function(url) {
		var that = this;
		this.url = url;
		if(!version.exists) {
			version.write("4.0.0.0", function() {}, true);
		}
		var check = function() {
			version.read(function(success, data) {
				if(!success) {
					that.trigger('read_error');
				}
				that.version = JSON.parse(data);
				remote = new F.defs.HTTPBridge(that.url+'/update?ver='+that.version);
				that.check();
			});
		};

		if(fs.existsSync('update_in_progress')) {
			fs.unlinkSync('update_in_progress');
			$(window).on('load', function() {
				alert('done');
			});
		} else {
			check();
		}
	};
	_.extend(F.defs.Updater.prototype, Backbone.Events, {
		check: function(silent) {
			var that = this;
			if(that.version !== 'NIGHTLY') {
				remote.get(function(data) {
					if(data.length) {
						that.updateData = JSON.parse(data);
						if(!silent) {
							that.trigger('updateAvailable')
						}
					}
				});
			}
		},
		download: function() {
			if(_.keys(this.updateData.to_add).length) {
				this.recursive_download(this.updateData.to_add, 'prog')
			}
		},
		_download: function(from, to, fn) {
			http.get(from, function(res) {
				var offset = 0;
				var data = new Buffer(0);
				res.on('data', function(chunk) {
					data = Buffer.concat([data, chunk]);
				}).on('end', function() {
					fs.writeFile(to, data, fn);
				})
			});
		},
		recursive_download: function(obj, target, extra) {
			var url = this.url + this.updateData.path;
			var that = this;
			if(!fs.existsSync(target)) {
				fs.mkdirSync(target);
			}
			var arrIterator = function(arr, extra, fncomplete) {
				if(!arr.length) {
					fncomplete();
					return;
				}
				var item = arr.shift();
				that._download(url+extra+'/'+item, target+extra+'/'+item, function() {
					arrIterator(arr, extra, fncomplete);
				});
			};

			var objIterator = function(keys, obj, extra, fncomplete) {
				if(!keys.length) {
					fncomplete()
					return;
				}
				var key = keys.shift();
				var item = obj[key];
				var e = extra+'/'+key;

				if(_.isArray(item)) {
					arrIterator(item, extra, function() {
						objIterator(keys, obj, extra, fncomplete)
					});
				} else {
					if(!fs.existsSync(target+extra+'/'+key)) {
						fs.mkdirSync(target+extra+'/'+key);
					}
					objIterator(_.keys(item), item, e, function() {
						objIterator(keys, obj, extra, fncomplete)
					});
				}
			};
			objIterator(_.keys(obj), obj, '', function() {
				fs.writeFile('update_in_progress', '');
				version.write(JSON.stringify(that.updateData.version), function() {}, true);
				F.inst.mainWindow.reload();
			});
		},
		_copyExistingUpdate: function(src, target, cb) {
			var files = fs.readdirSync(src);
			var stat;
			for(var i = 0; i < files.length; i++) {
				stat = fs.statSync(src+'/'+files[i]);
				if(stat.isDirectory()) {
					if(!fs.existsSync(target+'/'+files[i])) {
						fs.mkdirSync(target+'/'+files[i]);
					}
					this._copyExistingUpdate(src+'/'+files[i], target+'/'+files[i]);
				} else if(stat.isFile()) {
					fs.renameSync(src+'/'+files[i], target+'/'+files[i]);
				}
			}
			fs.rmdirSync(src);
			if(cb) {
				cb();
			}
		}
	});
}(this));