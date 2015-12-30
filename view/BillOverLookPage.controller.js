sap.ui.controller("com.zhenergy.bill.view.BillOverLookPage", {
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
		//同步典型票  每次200条
		this.onSyncZS(200, 1800);

		sap.m.MessageBox.alert("主数据下载完成");
		//保存同步日志（最近同步时间）
		var syncLog = {
			lastUpdate: $.now()
		};
		oStorage.put("ZPMSyncLog", syncLog);
	},
	onSyncZS: function(p_top, p_skip) {
		var oECCModel = sap.ui.getCore().getModel();
		//Storage  
		jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		//定义Read方法的执行方法
		var mParameters = {};
		mParameters['async'] = false;
		mParameters['success'] = jQuery.proxy(function(oData, response) {
			//取返回的data
			var oJsonModel = new sap.ui.model.json.JSONModel(oData);
			var rawData = oJsonModel.getData().results;
// 			var newData = [rawData.length];
			if(rawData.length > 0){
			    for(var i=0;i<rawData.length;i++){
			        delete rawData[i]["__metadata"];
			        delete rawData[i]["DangerousTab"];
			        for(var j=0;j<rawData[i].InfoTab.results.length;j++){
			           delete rawData[i].InfoTab.results[j]["__metadata"];
			        }
			     //   console.log(rawData[i]);
			    }
			}
            
			var oOperModel = this.getView().getModel("/ZPMTOPERSet");
			if (oJsonModel.getData().results.length > 0) {
				if (oOperModel) {
					//从view module中取暂存的数组
					var oOperData = oOperModel.getData();
				// 	oOperData = oOperData.concat(oJsonModel.getData().results);
				    oOperData = oOperData.concat(rawData);
					oOperModel.setData(oOperData);
					console.log("Collection.concat");
					console.log(oOperData.length);
				} else {
					//oOperModel 为空 新建JsonModule 增加到view中
					oOperModel = new sap.ui.model.json.JSONModel();
				// 	var oOperData = oJsonModel.getData().results;
				    var oOperData = rawData;
					oOperModel.setData(oOperData);
					this.getView().setModel(oOperModel, "/ZPMTOPERSet");
					console.log("this.getView().setModel(oOperModel,'/ZPMTOPERSet')");
				}
				console.log("ZPMOFFLINE_SRV.ZPMTOPER" + "主数据已报存" + p_skip);
				this.onSyncZS(p_top, p_skip + p_top);
			} else {
				oStorage.put("ZPMOFFLINE_SRV.ZPMTOPER", oOperModel.getData());
				console.log(oOperModel.getData());
				//没有后续数据的时候，统一写入Storage
				console.log("Storage put success" + oOperModel.getData().length);
				console.log(oOperModel.getData());
			}
		}, this);
		mParameters['error'] = jQuery.proxy(function(data) {
			var oJsonModel = new sap.ui.model.json.JSONModel(data);
			console.log("Read /ZPMTOPERSet?$expand=InfoTab 调用失败");
		}, this);
        //调用请求，递归调用
		oECCModel.read("/ZPMTOPERSet?$expand=InfoTab&$top=" + p_top + "&$skip=" + p_skip, mParameters);
	},
	onUploadToEcc: function(){
		//读取LOCAL STORAGE 中的数据,作为程序的下拉框主数据
		//Storage  
		jQuery.sap.require("jquery.sap.storage");
		jQuery.sap.require("sap.m.MessageBox");
		jQuery.sap.require("sap.m.MessageToast");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		//Check if there is data into the Storage
		if (oStorage.get("ZPMOFFLINE_SRV.BillInfos")) {
	        var sServiceUrl = "/sap/opu/odata/SAP/ZPMUPLOAD_SRV";
	       // var sServiceUrl = "/sap/opu/odata/SAP/ZTEST_FLIGHT_SRV";
		    var oECCModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
			console.log("Data is from Storage!");
			var oData = oStorage.get("ZPMOFFLINE_SRV.BillInfos");
// 			var oUploadModel = new sap.ui.model.json.JSONModel();
// 			oUploadModel.setData(oData);
            var uploadCount = 0;
			for(var i=0;i<oData.length;i++){
			    if(oData[i]["statusText"] == "Created"){
			        continue;
			    }
			    uploadCount = uploadCount + 1;
			    var payLoad = oData[i];
			 //   delete payLoad["Zczph"];
			    delete payLoad["Cdata"];
			    delete payLoad["Estxt"];
			    delete payLoad["Name1"];
			    delete payLoad["Ztypedes"];
			    delete payLoad["Appdepdec"];
			    delete payLoad["Yxgroupdec"];
			    delete payLoad["OtypeValue"];
			    delete payLoad["ZczfsValue"];
			    delete payLoad["Prtxt"];
			    delete payLoad["Rareadec"];
			    delete payLoad["Untxt"];
			    delete payLoad["Dutxt"];
			    var createOp = oECCModel.createBatchOperation("/ZPMTOPERSet","POST",payLoad);
			    oECCModel.addBatchChangeOperations([createOp]);
			}
			if(uploadCount == 0){
                sap.m.MessageToast.show("没有需要上传的数据");
                return;
			}
		    oECCModel.submitBatch(
                function(data, response) {
                    // sap.ui.getCore().byId("idSplitApp").app.backToPage("idPersonInfo");
                    // this.initializeData();
                    // console.log("success data： ");
                    // console.log(data);
                    // console.log("success response： ");
                    // console.log(response);
                    for(var i=0;i<data.__batchResponses.length;i++){
                        var respData = data.__batchResponses[i];
                        var l_zczph = respData.__changeResponses[0].data.Zczph;
                        var l_zzzczph = respData.__changeResponses[0].data.Zlybnum;
                        // oData[i].Zczph = 
                        //更新返回状态到oStorage
                        for(var j=0;j<oData.length;j++){
                            if(oData[j].Zczph == l_zczph){
                                oData[j]["statusText"] = respData.__changeResponses[0].statusText;
                                oData[j]["Zlybnum"] = l_zzzczph;
                            }
                        }
                    }
                    // console.log("Updated data： ");
                    // console.log(oData);
                    oStorage.put("ZPMOFFLINE_SRV.BillInfos",oData);
                    sap.m.MessageToast.show("操作票上传成功");
                    var uploadLog = {
            			lastUpload: $.now()
            		};
            		oStorage.put("ZPMUploadLog", uploadLog);
                }, 
                function(data) {
                    sap.m.MessageToast.show("操作票上传失败");
                    // console.log("操作票上传失败");
                    // console.log(data);
                },
                false
            );
		}else{
		    sap.m.MessageBox.alert("没有需要上传的数据");
		}
	},
	onNavigate: function(event){
        
	    sap.ui.getCore().byId("idBillApp").app.to("idBillInitializationPage");
	    jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var oLocalModel = new sap.ui.model.json.JSONModel();
		//Check if there is data into the Storage
		if (oStorage.get("ZPMOFFLINE_SRV.WERKS")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.WERKS");
			oLocalModel.setProperty("/WERKS",oData);
		}
		//用户，工厂
		var UserIwerk = this.onQuChuUser();
		oLocalModel.setProperty("/Iwerk",UserIwerk.Iwerk);
		oLocalModel.setProperty("/User",UserIwerk.Cuser);
		sap.ui.getCore().setModel(oLocalModel);
	    
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
	},
	onQueryCaoZuoPiao:function(){
	    jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var oLocalModelQuery2 = new sap.ui.model.json.JSONModel();
		//工厂
		if (oStorage.get("ZPMOFFLINE_SRV.WERKS")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.WERKS");
			oLocalModelQuery2.setProperty("/WERKSQuery2",oData);
		}
		var UserIwerk = this.onQuChuUser();
		oLocalModelQuery2.setProperty("/Iwerk2",UserIwerk.Iwerk);
		oLocalModelQuery2.setProperty("/User2",UserIwerk.Cuser);
		oLocalModelQuery2.setProperty("/UpdateLog","");
		sap.ui.getCore().setModel(oLocalModelQuery2);
		
	    sap.ui.getCore().byId("idBillApp").app.to("idBillCaoZuoPiaoQuery2");//   idQueryCaoZuoPiao2

	},
	onUpdateCaoZuoPiao:function(){
	    sap.ui.getCore().byId("idBillApp").app.to("idBillCaoZuoPiaoQuery2");// idQueryCaoZuoPiao2
	    jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var oLocalModelQuery4 = new sap.ui.model.json.JSONModel();
		//工厂
		if (oStorage.get("ZPMOFFLINE_SRV.WERKS")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.WERKS");
			oLocalModelQuery4.setProperty("/WERKSQuery2",oData);
		}
		//用户，工厂
		var UserIwerk = this.onQuChuUser();
		oLocalModelQuery4.setProperty("/Iwerk2",UserIwerk.Iwerk);
		oLocalModelQuery4.setProperty("/User2",UserIwerk.Cuser);
		oLocalModelQuery4.setProperty("/UpdateLog","UpdateLog");
		sap.ui.getCore().setModel(oLocalModelQuery4);
	},
	onQuChuUser:function(){
	    return {Cuser:"zhang3",Iwerk:"2081"};
	}
	
});