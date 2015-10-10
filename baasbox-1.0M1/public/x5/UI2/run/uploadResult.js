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
		self.comp('userData').loadData(getDataJson(user));
	}
//	Model.prototype.wayChange = function(event) {
//		var self = this;
//		var way = self.comp("way").val();
//		if (way == 1 || way == 4) {
//			$(self.getElementByXid("lichenglable")).html("里程(km)*");
//		} else if (way == 2 || way == 3) {
//			$(self.getElementByXid("lichenglable")).html("里程(m)*");
//		} else {
//			$(self.getElementByXid("lichenglable")).html("步数*");
//		}
//	};

	Model.prototype.saveResultBtnClick = function(event) {
		var self = this;
		var name;
		var teamId;
		var teamName;
		var photo;
		// alert(self.comp('userData').first());
		self.comp('userData').each(function(userData) {
			name = userData.row.val('name');
			teamId = userData.row.val('teamId');
			teamName = userData.row.val('teamName');
			photo = userData.row.val('photo');
		});
		// alert(teamName);
		var way = self.comp('way').val();
		var distance = self.comp('distance').val();
		var dataData = self.comp('dataData').val();
		// 数据校验
		if ($.trim(distance) === "" || $.trim(dataData) === "" || $.trim(way) === "") {
			self.comp('messageDialog').set({
				'message' : '请填写完整数据信息'
			});
			self.comp('messageDialog').show();
			return;
		}
		if (distance < 0  || distance > 200) {
			self.comp('messageDialog').set({
				'message' : '每次上传的距离请大于0小于200'
			});
			self.comp('messageDialog').show();
			return;
		}
		if(way == 0){
			self.comp('messageDialog').set({
				'message' : '请选择锻炼方式'
			});
			self.comp('messageDialog').show();
			return;
		}
		if(way == 2){//游泳
			distance = distance*4;
		}
		if(way == 3){//爬山
			distance = distance*2;
		}
		if(way == 4){//骑车
			distance = distance/3;
		}
		self.comp('popOver1').show();
		var startTime = BaasBox.getCurrentAction().startTime; 
		var endTime = BaasBox.getCurrentAction().endTime;
		if(dataData <= endTime && dataData >= startTime){
			var now = new Date();
			var dataDataTime = new Date(dataData);
			if (((now - dataDataTime) / 86400000) > 7.0) {
				self.comp('popOver1').hide();
				self.comp('messageDialog').set({
					'message' : '超出提交成绩规定时间范围'
				});
				self.comp('messageDialog').show()
				return;
			}
			var actionId = BaasBox.getCurrentAction().id;
			var actionName = BaasBox.getCurrentAction().name;
			var o = new Object();
			o.name = name;
			o.teamId = teamId;
			o.teamName = teamName;
			o.dataDate = dataData;
			o.distance = parseFloat(parseFloat(distance).toFixed(2));
			o.actionId = actionId;
			o.actionName = actionName;
			o.headImgUrl = photo;
			BaasBox.save(o, "RunData").done(function(res) {
				console.log("res ", res);
				// 授权
				BaasBox.grantRoleAccessToObject("RunData", res["id"], BaasBox.READ_PERMISSION, BaasBox.REGISTERED_ROLE).done(function(res) {
					console.log("res ", res);
					self.comp('popOver1').hide();
					self.comp('messageDialog').set({
						'message' : '提交成绩成功'
					});
					self.comp('messageDialog').show();
				}).fail(function(error) {
					console.log("error ", error);
					self.comp('popOver1').hide();
					self.comp('messageDialog').set({
						'message' : '提交成绩失败，请稍后再试'
					});
					self.comp('messageDialog').show();
				})
			}).fail(function(error) {
				console.log("error ", error);
				self.comp('popOver1').hide();
				self.comp('messageDialog').set({
					'message' : '提交成绩失败，请稍后再试'
				});
				self.comp('messageDialog').show();
			})
		}else{
			self.comp('popOver1').hide();
			self.comp('messageDialog').set({
				'message' : '选择的时间不在当前活动时间范围内'
			});
			self.comp('messageDialog').show();
		}
			
		// alert(distance);
	};

	Model.prototype.button2Click = function(event){
		 window.location.href = "../run/uploadResult.w";
	};

	Model.prototype.button3Click = function(event){
		window.location.href = "../run/resultList.w";
	};	

	Model.prototype.button4Click = function(event){
		window.location.href = "../run/totalScore.w";
	};

	Model.prototype.button1Click = function(event){
		this.comp('popMenu1').show();
	};

	return Model;
});
function getDataJson(user) {
	// alert(JSON.stringify(user['visibleByTheUser']['name']));
	var startStr = '{"@type":"table","rows":[';
	var endStr = ']}';
	var contentStr = '{"name":{"value":"' + user['visibleByTheUser']['name'] + '"},"teamId":{"value":"' + user['visibleByTheUser']['teamId'] + '"},"teamName":{"value":"'
			+ user['visibleByTheUser']['teamName'] + '"},"photo":{"value":"' + user['visibleByTheUser']['headImgUrl'] + '"}}';
	// alert(startStr + contentStr + endStr);
	var jsonObj = JSON.parse(startStr + contentStr + endStr);
	return jsonObj;
}