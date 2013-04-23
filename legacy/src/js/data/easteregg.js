/**
 * @author Philipp
 */
(function($) {
	if(typeof packer === "undefined") { packer = {}; }
	packer.easteregg = function() {

		var doc = document;
		var egg;
		
		$(function() {
			var input = [];
			var goal = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // KONAMI CODE
			egg = $('<div id="easteregg" style="display: none; z-index: 9999; position: absolute; left: 0; top: 0; right: 0; bottom: 0; margin: auto; height: 100%; width: 100%"></div>').appendTo('body')
					.append('<img class="easter-egg" src="img/8.gif" style="width: 100%; height: 100%; top: 0; left: 0; right: 0; bottom: 0; position: absolute; margin: auto" />')
					.append('<marquee class="easter-egg" style="position: absolute; top: 0; left: 0; right: 0; color: white; font-weight: bold; font-size: 32px; -webkit-marquee: left 5px infinite 5 alternate">I AM A NINJA DANCE MACHINE !!!</marquee>')
					.append('<marquee class="easter-egg" style="position: absolute; bottom: 0; left: 0; right: 0; color: white; font-weight: bold; font-size: 32px; -webkit-marquee: right 5px infinite 5 alternate">I AM A NINJA DANCE MACHINE !!!</marquee>')
			;
			
			$(doc).bind('keyup', function(e) {
				hide();
				if(e.keyCode === goal[input.length]) { 
					input.push(e.keyCode); 
				} else { 
					input = []; 
				}
				if(input.length === goal.length) { 
					egg.css({display: 'block'});
					$(doc).one('mousemove', hide); 
				}
			});
		});
		
		function hide() {
			if(egg.is(':visible')) { egg.hide(); input = []; }
		}

		return {
			hide: hide
		};
	}();
	
})(jQuery);