var resource_id;
var sectionNum;
var sectionId;
var resource_proxy = $.cookie('resource_proxy');
var domain = $.cookie('resource_domain');
(function ($) {
    getCurrentUser();
    // (function(document) {
    // var local_url = location.href.split("=");
    resource_id = getUrlParam('id');
    courseDetail();
    // knowledgelink_list();
    showCourseware();
    // })();
    $('body').on('touchend', '.li-tab-courseware', getResourceSign);

    // 课程基本信息
    function courseDetail() {
        var url = '/portal/train/course/info/detail.json'
        var data = {
            id: resource_id
        };
        $.post(url, data, function (rtn) {
            if (rtn.describes != '') {
                $('#resource-describes').text(rtn.description);
            } else {
                $('#resource-describes').text('(暂无简介...)');
            }

            $('#resource-duration').html((rtn.totalPlayLength / 60).toFixed(0) + '分钟');

            if (rtn.positionName != '' && rtn.positionName != null) {
                $('#resource-position').text(rtn.positionName);

            } else {
                $('#resource-position').text('所有岗位');

            }
            $('#resource-kc').text(rtn.catalog_name);
        });
    }

})(Zepto);

// 获取课件
function showCourseware() {
    var url = "/portal/train/course/section/list.json";
    var Ids = "";
    var types = "";
    var urls = "";
    var data = { course_id: resource_id, sortType: "scoNumber" };
    $.getJSON(url, data, function (data) {
        var list = {};
        list.content = data;
        sectionNum = list.content.length;
        if (list.content.length == 0) {
            $("#course-tab-2").text("该课程没有课件")
        } else {
            $.each(list.content, function (i, item) {
                Ids += item.course_id + ",";;
                types += item.course_type + ",";
                urls += item.desUrl + ",";
            });
            //$('iframe').attr('src', list.content[0].desUrl);
            sectionId = list.content[0].id;
            $('#course-start-learn').attr("type", list.content[0].type);
            $('#course-start-learn').attr("index", list.content[0].url);
        }
        var datalist = course_warelist_html(list);
        $('#course-tab-2').html(datalist);
        getResourceSign();
    });

}

//课件列表生成
function course_warelist_html(list) {
    var tpl = [
        '{@each content as it,k}',
        '{@if it.course_type == "Video"}',
        '<div class="li-tab-courseware bs-middle" id="${it.id}">',
        '<span><b>${it.scoTitle}</b></span>',
        '<span class="grey text-12">${it.uplayLength}</span>',
        '</div>',
        '{@/if}',
        //        '{@if it.course_type != "Video"}',
        //        '<div class="li-tab-courseware bs-middle">',
        //        '<span><b>${it.course_name}</b></span><span class="grey text-12">(暂不支持播放的格式)</span><span class="grey text-12">${it.duration}分钟</span>',
        //        '</div>',
        //        '{@/if}',       
        '{@/each}',
    ].join('\n');
    $("#course-tab-2").append(juicer(tpl, list));
    //    $('#course-tab-2 .li-tab-courseware').eq(0).addClass('bs-callout');
}

//获取相关文档
function knowledgelink_list() {
    var url = mobilePluginPath + "/resource/doclist.json";
    var data = {
        resourceBaseId: resource_id
    };

    $.getJSON(url, data, function (rtn) {
        if (rtn.list == null) {
            $("#ul-course-doclist").text("该课程没有相关文档");
        }
        course_relative_list(rtn);
    });
}

//相关文档生成
function course_relative_list(rtn) {
    var tpl = [
        '{@each list as it,k}',
        '<li onclick="window.location.href=\'resource-doc.html?id=${it.slave.id}\'">',
        '<div class="title"> ${it.slave.name}</div>',
        '<div class="other">',
        '<span>创建时间: ${it.slave.timeCreated}</span>',
        '<span>学习人数: ${it.slave.statLearn}</span>',
        '</div>',
        '</li>',
        '{@/each}',
    ].join('\n');
    $("#ul-course-doclist").append(juicer(tpl, rtn));
}

function getResourceSign() {
    if (sectionNum > 0) {
        $('.video-player').addClass('hide');
        $('iframe').removeClass('hide');
        var url = "/portal/train/course/section/detail.json";
        $.getJSON(url, { id: sectionId }, function (rtn) {
            // $('iframe', parent.document).attr('src',"resource-player.html?file="+rtn.desUrl);
            $('iframe').attr('src', "resource-palyer.html?file=" + rtn.desUrl);
        });
    } else if (sectionNum == 0) {
        $('iframe').addClass('hide');
        $('.video-player').removeClass('hide');
        $('.video-player p').removeClass('hide');
    };
}


//评论列表
function getCommentList(id, pageno) {
    var url = "/portal/train/course/comment/pagelist.json";
    var data = {
        start: pageno,
        size: 10,
        course_id: id
    };
    $.getJSON(url, data, function (rtn) {
        if (rtn.totalElements == 0) {
            $('.commentList').html("暂无学员评论！");
        } else {
            $('.commentList').html("");
            var comment = $('.commentList').find('.comment')
            $(comment).remove();
            var datalist = commentListHtml(rtn);
            $('.commentList').html(datalist);
        }
    });
}

//评论列表解析
function commentListHtml(page) {
    var tpl = [
        '{@each content as it, k}',
        '{@if it.comment!=""}',
        '<dl class="comment" id="it.id">',
        '<dt>${it.member_name}</dt>',
        '<dd>',
        '<div class="comment-content">${it.comment}</div>',
        '<div class="comment-other cl">',
        '<div class="z comment-time">编辑于 ${it.timeCreated}</div>',
        '<div class="y comment-action">',
        // '<a href="javascript:;" class="toggle-comment vm" cid="${it.id}" replyNum="${it.replyNum}"><i class="icon-comment-2"></i><span>${it.replyNum}条评论</span></a>',
        // '<a href="javascript:;" cid="${it.id}" class="comment-attitude-${it.id} btn-useful vm"><i class="icon-useful icon-useful-on"></i><span>${it.approvalNum}</span></a>',
        '</div>',
        '</div>',
        '{@/if}',
        '<div class="comment-inner hidden">',
        '<i class="icon-arrow-up-2"></i>',
        '<ul class="comment-list hidden">',
        '</ul>',
        '<div class="btn-comment-more-wrap hidden">',
        '<a href="javascript:;" cid="${it.id}" class="btn-reply-more">更多</a>',
        '</div>',
        '<div class="comment-answer-box hidden">',
        '<input type="text" class="comment-input" placeholder="写下你的评论...">',
        '<button class="btn btn-primary btn-reply-comment" cid="${it.id}" class="button-blue" type="button">回复</button>',
        '</div>',
        '</div>',
        '</dd>',
        '</dl>',
        '{@/each}'
    ].join('\n');
    if (page.firstPage == true || page.firstPage == 'true') {
        $("#course-tab-comment .commentList").html('');
    };
    $("#course-tab-comment .commentList").append(juicer(tpl, page));
    if (page.lastPage == false || page.lastPage == 'false') {
        $(".comment-form-box").prev().removeClass('hidden');
    } else {
        $(".comment-form-box").prev().addClass('hidden');
    }
    var ids = '';
    $.each(page.content, function (i, item) {
        ids += item.id + ",";
    });
    // commentAttitudeList(ids);
}

//评论的恢复列表
function replyListHtml(page, obj) {
    var tpl = [
        '{@each content as it, k}',
        '<li>',
        '<span class="name">${it.member_name}</span>',
        '<span class="content">${it.comment}</span>',
        '<span class="datetime">${it.timeCreated}</span>',
        '</li>',
        '{@/each}'
    ].join('\n');
    if (page.firstPage == true || page.firstPage == 'true') {
        $(obj).html('');
    }
    $(obj).append(juicer(tpl, page));

    if (page.numberOfElements != 0 && page.numberOfElements != '') {
        $(obj).removeClass('hidden');
    };
    if (page.lastPage == false || page.lastPage == 'false') {
        $(obj).next().removeClass('hidden');
    } else {
        $(obj).next().addClass('hidden');
    }
    $(obj).next().next().removeClass('hidden');

}


//回复评论
function replyComment() {
    var o = $(this);
    var objectid = o.attr('cid');
    var obj = o.parent().parent().find('.comment-list');
    var expression = o.prev().val();
    var replyNum = o.parent().parent().prev().find('.toggle-comment').attr('replyNum');
    o.parent().parent().prev().find('.toggle-comment').attr('replyNum', replyNum * 1 + 1);
    saveReply(objectid, expression, 'more', obj);
    o.prev().val('').attr('placeholder', "写下你的回复...");
}

//资源评论
function replyResource() {
    var expression = $('.comment-form-box textarea').val();
    saveReply(resource_id, expression, 'list');
    $('.comment-form-box textarea').val('').attr('placeholder', "写下你的评论...");
}

function addMoreDocComment() {
    var oo = $(this);
    var count = oo.prev().find('dl').length / 10;
    getCommentList(resource_id, count);
}

function addMoreReply() {
    var oo = $(this);
    var objectid = oo.attr('cid');
    var count = oo.parent().prev().find('li').length / 10;
    // getCommentList(objectid, 'more', count, oo.parent().prev());
}

//评论点赞列表
function commentAttitudeList(ids) {
    var url = mobilePluginPath + "/comment/attitude/list.json";
    var data = {
        id: ids,
        userId: open_id
    };
    $.getJSON(url, data, function (rtn) {
        if (rtn.list != null && rtn.list != "") {
            $.each(rtn.list, function (i, item) {
                if (item.attitude == "Approval") {
                    $('.comment-attitude-' + item.commentid).find('i').addClass('active');
                }
            });
        }
    });
}

//评论点赞
function commentAttitude() {
    var o = $(this);
    var id = o.attr('cid');
    var count = o.find('span').text();
    var url;
    var flag = o.find('i').hasClass('active');
    if (flag) {
        url = mobilePluginPath + '/comment/attitude/cancel.json';
    } else {
        url = mobilePluginPath + '/comment/attitude/save.json';
    }
    var data = {
        attitude: "Approval",
        comment_id: id,
        user_id: open_id
    };

    $.post(url, data, function () {
        if (flag) {
            o.find('i').removeClass('active');
            o.find('span').text(count * 1 - 1);
        } else {
            o.find('i').addClass('active');
            o.find('span').text(count * 1 + 1);
        }
    });
}

// 判断是否有学习记录
function judgeLearnRecords() {
    var url = mobilePluginPath + '/resource/learnCourseStats/pagelist.json';
    var data = {
        resourceBase_id: resource_id,
        user_id: open_id
    };
    $.post(url, data, function (rtn) {
        if (rtn.page.content != null && rtn.page.content != '') {
            replyResource();
        } else {
            $(".floatMidDiv .docPageTip").text("请先学习该课程。");
            $(".floatMidDiv").fadeIn("slow").removeClass("hidden");
            setTimeout(function () {
                $(".floatMidDiv").fadeOut("slow");
            }, 2000);
        }
    });
}
