define(function(require){
	var $ = require("jquery");
	var justep = require("$UI/system/lib/justep");
	require("./lib/baasbox");
	var Model = function() {
		this.callParent();
	};
	BaasBox.setEndPoint("http://www.cstrunning.com");
//	BaasBox.setEndPoint("http://localhost:9000");
	BaasBox.appcode = "thu-dcst-run";
	var username = BaasBox.getCurrentUser().username;
	var actionId = BaasBox.getCurrentAction().id;
	
	var time = "20151004";
	var distance = "10";
	
	
	Model.prototype.backBtnClick = function(){
		justep.Portal.closeWindow();
	};
	
	Model.prototype.searchPeopleInfo = function(event){
		var self = this;
		var startTime = this.comp('starttime').val();
		var endTime = this.comp('endtime').val(); 
		var st = new Date(startTime);
		var et = new Date(endTime);
		if (((et - st)/ 86400000) > 60.0){
			alert("最多查询最近两个月的数据");
			return;
		}
		BaasBox.loadCollectionWithParams("RunData", {
			fields : "dataDate, distance",
			where : "_author = '" + username + "' and actionId = '" + actionId + "' and dataDate > '" + startTime + "' and dataDate < '" + endTime + "'",
		}).done(function(res) {
			self.comp('personalData').loadData(getPersonDataJson(res));
			}).fail(function(error) {
			console.log("error ", error);
		})
	}
	Model.prototype.mainDataCustomRefresh = function(event){
		var self = this;
		var startTime = new Date();
		startTime.setDate(new Date()-14);
		var endTime = new Date();
		BaasBox.loadCollectionWithParams("RunData", {
			fields : "dataDate, distance",
			where : "_author = '" + username + "' and actionId = '" + actionId + "' and dataDate > '" + startTime + "' and dataDate < '" + endTime + "'",
		}).done(function(res) {
			self.comp('personalData').loadData(getPersonDataJson(res));
			}).fail(function(error) {
			console.log("error ", error);
		})
	}
	return Model;
});

function getPersonDataJson(baasboxJson) {
	var startStr = '{"@type":"table","rows":[';
	var endStr = ']}';
	var contentStr = '';
	$.each(baasboxJson, function(idx, item) {
		contentStr = contentStr + '{"id":{"value":"' + (idx+1) + '"},"uploadtime":{"value":"' + item.dataDate + '"},"distance":{"value":"' + item.distance +'"}},';
	});
	contentStr = contentStr.substring(0, contentStr.length - 1);
	var jsonObj = JSON.parse(startStr + contentStr + endStr);
	return jsonObj;
}