;(function($){
  var myScroll1, myScroll2;

  // myScroll1 = new IScroll('.dropdown-scroll-wrap-1', { scrollbars: true, scrollX: false, scrollY: true, click: true });
  // myScroll2 = new IScroll('.dropdown-scroll-wrap-2', { scrollbars: true, scrollX: false, scrollY: true, click: true });

  $('.nav-list').on('tap', 'li', dropdown_handler);
  $('.dropdown-list').on('tap', 'a', dropdownMenu_handler);
  $('.dropdown-cover').on('tap', hideDropdownMenu_handler);
  $('.form-search').on('tap', hideDropdownMenu_handler);
  function showDropDownMenu(flag, target, caret) {
    if (flag) {
      $('.dropdown-cover').show();
      $('.dropdown-wrap').show();
      $('#' + target).show();
      caret.addClass('on');

      // myScroll1.refresh();
    }
    else {
      $('.dropdown-cover').hide();
      $('.dropdown-wrap').hide();
      $('#' + target).hide();
      caret.removeClass('on');

      $('.dropdown-list-lvl-1 li').removeClass('selected');
      $('.dropdown-list-lvl-2').hide();
    }
  }

  function dropdown_handler() {
    var dropdown_btn = $(this);
    var target = dropdown_btn.attr('data-target');
    var caret = dropdown_btn.children('.nav-icon');
    var wrap = dropdown_btn.parent();

    if (caret.hasClass('on')) {
      showDropDownMenu(false, target, caret)
    }
    else {
      // 隐藏其他下拉菜单
      wrap.children('li').each(function(index, item){
        var caret = $(item).children('.nav-icon');
        var target = $(item).attr('data-target');
        if (caret.hasClass('on')) {
          showDropDownMenu(false, target, caret)
        }
      });

      showDropDownMenu(true, target, caret)
    }
  }

  function dropdownMenu_handler(){
    var menu_item = $(this);
    var parent = menu_item.closest('.dropdown-list');
    var target = parent.attr('id');
//    var i = parent.index();
    var i = parent.index()-1;
    var caret = $('.nav-list').children('li').eq(i).children('.nav-icon');
    var navtitle = $('.nav-list').children('li').eq(i).children('.nav-title');

    // 第一个菜单有二级菜单，不隐藏
//    if (i != 0) {
    if (i != -1) {
      var title = menu_item.children('.dd-title').attr('data-title');
      navtitle.html(title);
      savesessionStorage(parent.attr("id"),title);
      showDropDownMenu(false, target, caret);
    }
  }

  function hideDropdownMenu_handler() {
      $('.nav-list').children('li').each(function(index, item){
        var caret = $(item).children('.nav-icon');
        var target = $(item).attr('data-target');
        if (caret.hasClass('on')) {
          showDropDownMenu(false, target, caret)
        }
      });
  }

  // 二级菜单
  $('.dropdown-list-lvl-1').on('tap', 'a', dropdown_lvl1_handler);
  $('.dropdown-list-lvl-2').on('tap', 'a', dropdownMenu_lvl2_handler);

  function dropdown_lvl1_handler() {
    var dropdown_btn = $(this);
    var target = dropdown_btn.attr('data-target');
    var target_name = dropdown_btn.attr('data-name');
    var i = dropdown_btn.parent('li').index();
    var wrap = dropdown_btn.closest('.dropdown-list-lvl-1');
    if(target!=null&&target!=""){
    	InitZtreeLevel2(target,target_name);
    }
    if (i == 0) {
      // "全部分类"
      var navtitle = $('.nav-list .nav-sort .nav-title');
      var caret = $('.nav-list .nav-sort .nav-icon');
      
      navtitle.html(dropdown_btn.html());
      savesessionStorage("kcname",dropdown_btn.html());
      savesessionStorage("kcid","root")
      $('#form-search-resourceKcDetailId').val('root');
      resource_list(0);
      showDropDownMenu(false, 'dd-sort', caret);
    }
    else {
      $('li', wrap).each(function(index, item){
        $(item).removeClass('selected');
        $('#'+$('a',item).attr('data-target')).hide();
      });

      $('.dropdown-list-lvl-1').children('li').eq(i).addClass('selected');
      $('#'+target).show();
      // myScroll2.refresh();
    }
  }

  function dropdownMenu_lvl2_handler() {
    var btn = $(this);
    var navtitle = $('.nav-list .nav-sort .nav-title');
    var caret = $('.nav-list .nav-sort .nav-icon');
    var title = btn.attr('data-title') || btn.html();

    if (title.length > 4) {
      title = title.substring(0, 4) + '...';
    }

    var kcId = btn.attr('data-id');
    $('#form-search-resourceKcDetailId').val(kcId);
    savesessionStorage("kcid",kcId);
    savesessionStorage("kcname",title);
    navtitle.html(title);
    showDropDownMenu(false, 'dd-sort', caret);
    resource_list(0);
  }
  
  
  $('#survey-list').on('tap', 'li', function(){
	  var o = $(this);
	  var id = o.attr('data-id');
	  var openId = o.attr('data-openId');
//	  var openId ="a6dd8821-476e-41cf-a1db-0a2a3a280d74";
	  var type = o.attr('data-type');
	  var status = o.attr('data-status');
	  var isattend = o.attr('data-isattend');
	  if(status=="进行中"){
		  window.location.href= type + '.html?id='+id+'&openId='+openId;
	  }else{
		  if(status=="已结束"){
			  if(isattend=="true"){
				  window.location.href= type + '.html?id='+id+'&openId='+openId;
			  }else{
				  alertMsg("调查已结束，您未参与！") ;
			  }
		  }else{
			  alertMsg("调查尚未开始。");
		  }
	  }
	  
  });

  
})(Zepto);
function savesessionStorage(key,value){
	sessionStorage.setItem(key,value);
}
function loadsessionStorage(name){
   return sessionStorage.getItem(name);
}

//无级加载页面
;(function($){
  var range = 0;             //距下边界长度/单位px  
  var totalHeight = 0;   
  var main = $('.resource-list'); //主体元素
  var page = 0;
  
  $('.wrap').scroll(function(){  
    var srollPos = $('.wrap').scrollTop();    //页面超出窗口的高度
      
    totalHeight = parseFloat($('.wrap').height()) + parseFloat(srollPos); 

    if(($('.wrap .resource-list').height() + 10 - range) <= totalHeight) {  
    	$('#survey-list-more').removeClass('hide');
    	page = page + 1;
        survey_list(page);
        
//        main.append('<li><div class="vm"><h4>网上大学信息及时录入培训</h4><span class="label label-primary">课</span></div><div class="star-wrap"><span class="resource-star"><span class="resource-star-inner" style="width: 94%"></span></span></div><div class="other"><div>创建时间: 一周前</div><div>人数: 24</div></div></li>');  
    }  
  });  
 })(Zepto);

 ;(function($){
  // 清除搜索框
  var wrap = $('.form-control-wrap');

  $('.btn-search-clear', wrap).on('tap', function () {
    $('.btn-search-clear', wrap).hide();
    $('.form-control', wrap).val('');
  });

  $('.form-control', wrap).on('keyup', function () {
    if ($('.form-control', wrap).val().length > 0) {
      $('.btn-search-clear', wrap).show();
    }
    else {
      $('.btn-search-clear', wrap).hide();
    }
  });
  
})(Zepto);