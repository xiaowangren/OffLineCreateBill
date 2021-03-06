sap.ui.controller("com.zhenergy.bill.view.BillCaoZuoPiaoQueryResultXml", {
    onFanHui:function(){
       sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage"); 
    },
    onChange:function(oEvent){
        var rowContext = oEvent.getParameters().rowContext;
 	    var table = this.getView().byId("caoZuoPiaoQueryResult");
 	    var idBiaoZhiCaoZuoPiaoQuery = this.getView().byId("idBiaoZhiCaoZuoPiaoQuery").getText();
 	    var idUpdateLog2 = this.getView().byId("idUpdateLog2").getText();
 	    var queryGongChang = this.getView().byId("queryGongChang").getText();
 	    var queryLeiXing = this.getView().byId("queryLeiXing").getText();
 	    var idUser3 = this.getView().byId("idUser3").getText();
 	    var model = table.getModel(); 
 	    var data  = model.getProperty(rowContext.sPath);
 	    jQuery.sap.require("sap.m.MessageBox");
 	    if(idUpdateLog2=="UpdateLog"&&idBiaoZhiCaoZuoPiaoQuery!="update"){
 	        if(data.statusText=="Created"){
 	            sap.m.MessageBox.alert("该票已上传，不允许修改！",{title: "提示"});
 	            return;
 	        }
 	    }
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
		//工厂
		if (oStorage.get("ZPMOFFLINE_SRV.WERKS")) {
			var oData5 = oStorage.get("ZPMOFFLINE_SRV.WERKS");
			queryModel3.setProperty("/WERKSQuery3",oData5);
		}
  	    var datas = "";
  	    if(data.DangerousTab==undefined){
  	        data.Werks = queryGongChang;
  	        data.Ztype = queryLeiXing;
  	        data.Cuser = idUser3;
  	        datas = this.onDataMuBan(data);
  	    }else{
  	        datas = this.onData(data);
  	    }
  	    //标题
  	    var ZtypeBiaoTi="";
		if(datas.Ztype=="DQ"){
		    ZtypeBiaoTi = "电气操作票";
		}
		if(datas.Ztype=="GL"){
		    ZtypeBiaoTi = "锅炉操作票";
		}
		if(datas.Ztype=="HB"){
		    ZtypeBiaoTi = "环保操作票";
		}
		if(datas.Ztype=="HX"){
		    ZtypeBiaoTi = "化学操作票";
		}
		if(datas.Ztype=="QJ"){
		    ZtypeBiaoTi = "汽机操作票";
		}
		if(datas.Ztype=="RK"){
		    ZtypeBiaoTi = "热控操作票";
		}
		if(datas.Ztype=="RL"){
		    ZtypeBiaoTi = "燃料操作票";
		}
		if(datas.Ztype=="ZS"){
		    ZtypeBiaoTi = "典型操作票";
		}
		queryModel3.setProperty("/biaoTi",ZtypeBiaoTi);
		sap.ui.getCore().setModel(queryModel3);
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
        if(InfoTabLength==0){
           for(var i=0;i<1;i++){
    		    InfoDataNew.push({Zxh:"",Zcznr:"",Zzysx:""});
    		} 
        }else{
            for(var m=0;m<InfoTabLength;m++){
                if(InfoTab[m].Zxh!=""){
                    InfoTab[m].Zxh = parseInt(InfoTab[m].Zxh);
                }
                InfoDataNew.push(InfoTab[m]);
    		}
        }
		data.InfoTab=InfoDataNew;
		//危险点分析
		var DangerousTab = data.DangerousTab;
		var DangerousTabNew = [];
		var DangerousTabLength = data.DangerousTab.length;
        if(DangerousTabLength==0){
           for(var j=0;j<1;j++){
    		    DangerousTabNew.push({Dangno:"",Zztext:"",Zzremark:"",Zzpltxt:""});
    		} 
        }else{
            for(var n=0;n<DangerousTabLength;n++){
                if(DangerousTab[n].Dangno!=""){
                    DangerousTab[n].Dangno = parseInt(DangerousTab[n].Dangno);
                }
    		    DangerousTabNew.push(DangerousTab[n]);
    		}
        }
		data.DangerousTab=DangerousTabNew;
        data.Zlybnum="";
	    return data;
    },
    onDataMuBan:function(data){//重新封装数据格式
        var InfoTab = data.InfoTab.results;
		var InfoTabLength = data.InfoTab.results.length;
        var InfoDataNew = [];
        if(InfoTabLength==0){
           for(var i=0;i<1;i++){
    		    InfoDataNew.push({Zxh:"",Zcznr:"",Zzysx:""});
    		} 
        }else{
            for(var m=0;m<InfoTabLength;m++){
    		    InfoTab[m].Zxh = parseInt(InfoTab[m].Zxh);
    		    if(InfoTab[m].Zzysx==undefined){
    		       InfoTab[m].Zzysx = ""; 
    		    }
    		    InfoDataNew.push(InfoTab[m]);
    		}
        }
        InfoTab=InfoDataNew;
// 		危险点分析
		var DangerousTabNew = [];
        for(var j=0;j<1;j++){
    	    DangerousTabNew.push({Dangno:"1",Zztext:"",Zzremark:"",Zzpltxt:""});
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
        var Begda = year+"-" + month +"-"+ day;
        if(data.Dunum=="0000"){
            data.Dunum ="";
        }
        var payLoad ={
            Zczph:"",//ZCZPH
            Estat:"10",//ESTAT
            Cuser:data.Cuser,//CUSER
            Cdata:Begda,//CDATA
            CreateName:"",//开票人姓名
            Appdep:data.Appdep,//填写部门
            Ztype:data.Ztype,//ZTYPE
            Otype:data.Otype,//OTYPE
            Unity:data.Unity,//UNITY
            Dunum:data.Dunum,//ZDUTY
            Rarea:data.Rarea,//RAREA
            Iwerk:data.Iwerk,//BHGBZ
            Ztask:data.Ztask,//ZTASK操作任务
            Zczfs:data.Zczfs,//ZCZFS操作性质
            Znote:data.Znote,//ZNOTE备注
            Yxgroup:data.Yxgroup,//YXGROUP运行班组编码
            Prfty:data.Prfty,//专业
            statusText:"unCreated",
            Zlybnum:"",
            InfoTab:InfoTab,//InfoTab
            DangerousTab:DangerousTabNew//危险点分析
        };
	    return payLoad;
    }
    
    
    

});