/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  F        = window.Sluraff
		, $        = window.jQuery
		, _        = window._
		, Backbone = window.Backbone
		, feats    = new F.defs.FeatureCollection()
		, r        = require('path').resolve
	;

	F.defs.CoreView = Backbone.View.extend({
		el: 'body',
		initialize: function() {
			var detailsHeader = new F.defs.DetailsHeaderView({
				el: $('#project-details header')
			});
			var features = this.model.get('features'), model;

			// #project-items
			// #feature_header_space
			// #feature_content_space
			// #feature_footer1_space
			// #feature_footer2_space

			this.listenTo(feats, 'add', this.newFeature);

			for(var prop in features) {
				model = new F.defs.Feature({
					name: prop,
					storage: features[prop],
					logic: require(r('./prog/js/features/'+prop+'/init.js'))
				});
				model.save();
				feats.add(model);
			}
		},
		newFeature: function(model, collection, opts) {
			var projectItem = new F.defs.ItemView({
				model: model
			});
			$('#project-items ol', this.el).append(projectItem.render().el);
		}
	});
}(this));