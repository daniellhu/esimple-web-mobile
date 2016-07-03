// 点击评星
var pageRecords = 1;
(function($) {
    open_id = getUrlParam('openId');
    resource_id = getUrlParam('id');
    $('body').on('click', '#btn-course-score', submitScore);
    $('.score-star-pane').on('click', '.stars li', lightStars);
    docDetail();
    queryScore();

    // 高亮星星
    function lightStars() {
        var li = $(this);
        var anchor = li.parents('.score-star-pane');
        var index = li.index();

        var stars = anchor.find('.stars').find('li');
        stars.each(function(i, o) {
            var o = $(o);
            if (i <= index) {
                if (i == index && o.hasClass('star-on')) {
                    o.removeClass('star-on');
                } else {
                    o.addClass('star-on');
                }

            } else {
                o.removeClass('star-on');
            }
        });

        // 根据星数，显示提示语句
        var i = anchor.find('.star-on').length;
        anchor.find('.prompt-cont').find('.prompt').eq(i).show().siblings('.prompt').hide();

        // 如果有星，显示评分按钮
        if (i > 0) {
            $('.score-star-btn-wrap').show();
        } else {
            $('.score-star-btn-wrap').hide();
        }
    }

    // 评星按钮事件
    $(document).on('click', '#btn-course-score', function() {
        var btn = $(this);
        var i = $('.stars .star-on').length; // 几颗星

        $('.score-star-pane').off('click', '.stars li', lightStars);
        btn.hide();
    });

    function queryScore() {
        var url = mobilePluginPath + "/resource/queryScore.json";
        var data = {
            user_id: open_id,
            resource_id: resource_id,
        };
        $.post(url, data, function(rtn) {
            var stars = $('#starsPanel').find('.stars').find('li');
            stars.each(function(i, o) {
                var o = $(o);
                if (i <= rtn - 1) {
                    if (i == rtn - 1 && o.hasClass('star-on')) {
                        o.removeClass('star-on');
                    } else {
                        o.addClass('star-on');
                    }

                } else {
                    o.removeClass('star-on');
                }
            });

            // 根据星数，显示提示语句
            var i = $('#starsPanel').find('.star-on').length;
            $('#starsPanel').find('.prompt-cont').find('.prompt').eq(i).show().siblings('.prompt').hide();

            if (rtn != null && rtn != '') {
                $('.score-star-pane').off('click', '.stars li', lightStars);
            };
        });
    }

})(Zepto);

function submitScore() {
    var starOn = $('#starsPanel').find('.star-on');
    var score = starOn.length;
    var url = mobilePluginPath + "/resource/submitScore.json";
    var data = {
        user_id: open_id,
        resourceBase_id: resource_id,
        score: score
    };
    $.post(url, data, function() {
        $('#btn-course-score').hide();
    });
}


// 基本信息
function docDetail() {
    var url = mobilePluginPath + '/resource/baseDetail.json'
    var data = {
        id: resource_id
    };
    $.post(url, data, function(rtn) {
        $('title').text(unescape(rtn.name));
        $('#span-study-count').text(rtn.statLearn);
        var score = rtn.score;
        if (rtn.score == '0.0' || rtn.score == null) {
            score = '0';
        };
        $('#span-resource-score').text(score);
        outCode = rtn.outCode;
        docNum(outCode);
        $('#docinDoc1').attr('src', tmpBaseUrl + outCode + '/page_1.jpg');
        var describes = rtn.describes;
        if (describes != '' && describes.length <= 76) {
            $('.document-intro').text(describes);
        } else if (describes != '' && describes.length > 76) {
            var html = describes.substring(0, 76) + '<span class="point">...</span>' + '<span class="more-intro hidden">' + describes.substring(77, describes.length - 1) + '</span>' + '<a class="toggle-intro" href="javascript:;">显示更多</a>';
            $('.document-intro').html(html);
        } else if (rtn.describes == '' || rtn.describes == null) {
            $('.document-intro').text('(暂无简介...)');
        }

        $('#resource-duration').html(rtn.duration + '分钟');

        if (rtn.positionName != '' && rtn.positionName != null) {
            $('#resource-position').text(rtn.positionName);

        } else {
            $('#resource-position').text('所有岗位');

        }
        $('#resource-kc').text(rtn.kcName);

    });
}

//获取文档页数
function docNum(outCode) {
    var url = mobilePluginPath + '/resource/getResourceInfo.json';
    var data = {
        outcode: outCode
    };
    $.post(url, data, function(rtn) {
        totalPage = rtn;
        checkDocPageRecords();
        // recordDocumentLearn(); 文档老学习人数记录方法
    });
}

//资源评论列表
function getCommentList(id, type, pageno, obj) {
    var url = mobilePluginPath + '/comment/pagelist.json';
    var data = {
        objectid: id,
        start: pageno,
        size: 10
    };
    $.post(url, data, function(rtn) {
        if (rtn.page.totalElements != null && rtn.page.totalElements) {
            if (type == "list") {
                commentListHtml(rtn.page);
            }
        };
        if (type == "more") {
            replyListHtml(rtn.page, obj);
        };
    });
}

//评论列表解析
function commentListHtml(page) {
    var tpl = [
        '{@each content as it, k}',
        '<dl class="comment">',
        '<dt>${it.username}</dt>',
        '<dd>',
        '<div class="comment-content">${it.expression}</div>',
        '<div class="comment-other cl">',
        '<div class="z comment-time">编辑于 ${it.timeCreated}</div>',
        '<div class="y comment-action">',
        '<a href="javascript:;" class="toggle-comment vm" cid="${it.id}" replyNum="${it.replyNum}"><i class="icon-comment-2"></i><span>${it.replyNum}条评论</span></a>',
        '<a href="javascript:;" cid="${it.id}" class="comment-attitude-${it.id} btn-useful vm"><i class="icon-useful icon-useful-on"></i><span>${it.approvalNum}</span></a>',
        '</div>',
        '</div>',

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
        $("#doc-tab-comment .commentList").html('');
    };
    $("#doc-tab-comment .commentList").append(juicer(tpl, page));
    if (page.lastPage == false || page.lastPage == 'false') {
        $(".comment-form-box").prev().removeClass('hidden');
    } else {
        $(".comment-form-box").prev().addClass('hidden');
    }
    var ids = '';
    $.each(page.content, function(i, item) {
        ids += item.id + ",";
    });
    commentAttitudeList(ids);
}

//评论的恢复列表
function replyListHtml(page, obj) {
    var tpl = [
        '{@each content as it, k}',
        '<li>',
        '<span class="name">${it.username}</span>',
        '<span class="content">${it.expression}</span>',
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

//保存评论
function saveReply(objectid, expression, type, obj) {
    if (expression == '' || expression == null) {
        $(".floatMidDiv .docPageTip").text("评论不能为空。");
        $(".floatMidDiv").fadeIn("slow").removeClass("hidden");
        setTimeout(function() {  
            $(".floatMidDiv").fadeOut("slow");    
        }, 2000);
        return false;
    };
    var url;
    var type;
    if (type == 'more') {
        url = mobilePluginPath + '/comment/saveReply.json';
        replyType = 'ReplyToComment';
    }
    if (type == 'list') {
        url = mobilePluginPath + '/comment/save.json';
        replyType = 'ResourceComment';
    };
    var data = {
        user_id: open_id,
        object_id: objectid,
        expression: expression,
        type: replyType
    };
    $.post(url, data, function() {
        getCommentList(objectid, type, 0, obj);
    });
}

function addMoreDocComment() {
    var oo = $(this);
    var count = oo.prev().find('dl').length / 10;
    getCommentList(resource_id, 'list', count);
}

function addMoreReply() {
    var oo = $(this);
    var objectid = oo.attr('cid');
    var count = oo.parent().prev().find('li').length / 10;
    getCommentList(objectid, 'more', count, oo.parent().prev());
}


//学习文档
// function recordDocumentLearn() {
//     var url = mobilePluginPath + '/resource/documentLearn.json';
//     var data = {
//         resource_id: resource_id,
//         user_id: open_id
//     };
//     $.post(url, data, function() {});
// }

//评论点赞列表
function commentAttitudeList(ids) {
    var url = mobilePluginPath + "/comment/attitude/list.json";
    var data = {
        id: ids,
        userId: open_id
    };
    $.getJSON(url, data, function(rtn) {
        if (rtn.list != null && rtn.list != "") {
            $.each(rtn.list, function(i, item) {
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

    $.post(url, data, function() {
        if (flag) {
            o.find('i').removeClass('active');
            o.find('span').text(count * 1 - 1);
        } else {
            o.find('i').addClass('active');
            o.find('span').text(count * 1 + 1);
        }
    });
}

// 查询上次阅读记录页数
function checkDocPageRecords() {
    var url = mobilePluginPath + '/resource/learnDocRecord/checkDocRecords.json';
    var data = {
        userId: open_id,
        resourceBaseId: resource_id
    };
    $.post(url, data, function(rtn) {
        if (rtn != "1" && rtn != 1 && rtn <= totalPage) {
            pageRecords = rtn;
            $('#docRecords').text(rtn);
            $(".floatBottomDiv").fadeIn("slow").removeClass("hidden");
            initReader();
            setTimeout(function() {  
                $(".floatBottomDiv").fadeOut("slow");    
            }, 2000);
        } else {
            initReader();
        }
    });
}
