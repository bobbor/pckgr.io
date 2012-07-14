/**
 * @author philipp.paul
 * 
 * @date 6.11.11
 */

(function($, window, undefined) {
	"use strict";
	var document = window.document;
	
	/**
	 * 
	 * @namespace boxes
	 */
	boxes = function() {
		
		/**
		 * local copy of i18n
		 */
		var _ = lang.getText;
		
		/**
		 * holds a reference to the dom-node (visually the actual overlay)
		 */
		var overlay;
		$(function() {
			overlay = $('<div id="overlay"><a class="close"></a><div class="content"></div></div>')
							.bind('keyup', function(e) {
								if(e.keyCode === 27) { hideOverlay(); }
							})
							.appendTo('body');
		});
		
		/**
		 * is the overlay visible?
		 */
		var visible = false;
		
		/**
		 * is the current overlay in waiting state?
		 */
		var waiting = false;
		
		/**
		 * queue of coming overlays
		 */
		var queue = [];
		
		/**
		 * queue of boxes that cannot be put in tray
		 */
		var noTrayQueue = [];
		
		/**
		 * defaults for a box<br/>
		 * title: the title of a box<br/>
		 * message: the message to tell<br/>
		 * type: the urgency type of the box (info, success, warning, error, waiting)<br/>
		 * yestext: for pos-feedback button<br/>
		 * notext: for neg-feedback button</br/>
		 * extra: special-box? (box = normal; package = addPackage; project = addProject; file = specifyPath)<br/>
		 * cb: callback function that is executed on user-activity<br/>
		 * noTray: boolean-forces the box to appear in main application window
		 */
		var paramDefaults = {
			title: 'Info',
			message: 'Info',
			type: 'info',
			yestext: 'OK' || _('boxes.buttons.yestext.ok'),
			notext: null,
			extra: 'box',
			cb: function() {},
			noTray: false
		};
		
		nativeWindow.addEventListener('activate', reactivateApplication);
		
		/**
		 * handles the event 'activate' on the nativeWindow<br/>
		 * <br/>
		 * if the "noTrayQueue" is not empty show what's in it
		 */
		function reactivateApplication() {
			if(noTrayQueue.length) {
				for(var i = 0, len = noTrayQueue.length; i < len; i++) {
					var next = noTrayQueue.shift();
					next.noTray = false;
					showDialog(next);
				}
			}
		}
		
		/**
		 * shows a box (simple as that)<br/>
		 * has a title, a message, two buttons (pos, neg) and a type(therefore a icon)
		 * 
		 * @param {String} title the title of the box
		 * @param {String} message the message inside the box
		 * @param {String} type type of the box (warning, error, success, info, waiting)
		 * @param {String|null} yestext the text that is written on that button, that brings pos. feedback (null to hide)
		 * @param {String|null} notext the text that is written on that button, that brings neg. feedback (null to hide)
		 * @param {Function} cb the callback function that is called, when on of the buttons is clicked
		 */
		function showBox(title, message, type, yestext, notext, cb) {
			var html = '<div class="dialog '+type+'">'+
						'<strong>'+title+'</strong>'+
						'<p>'+message+'</p>'+
						'<div class="actions">'+
							((yestext !== null) ? '<button class="yes">'+yestext+'</button>' : '')+
							((notext !== null) ? '<button class="no">'+notext+'</button>' : '')+
						'</div>'+
					'</div>'
			;
			
			overlay.addClass('visible')
				.find('div.content')
				.html(html)
				.find('button')
					.one('click', function(e) {
						cb.call(this, $(e.target).is('.yes'));
					})
					.end()
				.find('div.dialog').show()
					.css({
						height: overlay.find('div.dialog p').height()+80
					})
					.end()
				.find('button:first')
					.focus()
			;
		}
		
		/**
		 * special-box: shows the box for adding a package does a little form-validation
		 * 
		 * @param {String} title the title of the box
		 * @param {String} message the label for the packagename-input
		 * @param {String|null} yestext the text that is written on that button, that brings pos. feedback (null to hide)
		 * @param {String|null} notext the text that is written on that button, that brings neg. feedback (null to hide)
		 * @param {Function} cb the callback function that is called, when on of the buttons is clicked
		 */
		function showAddPackage(title, message, yestext, notext, cb) {
			var html = '<div class="dialog add_package">'+
							'<strong>'+title+'</strong>'+
							'<p>'+message+''+ 
								'<input type="text" />'+
							'</p>'+
							'<div class="actions">'+
								'<button class="yes">'+yestext+'</button>'+
								'<button class="no">'+notext+'</button>'+
							'</div>'+
						'</div>'
			;
			
			function submitHandler(positive) {
				if(positive) {
					var valid = true;
					$('input.error', overlay).removeClass('error');
					if(!$('input', overlay)[0].value) {
						valid = false;
						$('input', overlay).addClass('error').focus();
					}
					if(valid) {
						cb.call(this, positive, $('input', overlay)[0].value);
					}
				} else {
					cb.call(this, positive, $('input', overlay)[0].value);
				}
			}
			overlay.addClass('visible')
				.find('div.content')
				.html(html)
				.find('button')
					.one('click', function(e) {
						submitHandler($(e.target).is('.yes'));
					})
					.end()
				.find('div.dialog')
					.show()
				.end()
				.find('input:first')
					.focus()
					.bind('keyup', function(e) {
						if(e.keyCode === 13) {
							submitHandler(true);
						}
					})
				.end()
			;
		}
		
		/**
		 * special-box: shows a text-input which is supposed to be a path
		 * 
		 * @param {String} title the title of the box
		 * @param {String} message the label for the text-input
		 * @param {String|null} yestext the text that is written on that button, that brings pos. feedback (null to hide)
		 * @param {String|null} notext the text that is written on that button, that brings neg. feedback (null to hide)
		 * @param {Function} cb the callback function that is called, when on of the buttons is clicked
		 */
		function showSpecifyPath(title, message, yestext, notext, cb) {
			var html = '<div class="dialog add_file">'+
						'<strong>'+title+'</strong>'+
						'<p>'+message+''+ 
							'<span class="input-row">'+
								'<input type="text" rel="place" />'+
								'<a class="browse"></a>'+
							'</span>'+
						'</p>'+
						'<div class="actions">'+
							'<button class="yes">'+yestext+'</button>'+
							'<button class="no">'+notext+'</button>'+
						'</div>'+
					'</div>'
			;
			
			overlay.addClass('visible')
				.find('div.content')
				.html(html)
				.find('input[rel="place"], a.browse')
					.bind('click', function() {
						var that = this;
						var file = new air.File();
						function directorySelected(e) {
							file.removeEventListener('select', directorySelected);
							$(that).closest('.input-row').find('input')[0].value = file.nativePath;
							$(that).closest('.input-row').find('input').attr('url', file.url);
						}
						file.addEventListener('select', directorySelected);
						file.browseForDirectory("Wo liegen die Skripte?");
						return false;
					})
					.end()
				.find('button')
					.bind('click', function(e) {
						if($(e.target).is('.yes')) {
							var valid = true;
							$('input.error', overlay).removeClass('error');
							if(!$('input[rel="place"]', overlay).attr('url')) {
								$('input[rel="place"]', overlay).addClass('error').focus();
								valid = false;
							}
							if(valid) {
								cb.call(this, $(e.target).is('.yes'), $('input[rel="place"]', overlay).attr('url'));
							}	
						} else {
							cb.call(this, $(e.target).is('.yes'), '');
						}
					})
					.end()
				.find('div.dialog')
					.show()
					.end()
			;
		}
		/**
		 * special-box: shows a box to add a project
		 * 
		 * @param {String} title the title of the box
		 * @param {String} projMessage the label for the projectname-input 
		 * @param {String} placeMessage the label for the storage-path input
		 * @param {String|null} yestext the text that is written on that button, that brings pos. feedback (null to hide)
		 * @param {String|null} notext the text that is written on that button, that brings neg. feedback (null to hide)
		 * @param {Function} cb the callback function that is called, when on of the buttons is clicked
		 */
		function showAddProject(title, projMessage, placeMessage, yestext, notext, cb) {
			var html = '<div class="dialog add_project">'+
							'<strong>'+title+'</strong>'+
							'<p>'+projMessage+''+ 
								'<input type="text" rel="project"/>'+
							'</p>'+
							'<p>'+placeMessage+''+ 
								'<span class="input-row">'+
									'<input type="text" rel="place" />'+
									'<a class="browse"></a>'+
								'</span>'+
							'</p>'+
							'<p'+(globalConfig.config.use_kit ? '' : ' style="display: none"')+'>'+
								'<span class="input-row">'+
									'<input type="checkbox" name="starter-kit" id="sk"/>'+
									'<label for="sk">'+_('boxes.packager.info.use_kit')+'</label>'+
								'</span>'+
							'</p>'+
							'<div class="actions">'+
								'<button class="yes">'+yestext+'</button>'+
								'<button class="no">'+notext+'</button>'+
							'</div>'+
						'</div>'
			;
			
			overlay.addClass('visible')
				.find('div.content')
				.html(html)
				.find('input[rel="place"], a.browse')
					.bind('click', function() {
						var that = this;
						var file = new air.File();
						function directorySelected(e) {
							file.removeEventListener('select', directorySelected);
							$(that).closest('.input-row').find('input')[0].value = file.nativePath;
							$(that).closest('.input-row').find('input').attr('url', file.url);
						}
						file.addEventListener('select', directorySelected);
						file.browseForDirectory("Wo soll die Config liegen?");
						return false;
					})
					.end()
				.find('button')
					.bind('click', function(e) {
						if($(e.target).is('.yes')) {
							var valid = true;
							$('input.error', overlay).removeClass('error');
							if(!$('input[rel="place"]', overlay).attr('url')) {
								$('input[rel="place"]', overlay).addClass('error').focus();
								valid = false;
							}
							if(!$('input[rel="project"]', overlay)[0].value) {
								$('input[rel="project"]', overlay).addClass('error').focus();
								valid = false;
							}
							if(valid) {
								cb.call(this, 
										$(e.target).is('.yes'), 
										$('input[rel="project"]', overlay)[0].value, 
										$('input[rel="place"]', overlay).attr('url'),
										$('input#sk')[0].checked
								);
							}	
						} else {
							cb.call(this, false);
						}
					})
					.end()
				.find('div.dialog')
					.show()
					.end()
			;
		}
		
		/**
		 * @ignore 
		 * documented in the return
		 */
		function hideOverlay() {
			overlay
				.find('*')
					.unbind('click')
					.unbind('keyup')
					.end()
				.find('div.dialog')
					.hide()
					.remove()
					.end()
				.removeClass('visible')
			;
			visible = false;
			if(queue.length) {
				var next = queue.shift();
				showDialog(next);
			}
		}
		
		/**
		 * @ignore
		 * documented in the return
		 */
		function showDialog(params) {
			tooltip.hide();
			params = $.extend({}, paramDefaults, params);
			if(!nativeWindow.active && !params.noTray) {
				traydock.notify(params);
				if(waiting) {
					hideOverlay();
					waiting = false;
				}
				return;
			}
			if(!nativeWindow.active && params.noTray && !params.invoke) {
				noTrayQueue.push(params);
				return;
			}
			if(waiting) {
				hideOverlay();
				waiting = false;
			}
			if(visible) {
				queue.push(params);
			} else {
				if(params.extra === 'box') {
					window.setTimeout(function() {
						showBox(params.title, params.message, params.type, params.yestext, params.notext, function(positive) {
							if(params.cb && $.isFunction(params.cb)) {
								params.cb(positive);
							}
							hideOverlay();
						});
					}, 0);
				} else if(params.extra === 'package') {
					
					window.setTimeout(function() {
						showAddPackage(params.title, params.message, params.yestext, params.notext, function(positive, packageName) {
							if(positive && packageName) {
								application.addPackage(packageName);
							}
							hideOverlay();
						});
					}, 0);
				} else if(params.extra === 'project') {
					if(typeof params.message === 'string') {
						var tmp = params.message;
						params.message = {};
						params.message.projMessage = tmp;
						params.message.placeMessage = 'Wo liegt das Projekt? ';
					}
					window.setTimeout(function() {
						showAddProject(
							params.title, 
							params.message.projMessage, 
							params.message.placeMessage, 
							params.yestext, 
							params.notext, 
							function(positive, projectName, filePath, starterkit) {
								if(positive && projectName && filePath) {
									var file = new air.File(filePath+'/project.jspackcfg');
									var idx = 1;
									while(file.exists) {
										file = new air.File(filePath+'/project_'+idx+'.jspackcfg');
										idx++;
									}
									application.addProject(projectName, file.nativePath, starterkit);
								}
								hideOverlay();
							}
						);
					}, 0);
				} else if(params.extra ===  'file') { 
					window.setTimeout(function() {
						showSpecifyPath(params.title, params.message, params.yestext, params.notext, function(positive, path) {
							params.cb(positive, path);
							hideOverlay();
						});
					}, 0);
				} else {
					window.setTimeout(function() {
						showBox(params.title, params.message, params.type, params.yestext, params.notext, function(positive) {
							if(params.cb && $.isFunction(params.cb)) {
								params.cb(positive);
							}
							hideOverlay();
						});
					}, 0);
					
					waiting = true;
				}
				visible = true;
			}
		}

		return {
			
			/**
			 * simply returns the instance
			 * 
			 * @returns {jQuery} refernce to the node where the message is 
			 */
			getInstance: function() {
				if(visible) {
					return overlay.find('div.content p');
				}
			},
			
			/**
			 * gets an object as paramter.<br/>
			 * decides on the structure of that which type of box to show<br/>
			 * and adds it to the (noTray-)Queue if already a box is visible
			 * 
			 * @param {Object} params see defaults for that
			 * 
			 */
			showDialog: showDialog,
			
			/**
			 * shorthand function to show errors
			 * 
			 * @param {String} title the title to be shown
			 * @param {String} message the message to tell
			 * @param {Function} cb the function to call after user-action
			 */
			showError: function(title, message, cb) {
				showDialog({
					title: title,
					message: message,
					type: 'error',
					cb: cb
				});
			},
			
			/**
			 * since the waiting box, cannot be hidden by user-action,
			 * we have to call this shit.
			 * 
			 */
			hideWaiting: function() {
				if(waiting) {
					hideOverlay();
					waiting = false;
				}
			},

			/**
			 * this function simply hides any overlay and removes it from the queue
			 */
			hideDialog: hideOverlay
		};
	}();
}(jQuery));