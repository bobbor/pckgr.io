/**
 * 
 */
(function($) {
	if(typeof packer === "undefined") { packer = {}; }
	
	/**
	 * @function
	 * 
	 * @namespace windowmenu
	 */
	windowmenu = function() {
		function createFileMenu(type) {
			var recentItems = [];
			var item;
			var menu = new air.NativeMenu();
			var na = air.NativeApplication;
			
			function quickPack(e) {
				var ret = configfile.changeConfigFile(e.target.data.url);
				if(ret.ok) {
					var res = configfile.readConfig();
					if(res.ok) {
						savefile.addMostRecent(e.target.data.url);
						list.fillProjectList();
						packager.pack(res.config, new air.File(e.target.data.url));
					}
				}
			}
			
			item = menu.addItem(new air.NativeMenuItem(lang.getText('menu.file.new')));
				item.keyEquivalent = 'n';
				item.addEventListener('select', function() {
					boxes.showDialog({
							title: lang.getText('boxes.header.info'),
							message: {
								projMessage: lang.getText('boxes.list.info.addProject.projectName'),
								placeMessage: lang.getText('boxes.list.info.addProject.projectPath')
							},
							notext: lang.getText('boxes.buttons.notext.cancel'),
							extra: 'project'
						})
					;
				});
			
			item = menu.addItem(new air.NativeMenuItem(lang.getText("menu.file.import")));
				item.keyEquivalent = 'i';
				item.addEventListener('select', function(e) {
					var file = air.File.documentsDirectory;
					var jsFilter = new air.FileFilter("Packager ConfigFile", "*.jspackcfg; *.jspackconfig");
					file.addEventListener('select', function(ev) {
						var file = ev.target;
						var result = configfile.changeConfigFile(file.url);
						if(result.ok) {
							var res = configfile.readConfig();
							if(res.ok) {
								application.addProject(res.config.name, file.url);
							} else {
								boxes.showDialog({
									title: lang.getText('boxes.header.error'), 
									message: lang.getText('boxes.configfile.error.configparse'), 
									type: 'error', 
									yestext: lang.getText('boxes.buttons.yestext.edit'), 
									notext: lang.getText('boxes.buttons.notext.cancel'), 
									cb: function(ok) {
										if(ok) {
											ret = filemanager.readContent(url);
											if(ret.ok) {
												editor.openJSON(ret.content, function(data) {
													if(data.ok) {
														ret = filemanager.parse(data.json);
														if(ret.ok) {
															configfile.createConfig(ret.config);
															if(configfile.writeConfig()) {
																boxes.showDialog({
																	title: lang.getText('boxes.header.success'), 
																	message: lang.getText('boxes.configfile.success.configwrite'), 
																	type: 'success'
																});
															} else {
																boxes.showError(lang.getText('boxes.header.error'), lang.getText('boxes.configfile.error.configwrite'));
															}
														}
													}
												});
											} else {
												boxes.showError(lang.getText('boxes.header.error'), lang.getText('boxes.configfile.error.configread'));
											}
										}
									}
								});
							}
						}
					});
					file.browseForOpen("Suche", [jsFilter]);
				});
				
			item = menu.addItem(new air.NativeMenuItem('', true));
			var cfg = savefile.getConfig();
			_(cfg.projects).each(function(elm, idx){
				for(var i = 0, len = cfg.top4.length; i < len; i++) {
					if(elm.url === cfg.top4[i]) {
						item = menu.addItem(new air.NativeMenuItem(lang.getText("menu.file.quickPack", elm.name)));
						item.data = elm;
						item.addEventListener('select', quickPack);
					}
				}
			});
			item = menu.addItem(new air.NativeMenuItem('', true));
			item = menu.addItem(new air.NativeMenuItem(lang.getText("menu.file.quit")));
				item.keyEquivalent = 'q';
				item.addEventListener('select', function(e) {
					for(var i = 0, len = na.nativeApplication.opendWindows; i < len; i++) {
						na.nativeApplication.openedWindows[i].close();
					}
					na.nativeApplication.exit();
				});
			return menu;
		}
		
		
		function createEditMenu(type) {
			var item;
			var importfb;
			var menu = new air.NativeMenu();
			
			function editMenuSelect(e) {
				switch(e.target.data) {
					case 'autostart':
						e.target.checked = !e.target.checked;
						air.NativeApplication.startAtLogin = e.target.checked; 
						globalConfig.toggleOption(e.target.data, e.target.checked);
						break;
					case 'defaultApp':
						e.target.checked = !e.target.checked;
						if(air.NativeApplication.supportsDefaultApplication) {
							var na = air.NativeApplication.nativeApplication;
							na.setAsDefaultApplication('jspackcfg');
							na.setAsDefaultApplication('jspackconfig');

							globalConfig.toggleOption(e.target.data, e.target.checked);
							e.target.enabled = false;
						} else {
							e.target.checked = false;
						}
						break;
					default:
						e.target.checked = !e.target.checked;
						globalConfig.toggleOption(e.target.data, e.target.checked);
						break;
				}
			}
			item = menu.addSubmenu(createLanguageMenu(), lang.getText("menu.options.language.root"));
			menu.addItem(new air.NativeMenuItem('', true));
			item = menu.addItem(new air.NativeMenuItem(lang.getText("menu.options.recent")));
				item.keyEquivalent = 'r';
				item.checked = globalConfig.config.show_recent;
				item.data = 'show_recent';
			item = menu.addItem(new air.NativeMenuItem(lang.getText("menu.options.doubleClick")));
				item.keyEquivalent = 'd';
				item.checked = globalConfig.config.dblpack;
				item.data = 'dblpack';
			menu.addItem(new air.NativeMenuItem('', true));
			item = menu.addItem(new air.NativeMenuItem(lang.getText("menu.options.warnings")));
				item.keyEquivalent = 'w';
				item.checked = globalConfig.config.show_warning;
				item.data = 'show_warning';
			item = menu.addItem(new air.NativeMenuItem(lang.getText("menu.options.tooltips")));
				item.keyEquivalent = 't';
				item.checked = globalConfig.config.tooltip;
				item.data = 'tooltip';
			menu.addItem(new air.NativeMenuItem('', true));
			item = menu.addItem(new air.NativeMenuItem(lang.getText("menu.options.tray")));
				item.keyEquivalent = 'm';
				item.checked = globalConfig.config.min_tray;
				item.data = 'min_tray';
			item = menu.addItem(new air.NativeMenuItem(lang.getText("menu.options.boot")));
				item.keyEquivalent = 'b';
				item.checked = globalConfig.config.autostart;
				item.enabled = false;
				item.data = 'autostart';
			item = menu.addItem(new air.NativeMenuItem(lang.getText("menu.options.defaultApp")));
				item.keyEquivalent = 's';
				item.checked = globalConfig.config.defaultApp;
				if(globalConfig.config.defaultApp) {
					item.enabled = false;
				}
				item.data = 'defaultApp';
			
			for (item = 0; item < menu.items.length; item++){
				menu.items[item].addEventListener(air.Event.SELECT,editMenuSelect);
			}
			return menu;
		}
		
		function createFBMenu() {
			var item;
			var menu = new air.NativeMenu();
			var depItems = [];
			
			item = menu.addItem(new air.NativeMenuItem(lang.getText("menu.library.copy")));
			item.checked = globalConfig.config.use_kit && globalConfig.config.kit_path;
			item.data = 'use_kit';
			item.addEventListener('select', function(e) {
				e.target.checked = !e.target.checked;
				globalConfig.toggleOption(e.target.data, e.target.checked);
				if(e.target.checked && globalConfig.config.kit_path === '') {
					boxes.showDialog({
						title: lang.getText('boxes.header.info'),
						message: lang.getText('boxes.menu.info.libPath'),
						yestext: lang.getText('boxes.buttons.yestext.ok'), 
						notext: lang.getText('boxes.buttons.notext.cancel'),
						extra: 'file',
						cb: function(ok, path) {
							if(ok) {
								globalConfig.toggleOption('kit_path', path);
								libhandler.update();
								for(item = 0; item < depItems.length-1; item++) {
									depItems[item].data = filemanager.getFile(path).nativePath;
								}
								return;
							}
							globalConfig.toggleOption(e.target.data, ok);
							e.target.checked = ok;
							for(item = 0; item < depItems.length; item++) {
								depItems[item].enabled = ok;
							}
						}
					});
				}
				for(item = 0; item < depItems.length; item++) {
					depItems[item].enabled = e.target.checked;
				}
			});
			menu.addItem(new air.NativeMenuItem('', true));
			depItems.push(menu.addItem(new air.NativeMenuItem(lang.getText("menu.library.changePath"))));
				depItems[depItems.length-1].enabled = globalConfig.config.use_kit;
				depItems[depItems.length-1].data = globalConfig.config.kit_path;
				depItems[depItems.length-1].addEventListener('select', function(e) {
					boxes.showDialog({
						title: lang.getText('boxes.header.info'),
						message: lang.getText('boxes.menu.info.libPath'),
						yestext: lang.getText('boxes.buttons.yestext.ok'), 
						notext: lang.getText('boxes.buttons.notext.cancel'),
						extra: 'file',
						cb: function(ok, path) {
							if(ok) {
								globalConfig.toggleOption('kit_path', path);
								for(item = 0; item < depItems.length-1; item++) {
									depItems[item].data = filemanager.getFile(path).nativePath;
								}
							}
						}
					});
				});
			depItems.push(menu.addItem(new air.NativeMenuItem(lang.getText("menu.library.showPath"))));
				depItems[depItems.length-1].enabled = globalConfig.config.use_kit;
				depItems[depItems.length-1].data = globalConfig.config.use_kit ? globalConfig.config.kit_path : undefined;
				depItems[depItems.length-1].addEventListener('select', function(e) {
					boxes.showDialog({
						title: lang.getText('boxes.header.info'),
						message: new air.File(e.target.data).nativePath,
						type: 'info'
					});
				});
			depItems.push(menu.addItem(new air.NativeMenuItem(lang.getText("menu.library.overwrite"))));
				depItems[depItems.length-1].enabled = globalConfig.config.use_kit;
				depItems[depItems.length-1].checked = globalConfig.config.suppressExisting;
				depItems[depItems.length-1].data = 'suppressExisting';
				depItems[depItems.length-1].addEventListener(air.Event.SELECT,function(e) {
					e.target.checked = !e.target.checked;
					globalConfig.toggleOption(e.target.data, e.target.checked);
				});
				
			return menu;
		}
		function createLanguageMenu() {
			var item;
			var menu = new air.NativeMenu();
			var curLang;
			var langs = ['de_DE', 'en_US'];
			
			function languageChange(e) {
				menu.items[curLang].checked = false;
				globalConfig.toggleOption('language', langs[e.target.data]);
				curLang = e.target.data;
				e.target.checked = true;
				
				lang.setLang(langs[curLang]);
				application.restart();
			}
			
			langs.forEach(function(elm, i) {
				item = menu.addItem(new air.NativeMenuItem(lang.getText('menu.options.language.'+elm)));
				item.data = i;
				item.checked = (elm === globalConfig.config.language);
				item.checked && (curLang = i);
				item.addEventListener(air.Event.SELECT, languageChange)
			});
			
			return menu;
		}
		
		function createLintMenu() {
			var item;
			var menu = new air.NativeMenu();
			var lintmenu;
			item = menu.addItem(new air.NativeMenuItem(lang.getText("menu.validator.enable")));
				item.keyEquivalent = 'l';
				item.checked = globalConfig.config.lint;
				item.data = 'lint';
			item.addEventListener(air.Event.SELECT,function(e) {
				lintmenu.enabled = !e.target.checked;
				e.target.checked = !e.target.checked;
				globalConfig.toggleOption(e.target.data, e.target.checked);
			});
			lintmenu = menu.addSubmenu(createLintOptsMenu(), lang.getText("menu.validator.options"));
			lintmenu.enabled = globalConfig.config.lint;
			return menu;
		}

		function createLintOptsMenu() {
			function lintMenuSelect(e) {
				e.target.checked = !e.target.checked;
				lintConfig.toggleOption(e.target.data, e.target.checked);
			}
			var item;
			var menu = new air.NativeMenu();
			_.each(_(lintConfig.config).keys(), function(elm, idx) {
				item = menu.addItem(new air.NativeMenuItem(elm));
				item.checked = lintConfig.config[elm];
				item.data = elm;
			});
			for (item = 0; item < menu.items.length; item++){
				menu.items[item].addEventListener(air.Event.SELECT,lintMenuSelect);
			}
			return menu;
		}
		
		
		
		
		function createPackerMenu() {
			var menu = new air.NativeMenu();
			var item;

			function compilerMenuSelect(e) {
				if(e.target.data !== 'warn_file') {
					globalConfig.toggleOption('packer', e.target.data);
					for(item = 0; item < menu.items.length; item++) {
						if(menu.items[item].data !== 'warn_file') {
							menu.items[item].checked = (menu.items[item].data === e.target.data);
						}
					}
					packager.setOptions(packer[globalConfig.config.packer].getSettings());
				} else {
					e.target.checked = !e.target.checked;
					globalConfig.toggleOption(e.target.data, e.target.checked);
				}
			}
			item = menu.addItem(new air.NativeMenuItem(lang.getText("menu.packager.closure")));
				item.checked = (globalConfig.config.packer === 'closure');
				item.data = 'closure';
			item = menu.addItem(new air.NativeMenuItem(lang.getText("menu.packager.uglify")));
				item.checked = (globalConfig.config.packer === 'uglify');
				item.data = 'uglify';

			menu.addItem(new air.NativeMenuItem('', true));
			item = menu.addItem(new air.NativeMenuItem(lang.getText("menu.packager.output")));
				item.keyEquivalent = 'e';
				item.checked = globalConfig.config.warn_file;
				item.data = 'warn_file';
				
			for (item = 0; item < menu.items.length; item++){
				menu.items[item].addEventListener(air.Event.SELECT,compilerMenuSelect);
			}
			return menu;
		}
		
		
		
		
		
		function createHelpMenu(type) {
			var item;
			var menu = new air.NativeMenu();
			
			item = menu.addItem(new air.NativeMenuItem(lang.getText("menu.help.updates")));
				item.keyEquivalent='u';
				item.addEventListener('select', function(e) {
					updater.checkForUpdates(true);
				});
			item = menu.addItem(new air.NativeMenuItem(lang.getText("menu.help.changelog")));
				item.addEventListener('select', function(e) {
					changelog.showChangelog();
				});
			menu.addItem(new air.NativeMenuItem('', true));
			item = menu.addItem(new air.NativeMenuItem(lang.getText("menu.help.about")));
				item.keyEquivalent='h';
				item.addEventListener('select', function(e) {
					if (typeof aboutLoader === 'undefined') {
						var options = new air.NativeWindowInitOptions();
						options.type = "utility";
						options.resizable = false;
						options.maximizable = false;
						options.minimizable = false;
						options.owner =  initialWindow;
						var initBounds = initialWindow.bounds;
						
						var windowBounds = new air.Rectangle(initBounds.left + (initBounds.width - 300) / 2, initBounds.top + (initBounds.height - 150) / 2, 300, 150);
						
						var aboutLoader = air.HTMLLoader.createRootWindow(true, options, false, windowBounds);
						aboutLoader.window.nativeWindow.addEventListener('closing', function(){
							aboutLoader = null;
						});
						aboutLoader.load(new air.URLRequest("app:/about.html"));
					}
				});
			return menu;
		}
		
		
		
		
		
		function createRootMenu() {
			var menu = new air.NativeMenu();
			menu.addSubmenu(createFileMenu(), lang.getText("menu.file.root"));
			menu.addSubmenu(createEditMenu(), lang.getText("menu.options.root"));
			menu.addSubmenu(createFBMenu(), lang.getText("menu.library.root"));
			menu.addSubmenu(createLintMenu(), lang.getText("menu.validator.root"));
			menu.addSubmenu(createPackerMenu(), lang.getText("menu.packager.root"));
			menu.addSubmenu(createHelpMenu(), lang.getText("menu.help.root"));
			return menu;
		}
		
		function init() {
			var na  = air.NativeApplication;
			var nw = air.NativeWindow;
			
			if(air.NativeApplication.supportsDefaultApplication) {
				if(na.nativeApplication.isSetAsDefaultApplication('jspackcfg') && na.nativeApplication.isSetAsDefaultApplication('jspackconfig')) {
					globalConfig.toggleOption('defaultApp',true);
				} else {
					globalConfig.toggleOption('defaultApp',false);
				}
			}
		
			if(na.supportsMenu) {
				na.nativeApplication.menu = createRootMenu();
			} else if(nw.supportsMenu) {
				window.nativeWindow.menu = createRootMenu();
			}
		}

		return {
			init: init
		};
	}();
}(jQuery));
