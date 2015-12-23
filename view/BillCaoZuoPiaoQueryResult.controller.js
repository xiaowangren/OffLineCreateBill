sap.ui.controller("com.zhenergy.bill.view.BillCaoZuoPiaoQueryResult", {
    onFanHui:function(){
        var idBiaoZhiCaoZuoPiaoQuery = sap.ui.getCore().byId("idBiaoZhiCaoZuoPiaoQuery").getText();
        if(idBiaoZhiCaoZuoPiaoQuery=="query"){
            sap.ui.getCore().byId("idBillApp").app.to("idQueryCaoZuoPiao2");
            jQuery.sap.require("jquery.sap.storage");
    		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
    		var oLocalModelQuery2 = new sap.ui.model.json.JSONModel();
    		//工厂
    		if (oStorage.get("ZPMOFFLINE_SRV.WERKS")) {
    			var oData = oStorage.get("ZPMOFFLINE_SRV.WERKS");
    			oLocalModelQuery2.setProperty("/WERKSQuery2",oData);
    		}
    		sap.ui.getCore().setModel(oLocalModelQuery2); 
        }else{
            sap.ui.getCore().byId("idBillApp").app.to("idBillInitializationPage");
            jQuery.sap.require("jquery.sap.storage");
    		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
    		var oLocalModel = new sap.ui.model.json.JSONModel();
    		//Check if there is data into the Storage
    		if (oStorage.get("ZPMOFFLINE_SRV.WERKS")) {
    			var oData = oStorage.get("ZPMOFFLINE_SRV.WERKS");
    			oLocalModel.setProperty("/WERKS",oData);
    		}
    		sap.ui.getCore().setModel(oLocalModel);
        }
        
    }
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf com.zhenergy.bill.view.BillCaoZuoPiaoQueryResult
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf com.zhenergy.bill.view.BillCaoZuoPiaoQueryResult
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf com.zhenergy.bill.view.BillCaoZuoPiaoQueryResult
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf com.zhenergy.bill.view.BillCaoZuoPiaoQueryResult
*/
//	onExit: function() {
//
//	}

});