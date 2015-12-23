sap.ui.controller("com.zhenergy.bill.view.QueryCaoZuoPiao2", {

    onExecute: function() {
        var queryModel = new sap.ui.model.json.JSONModel();
        var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
        jQuery.sap.require("sap.m.MessageBox");
        //检查必填输入
        var idWerksSelect = this.getView().byId("idWerksSelect").getSelectedKey();
        var idTicketSelect = this.getView().byId("idTicketSelect").getSelectedKey();
        if(!idWerksSelect)
        {
            sap.m.MessageBox.alert("请选择工厂");
            return;
        }
        if(!idTicketSelect){
            sap.m.MessageBox.alert("请选择操作票类型");
            return;
        }
        queryModel.setProperty("/werkQuery",idWerksSelect);
        queryModel.setProperty("/caoZuoLeiXingQuery",idTicketSelect);
        //工厂
		if (oStorage.get("ZPMOFFLINE_SRV.WERKS")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.WERKS");
			queryModel.setProperty("/WERKSQuery2",oData);
		}
		//填写部门
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00229")) {
			var oData3 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00229");
			var aFilter3 = [];
			for(var m=0;m<oData3.length;m++){
			    if(oData3[m].Werks==idWerksSelect){
			        aFilter3.push(oData3[m]);
			    }
			}
		    queryModel.setProperty("/tianxieBuMenQuery2",aFilter3);
		}
		//机组
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMV00005")) {
			var oData4 = oStorage.get("ZPMOFFLINE_SRV.ZPMV00005");
			var aFilter4 = [];
			for(var n=0;n<oData4.length;n++){
			    if(oData4[n].Werks==idWerksSelect){
			        aFilter4.push(oData4[n]);
			    }
			}
		    queryModel.setProperty("/jiZuQuery2",aFilter4);
		}
		//班组
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00283")) {
			var oData2 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00283");
			var aFilter2 = [];
			for(var j=0;j<oData2.length;j++){
			    if(oData2[j].Werks==idWerksSelect){
			        aFilter2.push(oData2[j]);
			    }
			}
		    queryModel.setProperty("/banZuQuery2",aFilter2);
		}
        sap.ui.getCore().setModel(queryModel);
        sap.ui.getCore().byId("idBillApp").app.to("idBillCaoZuoPiaoQuery2");
    }

});