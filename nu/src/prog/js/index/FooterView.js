/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  F        = window.Sluraff
		, $        = window.jQuery
		, _        = window._
		, Backbone = window.Backbone
		, fs       = require('fs')
		, gui      = require('nw.gui')
	;

	F.defs.FooterView = Backbone.View.extend({
		events: {
			"click button.create": "createNewProject",
			"click button.import-file": "importFromFile",
			"click button.import-folder": "importFromFolder"
		},
		createNewProject: function() {
			var win = gui.Window.open('create.html', {
				title: 'Create new Project',
				toolbar: true,
				position: 'mouse',
				height: 350,
				width: 500,
				resizable: false,
				'always-on-top': true
			});
			win.on('loaded', function() {
				win.window.SluraffBridge = function(inst, method, val) {
					F.inst[inst][method](val);
				}
			})
		},
		importFromFile: function() {
			$('#fileImportDialog')
				.one('change', function() {
					var file = this.files[0];
					var name = file.name;
					var fileref;
					if(!/\D+\.sluraff$/.test(name)) {
						alert('not a valid project file.');
						return;
					}
					fileref = new F.defs.FileBridge(file.path);
					fileref.read(function(success, data) {
						if(!success) {
							alert('file could not be read');
							return;
						}
						data = JSON.parse(data);
						data.url = file.path;
						F.inst.saveFile.create(data);
					});
				})
				.trigger('click')
		},
		importFromFolder: function() {
			$('#folderImportDialog')
				.one('change', function() {
					var folder = this.value, file, fileref;
					// testing for existing sluraff
					var files = fs.readdirSync(folder);
					for(var i = 0;i<files.length;i++) {
						file = files[i];
						if(/\w+\.sluraff$/.test(file)) {
							fileref = new F.defs.FileBridge(folder+'/'+file);
							fileref.read(function(success, data) {
								if(!success) {
									alert('file could not be read');
									return;
								}
								data = JSON.parse(data);
								data.url = folder+'/'+file;
								F.inst.saveFile.create(data);
							});
							return;
						}
					}
					alert('support for legacy projects not yet implemented');
				})
				.trigger('click')
		}
	});
}(this));