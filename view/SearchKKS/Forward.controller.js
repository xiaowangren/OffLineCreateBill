/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("jquery.sap.storage");

sap.ui.controller("com.zhenergy.bill.view.SearchKKS.Forward", {
		_FORWARD_DIALOG_ID: "DLG_FORWARD",
		_SEARCH_FIELD_ID: "SFD_FORWARD",
		_FORWARDER_LIST_ID: "LST_AGENTS",
		_FORWARDER_ITEM_ID: "ITM_AGENT",
		
		iMaxAgent: 100,

//	This hook method can be used to change the number of items shown in the forward screen
//	Called before the forward dialog is opened
	extHookChangeListSizeLimit: null, 
	
	onInit: function() {
	
		var oAgentList = this.getView().byId(this._FORWARDER_LIST_ID);
		oAgentList.bindProperty("showNoData", {
			path:'/agents',
			formatter: function(aAgents) {
				
				/* Overriding detail icon in the StandardListItem.
				 * By default, the icon is edit, the code changes it to customer icon. But its creating issues. So commented till API is available.
				//Changing the internal Detail icon of the StandardListItem
				for (var i=0; i<oAgentList.getItems().length; i++) {
					var item = oAgentList.getItems()[i];
					item._detailIcon = new sap.ui.core.Icon("", {src:"sap-icon://customer"}).addStyleClass("sapMLIBIconDet");
				}*/
				return (aAgents === undefined) ? false : true;
			}
		});
		
		if (jQuery.device.is.phone) {
			var oDialog = this.getView().byId(this._FORWARD_DIALOG_ID);
			oDialog.setStretch(true);
		}
	},
	
	onCancelDialog: function() {
		var oForwardDlg = this.getView().byId(this._FORWARD_DIALOG_ID);
		oForwardDlg.close(); 
	},
	
	onBeforeOpenDialog: function() {
		//NOTE: the Forward Dialog is currently only opened by APPs, there is NO internal navigation back to this Dialog.
		//e.g. from Forward Confirmation Dialog back to this dialog. 
		//For the internal navigation, need to check if the state of the dialog should be kept.
		
		var oFldSearch = this.getView().byId(this._SEARCH_FIELD_ID);
		var oFwdDlg = this.getView().byId(this._FORWARD_DIALOG_ID);
		
		// setting initial focus to searchField in the forward dialog
		oFwdDlg.setInitialFocus(oFldSearch);
		
		//remove previous search value
		oFldSearch.setValue("");
		
		//remove the previous startExernalSearch function and set it from Dialog model
		this.fnStartSearch = undefined;
		this.fnCloseDlg = undefined;
		var oDlgModel = oFwdDlg.getModel();
		if (oDlgModel) {
			this.fnStartSearch = oDlgModel.getProperty("/startSearch");
			this.fnCloseDlg = oDlgModel.getProperty("/closeDlg");
		}
		
		/**
         * @ControllerHook Change forward list size
         * This hook method can be used to change the number of items shown in the forward screen
         * Called before the forward dialog is opened
         * @callback cross.fnd.fiori.inbox.view.Forward~extHookChangeListSizeLimit
         * @return {integer} The maximum number of entries which are used for for list bindings.
         */
    	if (this.extHookChangeListSizeLimit) {
    		var iSizeLimit = this.extHookChangeListSizeLimit();
    		oDlgModel.setSizeLimit(iSizeLimit);
    		this.iMaxAgent = iSizeLimit;
    	}
	},
	
    onAgentSearch: function(oEvent) {
        var t=this;
		if (!this.getView().byId(this._FORWARD_DIALOG_ID).getModel().getProperty('/isPreloadedAgents')){    	
			var sSearchTerm = oEvent.getParameters().query;		
			if (sSearchTerm.length != 0 ) {
                var KKSData;
                var oJsonModelKKS = new sap.ui.model.json.JSONModel();
                //load data from cache if any
                KKSData=sap.ui.getCore().getModel("KKSData");
                if(!KKSData){
                    
                    
                    //using storage
                    // var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
                    // if (oStorage.get("ZPMOFFLINE_SRV.KKS")) {
                    // 	var oDataKKS = oStorage.get("ZPMOFFLINE_SRV.KKS");
                    // 	oJsonModelKKS.setData(oDataKKS)
                    // }else{
                    //     oJsonModelKKS.setData([])
                    // }
                    
                    //using IndexedDB
                    sap.ui.contorller("com.zhenergy.bill.view.BillOverLookPage").onReadKKSIDB(function(items){
                        oJsonModelKKS.setData(items);
                        sap.ui.getCore().setModel(oJsonModelKKS,"KKSData");
                    });
                }
                var oDataPer=KKSData.getProperty("/");
            	var oFitler=[];
            	for(var i=0;i<oDataPer.length;i++){
            	    if((oDataPer[i].Tplnr.indexOf(sSearchTerm)>=0)||(oDataPer[i].Pltxt.indexOf(sSearchTerm)>=0)){
            	        oFitler.push(oDataPer[i])
            	    }
            	}
            	var oDialog = t.getView().byId("DLG_FORWARD");
    			oDialog.getModel().setProperty("/results", []);
    			oDialog.getModel().setProperty("/results", oFitler);
    			t.getView().byId("LST_AGENTS").rerender();
	    		
	    		//TO-DO: change this into resource model
	    		//var sNoDataText = accenture.com.ui.zmyinbox.i18n.messageBundle.getText("view.Forward.noRecipients");
	    		var sNoDataText="未找到收件人"
	    		this.getView().byId("LST_AGENTS").setNoDataText(sNoDataText);
			}
		}
	},	
	
	_findListItemById: function(sId) {
		var aListItems = this.getView().byId("LST_AGENTS").getItems();
		for(var i = 0; i < aListItems.length; i++) {
			if (aListItems[i].getId() === sId) {
				return aListItems[i];
			}
		}
	},
	
	onSelectAgent: function(oEvent) {
		var oSelectedItem = this._findListItemById(oEvent.getParameters().id);
		if (oSelectedItem && oSelectedItem.getBindingContext()) {
			//1. close the current dialog at first
			this.getView().byId(this._FORWARD_DIALOG_ID).close();
			//2. open the confirmation dialog
			var oSelectedAgent = oSelectedItem.getBindingContext().getObject();
            this.fnCloseDlg(oSelectedAgent);
		}
	}
});