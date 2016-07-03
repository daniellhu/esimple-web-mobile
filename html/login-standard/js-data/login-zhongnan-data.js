var content = "";
var customerId = "";
var memberId = "";
var username_zn = "";
var password_zn = "";

var local_url = location.href.split("=");

//获取username
if (local_url.length == 3) {
    var param = local_url[1].split("&");
    username_zn = param[0];
    param = local_url[2].split("&");
    password_zn = param[0];
    Login_Form();
}
else{
    // alert("error-aa!");
    // return false;
}

$(document).ready(function() {
	$('body').on('click', '#Logon_btnSubmit', Login_Form);
}); 

 // 登录功能
      function Login_Form() {

            $('#txt_UserName').val(username_zn);
            $("#txt_Password").val(password_zn);

    		var url = purl();
    		var data = $("#login-form").serialize();
    		var password = $("#txt_Password").val();
    
    		var ref = url.param("ref");
    	
    		$.ajax({
    			url : "/server/session/loginZNJS.json",
    			data : data,
    			type : "post",
    			async:false,
    		    error: function(){ 
                    jQuery("#sp_Message").html("验证失败！");
                    window.top.opener = null;
                    window.close(); 
                }
    		}).success(function(rtn) {
    			if (rtn.code != 1) {
    				 $("#sp_Message").html(rtn.message).show();
                     jQuery("#sp_Message").html("验证失败！");

                     // window.open('','_parent','');
                     // window.opener = window;
                     // window.close();

                     window.top.opener = null;
                     window.close();
    			}
    			if(rtn.code == 1) {
    				saveLoginCount();
    					  //jQuery("#sp_Message").html("验证成功，页面跳转中...");
    				window.setTimeout("window.location.href='../../resource/page/resource-list.html'",2000);	
    			}
    			
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
        
 
        
        function saveLoginCount(){
        	var url = "/server/session/saveLoginCount.json";
        	$.getJSON(url, function(rtn){
        		console.log(rtn.code);
        	})
        }
