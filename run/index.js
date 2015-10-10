define(function(require) {
	var $ = require("jquery");
	var justep = require("$UI/system/lib/justep");
	require("./lib/baasbox");
	var Model = function() {
		this.callParent();
	};
	BaasBox.setEndPoint("http://www.cstrunning.com");
//	BaasBox.setEndPoint("http://localhost:9000");
	BaasBox.appcode = "thu-dcst-run";
	Model.prototype.modelLoad = function(event) {
		var state = GetQueryString("state");
		var code = GetQueryString("code");
		var self = this;
		BaasBox.fetchCurrentUser().done(function(res) {
			console.log("res ", res);
			BaasBox.loadCurrentAction().done(function(action) {
				console.log("action ", action);
				gotoPage(res,self,state);
			}).fail(function(err) {
				console.log("error ", err);
			})
		}).fail(function(error) {
			console.log("error ", error);
			BaasBox.wechatLogin(code, state).done(function(res) {
				console.log("Logged in ", res);
				BaasBox.loadCurrentAction().done(function(action) {
					console.log("action ", action);
					gotoPage(res,self,state);
				}).fail(function(err) {
					console.log("error ", err);
				})
			}).fail(function(err) {
				console.log("error ", err);
			})
//			BaasBox.login("test", "123456")
//			.done(function (res) {
//				console.log("Logged in ", res);
//				BaasBox.loadCurrentAction().done(function(action) {
//					console.log("action ", action);
//					gotoPage(res,self,state);
//				}).fail(function(err) {
//					console.log("error ", err);
//				})
//			})
//			.fail(function (err) {
//				console.log("error ", err);
//			})
		})

	};

	return Model;
});
function gotoPage(res,self,state){
	var verifyStatus = res.visibleByTheUser.verifyStatus;
	//alert(verifyStatus);
	if (verifyStatus == null || verifyStatus == "3") {// 未填写个人信息,或审核未通过,或正在审核中
		 window.location.href = "../run/userInfo.w";
//			alert("null||3");
		} else if (verifyStatus == "1") {// 个人信息正在审核
			self.comp('messageDialog').set({
				'message' : '个人信息正在审核中，请耐心等待'
			});
			self.comp('messageDialog').show();
		} else if (verifyStatus == "2") {// 审核通过
			if(state == 'resultList'){
				 window.location.href = "../run/resultList.w";
			}else if(state == "uploadResult"){
				 window.location.href = "../run/uploadResult.w";
			}else if(state == 'totalScore'){
				 window.location.href = "../run/totalScore.w";
			}
		}
}
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(decodeURI(r[2]));
	return null;
}