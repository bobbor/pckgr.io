(function($){
	if(typeof packer === "undefined") { packer = {}; }
	packer.filemanager = function() {
		var fs = new air.FileStream();
		
		function getFile (file) {
			return (typeof file === 'string') ? new air.File(file) : file;
		}

		return {
			getFile: getFile,
			readContent: function(file) {
				var content;
				file = getFile(file);
				if (file && file.exists) {
					fs.open(file, air.FileMode.READ);
					content = fs.readUTFBytes(fs.bytesAvailable);
					fs.close();
					return {
						ok: true,
						content: content
					};
				}
				return {
					ok: false,
					content: content
				};
			},
			
			writeContent: function(file, content) {
				file = getFile(file);
				try {
					fs.open(file, air.FileMode.WRITE);
					fs.writeUTFBytes(content);
					fs.close();
				} catch (e) {
					return {
						ok: false
					};
				}
				return {
					ok: true
				};
			},
			
			writeBinaryContent: function(file, content) {
				file = getFile(file);
				try {
					fs.open(file, air.FileMode.WRITE);
					fs.writeBytes(content);
					fs.close();
				} catch (e) {
					return {
						ok: false
					};
				}
				return {
					ok: true
				};
			},
			parse: function(str) {
				var ret;
				try {
					ret = JSON.parse(str);
				}
				catch (e) {
					try {
						ret = eval('(' + str + ')');
					} 
					catch (ex) {
						return {
							ok: false,
							config: ''
						};
					}
					return {
						ok: true,
						config: ret
					};
				}
				return {
					ok: true,
					config: ret
				};
			}
		};
	}();
}(jQuery));