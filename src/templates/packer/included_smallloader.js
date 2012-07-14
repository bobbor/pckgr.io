(function() {
	if (window.jspackager && jspackager.jsPath !== undefined && jspackager.devmode) {
		var curScript = jspackager.jsList["__curScript__"];
		if (curScript && curScript.length) {
			for ( var j = 0, leng = curScript.length; j < leng; j++) {
				if (jspackager.querys['mgnl']) {
					curScript[j] = curScript[j].replace(/\./g, '-');
				}
				document.write('<script src="' + jspackager.jsPath + curScript[j] + '.js"><\/script>');
			}
		}
	}
})();