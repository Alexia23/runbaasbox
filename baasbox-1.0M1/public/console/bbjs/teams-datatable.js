/**
* Definition of the teams datatable
**/

var teamDataArray= new Array();

	function loadTeamsData(){
    	url = window.location.origin + BBRoutes.com.baasbox.controllers.Document.getDocuments("Team").url;
    	loadTable($('#teamTable'),teamsDataTableDef,url,teamDataArray); //defined in datatable.js
	}
   var teamsDataTableDef={
			"sDom": sDomGlobal,
			"sPaginationType": "bootstrap",
			"oLanguage": {"sLengthMenu": "_MENU_ records per page"},
			"aoColumns": [{"mData": "name"},
			               {"mData": "description"},
			               {"mData": "id","mRender": function ( data, type, full ) {
							   var obj=JSON.parse(JSON.stringify(full));
			            	   return getActionButton("edit","team",data + obj["@class"]);
			            	},bSortable:false,bSearchable:false
			               }
			               ],
           "bRetrieve": true,
           "bDestroy":true
		}