$(document).ready(function(){
	GetIssues();
	GetArticles();
});
function GetIssues(){
	$.get("https://api.github.com/repos/hiyouga/hiyouga-blog-project/issues", function(data){
		$("#issues").html("");
		$.each(data,function(index,item){
			$("#issues").append("<li><a href=\"/?issues=" + item.number + "\">" + item.title + "</a></li>");
		});
	});
}
function GetArticles(){
	$.get("https://api.github.com/repositories/91178023/contents/articles", function(data){
		$("#articles").html("");
		$.each(data, function(index, item){
			$("#articles").append("<li><a target=\"_blank\" href=\"" + item.path + "\">" + item.name + "</a></li>");
		});
	});
}