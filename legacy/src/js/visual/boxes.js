(function($) {
	packer.boxes = function() {
		var _ = packer.lang.getText;
		
		var overlay;
		$(function() {
			overlay = $('<div id="overlay"><a class="close"></a><div class="content"></div></div>')
							.bind('keyup', function(e) {
								if(e.keyCode === 27) { hideOverlay(); }
							})
							.appendTo('body');
		});
		
		var visible = false;
		var waiting = false;
		var queue = [];
		var noTrayQueue = [];
		
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
		
		nativeWindow.addEventListener('activate', function() {
			if(noTrayQueue.length) {
				for(var i = 0, len = noTrayQueue.length; i < len; i++) {
					var next = noTrayQueue.shift();
					next.noTray = false;
					showDialog(next);
				}
			}
		});
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
							'<p'+(packer.globalConfig.config.use_kit ? '' : ' style="display: none"')+'>'+
								'<span class="input-row">'+
									'<input type="checkbox" name="starter-kit" id="sk"/>'+
									'<label for="sk">'+_('boxes.packer.info.use_kit')+'</label>'+
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
		
		function showDialog(params) {
			packer.tooltip.hide();
			params = $.extend({}, paramDefaults, params);
			if(!nativeWindow.active && !params.noTray) {
				packer.traydock.notify(params);
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
								packer.application.addPackage(packageName);
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
									packer.application.addProject(projectName, file.nativePath, starterkit);
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
			getInstance: function() {
				if(visible) {
					return overlay.find('div.content p');
				}
			},
			showDialog: showDialog,
			showError: function(title, message, cb) {
				showDialog({
					title: title,
					message: message,
					type: 'error',
					cb: cb
				});
			},
			hideWaiting: function() {
				if(waiting) {
					hideOverlay();
					waiting = false;
				}
			},
			hideDialog: hideOverlay
		};
	}();
}(jQuery));