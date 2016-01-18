sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoInitializePage", {
    onFanHui:function(){
        sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");
    },
    onExecute:function(){
        
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
		oLocalModel.setProperty("/Iwerk",idIwerkInitialize);
		oLocalModel.setProperty("/Ztype",idWorkTypeInitialize);
		oLocalModel.setProperty("/BiaoJi",biaoJiInitialize);
		sap.ui.getCore().setModel(oLocalModel);
        sap.ui.getCore().byId("idBillApp").app.to("idGongzuoPiaoQueryPage");
    },
    onExecute:function(){
        //获取页面上的工厂、工作票类型
        var idIwerkInitialize = this.getView().byId("idIwerkInitialize").getSelectedKey();
        var idWorkTypeInitialize = this.getView().byId("idWorkTypeInitialize").getSelectedKey();
        var biaoJiInitialize = this.getView().byId("BiaoJiInitialize").getText();
        //判断是否选择工作票类型
        if(idWorkTypeInitialize==""){
            sap.m.MessageBox.alert("请选择工作票类型",{title: "提示"});
            return;
        }
        alert("创建页面");
    }

});