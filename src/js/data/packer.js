(function($){
	if(typeof packer === "undefined") { packer = {}; }

	/**
	 * @function
	 * 
	 * @namespace closure
	 */
	closure = function() {
		var typeSettings = {
			winPath: 'C:/Windows/System32/java.exe',
			maclinPath: '/usr/bin/java',
			compressorPath: 'app:/compiler/compiler.jar',
			argumentsExtra: '--js',
			initialArg: '-jar'
		};
		
		return {
			getSettings: function() {
				return typeSettings;
			}
		};
	}();
}(jQuery));


/**
 * 
 */
(function($){
	if(typeof packer === "undefined") { packer = {}; }

	/**
	 * @function
	 * 
	 * @namespace uglify
	 */
	uglify = function() {
		var typeSettings = {
			winPath: 'app:/bin/node.exe',
			maclinPath: '/usr/bin/node',
			compressorPath: 'app:/uglify/main.js',
			argumentsExtra: '--compress',
			initialArg: ''
		};
		
		return {
			getSettings: function() {
				return typeSettings;
			}
		};
	}();
}(jQuery));


(function($){
	if(typeof packer === "undefined") { packer = {}; }
	/**
	 * makes the closure object available to the packer object
	 * 
	 * @function
	 * 
	 * @namespace this holds the closure compiler to pack the code
	 */
	packager = function() {
		var _ = lang.getText;
		
		/**
		 * makes the config passed by the GUI of the project to be packed to the 
		 */
		var cfg = {};
		
		/**
		 * holds the path to the project, required to actually pack the project
		 */
		var path = '';
		
		/**
		 * the count of all files in the list
		 */
		var listLength;
		
		/**
		 * if the packager has found errors
		 */
		var gotErrors = false;
		
		/**
		 * if errors have been found, this is where they get stored in
		 */
		var errors = [];
		
		/**
		 * this is where lint/hint errors get placed to
		 */
		var hintErrors = {};
		
		/**
		 * this holds all packer related paths and options
		 */
		var typeSettings = {
			winPath: '',
			maclinPath: '',
			compressorPath: '',
			argumentsExtra: '',
			execMissing: ''
		};

		/**
		 * this function loads the devloader template and substitutes variables, so they fit according to the package
		 * 
		 * @param {String} packageName holds the name of the package, where the devloader should be applied to
		 * 
		 * @returns {Object}<br>
		 * <code><strong>ok: </strong>{Boolean} if loading and substitution was successful</code><br>
		 * <code><strong>content: </strong>{Sting|undefined} if successful, content is the evaluated template</code>
		 */
		function getDevLoader(packageName) {
			var result = filemanager.readContent('app:/templates/packer/included_loader.js');
			var content;
			if(result.ok) {
				content = result.content;
				var packageList = JSON.stringify(cfg.packageList, function (key, value) {
					if (typeof value === 'number' && !isFinite(value)) {
						return String(value);
					}
					return value;
				});
				
				content = content.replace(/__firstScript__/g, packageName);
				content = content.replace('"__devloaderPackageInfo__"', packageList);
				
				return {
					ok: true, 
					content: content
				};
			}
			return {
				ok: false,
				content: content
			};
		}

		/**
		 * this function loads the smallDevLoader template and substitutes variables, so they fit according to the package
		 * 
		 * @param {String} packageName holds the name of the package, where the smallDevLoader should be applied to
		 * 
		 * @returns {Object}<br>
		 * <code><strong>ok: </strong>{Boolean} if loading and substitution was successful</code><br>
		 * <code><strong>content: </strong>{Sting|undefined} if successful, content is the evaluated template</code>
		 */
		function getSmallLoader(packageName) {
			var result = filemanager.readContent('app:/templates/packer/included_smallloader.js');
			var content;
			if(result.ok) {
				content = result.content;
				content = content.replace(/__curScript__/g, packageName);
				return {
					ok: true,
					content: content
				};
			}
			return {
				ok: false,
				content: content
			};
		}
		
		/**
		 * here packed Content prepended by a devloader and written to the filesystem
		 * 
		 * @param {String} packageName the name of the package (is actually the name of the file too)
		 * @param {Number} packageIndex the index of the package, so we can decide whether to load the 
		 * devloader or the smallDevLoader
		 * @param {String} packedScript the content of the packed script the packer has produced
		 * 
		 */
		function createPackage(packageName, packageIndex, packedScript) {
			// closure does not write anything to std-out if an error occurs
			if(packedScript.length) {
				var packageContent = '',
					packagePath = '',
					result
				;
				if (!packageIndex) {
					result = getDevLoader(packageName);
					if(result.ok) {
						packageContent += result.content;
					} else {
						gotErrors = true;
						boxes.hideWaiting();
						boxes.showError(_('boxes.header.error'), _('boxes.packager.error.devLoaderMissing'));
						return;
					}
					
				} else if (cfg.includeSmallLoader.indexOf(packageName) !== -1) {
					result = getSmallLoader(packageName);
					if(result.ok) {
						packageContent += result.content;
					} else {
						gotErrors = true;
						boxes.hideWaiting();
						boxes.showError(_('boxes.header.error'), _('boxes.packager.error.smallLoaderMissing'));
						return;
					}
				}
				packageContent += ';if(!window.jspackager || !jspackager.devmode) {'+ packedScript;
				for(var j = 0, len = cfg.packageList[packageName].length; j < len; j++) {
					var file = cfg.packageList[packageName][j];
					if($.inArray(file, cfg.nopack)+1) {
						file = path.resolvePath(file+'.js');
						var ret = filemanager.readContent(file);
						if(ret.ok) {
							packageContent += ';' + ret.content;
						}
					}
				}
				packageContent += '}';
				if(!filemanager.writeContent(path.url + '/' + packageName + '.js', packageContent).ok) {
					gotErrors = true;
					boxes.hideWaiting();
					boxes.showError(_('boxes.header.error'), _('boxes.packager.error.packageWriteFail', packageName));
					return;
				}
			} else {
				gotErrors = true;
				boxes.hideWaiting();
				boxes.showError(_('boxes.header.error'), _('boxes.packager.error.packerFail'), function(ok) {
					if(ok) {
						var i = errors.length;
						while(i--) {
							if(errors[i].name === packageName) {
								break;
							}
						}
						editor.open(errors[i].str);
					}
				});
			}
			
			if(packageIndex === listLength-1 && !gotErrors) {
				boxes.hideWaiting();
				boxes.showDialog({
					title: _('boxes.header.success'), 
					message: _('boxes.packager.success.packed', cfg.name), 
					type: 'success'
				});
			}
		}
		
		/**
		 * an eventHandler that fills the errors-Array with errors that 
		 * have been printed by the packager to stderr
		 * 
		 * @param {String} packageName the name of the package, that created the error
		 * @param {String} errorString the string that was printed to stderr
		 */
		function createErrorFile(packageName, errorString) {
			errors.push({name: packageName, str: errorString});
		}
		
		/**
		 * createPackages is the function called by pack, if all pre-pack tasks ran 
		 * successfully 
		 */
		function createPackages() {
			boxes.showDialog({
				title: _('boxes.header.waiting'), 
				message: _('boxes.packager.waiting.packed'), 
				type: 'waiting', 
				yestext: null,
				extra: 'waiting'
			});
			
			var list = cfg.packageList,
			    jspackage,
			    i = 0
			;
			
			for (jspackage in list) {
				if (list.hasOwnProperty(jspackage)) {
					compress(jspackage, i);
					i += 1;
				}
			}
		}
		
		/**
		 * compress calls the closure compiler on a per-package basis<br/>
		 * passes all the files as arguments, prints to stdout and stderr, 
		 * so the eventListener pass the output to the corresponding funcions
		 * 
		 * @param {String} packageName the name of the package to compress
		 * @param {Number} packageIndex the index the package has in the list
		 */
		function compress(packageName, packageIndex) {
			var	files                          =	cfg.packageList[packageName],
				process                        =	new air.NativeProcess(),
				nativeProcessStartupInfo       =	new air.NativeProcessStartupInfo(),
				processArgs                    =	new air.Vector["<String>"](),
				pathToExe,
				pathToCompressor               =	new air.File(typeSettings.compressorPath),
				errorBytes                     =	new air.ByteArray(),
				outputBytes                    =	new air.ByteArray(),
				i                              =	0
			;
			if(!pathToCompressor.exists) {
				boxes.hideWaiting();
				boxes.showError(_('boxes.header.error'), _('boxes.packager.error.compressorMissing'));
				return;
			}
			if(air.Capabilities.os.indexOf('Linux') !== -1 || air.Capabilities.os.indexOf('Mac') !== -1) {
				pathToExe = new air.File(typeSettings.maclinPath);
			} else {
				pathToExe = new air.File(typeSettings.winPath);
			}
			if(!pathToExe.exists) {
				boxes.hideWaiting();
				boxes.showError(_('boxes.header.error'), _('boxes.packager.error.exeMissing', pathToExe.nativePath));
				return;
			}
			if(typeSettings.initialArg) {
				processArgs.push(typeSettings.initialArg);
			}
			processArgs.push(pathToCompressor.nativePath);
			for (i, len = files.length; i < len; i = i + 1) {
				if($.inArray(files[i], cfg.nopack)+1) {
					continue;
				}
				processArgs.push(typeSettings.argumentsExtra);
				processArgs.push(path.nativePath + air.File.separator + files[i] + '.js');
			}
			
			nativeProcessStartupInfo['arguments'] = processArgs;
			nativeProcessStartupInfo.executable = pathToExe;
			
			function onStandardOutputData(ev) {
				if (process.running) {
					outputBytes.writeUTFBytes(process.standardOutput.readUTFBytes(process.standardOutput.bytesAvailable));
				}
			}
			
			function onStandardOutputClose(ev) {
				createPackage(packageName, packageIndex, outputBytes);
			}
			
			function onStandardErrorData(ev) {
				if (process.running) {
					errorBytes.writeUTFBytes(process.standardError.readUTFBytes(process.standardError.bytesAvailable));
				}
			}
			
			function onStandardErrorClose(ev) {
				createErrorFile(packageName, errorBytes);
			}
			
			process.addEventListener(air.ProgressEvent.STANDARD_OUTPUT_DATA, onStandardOutputData);
			process.addEventListener(air.Event.STANDARD_OUTPUT_CLOSE, onStandardOutputClose);
			process.addEventListener(air.ProgressEvent.STANDARD_ERROR_DATA, onStandardErrorData);
			process.addEventListener(air.Event.STANDARD_ERROR_CLOSE, onStandardErrorClose);
			
			try {
				process.start(nativeProcessStartupInfo);
			} catch(e) {
				boxes.hideWaiting();
				boxes.showError(_('boxes.header.error'), _('boxes.packager.error.nativeProcessUnavailable'));
			}
		}
		
		/**
		 * @scope closure
		 */
		return {
			/**
			 * does some pre-pack checks and calls createPackages if successful<br/>
			 * tests are: <br/>- check if there are actually packages in the project<br/>
			 *            - check if there are empty packages<br/>
			 *            - when lint is enabled, if there are lint errors
			 * 
			 * @param {Oject} config the current config of the project
			 * @param {String} packagePath the path to the config, so we now, where we are
			 * 
			 * @returns {Object}<br>
			 * <code><strong>ok: </strong>{Boolean} if tests passed and createPackages was called</code><br/>
			 * <code><strong>status: </strong>{Number} all cool(-1), no packages(0), at least one empty package(1)</code>
			 */
			pack: function(config, packagePath, invoke) {
				// do some sanity checks
				cfg = config;
				path = packagePath.parent;
				var list = cfg.packageList,
				    jspackage,
				    emptyPacks = [],
				    ret
				;
	
				gotErrors = false;
				errors = [];
				
				listLength = HelperJS.keys(list).length;
				for(var name in list) {
					if(!list[name].length) {
						emptyPacks.push(name);
					}
				}
				
				if (!listLength) {
					return {
						ok: false,
						status: 0
					};
				}
				if(emptyPacks.length) {
					return {
						ok: false,
						status: 1
					};
				}
				if(globalConfig.config.lint) {
					boxes.showDialog({
						title: _('boxes.header.waiting'),
						message: _('boxes.validator.waiting.validate'),
						type: 'waiting',
						yestext: null,
						extra: 'waiting'
					});
					var output = '';
					var pkgCount = 0;
					var errorCount = 0;
					var found = false;
					var prop;
					var hintErrors = {};
					var i, len;
					for(prop in list) {
						if(list.hasOwnProperty(prop)) {
							var files = list[prop];
							len = files.length;
							for(i = 0; i < len; i++) {
								if(cfg.nolint.indexOf(files[i]) !== -1 || 
										cfg.nolint.indexOf(files[i].substring(files[i].indexOf('/')+1, files[i].length)) !== -1 ||
										files[i].indexOf('fb-modules') === 0 ||
										files[i].indexOf('fb-snippets') === 0 ||
										files[i].indexOf('libs') === 0) { 
									continue; 
								}
								
								
								ret = filemanager.readContent(path.url+'/'+files[i]+'.js');
								if(ret.ok) {
									if(!JSHINT(ret.content, lintConfig.config)) {
										hintErrors[files[i]] = JSHINT.errors;
									}
								}
							}
						}
					}
					for(prop in hintErrors) {
						if(hintErrors.hasOwnProperty(prop)) {
							len = hintErrors[prop].length;
							for(i = 0; i < len; i++) {
								if(hintErrors[prop][i]) {
									found = true;
									errorCount++;
								}
							}
							if(found) {
								pkgCount++;
							}
						}
					}
					if(errorCount !== 0) {
						output = _('boxes.packager.info.validatorResult', errorCount, pkgCount);
					}
					boxes.hideWaiting();
					if(output === '') {
						if(invoke) {
							window.setTimeout(createPackages, 10)
						} else {
							createPackages();
						}
						return {
							ok: true,
							status: -1
						};
					}
					boxes.showDialog({
						title: _('boxes.header.info'),
						message: _('boxes.packager.info.validator', output+'<br/>'),
						yestext: _('boxes.buttons.yestext.normal'),
						notext: _('boxes.buttons.notext.moreInfo'),
						noTray: invoke,
						invoke: invoke,
						cb: function(ok) {
							var props;
							if(ok) {
								createPackages();
							} else {
								output = '';
								for(props in hintErrors) {
									if(hintErrors.hasOwnProperty(props)) {
										output += props+':\n';
										len = hintErrors[props].length;
										for(i = 0; i < len; i++) {
											if(hintErrors[props][i]) {
												output += '\tRow ' + hintErrors[props][i].line + ': ' + hintErrors[props][i].reason + '\n';
												output += hintErrors[props][i].evidence + '\n';
											}
										}
									}
								}
								editor.open(output, null, '', 'Ok');
							}
						}
					});
				} else {
					if(invoke) {
						window.setTimeout(createPackages, 10)
					} else {
						createPackages();
					}
				}
				return {
					ok: true,
					status: -1
				};
			},
			setOptions: function(args) {
				typeSettings = args;
			}
		};
	}();
}(jQuery));