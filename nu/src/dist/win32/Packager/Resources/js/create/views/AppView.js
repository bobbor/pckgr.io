(function(window, undefined) {
	var f = window.Frontender;
	var $s = f.$script;
	$s.ready(['jquery', '_', 'backbone', 'ContentView', 'FooterView'], function() {
		f.AppView = f.Backbone.View.extend({
			el: 'body',
			initialize: function() {

				var footer = new f.FooterView({
					el: f.$('footer', this.el)
				});
				var content = new f.ContentView({
					el: f.$('#content', this.el)
				});

				footer.listenTo(content, 'step_change', footer.adjustButtons);
				content.listenTo(footer, 'step_back', content.goBack);
				content.listenTo(footer, 'step_forward', content.goForward);

				content.postStepChange();
			}
		})
	});
}(this, void 0))