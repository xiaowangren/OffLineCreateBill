sap.ui.controller("com.zhenergy.bill.view.BillOverLookPage", {
	onSyncMasterData: function() {
		//配置服务器
		var sServiceUrl = "/sap/opu/odata/SAP/ZPMOFFLINE_SRV";
		var oECCModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		sap.ui.getCore().setModel(oECCModel);

		//Storage  
		jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		jQuery.sap.require("sap.m.MessageBox");

        //定义Read方法的执行方法
		var mParameters = {};
 		mParameters['async'] = false;
		mParameters['success'] = jQuery.proxy(function(oData,response) {
	        var oJsonModel = new sap.ui.model.json.JSONModel(oData);
            oStorage.put(oJsonModel.getData().results[0].__metadata.type, oJsonModel.getData().results);
			console.log(oJsonModel.getData().results[0].__metadata.type + "主数据已报存");
		}, this);
		mParameters['error'] = jQuery.proxy(function(data) {
		    console.log("Read 失败");
		}, this);
        //取数
        //工厂
		oECCModel.read("/WERKSSet", mParameters);
		//两票类型
		oECCModel.read("/TicketTypeSet", mParameters);
		//值别
		oECCModel.read("/ZPMT00204Set", mParameters);
		//运行区域
		oECCModel.read("/ZPMT00227Set", mParameters);
		//工作票班组
		oECCModel.read("/ZPMT00228Set", mParameters);
		//申请部门
		oECCModel.read("/ZPMT00229Set", mParameters);
		//工作票单位
		oECCModel.read("/ZPMT00229CSet", mParameters);
		//工作票检修专业
		oECCModel.read("/ZPMT00230Set", mParameters);
		//操作票班组
		oECCModel.read("/ZPMT00283Set", mParameters);
		//机组配置表
		oECCModel.read("/ZPMV00005Set", mParameters);
		//同步典型票  每次200条
		this.onSyncZS(200, 1800);

		sap.m.MessageBox.alert("主数据下载完成");
		//保存同步日志（最近同步时间）
		var syncLog = {
			lastUpdate: $.now()
		};
		oStorage.put("ZPMSyncLog", syncLog);
		this.onReadLogDate();
	},
	onSyncZS: function(p_top, p_skip) {
	    //调用ECC Odata Service的model
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
			//清理rawData,降低存储大小
			if(rawData.length > 0){
			    for(var i=0;i<rawData.length;i++){
			        delete rawData[i]["__metadata"];
			        delete rawData[i]["DangerousTab"];
			        for(var j=0;j<rawData[i].InfoTab.results.length;j++){
			           delete rawData[i].InfoTab.results[j]["__metadata"];
			        }
			    }
			}
            //数据没有保存到storage前保存在view的model中，取出来然后继续添加，如果第一次，新建model
			var oOperModel = this.getView().getModel("/ZPMTOPERSet");
			if (rawData.length > 0) {
				if (oOperModel) {
					//从view module中取暂存的数组
					var oOperData = oOperModel.getData();
				    oOperData = oOperData.concat(rawData);
					oOperModel.setData(oOperData);
				// 	console.log("Collection.concat");
				// 	console.log(oOperData.length);
				} else {
					//oOperModel 为空 新建JsonModule 增加到view中
					oOperModel = new sap.ui.model.json.JSONModel();
				    var oOperData = rawData;
					oOperModel.setData(oOperData);
					this.getView().setModel(oOperModel, "/ZPMTOPERSet");
				// 	console.log("新建view model：/ZPMTOPERSet ");
				}
				// console.log("ZPMOFFLINE_SRV.ZPMTOPER" + "主数据已报存" + p_skip);
				//递归调用
				this.onSyncZS(p_top, p_skip + p_top);
			} else {
			    //没有后续数据的时候，统一写入Storage
				oStorage.put("ZPMOFFLINE_SRV.ZPMTOPER", oOperModel.getData());
				// console.log(oOperModel.getData());
				console.log("ZPMOFFLINE_SRV.ZPMTOPER" + "典型票已报存：" +  oOperModel.getData().length);
			}
		}, this);
		mParameters['error'] = jQuery.proxy(function(data) {
			var oJsonModel = new sap.ui.model.json.JSONModel(data);
			console.log("Read /ZPMTOPERSet?$expand=InfoTab 调用失败");
		}, this);
        //调用请求
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
			    console.log(payLoad);
			    //delete payLoad["Zczph"];         //删除json中的字段
			    //payLoad.Cdata = "2015-12-30";
			    var tmpDate = payLoad.Cdata;
			    payLoad.Cdata = tmpDate.substring(0,4) + tmpDate.substring(5,7) + tmpDate.substring(8,10);
                //添加创建请求
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
                     console.log(data);
                    // console.log("success response： ");
                     console.log(response);
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
	   
	   var oBody = 	[
                    //表头一
				// 	[{ text: '操作任务：凝汽器半边隔离操作', style: 'tableHeader', colSpan: 5, alignment: 'left' }, {}, {},{},{}],
					//表头二
				// 	[{ text: '危险点及预防控制措施', style: 'tableHeader', colSpan: 5, alignment: 'center' }, {}, {},{},{}],
					//表头三
					[{ text: '序号', style: 'tableHeader', alignment: 'center' }, 
					    { text: '危险点', style: 'tableHeader', alignment: 'center' },
					    { text: '危险后果', style: 'tableHeader', alignment: 'center' },
					    { text: '预防控制措施', style: 'tableHeader', alignment: 'center' },
					    { text: '执行情况\n(√)', style: 'tableHeader', alignment: 'center' }]
	   ];
  		for(var i=1;i<60;i++){
  		    var line = [ ''+i, '危险点危险点危险点危险点危险点危险点危险点'+i, 'Make sure that your program is extensible to be used to evaluate any other infix expressions.','预防控制措施','' ];
		    oBody.push(line);
		}
        var tableEnd = [{text:'备注:\n\n\n',colSpan: 5},{},{},{},{}];
        oBody.push(tableEnd);
        
        var docDefinition = {
              footer: function(currentPage, pageCount) { 
                  if(currentPage < pageCount){
                      var footer = {text:'下接:',style:'subheader',alignment:'right'};
                  }
                  return footer; 
                 
              },
              header: function(currentPage, pageCount) {
                // you can apply any logic and return any valid pdfmake element
                var Header = [{ text: '浙江浙能兰溪发电有限责任公司\n操作票风险预控票', style: 'header',alignment: 'center' }];
                
                if( currentPage == 1 ){
                    var line1 = {text:'关联操作票号：',style:'subheader'};
                    Header.push(line1);
                }else{
                    var line1 = {text:'上接：',style:'subheader'};
                    Header.push(line1);
                }
                var line2 = {text:'编号：',style:'subheader',alignment:'right'};
                Header.push(line2);
                console.log(Header);
                var table =  [               {
                    style: 'headTable',
					color: '#444',
					table: { 
					    	widths: ['100%'],
					    	body:[
					    	        [{ text: '操作任务：凝汽器半边隔离操作', style: 'tableHeader', alignment: 'left' }],
                            	    [{ text: '危险点及预防控制措施', style: 'tableHeader',  alignment: 'center' }]
                    		]
					}
                }];
                Header.push(table);
                return Header;
                // return { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' };
              },
            pageMargins: [ 40, 145, 40, 60 ],

            content: [

    //             {
    //                 style: 'tableExample',
				// 	color: '#444',
				// 	table: { 
				// 	    	widths: ['100%'],
				// 	    	body:[
				// 	    	        [{ text: '操作任务：凝汽器半边隔离操作', style: 'tableHeader', alignment: 'left' }],
    //                         	    [{ text: '危险点及预防控制措施', style: 'tableHeader',  alignment: 'center' }]
    //                 		]
				// 	}
    //             },
				{
					style: 'tableExample',
					color: '#444',
					table: {
							widths: [20, 200, '*', '*',50],
							headerRows: 1,
							keepWithHeaderRows: 1,
				// 			dontBreakRows: true,
							body: oBody
					}
				},
				{text:"操作人：      监护人：        值班负责人：        值长：(根据需要)          "}
			],
			styles: {
        		header: {
        			fontSize: 18,
        			bold: false,
        			alignment: 'center',
        			color: 'black',
        			margin: [0, 40, 0, 10]
        		},
        		subheader: {
        			fontSize: 12,
        			bold: false,
        			margin: [40, 0, 40, 0]
        		},
        		headTable: {
        		    fontSize: 12,
        			margin: [40, 0,40, 0]
        		},
        		tableExample: {
        		    fontSize: 12,
        			margin: [0, 0, 0, 0]
        		},
        		tableHeader: {
        			bold: false,
        			fontSize: 12,
        			color: 'black'
        		}
        	},
            defaultStyle: {
                font: 'simfang'
              }
        };

	    // open the PDF in a new window
	    pdfMake.fonts = {
           simfang: {
             normal: 'simfang.ttf',
             bold: 'simfang.ttf',
             italics: 'simfang.ttf',
             bolditalics: 'simfang.ttf'
           },           
           Arial: {
             normal: 'Arial.ttf',
             bold: 'Arial.ttf',
             italics: 'Arial.ttf',
             bolditalics: 'Arial.ttf'
           }
        };
         window.pdfMake.createPdf(docDefinition).open();
        // print the PDF (not working in this version, will be added back in a couple of days)
        // pdfMake.createPdf(docDefinition).print();
        // download the PDF
        // window.pdfmake.createPdf(docDefinition).download();
	},
	handlePrintPressCZP: function(){
	   var oBody = 	[
                    // [{ text: '操作任务：槽车卸胺', colSpan:4, style: 'tableHeader',  alignment: 'left' },{},{},{}],
                	[{ text: '√', style: 'tableHeader', alignment: 'center' },
					    { text: '序号', style: 'tableHeader', alignment: 'center' }, 
					    { text: '操作内容', style: 'tableHeader', alignment: 'center' },
					    { text: '注意事项', style: 'tableHeader', alignment: 'center' }
					    ]
	   ];
  		for(var i=1;i<60;i++){
  		    var line = ['', ''+i, '危险点危险点危险点危险点危险点危险点危险点'+i,'预防控制措施'];
		    oBody.push(line);
		}
        var tableEnd = [{text:'备注:\n\n\n',colSpan: 4},{},{},{}];
        oBody.push(tableEnd);
        
        var docDefinition = {
              footer: function(currentPage, pageCount) { 
                  if(currentPage < pageCount){
                      var footer = {text:'下接:',style:'subheader',alignment:'right'};
                  }
                  return footer; 
                 
              },
              header: function(currentPage, pageCount) {
                // you can apply any logic and return any valid pdfmake element
                var Header = [{ text: '浙江浙能兰溪发电有限责任公司\n电气操作票', style: 'header',alignment: 'center' }];
                
                if( currentPage == 1 ){
                    var line1 = {text:'  ',style:'subheader'};
                    Header.push(line1);
                }else{
                    var line1 = {text:'上接：DQ_2081_160104-'+(currentPage-1),style:'subheader'};
                    Header.push(line1);
                }
                var line2 = {text:'编号：DQ_2081_160104-'+currentPage,style:'subheader',alignment:'right'};
                Header.push(line2);
                // console.log(Header);
                var headTableBody = [];
                if(currentPage == 1){
                    var headTableLine1 = [{ text: '操作开始时间：____________________', style: 'tableHeader', alignment: 'left' }];
                    headTableBody.push(headTableLine1);
                }else if(currentPage == pageCount){
                    var headTableLine1 = [{ text: '操作结束时间：____________________', style: 'tableHeader', alignment: 'left' }];
                    headTableBody.push(headTableLine1);
                }else{
                    var headTableLine1 = [{ text: '   ', style: 'tableHeader', alignment: 'left' }];
                    headTableBody.push(headTableLine1);
                }
                var headTableLine2 = [{ text: '操作任务：槽车卸胺', style: 'tableHeader',  alignment: 'left' }];
                headTableBody.push(headTableLine2);
                var table =  [               {
                    style: 'headTable',
					color: '#444',
					table: { 
					    	widths: ['100%'],
					    	body:headTableBody
					}
                }];
                Header.push(table);
                return Header;
                // return { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' };
              },
            pageMargins: [ 40, 145, 40, 60 ],

            content: [
                {
                    style: 'tableExample',
					color: '#444',
					table: { 
					    	widths: ['16.67%','16.67%','16.67%','16.67%','16.67%','16.67%'],
					    	body:[
        					    [{ text: '发令人\n  \n  ', style: 'tableHeader', alignment: 'left' },'',{text:'受令人'},'',{text:'发令时间'},{text:'2016年1月4日'}],
                                [{ text: '操作类型\n  \n  ', style: 'tableHeader', colSpan:3, alignment: 'left' },{},{},{ text: '监护操作', style: 'tableHeader',  colSpan:3, alignment: 'left' },{},{}]
                    		]
					}
                },
				{
					style: 'tableExample',
					color: '#444',
					table: {
							widths: [20,25, 320, '*'],
							headerRows: 1,
							keepWithHeaderRows: 1,
							body: oBody
					}
				},
				{text:"操作人：      监护人：        值班负责人：        值长：          "}
			],
			styles: {
        		header: {
        			fontSize: 18,
        			bold: false,
        			alignment: 'center',
        			color: 'black',
        			margin: [0, 40, 0, 10]
        		},
        		subheader: {
        			fontSize: 12,
        			bold: false,
        			margin: [40, 0, 40, 0]
        		},
        		headTable: {
        		    fontSize: 12,
        			margin: [40, 0,40, 0]
        		},
        		tableExample: {
        		    fontSize: 12,
        			margin: [0, 0, 0, 0]
        		},
        		tableHeader: {
        			bold: false,
        			fontSize: 12,
        			color: 'black'
        		}
        	},
            defaultStyle: {
                font: 'simfang'
              }
        };

	    // open the PDF in a new window
	    pdfMake.fonts = {
           simfang: {
             normal: 'simfang.ttf',
             bold: 'simfang.ttf',
             italics: 'simfang.ttf',
             bolditalics: 'simfang.ttf'
           },           
           Arial: {
             normal: 'Arial.ttf',
             bold: 'Arial.ttf',
             italics: 'Arial.ttf',
             bolditalics: 'Arial.ttf'
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
	},
	onInit: function() {
	    this.onReadLogDate();
	},
	onReadLogDate: function() {
		//**************************************************************************
    	// 对Date的扩展，将 Date 转化为指定格式的String   
        // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
        // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
        // 例子：   
        // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
        // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
        Date.prototype.Format = function(fmt){ //author: meizz   
          var o = {   
            "M+" : this.getMonth()+1,                 //月份   
            "d+" : this.getDate(),                    //日   
            "h+" : this.getHours(),                   //小时   
            "m+" : this.getMinutes(),                 //分   
            "s+" : this.getSeconds(),                 //秒   
            "q+" : Math.floor((this.getMonth()+3)/3), //季度   
            "S"  : this.getMilliseconds()             //毫秒   
          };   
          if(/(y+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
          }
          for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt))   {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
            }
          }
          return fmt;   
        };
        //*****************************************************************************		
        jQuery.sap.require("jquery.sap.storage");
// 		jQuery.sap.require("sap.m.MessageBox");
// 		jQuery.sap.require("sap.m.MessageToast");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var oUploadData = oStorage.get("ZPMUploadLog");
		var oSyncData = oStorage.get("ZPMSyncLog");
		var oData = {};
		
		if(oSyncData){//同步主数据时间
		    var formatedDate = new Date(oSyncData.lastUpdate).Format("MM/dd hh:mm:ss");
		    oData["lastSyncLog"] = formatedDate;
		}else{
		    oData["lastSyncLog"] = "00/00 00:00:00";
		}		
		if(oUploadData){//上传操作票时间
		    var formatedDate = new Date(oUploadData.lastUpload).Format("MM/dd hh:mm:ss");
		    oData["lastUpload"] = formatedDate;
		}else{
		    oData["lastUpload"] = "00/00 00:00:00";
		}

		var oJsonModel = new sap.ui.model.json.JSONModel(oData);
		this.getView().setModel(oJsonModel);
	},
	handleSelectWerks:function(){
    	if (! this._oDialog) {
			this._oDialog = sap.ui.xmlfragment("sap.m.sample.SelectDialog.Dialog", this);
			this._oDialog.setModel(this.getView().getModel());
		}
    	// toggle compact style
		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
		this._oDialog.open();
	}

	
});