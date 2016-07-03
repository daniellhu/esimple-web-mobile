;
var code="";
var openId = "";
var appId = "";
var surveyStatus = "";
var sortType="timeCreated";
var sortTime ="";
(function($){
	code = getUrlParam("code");
	type = getUrlParam("type");
	appId = getUrlParam("appId");
	oAuth2Request();
//	survey_list(0);
	
	 if(loadsessionStorage("resource-type")!=""&&loadsessionStorage("resource-type")!=null){
		 surveyStatus = loadsessionStorage("resource-type");
	 }
	 
	$('#btn-search').tap(function() {
		survey_list(0);
	 });
	$('.resource-order').tap(function(){
		sortTime =  $(this).attr("id");
//		savesessionStorage("resource-order",sortType);
		survey_list(0);
	 });
	 
	 $('.resource-type').tap(function(){
		surveyStatus = $(this).attr("id");
		savesessionStorage("resource-type",surveyStatus);
		survey_list(0);
	 });
	  
})(Zepto);

function survey_list(pageno){
	var keyword = $("#txt-keyword").val();
	var url = mobilePluginPath + "/survey/surveyAuth/pagelist.json";
	var data = {user_Id:openId,
	        size:10,
	        start:pageno,
	        keyword:keyword,
	        entityStatus:"PUBLISH",
	        surveyStatus:surveyStatus,
	        sortType:sortType,
	        sortDirection:sortTime 
	    };
	    $.getJSON(url,data,function(rtn) {
	    	rtn.page.openId = openId;
	    	if(pageno==0){
				$("#survey-list").empty();
			}
	    	survey_list_html(rtn.page);
	        $('#survey-list-more').addClass('hide');
	    });
}

function survey_list_html(page){
	 var tpl = [
	            '{@each content as it,k}',
	            '<li data-id="${it.surveyBase.id}" data-openId="${openId}" data-type="survey" data-status="${it.surveyBase.status}" data-isattend="${it.isAttend}">',
	                '<div class="li-left">',
	                    '<div class="vm">',
	                        '<h4>',
	                         '{@if it.isAttend}',
	                            '<span class="label label-warning">已参加</span>',
	                          '{@/if}',
	                            '<span class="label label-primary">调</span>',
	                            '{@if it.surveyBase.name.length>8 }',
	                            	'${it.surveyBase.name.substring(0,8)}...',
	                            '{@/if}',
	                            '{@if it.surveyBase.name.length<=8 }',
	                        		'${it.surveyBase.name}',
	                        	'{@/if}',
	                        '</h4>',
	                    '</div>',
	                    '<div class="other">',
	                        '<div>起止时间: ${it.surveyBase.startDt}至${it.surveyBase.endDt}</div>',
	                    '</div>',
	                    '<div class="other">',
	                        '<div>创建时间: ${it.surveyBase.timeCreated}</div>',
	                    '</div>',
	                '</div>',
	                '<div class="right-arrow pull-right">',
	                    '<span class="glyphicon glyphicon-chevron-right"></span>',
	                '</div>',
	            '</li>',
	            '{@/each}',
	        ].join('\n');
	 $("#survey-list").append(juicer(tpl, page));
}

function oAuth2Request(){
	var url =  mobilePluginPath + "/resource/getopenId";
	var data = {code:code,appId:appId};
	$.getJSON(url,data,function(rtn){
		var url_1 = mobilePluginPath + "/common/getUserId.json";
		var data_1 = {openId:rtn};
		$.getJSON(url_1,data_1,function(rtn1){
			if(rtn1!=null&&rtn1!=""){
				openId = rtn1;
			}
			survey_list(0);
		});
	});
}