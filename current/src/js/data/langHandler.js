/**
 * 
 */

(function($) {
	if(typeof packer === "undefined") { packer = {}; }
	
	var text = {};
	var curLang;
	var cache = {};
	var loadLangCallback;
	
	function loadLang(lang, cb) {
		if(cb) {
			loadLangCallback = cb;
		}
		if(lang === curLang) {
			loadLangCallback();
			return;
		}
		if(cache[lang]) {
			text = cache[lang];
			curLang = lang;
			loadLangCallback();
			return;
		}
		var result = packer.filemanager.readContent('app:/templates/lang/'+lang+'.json');
		if(result.ok) {
			curLang = lang;
			text = packer.filemanager.parse(result.content).config;
			cache[lang] = text;
		}
		loadLangCallback();
	}
	function getText(type) {
	}
	packer.lang = function() {
		return {
			getText: function(type) {
				type = type.split('.');
				var str = text;
				for(var i = 0, len = type.length; i < len; i+=1) {
					str = str[type[i]];
				}
				var strings = Array.prototype.slice.call(arguments, 1);
				for(var i = 0, len = strings.length; i<len; i+=1) {
					str = str.replace(new RegExp('\\$'+(i+1)+'', 'g'), strings[i]);
				}
				return str;
			},
			setLang: loadLang
		};
	}();
}(jQuery));