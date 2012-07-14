(function(pack, window, undefined){
	
	"use strict";
	var air = window.air;
	
	pack.define('filemanager', [], {
		_init: function() {
			this.fs = new air.FileStream();
		},
		getFile: function(file) {
			if(file.toString() !== '[object File]') {
				try {
					file = new air.File(file);
				} catch (e) {
					file = false;
				}
			}
			return file;
		},
		readContent: function(parse, file, cb) {
			if(typeof parse !== 'boolean') {
				parse = false;
				file = parse;
				cb = file;
			}
			var that = this;
			
			function openHandler() {
				that.fs.removeEventListener('complete', openHandler);
				var content = that.fs.readUTFBytes(that.fs.bytesAvailable);
				that.fs.close();
				if(parse) {
					that.parse(content, function(result) {
						cb && cb(result);
					});
				} else {
					cb && cb({
						ok: true,
						content: content
					});
				}
			}
			
			file = that.getFile(file);
			if (file && file.exists) {
				that.fs.addEventListener('complete', openHandler);
				that.fs.openAsync(file, air.FileMode.READ);
			}
			cb && cb({
				ok: false,
				content: ''
			});
		},
		writeContent: function(file, content, binary, cb) {
			var that = this;
			file = that.getFile(file);
			
			function openHandler() {
				that.fs.removeEventListener('complete', openHandler);
				
				try {
					that.fs[binary ? 'writeBytes' : 'writeUTFBytes'](content);
					that.fs.close();
					cb && cb({ok: true});
				} catch(o_O) {
					cb && cb({ok: false});
				}
				
			}
			
			that.fs.addEventListener('complete', openHandler);
			that.fs.openAsync(file, air.FileMode.WRITE);
		},
		parse: function(str, cb) {
			var ret;
			try {
				ret = JSON.parse(str);
			}
			catch (e) {
				try {
					ret = eval('(' + str + ')');
				} 
				catch (ex) {
					cb && cb({
						ok: false,
						parsed: {}
					});
					return;
				}
				cb && cb({
					ok: true,
					parsed: ret
				});
				return;
			}
			cb && cb({
				ok: true,
				parsed: ret
			});
			return;
		}
	});
}(packager, window));