var zNodes;
//显示树形结构
function showJsTree4Cate(){
	$.ajax({
		url : mobilePluginPath + "/resource/kc/jstreeStudent.json",
		dateType :'json',
		data : {
			id : ''
		},
		async : false,
		success : function(data) {
			zNodes = data;
		},
		error : function(e) {
		}
	});
}

// zTree -----------------------------------
function setInitKcZTree() {
 setting = {
	    view: {
	      showIcon: false,
	      showLine: false
	    },
	    data: {
	      simpleData: {
	        enable: true
	      }
	    },
	    callback: {
	        beforeExpand: beforeExpand,
	        onExpand: onExpand,
	        onClick: zTreeOnClick
	    },
	    async: {
	        enable: true,
	        url : mobilePluginPath + "/resource/kc/jstreeStudent.json",
	        autoParam:["id"]
	    }
	};
}

function setInitDocKcZTree() {
	 docKcSetting = {
		    view: {
		      showIcon: false,
		      showLine: false
		    },
		    data: {
		      simpleData: {
		        enable: true
		      }
		    },
		    callback: {
		        beforeExpand: beforeExpand,
		        onExpand: onExpand,
		        onClick: docKcZTreeOnClick
		    },
		    async: {
		        enable: true,
		        url : mobilePluginPath + "/resource/kc/jstreeStudent.json",
		        autoParam:["id"]
		    }
		};
}
