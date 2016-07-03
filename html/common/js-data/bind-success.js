;
(function($){
	
	var sn = getQueryString("id");
	var appId = getQueryString("appId");
	var learn_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri=http%3a%2f%2fwx.q-xt.cn%2fmobile%2fresource%2fstatic%2fpage%2fresource-list.html%3ftype%3dCOURSE%26appId%3d"+appId+"&response_type=code&scope=snsapi_base&state=1#wechat_redirect";
	$('#a-success').attr("href",learn_url);
	$('#a-already').attr("href",learn_url);
	if(sn!=""&&sn!=null){
		$('#bind-account-sn').text(sn);
		$('#p-success').addClass('hide2');
		$('#p-already').removeClass('hide2');
	}else{
		$('#p-success').removeClass('hide2');
		$('#p-already').addClass('hide2');
	}
	
})(Zepto);

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
 }