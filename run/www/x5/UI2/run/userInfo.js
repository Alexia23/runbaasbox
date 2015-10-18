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
		// alert("Sdfsdf");
		var self = this;
		var user = BaasBox.getCurrentUser();
		var verifyStatus = user['visibleByTheUser']['verifyStatus'];
		var noPassReason = user['visibleByTheUser']['noPassReason'];
		if(verifyStatus == "3"){
			if(noPassReason && noPassReason != ""){
				self.comp('messageDialog').set({
					'title' : '审核不通过',
					'message' : '失败原因:'+noPassReason+';重新填写后，再次提交'
				});
			}else{
				self.comp('messageDialog').set({
					'title' : '审核不通过',
					'message' : '重新填写后，再次提交'
				});
			}
			self.comp('messageDialog').show()
			self.comp("user_name").val(user['visibleByTheUser']['name']);
			self.comp("user_grade").val(user['visibleByTheUser']['classAndGrade']);
			self.comp("user_company").val(user['visibleByTheUser']['company']);
			self.comp("user_mobile").val(user['visibleByTheUser']['phone']);
		}
		BaasBox.loadCollection("Team").done(function(res) {
			console.log("res ", res);
			self.comp('teamData').loadData(getDataJson(res));
			if(user['visibleByTheUser']['teamId'] && user['visibleByTheUser']['teamId'] != ""){
				self.comp("user_team").val(user['visibleByTheUser']['teamId']);
			}
		}).fail(function(error) {
			console.log("error ", error);
		})

	}
	Model.prototype.saveUserBtnClick = function(event) {
		var visibleByTheUser = user['visibleByTheUser'];
		var self = this;
		var name = this.comp("user_name").val();
		var classAndGrade = this.comp("user_grade").val();
		var phone = this.comp("user_mobile").val();
		var company = this.comp("user_company").val();
		var teamId = this.comp("user_team").val();
		var teamName = $(self.getElementByXid("user_team")).find("option:selected").text();
		// 数据校验
		if ($.trim(name) === "" || $.trim(classAndGrade) === "" || $.trim(phone) === "" || $.trim(company) === "" || $.trim(teamId) === "" || $.trim(teamName) === "") {
			self.comp('messageDialog').set({
				'message' : '请填写完整数据信息'
			});
			self.comp('messageDialog').show()
			return;
		}
		visibleByTheUser['name'] = name;
		visibleByTheUser['classAndGrade'] = classAndGrade;
		visibleByTheUser['phone'] = phone;
		visibleByTheUser['company'] = company;
		visibleByTheUser['teamId'] = teamId;
		visibleByTheUser['teamName'] = teamName;
		visibleByTheUser['verifyStatus'] = "1";
		// var strJson =
		// '{"name":"'+name+'","classAndGrade":"'+classAndGrade+'","phone":"'+phone+'","company":"'+company+'","teamId":"'+teamId+'"}';
		this.comp('popOver1').show();
		BaasBox.updateUserProfile({
			"visibleByTheUser" :visibleByTheUser
		}).done(function(res) {
			console.log("res ", res['data']);
			self.comp('popOver1').hide();
			self.comp('messageDialog').set({
				'message' : '保存用户信息成功'
			});
			self.comp('messageDialog').show()
		}).fail(function(error) {
			console.log("error ", error);
			self.comp('popOver1').hide();
			self.comp('messageDialog').set({
				'message' : '保存用户信息失败,请稍后再试'
			});
			self.comp('messageDialog').show()
		})

		// alert(userData.val("name"));

	};

	return Model;
});

function getDataJson(baasboxJson) {
	var startStr = '{"@type":"table","rows":[';
	var endStr = ']}';
	var contentStr = '';
	$.each(baasboxJson, function(idx, item) {
		contentStr = contentStr + '{"id":{"value":"' + item.id + '"},"name":{"value":"' + item.name + '"}},'
	});
	contentStr = contentStr.substring(0, contentStr.length - 1);
	var jsonObj = JSON.parse(startStr + contentStr + endStr);
	return jsonObj;
}
