(function(window, undefined) {
	var Frontender = window.Frontender;
	var $s = Frontender.$script;

	$s.ready(['_', 'backbone'], function() {

		Frontender.File = function(filename) {
			this.fileHandle = Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory(), filename);
			this.fileStream = Ti.Filesystem.getFileStream(Ti.Filesystem.getApplicationDataDirectory(), filename);
		}

		Frontender._.extend(Frontender.File.prototype, Frontender.Backbone.Events, {
			read: function(type) {
				var content;
				if(!this.fileHandle.exists()) {
					content = '';
				} else {
					this.fileStream.open(Ti.Filesystem.MODE_READ);
					content = new String(this.fileStream.read(this.fileHandle.size()));
					this.fileStream.close();
				}
				if(type === 'JSON') {
					return JSON.parse(content);
				}
				return content;
			},
			write: function(content) {
				if(!this.fileHandle.exists()) {
					this.fileHandle.touch();
				}
				this.fileStream.open(Ti.Filesystem.MODE_WRITE);
				this.fileStream.write(content);
				this.fileStream.close();
			}
		});
	});
}(this, void 0))