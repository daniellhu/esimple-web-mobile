$(function(){
	$('body').on('click','#a',logout);	
});

//退出
function logout(){
	$.ajax({
		
			url : "/server/session/logout.json",
			type : "post",
			async:false
		});

			$.cookie( 'lmspd_user',null, {
		          path : '/'
		     });
			$.cookie('remind', null,{
				 path : '/'
			});

}