// AJAX cache on
$(function(){
     $.ajaxSetup ({
         cache: true
     });
});

// Main
$(document).ready(function(){
	switch(GetUrlValue('type')){
		case '1':
			GetOneBlog(GetUrlValue('aid'));
			break;
		case '2':
			break;
		case '3':
			break;
		default:
			$("#headimg").show();
			$("#hshade").show();
			GetBlogs();
	}
	GetBlogList();
});
// Methods
function GetNone(){
	;
}

function GetOneBlog(i){
	$("#mainloader").show();
	$.get("https://api.github.com/repos/hiyouga/hiyouga-blog-project/issues/"+i, function(data){
		$("#mainloader").hide();
		$("#backbtn").show();
		$("#blog-main").addClass("blog-main-after");
		//reg = new RegExp("\\r\\n", "g");
		html = "<div class=\"p-2 blog-content\">";
		html += "<h3 class=\"blog-post-title\">" + data.title + "</h3>";
		html += "<p class=\"blog-post-meta\">" + ConvTime(data.created_at) + " by <a href=\"" + data.user.html_url + "\">" + data.user.login + "</a></p>";
		//blogtext = data.body.replace(reg, '<br />');
		blogtext = data.body;
		html += "<p>" + marked(blogtext) + "</p>";
		html += "</div><!-- /.blog-post -->";
		$("#blog-main").append(html);
	});
}

function GetBlogs(){
	$("#mainloader").show();
	$.get("https://api.github.com/repos/hiyouga/hiyouga-blog-project/issues?state=open", function(data){
		$("#mainloader").hide();
		$.each(data, function(index, item){
			html = "<div class=\"p-2 blog-post\">";
			html += "<h3 class=\"blog-post-title\">" + item.title + "</h3>";
			html += "<p class=\"blog-post-meta\">" + ConvTime(item.created_at) + " by <a href=\"" + item.user.html_url + "\">" + item.user.login + "</a></p>";
			var Length = item.body.length;
			var maxn = 200;
			if(Length > maxn){
				blogtext = item.body.substring(0, maxn) + "……";
			}else{
				blogtext = item.body;
			}
			html += "<p>" + blogtext + "<a href=\"?type=1&aid=" + item.number + "\">阅读更多</a></p>";
			html += "</div><!-- /.blog-post -->";
			$("#blog-main").append(html);
		});
	});
}

function GetBlogList(){
	$("#sideloader").show();
	$.get("https://api.github.com/repos/hiyouga/hiyouga-blog-project/issues?state=open", function(data){
		$("#sideloader").hide();
		$.each(data,function(index,item){
			$("#side-list").append("<li><a href=\"?type=1&aid=" + item.number + "\">" + item.title + "</a></li>");
		});
	});
}

function GetArticles(){
	$.get("https://api.github.com/repositories/91178023/contents/articles", function(data){
		$("#loader").hide();
		$("#list #articles").html("");
		$.each(data, function(index, item){
			$("#list #articles").append("<li><a target=\"_blank\" href=\"" + item.path + "\">" + item.name + "</a></li>");
		});
	});
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

function goback(){
	window.history.go(-1);
}