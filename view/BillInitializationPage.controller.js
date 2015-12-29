sap.ui.controller("com.zhenergy.bill.view.BillInitializationPage", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf com.zhenergy.bill.view.BillInitializationPage
*/
    onFanHui:function(){
        sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");
    },
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
    onExecute: function() {
      jQuery.sap.require("sap.m.MessageBox");
        //检查必填输入
        var idWerksSelect = this.getView().byId("idWerksSelect").getSelectedKey();
        var idTicketSelect = this.getView().byId("idTicketSelect").getSelectedKey();
        var idUser = this.getView().byId("idUser").getValue();

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
// 		var idWerksSelectVaule = this.getView().byId("idWerksSelect")._sTypedChars;
// 		oLocalModel.setProperty("/dianQiGongChang",idWerksSelectVaule);
		//操作人
// 		var usrid = jQuery.sap.getUriParameters().get("usrid").toUpperCase();
// 		oLocalModel.setProperty("/usrid",usrid);
		
        // oLocalModel.setProperty("/Begda",Begda);
		//类型
// 		var idTicketSelectValue = this.getView().byId("idTicketSelect")._sTypedChars;
// 		oLocalModel.setProperty("/dianQiLeiXing",idTicketSelect);
        // var idTicket = "";
        // if(idTicketSelectValue!=undefined){
        //   idTicket = idTicketSelectValue.split(" ")[1];
        // }
// 		oLocalModel.setProperty("/dianQiLeiXingValue",idTicket);
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00204")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.ZPMT00204");
			oLocalModel.setProperty("/ZhiBie",oData);
		}
// 		sap.ui.getCore().setModel(oLocalModel);
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
// 		sap.ui.getCore().setModel(oLocalModel);
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
// 		sap.ui.getCore().setModel(oLocalModel);
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
// 		sap.ui.getCore().setModel(oLocalModel);
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
		//工厂
		if (oStorage.get("ZPMOFFLINE_SRV.WERKS")) {
			var oData5 = oStorage.get("ZPMOFFLINE_SRV.WERKS");
			oLocalModel.setProperty("/WERKS",oData5);
		}
		var datas = this.onData(idTicketSelect,idWerksSelect,idUser);
		sap.ui.getCore().setModel(oLocalModel);
		var oModelS = new sap.ui.model.json.JSONModel(datas); 
		sap.ui.getCore().byId("idBillApp").app.to("idBillCreateInfoPage", datas);
        var page = sap.ui.getCore().byId("idBillApp").app.to("idBillCreateInfoPage");
        page.setModel(oModelS,"newCaoZuoPiaoCreate");
    },
    onCanKaoLiShiPiao:function(){
        var queryModel = new sap.ui.model.json.JSONModel();
        var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
        jQuery.sap.require("sap.m.MessageBox");
        //检查必填输入
        var idWerksSelect = this.getView().byId("idWerksSelect").getSelectedKey();
        var idTicketSelect = this.getView().byId("idTicketSelect").getSelectedKey();
        var idWerksSelectVaule = this.getView().byId("idWerksSelect")._sTypedChars;
// 		var idTicketSelectValue = this.getView().byId("idTicketSelect")._sTypedChars;


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
        queryModel.setProperty("/idWerksSelectVaule",idWerksSelectVaule);
        // queryModel.setProperty("/idTicketSelectValue",idTicketSelectValue);
        //填写部门
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00229")) {
			var oData3 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00229");
			var aFilter3 = [];
			for(var m=0;m<oData3.length;m++){
			    if(oData3[m].Werks==idWerksSelect){
			        aFilter3.push(oData3[m]);
			    }
			}
		    queryModel.setProperty("/tianxieBuMenQuery",aFilter3);
		}
        //  机组
        if (oStorage.get("ZPMOFFLINE_SRV.ZPMV00005")) {
			var oData4 = oStorage.get("ZPMOFFLINE_SRV.ZPMV00005");
			var aFilter4 = [];
			for(var n=0;n<oData4.length;n++){
			    if(oData4[n].Werks==idWerksSelect){
			        aFilter4.push(oData4[n]);
			    }
			}
		    queryModel.setProperty("/jiZuQuery",aFilter4);
		}
        //值别
        if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00204")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.ZPMT00204");
			queryModel.setProperty("/ZhiBieQuery",oData);
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
		    queryModel.setProperty("/banZuQuery",aFilter2);
		}
		//运行区域
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00227")) {
			var oData1 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00227");
			var aFilter = [];
			for(var i=0;i<oData1.length;i++){
			    if(oData1[i].Werks==idWerksSelect){
			        aFilter.push(oData1[i]);
			    }
			}
		    queryModel.setProperty("/yunXingQuYuQuery",aFilter);
		}
        //跳转至查询页面
        sap.ui.getCore().setModel(queryModel);
        sap.ui.getCore().byId("idBillApp").app.to("idBillCaoZuoPiaoQuery");
    },
    onData:function(idTicketSelect,idWerksSelect,idUser){
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
        var Begda = year+"-" + month +"-"+  day;
        //操作内容
		var InfoDataNewC = [];
		for(var a=0;a<250;a++){
		    InfoDataNewC.push({Zxh:"",Zcznr:"",Zzysx:""});
		}
        //危险点分析
		var DangerousTabNewC = [];
		for(var g=0;g<250;g++){
		    DangerousTabNewC.push({Dangno:"",Zztext:"",Zzremark:"",Zzpltxt:""});
		}
        var payLoads ={
            Zczph:"",//ZCZPH
            Estat:10,//ESTAT
            Cuser:idUser,//CUSER
            Cdata:Begda,//CDATA
            Appdep:"",//填写部门
            Ztype:idTicketSelect,//ZTYPE
            Otype:"",//OTYPE
            Unity:"",//UNITY
            Dunum:"",//ZDUTY
            Rarea:"",//RAREA
            Iwerk:idWerksSelect,//BHGBZ
            Ztask:"",//ZTASK操作任务
            Zczfs:"",//ZCZFS操作性质
            Znote:"",//ZNOTE备注
            Yxgroup:"",//YXGROUP运行班组编码
            Prfty:"",//专业
            InfoTab:InfoDataNewC,//InfoTab
            DangerousTab:DangerousTabNewC//危险点分析
        };
        return payLoads;
    }
});