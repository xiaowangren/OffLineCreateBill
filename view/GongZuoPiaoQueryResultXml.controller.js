sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoQueryResultXml", {
    onFanHui:function(){
        sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");
    },
    onChange:function(oEvent){
        var rowContext = oEvent.getParameters().rowContext;
        var table = this.getView().byId("gongZuoPiaoQueryResult");
        var BiaoJiResult = this.getView().byId("BiaoJiResult").getText();
        var model = table.getModel(); 
 	    var data  = model.getProperty(rowContext.sPath);
 	    jQuery.sap.require("sap.m.MessageBox");
 	    var oModel = sap.ui.controller("com.zhenergy.bill.view.GongzuoPiaoQueryPage").onFengZhuang(data.Iwerk);
 	     //初始化安全措施下拉列表
 	     sap.ui.controller("com.zhenergy.bill.view.GongzuoPiaoQueryPage").onInitializeAQCSData(data.Ztype);
 	     //工作负责人
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
		//根据工作票类型查出工作票类型描述
		
// 		if (oStorage.get("ZPMOFFLINE_SRV.WorkType")) {
// 			var oData = oStorage.get("ZPMOFFLINE_SRV.WorkType");
// 			var Ztypedesc = "";
// 			for(var n=0;n<oData.length;n++){
// 			    if(oData[n].Ztype==data.Ztype){
// 			        Ztypedesc = oData[n].Ztypedes;
// 			        break;
// 			    }
// 			}
// 		    oModel.setProperty("/Title2",Ztypedesc);
// 		}
 	    if(BiaoJiResult=="Update"){//修改
 	        if(data.statusText=="Created"){
 	            sap.m.MessageBox.alert("该票已上传，不允许修改！",{title: "提示"});
 	            return;
 	        }
 	      //  oModel.setProperty("/Editable",true);
 	      //  oModel.setProperty("/Title1","修改");
 	        data.Editable= true;
 	        data.SaveVisible=true;
 	        data.Title1 ="修改";
 	    }else if(BiaoJiResult=="Create"){//创建
 	      //  oModel.setProperty("/Editable",true);
 	      //  oModel.setProperty("/Title1","创建");
 	        data.Editable= true;
 	        data.SaveVisible=true;
 	        data.Title1 ="新建";
 	    }else{//查询
 	      //oModel.setProperty("/Editable",false);
 	      data.Editable= false;
 	      data.SaveVisible=false;
 	      data.KKSButtonVisible=false;
 	      data.Title1 ="查询";
 	    }
 	    
 	    oModel.setData(data,true);//合并数据，但是不替换
 	  //  oModel = sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoInitializePage").onDataVisible(oModel,data.Iwerk,data.Ztype);
		sap.ui.getCore().setModel(oModel);
 	    sap.ui.getCore().byId("idBillApp").app.to("idGongZuoPiaoFinalView", rowContext);
    	var page = sap.ui.getCore().byId("idBillApp").app.getPage("idGongZuoPiaoFinalView");
    	page.setModel(oModel,"WorkModel");
    }

});