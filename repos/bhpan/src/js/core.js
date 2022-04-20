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
		var enable_vtt = GetUrlValue("enable_vtt")
		if (enable_vtt == "true") {
			$("#vcaption").attr("src", "vtt/" + GetUrlValue("savename") + ".vtt");
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
				$("#dl-btn").show();
				$("#dl-btn").attr("href", vlink);
				$("#vcontent").attr("src", vlink);
				var player = new Plyr("#player");
			},
			error: function(xhr) {
				console.log(xhr.status + xhr.statusText);
			}
		});
	} else {
		$("#loading").text("视频无法加载");
	}
});
