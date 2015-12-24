sap.ui.controller("com.zhenergy.bill.view.BillCaoZuoPiaoQueryResult", {
    onFanHui:function(){
        sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");

    //    var idBiaoZhiCaoZuoPiaoQuery = sap.ui.getCore().byId("idBiaoZhiCaoZuoPiaoQuery").getText();
    //     if(idBiaoZhiCaoZuoPiaoQuery=="query"){
    //         sap.ui.getCore().byId("idBillApp").app.to("idQueryCaoZuoPiao2");
    //         jQuery.sap.require("jquery.sap.storage");
    // 		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
    // 		var oLocalModelQuery2 = new sap.ui.model.json.JSONModel();
    // 		//工厂
    // 		if (oStorage.get("ZPMOFFLINE_SRV.WERKS")) {
    // 			var oData = oStorage.get("ZPMOFFLINE_SRV.WERKS");
    // 			oLocalModelQuery2.setProperty("/WERKSQuery2",oData);
    // 		}
    // 		sap.ui.getCore().setModel(oLocalModelQuery2); 
    //     }
    //     if(idBiaoZhiCaoZuoPiaoQuery=="update"){//参考票
    //         sap.ui.getCore().byId("idBillApp").app.to("idBillInitializationPage");
    //         jQuery.sap.require("jquery.sap.storage");
    // 		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
    // 		var oLocalModel = new sap.ui.model.json.JSONModel();
    // 		//Check if there is data into the Storage
    // 		if (oStorage.get("ZPMOFFLINE_SRV.WERKS")) {
    // 			var oData = oStorage.get("ZPMOFFLINE_SRV.WERKS");
    // 			oLocalModel.setProperty("/WERKS",oData);
    // 		}
    // 		sap.ui.getCore().setModel(oLocalModel);
    //     }
    }

});