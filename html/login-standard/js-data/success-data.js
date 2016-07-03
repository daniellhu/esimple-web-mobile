$(function(){
	getCurrentUser();
})
function getCurrentUser() {
	var url = "/server/session/current.json";
	$.ajax({
		url: url,
		type: "post",
		error: function(jqXHR, textStatus, errorMsg) {
            alert("您还未登录！");
			var refURL = window.location.href;
            window.location.href = "http://office.zhongnangroup.cn/t9/login.jsp?ref="+refURL;
		}
	}).success(function(rtn) {
		memberId = rtn.id;
        departmentId = rtn.departmentId;
		$('#current-name').text("您好，" + rtn.realName);
		 
		if(rtn.headerUrl==null){
			$("#top_img_header").attr('src',"../../common/img/user-avatar.JPG");
		}else{
			$("#top_img_header").attr('src',rtn.headerUrl);
		}
		 initPageInfo();
		findMemberGround();
	});
}

function initPageInfo(){
	
}