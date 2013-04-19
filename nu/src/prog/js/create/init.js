/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  F        = window.Sluraff
		, $        = window.jQuery
		, _        = window._
		, Backbone = window.Backbone
		, mainF    = global.windows.main.window.Sluraff
	;

	window.opener && window.opener.Sluraff && (
		$.extend(true, F, window.opener.Sluraff)
	);
	var flatten = function(s/*erializedArray*/) {
		var ret = {};
		for(var i = 0; i < s.length; i++) {
			if(ret[s[i].name] && !_.isArray(ret[s[i].name])) {
				ret[s[i].name] = [ret[s[i].name]];
			}
			if(_.isArray(ret[s[i].name])) {
				ret[s[i].name].push(s[i].value);
			} else {
				ret[s[i].name] = s[i].value;
			}
		}
		return ret;
	};

	$(function() {
		var mainContent = $('#content > div');
		F.inst.createSteps = new F.defs.CreateSteps();

		var createProcess = new F.defs.ProcessView({
			el: mainContent
		});
		var footerView = new F.defs.CreateFooterView({
			el: $('footer')
		});

		footerView.on('goForth', function() {
			if(footerView.forth.is('.done')) {
				var steps = $('form', mainContent);
				var data = steps.map(function() { return $(this).serializeArray(); }).get();
				data = flatten(data);
				data.url += '/project.sluraff';
				data.id = F.guid();
				mainF.inst.saveFile.create(data);
				window.close();
			}
		});

		createProcess.on('indexChange', function() {
			var steps = $('form', mainContent);
			var data = F.inst.createSteps.map(function(model) {
				if(model.id === 'result') { return {}; }
				return {
					form: model.view.$el.find('form').serializeArray(),
					data: model.toJSON()
				};
			}).filter(function(item) {
				return 'form' in item;
			});
			F.inst.createSteps.get('result').set('data', data);
		});

		createProcess.listenTo(footerView, 'goForth', createProcess.goForth);
		createProcess.listenTo(footerView, 'goBack', createProcess.goBack);
		footerView.listenTo(createProcess, 'indexChange', footerView.onIndexChange);
	});
}(this))