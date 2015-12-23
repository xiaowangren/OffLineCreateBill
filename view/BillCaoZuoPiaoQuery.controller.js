sap.ui.controller("com.zhenergy.bill.view.BillCaoZuoPiaoQuery", {
    onFanHui:function(oEvent){
        sap.ui.getCore().byId("idBillApp").app.to("idBillInitializationPage");
        jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var oLocalModel = new sap.ui.model.json.JSONModel();
		//Check if there is data into the Storage
		if (oStorage.get("ZPMOFFLINE_SRV.WERKS")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.WERKS");
			oLocalModel.setProperty("/WERKS",oData);
		}
		sap.ui.getCore().setModel(oLocalModel);
    },
    onCaoZuoPiaoQuery1:function(){
        //获取页面数据
        var gongChangQuery = this.getView().byId("gongChangQuery").getValue();//工厂
        var caoZuoPiaoLeiXingQuery = this.getView().byId("caoZuoPiaoLeiXingQuery").getValue();//操作票类型
        var zhuangTaiQueryStart = this.getView().byId("zhuangTaiQuery1").getSelectedKey();//状态
        var tianXieBuMenQueryStart = this.getView().byId("tianXieBuMenQuery1").getSelectedKey();//填写部门
        var zhuanYeQueryStart = this.getView().byId("zhuanYeQuery1").getSelectedKey();//专业
        var jiZuQueryStart = this.getView().byId("jiZuQuery1").getSelectedKey();//机组
        var banZuQueryStart = this.getView().byId("banZuQuery1").getSelectedKey();//班组
        var kaiPiaoRiQiQueryStart = this.getView().byId("kaiPiaoRiQiQuery1").getValue();//开始日期
        var kaiPiaoRenQuery = this.getView().byId("kaiPiaoRenQuery").getValue();//开票人
        var caoZuoRenWuQuery = this.getView().byId("caoZuoRenWuQuery").getValue();//操作任务
        console.log(gongChangQuery+";"+caoZuoPiaoLeiXingQuery+";"+zhuangTaiQueryStart+";"+tianXieBuMenQueryStart+";"+zhuanYeQueryStart+";"+jiZuQueryStart+";"+banZuQueryStart+";"+kaiPiaoRiQiQueryStart+";"+kaiPiaoRenQuery+";"+caoZuoRenWuQuery);
        //获取本地的数据，进行查询
        jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var aFilter = [];
		//Check if there is data into the Storage   筛选数据
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00227")) {
			var oData1 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00227");
			for(var i=0;i<oData1.length;i++){
			    if(oData1[i].Werks==gongChangQuery){
			        aFilter.push(oData1[i]);
			    }
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
        //跳转至查询结果页面
        var queryResultModel = new sap.ui.model.json.JSONModel();
        queryResultModel.setProperty("/queryResultModel",aFilter);
        queryResultModel.setProperty("/queryResultModelCount",aFilter.length);
        queryResultModel.setProperty("/BiaoJi","update");
        queryResultModel.setProperty("/queryResultModelDate",Begda);
        sap.ui.getCore().setModel(queryResultModel);
        sap.ui.getCore().byId("idBillApp").app.to("idBillCaoZuoPiaoQueryResult");

    }

});