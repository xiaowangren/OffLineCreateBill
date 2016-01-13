sap.ui.controller("com.zhenergy.bill.view.BillUpload", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf com.zhenergy.bill.view.view.BillUpload
*/
	onInit: function() {
        var t = this;
        var  oView = this.getView();
        oView.addEventDelegate({onBeforeShow: function(evt) {
          //This event is fired every time before the NavContainer shows this child control.
          t.onReadUploadData();
        }}, oView);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf com.zhenergy.bill.view.view.BillUpload
*/
	onBeforeRendering: function() {
        this.onReadUploadData();
	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf com.zhenergy.bill.view.view.BillUpload
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf com.zhenergy.bill.view.view.BillUpload
*/
//	onExit: function() {
//
//	}
    onBack:function(){
        sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");
    },
    onReadUploadData:function(){
        //收集数据

        //过滤数据
        //获取本地的数据，进行查询
        jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var aFilter = [];
		//Check if there is data into the Storage   筛选数据
		if (oStorage.get("ZPMOFFLINE_SRV.BillInfos")) {
			var oData1 = oStorage.get("ZPMOFFLINE_SRV.BillInfos");
// 			console.log(oData1);
			for(var i=0;i<oData1.length;i++){
                // if(this.checkhelp(oData1[i].statusText,"unCreated")){
                    aFilter.push(oData1[i]);
                // }
            }
		}
        //转换时间
	    var now = new Date();
		var year = now.getFullYear(); 
        var month =(now.getMonth() + 1).toString(); 
        var day = (now.getDate()).toString(); 
        if (month.length == 1) { 
            month = "0" + month; 
        } 
        if (day.length == 1) { 
            day = "0" + day; 
        } 
        var Begda = year+"年" + month +"月"+  day +"日";
        var queryResultModel = new sap.ui.model.json.JSONModel();
        //填写部门
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00229")) {
			var oData3 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00229");
			var aFilter3 = [];
			for(var m=0;m<oData3.length;m++){
			 //   if(oData3[m].Werks==gongChangQuery2){
			        aFilter3.push(oData3[m]);
			 //   }
			}
		    queryResultModel.setProperty("/tianxieBuMenQuery3",aFilter3);
		}
        //班组
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00283")) {
			var oData2 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00283");
			var aFilter2 = [];
			for(var j=0;j<oData2.length;j++){
			 //   if(oData2[j].Werks==gongChangQuery2){
			        aFilter2.push(oData2[j]);
			 //   }
			}
		    queryResultModel.setProperty("/banZuQuery3",aFilter2);
		}
		//运行区域
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00227")) {
			var oDatag = oStorage.get("ZPMOFFLINE_SRV.ZPMT00227");
			var aFilterg = [];
			for(var g=0;g<oDatag.length;g++){
			 //   if(oDatag[g].Werks==gongChangQuery2){
			        aFilterg.push(oDatag[g]);
			 //   }
			}
		    queryResultModel.setProperty("/yunXingQuYuQuery3",aFilterg);
		}
		//机组
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMV00005")) {
			var oData4 = oStorage.get("ZPMOFFLINE_SRV.ZPMV00005");
			var aFilter4 = [];
			for(var n=0;n<oData4.length;n++){
			 //   if(oData4[n].Werks==gongChangQuery2){
			        aFilter4.push(oData4[n]);
			 //   }
			}
		    queryResultModel.setProperty("/jiZuQuery3",aFilter4);
		}
		//值别
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00204")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.ZPMT00204");
			queryResultModel.setProperty("/ZhiBieQuery3",oData);
		}

        queryResultModel.setProperty("/queryResultModel",aFilter);
        queryResultModel.setProperty("/queryResultModelCount",aFilter.length);
        queryResultModel.setProperty("/BiaoJi","query");
        queryResultModel.setProperty("/queryResultModelDate",Begda);
        // sap.ui.getCore().setModel(queryResultModel);
        this.getView().setModel(queryResultModel);
        // console.log(queryResultModel);
    },		
    checkhelp :function(data,key){
		    if(!key){
		        return true;
		    }else{
		        if(data==key){
		            return true;
		        }
		    }
		    return false;
	},
	checkhelpIndex :function(data,key){
		    if(!key){
		        return true;
		    }else{
		        if(data.indexOf(key)>=0){
		            return true;
		        }
		    }
		    return false;
	},
	onUploadPressed:function(evt){
	    
	    jQuery.sap.require("sap.m.MessageBox");
	    
	    var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
	    var oView = this.getView();
        var sServiceUrl = "/sap/opu/odata/SAP/ZPMUPLOAD_SRV";
	    var oECCModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
	    //所有选中的行
	    var aIndices = this.getView().byId("idUploadListTable").getSelectedIndices();
        var oModel = this.getView().getModel();
        //Table中绑定的数据
        var oTableData = oModel.getProperty("/queryResultModel");
        for(var i=0;i<aIndices.length;i++){
            var index = aIndices[i];
            // console.log(oTableData[index]);
            if(oTableData[index].Zlybnum == "" ){
                // this.onUploadSingleCZP(oTableData[index]);
                var payLoad = oTableData[index];
                delete payLoad["statusText"];
        	    //delete payLoad["Zczph"];         //删除json中的字段
        	    var tmpDate = payLoad.Cdata;       //把10位日期转换为8位
        	    payLoad.Cdata = tmpDate.substring(0,4) + tmpDate.substring(5,7) + tmpDate.substring(8,10);
                //添加创建请求
        	    var createOp = oECCModel.createBatchOperation("/ZPMTOPERSet","POST",payLoad);
        	    oECCModel.addBatchChangeOperations([createOp]);
            }else{
                //改造成不能选择
                sap.m.MessageBox.alert("该操作票已上传");
            }
        }
	    oECCModel.submitBatch(
            function(data, response) {
                var oData = oStorage.get("ZPMOFFLINE_SRV.BillInfos");
                for(var i=0;i<data.__batchResponses.length;i++){
                    var respData = data.__batchResponses[i];
                    var l_zczph = respData.__changeResponses[0].data.Zczph;     //离线票号
                    var l_zzzczph = respData.__changeResponses[0].data.Zlybnum; //ECC票号
                    //更新返回状态到oStorage
                    
                    for(var j=0;j<oData.length;j++){
                        if(oData[j].Zczph == l_zczph){
                            oData[j]["statusText"] = respData.__changeResponses[0].statusText;
                            oData[j]["Zlybnum"] = l_zzzczph;
                        }
                    }
                }
                oStorage.put("ZPMOFFLINE_SRV.BillInfos",oData);
                sap.m.MessageToast.show("操作票上传成功");
                var uploadLog = {
        			lastUpload: $.now()
        		};
        		oStorage.put("ZPMUploadLog", uploadLog);
                oView.rerender();
            }, 
            function(data) {
                console.log("操作票上传失败");
            },
            false
        );
	}
});