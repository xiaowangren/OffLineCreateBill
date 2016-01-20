sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoInitializePage", {
    onFanHui:function(){
        sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");
    },
    onExecute:function(){
        var idIwerkInitialize = this.getView().byId("idIwerkInitialize").getSelectedKey();
        var idWorkTypeInitialize = this.getView().byId("idWorkTypeInitialize").getSelectedKey();
        if(idWorkTypeInitialize==""){
            sap.m.MessageBox.alert("请选择工作票类型",{title: "提示"});
            return;
        }
        //根据工作票类型查出工作票类型描述
        var oModel = sap.ui.controller("com.zhenergy.bill.view.GongzuoPiaoQueryPage").onFengZhuang(idIwerkInitialize);
        oModel.setProperty("/Title1","创建");
        oModel.setProperty("/Editable",true);
        jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMTPEOQUALI")) {
			var oDataPer = oStorage.get("ZPMOFFLINE_SRV.ZPMTPEOQUALI");
    		var aFilterPer = [];
			for(var g=0;g<oDataPer.length;g++){
			    if(oDataPer[g].Ztype=="DH1"&&oDataPer[g].Quaid=="A"){
			        aFilterPer.push(oDataPer[g]);
			    }
			}
	        oModel.setProperty("/ZPMTOPER",aFilterPer);
		}
		if (oStorage.get("ZPMOFFLINE_SRV.WorkType")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.WorkType");
			var Ztypedesc = "";
			for(var n=0;n<oData.length;n++){
			    if(oData[n].Ztype==idWorkTypeInitialize){
			        Ztypedesc = oData[n].Ztypedes;
			        break;
			    }
			}
		    oModel.setProperty("/Title2",Ztypedesc);
		}
		var data="";
		oModel.setData(data,true);//合并数据，但是不替换
		sap.ui.getCore().setModel(oModel);
 	    sap.ui.getCore().byId("idBillApp").app.to("idGongZuoPiaoFinalView", oModel);
    	var page = sap.ui.getCore().byId("idBillApp").app.getPage("idGongZuoPiaoFinalView");
    	page.setModel(oModel,"WorkModel");
    },
    onCanKaoDianXingPiao:function(){
        //获取页面上的工厂、工作票类型
        var idIwerkInitialize = this.getView().byId("idIwerkInitialize").getSelectedKey();
        var idWorkTypeInitialize = this.getView().byId("idWorkTypeInitialize").getSelectedKey();
        var biaoJiInitialize = this.getView().byId("BiaoJiInitialize").getText();
        //判断是否选择工作票类型
        if(idWorkTypeInitialize==""){
            sap.m.MessageBox.alert("请选择工作票类型",{title: "提示"});
            return;
        }
        jQuery.sap.require("jquery.sap.storage");
	    jQuery.sap.require("sap.m.MessageToast");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var oLocalModel = new sap.ui.model.json.JSONModel();
		//工厂
		if (oStorage.get("ZPMOFFLINE_SRV.WERKS")) {
			var oDataWerk = oStorage.get("ZPMOFFLINE_SRV.WERKS");
			oLocalModel.setProperty("/WERKS",oDataWerk);
		}
		//操作类型
		if (oStorage.get("ZPMOFFLINE_SRV.WorkType")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.WorkType");
			var aFilter = [];
			for(var n=0;n<oData.length;n++){
			    if(oData[n].Iwerk==idIwerkInitialize){
			        aFilter.push(oData[n]);
			    }
			}
		    oLocalModel.setProperty("/WorkType",aFilter);
		}
		//负责人
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMTPEOQUALI")) {
			var oDataPer = oStorage.get("ZPMOFFLINE_SRV.ZPMTPEOQUALI");
    		var aFilterPer = [];
			for(var g=0;g<oDataPer.length;g++){
			    if(oDataPer[g].Ztype==idWorkTypeInitialize&&oDataPer[g].Quaid=="A"){
			        aFilterPer.push(oDataPer[g]);
			    }
			}
	        oLocalModel.setProperty("/ZPMTOPER",aFilterPer);
		}
		//工作单位
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00229C")) {
			var oDataDanWei = oStorage.get("ZPMOFFLINE_SRV.ZPMT00229C");
			var aFilterDanWei = [];
			for(var l=0;l<oDataDanWei.length;l++){
			    if(oDataDanWei[l].Werks==idIwerkInitialize){
			        aFilterDanWei.push(oDataDanWei[l]);
			    }
			}
		    oLocalModel.setProperty("/DanWei",aFilterDanWei);
		}
		oLocalModel.setProperty("/Iwerk",idIwerkInitialize);
		oLocalModel.setProperty("/Ztype",idWorkTypeInitialize);
		oLocalModel.setProperty("/BiaoJi",biaoJiInitialize);
		oLocalModel.setProperty("/Peoid","");
		oLocalModel.setProperty("/Appdep","");
		oLocalModel.setProperty("/SPlace","");
		oLocalModel.setProperty("/SCont","");
		oLocalModel.setProperty("/Crdate","");
		sap.ui.getCore().setModel(oLocalModel);
        sap.ui.getCore().byId("idBillApp").app.to("idGongzuoPiaoQueryPage");
    }
    // onExecute:function(){
    //     //获取页面上的工厂、工作票类型
    //     var idIwerkInitialize = this.getView().byId("idIwerkInitialize").getSelectedKey();
    //     var idWorkTypeInitialize = this.getView().byId("idWorkTypeInitialize").getSelectedKey();
    //     var biaoJiInitialize = this.getView().byId("BiaoJiInitialize").getText();
    //     //判断是否选择工作票类型
        
    //     alert("创建页面");
    // }

});