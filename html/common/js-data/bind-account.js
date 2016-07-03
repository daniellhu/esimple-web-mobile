;
var code = "";
var openId = "";
var appId = "";
var domain = $.cookie('resource_domain');
(function($){
	$('.error').addClass('hide2');
	code = getQueryString("code");
	appId = getQueryString("appId");
	oAuth2Request();
	$('#btn-bind-account').on('click', bindAccount);
})(Zepto);

//请求授权
function oAuth2Request(){
	var url =  mobilePluginPath + "/resource/getopenId";
	var data = {code:code,appId:appId};
	$.getJSON(url,data,function(rtn){
		openId = rtn;
		isBind();
	});
}

function bindAccount(){
	var username = $('#login-name').val();
	var pwd = $('#login-pwd').val();
	var data = {domain:domain,username:username,password:pwd,openId:openId};
	var url = mobilePluginPath + "/common/bindAccount.json";
	$.getJSON(url,data,function(rtn){
		if(rtn==""){
			location.href='bind_success.html?appId='+appId;
		}else{
			$('#error-span').text(rtn);
			$('.error').removeClass('hide2');
		}
	});
}
function isBind(){
	var url = mobilePluginPath + "/common/isBind.json";
	var data={openId:openId};
	$.getJSON(url,data,function(rtn){
		if(rtn!=null&&rtn!=""){
			location.href='bind_success.html?id='+rtn+'&appId='+appId;
		}else{
			$('#form-bind-account').removeClass('hide2');
		}
	});
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
 }