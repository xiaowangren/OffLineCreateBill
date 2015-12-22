sap.ui.jsview("com.zhenergy.bill.view.BillCaoZuoPiaoQueryResult", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf com.zhenergy.bill.view.BillCaoZuoPiaoQueryResult
	*/ 
	getControllerName : function() {
		return "com.zhenergy.bill.view.BillCaoZuoPiaoQueryResult";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf com.zhenergy.bill.view.BillCaoZuoPiaoQueryResult
	*/ 
	createContent : function(oController) {
		return new sap.m.Page({
			title: "Title",
			content: [
				
			]
		});
	}

});
