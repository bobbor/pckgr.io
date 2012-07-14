(function (pack, window, undefined) {
	
	var _ = window._;
	
	pack.define('savefile', ['filemanager'], {
		_init: function(fm) {
			this.projectlist = {
				top4: [],
				projects: []
			};
			
			this.projectsfile = undefined;
			this.fm = fm;
		},
		readProjects: function(cb) {
			var i;
			var found = false;
			var that = this;
			var parsed;
			
			if(!that.projectsfile) {
				that.projectsfile = air.File.applicationStorageDirectory.resolvePath("projects.json");
			}
			
			var file = that.fm.readContent(true, projectsfile, function(file) {
				if(!file.ok) {
					that.projectlist = {
						top4: [],
						projects: []
					};
					cb && cb({ok: true});
					return;
				} else {
					that.projectlist = file.parsed;
					
					for(i = 0; i < that.projectlist.projects.length; i++) {
						if(that.projectlist.projects[i].readableURL) { continue; }
						that.projectlist.projects[i].readableURL = new air.File(that.projectlist.projects[i].url).nativePath;
					}
					for(i = 0; i < that.projectlist.top4.length; i++) {
						if(typeof that.projectlist.top4[i] === 'number') {
							that.projectlist.top4[i] = that.projectlist.projects[projectlist.top4[i]].url;
						}
					}
					
					cb && cb({ok: true});
				}
			});
		},
		writeProjects: function(cb) {
			this.fm.writeContent(this.projectsfile, JSON.stringify(this.projectlist, null, '\t'), false, cb);
		},
		addItem: function(item, cb) {
			var that = this;
			// is the parameter correct?
			if (!(item && item.name && item.url)) {
				cb && cb({
					ok: false,
					status: 1
				});
			}
			
			// walk through projects array to see if it is around already
			for (var i = that.projectlist.projects.length; i-- ; ) {
				// the exactly same project already exists
				if (that.projectlist.projects[i].url === item.url) {
					if (that.projectlist.projects[i].name === item.name) {
						cb && cb({
							ok: false,
							status: 2
						});
						return; 
					} else {
						that.projectlist.projects[i].name = item.name;
						cb && cb({
							ok: true,
							status: 3
						});
						return;
					}
				}
			}
			item.readableURL = new air.File(item.url).nativePath;
			that.projectlist.projects.push(item);
			cb && cb({
				ok: true,
				status: 0
			});
		},
		deleteItem: function(item, cb) {
			var len;
			var that = this;
			if (typeof item === 'string') {
				that.projectlist.projects = _.reject(that.projectlist.projects, function(project) {
					return project.url === item;
				});
				that.projectlist.top4 = _(that.projectlist.top4).without(item);
				
				cb({
					ok: true
				});
				return;
			}
			cb({
				ok: false
			});
		},
		addMostRecent: function(item, cb) {
			var idx;
			if(!(item && item.url && item.name)) {
				cb({ ok: false });
			}
			idx = this.projectlist.top4.indexOf(item.url);
			if(idx !== -1) {
				this.projectlist.top4 = _(this.projectlist.top4).without(item.url);
			}
			item = [item.url];
			this.projectlist.top4 = item.concat(this.projectlist.top4);
			if(this.projectlist.top4.length > 4) {
				this.projectlist.top4.pop();
			}
			cb && cb({ok: true});
		},
		getNameOfProject: function(url, cb) {
			cb && cb({
				ok: true, 
				name: _.filter(this.projectlist.projects, function(item) {
							return item.url === url;
						}).name
			});
		},
		changeProjectName: function(url, name, cb) {
			if(!projectURL || !name || typeof name !== 'string') {
				cb && cb({
					ok: false
				});
			}
			
			_.each(this.projectlist.projects, function(project) {
				if(project.url === url) {
					project.name = name;
				}
			});
			
			cb && cb({
				ok: true
			});
		}
	});
	
}(packager, window));
