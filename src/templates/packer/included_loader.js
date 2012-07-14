(function() {
	window.jspackager = {};
	jspackager.devmode = false;
	var tmpList = "__devloaderPackageInfo__";
	jspackager.jsList = (window.jQuery) ? jQuery.extend(jspackager.jsList || {}, tmpList) : tmpList;
	var basicScript = ["__firstScript__"], srcMatch = /(.*)__firstScript__\.js/, querys = location.search, hash = location.hash, scripts, src, path;
	function loadModule(path) {
		for ( var j = 0, leng = basicScript.length; j < leng; j = j + 1) {
			if (jspackager.querys['mgnl']) {
				basicScript[j] = basicScript[j].replace(/\./g, '-');
			}
			document.write('<script src="' + path + basicScript[j] + '.js"><\/script>');
		}
	}
	querys = querys.replace(/^\?/, '').split('&');
	var obj = {}, tmp;
	for ( var i = querys.length; i--;) {
		if (querys[i] === '') {
			continue;
		}
		tmp = querys[i].split('=');
		obj[tmp[0]] = (tmp[1] === undefined || tmp[1] === null) ? true : tmp[1];
	}
	jspackager.querys = obj;
	if (hash === '#devmode') {
		basicScript = jspackager.jsList[basicScript];
		jspackager.devmode = true;
	} else {
		if (jspackager.querys['devmode']) {
			basicScript = jspackager.jsList[basicScript];
			jspackager.devmode = true;
		}
	}
	if (jspackager.devmode) {
		scripts = document.getElementsByTagName('script');
		for ( var i = 0, len = scripts.length; i < len; i++) {
			src = scripts[i].getAttribute('src');
			if (src) {
				path = srcMatch.exec(src);
				if (path && path[0] && path[1]) {
					jspackager.jsPath = path[1];
					loadModule(path[1]);
				}
			}
		}
	}
})();