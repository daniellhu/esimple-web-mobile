;
var code="";
var openId = "";
var appId = "";
var testStatus = "";
var sortType="timeCreated";
var sortTime ="";

(function($){
	code = getUrlParam("code");
	type = getUrlParam("type");
	appId = getUrlParam("appId");
	oAuth2Request();
//	test_list(0);
	
	if(loadsessionStorage("resource-type")!=""&&loadsessionStorage("resource-type")!=null){
		resourceStatus = loadsessionStorage("resource-type");
	 }
	
	$('#btn-search').tap(function() {
		test_list(0);
	 });
	 
	$('.resource-order').tap(function(){
		sortTime =  $(this).attr("id");
//		savesessionStorage("resource-order",sortType);
		test_list(0);
	 });
	 
	 $('.resource-type').tap(function(){
		 testStatus = $(this).attr("id");
		savesessionStorage("resource-type",testStatus);
		test_list(0);
	 });
})(Zepto);

function test_list(pageno){
	var keyword = $("#txt-keyword").val();
	var url = mobilePluginPath + "/test/testAuth/pagelist.json";
	
	var data = {user_Id:openId,
	        size:10,
	        start:pageno,
	        keyword:keyword,
	        entityStatus:"PUBLISH",
	        testStatus:testStatus,
		    sortType:sortType,
		    sortDirection:sortTime 
	    };
	    $.getJSON(url,data,function(rtn) {
	    	rtn.page.openId = openId;
	    	if(pageno==0){
				$("#resource-list").empty();
			}
	        test_list_html(rtn.page);
	        $('#resource-list-more').addClass('hide');
	    });
}

function test_list_html(page){
	 var tpl = [
	            '{@each content as it,k}',
	            '<li data-id="${it.testBase.id}" data-openId="${openId}" data-type="resource-test" data-status="${it.testBase.status}" data-isattend="${it.isAttend}">',
	                '<div class="li-left">',
	                    '<div class="vm">',
	                        '<h4>',
	                         '{@if it.isAttend}',
	                            '<span class="label label-warning">已参加</span>',
	                          '{@/if}',  
	                            '<span class="label label-primary">测</span>',
	                            '{@if it.testBase.name.length>8 }',
	                            	'${it.testBase.name.substring(0,8)}...',
	                            '{@/if}',
	                            '{@if it.testBase.name.length<=8 }',
                            		'${it.testBase.name}',
                            	'{@/if}',
	                        '</h4>',
	                    '</div>',
	                    '<div class="other">',
	                        '<div>起止时间: ${it.testBase.startDt}至${it.testBase.endDt}</div>',
	                    '</div>',
	                    '<div class="other">',
	
	                        '<div>创建时间: ${it.testBase.timeCreated}</div>',
	                    '</div>',
	                '</div>',
	                '<div class="right-arrow pull-right">',
	                    '<span class="glyphicon glyphicon-chevron-right"></span>',
	                '</div>',
	            '</li>',
	            '{@/each}',
	        ].join('\n');
	 $("#resource-list").append(juicer(tpl, page));
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
			test_list(0);
		});
	});
}