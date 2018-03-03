"use strict";
//Globalvariables

var USERNAME;
var REPONAME;
var REPOID;
var CID;
var is_login = false;
var per_page = 10;

// AJAX cache on

$(function(){
	$.ajaxSetup ({
		cache: true
	});
});

// Markdown

var marked = require('marked');

// Main

$(document).ready(function(){
	$.ajax({url:"src/config.json", async:true, success: function(config){
		USERNAME = config.username;
		REPONAME = config.reponame;
		REPOID = config.repoid;
		CID = config.cid;
		document.title = config.title;
		per_page = config.per_page;
		$("#blogtitle").text(config.title);
		$("#version").text('Ver ' + config.version);
		$("#abouttext").text(config.about);
		$.each(config.links, function(index, item){
			$("#links").append('<li><a rel="nofollow" target="_blank" href="'+item.src+'">'+item.name+'</a></li>');
		});
		motionIntegrator.bootstrap();
		is_login = Logincheck();
		GetContent();
	}});
});

// Methods

/*
 * Main Methods
 * $param type
 * 0:HomePage; 1:BlogPage; 2:TagPage;
 */

function GetContent(){
	switch(GetUrlValue('type')){
		case '1': //Blog page
			Loader.getOneBlog(GetUrlValue('aid'));
			break;
		case '2': //Tag page
			Loader.getTagBlogs(GetUrlValue('tag'));
			break;
		case '3': //Login
			Login(GetUrlValue('code'));
			break;
		default: //Home page
			$("#headcontainer").velocity('transition.expandIn');
			Loader.getMetadata(GetUrlValue('page')||1);
			Loader.getBlogs(GetUrlValue('page')||1);
	}
	Loader.getBlogList();
}


var Loader = {
	num: 0,
	getNone: function(){
		console.log('null');
	},
	getMetadata: function(page){
		$.get("https://api.github.com/repos/"+USERNAME+"/"+REPONAME+AuthGet(), function(data){
			var max_pn = Math.ceil(data.open_issues / per_page);
			var cur_pn = page;
			
			$("#pagination").show();
		});
	},
	getOneBlog: function(id){
		$("#mainloader").show();
		$.get("https://api.github.com/repos/"+USERNAME+"/"+REPONAME+"/issues/"+id+AuthGet(), function(data){
			$("#mainloader").hide();
			$("#backbtn").show();
			$("#blog-main").addClass("blog-main-after");
			var html = "<div id=\"blog-content\" class=\"p-2 blog-content\">";
			html += "<h3 class=\"blog-post-title\">" + data.title + "</h3>";
			html += "<p class=\"blog-post-meta\">" + ConvTime(data.created_at) + " by <a href=\"" + data.user.html_url + "\">" + data.user.login + "</a></p>";
			if(data.labels){
				html += "<p class=\"blog-post-lables\">";
				$.each(data.labels, function(index, item){
					html += "<a class=\"badge badge-success mr-1\" href=\"?type=2&tag=" + item.name + "\">" + item.name + "</a>";
				});
				html += "</p>";
			}
			html += "<p>" + marked(data.body) + "</p>";
			html += "</div><!-- /.blog-post -->";
			$("#blog-main").append(html);
			$("#blog-content").velocity('transition.fadeIn');
			$.getScript("src/js/lib/highlight.min.js", PrettifyCode);
			if(data.comments){
				Loader.getComments(id);
			}
			$.getScript("https://cdn.bootcss.com/mathjax/2.7.2/MathJax.js?config=TeX-AMS-MML_HTMLorMML"); //MathJax.js
		});
	},
	getComments: function(id){
		var temp = '<div id="comloader" class="p-2"><div class="loader--audioWave"></div></div>';
		temp += '<div id="comments" class="p-2"><h4 class="font-italic">Comments</h4><hr /></div>';
		$("#blog-main").append(temp);
		$.get("https://api.github.com/repos/"+USERNAME+"/"+REPONAME+"/issues/"+id+"/comments"+AuthGet(), function(data){
			$("#comloader").hide();
			$.each(data, function(index, item){
				var html = "<div class=\"p-2 blog-comment\">";
				html += "<p class=\"blog-post-meta\"><a target=\"_blank\" href=\"" + item.user.html_url + "\">" + item.user.login + "</a> " + ConvTime(item.created_at) + "</p>";
				html += "<p>" + marked(item.body) + "</p>";
				html += "</div><!-- /.blog-comment -->";
				$("#comments").append(html);
			});
		});
	},
	getBlogs: function(page){
		$("#mainloader").show();
		$.get("https://api.github.com/repos/"+USERNAME+"/"+REPONAME+"/issues"+AuthGet()+"&state=open&page="+page+"&per_page="+per_page, function(data){
			$("#mainloader").hide();
			$.each(data, function(index, item){
				var html = "<div class=\"p-2 blog-post\">";
				html += "<h3 class=\"blog-post-title\"><a style=\"color:black;text-decoration:none;\" href=\"?type=1&aid=" + item.number + "\">" + item.title + "</a></h3>";
				html += "<p class=\"blog-post-meta\">" + ConvTime(item.created_at) + " by <a target=\"_blank\" href=\"" + item.user.html_url + "\">" + item.user.login + "</a></p>";
				html += "<p>" + SubText(item.body, item.number) + "</p>";
				html += "</div><!-- /.blog-post -->";
				$("#blog-post").append(html);
			});
			$("#blog-post").velocity('transition.fadeIn');
		});
	},
	getBlogList: function(){
		$("#sideloader").show();
		$.get("https://api.github.com/repos/"+USERNAME+"/"+REPONAME+"/issues"+AuthGet()+"&state=open&per_page="+per_page, function(data){
			$("#sideloader").hide();
			$.each(data, function(index, item){
				$("#side-list").append("<li><a href=\"?type=1&aid=" + item.number + "\">" + item.title + "</a></li>");
			});
			$("#side-list").velocity('transition.fadeIn');
		});
	},
	getTagBlogs: function(tag){
		$("#mainloader").show();
		$.get("https://api.github.com/repos/"+USERNAME+"/"+REPONAME+"/issues"+AuthGet()+"&state=open&labels="+tag, function(data){
			$("#mainloader").hide();
			$("#blog-main").append('<div class="p-2"><h2>#'+tag+'</h2><hr /></div>');
			$.each(data, function(index, item){
				var html = "<div class=\"p-2 blog-post\">";
				html += "<h3 class=\"blog-post-title\"><a style=\"color:black;text-decoration:none;\" href=\"?type=1&aid=" + item.number + "\">" + item.title + "</a></h3>";
				html += "<p class=\"blog-post-meta\">" + ConvTime(item.created_at) + " by <a href=\"" + item.user.html_url + "\">" + item.user.login + "</a></p>";
				html += "<p>" + SubText(item.body, item.number) + "</p>";
				html += "</div><!-- /.blog-post -->";
				$("#blog-main").append(html);
			});
		});
	},
	searchBlog: function(qstr){
		$.get("https://api.github.com/search/issues?q="+qstr+"+user:"+USERNAME+"+repo:"+REPONAME+"+state:open&sort=created&order=desc", function(data){
			$.each(data.items, function(index, item){
				//
			});
		});
	},
	getArticles: function(){
		$.get("https://api.github.com/repositories/"+REPOID+"/contents/articles", function(data){
			$("#loader").hide();
			$("#list #articles").html("");
			$.each(data, function(index, item){
				$("#list #articles").append("<li><a target=\"_blank\" href=\"" + item.path + "\">" + item.name + "</a></li>");
			});
		});
	}
}

// Highlight.js

function PrettifyCode(){
	$('pre code').each(function(i, block) {
		hljs.highlightBlock(block);
	});
}

// Login

function AuthGet(){
	if(is_login){
		return '?access_token='+$.cookie('actoken');
	}else{
		return '?';
	}
}

function Logincheck(){
	if($.cookie('actoken') != "null" && $.cookie('actoken')){
		$.ajax({
			url: "https://api.github.com/user?access_token="+$.cookie('actoken'),
			success: function(data){
				$("#loginbtn").hide();
				$("#loginafter").show();
				$("#userDropdown").text(data.login);
			},
			error: function(){
				Logout();
			}
		});
		return true;
	}else{
		return false;
	}
}

function Login(str){
	if(str){
		$("#mainloader").show();
		$("#loginbtn").hide();
		$.get("http://www.hiyouga.top/html/blog/src/server/login.php?code="+str, function(data){
			data = JSON.parse(data);
			$.cookie('actoken', data.access_token, {expires: 30});
			goHome();
		});
	}else{
		window.location.href = 'https://github.com/login/oauth/authorize?client_id='+CID+'&redirect_uri=&scope&allow_signup=true';
	}
}

function Logout(){
	$.cookie('actoken', null);
	goHome();
}

// Functions

var GetUrlValue = function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        try {
            return decodeURIComponent(r[2]);
        } catch (e) {
            return null;
        }
    }
    return null;
}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function ConvTime(str){
	var nst = new Date(str);
	return nst.Format("yyyy-MM-dd HH:mm:ss");
}

function goHome(){
	window.location.href = '?type=0';
}

function goBack(){
	window.history.back();
}

function SubText(blogtext, num){
	var Length = blogtext.length;
	var maxn = 200;
	if(Length > maxn){
		return blogtext.substring(0, maxn) + "…… <a href=\"?type=1&aid="+ num + "\">阅读全文 &raquo;</a>";
	}else{
		return blogtext;
	}
}

// Backtop

var THRESHOLD = 50;
var $top = $('.back-to-top');

$(window).on('scroll', function () {
	$top.toggleClass('back-to-top-on', window.pageYOffset > THRESHOLD);
	var scrollTop = $(window).scrollTop();
	var docHeight = $('#content').height();
	var winHeight = $(window).height();
	var contentMath = (docHeight > winHeight) ? (docHeight - winHeight) : ($(document).height() - winHeight);
	var scrollPercent = (scrollTop) / (contentMath);
	var scrollPercentRounded = Math.round(scrollPercent*100);
	var scrollPercentMaxed = (scrollPercentRounded > 100) ? 100 : scrollPercentRounded;
	$('#scrollpercent>span').html(scrollPercentMaxed);
});

$top.on('click', function () {
	$('body').velocity('scroll');
});