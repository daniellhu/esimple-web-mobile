var test_id;
var openId;
var isattend ;
var  isShowCorrect;
(function($) {
	test_id = getUrlParam("id");
	openId = getUrlParam("openId");
	testAuth_detail();
	
})(Zepto);

function testAuth_detail(){
	var url = mobilePluginPath + "/test/testAuth/detail.json";
	var data = {
		id : test_id
	};
	$.getJSON(url,data,function(rtn){
		$('#total-score').text(rtn.totalScore);
		$('#pass-score').text(rtn.showPassScore);
		isShowCorrect = rtn.isShowCorrect;
		isAttend();
	});
}

function isAttend(){
	var url = mobilePluginPath + "/test/testAuth/isAttend.json";
	var data = {user_id:openId,test_id:test_id};
	$.getJSON(url,data,function(rtn){
		isattend = rtn;
		test_question_list();
	});
}
function test_question_list(){
	var url = mobilePluginPath + "/test/testAuth/list.json";
	var data = {testBase_id:test_id};
	$.getJSON(url,data,function(rtn){
		if(isShowCorrect&&isattend){
			test_question_html_showCorrect(rtn);
		}else{
			test_question_html(rtn);
		}
		questionOrdered($('body'));
		initToolBar();
		if(isattend){
			loadUserAnswer();
			loadUserScore();
		}
	});
}
function test_question_html(rtn){
	var tpl = [
	            '{@each list as it,k}',
		            '{@each it.items.list as it1,j}',
			            '{@if k==0 && j==0}',
			            '<div class="question-center active">',
			            '{@/if}',
			            '{@if k!=0 || j!=0}',
			            '<div class="question-center hide">',
			            '{@/if}',
		            	'<h5><span></span>. 【${it1.type}】${it1.question}(${it1.score}分)</h5>',
		            	'<ul class="anwer-list list-unstyled">',
		            		'{@each it1.itemRes.list as it2,i}',
				                '<li>',
				                '{@if it1.type!="多选题"}',
				                    '<input type="radio" name="${it1.id}" value="${it2.id}" id="${it2.id}" item_itemRes="${it1.id}_${it2.id}" itemType="${it1.type}" itemScore="${it1.score}"/>',
				                '{@/if}',
				                '{@if it1.type=="多选题"}',
				                	'<input type="checkbox" name="${it1.id}" value="${it2.id}" id="${it2.id}" item_itemRes="${it1.id}_${it2.id}" itemType="${it1.type}" itemScore="${it1.score}"/>',
				                '{@/if}',
				                    '<span>${it2.answer}</span>',
				                '</li>',
			                '{@/each}',
			            '</ul>',
				      '</div>',
		            '{@/each}',
	            '{@/each}',
	        ].join('\n');
	 $("#test-question-list").html(juicer(tpl, rtn));
}

function test_question_html_showCorrect(rtn){
	var tpl = [
	            '{@each list as it,k}',
		            '{@each it.items.list as it1,j}',
			            '{@if k==0 && j==0}',
			            '<div class="question-center active">',
			            '{@/if}',
			            '{@if k!=0 || j!=0}',
			            '<div class="question-center hide">',
			            '{@/if}',
		            	'<h5><span></span>. 【${it1.type}】${it1.question}(${it1.score}分)</h5> ',
		            	'<ul class="anwer-list list-unstyled">',
		            		'{@each it1.itemRes.list as it2,i}',
				                '<li>',
				                '{@if it1.type!="多选题"}',
				                    '<input type="radio" name="${it1.id}" value="${it2.id}" id="${it2.id}" item_itemRes="${it1.id}_${it2.id}" itemType="${it1.type}" itemScore="${it1.score}"/>',
				                '{@/if}',
				                '{@if it1.type=="多选题"}',
				                	'<input type="checkbox" name="${it1.id}" value="${it2.id}" id="${it2.id}" item_itemRes="${it1.id}_${it2.id}" itemType="${it1.type}" itemScore="${it1.score}"/>',
				                '{@/if}',
				                    '<span>${it2.answer}</span>',
				                '</li>',
			                '{@/each}',
			            '</ul>',
			            '<span>正确答案：{@each it1.itemRes.list as it2,i}{@if it2.correct}${it2.answer};{@/if}</span>{@/each}',
				      '</div>',
		            '{@/each}',
	            '{@/each}',
	        ].join('\n');
	 $("#test-question-list").html(juicer(tpl, rtn));
}


function loadUserScore(){
	var url = mobilePluginPath + "/test/testReportCard/detail.json";
	var data = {user_id:openId,test_id:test_id};
	$.getJSON(url,data,function(rtn){
		$('#user-score').text(rtn.score);
	});
}
function loadUserAnswer(){
	var url = mobilePluginPath + "/test/testReply/loadAnswer.json";
	var data = {user_id:openId,test_id:test_id};
	$.getJSON(url,data,function(rtn){
		var table = $('#test-question-list');
        $.each(rtn.list,function(i,item){
            if(item.itemRes_id!=null&&item.itemRes_id!=""){
                var chk = table.find('input[id=' + item.itemRes_id + ']');
                $(chk).attr("checked","checked");
            }
            var radios = table.find("input[type='radio']");
            radios.attr("disabled","disabled");

            var checkboxs = table.find("input[type='checkbox']");
            checkboxs.attr("disabled","disabled");
        });
	});
}

function submitUserAnswers(){

	var isSub;
    var allItem=[];
    var ul = $("#test-question-list ul");
    $.each($("#test-question-list ul"),function(index,item){
        var inarr;
        var all=new Array();
        $.each($(item).children("li"),function(idx,itm){
            var hasChecked=$(itm).children("input").get(0).checked;
            all.push(hasChecked);
        });
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
	
	 var table = $('#test-question-list');
     var chk = table.find('input:checked');
     var item_ids = new Array();
     var itemRes_ids = new Array();

     var item_itemRes = new Array();
     var itemType = new Array();
     var itemScore = new Array();

     chk.each(function (i, o) {
         item_ids.push($(o).attr('name'));
         itemRes_ids.push($(o).attr('id'));

         item_itemRes.push($(o).attr('item_itemRes'));
         itemType.push($(o).attr('itemType'));
         itemScore.push($(o).attr('itemScore'));

     });

     jQuery.ajaxSettings.traditional = true;
     var url = mobilePluginPath + "/test/testReply/save.json";
     var data = {
         user_id:openId,
         test_id:test_id,
         item_id:item_ids,
         itemRes_id:itemRes_ids,

         item_itemRes:item_itemRes,
         itemType:itemType,
         itemScore:itemScore,
         passScore:$("#pass-score").text()
     };
     $.post(url, data, function() {
    	 window.location.reload();
	 });
}