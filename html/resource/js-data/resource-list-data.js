;
var type = "";
var sortType="timeCreated";
var code="";
var openId = "";
var appId = "";
(function($){
	 code = getQueryString("code");
	 type = getQueryString("type");
	 appId = getQueryString("appId");
	 var type_title = $('.nav-list .nav-type .nav-title');
	 type="COURSE";
	 if(type=="COURSE"){
		 type_title.html("课程");
	 }
	 else{
		 type_title.html("文档");
	 }
	//  oAuth2Request(code);
	 	InitZtree();
		resource_list(0);
	 if(loadsessionStorage("resource-order")!=""&&loadsessionStorage("resource-order")!=null){
		 sortType = loadsessionStorage("resource-order");
	 }
	 if(loadsessionStorage("resource-type")!=""&&loadsessionStorage("resource-type")!=null){
		 type = loadsessionStorage("resource-type");
	 }
	 var kcname = loadsessionStorage("kcname");
	 if(kcname!=""&&kcname!=null){
		 var kc_navtitle = $('.nav-list .nav-sort .nav-title');
//		 kc_navtitle.html(kcname);
	 }
	 var typename = loadsessionStorage("dd-type");
	 if(typename!=""&&typename!=null){
		 var type_navtitle = $('.nav-list .nav-type .nav-title');
		 type_navtitle.html(typename);
	 }
	 var ordername = loadsessionStorage("dd-order");
	 if(ordername!=""&&ordername!=null){
		 var order_navtitle = $('.nav-list .nav-order .nav-title');
		 order_navtitle.html(ordername);
	 }
	 $('#btn-search').tap(function() {
		 resource_list(0);
	 });
	 
	 $('.resource-type').tap(function(){
		type =  $(this).attr("id");
		savesessionStorage("resource-type",type);
		resource_list(0);
	 });
	 $('.resource-order').tap(function(){
		sortType =  $(this).attr("id");
		savesessionStorage("resource-order",sortType);
		resource_list(0);
	 });
})(Zepto);

function resource_list(pageno){
    $('#resource-list-more').removeClass('hide2');
	$('.alert-warning').addClass('hide');
	page=pageno+1;
	var tagIds =" ";
	var keyword = $("#txt-keyword").val();	
	var catalog_id=$("#catalog_id").val();
	var url = "/portal/train/course/info/pagelist.json";
	var data = {
			size : 10,
			start : pageno,
		    showHidden : false,
		    containSub : true,
			courseName : keyword,
			status : "Audit",
			sortType:"timeCreated",
		    detail_ids : tagIds,
			sortDirection:"asc",
			catalog_id : catalog_id,
			isMobile:true
			};
	$.getJSON(url,data,function(rtn) {
		if(rtn.totalElements == 0){
			$("#resource-list").empty();
			setTimeout(function () {
				$('#resource-list-more').addClass('hide2');
				$('.alert-warning').removeClass('hide');
				},1000);
		}else{
			if(pageno==0){
				$("#resource-list").empty();
			}			
			
			setTimeout(function () {
				$('#resource-list-more').addClass('hide2');
				resource_list_html(rtn);
				highlight(keyword);
				},1000);
			
			

			
		}
	});
}

function resource_list_html(page){
	 var tpl = [
	            '{@each content as it,k}',
	            '<li data-id="${it.id}"  data-openId="${openId}" data-type="resource-course">',
	            '<div class="vm">',				
	            	'<h4>${it.courseName} <span class="label label-primary">课</span></h4>',
	            '</div>',            	
	            '<div class="star-wrap">',
	            	'<span class="resource-star"><span class="resource-star-inner" style="width: ${(it.avgScore*10).toFixed(0)}%"></span></span> ',
	            '</div>',
	            '<div class="other">',
		            '<div>创建时间: ${it.timeCreated}</div>',
		            '<div>学习人数: ${it.studyCount}</div>',
		         '</div>',
	          '</li>',
	            '{@/each}',
	        ].join('\n');
	 $("#resource-list").append(juicer(tpl, page));
}

function InitZtree(){
	var parentId=0;
	// var url =  "/portal/train/course/catalog/list.json?parentId=0";
	var url =  "/portal/train/course/catalog/list.json?parentId=znweiketang";
	$.getJSON(url,function(rtn){
		var list = {};
		list.data = rtn;
		var datalist = '<li><a href="javascript:;">全部分类</a></li>'+zTree_html(list);
		$('#ul-sort-kc').html(datalist);
	});
}

function zTree_html(rtn){
	var tpl = [
	            '{@each data as it,k}',
	            // '{@if it.id=="root"}',
	            	// '<li><a href="javascript:;">全部分类</a></li>',
					'{@if it.name.length>6}',
		            '<li><a href="javascript:;" data-target="${it.id}" data-name="${it.name}">${it.name.substring(0, 6)}...</a></li>',
		            '{@/if}',
		            '{@if it.name.length<=6}',
		            '<li><a href="javascript:;" data-target="${it.id}" data-name="${it.name}">${it.name}</a></li>',
		            '{@/if}',
	            // '{@/if}',
	            '{@/each}',
	        ].join('\n');
	 return juicer(tpl, rtn);
}

function InitZtreeLevel2(target,name){
	$('.dropdown-list-lvl-2').attr("id",target);
	var url =   "/portal/train/course/catalog/list.json?parentId="+target;
	$.getJSON(url,function(rtn){
		var list = {};
		list.data = rtn;
		var datalist = zTree_level2_html(list);
		$('#'+target).empty();
		$('#'+target).append('<dd><a href="javascript:;" data-title="'+ name+'" data-id="'+target+'">全部</a></dd>');
		$('#'+target).append(datalist);
	});
}

function zTree_level2_html(list){
	var tpl = [
	            '{@each data as it,k}',
	            '{@if it.name.length>6}',
	            	'<dd><a href="javascript:;" data-id="${it.id}">${it.name.substring(0, 6)}...</a></dd>',
	            '{@/if}',
	            '{@if it.name.length<=6}',
            		'<dd><a href="javascript:;" data-id="${it.id}">${it.name}</a></dd>',
            	'{@/if}',
	            '{@/each}',
	        ].join('\n');
	 return juicer(tpl, list);
}

//请求授权
function oAuth2Request(code){
	var url =  mobilePluginPath + "/resource/getopenId";
	var data = {code:code,appId:appId};
	$.getJSON(url,data,function(rtn){
		openId = rtn;
		var url_1 = mobilePluginPath + "/common/getUserId.json";
		var data_1 = {openId:rtn};
		$.getJSON(url_1,data_1,function(rtn1){
			if(rtn1!=null&&rtn1!=""){
				openId = rtn1;
			}
			InitZtree();
			resource_list(0);
		});
		
	});
}
//搜索结果高亮显示
	function encode(s){
	  return s.replace(/&/g,"&").replace(/</g,"<").replace(/>/g,">").replace(/([\\\.\*\[\]\(\)\$\^])/g,"\\$1");
	}
	function decode(s){
	  return s.replace(/\\([\\\.\*\[\]\(\)\$\^])/g,"$1").replace(/>/g,">").replace(/</g,"<").replace(/&/g,"&");
	}
	function highlight(s){
	  if (s.length==0){
	    return false;
	  }
	  s=encode(s).toLowerCase();
	  var obj_li = $('#resource-list').find('h4');
	  obj_li.each(function(i,o){
		  var t=o.innerHTML.replace(/<span\s+class=.?highlight.?>([^<>]*)<\/span>/gi,"$1");
		  o.innerHTML=t;
		  var cnt=loopSearch(s,o);
		  t=o.innerHTML
		  var r=/{searchHL}(({(?!\/searchHL})|[^{])*){\/searchHL}/g
		  t=t.replace(r,"<span class='highlight'>$1</span>");
		  o.innerHTML=t;
	  });
	}
	
	function loopSearch(s,obj){
	  var cnt=0;
	  if (obj.nodeType==3){
	    cnt=replace(s,obj);
	    return cnt;
	  }
	  for (var i=0,c;c=obj.childNodes[i];i++){
	    if (!c.className||c.className!="highlight")
	      cnt+=loopSearch(s,c);
	  }
	  return cnt;
	}
	function replace(s,dest){
	  var r=new RegExp(s,"g");
	  var tm=null;
	  var t=dest.nodeValue;
	  var cnt=0;
	  if (tm=t.match(r)){
	    cnt=tm.length;
	    t=t.replace(r,"{searchHL}"+decode(s)+"{/searchHL}")
	    dest.nodeValue=t;
	  }
	  return cnt;
	}
	
	function getQueryString(name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) return unescape(r[2]); return null;
	 }