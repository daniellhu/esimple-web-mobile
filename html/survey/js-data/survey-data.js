var surveyBase_id;
var openId;
var isattend;
var isShowCorrect;

(function($) {
	surveyBase_id = getUrlParam("id");
	openId = getUrlParam("openId");
//	openId = "a6dd8821-476e-41cf-a1db-0a2a3a280d74";
	surveyAuth_detail();
	
})(Zepto);

function surveyAuth_detail(){
	var url = mobilePluginPath + "/survey/surveyAuth/detail.json";
	var data = {
		id : surveyBase_id
	};
	$.getJSON(url,data,function(rtn){
		/*$('#total-score').text(rtn.totalScore);
		$('#pass-score').text(rtn.showPassScore);*/
		isShowCorrect = rtn.isShowCorrect;
		isAttend();
	});
}

function isAttend(){
	var url = mobilePluginPath + "/survey/surveyAuth/isAttend.json";
	var data = {user_id:openId,survey_id:surveyBase_id};
	
	$.getJSON(url,data,function(rtn){
		isattend = rtn;
		survey_question_list();
	});
}

function survey_question_list() {
	var url = mobilePluginPath + "/survey/surveyAuth/list.json";
	var data = {
		surveyBase_id : surveyBase_id
	};
 
	$.getJSON(url, data, function(rtn) {
		if (isShowCorrect && isattend) {
			survey_question_html_showCorrect(rtn);
		} else {
			survey_question_html(rtn);
		}
		questionOrdered($('body'));
		initToolBar();
		if (isattend) {
			loadUserAnswer();
//			loadUserScore();
		}
	});
}

function survey_question_html(rtn){
	var tpl = [
	            '{@each list as it,k}',
		            '{@each it.items.list as it1,j}',
			            '{@if k==0 && j==0}',
			            '<div class="question-center active">',
			            '{@/if}',
			            '{@if k!=0 || j!=0}',
			            '<div class="question-center hide">',
			            '{@/if}',
		            	'<h5><span></span>.<spana id="typea" class="fw700 blue">【${it1.type}】</spana>${it1.question}</h5>',
		            	'<ul class="anwer-list list-unstyled" value="${it1.type}">',
		            	'{@if it1.type=="问答题"}',
    						'<ol><textarea class="textarea-xxlarge mt10" itemid="${it1.id}"></textarea></ol>',
    					'{@/if}',
		            		'{@each it1.itemRes.list as it2,i}',
				                '<li>',
				                '{@if it1.type!="多选题"}',
				                    '<input type="radio" name="${it1.id}" value="${it2.id}" id="${it2.id}"/>',
				                '{@/if}',
				                '{@if it1.type=="多选题"}',
				                	'<input type="checkbox" name="${it1.id}" value="${it2.id}" id="${it2.id}"/>',
				                '{@/if}',
				                    '<span>${it2.answer}</span>',
				                '</li>',
			                '{@/each}',
			            '</ul>',
				      '</div>',
		            '{@/each}',
	            '{@/each}',
	        ].join('\n');
	 $("#survey-question-list").html(juicer(tpl, rtn));
}

function survey_question_html_showCorrect(rtn){
	var tpl = [
	            '{@each list as it,k}',
		            '{@each it.items.list as it1,j}',
			            '{@if k==0 && j==0}',
			            '<div class="question-center active">',
			            '{@/if}',
			            '{@if k!=0 || j!=0}',
			            '<div class="question-center hide">',
			            '{@/if}',
		            	'<h5><span></span>. 【${it1.type}】${it1.question}</h5> ',
		            	'<ul class="anwer-list list-unstyled">',
		            		'{@if it1.type=="问答题"}',
		            			'<ol><textarea class="textarea-xxlarge mt10" itemid="${it1.id}">${it1.describes}</textarea></ol>',
		            		'{@/if}',
		            		'{@each it1.itemRes.list as it2,i}',
				                '<li>',
				                '{@if it1.type!="多选题"}',
				                    '<input type="radio" name="${it1.id}" value="${it2.id}" id="${it2.id}" item_itemRes="${it1.id}_${it2.id}" itemType="${it1.type}"/>',
				                '{@/if}',
				                '{@if it1.type=="多选题"}',
				                	'<input type="checkbox" name="${it1.id}" value="${it2.id}" id="${it2.id}" item_itemRes="${it1.id}_${it2.id}" itemType="${it1.type}"/>',
				                '{@/if}',
				                    '<span>${it2.answer}</span>',
				                '</li>',
			                '{@/each}',
			            '</ul>',
				      '</div>',
		            '{@/each}',
	            '{@/each}',
	        ].join('\n');
	 $("#survey-question-list").html(juicer(tpl, rtn));
}

function loadUserScore(){
	var url = mobilePluginPath + "/survey/surveyReportCard/detail.json";
	var data = {user_id:openId,surveyBase_id:surveyBase_id};
	$.getJSON(url,data,function(rtn){
		$('#user-score').text(rtn.score);
	});
}
function loadUserAnswer(){
	var url = mobilePluginPath + "/survey/surveyReply/loadAnswer.json";
	var data = {user_id:openId,surveyBase_id:surveyBase_id};
	$.getJSON(url,data,function(rtn){
		var table = $('#survey-question-list');
        $.each(rtn.list,function(i,item){
            if(item.itemRes_id!=null&&item.itemRes_id!=""){
                var chk = table.find('input[id=' + item.itemRes_id + ']');
                $(chk).attr("checked","checked");
            }
			if(item.describes!=null&&item.describes!=""){
				var ta = table.find('textarea[itemid=' + item.item_id + ']');
				$(ta).html(item.describes);
				$(ta).attr("readonly","readonly");
			}
            var radios = table.find("input[type='radio']");
            radios.attr("disabled","disabled");

            var checkboxs = table.find("input[type='checkbox']");
            checkboxs.attr("disabled","disabled");
            
            table.find('textarea').attr('readonly', 'readonly');
        });
	});
}

function submitUserAnswers(){

	var isSub;
    var allItem=[];
    var ul = $("#survey-question-list ul");
    var ca = $('.test-question .active');
    $.each($("#survey-question-list ul"),function(index,item){
        var inarr;
        var all=new Array();
//        $.each($(item).children("li"),function(idx,itm){
//            var hasChecked=$(itm).children("input").get(0).checked;
//            all.push(hasChecked);
//        });
//        alert($(this).attr("value"));
        if ($(this).attr("value") != "问答题") {
        	 $.each($(item).children("li"),function(idx,itm){
               var hasChecked=$(itm).children("input").get(0).checked;
               all.push(hasChecked);
           });
		} else {
			if ($.trim($(this).find("textarea").val()).length != 0) {
				all.push(true);
			}
		}
       
        inarr=$.inArray(true,all);
        allItem.push(inarr);
    });
    isSub=$.inArray(-1,allItem);
    if(isSub==-1){
    	alertMsg("确定提交吗？",1,saveAnswer);
    	ca.removeClass('active').removeClass('hide');
    }else{
    	alertMsg("未回答所有问题确认提交吗？",1,saveAnswer);
    	ca.removeClass('active').removeClass('hide');
    }
     
}

function saveAnswer(){
	
	 var table = $('#survey-question-list');
     var chk = table.find('input:checked');
     var textarea = table.find('textarea');
     var item_ids = new Array();
     var itemRes_ids = new Array();

     var item_itemRes = new Array();
     var itemType = new Array();
     var itemScore = new Array();

     var item_expressions = new Array();
	 var item_ex_ids = new Array();
		
     chk.each(function (i, o) {
         item_ids.push($(o).attr('name'));
         itemRes_ids.push($(o).attr('id'));

         item_itemRes.push($(o).attr('item_itemRes'));
         itemType.push($(o).attr('itemType'));
         itemScore.push($(o).attr('itemScore'));

     });
     
     textarea.each(function(i, o) {
			item_ex_ids.push($(o).attr('itemid'));
			item_expressions.push($(o).val());
		});

     jQuery.ajaxSettings.traditional = true;
     var url = mobilePluginPath + "/survey/surveyReply/save.json";
     var data = {
         user_id:openId,
         survey_id:surveyBase_id,
         item_id:item_ids,
         itemRes_id:itemRes_ids,

         item_itemRes:item_itemRes,
         itemType:itemType,
         itemScore:itemScore,
         item_expression : item_expressions,
         item_ex_id : item_ex_ids,
         
     };
     $.post(url, data, function() {
    	 window.location.reload();
	 });
}
