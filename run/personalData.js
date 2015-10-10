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
	
	var time = "20151004";
	var distance = "10";
	Model.prototype.backBtnClick = function(){
		justep.Portal.closeWindow();
	};
	
	Model.prototype.mainDataCustomRefresh = function(event){
		//alert("查询数据：请参考注释代码或者baas资料，手动进行修改")
		var startTime = this.comp('starttime').val();
		var endTime = this.comp('endtime').val();
		var username = BaasBox.getCurrentUser().username;
		//alert(startTime);
		//alert(endTime);
		//alert(username);
		/*
		var data = event.source;
		data.defCols['calcCheckBox'].relation = "EXPRESS";
		var params = {
			"columns" : Baas.getDataColumns(data),
			"limit" : event.limit,
			"offset" : event.offset,
		};
		var success = function(resultData) {
			var append = event.options && event.options.append;
			data.loadData(resultData, append);
		};
		Baas.sendRequest({
			"url" : "/test",  //要和web.xml中的配置一致
			"action" : "queryTest",
			"params" : params,
			"success" : success
		});

	*/
	this.comp('personalData').loadData({rows:[
    {id:1,uploadtime:20151008,distance:12.10},
    {id:2,uploadtime:20151009,distance:12.12},
    {id:3,uploadtime:20151010,distance:12.14}
  ]}	);
	};
	
	
	return Model;
});