sap.ui.controller("com.zhenergy.bill.view.BillOverLookPage", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf com.zhenergy.bill.view.BillOverLookPage
*/
	onInit: function() {

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
		var oECCModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		sap.ui.getCore().setModel(oECCModel);

		//Storage  
		jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		jQuery.sap.require("sap.m.MessageBox");
		var gCurrentModel;
        //定义Read方法的执行方法
		var mParameters = {};
 		mParameters['async'] = false;
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
        //工厂
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
	onUploadToEcc: function(){
		//读取LOCAL STORAGE 中的数据,作为程序的下拉框主数据
		//Storage  
		jQuery.sap.require("jquery.sap.storage");
		jQuery.sap.require("sap.m.MessageBox");
		
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		//Check if there is data into the Storage
		if (oStorage.get("ZPMOFFLINE_SRV.BillInfos")) {
	        var sServiceUrl = "/sap/opu/odata/SAP/ZPMOFFLINE_SRV";
	       // var sServiceUrl = "/sap/opu/odata/SAP/ZTEST_FLIGHT_SRV";
		    var oECCModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
			console.log("Data is from Storage!");
			var oData = oStorage.get("ZPMOFFLINE_SRV.BillInfos");
			var oUploadModel = new sap.ui.model.json.JSONModel();
			oUploadModel.setData(oData);
			for(var i=0;i<oData.length;i++){
			    var payLoad = oData[i];
			    var createOp = oECCModel.createBatchOperation("/ZPMTOPERSet","POST",payLoad);
			    oECCModel.addBatchChangeOperations([createOp]);
			 //   payLoad.Cdata = null;
			 //   payLoad.InfoTab = null;
			 //   payLoad.DangerousTab = null;   
			    console.log(payLoad);
			 //   oECCModel.create("/ZPMTOPERSet", payLoad, {
    //                 success : jQuery.proxy(function() {
    //                     // sap.ui.getCore().byId("idSplitApp").app.backToPage("idPersonInfo");
    //                     // this.initializeData();
    //                     jQuery.sap.require("sap.m.MessageToast");
    //                     sap.m.MessageToast.show("提交成功");
    //                 }, this),
    //                 error : jQuery.proxy(function() {
    //                     sap.m.MessageToast.show("提交失败");
    //                 }, this)                         
    //             });

			}
			    oECCModel.submitBatch(
                    function(data, response) {
                        // sap.ui.getCore().byId("idSplitApp").app.backToPage("idPersonInfo");
                        // this.initializeData();
                        console.log(data);
                        console.log(response);
                        jQuery.sap.require("sap.m.MessageToast");
                        sap.m.MessageToast.show("提交成功");
                    }, 
                    function(data) {
                        sap.m.MessageToast.show("提交失败");
                        console.log(data);
                    },
                    false
                );
			console.log("Submit end");
// 			sap.ui.getCore().setModel(oUploadModel);
            // sap.m.MessageBox.alert("单据上传成功");
		}else{
		    sap.m.MessageBox.alert("没有需要上传的数据");
		}
		
		
	},
	onNavigate: function(event){
        
	    sap.ui.getCore().byId("idBillApp").app.to("idBillInitializationPage");
	    
	},
	handlePrintPress: function(){
	   // var docDefinition = { content: 'This is an sample PDF printed with pdfMake' };
	    var docDefinition = {
        	content: [
        		{ text: '\u697c\u4f1f\u4f1f浙江浙能兰溪发电有限责任公司操作票风险预控票', style: 'header' },
        		"test关联操作票号：                                 编号：",
				{
					style: 'tableExample',
					color: '#444',
					table: {
				// 			widths: [ 200, 'auto', 'auto' ],
							headerRows: 3,
							// keepWithHeaderRows: 1,
							body: [
									[{ text: '操作任务：凝汽器半边隔离操作', style: 'tableHeader', colSpan: 3, alignment: 'left' }, {}, {}],
									[{ text: '危险点及预防控制措施', style: 'tableHeader', colSpan: 3, alignment: 'center' }, {}, {}],
									[{ text: 'Header 1', style: 'tableHeader', alignment: 'center' }, { text: 'Header 2', style: 'tableHeader', alignment: 'center' }, { text: 'Header 3', style: 'tableHeader', alignment: 'center' }],
									[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
									[ { rowSpan: 3, text: 'rowSpan set to 3\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor' }, 'Sample value 2', 'Sample value 3' ],
									[ '', 'Sample value 2', 'Sample value 3' ],
									[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
									[ 'Sample value 1', { colSpan: 2, rowSpan: 2, text: 'Both:\nrowSpan and colSpan\ncan be defined at the same time' }, '' ],
									[ 'Sample value 1', '', '' ],
							]
					}
				},
			],
			styles: {
        		header: {
        			fontSize: 18,
        			bold: true,
        			alignment: 'center',
        			margin: [0, 0, 0, 10]
        		},
        		subheader: {
        			fontSize: 16,
        			bold: true,
        			margin: [0, 10, 0, 5]
        		},
        		tableExample: {
        			margin: [0, 5, 0, 15]
        		},
        		tableHeader: {
        			bold: true,
        			fontSize: 13,
        			color: 'black'
        		}
        	},
        	  defaultStyle: {
                font: 'Arial'
              }
        };
	    // open the PDF in a new window
	    window.pdfMake.fonts = {
           Arial: {
             normal: 'HYC7GFM.TTF',
             bold: 'HYC7GFM.TTF',
             italics: 'HYC7GFM.TTF',
             bolditalics: 'HYC7GFM.TTF'
            //  normal: 'Roboto-Regular.ttf',
            //  bold: 'Roboto-Medium.ttf',
            //  italics: 'Roboto-Regular.ttf'
            //  bolditalics: 'fontFile4.ttf'
           }
        };
        window.pdfMake.createPdf(docDefinition).open();
        // print the PDF (not working in this version, will be added back in a couple of days)
        // pdfMake.createPdf(docDefinition).print();
        // download the PDF
        // window.pdfmake.createPdf(docDefinition).download();
	}
	
});