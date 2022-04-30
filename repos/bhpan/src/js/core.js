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
	var savename = GetUrlValue("savename");
	var vtt = GetUrlValue("vtt");
	const player = new Plyr("#player", {
		title: savename,
		settings: ["captions", "speed", "loop"],
		blankVideo: "https://cdn.plyr.io/static/blank.mp4",
		invertTime: false
	});
	if (link != null) {
		var postdata = {
			"link": link,
			"password": GetUrlValue("password"),
			"docid": GetUrlValue("docid"),
			"reqhost": "bhpan.buaa.edu.cn",
			"usehttps": true,
			"savename": savename
		}
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "https://bhpan.buaa.edu.cn/api/v1/link?method=osdownload",
			data: JSON.stringify(postdata),
			timeout: 30000,
			success: function(data, status) {
				var vlink = data.authrequest[1];
				var tracks = new Array();
				if (vtt != null) {
					var langs = vtt.split(",");
					for (var i = 0; i < langs.length; i++) {
						tracks.push({
							kind: "captions",
							label: langs[i],
							srclang: langs[i],
							src: "vtt/" + savename + "." +  langs[i] +  ".vtt"
						});
					}
					tracks[0].default = true;
				}
				player.source = {
					type: "video",
					title: savename,
					sources: [{
						src: vlink,
						type: "video/mp4"
					}],
					tracks: tracks
				}
				$("#loading").hide();
				$("#player").show();
			},
			error: function(xhr) {
				$("#info").text("视频无法加载");
				console.log(xhr.status + xhr.statusText);
			}
		});
	} else {
		$("#info").text("视频无法加载");
	}
});
