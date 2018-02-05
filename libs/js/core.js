//Globalvariables

var USERNAME = 'hiyouga';
var REPONAME = 'hiyouga-blog-project';
var REPOID = '91178023';
var CID = '9a3a3b26984626c40168';
var is_login = false;

// AJAX cache on

$(function(){
	$.ajaxSetup ({
		cache: true
	});
});

/*
 * Main Methods
 * $param type
 * 0:HomePage; 1:BlogPage; 2:TagPage;
 */

$(document).ready(function(){
	Logincheck();
	switch(GetUrlValue('type')){
		case '1': //Blog page
			GetOneBlog(GetUrlValue('aid'));
			break;
		case '2': //Tag page
			GetTagBlogs(GetUrlValue('tag'));
			break;
		case '3': //Login
			Login(GetUrlValue('code'));
			break;
		default: //Home page
			$("#headcontainer").show();
			GetBlogs();
	}
	GetBlogList();
});

// Methods

function GetNone(){
	console.log('null');
}

function GetOneBlog(i){
	$("#mainloader").show();
	$.get("https://api.github.com/repos/"+USERNAME+"/"+REPONAME+"/issues/"+i+AuthGet(), function(data){
		$("#mainloader").hide();
		$("#backbtn").show();
		$("#blog-main").addClass("blog-main-after");
		html = "<div class=\"p-2 blog-content\">";
		html += "<h3 class=\"blog-post-title\">" + data.title + "</h3>";
		html += "<p class=\"blog-post-meta\">" + ConvTime(data.created_at) + " by <a href=\"" + data.user.html_url + "\">" + data.user.login + "</a></p>";
		if(data.labels){
			html += "<p class=\"blog-post-lables\">";
			$.each(data.labels, function(index, item){
				html += "<button type=\"button\" class=\"btn btn-success btn-sm mr-1\" onclick=\"window.location.href='?type=2&tag='+$(this).text()\">" + item.name + "</button>";
			});
			html += "</p>";
		}
		html += "<p>" + marked(data.body) + "</p>";
		html += "</div><!-- /.blog-post -->";
		$("#blog-main").append(html);
		$.getScript("libs/js/highlight.min.js", function(){
			PrettifyCode(); //highlight.js
		});
		$.getScript("https://cdn.bootcss.com/mathjax/2.7.2/MathJax.js?config=TeX-AMS-MML_HTMLorMML"); //MathJax.js
		if(data.comments){
			GetBlogComments(i);
		}
	});
}

function GetBlogs(){
	$("#mainloader").show();
	$.get("https://api.github.com/repos/"+USERNAME+"/"+REPONAME+"/issues"+AuthGet()+"&state=open", function(data){
		$("#mainloader").hide();
		$.each(data, function(index, item){
			html = "<div class=\"p-2 blog-post\">";
			html += "<h3 class=\"blog-post-title\"><a style=\"color:black;text-decoration:none;\" href=\"?type=1&aid=" + item.number + "\">" + item.title + "</a></h3>";
			html += "<p class=\"blog-post-meta\">" + ConvTime(item.created_at) + " by <a target=\"_blank\" href=\"" + item.user.html_url + "\">" + item.user.login + "</a></p>";
			html += "<p>" + SubText(item.body, item.number) + "</p>";
			html += "</div><!-- /.blog-post -->";
			$("#blog-main").append(html);
		});
	});
}

function GetBlogList(){
	$("#sideloader").show();
	$.get("https://api.github.com/repos/"+USERNAME+"/"+REPONAME+"/issues"+AuthGet()+"&state=open", function(data){
		$("#sideloader").hide();
		$.each(data,function(index, item){
			$("#side-list").append("<li><a href=\"?type=1&aid=" + item.number + "\">" + item.title + "</a></li>");
		});
	});
}

function GetTagBlogs(tag){
	$("#mainloader").show();
	$.get("https://api.github.com/repos/"+USERNAME+"/"+REPONAME+"/issues"+AuthGet()+"&state=open&labels="+tag, function(data){
		$("#mainloader").hide();
		$("#blog-main").append('<div class="p-2"><h2>#'+tag+'</h2><hr /></div>');
		$.each(data, function(index, item){
			html = "<div class=\"p-2 blog-post\">";
			html += "<h3 class=\"blog-post-title\"><a style=\"color:black;text-decoration:none;\" href=\"?type=1&aid=" + item.number + "\">" + item.title + "</a></h3>";
			html += "<p class=\"blog-post-meta\">" + ConvTime(item.created_at) + " by <a href=\"" + item.user.html_url + "\">" + item.user.login + "</a></p>";
			html += "<p>" + SubText(item.body, item.number) + "</p>";
			html += "</div><!-- /.blog-post -->";
			$("#blog-main").append(html);
		});
	});
}

function GetBlogComments(i){
	temp = '<div id="comloader" class="p-2"><div class="loader--audioWave"></div></div>';
	temp += '<div id="comments" class="p-2"><h4 class="font-italic">Comments</h4><hr /></div>';
	$("#blog-main").append(temp);

	$.get("https://api.github.com/repos/"+USERNAME+"/"+REPONAME+"/issues/"+i+"/comments"+AuthGet(), function(data){
		$("#comloader").hide();
		$.each(data,function(index, item){
			html = "<div class=\"p-2 blog-comment\">";
			html += "<p class=\"blog-post-meta\"><a target=\"_blank\" href=\"" + item.user.html_url + "\">" + item.user.login + "</a> " + ConvTime(item.created_at) + "</p>";
			html += "<p>" + item.body + "</p>";
			html += "</div><!-- /.blog-comment -->";
			$("#comments").append(html);
		});
	});
}

function SearchBlogs(qstr){
	$.get("https://api.github.com/search/issues?q="+qstr+"+user:"+USERNAME+"+repo:"+REPONAME+"+state:open&sort=created&order=desc", function(data){
		$.each(data.items, function(index, item){
			//
		});
	});
}

function GetArticles(){
	$.get("https://api.github.com/repositories/"+REPOID+"/contents/articles", function(data){
		$("#loader").hide();
		$("#list #articles").html("");
		$.each(data, function(index, item){
			$("#list #articles").append("<li><a target=\"_blank\" href=\"" + item.path + "\">" + item.name + "</a></li>");
		});
	});
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
	if($.cookie('actoken') != "null"){
		is_login = true;
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
	}
}

function Login(str){
	if(str){
		$("#mainloader").show();
		$("#loginbtn").hide();
		$.get("http://www.hiyouga.top/html/blog/libs/server/login.php?code="+str, function(data){
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
	nst = new Date(str);
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
		return blogtext.substring(0, maxn) + "…… <a href=\"?type=1&aid="+ num + "\">阅读全文 »</a>";
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