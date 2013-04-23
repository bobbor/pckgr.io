/**
 * 
 */

(function($) {
	if(typeof packer === "undefined") { packer = {}; }
	packer.editor = function() {
		var _ = packer.lang.getText;
		
		var instance;
		var visElement;
		var curCB;
		var isJSON = false;
		var yestextDefault;
		var notextDefault;
		
		function init() {
			visElement = $('#editor-overlay');
			instance = ace.edit("editor");
			instance.setShowPrintMargin(false);
			yestextDefault = _('boxes.buttons.yestext.ok');
			notextDefault = _('boxes.buttons.notext.cancel');
			
			$('button', visElement).click(function() {
				if($(this).is('.yes')) {
					curCB(hide());
				} else {
					hide();
				}
			});
		}
		
		function updateGUI(yes, no) {
			if(yes === '') {
				$('button.yes', visElement).hide();
			} else {
				$('button.yes', visElement).html(yes);
			}
			if(no === '') {
				$('button.no', visElement).hide();
			} else {
				$('button.no', visElement).html(no);
			}
			
			
		}
		
		function openJSON(text, cb, yestext, notext) {
			yestext = (yestext || yestext === '') ? yestext : yestextDefault;
			notext = (notext || notext === '') ? notext : notextDefault;
			updateGUI(yestext, notext);
			isJSON = true;
			visElement.addClass('visible');
			instance.getSession().setValue(text);
			curCB = cb ? cb : function() {};
		}
		
		function open(text, cb, yestext, notext) {
			yestext = (yestext || yestext === '') ? yestext : yestextDefault;
			notext = (notext || notext === '') ? notext : notextDefault;
			updateGUI(yestext, notext);
			isJSON = false;
			visElement.addClass('visible');
			instance.setReadOnly(true);
			instance.getSession().setUseWrapMode(false);
			text = decodeURIComponent(encodeURIComponent(text));
			instance.getSession().setValue(text);
			curCB = cb ? cb : function() {};
		}
		
		function hide() {
			var str = instance.getSession().getValue();
			if(isJSON) {
				try {
					JSON.parse(str);
				} catch(e) {
					packer.boxes.showError(_('boxes.header.error'), _('boxes.editor.error.validJSON'));
					return {
						ok: false,
						json: null
					};
				}
			}
			visElement.removeClass('visible');
			isJSON = false;
			return {
				ok: true,
				json: str
			};
		}

		return {
			init: init,
			open: open,
			hide: hide
		};
	}();
}(jQuery));