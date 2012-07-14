/**
 * @author Philipp Paul
 * @version 0.1
 */
(function($, window, undefined) {
	"use strict";
	
	var document = window.document;
	var app;
	
	/* nice little singleton pattern */
	function Application() {
		if(app) {
			return app;
		}
		
		app = this;
		app.text = new Lang();
		
		return inst;
	}
	
	Application.prototype = {
			
	};
	
	application = function() {
		
		function addProject(name, path, starterkit) {
			if(starterkit) {
				copyStarterKit(name, path);
			}
			
			var ret = savefile.addItem({
				url: path,
				name: name
			});
			if(ret.ok) {
				ret = configfile.changeConfigFile(path, name);
				if(ret.ok) {
					list.fillProjectList();
				}
			} else {
				switch(ret.status) {
				case 1:
					boxes.showError(_('boxes.header.error'), _('boxes.application.error.wrongArguments'));
					break;
				case 2:
					boxes.showError(_('boxes.header.info'), _('boxes.savefile.info.projectExists'));
					break;
				case 4:
					boxes.showError(_('boxes.header.error'), _('boxes.savefile.error.projectWrite'));
					break;
				}
			}
		}
		
		
		function copyStarterKit(name, path) {
			boxes.showDialog({
				title: _('boxes.header.waiting'), 
				message: _('boxes.application.waiting.libraryCopy'), 
				type: 'waiting', 
				yestext: null,
				extra: 'waiting'
			});
			var destDir = new air.File(path).parent;
			var srcDir = new air.File(globalConfig.config.kit_path + air.File.separator + '_starter-kit');
			var dirs = 1;
			var files = 0;
			
			if(!srcDir.exists) {
				boxes.hideWaiting();
				boxes.showDialog({
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
					boxes.hideWaiting();
					boxes.showDialog({
						title: _('boxes.header.success'), 
						message: _('boxes.application.success.libraryCopy'), 
						type: 'success'
					});
					ret = configfile.changeConfigFile(path);
					if(ret.ok) {
						ret = configfile.readConfig();
						if(ret.ok) {
							configfile.setOption('name', name);
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
			var ret = configfile.addPackage(name);
			if(ret.ok) {
				details.addPackage(name, ret.url.url);
			} else {
				switch(ret.message) {
				case 0:
					boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.packageListMissing'));
					break;
				case 1:
					boxes.showError(_('boxes.header.info'), _('boxes.configfile.info.packageExists', name));
					break;
				case 2:
					boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.configwrite'));
					break;
				}
			}
		}
		
		return {
			
			init: function() {
				var _ = lang.getText;

				globalConfig.init();
				
				lang.setLang(globalConfig.config.language || 'en_US', function() {
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
				
				var ret = savefile.readProjects();
				lintConfig.init();
				list.init();
				tooltip.init();
				changelog.init();
				updater.init();
				
				if(ret.ok) {
					traydock.init(ret.list);
				}
				
				windowmenu.init();
				
				air.NativeApplication.nativeApplication.addEventListener('invoke', function(e) {
					if(e['arguments'] && e['arguments'].length === 1) {
						var file = new air.File(e['arguments'][0]);
						var result = configfile.changeConfigFile(file.url);
						if(result.ok) {
							var res = configfile.readConfig();
							if(res.ok) {
								savefile.addItem({
									name: res.config.name,
									url: file.url,
									quiet: true
								});
								savefile.addMostRecent(file.url);
								list.fillProjectList();
								packager.pack(res.config, file, true);
							} else {
								boxes.showDialog({
									title: _('boxes.header.error'), 
									message: _('boxes.configfile.error.configparse'), 
									type: 'error', 
									yestext: _('boxes.buttons.yestext.edit'), 
									notext: _('boxes.buttons.notext.cancel'),
									noTray: true,
									invoke: true,
									cb: function(ok) {
										if(ok) {
											ret = filemanager.readContent(file.url);
											if(ret.ok) {
												editor.openJSON(ret.content, function(data) {
													if(data.ok) {
														ret = filemanager.parse(data.json);
														if(ret.ok) {
															configfile.createConfig(ret.config);
															if(configfile.writeConfig()) {
																boxes.showDialog({
																	title: _('boxes.header.success'), 
																	message: _('boxes.configfile.success.configwrite'), 
																	type: 'success'
																});
															} else {
																boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.configwrite'));
															}
														}
													}
												});
											} else {
												boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.configread'));
											}
										}
									}
								});
							}
						}
					}
					initialWindow.visible = true;
					if(initialWindow.displayState === 'minimized') {
						initialWindow.restore();
					}
					initialWindow.alwaysInFront = true;
					initialWindow.alwaysInFront = false;
					window.setTimeout(function() {
						air.NativeApplication.nativeApplication.activate();
						initialWindow.activate();
					}, 10);
				});
			},
			
			delayed: function() {
				packager.setOptions(window[globalConfig.config.packer].getSettings());
				details.init();
				editor.init();
				updater.checkForUpdates();
				libhandler.init();
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
}(jQuery, window));
