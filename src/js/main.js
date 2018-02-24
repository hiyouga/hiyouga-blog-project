require.config({
	paths : {
		"jquery" : ["https://cdn.bootcss.com/jquery/3.3.1/jquery.min", "lib/jquery-3.3.1.min"],
		"jquery-cookie" : ["https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min", "lib/jquery.cookie.min"],
		"velocity" : ["lib/velocity.min", "https://cdn.bootcss.com/velocity/2.0.0/velocity.min"],
		"velocity-ui" : ["lib/velocity.ui.min", "https://cdn.bootcss.com/velocity/2.0.0/velocity.ui.min"],
		"bootstrap" : ["https://cdn.bootcss.com/bootstrap/4.0.0/js/bootstrap.bundle.min", "lib/bootstrap.bundle.min"],
		"marked" : ["lib/marked.min", "https://cdn.bootcss.com/marked/0.3.12/marked.min"],
		"fancybox" : ["https://cdn.bootcss.com/fancybox/3.2.5/jquery.fancybox.min", "lib/jquery.fancybox.min"]
	},
	shim: {
		"jquery-cookie": ["jquery"],
		"bootstrap": ["jquery"],
		"fancybox": ["jquery"],
		"velocity": ["jquery"],
		"velocity-ui": ["velocity"],
		"core": ["jquery", "jquery-cookie", "marked", "fancybox", "velocity-ui"]
	}
})

require(['jquery', 'jquery-cookie', 'velocity', 'velocity-ui', 'bootstrap', 'marked', 'fancybox', 'core'], function() {
	console.log("Load completed!")
});