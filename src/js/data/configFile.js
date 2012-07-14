(function(pack, window, undefined) {
	
	"use strict";
	var _ = window._;
	
	pack.define('configfile', ['filemanager'], {
		_init: function(fm) {
			var that = this;
			that.fm = fm;
			that.defaultConfig = {
				nolint: [],
				nopack: [],
				includeSmallLoader: [],
				packageList: {},
				name: 'Project'
			};
			that.cfg = {};
			that.jspackcfg = '';
		},
		createConfig: function (conf, cb) {
			this.cfg = _.extend({}, this.defaultConfig, conf || {});
			cb && cb({ok: true});
		},
		readConfig: function(cb) {
			var conf = {};
			var that = this;
			this.fm.readContent(true, this.jspackcfg, function(result) {
				if (result.ok) {
					that.cfg = _.extend({}, inst.defaultConfig, result.parsed);
					cb && cb({
						ok: true
					});
				} else {
					cb && cb({
						ok: false
					});
				}
			});
		},
		writeConfig: function(cb) {
			this.fm.writeContent(this.jspackcfg,  JSON.stringify(this.cfg, null, '\t'), false, cb);
		},
		addFile: function (packageName, name, cb) {
			var suffix = name.substring(name.lastIndexOf('.')+1, name.length);
			if(ending !== 'js' && ending !== 'json') {
				cb && cb({
					ok: false,
					status: 2
				});
				return;
			}
			name = name.substring(0, name.lastIndexOf('.'));
			
			if(name.indexOf('..') === 0) {
				cb && cb({
					ok: false,
					status: 3
				});
				return;
			}
			if (!~this.cfg.packageList[packageName].indexOf(name)) {
				this.cfg.packageList[packageName].push(name);
				cb && cb({
					ok: true,
					status: -1
				});
			} else {
				cb && cb({
					ok: false,
					status: 1
				});
			}
		},
		deleteFile: function (packageName, name, cb) {
			this.cfg.packageList[packageName] = _.without(this.cfg.packageList[packageName], name);
			this.cfg.nolint = _.without(this.cfg.nolint, name);
			this.cfg.nopack = _.without(this.cfg.nopack, name);
			
			cb && cb({ok: true});
		},
		addPackage: function (name, cb) {
			if (!this.cfg.packageList) {
				cb && cb({
					ok: false,
					message: 0
				});
				return;
			}
			if(this.cfg.packageList[name]) {
				cb && cb({
					ok: false,
					message: 1
				});
				return;
			}
			if(_.keys(this.cfg.packageList).length) {
				this.setOption('includeSmallLoader', name);
			}
			this.cfg.packageList[name] = [];
			cb && cb({
				ok: true,
				message: -1
			});
		},
		deletePackage: function (name, cb) {
			var files = this.cfg.packageList[name];
			var that = this;

			function dodelete(arr, delCB) {
				if(!arr.length) { delCB(); }
				that.deleteFile(name, files[0], function() {
					dodelete(arr.slice(1), delCB);
				});
			}
			
			dodelete(files, function() { delete that.cfg.packageList[name]; });
			this.cfg.includeSmallLoader = _.without(this.cfg.includeSmallLoader, name);
			cb && cb({ok: true});
		},
		setOption: function(name, val, cb) {
			var that = this;
			switch (name) {
				case 'obfuscate':
				case 'name':
					that.cfg[name] = val;
					break;
				case 'nolint':
				case 'nopack':
				case 'includeSmallLoader':
					if(!that.cfg[name]) {
						that.cfg[name] = [];
					}
					
					var pos = that.cfg[name].indexOf(val);
					
					if (~pos) {
						that.cfg[name] = _.filter(that.cfg[name], function(val, key) {
							return key !== pos;
						});
					} else {
						var newVal = val.substring(val.lastIndexOf('/')+1, val.length);
						pos = inst.cfg[name].indexOf(newVal);
						if(~pos) {
							that.cfg[name] = _.filter(that.cfg[name], function(val, key) {
								return key !== pos;
							});
						} else {
							that.cfg[name].push(val);
						}
					}
					
					break;
				default:
					cb && cb({
						ok: false,
						status: 0
					});
					return;
			}
			cb && cb({
				ok: true,
				status: -1
			});
		},
		changeConfig: function (file, projectName, cb) {
			var that = this;
			this.jspackcfg = this.fm.getFile(file);
			if(!this.jspackcfg) {
				cb && cb({
					ok: false
				});
				return;
			}
			if(!this.jspackcfg.exists) {
				this.createConfig({
					name: projectName
				}, function() {
					that.writeConfig(function(result) {
						cb && cb({
							ok: result.ok,
							created: result.ok
						});
					});
				});
				return;
			} else {
				that.readConfig(function(result) {
					cb && cb({
						ok: result.ok,
						created: false
					});
				});
			}
		},
		switchPackage: function(oldPack, newPack, cb) {
			var sl = this.cfg.includeSmallLoader;
			var that = this;
			if(sl) {
				// new pack was the one with the devloader
				if(~sl.indexOf(oldPack) && !~sl.indexOf(newPack)) {
					// add newPack to smallLoader
					sl.push(newPack);
					// and make oldPack the devloader
					sl = _.reject(sl, function(item) { return item === oldPack; });
					
				// oldPack was the one with the devloader
				} else if(~sl.indexOf(newPack) && !~sl.indexOf(oldPack)) {
					// so we make oldPack using the smallLoader
					sl.push(oldPack);
					//and remove newPack from smallLoader
					sl = _.reject(sl, function(item) { return item === newPack; });
				}
				that.cfg.includeSmallLoader = sl;
			}
			
			/**
			 * do some string-voodoo to change the order... 
			 * very bad actually
			 * 
			 * TODO: find a better way
			 */
			var packStr = JSON.stringify(that.cfg.packageList);
			var oldStr = JSON.stringify(that.cfg.packageList[oldPack]);
			oldStr = '"'+oldPack + '":'+ oldStr;
			var newStr = JSON.stringify(that.cfg.packageList[newPack]);
			newStr = '"'+newPack + '":'+ newStr;
			var test = oldStr+','+newStr;
			var result = newStr + ','+oldStr;
			var pack1Str,pack2Str;
			
			if(packStr.indexOf(test) === -1) {
				test = newStr+','+oldStr;
				result = oldStr+','+newStr;
			}
			pack1Str = packStr.substring(0, packStr.indexOf(test));
			pack2Str = packStr.substring(packStr.indexOf(test) + test.length, packStr.length);
			packStr = pack1Str + result + pack2Str;
			
			that.cfg.packageList = that.fm.parse(packStr);
			
			cb && cb({
				ok: true,
				packs: [oldPack, newPack]
			});
		},
		switchFile: function (pack, oldIndex, newIndex, cb) {
			var that = this;
			
			if(oldIndex === newIndex) {
				cb && cb({
					ok: true,
					status: -1
				});
				return;
			}
			
			if(typeof pack === 'undefined') {
				cb && cb({
					ok: false,
					status: 0
				});
				return;
			}
			
			/**
			 * and here we do some array-voodoo
			 * 
			 * TODO: any better?
			 */
			var list = that.cfg.packageList[pack];
			var oneList = list.slice(0, oldIndex);
			var item = list.slice(oldIndex, oldIndex+1);
			var twoList = list.slice(oldIndex+1);
			list = oneList.concat(twoList);
			oneList = list.slice(0,newIndex);
			twoList = list.slice(newIndex);
			list = oneList.concat(item).concat(twoList);
			
			that.cfg.packageList[pack] = list;
			
			cb && cb({
				ok: true,
				status: -1
			});
		}
	});
}(packager, window));