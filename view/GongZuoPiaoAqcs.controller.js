jQuery.sap.require("jquery.sap.storage");

sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoAqcs", {

	onInit: function() {
		//安全措施
		var WorkModel=sap.ui.getCore().getModel("WorkModel");
		var idWorkTypeInitialize = WorkModel.getProperty("/Ztype");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMTQPCDT")) {
			var AQCSData = new sap.ui.model.json.JSONModel();
			var oDataPer = oStorage.get("ZPMOFFLINE_SRV.ZPMTQPCDT");
    		var aFilterPer = [];
			for(var g=0;g<oDataPer.length;g++){
			    if(oDataPer[g].Ztype==idWorkTypeInitialize){
			        aFilterPer.push(oDataPer[g]);
			    }
			}
	        AQCSData.setData(aFilterPer,false);
			sap.ui.getCore().setModel(AQCSData,"AQCSData");
		}
	    //this.getView().byId("idAqcsDataTab").setModel(AQCSData);
	},
});