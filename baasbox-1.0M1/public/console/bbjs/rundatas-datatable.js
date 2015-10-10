/*
Javascript helper functions for server side pagination of rundatas-datatables
*/

    //transforms datatable parameters into BaasBox query criteria, calls the API and converts the result into the datatable format
    function serverRunDataTableCallback( sSource, aoData, fnCallback,dataArray ) {
    	//sSource: URL to call
    	//aoData: parameters to use within the call (they must be converted into BaasBox specific parameters)
    	
    	var initSearch = "";
    	var selAction=$("#selectActionsName").val();
    	var selTeam=$("#selectTeamsName").val();
    	if (selAction) {
    		initSearch = "actionId = '" + selAction + "'";
    		if (selTeam != "allteam") {
        		initSearch = initSearch + " and teamId = '" + selTeam + "'"
        	} 
    	}
    	
    	//transforms datatable parameters into BaasBox query criteria
    	var call_id = 0;
    	var iDisplayStart=0;
    	var recordsPerPage = 0;
    	var search=initSearch;
    	var sortCol=undefined;
    	var sortDir="";
    	var orderBy=undefined;
    	aoDataLength=aoData.length;
    	for (index = 0; index < aoDataLength; ++index) {
    	    if (aoData[index]["name"]=="sEcho") call_id=aoData[index]["value"];
			if (aoData[index]["name"]=="iDisplayStart") iDisplayStart=aoData[index]["value"] ;
			if (aoData[index]["name"]=="iDisplayLength") recordsPerPage=aoData[index]["value"];
			if (aoData[index]["name"]=="sSearch" && aoData[index]["value"]!="") search= initSearch + ' and any() like "%' + aoData[index]["value"].replace(/"/g, '\\"') +'%"';
			if (aoData[index]["name"]=="iSortCol_0") { //sorting
				var sortColNumber=aoData[index]["value"];
				for (j = 0; j < aoDataLength; ++j) {
					if (aoData[j]["name"]=="mDataProp_" + sortColNumber) sortCol=aoData[j]["value"]; //sorted field name
					if (aoData[j]["name"]=="sSortDir_0") sortDir=aoData[j]["value"] //sort direction
				}
				if (sortCol) orderBy=sortCol + " " + sortDir;
			}	
    	}
    	queryParams = {"call_id":call_id,"skip":iDisplayStart,"page":0,"recordsPerPage":recordsPerPage,"where":search,"orderBy":orderBy};
		//---------------
    	
    	//Calls the BaasBox API
    	//actually performs three calls
		$.getJSON( sSource, queryParams, function (json) { 
			var response={
					"sEcho":json["call_id"],
					"aaData":json["data"]
			}
			//load the readed records into the external array
			dataArray.length = 0;
			dataArray.push.apply(dataArray, json["data"]);
			
			//same call but to know the total number of records that match the query
//			queryParams.count=true;
			queryParams.fields = "count(*),sum(distance)";
			delete queryParams.orderBy;
			delete queryParams.page;
			delete queryParams.recordsPerPage;
			delete queryParams.skip;
			
			$.getJSON( sSource, queryParams, function (json) { 
				response.iTotalDisplayRecords=json["data"][0]["count"];
//				var sum = json["data"][0]["sum"];
//				if (typeof(sum) == "undefined") {
//					$("#pageDistance")[0].innerHTML = 0;
//				} else {
//					$("#pageDistance")[0].innerHTML = sum;
//				}			
				//call BaasBox to know the total number or records belonging to the collection
//				delete queryParams.where;
				queryParams.where = initSearch;
				$.getJSON( sSource, queryParams, function (json) { 
					response.iTotalRecords=json["data"][0]["count"];
					sum = json["data"][0]["sum"];
					if (typeof(sum) == "undefined") {
						$("#allPageTotalDistance")[0].innerHTML = 0;
					} else {
						$("#allPageTotalDistance")[0].innerHTML = sum;
					}
					//console.log(response);
					//returns converted data to datatable
					fnCallback(response);
				}); //getJSON
			}); //getJSON
		}); //getJSON
    }//serverDataTableCallback
    
    /***
     * initialize and load a datatable
     * Example:
     * 	loadTable($('#documentTable'),documentsDataTableDef,url,dataArray);
     * dataArray is a global array variable that will contain the rows currently displayed
     */
    function loadRundataTable(oDataTable,oTableDef,sUrl,dataArray){
    	var tableName=oDataTable.selector.substr(1);
    	
    	oDataTable.dataTable().fnDestroy();
    	oDataTable.attr("style",'width:100% !important');
    	var tDef = $.extend({},oTableDef);
    	if (window.location.protocol == "https:"){
    		sUrl=sUrl.replace("http:","https:");
    	}
    	tDef.sAjaxSource= sUrl;
    	tDef.bProcessing = true,
    	tDef.bServerSide = true,
    	tDef.oLanguage = {
    			sProcessing:"Loading data from BaasBox, please wait..."
    			,sSearch:"Filter records that have at least one field containing (press ENTER):"	};
    	tDef.fnServerData= function ( sSource, aoData, fnCallback ) {serverRunDataTableCallback( sSource, aoData, fnCallback,dataArray)},
    	
    	oDataTable.dataTable(tDef);
    	
    	//let's start the query ONLY and ONLY IF the user press ENTER or TAB
    	$('#'+tableName+"_filter input")
    	.unbind('keypress keyup keydown')
    	.bind('keypress', function(e){
    		if (e.keyCode != 13) return;
    		oDataTable.fnFilter($(this).val());
    	}).bind('keydown', function(e){
    		if ((e.keyCode==9)) oDataTable.fnFilter($(this).val());
    		return;
    	});;
    }//loadTable
    

/**
* Definition of the rundatas datatable
**/

var rundataDataArray= new Array();

	function loadRunDatasData(){
    	url = window.location.origin + BBRoutes.com.baasbox.controllers.Document.getDocuments("RunData").url;
    	loadRundataTable($('#rundataTable'),rundatasDataTableDef,url,rundataDataArray); //defined in datatable.js
	}
   var rundatasDataTableDef={
			"sDom": sDomGlobal,
			"sPaginationType": "bootstrap",
			"oLanguage": {"sLengthMenu": "_MENU_ records per page"},
			"aoColumns": [{"mData": "name"},
			               {"mData": "distance"},
			               {"mData": "_creation_date",sWidth:"85px","mRender": function ( data, type, full ) {
		                        var datetime = data.split("T");
		    	    			return "<span style='font-family:Courier'>"+datetime[0]+"</span>";
								}
							   },
			               {"mData": "dataDate"},
			               {"mData": "teamName"},
			               {"mData": "actionName"}
			               ],
           "bRetrieve": true,
           "bDestroy":true
		}