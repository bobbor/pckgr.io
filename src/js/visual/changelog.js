(function($) {
	if(typeof packer === "undefined") { packer = {}; }

	/**
	 * @function
	 * 
	 * @namespace changelog
	 */
	changelog = function() {
		var _ = lang.getText;
		
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
				ret = filemanager.readContent(versionFile);
				if(ret.ok) {
					ret = filemanager.parse(ret.content);
					if(ret.ok) {
						previousVersion = ret.config.version;
					}
				}
			} else {
				previousVersion = 0.1;
			}
			
			filemanager.writeContent(versionFile, JSON.stringify(versionObj));
			
			if(previousVersion < currentVersion) {
				showChangelog();
			}
		}
		
		function showChangelog() {
			var ret = filemanager.readContent(air.File.applicationDirectory.resolvePath('changelog.html'));
			if(ret.ok) {
				boxes.showDialog({
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