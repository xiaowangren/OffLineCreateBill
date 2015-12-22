sap.ui.jsview("com.zhenergy.bill.view.BillApp", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf com.zhenergy.bill.view.BillApp
	*/ 
	getControllerName : function() {
		return "com.zhenergy.bill.view.BillApp";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf com.zhenergy.bill.view.BillApp
	*/ 
	createContent : function(oController) {
		this.app = new sap.m.App({});
		//注册overLook页面
	    var BillOverLookPage = sap.ui.view({
			id: "idBillOverLookPage",
			viewName: "com.zhenergy.bill.view.BillOverLookPage",
			type: sap.ui.core.mvc.ViewType.XML
		});
		this.app.addPage(BillOverLookPage);
		//注册初始化页面
		var BillInitializationPage = sap.ui.view({
			id: "idBillInitializationPage",
			viewName: "com.zhenergy.bill.view.BillInitializationPage",
			type: sap.ui.core.mvc.ViewType.XML
		});
		this.app.addPage(BillInitializationPage);
		//注册详细信息页面
		var BillCreateInfoPage = sap.ui.view({
			id: "idBillCreateInfoPage",
			viewName: "com.zhenergy.bill.view.BillCreateInfoPage",
			type: sap.ui.core.mvc.ViewType.XML
		});
		BillCreateInfoPage.addStyleClass("BillCreateInfoPage_page_content");
		this.app.addPage(BillCreateInfoPage);
		//注册操作票查询条件页面
		var BillCaoZuoPiaoQuery = sap.ui.view({
			id: "idBillCaoZuoPiaoQuery",
			viewName: "com.zhenergy.bill.view.BillCaoZuoPiaoQuery",
			type: sap.ui.core.mvc.ViewType.XML
		});
		this.app.addPage(BillCaoZuoPiaoQuery);
		//注册操作票查询结果页面
		var BillCaoZuoPiaoQueryResult = sap.ui.view({
			id: "idBillCaoZuoPiaoQueryResult",
			viewName: "com.zhenergy.bill.view.BillCaoZuoPiaoQueryResult",
			type: sap.ui.core.mvc.ViewType.JS
		});
		this.app.addPage(BillCaoZuoPiaoQueryResult);
		
		return this.app;
	}

});