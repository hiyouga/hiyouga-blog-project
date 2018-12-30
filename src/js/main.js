"use strict";
require.config({
	paths : {
		"jquery" : "lib/jquery-3.3.1.min",
		"jquery-cookie" : "lib/jquery.cookie.min",
		"velocity" : "lib/velocity.min",
		"velocity-ui" : "lib/velocity.ui.min",
		"bootstrap" : "lib/bootstrap.bundle.min",
		"marked" : "lib/marked.min",
		"fancybox" : "lib/jquery.fancybox.min",
		"lazyload" : "lib/jquery.lazyload.min",
		"fastclick" : "lib/fastclick"
	},
	shim: {
		"jquery-cookie" : {deps:["jquery"]},
		"bootstrap" : {deps:["jquery"]},
		"fancybox" : {deps:["jquery"]},
		"velocity" : {deps:["jquery"]},
		"velocity-ui" : {deps:["velocity"]},
		"motion" : {deps:["velocity-ui"]},
		//"lazyload" : {deps:["jquery"]},
		"core" : {deps:["jquery", "jquery-cookie", "marked", "fancybox", "velocity", "velocity-ui", "motion", "fastclick"]}
	}
})

require(['jquery', 'jquery-cookie', 'velocity', 'velocity-ui', 'bootstrap', 'marked', 'fancybox', 'motion', 'core'], function() {
	console.log("Load completed!")
});
