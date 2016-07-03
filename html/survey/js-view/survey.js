var ql;
var ull;

(function() {
    // 题目切换
    $('.test-question-change').on('tap', '#btn-prev', testQuestionPrev);
    $('.test-question-change').on('tap', '#btn-next', testQuestionNext);

    // 工具条前后页切换
    $('body').on('tap', '#numb-next', numbNext);
    $('body').on('tap', '#numb-prev', numbPrev);

    // tools点击切换question
    $('body').on('tap', '.numbs li', matchQuestion);

    // answer后tools标识已答
    $('body').on('click', '.anwer-list li span', checkedAndUnchecked);

//    initToolBar();

})(Zepto);

// 初始化工具条
function initToolBar() {
    var ulHtml = '<ul class="list-unstyled hide">';
    var numbs = $('.test-question-tool .numbs');

    ql = $('.test-question .question-center').length;
    if (ql < 2) {
        $('#btn-next').addClass('submit');
        $('#btn-next').text("交卷");
    };
    if (ql <= 5) {
        $('#numb-prev,#numb-next').addClass('unable');
    } 
    ull = Math.ceil(ql / 5);
    for (var j = 1; j < ull + 1; j++) {
        numbs.append(ulHtml);
    }
    for (var i = 1; i < ql + 1; i++) {
        var liHtml = '<li>' + i + '</li>';
        numbs.find('ul').eq(Math.ceil(i / 5) - 1).append('<li>' + i + '</li>\n');
    };
    numbs.find('ul').eq(0).removeClass('hide').addClass('active');
    numbs.find('ul').eq(0).find('li').eq(0).addClass('now');
}

// prev题目
function testQuestionPrev() {
    if ($(this).hasClass('unable')) {
        return false;
    };
    var qd = $('.test-question .question-center');
    var ca = $('.test-question .active');
    var fQ = qd.eq(1);
    var lQ = qd.eq(ql - 1);

    if ($(fQ).hasClass('active')) {
        $('#btn-prev').addClass('unable');
    }
    if ($(lQ.hasClass('active'))) {
        $('#btn-next').removeClass('submit');
        $('#btn-next').removeClass('unable');
        $('#btn-next span').text('下一题');
    };

    ca.prev().addClass('active').removeClass('hide');
    ca.removeClass('active').addClass('hide');
    matchTools();
    questionAnswered();
}

// next题目
function testQuestionNext() {
	if ($(this).hasClass('unable')) {
        return false;
    };
    if($(this).hasClass('submit')){
    	if(!isattend){
        	submitAnswers();
    	}
    }
    var qd = $('.test-question .question-center');
    var ca = $('.test-question .active');
    var fQ = qd.eq(0);
    var lQ = qd.eq(ql - 2);

    if ($(fQ).hasClass('active')) {
        $('#btn-prev').removeClass('unable');
    }
    if ($(lQ).hasClass('active')) {
    	if(isattend){
    		$('#btn-next').addClass('unable');
    	}
        $('#btn-next').addClass('submit');
        $('#btn-next span').text('交卷');
    }

    ca.removeClass('active').addClass('hide');
    ca.next().addClass('active').removeClass('hide');
    matchTools();
    questionAnswered();
}

// 工具条下一页
function numbNext() {
    if ($(this).hasClass('unable')) {
        return false;
    };
    var ua = $('.numbs .active');
    var ul = $('.numbs ul');
    var fU = ul.eq(0);
    var lU = ul.eq(ull - 2);

    if ($(fU).hasClass('active')) {
        $('#numb-prev').removeClass('unable');
    }
    if ($(lU).hasClass('active')) {
        $('#numb-next').addClass('unable');
    }

    ua.removeClass('active').addClass('hide');
    ua.next().addClass('active').removeClass('hide');
}

// 工具条上一页
function numbPrev() {
    if ($(this).hasClass('unable')) {
        return false;
    };
    var ua = $('.numbs .active');
    var ul = $('.numbs ul');
    var fU = ul.eq(1);
    var lU = ul.eq(ull - 1);

    if ($(fU).hasClass('active')) {
        $('#numb-prev').addClass('unable');
    }
    if ($(lU.hasClass('active'))) {
        $('#numb-next').removeClass('unable');
    };

    ua.prev().addClass('active').removeClass('hide');
    ua.removeClass('active').addClass('hide');
}

// 题目切换工具条匹配
function matchTools() {
    var index = $('.test-question .active').index();
    var cTool = $('.numbs').find('li').eq(index);
    $('.numbs').find('li').removeClass('now');
    cTool.addClass('now');
    if (cTool.parent().hasClass('active')) {
        return false;
    };
    cTool.parent().parent().find('ul').removeClass('active').addClass('hide');
    cTool.parent().addClass('active').removeClass('hide');
    var nIndex = $('.numbs .active').index();
    if (nIndex == 0) {
        $('#numb-prev').addClass('unable');
    } else {
        $('#numb-prev').removeClass('unable');
    }

    if (nIndex == ull - 1) {
        $('#numb-next').addClass('unable');
    } else {
        $('#numb-next').removeClass('unable');
    }
}


// 工具条点击查看题目 
function matchQuestion() {
    var cIndex = $(this).text() - 1;
    var obj = $('.test-question .question-center');
    obj.removeClass('active').addClass('hide');
    obj.eq(cIndex).removeClass('hide').addClass('active');
    $('.numbs').find('li').removeClass('now');
    $(this).addClass('now');
    questionAnswered();
    matchBtns();
}

// 匹配上下页button
function matchBtns() {
    var index = $('.test-question .active').index();
    if (index == 0) {
        $('#btn-prev').addClass('unable');
    } else {
        $('#btn-prev').removeClass('unable');
    }

    if (index == ql - 1) {
        $('#btn-next').addClass('submit');
        $('#btn-next span').text('交卷');
        if(isattend){
    		$('#btn-next').addClass('unable');
    	}
    } else {
        $('#btn-next').removeClass('unable');
        $('#btn-next').removeClass('submit');
        $('#btn-next span').text('下一题');
    }
}

// answer后tools标识已答
function questionAnswered() {
    for (var i = 0; i < ql; i++) {
        var bool = false;
        var inputs = $('.question-center').eq(i).find('ul input');
        $.each(inputs, function(j, oj) {
            if ($(oj).prop('checked') == true) {
                bool = true;
            }
        });
        if (bool) {
            $('.numbs li').eq(i).addClass('done');
        } else {
            $('.numbs li').eq(i).removeClass('done');
        }
    };
    $('.numbs .now').removeClass('done');
}

// 选中与取消
function checkedAndUnchecked() {
    var input = $(this).parent().find('input');
    if (input.prop('checked') == true) {
        input.prop('checked', false);
    } else {
        input.prop('checked', true);
    }
}

function questionOrdered (obj) {
    var ou = obj.find('.test-question div');
    $.each(ou, function (i,iou) {
        var oo = $(iou).find('h5 span');
        $(oo).text(i+1);
    });
}

function submitAnswers(){
	submitUserAnswers();
}