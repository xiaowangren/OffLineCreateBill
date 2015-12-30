sap.ui.controller("com.zhenergy.bill.view.BillDetailQueryInfoPage", {
    onFanHui:function(){
        sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");
    },
    onPrintBillInfo:function(){
        var oTarget = this.getView();
        if (oTarget) {
            var $domTarget = oTarget.$()[0],
            sTargetContent = $domTarget.innerHTML,
            sOriginalContent = document.body.innerHTML;
            document.body.innerHTML = sTargetContent;
            window.print();
                document.body.innerHTML = sOriginalContent;
        } else {
            jQuery.sap.log.error("onPrint needs a valid target container [view|data:targetId=\"SID\"]");
        }
    }
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf com.zhenergy.bill.view.BillDetailQueryInfoPage
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf com.zhenergy.bill.view.BillDetailQueryInfoPage
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf com.zhenergy.bill.view.BillDetailQueryInfoPage
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf com.zhenergy.bill.view.BillDetailQueryInfoPage
*/
//	onExit: function() {
//
//	}

});