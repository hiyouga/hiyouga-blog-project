"use strict";

var GetUrlValue = function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substring(1).match(reg);
    if (r != null) {
        try {
            return decodeURIComponent(r[2]);
        } catch (e) {
            return null;
        }
    }
    return null;
}

function matchlink(text, reg, urlbase) {
    var allmatch = text.match(reg);
    if (allmatch) {
        for (var j = 0; j < allmatch.length; j++) {
            text = text.replace(allmatch[j], "<a class=\"reproduce\" target=\"_blank\" href=\"" + urlbase + allmatch[j] + "\">" + allmatch[j] + "</a>")
        }
    }
    return text
}

function autolink(text) {
    text = matchlink(text, new RegExp('av\\d+', 'ig'), "https://www.bilibili.com/video/");
    text = matchlink(text, new RegExp('sm\\d+', 'ig'), "https://www.nicovideo.jp/watch/");
    text = matchlink(text, new RegExp('v=\\S+', 'ig'), "https://www.youtube.com/watch?");
    return text
}

function raise() {
    $('#tips').modal("show");
    setTimeout(function () {
        window.location.reload();
    }, 3000);
}

$(document).ready(function () {
    var vcode = GetUrlValue("vcode");
    var pid = Number(GetUrlValue("pid")) - 1;
    $.getJSON("src/video.json", function (jsondata) {
        if (jsondata[vcode] == undefined) {
            for (var key in jsondata) {
                if (jsondata[key]["is_public"] == true) {
                    var pages = String();
                    for (var i = 1; i <= jsondata[key]["videos"].length; i++) {
                        pages += "<li class=\"page-item\"><a class=\"page-link\" href=\"?vcode=" + key + "&pid=" + i + "\">" + i + "</a></li>";
                    }
                    $("#vlist").append(
                        "<div class=\"col mb-4\">" +
                            "<div class=\"card h-100\">" +
                                "<img src=\"" + jsondata[key]["poster"] + "\" class=\"card-img-top\" />" +
                                "<div class=\"card-body\">" +
                                    "<h5 class=\"card-title\">" + jsondata[key]["title"] + "</h5>" +
                                    "<p class=\"card-text\">" + jsondata[key]["desc"] + "</p>" +
                                    "<ul class=\"pagination flex-wrap\">" + pages + "</ul>" +
                                "</div>" +
                            "</div>" +
                        "</div>"
                    );
                }
            }
        } else {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: "https://bhpan.buaa.edu.cn/api/v1/link?method=osdownload",
                data: JSON.stringify(jsondata[vcode]["videos"][pid]),
                success: function (data) {
                    var link = data.authrequest[1];
                    if (pid == 0) {
                        $("#prev-nav").addClass("disabled");
                        $("#next-btn").attr("href", "?vcode=" + vcode + "&pid=" + (pid + 2));
                    } else if (pid == jsondata[vcode]["videos"].length - 1) {
                        $("#next-nav").addClass("disabled");
                        $("#prev-btn").attr("href", "?vcode=" + vcode + "&pid=" + pid);
                    } else {
                        $("#prev-btn").attr("href", "?vcode=" + vcode + "&pid=" + pid);
                        $("#next-btn").attr("href", "?vcode=" + vcode + "&pid=" + (pid + 2));
                    }
                    $("#player").show();
                    $("#vinfo").show();
                    $("#dl-btn").show();
                    $("#dl-btn").attr("href", link);
                    $("#vcontent").attr("src", link);
                    $("#player").attr("data-poster", jsondata[vcode]["poster"]);
                    $("#vtitle").text(jsondata[vcode]["title"]);
                    $("#vdesc").html(autolink(jsondata[vcode]["desc"]));
                    new Plyr("#player");
                },
                error: function (xhr) {
                    console.log(xhr.status + xhr.statusText);
                    raise();
                }
            });
        }
    });
});
