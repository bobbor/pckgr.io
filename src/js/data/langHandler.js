/**
 * 
 */

(function(pack, window, undefined) {
	"use strict";
	
	pack.define('i18n', ['filemanager'], {
		texts: {},
		_init: function(fm) {
			this.filemanager = fm;
		},
		setLang: function(lang, cb) {
			var that = this;
			if(lang === that.curLang) {
				cb();
				return;
			}
			that.filemanager.readContent('app:/templates/lang/'+lang+'.json', function(result) {
				if(result.ok) {
					that.curLang = lang;
					that.texts = filemanager.parse(result.content).config;
					cb();
				}
			});
		},
		getText: function(type) {
			var that = this;
			var str = that.texts;
			var strings = Array.prototype.slice.call(arguments, 1);
			
			type = type.split('.');
			
			// first get the right text 
			for(var i = 0, len = type.length; i < len; i+=1) {
				str = str[type[i]];
			}
			
			// then substitute $1, $2 etc with the parameters passed
			for(var i = 0, len = strings.length; i<len; i+=1) {
				str = str.replace(new RegExp('\\$'+(i+1)+'', 'g'), strings[i]);
			}
			
			return str;
		}
	});
}(packager, window));