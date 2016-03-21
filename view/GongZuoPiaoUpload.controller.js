sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoUpload", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf com.zhenergy.bill.view.view.GongZuoPiaoUpload
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
* @memberOf com.zhenergy.bill.view.view.GongZuoPiaoUpload
*/
	onBeforeRendering: function() {
        this.onReadUploadData();
	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf com.zhenergy.bill.view.view.GongZuoPiaoUpload
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf com.zhenergy.bill.view.view.GongZuoPiaoUpload
*/
//	onExit: function() {
//
//	}
    onBack:function(){
        sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");
    },
    onReadUploadData:function(){
        var oLocalModel = new sap.ui.model.json.JSONModel();
        jQuery.sap.require("jquery.sap.storage");
	    var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		//获取设定的工厂
		var oG_IwerkData = oStorage.get("ZPMOFFLINE_SRV.G_IWERK");
		var g_Iwerk = oG_IwerkData.Iwerk;
		
        var GzpTickets = [];

	    if (oStorage.get("ZPMOFFLINE_SRV.WorkInfos")) {
			var oData1 = oStorage.get("ZPMOFFLINE_SRV.WorkInfos");
			for(var i=0;i<oData1.length;i++){
                if(this.checkhelp(oData1[i].statusText,"unCreated")){
                    GzpTickets.push(oData1[i]);
                }
            }
		}
		//工作票类型
        if (oStorage.get("ZPMOFFLINE_SRV.WorkType")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.WorkType");
			var aFilter = [];
			for(var n=0;n<oData.length;n++){
			    if(oData[n].Iwerk==g_Iwerk){
			        aFilter.push(oData[n]);
			    }
			}
		    oLocalModel.setProperty("/WorkType",aFilter);
		}
		//工作单位 ZPMT00229C
        if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00229C")) {
			var oDataDanWei = oStorage.get("ZPMOFFLINE_SRV.ZPMT00229C");
			var aFilterDanWei = [];
			for(var l=0;l<oDataDanWei.length;l++){
			    if(oDataDanWei[l].Werks==g_Iwerk){
			        aFilterDanWei.push(oDataDanWei[l]);
			    }
			}
		    oLocalModel.setProperty("/DanWei",aFilterDanWei);
		}
		//班组 ZPMT00283
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00283")) {
			var oDataBanZu = oStorage.get("ZPMOFFLINE_SRV.ZPMT00283");
			var aFilterBanZu = [];
			for(var m=0;m<oDataBanZu.length;m++){
			    if(oDataBanZu[m].Werks==g_Iwerk){
			        aFilterBanZu.push(oDataBanZu[m]);
			    }
			}
		    oLocalModel.setProperty("/BanZu",aFilterBanZu);
		}
		oLocalModel.setProperty("/queryResultModelCount","0");
		oLocalModel.setProperty("/queryResultModelDate","0");
        oLocalModel.setProperty("/ResultModel",GzpTickets);
        sap.ui.getCore().setModel(oLocalModel);
    },
    checkhelp :function(data,key){//过滤key
		    if(!key){
		        return true;
		    }else{
		        if(data==key){
		            return true;
		        }
		    }
		    return false;
	},
	checkhelpIndex :function(data,key){//模糊查询条件
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
	    var aIndices = this.getView().byId("gongZuoPiaoQueryResult").getSelectedIndices();
	   // console.log(aIndices);
        var oModel = this.getView().getModel();
        //Table中绑定的数据
        var oTableData = oModel.getProperty("/ResultModel");
        for(var i=0;i<aIndices.length;i++){
            var index =oTableData.length - aIndices[i] - 1;
            
            if(oTableData[index].statusText == "unCreated" ){
                
                var payLoad = oTableData[index];
                var AqcsTab = payLoad.AqcsTabX.concat(payLoad.AqcsTabY);
                for(var j=0;j<AqcsTab.length;j++){
                    delete AqcsTab[j]["Comzx"];
                }
                payLoad["AqcsTab"] = AqcsTab;
                delete payLoad["AqcsTabX"];
                delete payLoad["AqcsTabY"];                
                // delete payLoad["DangerTab"];                
                //删除json中的字段
                delete payLoad["statusText"];
                delete payLoad["Title1"];
                delete payLoad["Title2"];
                delete payLoad["Editable"];
                delete payLoad["SqVisible"];
                delete payLoad["DhfsVisible"];
                delete payLoad["ZtcbhVisible"];
                delete payLoad["GztjVisible"];
                delete payLoad["Lx3Visible"];
                delete payLoad["Lx32Visible"];
                delete payLoad["FynumVisible"];
                delete payLoad["GzbzcynumVisible"];
                delete payLoad["RefWcmnoVisible"];
                delete payLoad["SaveVisible"];
                delete payLoad["JhgzfiVisible"];
                delete payLoad["TableVisible"];
                delete payLoad["ZsfjdVisible"];
                delete payLoad["Pltxt"];
                delete payLoad["queryResultCount"];
                delete payLoad["queryResultDate"];
                delete payLoad["CreateName"];
        	    var tmpDate = payLoad.Crdate;       //把10位日期转换为8位
        	    payLoad.Crdate = tmpDate.substring(0,4) + tmpDate.substring(5,7) + tmpDate.substring(8,10);
        	    tmpDate = payLoad.Jhgzbedate;       //把10位日期转换为8位
        	    payLoad.Jhgzbedate = tmpDate.substring(0,4) + tmpDate.substring(5,7) + tmpDate.substring(8,10);
        	    tmpDate = payLoad.Jhgzfidate;       //把10位日期转换为8位
        	    payLoad.Jhgzfidate = tmpDate.substring(0,4) + tmpDate.substring(5,7) + tmpDate.substring(8,10);
        	    payLoad.Jhgzbetime = payLoad.Jhgzbetime.replace(/:/g,'');
        	    payLoad.Jhgzfitime = payLoad.Jhgzfitime.replace(/:/g,'');
        	   //将true false转变为ECC的值
        	    payLoad.Bhgbz = payLoad.Bhgbz ? 'X' : '';
                payLoad.Cj = payLoad.Cj ? 'X' : '';
                payLoad.Delflg = payLoad.Delflg ? 'X' : '';
                payLoad.Dm = payLoad.Dm ? 'X' : '';
                payLoad.Dtkgbz = payLoad.Dtkgbz ? 'X' : '';
                payLoad.Pd = payLoad.Pd ? 'X' : '';
                payLoad.Ps = payLoad.Ps ? 'X' : '';
                payLoad.Px = payLoad.Px ? 'X' : '';
                payLoad.Qg = payLoad.Qg ? 'X' : '';
                payLoad.Qt = payLoad.Qt ? 'X' : '';
                payLoad.Qx = payLoad.Qx ? 'X' : '';
                payLoad.Rhhj = payLoad.Rhhj ? 'X' : '';
                payLoad.Sqbz = payLoad.Sqbz ? 'X' : '';
                payLoad.Wbbz = payLoad.Wbbz ? 'X' : '';
                payLoad.Xh = payLoad.Xh ? 'X' : '';
                payLoad.Ylh = payLoad.Ylh ? 'X' : '';
                payLoad.Zaqd = payLoad.Zaqd ? 'X' : '';
                payLoad.Zaqm = payLoad.Zaqm ? 'X' : '';
                payLoad.Zaqs = payLoad.Zaqs ? 'X' : '';
                payLoad.Zes = payLoad.Zes ? 'X' : '';
                payLoad.Zfcmz = payLoad.Zfcmz ? 'X' : '';
                payLoad.Zfhyj = payLoad.Zfhyj ? 'X' : '';
                payLoad.Zfhz = payLoad.Zfhz ? 'X' : '';
                payLoad.Zhjst = payLoad.Zhjst ? 'X' : '';
                payLoad.Zhjyj = payLoad.Zhjyj ? 'X' : '';
                payLoad.Zhxq = payLoad.Zhxq ? 'X' : '';
                payLoad.Zjyd = payLoad.Zjyd ? 'X' : '';
                payLoad.Zjyst = payLoad.Zjyst ? 'X' : '';
                payLoad.Zjyx = payLoad.Zjyx ? 'X' : '';
                payLoad.Zk = payLoad.Zk ? 'X' : '';
                payLoad.Zkghac = payLoad.Zkghac ? 'X' : '';
                payLoad.Zmhq = payLoad.Zmhq ? 'X' : '';
                payLoad.Zqt = payLoad.Zqt ? 'X' : '';
                // payLoad.Zsfjd = payLoad.Zsfjd ? 'X' : '';
                payLoad.Zstzk = payLoad.Zstzk ? 'X' : '';
                payLoad.Ztz = payLoad.Ztz ? 'X' : '';
                payLoad.Zydq = payLoad.Zydq ? 'X' : '';
                payLoad.Zzl = payLoad.Zzl ? 'X' : '';

                //添加创建请求
        	    var createOp = oECCModel.createBatchOperation("/ZPMTWCAAPSet","POST",payLoad);
        	    console.log(payLoad);
        	    oECCModel.addBatchChangeOperations([createOp]);
            }else{
                //改造成不能选择
                sap.m.MessageBox.alert("该工作票已上传",{title:"提示"});
                return;
            }
        }
	    oECCModel.submitBatch(
            function(data, response) {
                var oData = oStorage.get("ZPMOFFLINE_SRV.WorkInfos");
                console.log(data);
                for(var i=0;i<data.__batchResponses.length;i++){
                    var respData = data.__batchResponses[i];
                    var l_wcmno = respData.__changeResponses[0].data.Wcmno;     //离线票号
                    var l_zzwcmno = respData.__changeResponses[0].data.Zzwcmno; //ECC票号
                    //更新返回状态到oStorage
                    
                    for(var j=0;j<oData.length;j++){
                        if(oData[j].Wcmno == l_wcmno){
                            oData[j]["statusText"] = respData.__changeResponses[0].statusText;
                            oData[j]["Zlybnum"] = l_zzwcmno;
                        }
                    }
                }
                oStorage.put("ZPMOFFLINE_SRV.WorkInfos",oData);
                sap.m.MessageToast.show("工作票上传成功");
                var uploadLog = {
        			lastUpload: $.now()
        		};
        		oStorage.put("ZPMGzpUploadLog", uploadLog);
                oView.rerender();
            }, 
            function(data) {
                sap.m.MessageToast.show("工作票上传失败");
            },
            false
        );
	}
});