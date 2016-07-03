var html='<script type="text/javascript" src="http://kf.5251.net/jsp_admin/float_adjustable.jsp?companyId=37525&style=76806&keyword=1&locate=cn"></script>';
document.write(html);
// 解决JQuery发送Ajax请求后，IE缓存数据不更新的问题
$.ajaxSetup({
    global: true,
    cache: false,
    error: function(jqXHR, textStatus, errorMsg){
        var response = JSON.parse(jqXHR.responseText);
        switch (jqXHR.status){
            
            case(401):
                alert("您还未登录！");
                var refURL = window.location.href;
                window.location.href = "../../login/login.html?ref="+refURL;
                break;
            case(500):
                // alert(response.message);
                //window.location.href = "../../common/page/500.html";
                break;
            case(403):
                //alert("无权限执行此操作");
                window.location.href = "../../common/page/403.html";
                break;
            case(404):
                //alert("页面未找到");
                //window.location.href = "../../common/page/404.html";
                break;
            case(408):
                //alert("请求超时");
                window.location.href = "../../common/page/408.html";
                break;
            default:
                //alert("未知错误");
                //window.location.href = "../../common/page/unknow.html";
        }
    }
});
// 显示日历
function calendar(id,value)
{
     jQuery(id).datepicker({
        showAnim: 'slideDown',
        changeMonth: true,
        changeYear: true,        
        hideIfNoPrevNext: true,        
        defaultDate: value,
        dateFormat: 'yy-mm-dd'
    });
}


//显示蒙层提示
function showDialog(msg) {
    jQuery("<div/>").attr("id", "dialog").appendTo("body");
    jQuery('#dialog').dialog({
        autoOpen: false,
        width: 330,
        dialogClass: "noclose",
        modal: true,
        title: "提示",
        buttons: { "确定": function() { 
            jQuery(this).dialog("close"); 
            jQuery('.noclose').remove();
            jQuery('#dialog').remove(); } },
        resizable: false
    });
    jQuery("#dialog").html(msg);
    jQuery("#dialog").dialog("open");
}

//格式化日期：yyyy-MM-dd 
function formatDate(date) { 
    var myyear = date.getFullYear(); 
    var mymonth = date.getMonth()+1; 
    var myweekday = date.getDate(); 

    if(mymonth < 10){ 
        mymonth = "0" + mymonth; 
    } 
    if(myweekday < 10){ 
        myweekday = "0" + myweekday; 
    } 
    return (myyear+"-"+mymonth + "-" + myweekday); 
} 

// 获取本周
function getCurrentWeek() { 
    //起止日期数组  
    var startStop = new Array(); 
    //获取当前时间  
    var currentDate = new Date(); 
    //返回date是一周中的某一天  
    var week = currentDate.getDay(); 
    //返回date是一个月中的某一天  
    var month = currentDate.getDate(); 
    //一天的毫秒数  
    var millisecond = 1000*60*60*24; 
    //减去的天数  
    var minusDay = week!=0 ? week-1 : 6; 
    //alert(minusDay);  
    //本周 周一  
    var monday = new Date(currentDate.getTime()-(minusDay*millisecond)); 
    //本周 周日  
    var sunday = new Date(monday.getTime()+(6*millisecond)); 
    //添加本周时间  
    startStop.push(monday);//本周起始时间  
    //添加本周最后一天时间  
    startStop.push(sunday);//本周终止时间  
    //返回  
    return startStop; 
}; 

// 获取本月
function getCurrentMonth() { 
    //起止日期数组  
    var startStop = new Array(); 
    //获取当前时间  
    var currentDate = new Date(); 
    //获得当前月份0-11  
    var currentMonth = currentDate.getMonth(); 
    //获得当前年份4位年  
    var currentYear = currentDate.getFullYear(); 
    //求出本月第一天  
    var firstDay = new Date(currentYear,currentMonth,1); 
    //当为12月的时候年份需要加1  
    //月份需要更新为0 也就是下一年的第一个月  
    if(currentMonth == 11){ 
        currentYear++; 
        currentMonth = 0;//就为  
    }else{ 
        //否则只是月份增加,以便求的下一月的第一天  
        currentMonth++; 
    } 
    //一天的毫秒数  
    var millisecond = 1000*60*60*24; 
    //下月的第一天  
    var nextMonthDayOne = new Date(currentYear,currentMonth,1); 
    //求出上月的最后一天  
    var lastDay = new Date(nextMonthDayOne.getTime()-millisecond); 
    //添加至数组中返回  
    startStop.push(firstDay); 
    startStop.push(lastDay); 
    //返回  
    return startStop; 
}; 

function getQuarterSeasonStartMonth(month) { 
    var quarterMonthStart = 0; 
    var spring = 0; //春  
    var summer = 3; //夏  
    var fall = 6;   //秋  
    var winter = 9;//冬  
    //月份从0-11  
    if (month < 3) { 
        return spring; 
    } 
    if (month < 6) { 
        return summer; 
    } 
    if (month < 9) { 
        return fall; 
    } 
    return winter; 
}; 

function getMonthDays(year,month) { 
    //本月第一天 1-31  
    var relativeDate = new Date(year,month,1); 
    //获得当前月份0-11  
    var relativeMonth = relativeDate.getMonth(); 
    //获得当前年份4位年  
    var relativeYear = relativeDate.getFullYear(); 
    //当为12月的时候年份需要加1  
    //月份需要更新为0 也就是下一年的第一个月  
    if(relativeMonth == 11){ 
        relativeYear++; 
        relativeMonth = 0; 
    }else{ 
        //否则只是月份增加,以便求的下一月的第一天  
        relativeMonth++; 
    } 
    //一天的毫秒数  
    var millisecond = 1000*60*60*24; 
    //下月的第一天  
    var nextMonthDayOne = new Date(relativeYear, relativeMonth, 1); 
    //返回得到上月的最后一天,也就是本月总天数  
    return new Date(nextMonthDayOne.getTime() - millisecond).getDate(); 
};

// 获取本季度
function getCurrentSeason() { 
    //起止日期数组  
    var startStop = new Array(); 
    //获取当前时间  
    var currentDate = new Date(); 
    //获得当前月份0-11  
    var currentMonth = currentDate.getMonth(); 
    //获得当前年份4位年  
    var currentYear = currentDate.getFullYear(); 
    //获得本季度开始月份  
    var quarterSeasonStartMonth = getQuarterSeasonStartMonth(currentMonth); 
    //获得本季度结束月份  
    var quarterSeasonEndMonth = quarterSeasonStartMonth + 2; 
    //获得本季度开始的日期  
    var quarterSeasonStartDate = new Date(currentYear, quarterSeasonStartMonth, 1); 
    //获得本季度结束的日期  
    var quarterSeasonEndDate = new Date(currentYear, quarterSeasonEndMonth, getMonthDays(currentYear, quarterSeasonEndMonth)); 
    //加入数组返回  
    startStop.push(quarterSeasonStartDate); 
    startStop.push(quarterSeasonEndDate); 
    //返回  
    return startStop; 
}; 

//复选框 全选 ------------------------------------
(function() {

    $('body').on('click', '.chkall', function(e) {
        e.stopPropagation();
        var chkall = $(this);
        var chklist = chkall.parents('table').find('.invechk');
        var flag = chkall.prop('checked');

        chklist.each(function(i, o) {
            $(o).prop('checked', flag);
        });
    });

    $('body').on('click', '.invechk', function(e) {
        e.stopPropagation();
        var flag = true;
        var table = $(this).parents('table');
        var chkall = table.find('.chkall');
        var chklist = table.find('.invechk');

        chklist.each(function(i, o) {
            if ($(o).prop('checked') == false) {
                flag = false;
            }
        });
        chkall.prop('checked', flag);
    });
})();

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}


//提示框
function showMsgPane(s, type, callback) {
    var btns = '';
    var type = type || 'prompt';

    $('#modal-msg').remove();

    if (type == 'prompt') {
        btns = ' <button class="btn" onclick="hideMsgPane()">确定</button> '
    } else if (type == 'confirm') {
        btns = ' <button class="btn" onclick="hideMsgPane()">取消</button> ' + ' <button class="btn btn-primary" id="btn-msg-ok">确定</button> ';
    }else if (type == 'alert') {
        btns = ' <button class="btn" id="btn-msg-ok">确定</button> '
    };

   
    var fn = null;
    if (typeof callback == 'function') {
        fn = function() {
            //hideMsgPane();
            $('#modal-msg').hide(function() {
                $('body').off('click', '#btn-msg-ok');
                $('#modal-msg').remove();
                callback();
            });


        };
    } else {
        fn = function() {
            hideMsgPane();
        };
    }

    $('body').on('click', '#btn-msg-ok', fn);
//     $('#modal-msg').modal('show');
    $('#modal-msg').show();
//    alert(11111111);

}

function hideMsgPane() {
    // $('#modal-msg').modal('hide');
    // $('#modal-msg').on('hidden', function () {
    //     $('body').off('click', '#btn-msg-ok');
    //     $('#modal-msg').remove();
    // });
    $('#modal-msg').hide(function() {
        $('body').off('click', '#btn-msg-ok');
        $('#modal-msg').remove();
    });
}

//加载广告
$(document).ready(function(){
	// loadCustomerInfo();
    if($('#scroller').length>0){
        var url = "/server/adv/info/pagelist.json";
            $.getJSON(url, function(rtn){
                var page = {};
                page.content= new Array(4);
                for(var i = 0; i <4; i++){
                    page.content[i] = rtn.content[i];
                }
                var datalist = ad_list_html(page);
                $('#scroller').html(datalist);
                $('#scroller').simplyScroll();
            });
    }
    // IsTeacherLogined();
});

function ad_list_html(page){
	var tpl = [
	           '{@each content as it}',
	           ' <li><a href="${it.imgLink}" target="_blank">',
	           '<img src="${it.imgUrl}" title="${it.title}" width="290" height="135"></a></li>',
	           '{@/each}',
	           ].join('\n');
	return juicer(tpl, page);
}
	

//验证文件扩展名,
//参数：
//fileName 文件名
//arr_exts 允许扩展名的数组
function IsValidFileExtention(fileName,arr_exts)
{
  var arrayExt = fileName.split(".");
  var fileExt = arrayExt[arrayExt.length - 1].toLowerCase();
  var isValid = false;
  for(var i = 0;i < arr_exts.length;i++)
  {
      if(isValid = arr_exts[i] == fileExt)
      {
          break;
      }
  }
  return isValid;
}

function IsTeacherLogined(){
	var url = "/server/teacher/info/isTeacherLogin.json";
	$.post(url, function(rtn){
		if(rtn.length > 0){
			var page = {};
			page.content = rtn;
			var data = is_teacher_login_html(page);
			$li = $('<li></li>');
			$('.navigation li:last').before($li);

			$('.navigation li:eq(4)').html(data);
			$('.navigation').attr("id",rtn[0].id);
			window.sessionStorage.setItem("teacher_id", rtn[0].id);
		}
	});
}

function is_teacher_login_html(page){
	var tpl = [
	           '{@each content as it}',
	           '<a href="../../certificate/page/certificate-list.html" class="t5"></a>',
	           '{@/each}',
	           ].join("\n");
	return juicer(tpl, page);
}

function setAdminUrl(){
    $('#adminurl').html('<a href="http://admin.lining.local/system/system/page/system_log.html" target="_blank">后台管理</a>');
}
//加载用户信息
function loadCustomerInfo(){
	var url = "/server/customer/info/detail.json";
    var data = {
            'id':"0FA1C730-9552-46A7-A632-7784224414CE",
    }
	$.getJSON(url,function(rtn){
		$('.d-ft, .ft p').html(rtn.copyRight);
	});
	
}
