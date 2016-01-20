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
// 		//注册操作票查询结果页面
// 		var BillCaoZuoPiaoQueryResult = sap.ui.view({
// 			id: "idBillCaoZuoPiaoQueryResult",
// 			viewName: "com.zhenergy.bill.view.BillCaoZuoPiaoQueryResult",
// 			type: sap.ui.core.mvc.ViewType.JS
// 		});
// 		this.app.addPage(BillCaoZuoPiaoQueryResult);
		//BillCaoZuoPiaoQueryResultXml
		//注册操作票查询结果页面
		var BillCaoZuoPiaoQueryResult = sap.ui.view({
			id: "idBillCaoZuoPiaoQueryResult",
			viewName: "com.zhenergy.bill.view.BillCaoZuoPiaoQueryResultXml",
			type: sap.ui.core.mvc.ViewType.XML
		});
		this.app.addPage(BillCaoZuoPiaoQueryResult);
		//注册操作票更新页面
		var BillUpdateInfoPage = sap.ui.view({
			id: "idBillUpdateInfoPage",
			viewName: "com.zhenergy.bill.view.BillUpdateInfoPage",
			type: sap.ui.core.mvc.ViewType.XML
		});
		this.app.addPage(BillUpdateInfoPage);
		//注册查询--条件com.zhenergy.bill.view.QueryCaoZuoPiao2
		var QueryCaoZuoPiao2 = sap.ui.view({
			id: "idQueryCaoZuoPiao2",
			viewName: "com.zhenergy.bill.view.QueryCaoZuoPiao2",
			type: sap.ui.core.mvc.ViewType.XML
		});
		this.app.addPage(QueryCaoZuoPiao2);
		//注册查询--条件com.zhenergy.bill.view.BillCaoZuoPiaoQuery2
		var BillCaoZuoPiaoQuery2 = sap.ui.view({
			id: "idBillCaoZuoPiaoQuery2",
			viewName: "com.zhenergy.bill.view.BillCaoZuoPiaoQuery2",
			type: sap.ui.core.mvc.ViewType.XML
		});
		this.app.addPage(BillCaoZuoPiaoQuery2);
		//查询详情  BillDetailQueryInfoPage
		var BillDetailQueryInfoPage = sap.ui.view({
			id: "idBillDetailQueryInfoPage",
			viewName: "com.zhenergy.bill.view.BillDetailQueryInfoPage",
			type: sap.ui.core.mvc.ViewType.XML
		});
		this.app.addPage(BillDetailQueryInfoPage);
		//注册模板创建com.zhenergy.bill.view.BillCaoZuoPiaoMoBanCreate
		var BillCaoZuoPiaoMoBanCreate = sap.ui.view({
			id: "idBillCaoZuoPiaoMoBanCreate",
			viewName: "com.zhenergy.bill.view.BillCaoZuoPiaoMoBanCreate",
			type: sap.ui.core.mvc.ViewType.XML
		});
		this.app.addPage(BillCaoZuoPiaoMoBanCreate);
		//注册上传页面
		var BillUpload = sap.ui.view({
			id: "idBillUpload",
			viewName: "com.zhenergy.bill.view.BillUpload",
			type: sap.ui.core.mvc.ViewType.JS
		});
		this.app.addPage(BillUpload);
		//注册PDF打印页面
		var PDFPrint = sap.ui.view({
			id: "idPDFPrint",
			viewName: "com.zhenergy.bill.view.PDFPrint",
			type: sap.ui.core.mvc.ViewType.XML
		});
		this.app.addPage(PDFPrint);
		//注册工作票增删改查页面
		var GongZuoPiaoFinalView = sap.ui.view({
			id: "idGongZuoPiaoFinalView",
			viewName: "com.zhenergy.bill.view.GongZuoPiaoFinalView",
			type: sap.ui.core.mvc.ViewType.XML
		});
		this.app.addPage(GongZuoPiaoFinalView);
		//注册工作票初始化页面
		var GongZuoPiaoInitializePage = sap.ui.view({
			id: "idGongZuoPiaoInitializePage",
			viewName: "com.zhenergy.bill.view.GongZuoPiaoInitializePage",
			type: sap.ui.core.mvc.ViewType.XML
		});
		this.app.addPage(GongZuoPiaoInitializePage);
		//注册工作票查询清单页面
		var GongzuoPiaoQueryPage = sap.ui.view({
			id: "idGongzuoPiaoQueryPage",
			viewName: "com.zhenergy.bill.view.GongzuoPiaoQueryPage",
			type: sap.ui.core.mvc.ViewType.XML
		});
		this.app.addPage(GongzuoPiaoQueryPage);
		//注册工作票查询结果页面
		var GongZuoPiaoQueryResultXml = sap.ui.view({
			id: "idGongZuoPiaoQueryResultXml",
			viewName: "com.zhenergy.bill.view.GongZuoPiaoQueryResultXml",
			type: sap.ui.core.mvc.ViewType.XML
		});
		this.app.addPage(GongZuoPiaoQueryResultXml);
		return this.app;
	}

});