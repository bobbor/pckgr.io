/**
 * @author Philipp
 */
(function($) {

	/**
	 * @function
	 * 
	 * @namespace details
	 */
	details = function() {
		var _ = lang.getText;
		
		var detailsElm;
		var currentURL;
		var currentName;
		
		function renderDetails( url, name ) {
			var ret = configfile.changeConfigFile(url, name);
			var config;
			if(ret.ok) {
				currentURL = url;
				currentName = name;
				ret = configfile.readConfig();
				if(ret.ok) {
					var project = ret.config;
					currentName = project.name;
					if(currentName !== name) {
						savefile.changeProjectName(url, currentName);
						list.fillProjectList();
					}
					$('> h2', detailsElm).html('<a data-title="'+_("tooltip.details.back")+'"></a><span>'+project.name+'</span>');
					$('span.URL', detailsElm).html(new air.File(url).nativePath);
					
					var packCount = 0;
					var fileCount = 0;
					var nolint = '';
					var nopack = '';
					var j = 0;
					var packages = project.packageList;
					var fileListHTML = $('#fileList > ol').html('<li><a class="add_package" data-title="'+_("tooltip.details.addPackage")+'"></a></li>');
					
					for(var pack in packages) {
						if(packages.hasOwnProperty(pack)) {
							packCount++;
							
							$('#package_item').tmpl({
								active: (packCount === 1) ? ' class="active"' : '',
								pack: pack,
								packDelete: _("tooltip.details.deletePackage", pack),
								fileName: _("details.package.fileName"),
								addFiles: _("details.package.addFile"),
								libImport: _("details.package.libraryImport"),
								url: currentURL
							}).appendTo(fileListHTML);
							
							var packageList = fileListHTML.find('ol:last')
							var fileList = packages[pack];
							
							for(var i = 0, len = fileList.length; i < len; i++) {
								if(!fileList[i]) { continue; }
								fileCount++;
								nolint = (project.nolint.indexOf(fileList[i]) !== -1 || project.nolint.indexOf(fileList[i].substring(fileList[i].lastIndexOf('/')+1, fileList[i].length)) !== -1) ? 'checked="checked"' : '';
								nopack = (project.nopack && (project.nopack.indexOf(fileList[i]) !== -1 || project.nopack.indexOf(fileList[i].substring(fileList[i].lastIndexOf('/')+1, fileList[i].length)) !== -1)) ? 'checked="checked"' : '';
								$('#file_item').tmpl({
									pack: pack,
									nolint: nolint,
									nopack: nopack,
									fileName: fileList[i],
									fileNameDelete: _("tooltip.details.deleteFile", fileList[i])
								}).appendTo(packageList);
							}
							j++;
						}
					}
					detailsElm.find('p.info').html(_("details.info.packages",'<span class="packs">'+packCount+'</span>')+' | '+_("details.info.files",'<span class="files">'+fileCount+'</span>'));
					
					$('#projectDetails button').attr('data-url', currentURL);
					tooltip.hide();
					$('#wrapper').addClass('details');
					return {
						ok: true
					};
				} else {
					boxes.showDialog({
						title:_('boxes.header.error'), 
						message: _('boxes.configfile.error.configparse'), 
						type: 'error', 
						yestext: _('boxes.buttons.yestext.edit'), 
						notext: _('boxes.buttons.notext.cancel'),
						cb: function(ok) {
							if(ok) {
								ret = filemanager.readContent(url);
								if(ret.ok) {
									editor.openJSON(ret.content, function(data) {
										if(data.ok) {
											ret = filemanager.parse(data.json);
											if(ret.ok) {
												configfile.createConfig(ret.config);
												if(configfile.writeConfig()) {
													boxes.showDialog({
														title: _('boxes.header.success'), 
														message: _('boxes.configfile.success.configwrite'), 
														type: 'success'
													});
												} else {
													boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.configwrite'));
												}
											}
										}
									});
								} else {
									boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.configread'));
								}
							}
						}
					});
				}
			} else {
				boxes.showError(_('boxes.header.error'), _('boxes.list.error.changeProject'), '');
			}
			(!globalConfig.config.lint) && $('button.lint').css({display: 'none'});
		}
		
		function bindEvents(context) {
			$('h2', context[0])
				.delegate('a', 'click', function() {
					list.fillProjectList();
					tooltip.hide();
					$('#wrapper').removeClass('details');
				})
				.delegate('span', 'click', function(e) {
					var isCancel = false;
					var curName = e.target.innerText;
					if(e.target.nodeName === 'A') { return; }
					e.target.contentEditable = true;
					$(e.target).bind('keypress keyup', function(ev) {
						if(ev.keyCode === 13) {
							e.target.blur();
						}
						if(ev.keyCode === 27) {
							isCancel = true;
							e.target.blur();
						}
					}).bind('blur', function(ev) {
						$(e.target).unbind('keypress keyup blur');
						e.target.contentEditable = false;
						if(!isCancel) {
							configfile.setOption('name', e.target.innerText);
							savefile.changeProjectName(currentURL, e.target.innerText);
							list.fillProjectList();	
						} else {
							e.target.innerText = curName;
						}
						isCancel = false;
					});
					e.target.focus();
					return false;
				})
			;
			
			$('span.URL', context[0]).bind('click', function() {
				var url = filemanager.getFile(this.innerText);
				url.parent.openWithDefaultApplication();
			});
			
			context.delegate('button.lint','click', function() {
				var output = '';
				var pkgCount = 0;
				var errorCount = 0;
				var found = false;
				var prop;
				var hintErrors = {};
				var i, len;
				var url = $(this).attr('data-url');
				var ret = configfile.readConfig();
				var list;
				var files;
				var cfg;
				
				boxes.showDialog({
					title: _('boxes.header.waiting'),
					message: _('boxes.validator.waiting.validate'),
					type: 'waiting',
					yestext: null,
					extra: 'waiting'
				});
				if(ret.ok) {
					cfg = ret.config;
					list = cfg.packageList;
					for(prop in list) {
						if(list.hasOwnProperty(prop)) {
							files = list[prop];
							len = files.length;
							for(i = 0; i < len; i++) {
								if(cfg.nolint.indexOf(files[i]) !== -1 || 
										cfg.nolint.indexOf(files[i].substring(files[i].indexOf('/')+1, files[i].length)) !== -1) { 
									continue; 
								}
								ret = filemanager.readContent(new air.File(url).parent.nativePath+'/'+files[i]+'.js');
								if(ret.ok) {
									if(!JSHINT(ret.content, lintConfig.config)) {
										hintErrors[files[i]] = JSHINT.errors;
									}
								}
							}
						}
					}
					
					for(prop in hintErrors) {
						if(hintErrors.hasOwnProperty(prop)) {
							len = hintErrors[prop].length;
							for(i = 0; i < len; i++) {
								if(hintErrors[prop][i]) {
									found = true;
									errorCount++;
								}
							}
							if(found) {
								pkgCount++;
							}
						}
					}
					if(errorCount !== 0) {
						output = errorCount+' Fehler in '+pkgCount+' Dateien';
					} else {
						output = 'Keine Fehler gefunden. <br/>Happy Packing';
					}
					boxes.hideWaiting();
					boxes.showDialog({
						title: _('boxes.header.info'),
						message: output,
						yestext: _('boxes.buttons.yestext.ok'),
						notext: (errorCount === 0) ? null : _('boxes.buttons.notext.moreInfo'),
						cb: function(ok) {
							var props;
							if(!ok) {
								output = '';
								for(props in hintErrors) {
									if(hintErrors.hasOwnProperty(props)) {
										output += props+':\n';
										len = hintErrors[props].length;
										for(i = 0; i < len; i++) {
											if(hintErrors[props][i]) {
												output += '\tZeile ' + hintErrors[props][i].line + ': ' + hintErrors[props][i].reason + '\n';
												output += hintErrors[props][i].evidence + '\n';
											}
										}
									}
								}
								editor.open(output, null, '', 'Ok');
							}
						}
					});
					
				}
			});
			context.delegate('button.pack', 'click', function() {
				var url = $(this).attr('data-url');
				ret = configfile.readConfig();
				if(ret.ok) {
					ret = packager.pack(ret.config, filemanager.getFile(url));
					savefile.addMostRecent(url);
					list.fillProjectList();
					if(ret.ok) {
						savefile.addMostRecent(url);
					} else {
						switch(ret.status) {
						case 0:
							boxes.showError(_('boxes.header.error'), _('boxes.packager.error.noPackages', name));
							break;
						case 1:
							boxes.showError(_('boxes.header.error'), _('boxes.packager.error.emptyPackages', name));
							break;
						}
					}
				} else {
					boxes.showDialog({
						title: _('boxes.header.error'), 
						message: _('boxes.configfile.error.configparse'), 
						type: 'error', 
						yestext: _('boxes.buttons.yestext.edit'), 
						notext: _('boxes.buttons.notext.cancel'), 
						cb: function(ok) {
							if(ok) {
								ret = filemanager.readContent(url);
								if(ret.ok) {
									editor.openJSON(ret.content, function(data) {
										if(data.ok) {
											ret = filemanager.parse(data.json);
											if(ret.ok) {
												configfile.createConfig(ret.config);
												if(configfile.writeConfig()) {
													boxes.showDialog({
														title: _('boxes.header.success'), 
														message: _('boxes.configfile.success.configwrite'), 
														type: 'success'
													});
												} else {
													boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.configwrite'));
												}
											}
										}
									});
								} else {
									boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.configread'));
								}
							}
						}
					});
				}
			});
			
			$('#fileList').delegate('input', 'click', function() {
				if(this.checked) {
					this.setAttribute('checked', 'checked');
				} else {
					this.removeAttribute('checked');
				}
				var ret = configfile.setOption(this.name, this.getAttribute('rel'));
				if(!ret.ok) {
					switch(ret.status) {
					case 0:
						boxes.showError(_('boxes.header.error'), _('boxes.details.error.unknownOption', this.name));
						break;
					case 1:
						boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.configwrite'));
						break;
					}
				}
			});
			context.delegate('#fileList h3', 'mousedown', function(e) {
	
				li = $(this).closest('li');
				if(!li.is('.active')) { 
					$('#fileList .active').removeClass('active');
					li.addClass('active');
				}
				e.target.moving = true;
				$.data(e.target, 'clientX', e.clientX);
				$.data(e.target, 'left', parseInt($(e.target).css('left'), 10) || 1);
				return false;
				
			}).delegate('#fileList h3', 'mousemove', function(e) {
				if(e.target.moving) {
					var elm = $(e.target).closest('li');
					var oldPos = $(e.target).find('a').attr('rel');
					var newPos;
					var diff = e.clientX - $.data(e.target, 'clientX');
					var newElm, togglePos;
					var ret;
					if(diff > 0) { //moving right
						newElm = elm.next();
						togglePos = newElm.length ? newElm.offset().left - (newElm.outerWidth()/2) : 0;
					} else { // moving left
						newElm = elm.prev();
						togglePos = newElm.length ? newElm.offset().left + (newElm.outerWidth()/2) : 0;
					}
					if(newElm.length && !newElm.find('a.add_package').length) {
						newPos = newElm.find('a').attr('rel');
						$(e.target).css({left: $.data(e.target, 'left') + diff});
						if(diff > 0) {
							if($(e.target).offset().left > togglePos) {
								newElm.insertBefore(elm);
								$(e.target).trigger('mouseup').css({left: $.data(e.target, 'left')});
								ret = configfile.switchPackage(oldPos, newPos);
								if(!ret.ok) {
									boxes.showError(_('boxes.header.error'), _('boxes.details.error.movePackage'));
								}
							}
						} else if(diff < 0) {
							if($(e.target).offset().left < togglePos) {
								newElm.insertAfter(elm);
								$(e.target).trigger('mouseup').css({left: $.data(e.target, 'left')});
								ret = configfile.switchPackage(oldPos, newPos);
								if(!ret.ok) {
									boxes.showError(_('boxes.header.error'), _('boxes.details.error.movePackage'));
								}
							}
						}
	
						return false;
					} else {
						$(e.target).css({left: $.data(e.target, 'left')});
						return false;
					}
				}
				
			}).delegate('#fileList h3', 'mouseup', function(e) {
				e.target.moving = false;
				return false;
			});
			
			
			
			
			context.delegate('#fileList a', 'click', function(e) {
				var pack;
				var ret;
				
				function selectHandler(e) {
					file.removeEventListener('selectMultiple', selectHandler);
					var ret;
					for(var i = 0, len = e.files.length; i < len; i++) {
						ret = configfile.addFile(pack, file.getRelativePath(e.files[i]));
						if(ret.ok) {
							name = file.getRelativePath(e.files[i]);
							name = name.substring(0, name.lastIndexOf('.'));
						
							rowHTML = '<li><span class="col col_80"><a data-package="'+pack+'" rel="'+name+'">delete</a>'+name+'</span>'+
							'<span class="col col_10"><input type="checkbox" name="nopack" rel="'+name+'"/></span>'+
							'<span class="col col_10"><input type="checkbox" name="nolint" rel="'+name+'"/></span></li>';
							$('#fileList li.active li:last').after(rowHTML);
							context.find('p.info span.files').text(parseInt(context.find('p.info span.files').text(), 10)+1);
						} else {
							switch(ret.status) {
							case 0:
								boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.configwrite'));
								break;
							case 1:
								boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.fileExists', file.getRelativePath(e.files[i])));
								break;
							}
						}
					}
				}
				
				
				if($(e.target).is('.add_file')) {
					pack = e.target.getAttribute('data-package');
					var file = filemanager.getFile(this.getAttribute('data-url'));
					file = file.parent;
					var jsFilter = new air.FileFilter("Javascript", "*.js");
					
					var rowHTML;
					var name;
	
					file.addEventListener('selectMultiple', selectHandler);
					file.browseForOpenMultiple("Suche", [jsFilter]);
				} else if($(e.target).is('.import_fb')) {
					libhandler.setBasics(e.target.getAttribute('data-package'), 
							e.target.getAttribute('data-url'));
					$('#lib-layer').removeClass('hidden');
					return false;
				} else if ($(e.target).is('.delete')) {
					pack = e.target.getAttribute('rel');
					var li = $(e.target).closest('li');
					if(globalConfig.config.show_warning) {
						boxes.showDialog({
							title: _('boxes.header.warning'), 
							message: _('boxes.details.warning.deletePackage', pack), 
							type: 'warning',
							yestext: _('boxes.buttons.yestext.normal'), 
							notext: _('boxes.buttons.notext.safety'), 
							cb: function(ok) {
								if(ok) {
									var ret = configfile.deletePackage(pack);
									if(ret.ok) {
										if(li.is('.active')) {
											if(li.prev().length && !li.prev().find('a:first').is('.add_package')) {
												li.prev().addClass('active');
											} else if(li.next().length) {
												pack = li.next().addClass('active').find('> h3 > a').attr('rel');
												configfile.setOption('includeSmallLoader', pack);
											}
										}
										$(e.target).closest('li').remove();
										context.find('p.info span.packs').text(parseInt(context.find('p.info span.packs').text(), 10)-1);
									} else {
										boxes.showError(_('boxes.header.error'),_('boxes.details.error.deletePackage', pack));
									}
								}
							}
						});
						
					} else {
						ret = configfile.deletePackage(pack);
						if(ret.ok) {
							if(li.is('.active')) {
								if(li.prev().length && !li.prev().find('a:first').is('.add_package')) {
									li.prev().addClass('active');
								} else {
									pack = li.next().addClass('active').find('> h3 > a').attr('rel');
									configfile.setOption('includeSmallLoader', pack);
								}
							}
							$(e.target).closest('li').remove();
							context.find('p.info span.packs').text(parseInt(context.find('p.info span.files').text(), 10)-1);
						}
					}
					
				} else if ($(e.target).is('.add_package')) {
					boxes.showDialog({
						title: _('boxes.header.info'), 
						message: _('boxes.details.info.addPackage'), 
						notext: _('boxes.buttons.notext.cancel'), 
						extra: 'package'
					});
					
				} else {
					if(globalConfig.config.show_warning) {
						boxes.showDialog({
							title: _('boxes.header.warning'), 
							message: _('boxes.details.warning.deleteFile', e.target.getAttribute('rel')), 
							type: 'warning',
							yestext: _('boxes.buttons.yestext.normal'), 
							notext: _('boxes.buttons.notext.safety'),
							cb: function(ok) {
								if(ok) {
									ret = configfile.deleteFile(e.target.getAttribute('data-package'), e.target.getAttribute('rel'));
									if(ret.ok) {
										$(e.target).closest('li').remove();
										context.find('p.info span.files').text(parseInt(context.find('p.info span.files').text(), 10)-1);
									}
								}
							}
						});
					} else {
						ret = configfile.deleteFile(e.target.getAttribute('data-package'), e.target.getAttribute('rel'));
						if(ret.ok) {
							$(e.target).closest('li').remove();
							context.find('p.info span.files').text(parseInt(context.find('p.info span.files').text(), 10)-1);
						}
					}
				}
			});
			
			(function() {
				var content;
				var index;
				var files = $('#projectDetails .active ol.files');
				
				var li;
				var detailsElm;
				
				document.getElementById('fileList').addEventListener('dragstart', function(e) {
					var elm = $(e.target);
					content = elm[0].outerHTML;
					index = elm.index() - 1;
					e.dataTransfer.effectAllowed = 'move';
					elm.addClass('dropArea').css({
						opacity: 0.25
					});
				});
				
				document.getElementById('projectDetails').addEventListener('dragover', function(e) {
					files = $('#projectDetails .active ol.files');
					li = $(e.target).is('li') ? $(e.target) : $(e.target).closest('li');
					if(!li.parent().is('ol.files')) { return; }
					detailsElm = li.closest('.details');
					e.preventDefault();
					if(!files.find('li.dropArea').length) {
						li[li.is(':last') ? 'before' : 'after']('<li style="height: '+li.height()+'px" class="dropArea"></li>');
					}
					if(!files.length || !li.length || !files.find('li.dropArea').length || li.is('.head')) { return; }
					
					if(li[0].offsetTop < detailsElm.scrollTop() + 30) {
						detailsElm.scrollTop(detailsElm.scrollTop() - 5);
					} else if(li[0].offsetTop > detailsElm.scrollTop() + 2*(detailsElm.height()/3)) {
						detailsElm.scrollTop(detailsElm.scrollTop() + 5);
					}
					if(!li.is('.dropArea')) {
						if(li[0].offsetTop < files.find('li.dropArea')[0].offsetTop) {
							li.before(files.find('li.dropArea'));
						} else {
							li.after(files.find('li.dropArea'));
						}
					}
				});
				
				document.getElementById('projectDetails').addEventListener('dragenter', function(e) { e.preventDefault(); });
				
				document.body.addEventListener('drop', function(e) {
					if(!files.length || $(e.target).closest('li').is('.head')) {
						var da = files.find('li.dropArea');
						e.dataTransfer.dropEffect = 'none';
						if(da.html() === '') {
							da.remove();
						} else {
							da.removeClass('dropArea').css({opacity: ''});
						}
						return;
					}
					var pack = $(e.target).closest('ol.files').attr('data-pack');
					if(typeof index !== 'undefined' && content) {
						// we moved internally
						var ret = configfile.switchFile(pack, index, $(e.target).closest('li').index() - 1);
						if(!ret.ok) {
							switch(ret.status) {
							case 0:
								boxes.showError(_('boxes.header.error'), _('boxes.details.error.moveFile'));
								break;
							case 1:
								boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.configwrite'));
								break;
							}
						}
						$(e.target).closest('li').removeClass('dropArea').css({opacity: ''});
					} else {
						nativeWindow.activate();
						var curDir = $('#projectDetails span.URL').text();
						curDir = new air.File(curDir);
						curDir = curDir.parent;
						var name;
						li = $('#projectDetails li.active li.dropArea');
						
						var drops = e.dataTransfer.getData('application/x-vnd.adobe.air.file-list');
						var len = drops.length;
						var i = 0;
						var timer = window.setInterval(function() {
							name = curDir.getRelativePath(drops[i]);
							if(name === null) {
								boxes.showError(_('boxes.header.error'), _('boxes.details.error.directoryMismatch'));
								clearInterval(timer);
								li.remove();
								return;
							}
							var ending = name.substring(name.lastIndexOf('.')+1, name.length);
							var ret = configfile.addFile(pack, name);
							if(ret.ok) {
								name = name.substring(0, name.lastIndexOf('.'));
								li.before('<li><span class="col col_80"><a data-package="'+pack+'" rel="'+name+'">delete</a>'+name+'</span>'+
								'<span class="col col_10"><input type="checkbox" name="nopack" rel="'+name+'"/></span>'+
								'<span class="col col_10"><input type="checkbox" name="nolint" rel="'+name+'"/></span></li>');
								context.find('p.info span.files').text(parseInt(context.find('p.info span.files').text(), 10)+1);
							} else {
								switch(ret.status) {
								case 1:
									boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.fileExists', ret.name));
									break;
								case 0:
									boxes.showError(_('boxes.header.error'), _('boxes.configfile.error.configwrite'));
									break;
								case 2:
									boxes.showError(_('boxes.header.error'), _('boxes.details.error.fileMisMatch', ending));
									break;
								case 3:
									boxes.showError(_('boxes.header.error'), _('boxes.details.error.directoryMismatch'));
								}
							}
							if(i++ === len-1) {
								window.clearInterval(timer);
								li.remove();
							}
						}, 15);
					}
				});
			})();
		}

		return {
			renderDetails: renderDetails,
			addPackage: function(pack, url) {
				$('#projectDetails').find('p.info span.packs').text(parseInt($('#projectDetails').find('p.info span.packs').text(), 10)+1);
				$('#fileList > ol li.active').removeClass('active');
				$('<li class="active"><h3>'+pack+'<a class="delete" rel="'+pack+'" data-title="'+pack+' löschen">löschen</a></h3>'+
				'<div class="details"><ol class="files" data-pack="'+pack+'"><li class="head">'+
				'<span class="col col_80">DateiName</span><span class="col col_10">nopack?</span><span class="col col_10">nolint?</span>'+
				'</li></ol></div><div class="last-item"><a class="add_file" data-url="'+url+'" data-package="'+pack+'">Datei(en) hinzufügen</a>'+
				'<a class="import_fb" data-url="'+url+'" data-package="'+pack+'">Aus dem FB importieren</a></div></li>').appendTo('#fileList > ol');
			},
			addFile: function(pack, name) {
				name = name.substring(0, name.lastIndexOf('.'));
			
				rowHTML = '<li><span class="col col_80"><a data-package="'+pack+'" rel="'+name+'">delete</a>'+name+'</span>'+
				'<span class="col col_10"><input type="checkbox" name="nopack" rel="'+name+'"/></span>'+
				'<span class="col col_10"><input type="checkbox" name="nolint" rel="'+name+'"/></span></li>';
				$('#fileList li.active li:last').after(rowHTML);
				detailsElm.find('p.info span.files').text(parseInt(detailsElm.find('p.info span.files').text(), 10)+1);
			},
			init: function() {
				detailsElm = $('#projectDetails');
				bindEvents(detailsElm);
			}
		};
	}();
}(jQuery));