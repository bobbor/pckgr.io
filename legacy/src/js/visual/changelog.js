(function($) {
	if(typeof packer === "undefined") { packer = {}; }
	packer.changelog = function() {
		var _ = packer.lang.getText;
		
		var currentVersion;
		var previousVersion;
		function init() {
			var ret;
			var versionObj;
			var app = air.NativeApplication.nativeApplication.applicationDescriptor + '';
			app = $(app);
			currentVersion = parseFloat($('versionNumber', app)[0].innerText, 10);
			
			versionObj = {version: currentVersion};
			
			var versionFile = air.File.applicationStorageDirectory.resolvePath("version.json");
			if(versionFile.exists) {
				ret = packer.filemanager.readContent(versionFile);
				if(ret.ok) {
					ret = packer.filemanager.parse(ret.content);
					if(ret.ok) {
						previousVersion = ret.config.version;
					}
				}
			} else {
				previousVersion = 0.1;
			}
			
			packer.filemanager.writeContent(versionFile, JSON.stringify(versionObj));
			
			if(previousVersion < currentVersion) {
				showChangelog();
			}
		}
		
		function showChangelog() {
			var ret = packer.filemanager.readContent(air.File.applicationDirectory.resolvePath('changelog.html'));
			if(ret.ok) {
				packer.boxes.showDialog({
					title: 'Changelog', 
					message: ret.content
				});
			}
		}

		return {
			init: init,
			showChangelog: showChangelog
		};
	}();
}(jQuery));