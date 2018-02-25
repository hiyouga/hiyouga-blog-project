$(document).ready(function(){
	var motionIntegrator = {
		queue: [],
		cursor: -1,
		add: function (fn) {
			this.queue.push(fn);
			return this;
		},
		next: function () {
			this.cursor++;
			var fn = this.queue[this.cursor];
			$.isFunction(fn) && fn(motionIntegrator);
		},
		bootstrap: function () {
			this.next();
		}
	};
	var motionMiddleWares = {
		title: function (integrator) {
			$("#blogtitle").velocity('transition.slideDownIn', {
				display: null,
				complete: function () {
					integrator.next();
				}
			});
		},
		nav: function (integrator) {
			$("#navbarSupportedContent").velocity('transition.slideDownIn', {
				display: null,
				complete: function () {
					integrator.next();
				}
			});
		},
		blog: function (integrator) {
			$("#blogcontainer").velocity('transition.slideDownIn', {
				display: null,
				complete: function () {
					integrator.next();
				}
			});
		},
		footer: function (integrator) {
			$("#blogfooter").velocity('transition.slideDownIn', {
				display: null,
				complete: function () {
					integrator.next();
				}
			});
		}
	};
	motionIntegrator
		.add(motionMiddleWares.title)
		.add(motionMiddleWares.nav)
		.add(motionMiddleWares.blog)
		.add(motionMiddleWares.footer)

	window.motionIntegrator = motionIntegrator;
	motionIntegrator.bootstrap();
});