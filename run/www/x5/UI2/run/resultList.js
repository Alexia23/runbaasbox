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
	var actionId = BaasBox.getCurrentAction().id;
	var rank = 0;
	Model.prototype.personalDataCustomRefresh = function(event) {
		var self = this;
		var after = 0;
		var limit = 10;
		var count;
		if (event.offset == 0) {
//			BaasBox.getCurrentAction().done(function(res) {
//				console.log("res ", res);
//				alert(res[0]['id']);
//				actionId = res[0]['id'];
				rank = 0;
				BaasBox.loadCollectionWithParams("RunData", {
					fields : "name",
					where : "actionId='"+actionId+"'",
					groupBy : "name"
				}).done(function(res) {
					console.log("res ", res);
					count = res.length
					if (count > 0) {
						BaasBox.loadCollectionWithParams("RunData", {
							fields : "name,sum(distance).asFloat() as distances,count(*),teamName,headImgUrl",
							where : "actionId='"+actionId+"'",
							groupBy : "name",
							orderBy : "distances desc",
							call_id : after + 1,
							skip : event.offset,
							page : "0",
							recordsPerPage : limit
						}).done(function(res) {
							console.log("res ", res);
							var reslist = getDataJson(rank, count, res);
							var personalDataJson = reslist[0]["data"];
							rank = reslist[0]["rank"];
							self.comp('personalData').loadData(personalDataJson, false);
							after = after + 1;
						}).fail(function(error) {
							console.log("error ", error);
						})
					}
				}).fail(function(error) {
					console.log("error ", error);
				})
//			}).fail(function(error) {
//				console.log("error ", error);
//			})

		} else {
			rank = event.offset;
			BaasBox.loadCollectionWithParams("RunData", {
				fields : "name,sum(distance).asFloat() as distances,count(*),teamName,headImgUrl",
				where : "actionId='"+actionId+"'",
				groupBy : "name",
				orderBy : "distances desc",
				call_id : after + 1,
				skip : event.offset,
				page : "0",
				recordsPerPage : limit
			}).done(function(res) {
				console.log("res ", res);
				var reslist = getDataJson2(rank, res);
				var personalDataJson = reslist[0]["data"];
				rank = reslist[0]["rank"];
				self.comp('personalData').loadData(personalDataJson, true);
				after = after + 1;
			}).fail(function(error) {
				console.log("error ", error);
			})

		}
	};

	Model.prototype.teamDataCustomRefresh = function(event) {
		
	};

	Model.prototype.button1Click = function(event){
		this.comp('popMenu2').show();
	};

	Model.prototype.button6Click = function(event){
		 window.location.href = "../run/uploadResult.w";
	};

	Model.prototype.button8Click = function(event){
		rank = 0;
		window.location.href = "../run/resultList.w";
	};

	Model.prototype.button9Click = function(event){
		window.location.href = "../run/totalScore.w";
	};

	Model.prototype.content_2Active = function(event){
		var self = this;
		BaasBox.loadCollectionWithParams("RunData", {
			fields : "sum(distance).asFloat() as distances,count(*),teamName,Number",
			where : "actionId='"+actionId+"'",
			groupBy : "teamName",
			orderBy : "distances desc"
		}).done(function(res) {
			console.log("res ", res);
			if (res.length > 0) {
				var teamDataJson = getDataJson3(res);
				self.comp('teamData').loadData(teamDataJson);
			}
		}).fail(function(error) {
			console.log("error ", error);
		})
	};

	return Model;
});
function getDataJson3(res) {
	var startStr = '{"@type":"table","rows":[';
	var endStr = ']}';
	var contentStr = '';
	$.each(res, function(idx, item) {
		var paixu2 = paixu2 + 1;
		contentStr = contentStr + '{"id":{"value":"' + (idx + 1) + '"},"name":{"value":"' + item.teamName + '"},"mileage":{"value":"' + parseFloat(item.distances).toFixed(2)
				+ 'km"},"times":{"value":"' + item.count + '次"}},'
	});
	contentStr = contentStr.substring(0, contentStr.length - 1);
	var jsonObj = JSON.parse(startStr + contentStr + endStr);
	return jsonObj;
}
function getDataJson(rank, count, res) {
	var startStr = '{"@type":"table","rows":[';
	var endStr = ']';
	var contentStr = '';
	$.each(res, function(idx, item) {
		rank = rank + 1;
		contentStr = contentStr + '{"rank":{"value":"' + rank +'"},"name":{"value":"' + item.name + '"},"photo":{"value":"' + item.headImgUrl + '"},"mileage":{"value":"' + parseFloat(item.distances).toFixed(2)
				+ '"},"times":{"value":"' + item.count + '"},"team":{"value":"' + item.teamName + '"}},'
	});
	contentStr = contentStr.substring(0, contentStr.length - 1);
	var jsonObj = JSON.parse(startStr + contentStr + endStr + ',"userdata":{"sys.count":"' + count + '"}}');
	return [{"data":jsonObj,"rank":rank}];
}

function getDataJson2(rank, res) {
	var startStr = '{"@type":"table","rows":[';
	var endStr = ']}';
	var contentStr = '';
	$.each(res, function(idx, item) {
		rank = rank + 1;
		contentStr = contentStr + '{"rank":{"value":"' + rank +'"},"name":{"value":"' + item.name + '"},"photo":{"value":"' + item.headImgUrl + '"},"mileage":{"value":"' + parseFloat(item.distances).toFixed(2)
				+ '"},"times":{"value":"' + item.count + '"},"team":{"value":"' + item.teamName + '"}},'
	});
	contentStr = contentStr.substring(0, contentStr.length - 1);
	var jsonObj = JSON.parse(startStr + contentStr + endStr);
	return [{"data":jsonObj,"rank":rank}];
}