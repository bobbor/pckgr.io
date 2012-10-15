(function($) {
	if(typeof packer === "undefined") { packer = {}; }
	packer.traydock = function() {
		var _ = packer.lang.getText;
		
		var na = air.NativeApplication;
		var iconLoader = new air.Loader();
		var req = new air.URLRequest();
		var htmlLoader;
		var notifyqueue = [];
		
		if(na.supportsDockIcon) {
			iconLoader.contentLoaderInfo.addEventListener("complete", setIcon);
			req.url = "icons/icon-128.png";
			iconLoader.load(req); 
			na.nativeApplication.icon.addEventListener('click', hideUnhide);
		} else 
		if(na.supportsSystemTrayIcon) {
			iconLoader.contentLoaderInfo.addEventListener("complete", setIcon);
			req.url = "icons/icon-16.png";
			iconLoader.load(req);
			na.nativeApplication.icon.addEventListener('click', hideUnhide);
		}
		
		function setIcon(e) {
			na.nativeApplication.icon.bitmaps = [e.target.content.bitmapData];
		}
		
		function hideUnhide(e) {
			var that = this;
			if(!nativeWindow.active && nativeWindow.visible) {
				bringToFront();
			} else
			if(nativeWindow.active && nativeWindow.visible) {
				nativeWindow.minimize();
			} else {
				nativeWindow.visible = true;
				if(nativeWindow.displayState === 'minimized') {
					nativeWindow.restore();
				}
				bringToFront();
			}
		}
		
		function bringToFront() {
			air.NativeApplication.nativeApplication.activate();
			nativeWindow.activate();
			
			nativeWindow.alwaysInFront = true;
			nativeWindow.alwaysInFront = false;
		}
		
		nativeWindow.addEventListener('displayStateChange', hideWhenMinimizing);
		
		function hideWhenMinimizing(e) {
			if(e.afterDisplayState === air.NativeWindowDisplayState.MINIMIZED && packer.globalConfig.config.min_tray) {
				e.preventDefault();
				e.target.visible = false;
			}
		}
		
		function createMenu(items) {
			var item;
			var menu = new air.NativeMenu();
			var projItems = new Array(items.top4.length);
			
			function menuItemSelect(e) {
				var ret = packer.configfile.changeConfigFile(e.target.data.url);
				if(ret.ok) {
					ret = packer.configfile.readConfig();
					if(ret.ok) {
						packer.packer.pack(ret.config, packer.filemanager.getFile(e.target.data.url));
						packer.savefile.addMostRecent(e.target.data.url);
						packer.list.fillProjectList();
					} else {
						packer.boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.configread'));
					}
				} else {
					packer.boxes.showError(_('boxes.header.error'), _('boxes.tray.error.projectChange', e.target.data.name));
				}
			}
			
			item = menu.addItem(new air.NativeMenuItem('Anzeigen'));
				item.addEventListener('select', function(e) {
					hideUnhide();
				});
			menu.addItem(new air.NativeMenuItem('', true));
			
			for(var i = 0, len = items.projects.length; i < len; i++) {
				for(var j = 0, jlen = items.top4.length; j < jlen; j++) {
					if(items.projects[i].url === items.top4[j]) {
						projItems[j] = menu.addItem(new air.NativeMenuItem('"'+items.projects[i].name+'" packen'));
						projItems[j].data = items.projects[i];
						projItems[j].addEventListener('select', menuItemSelect);
					}
				}
			}
			if(items.top4.length) {
				menu.addItem(new air.NativeMenuItem('', true));
			}
			
			item = menu.addItem(new air.NativeMenuItem('Beenden'));
			item.addEventListener('select', function(e) {
				for(var i = 0, len = air.NativeApplication.nativeApplication.opendWindows; i < len; i++) {
					air.NativeApplication.nativeApplication.openedWindows[i].close();
				}
				air.NativeApplication.nativeApplication.exit();
			});
			air.NativeApplication.nativeApplication.icon.menu = menu;
		}
		
		function showNotification(params) {
			if (htmlLoader.loaded) {
				htmlLoader.window.showNotification(params, window);
			} else {
				notifyqueue.push(params);
			}
		}
		
		function loaderCompleteHandler(e) {
			var timer;
			htmlLoader.removeEventListener('complete', loaderCompleteHandler);
			if(notifyqueue.length) {
				timer = window.setInterval(function() {
					if(notifyqueue[0]) {
						htmlLoader.window.showNotification(notifyqueue[0], window);
						notifyqueue.shift();
					} else {
						window.clearInterval(timer);
					}
				}, 250);
			}
		}
		
		function createNotificationsWindow() {
			var options = new air.NativeWindowInitOptions();
			options.type = "lightweight";
			options.resizable = false;
			options.maximizable = false;
			options.minimizable = false;
			options.systemChrome = 'none';
			options.transparent = true;
			
			var windowBounds = new air.Rectangle(air.Screen.mainScreen.visibleBounds.width - 200, 0, 200, air.Screen.mainScreen.visibleBounds.height);
			
			htmlLoader = air.HTMLLoader.createRootWindow(true, options, false, windowBounds);
			htmlLoader.window.nativeWindow.alwaysInFront = true;
			htmlLoader.window.nativeWindow.visible = true;
			req.url = "app:/note.html";
			htmlLoader.addEventListener('complete', loaderCompleteHandler);
			htmlLoader.load(req);
		}

		return {
			init: function(items) {
				createNotificationsWindow();
			},
			notify: showNotification,
			createMenu: createMenu
		};
	}();
}(jQuery));