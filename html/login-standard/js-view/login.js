var content = "";
var customerId = "";
var memberId = "";

$(document).ready(function() {
    $('body').on('click', '#btn-register', function () {
	  //clearForm('form-horizontal');
      $('.help-inline').remove();
    $('#modal-register').modal('show');
  });
//    	  logout(); 
    	  $('body').on('click','#Logon_btnSubmit',Login_Form);
    	Auto();
    	load_org_options();
        $('body').on('click', '#Button1', function(){

        	getContent();
        });
        //注册用户
       $('body').on('click','#btn-user-register',setAddValidator);
       
       $(window).keydown(function(){
    	   var theEvent = window.event || e;
    	   var code = theEvent.keyCode || theEvent.which;
    	   if (code == 13) {
    		   $("#Logon_btnSubmit").click();
    	   }
       })
      }); 
   
      //自动登录功能
    function Auto(){
    	if($.cookie( "remind")=="true"&&($.cookie( "lmspd_user"))!=null){
    		 
    	// window.location.href='../../default/page/default.html';	
        $("#txt_UserName").val($.cookie( "loginid"));
        $("#txt_Password").val($.cookie( "password"));
    	Login_Form();    	
    	}
    }

 //登录功能
      function Login_Form() {
    		var url = purl();
    		var data = $("#login-form").serialize();
    		var password = $("#txt_Password").val();
    
    		var ref = url.param("ref");
    	
    		$.ajax({
    			url : "/server/session/login.json",
    			data : data,
    			type : "post",
    			async:false,
    		  error: function(jqXHR, textStatus, errorMsg){ if(jqXHR.status==500&&password!='')$("#sp_Message").html("登录失败！用户名和密码错误！").show();}
    		}).success(function(rtn) {
    			if (rtn.code != 1) {
    				 $("#sp_Message").html(rtn.message).show();
    			}
    			if(rtn.code == 1) {
    				saveLoginCount();
    				if(ref)
    					location.href=ref;
    				else
    					  jQuery("#sp_Message").html("验证成功，页面跳转中...");
    				window.setTimeout("window.location.href='../../default/page/default.html'",500);	
    			}
    			
    		});
    		$.cookie( 'remind',$("input[type='checkbox']").is(':checked'), {
		          path : '/'
		     });
    		
            $.cookie( 'loginid',$("#txt_UserName").val(), {
                  path : '/'
             });

            $.cookie( 'password',$("#txt_Password").val(), {
                  path : '/'
             });

    		return false;
    	}; 

    	function logout(){
    		$.ajax({
    				url : "/server/session/logout.json",
    				type : "post",
    				async:false
    			});
    			$.cookie( 'lmspd_user',null, {
  		          path : '/'
  		     });
    		
    	}
//      
      var loginMethod = 0;

        function processAnim() {
            $("#flashWp").fadeOut(200);
            $("#imgWp").animate({ top: '330px' }, 800, function() { $("#imgWp").animate({ opacity: '0.6' }, 500); $("#loginWp").show(); });
        }

        function doLogin() {
            var customerCode = "LINING";
            var loginName = $("#txt_UserName").val();
            var password = $("#txt_Password").val();
//            var ckRemember = $("#login_form_savestate")[0].checked;

            if (loginName == '' || loginName == '请输入您的账号') {
                $("#sp_Message").html("登录失败！用户名和密码错误！").show();
                return false;
            }
            if (password == '') {
                $("#sp_Message").html("密码不能为空！").show();
                return false;
            }
        }
        $(function(){
            $("#aForgetPwd").click(function(){
                $("#divLoginCurr").fadeOut("slow");
                $("#divForgetPwd").fadeIn("slow");
                flag=2;
            });
            $("#aBackLogin").click(function(){
                $("#divForgetPwd").fadeOut("slow");
                $("#divLoginCurr").fadeIn("slow");
                flag=1;
            });
        });
        
        function loadCustomerInfo(){
        	var url = "/server/customer/info/detail.json";
        	var data = {
        			'id':"0FA1C730-9552-46A7-A632-7784224414CE",
        	}
        	$.getJSON(url,data,function(rtn){
        		$('title').html(rtn.title);
        	});
        }
        
   
        /**
         *获取用户和该商户的相关信息
         */
        
        function getContent(){
        	var url = "/server/member/info/getDetail.json";
        	var email = $('#txt_EMail').val();
        	var data = {
        			"email":email,
        	}
        	$.post(url, data, function(rtn){
        		content +='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'+
        		'<html xmlns="http://www.w3.org/1999/xhtml" ><head><title>'+rtn.data.title+
        		'</title><style type="text/css">     		*{font-size:12px;font-family:Tahoma, "宋体", sans-serif;}'+
        		'body{margin:0; padding:15px 0px 0px 15px; font-size:12px; font-family:Tahoma, "宋体", sans-serif;line-height:24px;}'+
        		'img{border:none;}.maincontent {width:600px;}.footer {color:#919191;}</style></head><body>'+
        		'<div class="maincontent"><!--Header--><div style="padding-bottom:5px;"><div style="float:left;">'+
        	    '<img src="'+rtn.data.logo+'" alt="LINING" /></div><div style="float:right;verical-align:middle;">'+
        		'<a href="'+rtn.data.url+'">'+rtn.data.welcomeMessage+'</a></div></div><div style="clear:both;"></div><hr>'+
        	    '<!--Content--><div>尊敬的<b>'+rtn.message+'：</b><br />'+rtn.data.welcomeMessage+'<br /><br />'+
        		'以下是您的信息：<br />'+
        		'<span>账号：<b>'+email+'</b></span><br />'+
        		'<span>密码：<b>11111111</b><br /></span><br />请您牢记以上信息，并在登陆系统后尽快修改您的密码！<br />'+
        		'系统的登陆地址为：<a href="'+rtn.data.url+'">'+rtn.data.url+'</a><br /></div><hr><div class="footer">'+
        		'关于此电子邮件：<br />您收到此邮件是由于您订阅了邮件服务。我们将尊重您的隐私。<br />'+rtn.data.copyRight+'&nbsp;<a href="'+rtn.data.url+'">'+rtn.data.title+'</a>'+
        		' </div></div></body> <ml>';
        		customerId = rtn.data.id;
        		memberId = rtn.code;
        		findPwdBack();
        	});
        }
        
        function findPwdBack(){
        	var email = $('#txt_EMail').val();
        	var data = {
        			"email":email,
        			"content":content,
        			"customerId":customerId,
        			"memberId":memberId,
        	}
        	var url = "/server/email/paper/findPwdBack.json";
        	$.post(url, data, function(rtn) {
        		alert(rtn.code);
        		location.href='login.html';
        	})
        }
        
        function saveLoginCount(){
        	var url = "/server/session/saveLoginCount.json";
        	$.getJSON(url, function(rtn){
        		console.log(rtn.code);
        	})
        }
         
         function load_org_options() {
           var url = "/register/department/info/list.json?parentId=root";
           $.getJSON(url, function(rtn) {
             var page = {};
             page.content = rtn;
             var datalist = load_org_options_html(page);
             $('#input-org').html(datalist);
           });
         }

         function load_org_options_html(page) {
           var tpl = [ '{@each content as it}',
               '<option value="${it.id}">${it.name}</option>', '{@/each}', ]
               .join("\n");
           return juicer(tpl, page);
         }
        //注册用户
        function addUserDetail(){
            var data = $('#form-member-register').serialize();
            var url = "/register/member/info/add.json";
            $.getJSON(url,data,function(rtn){
    	        alert(rtn.code);
                
                $('#modal-register').modal('hide');
            });
        }

   //注册用户 表单验证
  var addValidator = null;

  function setAddValidator() {
      
      var useraccount_temp = $('#user_account').val();
      addValidator=  $("#form-member-register").validate(
              {                  
                  rules : {
                      'userAccount' : {
                          required : true,
                          maxlength : 50,
                        //   remote : {
          				// 	url : '/server/member/info/validateName.json',
          				// 	type : "post",
          				// 	dataType : "json",
          				// 	data : {  
          				// 		 user : function() { return $('#user_account').val();},
          				// 		id : function() {
          				// 			return $("input[name=id]").val();
          				// 		}
          				// 	}
          				// }
                      },
                      'realName' :{
                          required : true,
                          maxlength : 50
                      },
                      'nickName' :{
                          required : true,
                          maxlength : 50
                      },
                      'email' :{
                          required : true,
                          maxlength : 50,
                          mail : true
                      },
                      'password' :{
                      	 minlength :8,
                      	 maxlength : 50,
                      	password:true
                      },
                      'idcard' :{
                    	  maxlength : 50    
                      },
                      'cellPhone' :{
                    	  mobile : true
                      }
                      
                  },
                  messages : {
                      
                      'userAccount' : {
                          required : "用户名不能为空",
                          maxlength : "不能超过50个字符",
                        //   remote : "该用户名已存在"
                      },
                      'realName' :{
                          required : "真实姓名不能为空",
                          maxlength : "不能超过50个字符",
                      },
                      'nickName' :{
                          required : "昵称不能为空",
                          maxlength : "不能超过50个字符",
                      },
                      'email' :{
                          required : "E-Mail不能为空",
                          maxlength : "不能超过50个字符",
                        	  mail : "邮箱格式错误"
                      },
                      'password' :{
                      	  minlength :"密码至少8位字符",
                      	 maxlength : "密码不能超过50个字符",
                      	   password:"密码不能有空格"
                      },
                      'idcard' :{
                    	  maxlength : "不能超过50个字符"   
                      },                     
                      'cellPhone' :{
                       	    mobile : "手机号码格式错误"
                         }                   
                  },
                  errorClass : 'help-inline',
                  errorElement : 'span',
                  errorPlacement : function(error, element) {
                      error.appendTo(element.parents('.remind'));
                  },
                  highlight : function(element, errorClass, validClass) {
                  },
                  success : function(label) {
                  },
                  submitHandler : function(form) {
                      addUserDetail();
                  }
              });
  }
  
  //邮箱地址的验证  
  jQuery.validator.addMethod("mail", function (value, element) {
	  
		var mail = /^[a-z0-9._%-]+@([a-z0-9-]+\.)+[a-z]{2,4}$/;
		
		return this.optional(element) || (mail.test(value));
		
	}, "邮箱格式错误");
  
//手机号码验证  
  jQuery.validator.addMethod("mobile", function(value, element) { 
	  
       var length = value.length; 
  
       var mobile = /^1([3578]\d|4[57])\d{8}$/ ;
	  
       return this.optional(element) || (length == 11 && mobile.test(value)); 
  
  }, "手机号码格式错误"); 

//密码不能有空格
  jQuery.validator.addMethod("password", function(value, element) { 
	  
	  var tel = /^[^ ]+$/; 
	  var v=value.trim();
	  if(v.length==0&&value.length!=0){
	  return false;}
	  else{ return this.optional(element) || (tel.test(value));}
	  
	  }, "密码格式错误"); 
