(function(window, undefined) {
	var Frontender = window.Frontender;
	var $s = Frontender.$script;

	$s.ready(['_', 'backbone'], function() {

		Frontender.File = function(filename, dir) {
			dir = dir || 'ApplicationDataDirectory';
			var fn = 'get'+dir;
			this.fileHandle = Ti.Filesystem.getFile(Ti.Filesystem[fn](), filename);
			this.fileStream = Ti.Filesystem.getFileStream(Ti.Filesystem[fn](), filename);
		}

		Frontender._.extend(Frontender.File.prototype, Frontender.Backbone.Events, {
			read: function(type) {
				var content;
				console.log('reading')
				console.log(this.fileHandle.nativePath())
				if(!this.fileHandle.exists()) {
					return false;
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
				console.log('writing')
				console.log(this.fileHandle.nativePath())
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