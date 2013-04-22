(function(window) {
	"use strict";
	var
		  F        = window.Sluraff
		, $        = window.jQuery
		, _        = window._
		, Backbone = window.Backbone
		, gui      = require('nw.gui')
		, winref   = global.windows.detail
		, fileref
	;
	window.opener && window.opener.Sluraff && (
		$.extend(true, F, global.windows.main.window.Sluraff)
	);
	$(function() {
		var win = winref[F.queries.id][0];
		F.basis = winref[F.queries.id][1];

		fileref = new F.defs.FileBridge(F.basis.get('url'));

		fileref.read(function(success, data) {
			if(!success) {
				alert('file could not be read');
				window.close();
				return;
			}
			var data = JSON.parse(data);

			F.basis.set('features', data.features.map(function(feature) {
				return feature.name
			}));
			F.basis.set('name', data.name);
			win.title = data.name;
			F.basis.save();

			F.inst.CoreModel = new F.defs.CoreModel(data);
			var core = new F.defs.CoreView({
				model: F.inst.CoreModel
			});

			F.inst.CoreModel.on('change:name', function(model, val, opts) {
				F.basis.set('name', val);
				F.basis.save();
				win.title = val;
			});
			F.inst.CoreModel.on('change:features', function(model, val, opts) {
				F.basis.set('features', data.features.map(function(feature) {
					return feature.name
				}));
				F.basis.save();
			});
		});
	});
}(this));