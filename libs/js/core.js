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
	if(issueid = GetUrlValue('issues')){
		GetOneIssue(issueid);
	}else{
		GetIssues();
		GetArticles();
	}
});

function GetOneIssue(i){
	$.get("https://api.github.com/repos/hiyouga/hiyouga-blog-project/issues/"+i, function(data){
		$("#data #title").text(data.title);
		$("#data #content").text(data.body.replace('\r\n','<br />'));
	});
}

function GetIssues(){
	$.get("https://api.github.com/repos/hiyouga/hiyouga-blog-project/issues", function(data){
		$.each(data,function(index,item){
			$("#list #issues").append("<li><a href=\"/?issues=" + item.number + "\">" + item.title + "</a></li>");
		});
	});
}

function GetArticles(){
	$.get("https://api.github.com/repositories/91178023/contents/articles", function(data){
		$("#list #articles").html("");
		$.each(data, function(index, item){
			$("#list #articles").append("<li><a target=\"_blank\" href=\"" + item.path + "\">" + item.name + "</a></li>");
		});
	});
}