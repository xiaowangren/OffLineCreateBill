sap.ui.controller("com.zhenergy.bill.view.BillOverLookPage", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf com.zhenergy.bill.view.BillOverLookPage
*/
	onInit: function() {
		// set mock model
		var oTileData = {
        	"TileCollection" : [
        		{
        		    "tid" : "t1",
        			"icon" : "inbox",
        // 			"number" : "89",
        			"title" : "同步主数据",
        			"info" : "最近更新:12.15 16:00",
        			"infoState" : "Success",
        			"onPress" : "onSyncMasterData"
        		},        		

        		{
        		    "tid" : "t2",
        		    "icon" : "order-status",
        			"type" : "Create",
        			"title" : "创建操作票",
        			"infoState" : "Success"
        		},
        		{
        		    "tid" : "t3",
        			"icon" : "order-status",
        			"number" : "2",
        			"numberUnit" : "Outages",
        			"title" : "修改操作票",
        			"info" : "Production On Hold",
        			"infoState" : "Error"
        		},
        		{
        		    "tid" : "t4",
        			"icon" : "hint",
        			"number" : "20",
        			"type" : "Monitor",
        			"title" : "上传离线数据",
        			"info" : "最近上传:12.15 16:00",
        			"infoState" : "Success"
        		},
        		{
        		    "tid" : "t5",
        		    "icon" : "factory",
        			"type" : "Create",
        			"title" : "创建工作票",
        			"infoState" : "Success"
        		},
        		{
        		    "tid" : "t6",
        			"icon" : "factory",
        			"number" : "2",
        			"numberUnit" : "Outages",
        			"title" : "修改工作票",
        			"info" : "Production On Hold",
        			"infoState" : "Error"
        		}
        	]
        };

		var oModel =  new sap.ui.model.json.JSONModel();
		oModel.setData(oTileData);
		this.getView().setModel(oModel);

	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf com.zhenergy.bill.view.BillOverLookPage
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf com.zhenergy.bill.view.BillOverLookPage
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf com.zhenergy.bill.view.BillOverLookPage
*/
//	onExit: function() {
//
//	}
	onSyncMasterData: function() {
		// //配置服务器
		var sServiceUrl = "/sap/opu/odata/SAP/ZPMOFFLINE_SRV";
		var oECCModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, true);
		sap.ui.getCore().setModel(oECCModel);

		//Storage  
		jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		jQuery.sap.require("sap.m.MessageBox");
		var gCurrentModel;
        //定义Read方法的执行方法
		var mParameters = {};
 		mParameters['async'] = false;
 		mParameters['urlParameters'] = [
 		{"sap-client" : '200'},
 		{"sap-user":"ac-louww"},
 		{"sap-password" : "1qaz2wsx"}]
 		;
		mParameters['success'] = jQuery.proxy(function(oData,response) {
	        var oJsonModel = new sap.ui.model.json.JSONModel(oData);
            //console.log(oJsonModel.getData().results[0].__metadata.type);
            //console.log(oJsonModel.getProperty("{/0/Iwerk}"));
            oStorage.put(oJsonModel.getData().results[0].__metadata.type, oJsonModel.getData().results);
			console.log(oJsonModel.getData().results[0].__metadata.type + "主数据已报存");
		}, this);
		mParameters['error'] = jQuery.proxy(function(data) {
		    console.log(gCurrentModel + "read 失败");
		}, this);
        //取数
        gCurrentModel="WERKS";
		oECCModel.read("/WERKSSet", mParameters);
		//两票类型
        gCurrentModel="TicketType";
		oECCModel.read("/TicketTypeSet", mParameters);
		//值别
        gCurrentModel="ZPMT00204"; 
		oECCModel.read("/ZPMT00204Set", mParameters);
		//运行区域
        gCurrentModel="ZPMT00227"; 
		oECCModel.read("/ZPMT00227Set", mParameters);
		//工作票班组
        gCurrentModel="ZPMT00228"; 
		oECCModel.read("/ZPMT00228Set", mParameters);
		//申请部门
        gCurrentModel="ZPMT00229"; 
		oECCModel.read("/ZPMT00229Set", mParameters);
		//工作票单位
        gCurrentModel="ZPMT00229C"; 
		oECCModel.read("/ZPMT00229CSet", mParameters);
		//工作票检修专业
        gCurrentModel="ZPMT00230"; 
		oECCModel.read("/ZPMT00230Set", mParameters);
		//操作票班组
        gCurrentModel="ZPMT00283"; 
		oECCModel.read("/ZPMT00283Set", mParameters);
		//机组配置表
        gCurrentModel="ZPMV00005"; 
		oECCModel.read("/ZPMV00005Set", mParameters);
		
		sap.m.MessageBox.alert("主数据下载完成");
		//保存同步日志（最近同步时间）
		var syncLog = { lastUpdate : $.now() };
		oStorage.put("ZPMSyncLog",syncLog);
	},
	onReadFromStorage: function() {
		//读取LOCAL STORAGE 中的数据,作为程序的下拉框主数据
		//Storage  
		jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		//Check if there is data into the Storage
		if (oStorage.get("ZN_Werks")) {
			console.log("Data is from Storage!");
			var oData = oStorage.get("ZN_Werks");
			var oLocalModel = new sap.ui.model.json.JSONModel();
			oLocalModel.setData(oData);
			sap.ui.getCore().setModel(oLocalModel);
		}
		jQuery.sap.require("sap.m.MessageBox");
		sap.m.MessageBox.alert("缓存数据已读取");
	},
	onUploadToEcc: function(){
	    
	},
	onNavigate: function(event){
        
	    sap.ui.getCore().byId("idBillApp").app.to("idBillInitializationPage");
	    
	},
	handlePrintPress: function(){
	    var docDefinition = { content: 'This is an sample PDF printed with pdfMake' };
	    // open the PDF in a new window
        window.pdfMake.createPdf(docDefinition).open();
        // print the PDF (not working in this version, will be added back in a couple of days)
        // pdfMake.createPdf(docDefinition).print();
        // download the PDF
        // window.pdfmake.createPdf(docDefinition).download();
	}
	
});