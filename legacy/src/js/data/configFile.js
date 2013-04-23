
(function($) {
	if(typeof packer === "undefined") { 
		packer = {}; 
	}
	/**
	 * makes all static methods and fields publicly available
	 * 
	 * @function
	 * @namespace takes control of reading, writing and parsing of the 
	 * 'jspackcfg' or 'jspackconfig'.
	 *  
	 */
	packer.configfile = function() {
		var _ = packer.lang.getText;
		/**
		 * holds the default Configuration
		 * with empty-fields and a generic name
		 */
		var defaultConfig = {
			nolint: [],
			nopack: [],
			includeSmallLoader: [],
			packageList: {},
			name: 'Project'
		};
		
		
		/**
		 * holds the actual configuration
		 */
		var cfg = {};
	
		
		/**
		 * is a reference to the File-Object
		 */
		var jspackcfg = '';
		
		
		/**
		 * checks the sanity of the configuration
		 * removes propertys that are not expected and may corrupt
		 * the config
		 * 
		 * if it is not-sane it writes the config, so reading always
		 * returns a sane config
		 * 
		 * @returns {Object} the sane config
		 */
		function sanity() {
			var i, len;
			var insane = false;
			len = cfg.includeSmallLoader.length;
			for(i = 0; i < len; i++) {
				if(typeof cfg.includeSmallLoader[i] !== 'string') {
					cfg.includeSmallLoader = HelperJS.remove(cfg.includeSmallLoader, i);
					insane = true;
				}
			}
			for(var prop in cfg.packageList) {
				if(cfg.packageList.hasOwnProperty(prop)) {
					if(typeof prop !== 'string') {
						delete cfg.packageList[prop];
						insane = true;
						continue;
					}
					var arr = cfg.packageList[prop];
					len = arr.length;
					for(i = 0; i < len; i++) {
						if(typeof arr[i] !== 'string') {
							arr = HelperJS.remove(arr, i);
							insane = true;
						}
					}
					cfg.packageList[prop] = arr;
				}
			}
			
			if(insane) {
				writeConfig();
			}
			return cfg;
		}
		
		
		/**
		 * @ignore
		 * is documented in the return statement
		 */
		function writeConfig() {
			// do some sanityChecks first
			sanity();
			if (packer.filemanager.writeContent(
				jspackcfg, 
				JSON.stringify(cfg, null, '\t')).ok
			) {
				return true;
			}
			return false;
		}
		
		/**
		 * @ignore
		 * is documented in the return
		 */
		function readConfig () {
			var conf = {};
			var result = packer.filemanager.readContent(jspackcfg);
			
			if (result.ok) {
				try {
					conf = JSON.parse(result.content);
				}
				catch (e) {
					try {
						conf = eval('(' + result.content + ')');
					} 
					catch (ex) {
						return {
							ok: false,
							config: cfg
						};
					}
				}
				
				cfg = jQuery.extend(true, {}, defaultConfig, conf);
				cfg = sanity();
				return {
					ok: true,
					config: cfg
				};
			}
			
			return {
				ok: false,
				config: cfg
			};
		}
		
		
		/**
		 * @ignore
		 * documented in the return
		 */
		function createConfig (conf) {
			conf = conf || {};
			cfg = jQuery.extend(true, {}, defaultConfig, conf);
		}
		
		
		/**
		 * @ignore
		 * documented in the return
		 */
		function setOption (name, val) {
			switch (name) {
				case 'obfuscate':
				case 'name':
					cfg[name] = val;
					break;
				case 'nolint':
				case 'nopack':
				case 'includeSmallLoader':
					if(!cfg[name]) {
						cfg[name] = [];
					}
					var pos = cfg[name].indexOf(val);
					if (pos !== -1) {
						cfg[name] = HelperJS.remove(cfg[name], pos);
					} else {
						var newVal = val.substring(val.lastIndexOf('/')+1, val.length);
						pos = cfg[name].indexOf(newVal);
						if(pos !== -1) {
							cfg[name] = HelperJS.remove(cfg[name], pos);
						} else {
							cfg[name].push(val);
						}
					}
					break;
				default:
					return {
						ok: false,
						config: cfg,
						status: 0
					};
			}
			if(writeConfig()) {
				return {
					ok: true,
					config: cfg,
					status: -1
				};
			}
			return {
				ok: false,
				config: cfg,
				status: 1
			};
		}
		

		/**
		 * @scope packer.configfile
		 */
		return {
			/**
			 * 
			 * reads and parses the content of the previously defined File jspackcfg
			 * and then returns it.
			 * Note: the config will be extended by the defaultConfig
			 * 
			 * @function
			 * @returns {Object}<br/>
			 * <code><strong>ok:</strong> {Boolean} if reading and parsing was successful</code><br/>
			 * <code><strong>config:</strong> {Object} the config</code>
			 */
			readConfig: readConfig,
			/**
			 * writes the current configuration to the jspackcfg-File
			 *
			 * @function
			 * @returns {Boolean} to see if writing was successful
			 */
			writeConfig: writeConfig,
			
			
			/**
			 * simply returns the current config
			 * 
			 * @returns {Object} the current config
			 */
			getConfig: function() {
				return cfg;
			},
			
			
			/**
			 * changes the configfile
			 * used when project A was used before but 
			 * project B is next.
			 *
			 * @param {air.File, string} file the fileHandler or the URL of the "new" File
			 * @param {String} projectName the name of the (maybe) newly created Config - can be dropped if not needed
			 * @returns {Object}<br/> 
			 * <code><strong>ok</strong>: (Boolean) //if it was successful,</code><br/>
			 * <code><strong>created</strong>: (Boolean) //if the jspackcfg-file had to be created (as the name states)</code>
			 */
			changeConfigFile: function (file, projectName) {
				jspackcfg = packer.filemanager.getFile(file);
				if(!jspackcfg.exists) {
					createConfig({
						name: projectName
					});
					if(writeConfig()) {
						return {
							ok: true,
							created: true
						};
					} 
					return {
						ok: false,
						created: true
					};
				}
	
				return {
					ok: true,
					created: false
				};
			},
			
			
			/**
			 * gets the URL of the current Config.
			 * checks if the file-object was initiated
			 * 
			 * @returns {Object} <br/>
			 * <code><strong>ok</strong>: (Boolean) //if it was successful</code><br/>
			 * <code><strong>url</strong>: (String) // the URL of the file
			 */
			getConfigURL: function () {
				if(jspackcfg && jspackcfg.url) {
					return {
						ok: true,
						url: jspackcfg.url
					};
				}
				return {
					ok: false,
					url: ''
				};
			},
			
			
			/**
			 * adds a package to the config-file
			 * 
			 * @param {String} name the name of the new package
			 * @returns {Object}<br/>
			 * <code><strong>ok</strong>: (Boolean) // if adding was successful</code><br/>
			 * <code><strong>config</strong>: (Object) // the current config</code><br/>
			 * <code><strong>name</strong>: (String) // the name of the added package</code><br/>
			 * <code><strong>url</strong>: (air.File) // a File-Ref to the configfile itpacker</code><br/>
			 * <code><strong>message</strong>: (Number) // all cool (-1),no "packageList" (0),package exists already(1), couldn't write config(2)</code>
			 */
			addPackage: function (name) {
				if (!cfg.packageList) {
					return {
						ok: false,
						config: cfg,
						name: name,
						url: jspackcfg,
						message: 0
					};
				}
				if(cfg.packageList[name]) {
					return {
						ok: false,
						config: cfg,
						name: name,
						url: jspackcfg,
						message: 1
					};
				}
				if(HelperJS.keys(cfg.packageList).length) {
					setOption('includeSmallLoader', name);
				}
				cfg.packageList[name] = [];
				if(writeConfig()) {
					return {
						ok: true,
						config: cfg,
						name: name,
						url: jspackcfg,
						message: -1
					};
				}
				return {
					ok: false,
					config:cfg, 
					name: name,
					url: jspackcfg,
					message: 2
				};
			},
			
			
			/**
			 * deletes a package from the config
			 * 
			 * @param {String} name the name of the package to delete
			 * @returns {Object}<br/>
			 * <code><strong>ok</strong>: (Boolean) // if delete was successful</code><br/>
			 * <code><strong>config</strong>: (Object) // the new config</code><br/>
			 * <code><strong>name</strong>: (String) // the name of the deleted pack</code><br/>
			 */
			deletePackage: function (name) {
				try {
					delete cfg.packageList[name];
				} catch (e) {
					return {
						ok: false,
						config: cfg,
						name: name
					};
				}
				if (cfg.includeSmallLoader && cfg.includeSmallLoader.indexOf(name) !== -1) {
					try {
						cfg.includeSmallLoader = HelperJS.remove(cfg.includeSmallLoader, cfg.includeSmallLoader.indexOf(name));
					} catch(ex) {
						return{
							ok: false,
							config: cfg,
							name: name
						};
					}
				}
				if(writeConfig()) {
					return {
						ok: true,
						config: cfg,
						name: name
					};
				}
				return {
					ok: false,
					config: cfg,
					name: name
				};
			},
			
			/**
			 * moves a package from index <code>oldIdx</code> to index <code>newIdx</code><br/>
			 * it even removes it from includeSmallLoder if moved to first position
			 * 
			 * @param {Number} oldIdx the index of the package to be moved
			 * @param {Number} newIdx the index the package to be moved to
			 * 
			 * @returns {Object}<br/>
			 * <code><strong>ok</strong>: (Boolean) // if delete was successful</code><br/>
			 * <code><strong>config</strong>: (Object) // the new config</code><br/>
			 * <code><strong>args</strong>: (Array) // the arguments passed to the function</code><br/>
			 * 
			 */
			switchPackage: function(oldIdx, newIdx) {
				if(cfg.includeSmallLoader) {
					if(cfg.includeSmallLoader.indexOf(oldIdx) !== -1 && cfg.includeSmallLoader.indexOf(newIdx) === -1) {
						cfg.includeSmallLoader.push(newIdx);
						cfg.includeSmallLoader = HelperJS.remove(cfg.includeSmallLoader, cfg.includeSmallLoader.indexOf(oldIdx));
					} else if(cfg.includeSmallLoader.indexOf(newIdx) !== -1 && cfg.includeSmallLoader.indexOf(oldIdx) === -1) {
						cfg.includeSmallLoader.push(oldIdx);
						cfg.includeSmallLoader = HelperJS.remove(cfg.includeSmallLoader, cfg.includeSmallLoader.indexOf(newIdx));
					}
				}
				var packStr = JSON.stringify(cfg.packageList);
				var oldStr = JSON.stringify(cfg.packageList[oldIdx]);
				oldStr = '"'+oldIdx + '":'+ oldStr;
				var newStr = JSON.stringify(cfg.packageList[newIdx]);
				newStr = '"'+newIdx + '":'+ newStr;
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
				try {
					cfg.packageList = JSON.parse(packStr);
				} catch(e) {
					cfg.packageList = eval('('+packStr+')');
				}
				
				if(writeConfig()) {
					return {
						ok: true,
						config: cfg,
						args: arguments
					};
				} else {
					return {
						ok: false,
						config: cfg,
						args: arguments
					};
				}
				
			},

			/**
			 * adds a file by the given name to the specified package
			 * 
			 * @param {String} packageName the name of the package the file should be added to
			 * @param {String} name the name of the file that should be added
			 * 
			 * @returns {Object}<br/>
			 * <code><strong>ok</strong>: (Boolean) // if delete was successful</code><br/>
			 * <code><strong>config</strong>: (Object) // the new config</code><br/>
			 * <code><strong>status</strong>: (Number) // all cool(-1), could not write(0), file already in pkg(1), 
			 * no js or json(2), file not an upper folder(3)</code><br/>
			 * <code><strong>name</strong>: (String) // the name of the new file</code><br/>
			 * 
			 */
			addFile: function (packageName, name) {
				var ending = name.substring(name.lastIndexOf('.')+1, name.length);
				if(ending !== 'js' && ending !== 'json') {
					return {
						ok: false,
						config:cfg,
						status: 2,
						name: name
					};
				}
				name = name.substring(0, name.lastIndexOf('.'));
				if(name.indexOf('..') === 0) {
					return {
						ok: false,
						config: cfg,
						status: 3,
						name: name
					};
				}
				if (cfg.packageList[packageName].indexOf(name) === -1) {
					cfg.packageList[packageName].push(name);
					if(writeConfig()) {
						return {
							ok: true,
							config: cfg,
							status: -1,
							name: name
						};
					}
					return {
						ok: false,
						config: cfg,
						status: 0,
						name: name
					};
				}
				
				return {
					ok: false,
					config: cfg,
					status: 1,
					name: name
				};
			},
			
			/**
			 * moves the file at index <code>oldIndex</code> of <code>pack</code> to index <code>newIndex</code>
			 * 
			 * @param {String} pack the name of the package
			 * @param {Number} oldIndex the index of the file which should be moved
			 * @param {Number} newIndex the index where to move the file to
			 * 
			 * @returns {Object}<br/>
			 * <code><strong>ok</strong>: (Boolean) // if delete was successful</code><br/>
			 * <code><strong>config</strong>: (Object) // the new config</code><br/>
			 * <code><strong>status</strong>: (Number) // all cool(-1), no pack defined(0), could not write(1)</code><br/>
			 */
			switchFile: function (pack, oldIndex, newIndex) {
				if(oldIndex === newIndex) {
					return {
						ok: true,
						config: cfg,
						status: -1
					};
				}
				if(typeof pack === 'undefined') {
					return {
						ok: false,
						config: cfg,
						status: 0
					};
				}
				var list = cfg.packageList[pack];
				var oneList = list.slice(0, oldIndex);
				var item = list.slice(oldIndex, oldIndex+1);
				var twoList = list.slice(oldIndex+1);
				list = oneList.concat(twoList);
				oneList = list.slice(0,newIndex);
				twoList = list.slice(newIndex);
				list = oneList.concat(item).concat(twoList);
				
				cfg.packageList[pack] = list;
				if(writeConfig()) {
					return {
						ok: true,
						config: cfg,
						status: -1
					};
				}
				return {
					ok: false,
					config: cfg,
					status: 1
				};
			},
			
			/**
			 * deletes a file from a package
			 * @param {String} packageName the name of the package
			 * @param {String} name the name of the file to delete
			 * 
			 * @returns {Object}<br/>
			 * <code><strong>ok</strong>: (Boolean) // if delete was successful</code><br/>
			 * <code><strong>config</strong>: (Object) // the new config</code><br/>
			 * 
			 */
			deleteFile: function (packageName, name) {
				var idx = cfg.packageList[packageName].indexOf(name);
				if (idx !== -1) {
					cfg.packageList[packageName] = HelperJS.remove(cfg.packageList[packageName], idx);
					if(cfg.nolint.indexOf(name) !== -1) {
						cfg.nolint = HelperJS.remove(cfg.nolint, cfg.nolint.indexOf(name));
					}
					if(cfg.nopack.indexOf(name) !== -1) {
						cfg.nopack = HelperJS.remove(cfg.nopack, cfg.nopack.indexOf(name));
					}
					if(writeConfig()) {
						return {
							ok: true,
							config: cfg
						};
					}
					return {
						ok: false,
						config: cfg
					};
				}
				return {
					ok: false,
					config: cfg
				};
			},
			/**
			 * sets a certain Option in the ConfigFile
			 * valid Options may be: obfuscate, name, nolint, nopack, includeSmallLoader
			 *
			 * @function
			 * @param {String} name the name of the option
			 * @param {String} val the value of the option (in most cases a file name)
			 *
			 * @returns {Object}<br/>
			 *			<code><strong>ok:</strong>if setting of option was successful</code><br/>
			 *			<code><strong>config:</strong>the current config</code><br/>
			 *			<code><strong>status:</strong>all cool(-1), no valid option(0), not written(1)</code>
			 */
			setOption: setOption,
			
			/**
			 * creates a new config. 
			 * extends defaultConfig
			 * <strong>will not be written</strong>
			 * @function
			 * @param {Object} conf the config to be created - not required
			 */
			createConfig: createConfig
		};
	}();
}(jQuery));