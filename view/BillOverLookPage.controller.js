sap.ui.controller("com.zhenergy.bill.view.BillOverLookPage", {
	onInit: function() {
        var  oView = this.getView();
        oView.addEventDelegate({onBeforeShow: function(evt) {
          //This event is fired every time before the NavContainer shows this child control.
            jQuery.sap.require("jquery.sap.storage");
    		jQuery.sap.require("sap.m.MessageToast");
    		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
    		if(oStorage.get("ZPMOFFLINE_SRV.G_PIN")){
    		     var oJsonModel = sap.ui.getCore().getModel("CertModel");
    		    if(oJsonModel == undefined ){
    		        oJsonModel = new sap.ui.model.json.JSONModel();
    		    }
            	var certData = oJsonModel.getData();
            	if(certData.certResult == "X"){
            	    return;
            	}		
        		var storedPinCode = oStorage.get("ZPMOFFLINE_SRV.G_PIN");
                var dialog = new sap.m.Dialog({
        			title: '请输入访问密码',
        			afterClose: function() {
        				dialog.destroy();
        			}
        		});
             	var inputField =  new sap.m.Input("newPin",{type:"Password", maxLength:12,fieldWidth:"100px",placeholder:"请输入密码..."});
            	var okButton = new sap.m.Button({
        			text: '确定',
        			press: function () {
        			   var pinCode = inputField._lastValue;
                        if(storedPinCode == pinCode){
            				var certResult = {};
            				certResult["certResult"] = "X";
            				oJsonModel.setData(certResult);
                            sap.ui.getCore().setModel(oJsonModel,"CertModel");
            				dialog.close();
            				oView.rerender();
                        }else{
                            sap.m.MessageToast.show("密码错误");
                        }
        			}
        		});
        		dialog.addContent(inputField);
        		dialog.addButton(okButton);
        		//to get access to the global model
        		oView.addDependent(dialog);
        		dialog.open();
    		}
        }}, oView);
	},
	onBeforeRendering:function(){
		   //打开页面时更新主数据更新时间  oView.rerender();
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
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var oUploadData = oStorage.get("ZPMUploadLog");
		var oSyncData = oStorage.get("ZPMSyncLog");
		var oG_IwerkData = oStorage.get("ZPMOFFLINE_SRV.G_IWERK");
		var oG_PinData = oStorage.get("ZPMOFFLINE_SRV.G_PIN");
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
		if(oG_IwerkData){
            oData["G_IWERK"] = oG_IwerkData.Iwerk + ' '+oG_IwerkData.Name1.replace(/物资工厂/, '');
            oData["IwerkButtonVisible"] = false;
		}else{
		    oData["IwerkButtonVisible"] = true;
		}
		if(oG_PinData){
		    oData["PinButtonVisible"] = false;
		}else{
		    oData["PinButtonVisible"] = true;
		}
		var oJsonModel = new sap.ui.model.json.JSONModel(oData);
		this.getView().setModel(oJsonModel);
	},
	onSyncMasterData: function() {
	   
        jQuery.sap.require("jquery.sap.storage");
		jQuery.sap.require("sap.m.MessageBox");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		 //检查是否已经选择了工厂
		var oG_IwerkData = oStorage.get("ZPMOFFLINE_SRV.G_IWERK");
	   if(!oG_IwerkData){
	       sap.m.MessageBox.alert("请设定工厂",{title: "提示"});
	       return;
	   } 
		//配置服务器
		var sServiceUrl = "/sap/opu/odata/SAP/ZPMOFFLINE_SRV";
		var oECCModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
// 		sap.ui.getCore().setModel(oECCModel);   //会覆盖其它使用了getCore的Model，引起其他自动请求


        //定义Read方法的执行方法
		var mParameters = {};
 		mParameters['async'] = true;
		mParameters['success'] = jQuery.proxy(function(oData,response) {
	        var oJsonModel = new sap.ui.model.json.JSONModel(oData);
            var rawData = oJsonModel.getData().results;
			//清理rawData,降低存储大小
			if(rawData.length > 0){
			    var typeName = oJsonModel.getData().results[0].__metadata.type;
			    for(var i=0;i<rawData.length;i++){
			        delete rawData[i]["__metadata"];
			    }
			    oStorage.put(typeName, rawData);
			    console.log(typeName + "主数据已报存");
			}
		}, this);
		mParameters['error'] = jQuery.proxy(function(data) {
		    console.log("Read 失败");
		}, this);
		//显示同步中的对话框
        var dialog = new sap.m.BusyDialog({title:"请稍候",text:"请稍候,主数据同步中..."});
        this.getView().addDependent(dialog);
		// open dialog
		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), dialog);
        dialog.open();
				
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
		this.onSyncZS(oECCModel,200, 0);

        dialog.close();
		sap.m.MessageBox.alert("主数据下载完成",{title: "提示"});
		//保存同步日志（最近同步时间）
		var syncLog = {
			lastUpdate: $.now()
		};
		oStorage.put("ZPMSyncLog", syncLog);
		this.onReadLogDate();
	},
	onSyncZS: function(oECCModel,p_top, p_skip) {
		//Storage  
		jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var oG_IwerkData = oStorage.get("ZPMOFFLINE_SRV.G_IWERK");
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
			console.log(rawData);
            //数据没有保存到storage前保存在view的model中，取出来然后继续添加，如果第一次，新建model
			var oOperModel = this.getView().getModel("/ZPMTOPERSet");
			if (rawData.length > 0) {
				if (oOperModel) {
					//从view module中取暂存的数组
					var oOperData = oOperModel.getData();
				    oOperData = oOperData.concat(rawData);
					oOperModel.setData(oOperData);
				} else {
					//oOperModel 为空 新建JsonModule 增加到view中
					oOperModel = new sap.ui.model.json.JSONModel();
				    var oOperData = rawData;
					oOperModel.setData(oOperData);
					this.getView().setModel(oOperModel, "/ZPMTOPERSet");
				}
				//递归调用
				this.onSyncZS(oECCModel,p_top, p_skip + p_top);
			} else {
			    //没有后续数据的时候，统一写入Storage
				oStorage.put("ZPMOFFLINE_SRV.ZPMTOPER", oOperModel.getData());
				console.log("ZPMOFFLINE_SRV.ZPMTOPER" + "典型票已报存：" +  oOperModel.getData().length);
			}
		}, this);
		mParameters['error'] = jQuery.proxy(function(data) {
			var oJsonModel = new sap.ui.model.json.JSONModel(data);
			console.log("Read /ZPMTOPERSet?$expand=InfoTab 调用失败");
		}, this);
        //调用请求
        var reqURL = "/ZPMTOPERSet?$expand=InfoTab&$top=" + p_top + "&$skip=" + p_skip+"&$filter=Iwerk eq '" + oG_IwerkData.Iwerk+"'";
        // console.log(reqURL);
		oECCModel.read(reqURL, mParameters);
	},
// 	onUploadToEcc: function(){
// 		//读取LOCAL STORAGE 中的数据,作为程序的下拉框主数据
// 		//Storage  
// 		jQuery.sap.require("jquery.sap.storage");
// 		jQuery.sap.require("sap.m.MessageBox");
// 		jQuery.sap.require("sap.m.MessageToast");
// 		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
// 		//Check if there is data into the Storage
// 		if (oStorage.get("ZPMOFFLINE_SRV.BillInfos")) {
// 	        var sServiceUrl = "/sap/opu/odata/SAP/ZPMUPLOAD_SRV";
// 		    var oECCModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
// 			console.log("Data is from Storage!");
// 			var oData = oStorage.get("ZPMOFFLINE_SRV.BillInfos");
//             var uploadCount = 0;
// 			for(var i=0;i<oData.length;i++){
// 			    if(oData[i]["statusText"] == "Created"){
// 			        continue;
// 			    }
// 			    uploadCount = uploadCount + 1;
// 			    var payLoad = oData[i];
// 			    delete payLoad["statusText"];
// 			    //delete payLoad["Zczph"];         //删除json中的字段
// 			    var tmpDate = payLoad.Cdata;       //把10位日期转换为8位
// 			    payLoad.Cdata = tmpDate.substring(0,4) + tmpDate.substring(5,7) + tmpDate.substring(8,10);
//                 //添加创建请求
// 			    var createOp = oECCModel.createBatchOperation("/ZPMTOPERSet","POST",payLoad);
// 			    oECCModel.addBatchChangeOperations([createOp]);
// 			}
// 			if(uploadCount == 0){
//                 sap.m.MessageToast.show("没有需要上传的数据");
//                 return;
// 			}
// 		    oECCModel.submitBatch(
//                 function(data, response) {
//                     for(var i=0;i<data.__batchResponses.length;i++){
//                         var respData = data.__batchResponses[i];
//                         var l_zczph = respData.__changeResponses[0].data.Zczph;     //离线票号
//                         var l_zzzczph = respData.__changeResponses[0].data.Zlybnum; //ECC票号
//                         //更新返回状态到oStorage
//                         oData = oStorage.get("ZPMOFFLINE_SRV.BillInfos");
//                         for(var j=0;j<oData.length;j++){
//                             if(oData[j].Zczph == l_zczph){
//                                 oData[j]["statusText"] = respData.__changeResponses[0].statusText;
//                                 oData[j]["Zlybnum"] = l_zzzczph;
//                             }
//                         }
//                     }
//                     oStorage.put("ZPMOFFLINE_SRV.BillInfos",oData);
//                     sap.m.MessageToast.show("操作票上传成功");
//                     var uploadLog = {
//             			lastUpload: $.now()
//             		};
//             		oStorage.put("ZPMUploadLog", uploadLog);
//                 }, 
//                 function(data) {
//                     sap.m.MessageToast.show("操作票上传失败");
//                 },
//                 false
//             );
// 		}else{
// 		    sap.m.MessageBox.alert("没有需要上传的数据",{title: "提示"});
// 		}
// 	},
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
	    return {Cuser:"",Iwerk:"2081"};
	},
	onOpenUploadPanel:function(){
	    //打开上传操作票页面
	     sap.ui.getCore().byId("idBillApp").app.to("idBillUpload");
	},
	handleSelectWerks:function(){
	    //选择工厂，不然不能同步数据
	    jQuery.sap.require("sap.ui.ux3.ToolPopup");
	    var openButton = this.getView().byId("idWerksButton");
	    var oView = this.getView();
        var oValueHelpDialog = new sap.ui.ux3.ToolPopup({
            modal: false,
            inverted: true,                          // disable color inversion
            title: "选择工厂",
            opener:  openButton,             // locate dialog next to this field 
            closed: function (oEvent) {
                //设定选中的工厂
                var oContext = oHelpTable.getContextByIndex(oHelpTable.getSelectedIndex());
                if (oContext) {
                    var oSel = oContext.getModel().getProperty(oContext.getPath());
                    //Storage  
            		jQuery.sap.require("jquery.sap.storage");
            		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
            		oStorage.put("ZPMOFFLINE_SRV.G_IWERK",oSel); //将选中的工厂设为全局变量存到oStorage中
            		oView.rerender();
                }
            }
        });
          var oHelpTable = new sap.ui.table.Table({
                selectionMode: sap.ui.table.SelectionMode.Single,
                visibleRowCount: 7,
                width: "300pt"
          });
         
          oHelpTable.addColumn(
                new sap.ui.table.Column({
                        label: new sap.ui.commons.Label({text: "工厂"}),
                        template: new sap.ui.commons.TextView().bindProperty("text", "Iwerk"),
                        sortProperty: "Iwerk",
                        filterProperty: "Iwerk"
                        
                })
          );
          oHelpTable.addColumn(
                new sap.ui.table.Column({
                        label: new sap.ui.commons.Label({text: "描述"}),
                        template: new sap.ui.commons.TextView().bindProperty("text", "Name1"),
                        sortProperty: "Name1",
                        filterProperty: "Name1"
                })
          );
         oValueHelpDialog.addContent(oHelpTable);
         //在同步数据之前选择工厂，因此写死
         var oHelpModel = new sap.ui.model.json.JSONModel();
         var werksData ={"werks": [{"Iwerk":"2031","Name1":"浙江浙能电力股份有限公司萧山发电厂物资工厂"},
                                   {"Iwerk":"2051","Name1":"浙江浙能电力股份有限公司台州发电厂物资工厂"},
                                   {"Iwerk":"2081","Name1":"浙江浙能兰溪发电有限责任公司物资工厂"},
                                   {"Iwerk":"2111","Name1":"浙江浙能台州第二发电有限责任公司物资工厂"},
                                   {"Iwerk":"2121","Name1":"淮浙煤电有限责任公司凤台发电分公司物资工厂"},
                                   {"Iwerk":"2131","Name1":"浙江浙能嘉兴发电有限公司物资工厂"},
                                   {"Iwerk":"2161","Name1":"浙江浙能长兴发电有限公司物资工厂"},
                                   {"Iwerk":"2181","Name1":"浙江浙能绍兴滨海热电有限责任公司物资工厂"},
                                   {"Iwerk":"2191","Name1":"浙江浙能镇海发电有限责任公司物资工厂"},
                                   {"Iwerk":"2221","Name1":"浙江浙能温州发电有限公司物资工厂"},
                                   {"Iwerk":"2251","Name1":"浙江浙能乐清发电有限责任公司物资工厂"},
                                   {"Iwerk":"2261","Name1":"浙江浙能中煤舟山煤电有限责任公司物资工厂"},
                                   {"Iwerk":"2271","Name1":"浙能阿克苏热电有限公司物资工厂"},
                                   {"Iwerk":"2281","Name1":"宁夏枣泉发电有限责任公司物资工厂"},
                                   {"Iwerk":"2291","Name1":"浙江浙能镇海联合发电有限公司物资工厂"},
                                   {"Iwerk":"2301","Name1":"浙江浙能金华燃机发电有限责任公司物资工厂"},
                                   {"Iwerk":"2311","Name1":"浙江浙能常山天然气发电有限公司物资工厂"},
                                   {"Iwerk":"2321","Name1":"温州燃机发电有限公司物资工厂"},
                                   {"Iwerk":"2331","Name1":"浙江浙能嘉华发电有限公司物资工厂"},
                                   {"Iwerk":"2341","Name1":"浙江浙能北仑发电有限公司物资工厂"},
                                   {"Iwerk":"2351","Name1":"浙江浙能镇海天然气发电有限责任公司物资工厂"},
                                   {"Iwerk":"2361","Name1":"浙江浙能镇海燃气热电有限责任公司物资工厂"},
                                   {"Iwerk":"2391","Name1":"浙江浙能绍兴滨海热力有限公司物资工厂"},
                                   {"Iwerk":"2401","Name1":"浙江浙能绍兴滨海热力有限公司物资工厂"}
                        ]};
        oHelpModel.setData(werksData);
        oHelpTable.setModel(oHelpModel);
        oHelpTable.bindAggregation("rows", "/werks");
        var oOkButton = new sap.ui.commons.Button({
            text: "确定",
            press: function (oEvent) {
                oEvent.getSource().getParent().close();
            }
        });
        oValueHelpDialog.addButton(oOkButton);
        oValueHelpDialog.open(sap.ui.core.Popup.Dock.Center, sap.ui.core.Popup.Dock.Center);
	},
	handleSetPassword:function(){
	    var oView = this.getView();
        var dialog = new sap.m.Dialog({
			title: '设定离线程序访问密码',
			afterClose: function() {
				dialog.destroy();
			}
		});
     	var inputField =  new sap.m.Input("newPin",{type:"Password", maxLength:12,fieldWidth:"100px",placeholder:"请输入密码..."});
    	var okButton = new sap.m.Button({
			text: '确定',
			press: function () {
			   var pinCode = inputField._lastValue;
                //Storage  
        		jQuery.sap.require("jquery.sap.storage");
        		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
        		oStorage.put("ZPMOFFLINE_SRV.G_PIN",pinCode); //将选中的工厂设为全局变量存到oStorage中
        		//把当前session设为已认证
	            var certResult = {};
				certResult["certResult"] = "X";
				var oJsonModel = new sap.ui.model.json.JSONModel();
				oJsonModel.setData(certResult);
                sap.ui.getCore().setModel(oJsonModel,"CertModel");
				dialog.close();
				oView.rerender();
			}
		});
		dialog.addContent(inputField);
		dialog.addButton(okButton);
		//to get access to the global model
		this.getView().addDependent(dialog);
		dialog.open();
	}
});