/**
* Definition of the actions datatable
**/

var actionDataArray= new Array();

	function loadActionsData(){
    	url = window.location.origin + BBRoutes.com.baasbox.controllers.Document.getDocuments("Action").url;
    	loadTable($('#actionTable'),actionsDataTableDef,url,actionDataArray); //defined in datatable.js
	}
   var actionsDataTableDef={
			"sDom": sDomGlobal,
			"sPaginationType": "bootstrap",
			"oLanguage": {"sLengthMenu": "_MENU_ records per page"},
			"aoColumns": [{"mData": "name", sWidth:"78px","mRender": function ( data, type, full ) 	{
				 				return "<span style='font-family:Courier'>"+data+"</span>";
							},bSortable:false
						   },
						   {"mData": "startTime",sWidth:"85px","mRender": function ( data, type, full ) {
		                        var datetime = data.split("T");
		    	    			return "<span style='font-family:Courier'>"+datetime[0]+"</span>";
								}
						   },
						   {"mData": "endTime",sWidth:"85px","mRender": function ( data, type, full ) {
		                        var datetime = data.split("T");
		    	    			return "<span style='font-family:Courier'>"+datetime[0]+"</span>";
								}
						   },
			               {"mData": "totalDistances"},
			               {"mData": "description"},
			               {"mData": "id","mRender": function ( data, type, full ) {
							   var obj=JSON.parse(JSON.stringify(full));
//			            	   return getActionButton("edit","document",data + obj["@class"]) + "&nbsp;" + getActionButton("delete","document",data+obj["@class"]) /*+ "&nbsp;" + getActionButton("acl","document",data+obj["@class"])*/;
							   if (full.isCurrentAction)
								   return getActionButton("edit","action",data + obj["@class"]); // + "&nbsp;" + getActionButton("delete","document",data+obj["@class"]) /*+ "&nbsp;" + getActionButton("acl","document",data+obj["@class"])*/;
							   else
								   return getActionButton("edit","action",data + obj["@class"]) + "&nbsp;" + getActionButton("setCurrentAction","action",data) /*+ "&nbsp;" + getActionButton("acl","document",data+obj["@class"])*/;
			            	},bSortable:false,bSearchable:false
			               }
			               ],
           "bRetrieve": true,
           "bDestroy":true
		}