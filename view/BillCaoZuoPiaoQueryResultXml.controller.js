sap.ui.controller("com.zhenergy.bill.view.BillCaoZuoPiaoQueryResultXml", {
    onFanHui:function(){
       sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage"); 
    },
    onChange:function(oEvent){
        var rowContext = oEvent.getParameters().rowContext;
 	    var table = this.getView().byId("caoZuoPiaoQueryResult");
 	    var idBiaoZhiCaoZuoPiaoQuery = this.getView().byId("idBiaoZhiCaoZuoPiaoQuery").getText();
 	    var idUpdateLog2 = this.getView().byId("idUpdateLog2").getText();
 	    var model = table.getModel(); 
 	    var data  = model.getProperty(rowContext.sPath);
 	    var Iwerk = data.Iwerk;
 	    var queryModel3 = new sap.ui.model.json.JSONModel();
        var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
 	    //填写部门
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00229")) {
			var oData3 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00229");
			var aFilter3 = [];
			for(var m=0;m<oData3.length;m++){
			    if(oData3[m].Werks==Iwerk){
			        aFilter3.push(oData3[m]);
			    }
			}
		    queryModel3.setProperty("/tianxieBuMenQuery3",aFilter3);
		}
		//班组
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00283")) {
			var oData2 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00283");
			var aFilter2 = [];
			for(var j=0;j<oData2.length;j++){
			    if(oData2[j].Werks==Iwerk){
			        aFilter2.push(oData2[j]);
			    }
			}
		    queryModel3.setProperty("/banZuQuery3",aFilter2);
		}
		//运行区域
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00227")) {
			var oData1 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00227");
			var aFilter = [];
			for(var i=0;i<oData1.length;i++){
			    if(oData1[i].Werks==Iwerk){
			        aFilter.push(oData1[i]);
			    }
			}
		    queryModel3.setProperty("/yunXingQuYuQuery3",aFilter);
		}
		//机组
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMV00005")) {
			var oData4 = oStorage.get("ZPMOFFLINE_SRV.ZPMV00005");
			var aFilter4 = [];
			for(var n=0;n<oData4.length;n++){
			    if(oData4[n].Werks==Iwerk){
			        aFilter4.push(oData4[n]);
			    }
			}
		    queryModel3.setProperty("/jiZuQuery3",aFilter4);
		}
		//值别
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00204")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.ZPMT00204");
			queryModel3.setProperty("/ZhiBieQuery3",oData);
		}
        sap.ui.getCore().setModel(queryModel3);
  	    var datas = "";
  	    if(data.DangerousTab==undefined){
  	        datas = this.onDataMuBan(data);
  	    }else{
  	        datas = this.onData(data);
  	    }
 	    var oModel = new sap.ui.model.json.JSONModel(datas); 
		if(idBiaoZhiCaoZuoPiaoQuery=="update"){//模板创建
 	        sap.ui.getCore().byId("idBillApp").app.to("idBillCaoZuoPiaoMoBanCreate", rowContext);
    		var page = sap.ui.getCore().byId("idBillApp").app.getPage("idBillCaoZuoPiaoMoBanCreate");
		    page.setModel(oModel,"newCaoZuoPiaoUpdateMuBan");
 	    }else if(idUpdateLog2!="UpdateLog"){//查询 idBillDetailQueryInfoPage
 	        sap.ui.getCore().byId("idBillApp").app.to("idBillDetailQueryInfoPage", rowContext);
    		var page = sap.ui.getCore().byId("idBillApp").app.getPage("idBillDetailQueryInfoPage");
		    page.setModel(oModel,"newBillDetailQueryInfoPage");
 	    }else{//修改本地数据
 	        sap.ui.getCore().byId("idBillApp").app.to("idBillUpdateInfoPage", rowContext);
    		var page = sap.ui.getCore().byId("idBillApp").app.getPage("idBillUpdateInfoPage");
		    page.setModel(oModel,"newBillDetailUpdateInfoPage");
 	        
 	    }
		
 	    
    },
    onData:function(data){
        var InfoTab = data.InfoTab;
		var InfoDataNew = [];
		var InfoTabLength = data.InfoTab.length;
		for(var j=0;j<InfoTabLength;j++){
		    InfoDataNew.push(InfoTab[j]);
		}
		for(var i=0;i<150-InfoTabLength;i++){
		    InfoDataNew.push({Zxh:"",Zcznr:"",Zzysx:""});
		}
		data.InfoTab=InfoDataNew;
		//危险点分析
		var DangerousTab = data.DangerousTab;
		var DangerousTabNew = [];
		var DangerousTabLength = data.DangerousTab.length;
		for(var m=0;m<DangerousTabLength;m++){
		    DangerousTabNew.push(DangerousTab[m]);
		}
		for(var n=0;n<150-DangerousTabLength;n++){
		    DangerousTabNew.push({Dangno:"",Zztext:"",Zzremark:"",Zzpltxt:""});
		}
		data.DangerousTab=DangerousTabNew;
	    return data;
    },
    onDataMuBan:function(data){//重新封装数据格式
        var InfoTab = data.InfoTab.results;
		var InfoDataNew = [];
		var InfoTabLength = data.InfoTab.results.length;
		for(var j=0;j<InfoTabLength;j++){
		    InfoDataNew.push(InfoTab[j]);
		}
		for(var i=0;i<150-InfoTabLength;i++){
		    InfoDataNew.push({Zxh:"",Zcznr:"",Zzysx:""});
		}
		data.InfoTab.results=InfoDataNew;
// 		//危险点分析
// 		var DangerousTab = data.DangerousTab.results;
// 		var DangerousTabNew = [];

// 		for(var n=0;n<150-DangerousTabLength;n++){
// 		    DangerousTabNew.push({Dangno:"",Zztext:"",Zzremark:"",Zzpltxt:""});
// 		}
// 		data.DangerousTab=DangerousTabNew;
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
        var payLoad ={
            Zczph:data.Zczph,//ZCZPH
            Estat:10,//ESTAT
            Cuser:"",//CUSER
            Cdata:Begda,//CDATA
            Appdep:data.Appdep,//填写部门
            Ztype:"",//ZTYPE
            Otype:data.Otype,//OTYPE
            Unity:data.Unity,//UNITY
            Dunum:data.Dunum,//ZDUTY
            Rarea:data.Rarea,//RAREA
            Iwerk:"",//BHGBZ
            Ztask:data.Ztask,//ZTASK操作任务
            Zczfs:data.Zczfs,//ZCZFS操作性质
            Znote:data.Znote,//ZNOTE备注
            Yxgroup:data.Yxgroup,//YXGROUP运行班组编码
            Prfty:data.Prfty,//专业
            // Estxt:EstatValue,//状态value
            // Name1:gongChangValue,
            // Ztypedes:leiXingValue,
            // Appdepdec:buMenValue,
            // Yxgroupdec:dianQiBanZuValue,//班组Value
            // OtypeValue:CaozuoLeiXingValue,//操作类型value
            // ZczfsValue:CaoZuoXingZhiValue,//操作性质value
            // Prtxt:ZhuanYesValue,//专业Value
            // Rareadec:YunXingQuYuValue,//运行区域value
            // Untxt:dianQiJiZuValue,//机组Value
            // Dutxt:dianQiZhiBieValue,//值别Value
            InfoTab:data.InfoTab.results,//InfoTab
            DangerousTab:[]//危险点分析
        };
	    return payLoad;
    }
    
    
    

});