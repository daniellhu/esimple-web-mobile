var open_id;
var resourceBase_id;
var member_id = "";
var score = "";
var expression = "";
var comment_id = "";
(function ($) {
     resourceBase_id = getUrlParam('id');
    // 导航tab切换
    $(document).on('click', '#course-tab-button a', change_tab_content);
    // 课件播放切换
    $(document).on('click', '.li-tab-courseware-clickable', active_courseware);

    $(document).on('click', '#btn-reply-doc', saveReply);
   
    getCommentList(resourceBase_id, 0);
    function change_tab_content() {

        var content = $(this).attr('target');
        if (content == '#course-tab-star') { // 评分               
            if ($(content)[0].style.marginTop == '0px') {
                $(content).animate({
                    marginTop: '-80px'
                }, 300, 'ease')
            } else {
                $(content).animate({
                    marginTop: '0px'
                }, 300, 'ease')
            }            
        isComment();
        }
        $(this).parent().find('a').removeClass('active');
        $(this).addClass('active');
        $('.course-tab').addClass('hide');
        $(content).removeClass('hide');

        if (content == '#course-tab-comment') { //评论
            $('.commentList').show();
            isComment();
        }
    }

    function active_courseware() {
        $(this).parent().find('.li-tab-courseware').removeClass('bs-active');
        $(this).addClass('bs-active');
    }
      
//是否评论过
function isComment() {
    var url = "/portal/train/course/comment/pagelist.json";
    $.getJSON(url, { course_id: resourceBase_id }, function (rtn) {
        for (var i = 0; i < rtn.content.length; i++) {
            if (rtn.content[i].member_id == memberId) {
                member_id = rtn.content[i].member_id;
                comment_id = rtn.content[i].id;
                if (rtn.content[i].comment == "") {
                    $('.comment-input').removeClass('hide');
                    $('.comment-form-box textarea').removeClass('hide');
                    $(".comment-submit-btn").removeClass('hide');
                } else {
                    expression = rtn.content[i].comment;
                    $('.comment-input').remove();
                    $('.comment-form-box textarea').remove();
                    $(".comment-submit-btn").remove();
                }

                if (rtn.content[i].score == "" || rtn.content[i].score ==null ) {
                    $('.score-star-pane').on('click', '.stars li', lightStars);
                } else {
                    score = rtn.content[i].score;
                    queryScore();
                }
            }
        }

    });
}

function queryScore() {
    var url = "/portal/train/course/info/detail.json";
    var data = {
        id: resourceBase_id,
    };
    $.getJSON(url, data, function (rtn) {
        if (rtn.avgScore != null && rtn.avgScore !="") {
            $('.score-star-pane').off('click', '.stars li', lightStars);
             $('.score-star-btn-wrap').remove();
        };
        
        var stars = $('#starsPanel').find('.stars').find('li');
        stars.each(function (i, o) {
            var o = $(o);
            if (i <= rtn.avgScore - 1) {
                o.addClass('star-on');
            } else {
                o.removeClass('star-on');
            }
        });
        // 根据星数，显示提示语句
        var i = $('#starsPanel').find('.star-on').length;
        $('#starsPanel').find('.prompt-cont').find('.prompt').eq(i).show().siblings('.prompt').hide();

    });
}

// $(document).ready(function() {
//     // 评分星星
//     $(".basic").jRating({
//         step: true,
//         length: 5,
//         showRateInfo:false,
//         onClick: clickStars
//     });
// });


function clickStars() {
    // alert('..');
}

    // 点击评星    
    open_id = getUrlParam('openId');
    $('body').on('click', '#btn-course-score', submitScore);
    $('.score-star-pane').on('click', '.stars li', lightStars);
    // 评星按钮事件
    $(document).on('click', '#btn-course-score', function () {
        var btn = $(this);
        var i = $('.stars .star-on').length; // 几颗星

        $('.score-star-pane').off('click', '.stars li', lightStars);
        btn.hide();
    });

    // 评论 收起/下拉
    $('body').on('click', '.comment .toggle-comment', function () {
        var o = $(this);
        var text = o.find('span');
        var anchor = o.parents('dd');
        var n = 0;

        if (text.html() == '收起评论') {
            anchor.find('.comment-inner').addClass('hidden');
            n = o.attr('replyNum');
            text.html(n + '条评论');
        } else {
            // getCommentList(o.attr('cid'), 'more', 0, anchor.find('.comment-inner .comment-list'));
            anchor.find('.comment-inner').removeClass('hidden');
            text.html('收起评论');
        }
    });
        
// 高亮星星
function lightStars() {
    var li = $(this);
    var anchor = li.parents('.score-star-pane');
    var index = li.index();

    var stars = anchor.find('.stars').find('li');
    stars.each(function (i, o) {
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
    
    function submitScore() {
        var starOn = $('#starsPanel').find('.star-on');
        var score = starOn.length;
        var url = "/portal/train/course/comment/save.json";
        var data = {
            id: comment_id,
            course_id: resourceBase_id,
            score: score,
            comment: expression
        };
        $.post(url, data, function () {
            getCommentList(resourceBase_id, 0);
            $('.score-star-pane').off('click', '.stars li', lightStars);
            $('.score-star-btn-wrap').remove();
        });
    }
    
 //保存评论
function saveReply(objectid, expression, type, obj) {
    var expression = $('.comment-form-box textarea').val();
    if (expression == '' || expression == null) {
        $(".floatMidDiv .docPageTip").text("评论不能为空。");
        $(".floatMidDiv").fadeIn("slow").removeClass("hidden");
        setTimeout(function () {
            $(".floatMidDiv").fadeOut("slow");
        }, 2000);
        return false;
    };    
    var url = "/portal/train/course/comment/save.json";
    var data = {
        id: comment_id,
        course_id: resourceBase_id,
        score: score,
        comment: expression
    };
    $.post(url, data, function () {
        getCommentList(resourceBase_id, 0);
        $('.comment-input').addClass('hide');
        $('.comment-form-box textarea').addClass('hide');
        $(".comment-submit-btn").addClass('hide');
    });
}
})(Zepto);


//Url获取参数工具
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

$(document).ready(function () {

    // $('body').on('click', '.btn-reply-comment', replyComment);
    // $('body').on('click', '#btn-reply-doc', saveReply);
    // $('body').on('click', '#btn-replay-doc-more', addMoreDocComment);
    // $('body').on('click', '.comment .btn-reply-more', addMoreReply);
    // $('body').on('click', '.btn-useful', commentAttitude);
});
