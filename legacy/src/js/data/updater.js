(function($) {
	if(typeof packer === "undefined") { packer = {}; }
	packer.updater = function() {
		var _ = packer.lang.getText;
		
		var updateURL = 'http://www.philipp-paul.com/packager/upgrade.json';
		var updateDescriptor = {};
		var app = air.NativeApplication.nativeApplication.applicationDescriptor + '';
		app = $(app);
		var appVersion = $('versionNumber', app)[0].innerText;
		var loader;
		var system = {
			name: '',
			suffix: ''
		};
		
		function versionCompare(newer, older) {
			newer = newer.split('.');
			older = older.split('.');
			if(newer.length !== older.length) {
				if(newer.length > older.length) {
					while(older.length !== newer.length) {
						older.push(0);
					}
				} else {
					while(older.length !== newer.length) {
						newer.push(0);
					}
				}
			}
			for(var i = 0, len = newer.length; i < len; i++) {
				if(parseInt(newer[i], 10) === parseInt(older[i], 10)) {
					continue; 
				}
				if(parseInt(newer[i], 10) > parseInt(older[i], 10)) {
					return true;
				}
				return false;
			}
			return false;
		}
		
		function progress(e) {
			var prog = parseInt(e.bytesLoaded / e.bytesTotal * 100, 10);
			packer.boxes.getInstance().find('#progress span').css({width: prog+'%'}).html(prog+'%');
		}
		
		function ioerror(e) {
			
			loader.removeEventListener('progress', progress);
			loader.removeEventListener('complete', complete);
			loader.removeEventListener('ioError', ioerror);
			packer.boxes.hideDialog();
			
			packer.boxes.showError(_('boxes.header.error'), _('boxes.update.error.ioError'));
		}
		
		function complete(e) {
			loader.removeEventListener('progress', progress);
			loader.removeEventListener('complete', complete);
			loader.removeEventListener('ioError', ioerror);
			
			packer.boxes.hideDialog();
			switch(system.name) {
				case "win":
					installWindows(e.target.data);
					break;
				case "mac":
					installMacintosh(e.target.data);
					break;
				case "lin":
					installLinux(e.target.data);
					break;
			}
		}
		
		function installWindows(rawFile) {
			var dir = air.File.createTempDirectory().resolvePath('packager.'+system.suffix);
			var ret = packer.filemanager.writeBinaryContent(dir, rawFile);
			if(ret.ok) {
				var info = new air.NativeProcessStartupInfo();
				var cmd = new air.File('C:\\Windows\\System32\\cmd.exe');
				// try to run it using commandline
				if (cmd && cmd.exists) {
					var args = new air.Vector["<String>"]();
					args.push('/c', dir.nativePath);
					
					info.executable = cmd;
					info['arguments'] = args;
				}
				// if commandline fails, execute it directly
				else {
					info.executable = dir;
				}
				
				var install = new air.NativeProcess();
				install.start(info);
				
				window.setTimeout(air.NativeApplication.nativeApplication.exit, 200);
			} else {
				packer.boxes.showError(_('boxes.header.error'), _('boxes.update.error.save'));
			}
		}
		
		function installLinux(rawFile) {
			var dir = air.File.createTempDirectory().resolvePath('packager.'+system.suffix);
			var ret = packer.filemanager.writeBinaryContent(dir, rawFile);
			if(ret.ok) {
				dir.openWithDefaultApplication();
			} else {
				packer.boxes.showError(_('boxes.header.error'), _('boxes.update.error.save'));
			}
		}
		
		function installMacintosh(rawFile) {
			// TODO
		}
		
		function handleUpdateFile(userinitiated) {
			var newVersion = updateDescriptor[system.name].version+'';
			if(versionCompare(newVersion, appVersion) && system.name !== 'mac') {
				// system check for mac to be removed after install-routine is implemented
				packer.boxes.showDialog({
					title: _('boxes.header.info'), 
					message: _('boxes.update.info.newUpdate', newVersion, appVersion),
					yestext: _('boxes.buttons.yestext.normal'), 
					notext: _('boxes.buttons.notext.normal'),
					cb: function(ok) {
							if(ok) {
								initDownload();
							}
						}
				});
			} else {
				if(userinitiated) {
					// system check for mac to be removed after install-routine is implemented
					// start
					if(system.name === 'mac') {
						packer.boxes.showDialog({
							title: _('boxes.header.info'), 
							message: _('boxes.update.info.notOnMac')
						});
						return;
					}
					// end
					packer.boxes.showDialog({
						title: _('boxes.header.info'), 
						message: _('boxes.update.info.noUpdate')
					});
				}
			}
		}
		function initDownload() {
			packer.boxes.showDialog({
				title: _('boxes.header.info'), 
				message: '<span id="progress"><span style="width: 0%"></span></span>', 
				type: 'progress', 
				yestext: null
			});
			
			var req = new air.URLRequest(updateDescriptor[system.name].url);
			loader = new air.URLLoader();
			loader.dataFormat = 'binary';
			loader.addEventListener('progress', progress);
			loader.addEventListener('complete', complete);
			loader.addEventListener('ioError', ioerror);
			loader.load(req);
		}

		return {
			init: function() {
				if(air.Capabilities.os.indexOf('Linux') !== -1) {
					system.name = 'lin';
					system.suffix = 'deb';
				} else if (air.Capabilities.os.indexOf('Mac') !== -1) {
					system.name = 'mac';
					system.suffix = 'dmg';
				} else {
					system.name = 'win';
					system.suffix = 'exe';
				}
			},
			
			checkForUpdates: function(userinitiated) {
				var req = new XMLHttpRequest();
				req.onreadystatechange = function() {
					if(req.readyState === 4) {
						if(req.status === 200) {
							updateDescriptor = JSON.parse(req.responseText);
							handleUpdateFile(userinitiated);
						} else {
							if(userinitiated) {
								packer.boxes.showDialog({
									title: _('boxes.header.warning'), 
									message: _('boxes.update.warning.fail', req.status)
								});
							}
						}
					}
				};
				
				req.open('GET', updateURL, true);
				req.setRequestHeader('Accept', 'text/javascript, application/x-javascript');
				req.send(null);
			}
		};
	}();
}(jQuery));