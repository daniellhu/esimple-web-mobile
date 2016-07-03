/*init scroll*/
/*var scrollReader = new iScroll("docinReader");*/
/*
viweport 1208px*980px;
landscep 661px*981px
*/
//var img = new Image();
var doc = document,
    db = doc.body,
    de = doc.documentElement,
    win = window;
var tool = {
    addEvent: function(obj, type, fn) {
        obj.addEventListener(type, fn, false);
    },
    removeEvent: function(obj, type, fn) {
        obj.removeEventListener(type, fn, false);
    },
    stopPropagation: function(e) {
        e.stopPropagation();
    },
    fireEvent: function(ele, evt, type) {
        var e = document.createEvent(evt);
        e.initEvent(type, true, true);
        ele.dispatchEvent(e);
    },
    getPos: function(ele) {
        var pos = {},
            ep = ele.getBoundingClientRect();
        pos.l = ep.left;
        pos.t = ep.top;
        pos.r = ep.right;
        pos.b = ep.bottom;
        pos.x = ep.left + de.scrollLeft + db.scrollLeft;
        pos.y = ep.top + de.scrollTop + db.scrollTop;
        return pos;
    },
    getScroll: function() {
        var w = {}
        w.t = win.pageYOffset;
        w.l = win.pageXOffset;
        return w;
    },
    getPort: function() {
        var vp = {};
        vp.w = de.clientWidth;
        vp.h = de.clientHeight;
        return vp;
    },
    getOrient: function() {
        var or = win.orientation;
        switch (or) {
            case 0:
                {
                    return "land";
                    break;
                }
            case 90:
                {
                    return "port";
                    break;
                }
            case -90:
                {
                    return "port";
                    break;
                }
            case 180:
                {
                    return "land";
                    break;
                }
        }
    },
    hasClass: function(obj, className) {
        var oldClass = obj.getAttribute("class").replace(/^\s+|\s+$/g, '');
        var className = className.replace(/^\s+|\s+$/g, "");
        var classArr = oldClass.split(' ');
        var reg = new RegExp(className);
        for (var i = 0; i < classArr.length; i++) {
            if (reg.test(classArr[i])) {
                return true;
            }
        }
        return false;
    },
    addClass: function(obj, className) {
        if (!this.hasClass(obj, className)) {
            obj.className = obj.className + ' ' + className;
        }
    },
    removeClass: function(obj, className) {
        if (this.hasClass(obj, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    },
    setCookie: function(name, value, day) {
        var str = name + "=" + escape(value);
        if (day > 0) {
            expires = day * 24 * 60;
            exp = new Date();
            exp.setTime(exp.getTime() + expires * 60 * 1000);
            str += "; expires=" + exp.toGMTString();
            str += "; path=/";
            if (location.href.indexOf("docin.com") == -1) {
                str += "; domain=.vonibo.com";
            } else {
                str += "; domain=.docin.com";
            }
        }
        document.cookie = str;
    },
    getCookie: function(name) {
        var tmp, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)", "gi");
        if (tmp = reg.exec(unescape(document.cookie))) return (tmp[2]);
        return null;
    }
};
var $gid = function(i) {
        return doc.getElementById(i);
    },
    createEle = function(e) {
        return doc.createElement(e);
    };
var leftTimer = rightTimer = null;

function docinReader(config) {
    /*参数定义*/
    this.config = {
        readerCont: "docinReaderWrap",
        readerTool: "docinReaderTool",
        readerId: "docinReader",
        baseUrl: "http://192.168.2.89/reader/img.php",
        errorImgUrl: "",
        allPage: 1,
        zoomLevels: [1, 2, 3, 4, 5],
        widthLevels: [400, 600, 700, 800, 1000, 1500],
        initZoomLevel: 0,
        currentZoom: 0,
        adType: 0,
        adPage: 3,
        adServeId1: 0,
        adServeId3: 0
    };
    for (p in config) {
        this.config[p] = config[p];
    }

    this.curPicWidth = this.config.widthLevels[this.config.currentZoom]; /*动态获取初始化文档图片宽度*/
    this.curPage = 1; /*当前页数*/
    if (this.config.freeType == 5) {
        this.isZoomDoc = 2;
    } else {
        this.isZoomDoc = 1;
    }
    this.nextPageNum = 1;
    this.nextImg = null;
    var thatObj = this;

    function bulidReader() {
        thatObj.changeReader();
        thatObj.docinDoc = $gid("docinDoc");
        thatObj.loading = $gid("loadingMask");
        $gid("nowpage").innerHTML = thatObj.curPage;
        if (thatObj.config.adType == 3 && thatObj.config.allPage > 3) {
            thatObj.config.allPage = thatObj.config.allPage + 1;
        }
        $gid("docPage").innerHTML = thatObj.config.allPage;
        tool.addEvent($gid("docinReaderTool"), "touchend", function(e) {
            //e.preventDefault();
            //e.stopPropagation();          
        });
    }

    function init() {
        loaded();
        if (thatObj.config.freeType > 0) {
            thatObj.config.adType = 0;
            thatObj.config.adPage = 0;
        }
        if (thatObj.config.freeType == 0 || thatObj.config.freeType == 2 || thatObj.config.freeType == 5 || thatObj.config.freeType == 6) {
            if (pageRecords != 1 && pageRecords != "1" && pageRecords <= thatObj.config.allPage && pageRecords > 0) {
                thatObj.pageButtom(pageRecords);
            } else {
                thatObj.pageButtom(1);
            }
            thatObj.nextPage();
            thatObj.prePage();
        }
        thatObj.resizeReader();
        bulidReader();
        thatObj.cancelFullScreen();
    }
    init();
}
docinReader.prototype = {
    nowPicHeight: function() {
        var thatObj = this;
        if (thatObj.isZoomDoc == 1 && (thatObj.config.freeType == 0 || thatObj.config.freeType == 2 || thatObj.config.freeType == 6)) { //正常看文档的类型
            var ttt = jQuery("#docinDoc" + thatObj.curPage).height();
            var sss = jQuery(window).height() - 50;
            jQuery("#docinReader").height(ttt);
            jQuery("#wrapper").height(sss);
            if (thatObj.config.adType == 3 && thatObj.config.allPage > 3) {
                jQuery("#ad_app_3").height(sss);
            }

        } else if (thatObj.isZoomDoc == 1 && thatObj.config.freeType > 0 && thatObj.config.freeType != 2 && thatObj.config.freeType != 6) { //只能看到黑色限制
            var sss = jQuery(window).height();
            jQuery("#wrapper").height(sss);
        } else if (thatObj.isZoomDoc == 2) {
            //jQuery("#docinReader").height('auto');
            jQuery("#docinReader").css({
                height: 'auto',
                minHeight: 150
            });
            jQuery("#wrapper").height('auto');
            if (thatObj.config.adType == 3 && thatObj.config.allPage > 3) {
                jQuery("#ad_app_3").height(ttt);
            }
        }
        myScroll.refresh();
    },
    loadNext: function() {
        var thatObj = this;
        if (thatObj.nextPageNum > thatObj.config.allPage) {
            return;
        }
        if (thatObj.config.adType == 3 && (thatObj.nextPageNum > thatObj.config.allPage)) {
            return;
        }
        if (thatObj.nextPageNum == thatObj.config.allPage) {
            return;
        }
        var nextSrc = thatObj.config.baseUrl + outCode + "/page_" + thatObj.nextPageNum + ".jpg";
        thatObj.nextImg = jQuery('<img style="display:none;" id="docinDoc' + thatObj.nextPageNum + '" src=' + nextSrc + '>');
        jQuery("#docinReader").append(thatObj.nextImg);
    },
    gotoBottom: function() {
        var viewH = tool.getPort().h,
            st = document.body.scrollHeight - viewH + "px";
        jQuery("html,body").animate({
            "scrollTop": st
        }, 300);
    },
    resizeReader: function() {
        var thatObj = this;
        var viewH = tool.getPort().h;
        if (thatObj.isZoomDoc == 1 && thatObj.config.freeType > 0) {
            $gid("docinReader").style.height = viewH + "px";
            return;
        }
        $gid("docinReader").style.height = viewH - 50 + "px";
    },
    changeReader: function() {
        var thatObj = this;
        tool.addEvent(window, "orientationchange", function() {
            setTimeout(function() {
                thatObj.nowPicHeight();
                myScroll.refresh();
            }, 500);
        });
        if (thatObj.isZoomDoc == 1 && thatObj.config.freeType == 0) {
            tool.addEvent(window, "load", function() {
                var sjTime = setTimeout(function() {
                    //thatObj.gotoBottom();
                    if (tool.getCookie("guide") != 100) {
                        var guideMask = jQuery('<div class="guide"></div>');
                        guideMask.appendTo(document.body).fadeIn();
                        var showTime = setTimeout(function() {
                            guideMask.fadeOut();
                        }, 2000);
                        if (guideMask.length > 0) {
                            guideMask.click(function() {
                                clearTimeout(showTime);
                                guideMask.hide();
                            });
                        }
                    }
                    tool.setCookie("guide", "100", 365);
                }, 1000);

            });
        }
    },
    loadBigPic: function(pageno) {
        if (pageno) {
            var page = pageno;
        } else {
            var page = this.curPage;
        }
        var thatObj = this;
        thatObj.nextPageNum = page + 1;
        var newSrc = thatObj.config.baseUrl + outCode + "/page_" + page + ".jpg";
        if (jQuery("#docinDoc" + page).length > 0) { //这张图片已加载
            if (thatObj.config.adType == 3 && page > thatObj.config.adPage) {
                page = page - 1;
                jQuery("#docinReader img").hide();
                jQuery("#docinDoc" + page).show();
            } else {
                jQuery("#docinReader img").hide();
                jQuery("#docinDoc" + page).show();
            }
            thatObj.nowPicHeight();
        } else { //这张图片还没有加载
            if (pageno == thatObj.config.allPage && thatObj.config.adType == 3 && thatObj.config.allPage > 4) {
                jQuery("#docinReader img").hide();
                jQuery("#docinDoc" + (thatObj.config.allPage - 1)).show();
                return false;
            }
            var oImg = jQuery('<img id="docinDoc' + page + '" src=' + newSrc + '>');
            jQuery("#docinReader").append(oImg);
            jQuery("#docinReader img").hide();
            jQuery("#docinDoc" + page).show();
            if (thatObj.isZoomDoc == 1 && pageno == 1) {
                jQuery.post("/app/a_d/viewStat", {
                    aid: thatObj.config.adServeId1
                });
                if (thatObj.config.freeType == 0) {
                    jQuery("#ad_app_1").show();
                }
            }
        }
        if (jQuery("#docinDoc" + thatObj.curPage).height() > 0) { //有时候最新的那张图片的高度是0
            jQuery("#l").hide();
            thatObj.nowPicHeight();
        } else if (thatObj.curPage != 1) {
            jQuery("#docinReader img").unbind("load");
            jQuery("#docinDoc" + thatObj.curPage).load(function() {
                jQuery("#l").hide();
            });
            thatObj.nowPicHeight();
        }
        jQuery("#docinDoc1").load(function() {
            if (thatObj.curPage == 1) {
                thatObj.nowPicHeight();
                jQuery("#l").hide();
            }
        });
        if (loadNext) {
            if (jQuery("#docinDoc" + thatObj.nextPageNum).length == 0) {
                thatObj.loadNext();
            }
        } else {
            if (thatObj.curPage != 1 && jQuery("#docinDoc" + thatObj.nextPageNum).length == 0) {
                thatObj.loadNext();
            }
        }
    },
    pageButtom: function(pageno) {
        jQuery(".l").show();
        /*翻页调整相应按钮*/
        if (this.config.allPage == 1) {
            $gid("nextPage").innerHTML = "<i class='icon-arrow-right icon-2'></i><span class='block'>最后一页</span>";
            $gid("prePage").innerHTML = "<i class='icon-arrow-left icon-2'></i><span class='block'>第一页</span>";
            $gid("nextPage").style.color = "#ccc";
            $gid("prePage").style.color = "#ccc";
        } else {
            if (pageno == 1) {
                $gid("prePage").innerHTML = "<i class='icon-arrow-left icon-2'></i><span class='block'>第一页</span>";
                $gid("nextPage").innerHTML = "<i class='icon-arrow-right icon-2'></i><span class='block'>下一页</span>";
                $gid("prePage").style.color = "#ccc";
                $gid("nextPage").style.color = "#666";
            } else if (pageno == this.config.allPage) {
                $gid("nextPage").innerHTML = "<i class='icon-arrow-right icon-2'></i><span class='block'>最后一页</span>";
                $gid("prePage").innerHTML = "<i class='icon-arrow-left icon-2'></i><span class='block'>上一页</span>";
                $gid("nextPage").style.color = "#ccc";
                $gid("prePage").style.color = "#666";
            } else {
                $gid("nextPage").innerHTML = "<i class='icon-arrow-right icon-2'></i><span class='block'>下一页</span>";
                $gid("prePage").innerHTML = "<i class='icon-arrow-left icon-2'></i><span class='block'>上一页</span>";
                $gid("nextPage").style.color = "#666";
                $gid("prePage").style.color = "#666";

            }
        }
        this.curPage = pageno;
        this.loadBigPic(pageno);
        $gid("nowpage").innerHTML = this.curPage;
    },
    nextPage: function() {
        /*下一页*/
        var thatObj = this;
        jQuery("#nextPage,#mobile_right_hotspot").bind("touchend", function(e) {
            e.preventDefault();
            if (thatObj.config.allPage == 1) {
                $gid("nonext").style.display = "block";
                clearTimeout(rightTimer);
                rightTimer = setTimeout(function() {
                    $gid("nonext").style.display = "none";
                }, 500);
                return;
            }
            var pageno = thatObj.curPage + 1;
            if (pageno <= thatObj.config.allPage) {
                thatObj.pageButtom(pageno);
                thatObj.pageRecordsAjax(pageno);
            } else {
                thatObj.pageButtom(thatObj.config.allPage);
                thatObj.pageRecordsAjax(thatObj.config.allPage);
                $gid("nonext").style.display = "block";
                clearTimeout(rightTimer);
                rightTimer = setTimeout(function() {
                    $gid("nonext").style.display = "none";
                }, 500);
                return;
            }

            return false;
        });

    },
    prePage: function() {
        /*前一页*/
        var thatObj = this;
        jQuery("#prePage ,#mobile_left_hotspot").bind("touchend", function(e) {
            e.preventDefault();
            if (thatObj.config.allPage == 1) {
                clearTimeout(leftTimer);
                $gid("nopre").style.display = "block";
                leftTimer = setTimeout(function() {
                    $gid("nopre").style.display = "none";
                }, 500);
                return;
            }
            if (thatObj.curPage == 1) {
                if ($gid("touchPre")) {
                    $gid("touchPre").style.display = 'none';
                }
            }
            var pageno = thatObj.curPage - 1;
            if (pageno > 0) {
                thatObj.pageButtom(pageno);
                thatObj.pageRecordsAjax(pageno);
            } else {
                thatObj.pageButtom(1);
                thatObj.pageRecordsAjax(1);
                clearTimeout(leftTimer);
                $gid("nopre").style.display = "block";
                leftTimer = setTimeout(function() {
                    $gid("nopre").style.display = "none";
                }, 500);
                return;
            }
        });
    },
    pageRecordsAjax: function(pageno) {
        var thatObj = this;
        var url = mobilePluginPath + '/resource/learnDocRecord/recordsDocPage.json';
        var data = {
            userId: open_id,
            resourceBaseId: resource_id,
            docPage: pageno
        };
        $.post(url, data);
    },
    fullscreen: function() {
        var thatObj = this;
        jQuery("#docinReader").removeClass("minpic");
        thatObj.isZoomDoc = 1;
        thatObj.nowPicHeight();
        myScroll.destroy();
        loaded();
        jQuery("#tabSwitch").removeClass("fullscreen");
        jQuery(".relateDoc").hide();
        jQuery(".hotSpots").show();
        if (thatObj.config.freeType > 0) {
            jQuery("#ad_app_1").hide();
        } else {
            jQuery("#ad_app_1").show();
        }
        jQuery("#docinReaderTool").removeAttr('style');
    },
    minscreen: function() {
        var thatObj = this;
        jQuery("#docinReader").addClass("minpic");
        thatObj.isZoomDoc = 2;
        thatObj.nowPicHeight();
        myScroll.destroy();
        jQuery("#tabSwitch").addClass("fullscreen");
        jQuery(".relateDoc").show();
        jQuery(".hotSpots").hide();
        jQuery("#ad_app_1").hide();
        jQuery("#docinReaderTool").css({
            position: 'static'
        });
        $('#scroller').removeAttr('style').attr('style','transition: transform 0ms!important; -webkit-transition: transform 0ms!important; transform-origin: 0px 0px 0px!important; transform: translate(0px, 0px) translateZ(0px)!important;');
    },
    cancelFullScreen: function() {
        var thatObj = this;
        var btnForScreen = jQuery("#tabSwitch");
        btnForScreen.bind("click", function() {
            if (thatObj.isZoomDoc == 1) {
                thatObj.minscreen();
            } else if (thatObj.isZoomDoc == 2) {
                thatObj.fullscreen();
            }
        });
    }
};

//隐藏地址栏
function hideURLbar() {
        setTimeout(scrollTo, 100, 0, 1);
    }
    //创建loading

function createLoad() {
    var loaders = [{
        width: 100,
        height: 100,

        stepsPerFrame: 3,
        trailLength: 1,
        pointDistance: .01,
        fps: 30,
        step: 'fader',
        strokeColor: '#8a8a8a',
        setup: function() {
            this._.lineWidth = 6;
        },
        path: [
            ['arc', 50, 50, 20, 0, 360]
        ]
    }];

    var oD, oLoad, container = document.getElementById('wrapper');
    for (var i = -1, l = loaders.length; ++i < l;) {
        oD = document.getElementById('l');
        oLoad = new Sonic(loaders[i]);
        oD.appendChild(oLoad.canvas);
        container.appendChild(oD);
        oLoad.play();
    }
}

jQuery(function() {
    if (jQuery(".close_btn_icon").length > 0) {
        jQuery(".close_btn_icon").bind('click', function(event) {
            jQuery("#tabSwitch").css({
                bottom: 50,
                top: 'auto'
            });
            jQuery(this).parent().parent().hide();
            event.cancelable = true;
        });
    }
});
