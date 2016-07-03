// var open_id = 'fef2c2d3-ffc6-474c-923c-9c218d92c56d';
var open_id;
var totalPages;
var resource_proxy = $.cookie('resource_proxy');
var domain = $.cookie('resource_domain');
var resource_id;
var docName;
var outCode;
var myScroll;
var tmpBaseUrl = resource_proxy + '/home/pageNoSign/';
var totalPage = '';
var loadNext = 0;

function initReader() {
    $('#docinReaderTool').removeClass('hidden');
    /*初始化*/
    var readerConfig = {
        readerCont: "docinReaderWrap",
        readerTool: "docinReaderTool",
        readerId: "docinReader",
        baseUrl: tmpBaseUrl,
        productId: 107110653,
        errorImgUrl: "http://pics.wanlibo.com/images_cn/ipadreader/space.gif",
        allPage: totalPage,
        zoomLevels: [1, 2, 3, 4, 5, 6],
        widthLevels: [400, 600, 700, 800, 1000, 1500],
        initZoomLevel: 0,
        currentZoom: 4,
        hasChapter: [0, 0],
        adType: 0, //广告类型  0 代表没广告
        adPage: 0, //第几页显示
        adServeId1: '',
        adServeId3: '',
        freeType: 0, //1:私有文档不带密码 2:付费阅读未购买 3:私有文档禁止分享 4：私有文档带密码 5:转化失败上传者看 0:随便看
        previewPage: 4
    };
    var reader = new docinReader(readerConfig);
    window.addEventListener("load", function() {
        hideURLbar();
        createLoad();
        myScroll.refresh();
    }, false);
}

function loaded() {
    myScroll = new iScroll('wrapper', {
        zoom: true,
        hScrollbar: false,
        vScrollbar: false,
        bounce: false,
        momentum: false
    });
}


$(document).ready(function() {
    var url = getUrlParam('picUrl');
    var docName = getUrlParam('docName');
    $('#pic').attr('src', url);
//    $('title').text(unescape(docName));
    getCommentList(resource_id, "list", 0); // “list”代表列表，“more”代表评论的回复
});



//Url获取参数工具
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
};

(function($) {
    // tab 切换
    $('body').on('click', '.nav-item', function() {
        var o = $(this);
        var target = o.attr('data-target');
        var anchor = o.parents('.doc-tab-wrap');

        o.addClass('selected').siblings().removeClass('selected');
        $('.doc-tab-body', anchor).find(target).removeClass('hidden').siblings().addClass('hidden');
    });

    // 显示更多简介
    $('body').on('click', '.toggle-intro', function() {
        var o = $(this);
        var anchor = o.parent().parent();

        if (o.html() == '显示更多') {
            anchor.find('.more-intro').removeClass('hidden');
            anchor.find('.point').addClass('hidden');
            o.html('收起');
        } else {
            anchor.find('.more-intro').addClass('hidden');
            anchor.find('.point').removeClass('hidden');
            o.html('显示更多');
        }
    });

    $('body').on('click', '.btn-doc-useful', function() {
        if ($(this).find('i').hasClass('red')) {
            $(this).find('i').removeClass('red');
            return false;
        }
        $(this).find('i').addClass('red');
    });

    // 评论 收起/下拉
    $('body').on('click', '.comment .toggle-comment', function() {
        var o = $(this);
        var text = o.find('span');
        var anchor = o.parents('dd');
        var n = 0;

        if (text.html() == '收起评论') {
            anchor.find('.comment-inner').addClass('hidden');
            n = o.attr('replyNum');
            text.html(n + '条评论');
        } else {
            getCommentList(o.attr('cid'), 'more', 0, anchor.find('.comment-inner .comment-list'));
            anchor.find('.comment-inner').removeClass('hidden');
            text.html('收起评论');
        }
    });

})(Zepto);

$(document).ready(function() {

    $('body').on('click', '.btn-reply-comment', replyComment);
    $('body').on('click', '#btn-reply-doc', replyResource);
    $('body').on('click', '#btn-replay-doc-more', addMoreDocComment);
    $('body').on('click', '.comment .btn-reply-more', addMoreReply);
    $('body').on('click', '.btn-useful', commentAttitude);
});
