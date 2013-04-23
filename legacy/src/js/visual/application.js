/**
 * @author Philipp Paul
 * @version 0.1
 */
(function($) {
	if(typeof packer === "undefined") { 
		/**
		 * holds all the variables required by the "Packager"
		 */
		packer = {}; 
	}
	packer.application = function() {
		var _ = packer.lang.getText;
		
		
		
		function addProject(name, path, starterkit) {
			if(starterkit) {
				copyStarterKit(name, path);
			}
			
			var ret = packer.savefile.addItem({
				url: path,
				name: name
			});
			if(ret.ok) {
				ret = packer.configfile.changeConfigFile(path, name);
				if(ret.ok) {
					packer.list.fillProjectList();
				}
			} else {
				switch(ret.status) {
				case 1:
					packer.boxes.showError(_('boxes.header.error'), _('boxes.application.error.wrongArguments'));
					break;
				case 2:
					packer.boxes.showError(_('boxes.header.info'), _('boxes.savefile.info.projectExists'));
					break;
				case 4:
					packer.boxes.showError(_('boxes.header.error'), _('boxes.savefile.error.projectWrite'));
					break;
				}
			}
		}
		
		function copyStarterKit(name, path) {
			packer.boxes.showDialog({
				title: _('boxes.header.waiting'), 
				message: _('boxes.application.waiting.libraryCopy'), 
				type: 'waiting', 
				yestext: null,
				extra: 'waiting'
			});
			var destDir = new air.File(path).parent;
			var srcDir = new air.File(packer.globalConfig.config.kit_path + air.File.separator + '_starter-kit');
			var dirs = 1;
			var files = 0;
			
			if(!srcDir.exists) {
				packer.boxes.hideWaiting();
				packer.boxes.showDialog({
					title: _('boxes.header.error'), 
					message: _('boxes.application.error.libraryCopy', srcDir.nativePath), 
					type: 'error'
				});
				return;
			}
			function copyAsyncComplete(e) {
				e.target.removeEventListener('complete', copyAsyncComplete);
				files--;
				if(dirs === 0 && files === 0) {
					packer.boxes.hideWaiting();
					packer.boxes.showDialog({
						title: _('boxes.header.success'), 
						message: _('boxes.application.success.libraryCopy'), 
						type: 'success'
					});
					ret = packer.configfile.changeConfigFile(path);
					if(ret.ok) {
						ret = packer.configfile.readConfig();
						if(ret.ok) {
							packer.configfile.setOption('name', name);
						}
					}
				}
			}
			
			function directoryListener(e) {
				dirs--;
				e.target.removeEventListener('directoryListing', directoryListener);
				var elms = e.files;
				var file;
				var dir;
				var destFile;
				for(var i = 0, len = elms.length; i < len; i++) {
					file = elms[i];
					if(file.name === '.svn') { continue; }
					if(file.isDirectory) {
						dir = srcDir.getRelativePath(file);
						destDir.resolvePath(dir).createDirectory();
						dirs++;
						file.addEventListener('directoryListing', directoryListener);
						file.getDirectoryListingAsync();
					} else {
						files++;
						dir = srcDir.getRelativePath(file);
						destFile = destDir.resolvePath(dir);
						file.copyToAsync(destFile, true);
						file.addEventListener('complete', copyAsyncComplete);
					}
				}
			}
			srcDir.addEventListener('directoryListing', directoryListener);
			srcDir.getDirectoryListingAsync();
		}
		
		
		function addPackage(name) {
			var ret = packer.configfile.addPackage(name);
			if(ret.ok) {
				packer.details.addPackage(name, ret.url.url);
			} else {
				switch(ret.message) {
				case 0:
					packer.boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.packageListMissing'));
					break;
				case 1:
					packer.boxes.showError(_('boxes.header.info'), _('boxes.configfile.info.packageExists', name));
					break;
				case 2:
					packer.boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.configwrite'));
					break;
				}
			}
		}
		
		return {
			init: function() {
				var _ = packer.lang.getText;

				packer.globalConfig.init();
				
				packer.lang.setLang(packer.globalConfig.config.language || 'en_US', function() {
					$("#lastPackedProjects").text(_('list.lastPackedProjects'));
					$('#newProjectButton').text(_('list.newProject'));
					$('#projectDetails button.lint').text(_('details.button.jsHint'));
					$('#projectDetails button.pack').text(_('details.button.pack'));
					$('#editor-wrapper button.yes').text(_('editor.yesText'));
					$('#editor-wrapper button.no').text(_('editor.noText'));
					$('#dep-header span').text(_('libLayer.deps'));
					$('#opt-header span').text(_('libLayer.optDeps'));
					$('#lib-layer button.ok').text(_('libLayer.add'));
					$('#lib-layer a.finish').text(_('libLayer.quit'));
					$('#lib-layer dt.author').text(_('libLayer.author'));
				});
				var ret = packer.savefile.readProjects();
				
				packer.lintConfig.init();
				packer.list.init();
				packer.tooltip.init();
				packer.changelog.init();
				packer.updater.init();
				
				if(ret.ok) {
					packer.traydock.init(ret.list);
				}
				packer.windowmenu.init();
				air.NativeApplication.nativeApplication.addEventListener('invoke', function(e) {
					if(e['arguments'] && e['arguments'].length === 1) {
						var file = new air.File(e['arguments'][0]);
						var result = packer.configfile.changeConfigFile(file.url);
						if(result.ok) {
							var res = packer.configfile.readConfig();
							if(res.ok) {
								packer.savefile.addItem({
									name: res.config.name,
									url: file.url,
									quiet: true
								});
								packer.savefile.addMostRecent(file.url);
								packer.list.fillProjectList();
								packer.packer.pack(res.config, file, true);
							} else {
								packer.boxes.showDialog({
									title: _('boxes.header.error'), 
									message: _('boxes.configfile.error.configparse'), 
									type: 'error', 
									yestext: _('boxes.buttons.yestext.edit'), 
									notext: _('boxes.buttons.notext.cancel'),
									noTray: true,
									invoke: true,
									cb: function(ok) {
										if(ok) {
											ret = packer.filemanager.readContent(file.url);
											if(ret.ok) {
												packer.editor.openJSON(ret.content, function(data) {
													if(data.ok) {
														ret = packer.filemanager.parse(data.json);
														if(ret.ok) {
															packer.configfile.createConfig(ret.config);
															if(packer.configfile.writeConfig()) {
																packer.boxes.showDialog({
																	title: _('boxes.header.success'), 
																	message: _('boxes.configfile.success.configwrite'), 
																	type: 'success'
																});
															} else {
																packer.boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.configwrite'));
															}
														}
													}
												});
											} else {
												packer.boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.configread'));
											}
										}
									}
								});
							}
						}
					}
					packer.initialWindow.visible = true;
					if(packer.initialWindow.displayState === 'minimized') {
						packer.initialWindow.restore();
					}
					packer.initialWindow.alwaysInFront = true;
					packer.initialWindow.alwaysInFront = false;
					window.setTimeout(function() {
						air.NativeApplication.nativeApplication.activate();
						packer.initialWindow.activate();
					}, 10);
				});
			},
			delayed: function() {
				packer.packer.setOptions(packer[packer.globalConfig.config.packer].getSettings());
				packer.details.init();
				packer.editor.init();
				packer.updater.checkForUpdates();
				packer.libhandler.init();
			},
			addProject: addProject,
			addPackage: addPackage,
			
			restart: function() {
				var na = air.NativeApplication.nativeApplication;
				var pm = window.runtime.adobe.utils.ProductManager;
				var mgr = new pm("airappinstaller");
				
				mgr.launch("-launch " + na.applicationID + " " + na.publisherID);
				na.exit();
			}
		};
	}();
}(jQuery));
