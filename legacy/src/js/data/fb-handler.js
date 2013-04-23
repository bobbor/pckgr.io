/**
 * 
 */
(function($) {
	if(typeof packer === "undefined") { packer = {}; }
	
	packer.libhandler = function() {
		var _ = packer.lang.getText;
		
		var basePath = '';
		var packagePath = '';
		var layer;
		
		var moduleConfig = {};
		var packageConfig = {};
		var currentPack;
		var currentURL;
		
		function setBasePath(path) {
			if(path) {
				basePath = packer.filemanager.getFile(path);
			}
		}
		
		function getBasePath() {
			return basePath;
		}
		
		function getModules() {
			var ret;
			if(basePath !== '') {
				ret = packer.filemanager.readContent(basePath.url+'/modules.json');
				if(ret.ok) {
					ret = packer.filemanager.parse(ret.content);
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
		
		function copyFiles() {
			var i = 0;
			var files = [];
			var fileName;
			var srcFile, targetFile;
			var goalDir;
			var goalName;
			var pkgcfg = packer.configfile.getConfig();
			var ret;
			
			function copyError(e) {
				e.target.removeEventListener('ioError', copyError);
				packer.boxes.showError(_('boxes.header.error'), _('boxes.lib.error.copy', e.target.nativePath));
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
				goalDir = packer.filemanager.getFile(currentURL.url + '/' + goalName);
				srcFile = packer.filemanager.getFile(basePath.url + '/' + fileName);
				fileName = fileName.substring(fileName.lastIndexOf('/') + 1, fileName.length);
				targetFile = packer.filemanager.getFile(goalDir.url + '/' + fileName);
				if(!goalDir.exists) {
					goalDir.createDirectory();
				}
				if(!packer.globalConfig.config.suppressExisting) {
					packer.boxes.showDialog({
						title: _('boxes.header.warning'),
						message: _('boxes.lib.warning.keepExisting', goalName + fileName)
					});
					continue outerloop;
				}
				try {
					srcFile.addEventListener('ioError', copyError);
					srcFile.copyToAsync(targetFile, true);
				} catch (ex) {
					packer.boxes.showError(_('boxes.header.error'), _('boxes.lib.error.readOnly'));
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
				ret = packer.configfile.addFile(currentPack, goalName + fileName);
				if(ret.ok) {
					packer.details.addFile(currentPack, goalName+fileName);
				} else {
					switch(ret.status) {
					case 0:
						packer.boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.configwrite'));
						break;
					case 1:
						packer.boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.fileExists', fileName));
						break;
					}
				}
			}
		}
		
		function getFiles(path) {
			var ret;
			var i, len;
			packagePath = path = packer.filemanager.getFile(basePath.url + '/' + path);
			if(basePath !== '') {
				ret = packer.filemanager.readContent(path.url+'/package.json');
				if(ret.ok) {
					ret = packer.filemanager.parse(ret.content);
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
		
		function renderList() {
			var list = $('#module-list', layer);
			var html = '';
			moduleConfig.forEach(function(elm) {
				html += '<li><a href="'+elm.path+'">'+elm.name+'</a></li>';
			});
			list.html(html);
		}
		
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

		function update() {
			basePath = packer.filemanager.getFile(packer.globalConfig.config.kit_path);
			ret = getModules();
			if(ret.ok) {
				renderList();
			} else {
				switch(ret.message) {
				case 0:
					packer.boxes.showError(_('boxes.header.error'), _('boxes.lib.error.pathMissing'));
					break;
				case 1:
					packer.boxes.showError(_('boxes.header.error'), _('boxes.lib.error.modulesMissing'));
					break;
				case 2: 
					packer.boxes.showError(_('boxes.header.error'), _('boxes.lib.error.modulesParse'));
					break;
				}
			}
		}
		
		return {
			init: function() {
				var ret;
				layer = $('#lib-layer');
				if(packer.globalConfig.config.kit_path) {
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
							packer.boxes.showError(_('boxes.header.error'), _('boxes.lib.error.pathMissing'));
							break;
						case 1:
							packer.boxes.showError(_('boxes.header.error'), _('boxes.lib.error.packageMissing'));
							break;
						case 2:
							packer.boxes.showError(_('boxes.header.error'), _('boxes.lib.error.packageParse'));
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
			update: update,
			setBasePath: setBasePath,
			getModules: getModules,
			setBasics: function(pack, url) {
				currentPack = pack;
				currentURL = packer.filemanager.getFile(url).parent;
			}
		};
	}();
	
}(jQuery));
