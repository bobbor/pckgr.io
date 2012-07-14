(function($) {
	if(typeof packer === "undefined") { packer = {}; }
	var doc = document;
	

	/**
	 * @function
	 * 
	 * @namespace list
	 */
	list = function() {
		var _ = lang.getText;
		
		function renderProjectList() {
			var i;
			var result = savefile.readProjects();
			var letter = '';
			var project;
			if(result.ok) {
				
				var all = $('#all_packageList').empty();
				var top = $('#recent_packageList').find('ol').remove().end();
				var list;
				var projectList = result.list.projects;
				var recentList = result.list.top4;
				
				top = $('<ol></ol>').appendTo(top);
				$('#all_packageList').removeClass('empty');
				if(!projectList.length) { $('#all_packageList').addClass('empty'); }
				projectList.sort(function(a,b) {
					for(var i = 0, len = Math.min(a.name.length, b.name.length); i < len; i++) {
						if(a.name.toUpperCase().charCodeAt(i) !== b.name.toUpperCase().charCodeAt(i)) {
							return a.name.toUpperCase().charCodeAt(i) - b.name.toUpperCase().charCodeAt(i);
						}
					}
					return a.name.length - b.name.length;
				});
				for(i = 0; i < projectList.length; i++) {
					if(letter !== projectList[i].name.toUpperCase().charAt(0)) {
						letter = projectList[i].name.toUpperCase().charAt(0);
						$('<h4><span>'+letter+'</span></h4>').appendTo(all);
						list = $('<ol></ol>').appendTo(all);
					}
					for(var j = 0, jlen = recentList.length; j < jlen; j++) {
						if(projectList[i].url === recentList[j]) {
							$('#list_item').tmpl({
								name: projectList[i].name,
								url: projectList[i].url,
								configureName: _("tooltip.list.configure", projectList[i].name),
								packName: _("tooltip.list.pack", projectList[i].name),
								deleteName: _("tooltip.list.delete", projectList[i].name)
							}).appendTo(top);
							break;
						}
					}
					$('#list_item').tmpl({
						name: projectList[i].name,
						url: projectList[i].url,
						configureName: _("tooltip.list.configure", projectList[i].name),
						packName: _("tooltip.list.pack", projectList[i].name),
						deleteName: _("tooltip.list.delete", projectList[i].name)
					}).appendTo(list);
				}
				
				traydock.createMenu(result.list);
	
				$('#wrapper')[globalConfig.config.show_recent ? 'removeClass' : 'addClass']('norecent');
				$('#wrapper')[globalConfig.config.use_kit ? 'addClass' : 'removeClass']('use_kit');
			}
		}
		
		function bindEvents() {
			$('#packageList').delegate('li', 'dblclick', function(e) {
				var elm = $(e.target).is('li') ? $(e.target) : $(e.target).closest('li');
				if(e.target.nodeName === 'A') { return; }
				var url = elm.find('a:first').attr('rel');
				var name = elm.attr('rel');
				if (globalConfig.config.dblpack) {
					var ret = configfile.changeConfigFile(url);
					if(ret.ok) {
						ret = configfile.readConfig();
						if(ret.ok) {
							ret = packager.pack(ret.config, filemanager.getFile(url));
							if(ret.ok) {
								savefile.addMostRecent(url);
								renderProjectList();
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
					} else {
						boxes.showError(_('boxes.header.error'), _('boxes.list.error.changeProject', name));
					}
				} else {
					details.renderDetails(url, name);
				}
			});
			
			$('#packageList').delegate('a', 'click', function(e) {
				
				var kind = e.target.getAttribute('class');
				var url = e.target.getAttribute('rel');
				var name = $(e.target).closest('li').attr('rel');
				var ret;
				
				switch(kind) {
					case 'config':
						details.renderDetails(url, name);
						$('#wrapper').addClass('details');
						break;
					case 'pack':
						ret = configfile.changeConfigFile(url);
						if(ret.ok) {
							ret = configfile.readConfig();
							if(ret.ok) {
								ret = packager.pack(ret.config, filemanager.getFile(url));
								if(ret.ok) {
									savefile.addMostRecent(url);
									renderProjectList();
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
						} else {
							boxes.showError(_('boxes.header.error'), _('boxes.list.error.changeProject', name));
						}
						break;
					case 'delete':
						if(globalConfig.config.show_warning) {
							boxes.showDialog({
								title: _('boxes.header.warning'), 
								message: _('boxes.list.warning.deleteProject', name), 
								type: 'warning', 
								yestext: _('boxes.buttons.yestext.normal'),
								notext: _('boxes.buttons.notext.normal'), 
								cb: function(ok) {
									if(ok) {
										var ret = savefile.deleteItem(url);
										tooltip.hide();
										if(ret.ok) {
											renderProjectList();
										}
									}
								}
							});
						} else {
							ret = savefile.deleteItem(url);
							tooltip.hide();
							if(ret.ok) {
								renderProjectList();
							}
						}
						break;
					default:
						break;
				}
				return false;
			});
			
			$('#packageList button').click(function(e) {
				boxes.showDialog({ 
					title: _('boxes.header.info'),
					message: {
						projMessage: _('boxes.list.info.addProject.projectName'),
						placeMessage: _('boxes.list.info.addProject.projectPath')
					},
					notext: _('boxes.buttons.notext.cancel'),
					extra: 'project'
				});
			});
			
			doc.getElementById('packageList').addEventListener('dragenter', function(e) {
				if(e.dataTransfer) {
					e.dataTransfer.setData("application/x-vnd.adobe.air.file-list", "");
					e.dataTransfer.effectAllowed = "copyMove";
				}
			});
			
			doc.getElementById('packageList').addEventListener('dragover', function(e) {
				e.preventDefault();
			});
			
			doc.getElementById('packageList').addEventListener('drop', function(e) {
				var files = e.dataTransfer.getData("application/x-vnd.adobe.air.file-list");
				for (var i = 0, len = files.length; i < len; i++) {
					if (files[i].extension !== 'jspackcfg' && files[i].extension !== 'jspackconfig') {
						continue;
					}
					var ret = filemanager.readContent(files[i]);
					if(ret.ok) {
						var ret2 = filemanager.parse(ret.content);
						if(ret2.ok) {
							application.addProject(ret2.config.name, files[i].url);
						} else {
							boxes.showError(_('boxes.header.error'), _('boxes.list.error.dropParse', files[i].name));
						}
					} else {
						boxes.showError(_('boxes.header.error'), _('boxes.list.error.dropRead', files[i].name));
					}
				}
				e.stopPropagation();
			}, false);
		}
		return {
			fillProjectList: renderProjectList,
			init: function() {
				bindEvents();
				renderProjectList();
			}
		};
		
	}();
}(jQuery));