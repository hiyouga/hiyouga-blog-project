"use strict";

var GetUrlValue = function (name) {
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

$(document).ready(function () {
	var link = GetUrlValue("link");
	if (link != null) {
		var vtt = GetUrlValue("vtt")
		if (vtt == "true") {
			$("#player").append("<track kind=\"captions\" label=\"字幕\" srclang=\"zh\" src=\"vtt/" + GetUrlValue("savename") +  ".vtt\" default />")
		}
		var postdata = {
			"link": link,
			"password": GetUrlValue("password"),
			"docid": GetUrlValue("docid"),
			"reqhost": "bhpan.buaa.edu.cn",
			"usehttps": true,
			"savename": GetUrlValue("savename")
		}
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "https://bhpan.buaa.edu.cn/api/v1/link?method=osdownload",
			data: JSON.stringify(postdata),
			success: function(data, status) {
				var vlink = data.authrequest[1];
				$("#loading").hide();
				$("#player").show();
				$("#vcontent").attr("src", vlink);
				var player = new Plyr("#player");
			},
			error: function(xhr) {
				$("#loading").text("视频无法加载");
				console.log(xhr.status + xhr.statusText);
			}
		});
	} else {
		$("#loading").text("视频无法加载");
	}
});
