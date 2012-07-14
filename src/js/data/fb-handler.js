(function($) {
	if(typeof packer === "undefined") { packer = {}; }
	/**
	 * @author Philipp Paul <bobbor.pap@googlemail.com>
	 * 
	 * @since 30.10.2011
	 * 
	 * @function
	 * @namespace takes control of handling the users lib
	 * meaning copying all the files and parsing modules.json
	 * as well as package.json
	 */
	libhandler = function() {
		
		/**
		 * reference to lang
		 * 
		 * @see lang-getText
		 */
		var _ = lang.getText;
		
		/**
		 * the path to the library folder
		 */
		var basePath = '';
		
		/**
		 * the path to the package
		 */
		var packagePath = '';
		
		/**
		 * a reference to the overlay where you choose
		 * which packages to copy
		 */
		var layer;
		
		/**
		 * holding the parsed module.json
		 */
		var moduleConfig = {};
		
		/**
		 * holding the parsed package.json
		 */
		var packageConfig = {};
		
		/**
		 * holds in which pack the files should be set
		 */
		var currentPack;
		
		/**
		 * hold the currentURL to the project
		 */
		var currentURL;
		
		/**
		 * @ignore
		 * documented in return
		 */
		function setBasePath(path) {
			if(path) {
				basePath = filemanager.getFile(path);
			}
		}
		
		/**
		 * basePath getter
		 * 
		 * @see basePath
		 * 
		 * @return {air.File} the basePath
		 */
		function getBasePath() {
			return basePath;
		}
		
		/**
		 * @ignore
		 * documented in return
		 */
		function getModules() {
			var ret;
			if(basePath !== '') {
				ret = filemanager.readContent(basePath.url+'/modules.json');
				if(ret.ok) {
					ret = filemanager.parse(ret.content);
					if(ret.ok) {
						moduleConfig = ret.config;
						return {
							ok: true,
							message: -1
						};
					}
					return {
						ok: false,
						message: 2
					};
				}
				return {
					ok: false,
					message: 1
				};
			}
			return {
				ok: false,
				message: 0
			};
		}
		
		/**
		 * copies the files defined in package.json from the
		 * library in the project
		 */
		function copyFiles() {
			var i = 0;
			var files = [];
			var fileName;
			var srcFile, targetFile;
			var goalDir;
			var goalName;
			var pkgcfg = configfile.getConfig();
			var ret;
			
			function copyError(e) {
				e.target.removeEventListener('ioError', copyError);
				boxes.showError(_('boxes.header.error'), _('boxes.lib.error.copy', e.target.nativePath));
			}
			
			$('#deps dd').each(function(idx, elm) {
				files.push($(elm).attr('data-relPath'));
			});
			$('#opts input').each(function(idx, elm) {
				if(elm.checked) {
					files.push(elm.value);
				}
			});
			files.push(basePath.getRelativePath(packagePath)+'/'+packageConfig.main);
			outerloop:
			for(i; i < files.length; i++) {
				fileName = files[i];
				if(fileName.indexOf('libs/') === 0) {
					goalName = 'libs/';
				} else if(fileName.indexOf('snippets/') === 0) {
					goalName = 'fb-snippets/';
				} else {
					goalName = 'fb-modules/';
				}
				goalDir = filemanager.getFile(currentURL.url + '/' + goalName);
				srcFile = filemanager.getFile(basePath.url + '/' + fileName);
				fileName = fileName.substring(fileName.lastIndexOf('/') + 1, fileName.length);
				targetFile = filemanager.getFile(goalDir.url + '/' + fileName);
				if(!goalDir.exists) {
					goalDir.createDirectory();
				}
				if(!globalConfig.config.suppressExisting) {
					boxes.showDialog({
						title: _('boxes.header.warning'),
						message: _('boxes.lib.warning.keepExisting', goalName + fileName)
					});
					continue outerloop;
				}
				try {
					srcFile.addEventListener('ioError', copyError);
					srcFile.copyToAsync(targetFile, true);
				} catch (ex) {
					boxes.showError(_('boxes.header.error'), _('boxes.lib.error.readOnly'));
				}
				
				for(var prop in pkgcfg.packageList) {
					if(pkgcfg.packageList.hasOwnProperty(prop)) {
						for(var j = 0, jlen = pkgcfg.packageList[prop].length; j < jlen; j++) {
							if(pkgcfg.packageList[prop][j]+'.js' === (goalName + fileName)) {
								continue outerloop;
							}
						}
					}
				}
				ret = configfile.addFile(currentPack, goalName + fileName);
				if(ret.ok) {
					details.addFile(currentPack, goalName+fileName);
				} else {
					switch(ret.status) {
					case 0:
						boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.configwrite'));
						break;
					case 1:
						boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.fileExists', fileName));
						break;
					}
				}
			}
		}

		
		/**
		 * get's the files described in the package.json
		 * result gets stored in packageConfig
		 * 
		 * @see packageConfig
		 * 
		 * @returns {Object}<br/>
		 * <code><strong>ok:</strong> {Boolean} if reading and parsing was successful</code><br/>
		 * <code><strong>message:</strong> {Number} all cool(-1), parseerror(2), readerror(1), no packagePath(0)</code>
		 */
		function getFiles(path) {
			var ret;
			var i, len;
			packagePath = path = filemanager.getFile(basePath.url + '/' + path);
			if(basePath !== '') {
				ret = filemanager.readContent(path.url+'/package.json');
				if(ret.ok) {
					ret = filemanager.parse(ret.content);
					if(ret.ok) {
						packageConfig = ret.config;
						return {
							ok: true,
							message: -1
						};
					}
					return {
						ok: false,
						message: 2
					};
				}
				return {
					ok: false,
					message: 1
				};
			}
			return {
				ok: false,
				message: 0
			};
		}
		
		/**
		 * simply renders the list of all modules in the overlay
		 */
		function renderList() {
			var list = $('#module-list', layer);
			var html = '';
			moduleConfig.forEach(function(elm) {
				html += '<li><a href="'+elm.path+'">'+elm.name+'</a></li>';
			});
			list.html(html);
		}
		
		/**
		 * simply renders the details of a package in the overlay
		 */
		function renderDetails() {
			var prop, i, len, html;
			$('#module-name', layer).html(packageConfig.name);
			$('#module-version', layer).html(packageConfig.version);
			$('#module-description', layer).html(packageConfig.description);
			$('#module-author', layer).html(packageConfig.author);
			if(packageConfig.contributors.length) {
				html = '<dt>'+_('libLayer.contributors')+'</dt>';
				len = packageConfig.contributors.length;
				for(i = 0; i < len; i++) {
					html += '<dd>'+packageConfig.contributors[i]+'</dd>';
				}
				$('#module-contributor', layer).html(html);
			}
			html = '';
			for(prop in packageConfig.dependencies) {
				if(packageConfig.dependencies.hasOwnProperty(prop)) {
					html += '<dl><dt>'+prop+'</dt>';
					len = packageConfig.dependencies[prop].length;
					for(i = 0; i < len; i++) {
						html += '<dd data-relPath="'+prop+'/'+packageConfig.dependencies[prop][i]+'">'+packageConfig.dependencies[prop][i]+'</dd>';
					}
					html += '</dl>';
				}
			}
			if(html) {
				$('#deps',  layer).html(html);
				$('#dep-header', layer).show();
			} else {
				$('#deps',  layer).html('');
				$('#dep-header', layer).hide();
			}
			
			html = '';
			for(prop in packageConfig.optDeps) {
				if(packageConfig.optDeps.hasOwnProperty(prop)) {
					html += '<dl><dt>'+prop+'</dt>';
					len = packageConfig.optDeps[prop].length;
					for(i = 0; i < len; i++) {
						html += '<dd><label><input type="checkbox" name="'+packageConfig.optDeps[prop][i]+'" value="'+prop+'/'+packageConfig.optDeps[prop][i]+'"/>'+
								packageConfig.optDeps[prop][i]+'</label></dd>';
					}
					html += '</dl>';
				}
			}
			if(html) {
				$('#opts',  layer).html(html);
				$('#opt-header', layer).show();
			} else {
				$('#opts',  layer).html('');
				$('#opt-header', layer).hide();
			}
			$('div.module-details', layer).removeClass('empty');
		}
		
		/**
		 * @ignore
		 * documented in return
		 */
		function update() {
			basePath = filemanager.getFile(globalConfig.config.kit_path);
			ret = getModules();
			if(ret.ok) {
				renderList();
			} else {
				switch(ret.message) {
				case 0:
					boxes.showError(_('boxes.header.error'), _('boxes.lib.error.pathMissing'));
					break;
				case 1:
					boxes.showError(_('boxes.header.error'), _('boxes.lib.error.modulesMissing'));
					break;
				case 2: 
					boxes.showError(_('boxes.header.error'), _('boxes.lib.error.modulesParse'));
					break;
				}
			}
		}
		
		return {
			/**
			 * initializes all.
			 * 
			 * and binds events to read package.json 
			 * and to copy-files
			 * 
			 * calls update
			 * @see #update
			 * 
			 */
			init: function() {
				var ret;
				layer = $('#lib-layer');
				if(globalConfig.config.kit_path) {
					update();
				}
				
				$('#module-list').delegate('a', 'click', function(e) {
					$(e.liveFired).find('a.on').removeClass('on');
					$(e.target).addClass('on');
					ret = getFiles(e.target.getAttribute('href'));
					if(ret.ok) {
						renderDetails();
					} else {
						switch(ret.message) {
						case 0:
							boxes.showError(_('boxes.header.error'), _('boxes.lib.error.pathMissing'));
							break;
						case 1:
							boxes.showError(_('boxes.header.error'), _('boxes.lib.error.packageMissing'));
							break;
						case 2:
							boxes.showError(_('boxes.header.error'), _('boxes.lib.error.packageParse'));
							break;
						}
					}
				});
				
				layer.delegate('a.finish', 'click', function(e) {
					$(e.liveFired).find('a.on').removeClass('on');
					$('#module-contributor').html('');
					$('div.module-details', layer).addClass('empty');
					layer.addClass('hidden');
				});
				layer.delegate('button.ok', 'click', function(e) {
					$(e.liveFired).find('a.on').removeClass('on');
					$('#module-contributor').html('');
					$('div.module-details', layer).addClass('empty');
					layer.addClass('hidden');
					copyFiles();
				});
			},

			/**
			 * simply reads the modules.json 
			 * and rendes if successful
			 * 
			 * otherwise prompts the user
			 * 
			 * @see libhandler-getModules
			 * @see libhandler-renderList
			 */
			update: update,
			
			/**
			 * basePath setter
			 * 
			 * @see basePath
			 * 
			 * @param {String} path new basePath
			 */
			setBasePath: setBasePath,
			
			/**
			 * get's the modules described in the modules.json
			 * result gets stored in moduleConfig
			 * 
			 * @see moduleConfig
			 * 
			 * @returns {Object}<br/>
			 * <code><strong>ok:</strong> {Boolean} if reading and parsing was successful</code><br/>
			 * <code><strong>message:</strong> {Number} all cool(-1), parseerror(2), readerror(1), no basePath(0)</code>
			 */
			getModules: getModules,
			
			/**
			 * sets the basics for copyFiles
			 * <b>MUST</b> be called before copyFiles
			 * so the project/pack fits
			 * @param {String} pack the name of the package to add to
			 * @param {String} url the url of the project
			 */
			setBasics: function(pack, url) {
				currentPack = pack;
				currentURL = filemanager.getFile(url).parent;
			}
		};
	}();
	
}(jQuery));
