/**
 * 
 */
(function($) {
	if(typeof packer === "undefined") { packer = {}; }
	packer.windowmenu = function() {
		var _ = packer.lang.getText;
		function createFileMenu(type) {
			var recentItems = [];
			var item;
			var menu = new air.NativeMenu();
			var na = air.NativeApplication;
			
			function quickPack(e) {
				var ret = packer.configfile.changeConfigFile(e.target.data.url);
				if(ret.ok) {
					var res = packer.configfile.readConfig();
					if(res.ok) {
						packer.savefile.addMostRecent(e.target.data.url);
						packer.list.fillProjectList();
						packer.packer.pack(res.config, new air.File(e.target.data.url));
					}
				}
			}
			
			item = menu.addItem(new air.NativeMenuItem(_('menu.file.new')));
				item.keyEquivalent = 'n';
				item.addEventListener('select', function() {
					packer.boxes.showDialog({
							title: _('boxes.header.info'),
							message: {
								projMessage: _('boxes.list.info.addProject.projectName'),
								placeMessage: _('boxes.list.info.addProject.projectPath')
							},
							notext: _('boxes.buttons.notext.cancel'),
							extra: 'project'
						})
					;
				});
			
			item = menu.addItem(new air.NativeMenuItem(_("menu.file.import")));
				item.keyEquivalent = 'i';
				item.addEventListener('select', function(e) {
					var file = air.File.documentsDirectory;
					var jsFilter = new air.FileFilter("Packager ConfigFile", "*.jspackcfg; *.jspackconfig");
					file.addEventListener('select', function(ev) {
						var file = ev.target;
						var result = packer.configfile.changeConfigFile(file.url);
						if(result.ok) {
							var res = packer.configfile.readConfig();
							if(res.ok) {
								packer.application.addProject(res.config.name, file.url);
							} else {
								packer.boxes.showDialog({
									title: _('boxes.header.error'), 
									message: _('boxes.configfile.error.configparse'), 
									type: 'error', 
									yestext: _('boxes.buttons.yestext.edit'), 
									notext: _('boxes.buttons.notext.cancel'), 
									cb: function(ok) {
										if(ok) {
											ret = packer.filemanager.readContent(url);
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
					});
					file.browseForOpen("Suche", [jsFilter]);
				});
				
			item = menu.addItem(new air.NativeMenuItem('', true));
			var cfg = packer.savefile.getConfig();
			HelperJS.forEach(cfg.projects, function(elm, idx){
				for(var i = 0, len = cfg.top4.length; i < len; i++) {
					if(elm.url === cfg.top4[i]) {
						item = menu.addItem(new air.NativeMenuItem(_("menu.file.quickPack", elm.name)));
						item.data = elm;
						item.addEventListener('select', quickPack);
					}
				}
			});
			item = menu.addItem(new air.NativeMenuItem('', true));
			item = menu.addItem(new air.NativeMenuItem(_("menu.file.quit")));
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
						packer.globalConfig.toggleOption(e.target.data, e.target.checked);
						break;
					case 'defaultApp':
						e.target.checked = !e.target.checked;
						if(air.NativeApplication.supportsDefaultApplication) {
							var na = air.NativeApplication.nativeApplication;
							na.setAsDefaultApplication('jspackcfg');
							na.setAsDefaultApplication('jspackconfig');

							packer.globalConfig.toggleOption(e.target.data, e.target.checked);
							e.target.enabled = false;
						} else {
							e.target.checked = false;
						}
						break;
					default:
						e.target.checked = !e.target.checked;
						packer.globalConfig.toggleOption(e.target.data, e.target.checked);
						break;
				}
			}
			item = menu.addSubmenu(createLanguageMenu(), _("menu.options.language.root"));
			menu.addItem(new air.NativeMenuItem('', true));
			item = menu.addItem(new air.NativeMenuItem(_("menu.options.recent")));
				item.keyEquivalent = 'r';
				item.checked = packer.globalConfig.config.show_recent;
				item.data = 'show_recent';
			item = menu.addItem(new air.NativeMenuItem(_("menu.options.doubleClick")));
				item.keyEquivalent = 'd';
				item.checked = packer.globalConfig.config.dblpack;
				item.data = 'dblpack';
			menu.addItem(new air.NativeMenuItem('', true));
			item = menu.addItem(new air.NativeMenuItem(_("menu.options.warnings")));
				item.keyEquivalent = 'w';
				item.checked = packer.globalConfig.config.show_warning;
				item.data = 'show_warning';
			item = menu.addItem(new air.NativeMenuItem(_("menu.options.tooltips")));
				item.keyEquivalent = 't';
				item.checked = packer.globalConfig.config.tooltip;
				item.data = 'tooltip';
			menu.addItem(new air.NativeMenuItem('', true));
			item = menu.addItem(new air.NativeMenuItem(_("menu.options.tray")));
				item.keyEquivalent = 'm';
				item.checked = packer.globalConfig.config.min_tray;
				item.data = 'min_tray';
			item = menu.addItem(new air.NativeMenuItem(_("menu.options.boot")));
				item.keyEquivalent = 'b';
				item.checked = packer.globalConfig.config.autostart;
				item.enabled = false;
				item.data = 'autostart';
			item = menu.addItem(new air.NativeMenuItem(_("menu.options.defaultApp")));
				item.keyEquivalent = 's';
				item.checked = packer.globalConfig.config.defaultApp;
				if(packer.globalConfig.config.defaultApp) {
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
			
			item = menu.addItem(new air.NativeMenuItem(_("menu.library.copy")));
			item.checked = packer.globalConfig.config.use_kit && packer.globalConfig.config.kit_path;
			item.data = 'use_kit';
			item.addEventListener('select', function(e) {
				e.target.checked = !e.target.checked;
				packer.globalConfig.toggleOption(e.target.data, e.target.checked);
				if(e.target.checked && packer.globalConfig.config.kit_path === '') {
					packer.boxes.showDialog({
						title: _('boxes.header.info'),
						message: _('boxes.menu.info.libPath'),
						yestext: _('boxes.buttons.yestext.ok'), 
						notext: _('boxes.buttons.notext.cancel'),
						extra: 'file',
						cb: function(ok, path) {
							if(ok) {
								packer.globalConfig.toggleOption('kit_path', path);
								packer.libhandler.update();
								for(item = 0; item < depItems.length-1; item++) {
									depItems[item].data = packer.filemanager.getFile(path).nativePath;
								}
								return;
							}
							packer.globalConfig.toggleOption(e.target.data, ok);
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
			depItems.push(menu.addItem(new air.NativeMenuItem(_("menu.library.changePath"))));
				depItems[depItems.length-1].enabled = packer.globalConfig.config.use_kit;
				depItems[depItems.length-1].data = packer.globalConfig.config.kit_path;
				depItems[depItems.length-1].addEventListener('select', function(e) {
					packer.boxes.showDialog({
						title: _('boxes.header.info'),
						message: _('boxes.menu.info.libPath'),
						yestext: _('boxes.buttons.yestext.ok'), 
						notext: _('boxes.buttons.notext.cancel'),
						extra: 'file',
						cb: function(ok, path) {
							if(ok) {
								packer.globalConfig.toggleOption('kit_path', path);
								for(item = 0; item < depItems.length-1; item++) {
									depItems[item].data = packer.filemanager.getFile(path).nativePath;
								}
							}
						}
					});
				});
			depItems.push(menu.addItem(new air.NativeMenuItem(_("menu.library.showPath"))));
				depItems[depItems.length-1].enabled = packer.globalConfig.config.use_kit;
				depItems[depItems.length-1].data = packer.globalConfig.config.use_kit ? packer.globalConfig.config.kit_path : undefined;
				depItems[depItems.length-1].addEventListener('select', function(e) {
					packer.boxes.showDialog({
						title: _('boxes.header.info'),
						message: new air.File(e.target.data).nativePath,
						type: 'info'
					});
				});
			depItems.push(menu.addItem(new air.NativeMenuItem(_("menu.library.overwrite"))));
				depItems[depItems.length-1].enabled = packer.globalConfig.config.use_kit;
				depItems[depItems.length-1].checked = packer.globalConfig.config.suppressExisting;
				depItems[depItems.length-1].data = 'suppressExisting';
				depItems[depItems.length-1].addEventListener(air.Event.SELECT,function(e) {
					e.target.checked = !e.target.checked;
					packer.globalConfig.toggleOption(e.target.data, e.target.checked);
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
				packer.globalConfig.toggleOption('language', langs[e.target.data]);
				curLang = e.target.data;
				e.target.checked = true;
				
				packer.lang.setLang(langs[curLang]);
				packer.application.restart();
			}
			
			langs.forEach(function(elm, i) {
				item = menu.addItem(new air.NativeMenuItem(_('menu.options.language.'+elm)));
				item.data = i;
				item.checked = (elm === packer.globalConfig.config.language);
				item.checked && (curLang = i);
				item.addEventListener(air.Event.SELECT, languageChange)
			});
			
			return menu;
		}
		
		function createLintMenu() {
			var item;
			var menu = new air.NativeMenu();
			var lintmenu;
			item = menu.addItem(new air.NativeMenuItem(_("menu.validator.enable")));
				item.keyEquivalent = 'l';
				item.checked = packer.globalConfig.config.lint;
				item.data = 'lint';
			item.addEventListener(air.Event.SELECT,function(e) {
				lintmenu.enabled = !e.target.checked;
				e.target.checked = !e.target.checked;
				packer.globalConfig.toggleOption(e.target.data, e.target.checked);
			});
			lintmenu = menu.addSubmenu(createLintOptsMenu(), _("menu.validator.options"));
			lintmenu.enabled = packer.globalConfig.config.lint;
			return menu;
		}

		function createLintOptsMenu() {
			function lintMenuSelect(e) {
				e.target.checked = !e.target.checked;
				packer.lintConfig.toggleOption(e.target.data, e.target.checked);
			}
			var item;
			var menu = new air.NativeMenu();
			HelperJS.forEach(HelperJS.keys(packer.lintConfig.config), function(elm, idx){
				item = menu.addItem(new air.NativeMenuItem(elm));
				item.checked = packer.lintConfig.config[elm];
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
					packer.globalConfig.toggleOption('packer', e.target.data);
					for(item = 0; item < menu.items.length; item++) {
						if(menu.items[item].data !== 'warn_file') {
							menu.items[item].checked = (menu.items[item].data === e.target.data);
						}
					}
					packer.packer.setOptions(packer[packer.globalConfig.config.packer].getSettings());
				} else {
					e.target.checked = !e.target.checked;
					packer.globalConfig.toggleOption(e.target.data, e.target.checked);
				}
			}
			item = menu.addItem(new air.NativeMenuItem(_("menu.packer.closure")));
				item.checked = (packer.globalConfig.config.packer === 'closure');
				item.data = 'closure';
			item = menu.addItem(new air.NativeMenuItem(_("menu.packer.uglify")));
				item.checked = (packer.globalConfig.config.packer === 'uglify');
				item.data = 'uglify';

			menu.addItem(new air.NativeMenuItem('', true));
			item = menu.addItem(new air.NativeMenuItem(_("menu.packer.output")));
				item.keyEquivalent = 'e';
				item.checked = packer.globalConfig.config.warn_file;
				item.data = 'warn_file';
				
			for (item = 0; item < menu.items.length; item++){
				menu.items[item].addEventListener(air.Event.SELECT,compilerMenuSelect);
			}
			return menu;
		}
		
		
		
		
		
		function createHelpMenu(type) {
			var item;
			var menu = new air.NativeMenu();
			
			item = menu.addItem(new air.NativeMenuItem(_("menu.help.updates")));
				item.keyEquivalent='u';
				item.addEventListener('select', function(e) {
					packer.updater.checkForUpdates(true);
				});
			item = menu.addItem(new air.NativeMenuItem(_("menu.help.changelog")));
				item.addEventListener('select', function(e) {
					packer.changelog.showChangelog();
				});
			menu.addItem(new air.NativeMenuItem('', true));
			item = menu.addItem(new air.NativeMenuItem(_("menu.help.about")));
				item.keyEquivalent='h';
				item.addEventListener('select', function(e) {
					if (typeof aboutLoader === 'undefined') {
						var options = new air.NativeWindowInitOptions();
						options.type = "utility";
						options.resizable = false;
						options.maximizable = false;
						options.minimizable = false;
						options.owner =  packer.initialWindow;
						var initBounds = packer.initialWindow.bounds;
						
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
			menu.addSubmenu(createFileMenu(), _("menu.file.root"));
			menu.addSubmenu(createEditMenu(), _("menu.options.root"));
			menu.addSubmenu(createFBMenu(), _("menu.library.root"));
			menu.addSubmenu(createLintMenu(), _("menu.validator.root"));
			menu.addSubmenu(createPackerMenu(), _("menu.packer.root"));
			menu.addSubmenu(createHelpMenu(), _("menu.help.root"));
			return menu;
		}
		
		function init() {
			var na  = air.NativeApplication;
			var nw = air.NativeWindow;
			
			if(air.NativeApplication.supportsDefaultApplication) {
				if(na.nativeApplication.isSetAsDefaultApplication('jspackcfg') && na.nativeApplication.isSetAsDefaultApplication('jspackconfig')) {
					packer.globalConfig.toggleOption('defaultApp',true);
				} else {
					packer.globalConfig.toggleOption('defaultApp',false);
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
