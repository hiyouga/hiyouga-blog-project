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

$(document).ready(function(){
	switch(GetUrlValue('type')){
		case '1':
			GetOneIssue(GetUrlValue('aid'));
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

function GetOneIssue(i){
	$("#mainloader").show();
	$.get("https://api.github.com/repos/hiyouga/hiyouga-blog-project/issues/"+i, function(data){
		$("#mainloader").hide();
		$("#blog-main").addClass("blog-main-after");
		//reg = new RegExp("\\r\\n", "g");
		html = "<div class=\"p-2 blog-content\">";
		html += "<h3 class=\"blog-post-title\">" + data.title + "</h3>";
		html += "<p class=\"blog-post-meta\">" + data.created_at + " by <a href=\"" + data.user.html_url + "\">" + data.user.login + "</a></p>";
		//blogtext = data.body.replace(reg, '<br />');
		blogtext = data.body;
		html += "<p>" + marked(blogtext) + "</p>";
		html += "</div><!-- /.blog-post -->";
		$("#blog-main").append(html);
	});
}

function GetNone(){
	;
}

function GetBlogs(){
	$("#mainloader").show();
	$.get("https://api.github.com/repos/hiyouga/hiyouga-blog-project/issues?state=open", function(data){
		$("#mainloader").hide();
		$.each(data, function(index, item){
			html = "<div class=\"p-2 blog-post\">";
			html += "<h3 class=\"blog-post-title\">" + item.title + "</h3>";
			html += "<p class=\"blog-post-meta\">" + item.created_at + " by <a href=\"" + item.user.html_url + "\">" + item.user.login + "</a></p>";
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
	$.get("https://api.github.com/repos/hiyouga/hiyouga-blog-project/issues", function(data){
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

$("body").on("click", "img", function(){
	if($(this).attr("src") == undefined){
		//alert($(this).attr("src"));
		var id = $(this).attr("id");
		var img = $(this).attr("imgdata");
		var url = "img.php?url=" + img;
		var xhr = new XMLHttpRequest();
		xhr.open("GET",url,true);
		xhr.responseType = "blob";
		xhr.onload = function() {
			if (this.status == 200) {
				var blob = this.response;
				src = window.URL.createObjectURL(blob);
				$("#"+id).attr("src",src);
			}
		}
		xhr.send();
	}
});