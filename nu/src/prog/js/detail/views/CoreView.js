/*globals require:true */
/*jslint white:true */
(function(window) {
	"use strict";
	var
		  F        = window.Sluraff
		, $        = window.jQuery
		, _        = window._
		, Backbone = window.Backbone
		, features = new F.defs.FeatureCollection()
		, r        = require('path').resolve
	;

	F.defs.CoreView = Backbone.View.extend({
		el: 'body',
		events: {
			'click #project-items li': 'switchFeature'
		},
		initialize: function() {
			var detailsHeader = new F.defs.DetailsHeaderView({
				el: $('#project-details header')
			});
			this.hint = $('#hint');
			// #feature_content_space
			this.listenTo(features, 'add', this.newFeature);
			this.listenTo(features, 'reset', this.allFeatures);
			this.listenTo(features, 'all', this.render);

			features.fetch();

		},
		newFeature: function(model, collection, opts) {

			// Item View is controlled by Sluraff itself
			var projectItem = new F.defs.ItemView({
				model: model
			});
			$('#project-items ol', this.el).append(projectItem.render().el);

			// SpaceView predefines the html, but logic and view is controlled by the feature
			var headerSpace = new F.defs.SpaceView({
				model: model,
				template: '#headerspace-template',
				logic: 'header'
			});
			$('#feature_header_space', this.el).append(headerSpace.render().el);

			var footerLeftView = new F.defs.SpaceView({
				model: model,
				template: '#footerleftspace-template',
				logic: 'footer_left'
			});
			$('#feature_footer1_space', this.el).append(footerLeftView.render().el);

			var footerRightView = new F.defs.SpaceView({
				model: model,
				template: '#footerrightspace-template',
				logic: 'footer_right'
			});
			$('#feature_footer2_space', this.el).append(footerRightView.render().el);

			// ContentView is entirely controlled by the feature
		},
		allFeatures: function() {
			console.log('allFeatures', this, arguments)
		},
		switchFeature: function(idx) {
			if(idx === idx+0) {
				$('.target.current').removeClass('current');
				var t = $('#project-items ol li')
							.removeClass('active')
							.eq(idx)
							.addClass('active')
							.attr('data-target')
				;
				$('.target.'+t).addClass('current');
				return false;
			} else {
				return this.switchFeature($(idx.currentTarget).index());
			}
		},
		render: function() {
			if(features.length) {
				this.switchFeature(0);
				this.hint.hide()
			} else {
				this.hint.show()
			}
		}
	});
}(this));