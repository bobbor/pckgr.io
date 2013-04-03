(function($){
if(window.jspackager && jspackager.jsPath !== undefined && jspackager.devmode){
	var curScript = jspackager.jsList["__curScript__"];
	if(curScript && curScript.length){
		if($ && window.sssl && $(document.scripts || 'script').filter('[src*="__curScript__.js"]')[$.fn.prop ? 'prop' : 'attr']('async')){
			sssl($.map(curScript, function(src){
				return jspackager.jsPath+src+'.js';
			}));
		} else {
			for(var j = 0, leng = curScript.length; j < leng; j++){
				document.write('<script src="'+jspackager.jsPath+curScript[j]+'.js"><\/script>');
			}
		}
	}
}
})(window.jQuery);