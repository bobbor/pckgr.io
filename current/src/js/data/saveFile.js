(function($) {
	if(typeof packer === "undefined") { packer = {}; }
	
	/**
	 * makes all static methods and fields publicly available
	 * 
	 * @function
	 * @namespace configures the writing of the 'projects.json'
	 * stored in the application storage directory
	 */
	packer.savefile = function() {
		var _ = packer.lang.getText;
		
		/**
		 * holds the reference to the projects.json
		 */
		var projectsfile;
		
		/**
		 * the config object representing the content of the projectsfile
		 */
		var projectlist = {
				top4: [],
				projects: []
			}
		;
		if(!readProjects().ok) {
			packer.boxes.showError(_('boxes.header.error'), _('boxes.savefile.error.projectRead'));
		}
		
		
		/**
		 * @ignore
		 * documented in return
		 */
		function readProjects() {
			var i, found = false;
			if(!projectsfile) {
				projectsfile = air.File.applicationStorageDirectory.resolvePath("projects.json");
			}
			var file = packer.filemanager.readContent(projectsfile);
			if(!file.ok) {
				projectlist = {
						top4: [],
						projects: []
					};
				if (writeProjects()) {
					return {
						ok: true,
						list: projectlist
					};
				}
				return {
					ok: false
				};
			} else {
				try {
					projectlist = JSON.parse(file.content);	
				} catch(e) {
					try {
						projectlist = eval('('+file.content+')');
					} catch(ex) {
						packer.boxes.showError({
							title: _('boxes.header.error'), 
							message: _('boxes.savefile.error.projectParse'),
							yestext: _('boxes.buttons.yestext.edit'),
							notext: _('boxes.buttons.notext.cancel'),
							cb: function(ok) {
								if(ok) {
									packer.editor.openJSON(file.content, function(result) {
										if(result.ok) {
											projectlist = result.json;
											writeProjects();
										}
									});
								}
							}
						});
						
						return {
							ok: false,
							list: projectlist
						};
					}
				}
				
				if (!projectlist) {
					projectlist = {
						projects: [], 
						top4: []
					};
				}
				for(i = 0; i < projectlist.projects.length; i++) {
					projectlist.projects[i].readableURL = new air.File(projectlist.projects[i].url).nativePath;
				}
				for(i = 0; i < projectlist.top4.length; i++) {
					if(typeof projectlist.top4[i] === 'number') {
						found = true;
						projectlist.top4[i] = projectlist.projects[projectlist.top4[i]].url;
					}
				}
			}
			if(found) {
				writeProjects();
			}
			return {
				ok: true,
				list: projectlist
			};
		}
		
		/**
		 * writes the current projectlist to projectsfile
		 * 
		 * @return {Boolean} true if successful, false if it fails
		 */
		function writeProjects() {
			if (packer.filemanager.writeContent(projectsfile, JSON.stringify(projectlist, null, '\t')).ok) {
				return true;
			}
			return false;
		}
		
		/**
		 * @ignore 
		 * documented in return
		 */
		function deleteItem(item) {
			var len;
			if (typeof item === 'string') {
				len = projectlist.projects.length;
				iteration:
				while(len--) {
					if(projectlist.projects[len].url === item) {
						break iteration;
					}
				}
				if(len === -1) {
					return {
						ok: false,
						list: projectlist
					};
				}
				projectlist.projects = HelperJS.remove(projectlist.projects, len);
				projectlist.top4 = HelperJS.remove(projectlist.top4, projectlist.top4.indexOf(item));
			
				
				if(writeProjects()) {
					return {
						ok: true,
						list: projectlist
					};
				}
				return {
					ok: false,
					list: projectlist
				};
			}
			return {
				ok: false,
				list: projectlist
			};
		}
		
		/**
		 * @ignore
		 * documented in return
		 */
		function addMostRecent(item) {
			if(projectlist.top4.indexOf(item) !== -1) {
				projectlist.top4 = HelperJS.remove(projectlist.top4, projectlist.top4.indexOf(item));
			}
			item = [item];
			projectlist.top4 = item.concat(projectlist.top4);
			if(projectlist.top4.length > 4) {
				projectlist.top4.pop();
			}
			
			if(writeProjects()) {
				return {
					ok: true,
					list: projectlist
				};
			}
			return {
				ok: false,
				list: projectlist
			};
		}
		
		/**
		 * @scope packer.savefile
		 */
		return {
			/**
			 * delete the specified item
			 * @function
			 * 
			 * @param {String, Number} item the url or index of the file to delete
			 * 
			 * @returns {Object}<br/>
			 * <code><strong>ok:</strong> {Boolean} if delete was successful</code><br/>
			 * <code><strong>list:</strong> {Object} the new list of projects</code>
			 */
			deleteItem: deleteItem,
			
			/**
			 * adds the passed item to the list of most recent packed 
			 * 
			 * @function
			 * @param {String} item the url of the project that should be added
			 * 
			 * @returns {Object}<br/>
			 * <code><strong>ok:</strong> {Boolean} if delete was successful</code><br/>
			 * <code><strong>list:</strong> {Object} the new list of projects</code>
			 */
			addMostRecent: addMostRecent,
			
			/**
			 * reads the projectsfile and returns it parsed if successful
			 * 
			 * @function
			 * @returns {Object}<br/>
			 * <code><strong>ok:</strong> {Boolean} if reading and parsing was successful</code><br/>
			 * <code><strong>list:</strong> {Object} the projectlist</code>
			 */
			readProjects: readProjects,
			/**
			 * simply returns the current projectlist
			 * 
			 * @returns {Object} the current list of projects
			 */
			getConfig: function() {
				return projectlist;
			},
			
			/**
			 * adds an item to the current list of projects
			 * 
			 * @param {Object} item the item to be added<br/>
			 * <code><strong>name:</strong>the name of the project</code><br/>
			 * <code><strong>url: </strong>the url of the project</code><br/>
			 * <code><strong>quiet: </strong>if adding should fail quietly <em>(Optional)</em></code>
			 * 
			 * @returns {Object}<br/>
			 * <code><strong>ok:</strong> {Boolean} if adding was successful</code><br/>
			 * <code><strong>list:</strong> {Object} the new list of projects</code><br/>
			 * <code><strong>status:</strong> {Number} param invalid(1), already around(2), all cool(3), could not write(4)</code>
			 */
			addItem: function(item) {
				// is the parameter correct?
				if (!(item && item.name && item.url)) {
					return {
						ok: false,
						status: 1,
						list: projectlist
					};
				}
				// create projects array if it is the first entry
				if(typeof projectlist.projects === "undefined") {
					projectlist.projects = [];
				}
				
				// walk through projects array to see if it is around already
				for (var i = 0; i < projectlist.projects.length; i++) {
					// the exactly same project already exists
					if (projectlist.projects[i].name === item.name && projectlist.projects[i].url === item.url && !item.quiet) {
						return {
							ok: false,
							status: 2,
							list: projectlist
						};
						// if the URL matches, the name was changed by hand.. 
					} else if (projectlist.projects[i].url === item.url) {
						projectlist.projects[i].name = item.name;
						if (writeProjects()) {
							// we're done
							return {
								ok: true,
								status: 3,
								list: projectlist
							};
						} else {
							return {
								ok: false,
								status: 4,
								list: projectlist
							};
						}
					}
				}
				item.readableURL = new air.File(item.url).nativePath;
				projectlist.projects.push(item);
				if(!writeProjects()) {
					return {
						ok: false,
						status: 4,
						list: projectlist
					};
				}
				//current = item;
				return {
					ok: true,
					status: 0,
					list: projectlist
				};
			},
			
			/**
			 * gets the name of the specified to the specified url
			 * 
			 * @param {String} url the url to be looked for
			 * 
			 * @returns {Object}<br/>
			 * <code><strong>ok:</strong> {Boolean} if a project for the url was found</code><br/>
			 * <code><strong>list:</strong> {Object} the name of the project ('' if false)</code>
			 */
			getNameOfProject: function(url) {
				var name;
				var projects = projectlist.projects;
				var i = projects.length;
				url = url || '';
				iteration:
				while(i--) {
					if(projects[i].url === url) {
						name = projects[i].name;
						if(!projects[i].readableURL) {
							projects[i].readableURL = new air.File(projects[i].url).nativePath;
						}
						//current = projects[i];
						break iteration;
					}
				}
				return {
					ok: (name !== ''),
					name: name
				};
			},
			
			/**
			 * looks for the url-specified project and changes its name
			 * 
			 * @param {String} projectURL the url looking for
			 * @param {String} name the new name of the project
			 * 
			 * @returns {Object}<br/>
			 * <code><strong>ok:</strong> {Boolean} if url was found and list has been written</code><br/>
			 * <code><strong>list:</strong> {Object} the current list (changed or unchanged depends on "ok"}</code>
			 */
			changeProjectName: function(projectURL, name) {
				var projects = projectlist.projects;
				var i = projects.length;
				var url = '';
				iteration:
				while(i--) {
					if(projects[i].url === projectURL) {
						projects[i].name = name;
						if(!projects[i].readableURL) {
							projects[i].readableURL = new air.File(projects[i].url).nativePath;
						}
						break iteration;
					}
				}
				if(writeProjects()) {
					return {
						ok: true,
						list: projectlist
					};
				} else {
					return {
						ok: false,
						list: projectlist
					};
				}
			}
		};
	}();
}(jQuery));
