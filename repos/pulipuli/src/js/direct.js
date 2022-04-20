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
		var postdata = {
			"link": link,
			"password": GetUrlValue("password"),
			"docid": GetUrlValue("docid"),
			"reqhost": "bhpan.buaa.edu.cn",
			"usehttps": true,
			"savename": "default"
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
				raise();
			}
		});
	}
});
