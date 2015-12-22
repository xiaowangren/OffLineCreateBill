sap.ui.controller("com.zhenergy.bill.view.BillInitializationPage", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf com.zhenergy.bill.view.BillInitializationPage
*/
	onInit: function() {
		//读取LOCAL STORAGE 中的数据,作为程序的下拉框主数据
		//Storage  
		jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var oLocalModel = new sap.ui.model.json.JSONModel();
		//Check if there is data into the Storage
		if (oStorage.get("ZPMOFFLINE_SRV.WERKS")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.WERKS");
			oLocalModel.setProperty("/WERKS",oData);
		}
		if (oStorage.get("ZPMOFFLINE_SRV.TicketType")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.TicketType");
			oLocalModel.setProperty("/TicketType",oData);
		}
		sap.ui.getCore().setModel(oLocalModel);
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf com.zhenergy.bill.view.BillInitializationPage
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf com.zhenergy.bill.view.BillInitializationPage
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf com.zhenergy.bill.view.BillInitializationPage
*/
//	onExit: function() {
//
//	}
    onExecute: function() {
      jQuery.sap.require("sap.m.MessageBox");
// 		sap.m.MessageBox.alert("ZHIXING");
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
        
        //获取Storage中的数据
        jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var oLocalModel = new sap.ui.model.json.JSONModel();
		//工厂
		var idWerksSelectVaule = this.getView().byId("idWerksSelect")._sTypedChars;
		oLocalModel.setProperty("/dianQiGongChang",idWerksSelectVaule);
		//类型
		var idTicketSelectValue = this.getView().byId("idTicketSelect")._sTypedChars;
		oLocalModel.setProperty("/dianQiLeiXing",idTicketSelect);
		oLocalModel.setProperty("/dianQiLeiXingValue",idTicketSelectValue);
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00204")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.ZPMT00204");
			oLocalModel.setProperty("/ZhiBie",oData);
		}
		sap.ui.getCore().setModel(oLocalModel);
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00227")) {
			var oData1 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00227");
			var aFilter = [];
			for(var i=0;i<oData1.length;i++){
			    if(oData1[i].Werks==idWerksSelect){
			        aFilter.push(oData1[i]);
			    }
			}
		    oLocalModel.setProperty("/yunXingQuYu",aFilter);
		}
		sap.ui.getCore().setModel(oLocalModel);
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00283")) {
			var oData2 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00283");
			var aFilter2 = [];
			for(var j=0;j<oData2.length;j++){
			    if(oData2[j].Werks==idWerksSelect){
			        aFilter2.push(oData2[j]);
			    }
			}
		    oLocalModel.setProperty("/banZu",aFilter2);
		}
		sap.ui.getCore().setModel(oLocalModel);
		//填写部门
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00229")) {
			var oData3 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00229");
			var aFilter3 = [];
			for(var m=0;m<oData3.length;m++){
			    if(oData3[m].Werks==idWerksSelect){
			        aFilter3.push(oData3[m]);
			    }
			}
		    oLocalModel.setProperty("/tianxieBuMen",aFilter3);
		}
		sap.ui.getCore().setModel(oLocalModel);
		//机组配置表
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMV00005")) {
			var oData4 = oStorage.get("ZPMOFFLINE_SRV.ZPMV00005");
			var aFilter4 = [];
			for(var n=0;n<oData4.length;n++){
			    if(oData4[n].Werks==idWerksSelect){
			        aFilter4.push(oData4[n]);
			    }
			}
		    oLocalModel.setProperty("/jiZu",aFilter4);
		}
		sap.ui.getCore().setModel(oLocalModel);
        // if(idTicketSelect=="DQ"){
            sap.ui.getCore().byId("idBillApp").app.to("idBillCreateInfoPage");

//        }
    }
});