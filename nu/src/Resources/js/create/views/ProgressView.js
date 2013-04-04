(function(window, undefined) {
	var f = window.Frontender;
	var $s = f.$script;

	$s.ready(['jquery', '_', 'backbone'], function() {
		f.ProgressView = f.Backbone.View.extend({
			initialize: function() {
				var that = this;
				ctx = this.el.getContext('2d');

				/* these are the 4 core values for progress
				 * a height (h) of 20 and a verticalpadding (y) of 8 gives the bar a height of 4px
				 * a width (w) of 200 and a horizpadding (x) of 10 gives the bar a width of 180px */
				w = this.$el.width();
				h = this.$el.height();
				y = 8;
				x = 10;
				this.adjust = w-x-x;
				var bgGrad = ctx.createLinearGradient(x,y,x,h-y);
				bgGrad.addColorStop(0, '#aaaaaa');
				bgGrad.addColorStop(1, '#c8c8c8');

				var fgGrad = ctx.createLinearGradient(x,y,x,h-y);
				fgGrad.addColorStop(0, '#93bdd2');
				fgGrad.addColorStop(1, '#3b87ad');

				this.p = 0;
				this.a = 0;


				this.draw(ctx, bgGrad, fgGrad, x, y, w, h);
				window.setInterval(function() {
					that.draw(ctx, bgGrad, fgGrad, x, y, w, h);
				}, 1000/30);
			},
			adjustProgress: function(past, future) {
				var steps = past+future+1;
				this.p = ((past+(past/(steps-1)))*this.adjust)/steps;
			},
			draw: function(ctx, bg, fg, x, y, w, h) {
				if(Math.abs((this.p-this.a)/4.5) < 0.1) {
					this.a = this.p;
				}
				this.a += (this.p-this.a)/3;

				ctx.clearRect(0,0,w,h);
				ctx.fillStyle = bg;
				ctx.beginPath();
				ctx.moveTo(x,y);
				ctx.lineTo(w-x,y);
				ctx.arcTo(w,h/2,w-x,h-y,h/2-y);
				ctx.lineTo(w-x,h-y);
				ctx.lineTo(x,h-y);
				ctx.arcTo(0,h/2,x,y,h/2-y);
				ctx.lineTo(x, y);
				ctx.fill();
				ctx.closePath();

				ctx.fillStyle = fg;
				ctx.beginPath();
				ctx.moveTo(x,y);
				ctx.lineTo(this.a+x,y);
				ctx.arcTo(this.a+x+x,h/2,this.a+x,h-y,h/2-y);
				ctx.lineTo(this.a+x,h-y);
				ctx.lineTo(x,h-y);
				ctx.arcTo(0,h/2,x,y,h/2-y);
				ctx.lineTo(x, y);
				ctx.fill();
				ctx.closePath();
			}
		});
	});
}(this, void 0))