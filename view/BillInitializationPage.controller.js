sap.ui.controller("com.zhenergy.bill.view.BillInitializationPage", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf com.zhenergy.bill.view.BillInitializationPage
*/
	onInit: function() {
		//读取LOCAL STORAGE 中的数据,作为程序的下拉框主数据
		//Storage  
		jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var oLocalModel = new sap.ui.model.json.JSONModel();
		//Check if there is data into the Storage
		if (oStorage.get("ZPMOFFLINE_SRV.WERKS")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.WERKS");
			oLocalModel.setProperty("/WERKS",oData);
		}
		if (oStorage.get("ZPMOFFLINE_SRV.TicketType")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.TicketType");
			oLocalModel.setProperty("/TicketType",oData);
		}
		sap.ui.getCore().setModel(oLocalModel);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf com.zhenergy.bill.view.BillInitializationPage
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf com.zhenergy.bill.view.BillInitializationPage
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf com.zhenergy.bill.view.BillInitializationPage
*/
//	onExit: function() {
//
//	}
    onExecute: function() {
//         jQuery.sap.require("sap.m.MessageBox");
// 		sap.m.MessageBox.alert("ZHIXING");
        sap.ui.getCore().byId("idBillApp").app.to("idBillCreateInfoPage");
    }
});