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
		var self = this;
		var total_complete;
		var total_compltet_percent;
		var team_complete;
		var team_compltet_percent;
		var personal_complete;
		var personal_compltet_percent;
		var total_target = BaasBox.getCurrentAction().totalDistances;
		var actionId = BaasBox.getCurrentAction().id;
		var teamId = BaasBox.getCurrentUser().visibleByTheUser.teamId;
		var username = BaasBox.getCurrentUser().username;
		BaasBox.loadCollectionWithParams("RunData", {
			fields : "sum(distance) as distances",
			where : "actionId = '" + actionId + "'"
		}).done(function(total) {
			console.log("res ", total);
			if (total[0]) {
				total_complete = total[0]['distances'].toFixed(2);
			} else {
				total_complete = 0;
			}
			total_compltet_percent = ((total_complete / total_target) * 100).toFixed(2);
			self.comp('total_target').set({
				'value' : total_target + "km"
			});
			self.comp('total_complete').set({
				'value' : total_complete + "km"
			});
			self.comp('total_compltet_percent').set({
				'value' : total_compltet_percent + "%"
			});
			BaasBox.loadCollectionWithParams("RunData", {
				fields : "sum(distance) as distances",
				where : "teamId = '" + teamId + "' and actionId = '" + actionId + "'"
			}).done(function(team) {
				console.log("res ", team);
				if (team[0]) {
					team_complete = team[0]['distances'].toFixed(2);
				} else {
					team_complete = 0;
				}
				team_compltet_percent = ((team_complete / total_target) * 100).toFixed(2);
				self.comp('team_complete').set({
					'value' : team_complete + "km"
				});
				self.comp('team_compltet_percent').set({
					'value' : team_compltet_percent + "%"
				});
			}).fail(function(error) {
				console.log("error ", error);
			})
			BaasBox.loadCollectionWithParams("RunData", {
				fields : "sum(distance) as distances",
				where : "_author = '" + username + "' and actionId = '" + actionId + "'"
			}).done(function(percent) {
				console.log("res ", percent);
				if (percent[0]) {
					personal_complete = percent[0]['distances'].toFixed(2);
				} else {
					personal_complete = 0;
				}
				personal_compltet_percent = ((personal_complete / total_target) * 100).toFixed(2);
				self.comp('personal_complete').set({
					'value' : personal_complete + "km"
				});
				self.comp('personal_compltet_percent').set({
					'value' : personal_compltet_percent + "%"
				});
			}).fail(function(error) {
				console.log("error ", error);
			})
		}).fail(function(error) {
			console.log("error ", error);
		})

	}
	Model.prototype.button1Click = function(event){
		this.comp('popMenu1').show();
	};
	Model.prototype.button2Click = function(event){
		 window.location.href = "../run/uploadResult.w";
	};
	Model.prototype.button3Click = function(event){
		window.location.href = "../run/resultList.w";
	};
	Model.prototype.button5Click = function(event){
		window.location.href = "../run/totalScore.w";
	};
	Model.prototype.span3Click = function(event){
		window.location.href = "../run/personalData.w";
	};
	return Model;
});