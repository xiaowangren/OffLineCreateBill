sap.ui.controller("com.zhenergy.bill.view.GongzuoPiaoQueryPage", {
    onFanHui:function(){
        sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");
    },
    onChangeWorkType:function(oEvent){
        var key = oEvent.getParameters().selectedItem.mProperties.key;
        if(key!=""){
            this.getView().byId("Peoid").setSelectedKey("");
            jQuery.sap.require("jquery.sap.storage");
            var oLocalModel = sap.ui.getCore().getModel();
		    var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		    if (oStorage.get("ZPMOFFLINE_SRV.ZPMTPEOQUALI")) {
        		var oDataPer = oStorage.get("ZPMOFFLINE_SRV.ZPMTPEOQUALI");
        		var aFilterPer = [];
    			for(var l=0;l<oDataPer.length;l++){
    			    if(oDataPer[l].Ztype==key&&oDataPer[l].Quaid=="A"){
    			        aFilterPer.push(oDataPer[l]);
    			    }
    			}
    			oLocalModel.setProperty("/ZPMTOPER",aFilterPer);
        	}
		    
        }
        
    },
    onGongZuoPiaoQuery:function(){
        //收集桌面数据
        var BiaoJiQuery = this.getView().byId("BiaoJiQuery").getText();
        var Iwerk = this.getView().byId("gongChangQuery").getSelectedKey();
        var idWorkType = this.getView().byId("idWorkType").getSelectedKey();
        var Peoid = this.getView().byId("Peoid").getSelectedKey();
        var Appdep = this.getView().byId("Appdep").getSelectedKey();
        var gongZuoDiDian = this.getView().byId("gongZuoDiDian").getValue();
        var gongZuoNeiRong = this.getView().byId("gongZuoNeiRong").getValue();
        var createDate = this.getView().byId("createDate").getYyyymmdd();
        if(createDate!=""){
            createDate = createDate.substr(0,4)+"-"+createDate.substr(4,2)+"-"+createDate.substr(6,2);
        }
        // console.log(BiaoJiQuery+";"+Iwerk+";"+idWorkType+";"+Peoid+";"+Appdep+";"+gongZuoDiDian+";"+gongZuoNeiRong+";"+createDate);
        var oLocalModel = this.onFengZhuang(Iwerk);
        //初始化安全措施下拉列表
        this.onInitializeAQCSData(idWorkType);
        jQuery.sap.require("jquery.sap.storage");
        var aFilter = [];
	    var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
        if("Create"==BiaoJiQuery){//过滤典型票
            if (oStorage.get("ZPMOFFLINE_SRV.BillInfos")) {
			    var oData1 = oStorage.get("ZPMOFFLINE_SRV.BillInfos");
			    oLocalModel.setProperty("/ResultModel",oData1);
            }
        oLocalModel.setProperty("/Title1","创建");
        oLocalModel.setProperty("/Editable",true);
        //封装combobox数据
        oLocalModel = sap.ui.controller("com.zhenergy.bill.view.GongzuoPiaoQueryPage").onFengZhuang(Iwerk);
        //封装显隐
        oLocalModel= sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoInitializePage").onDataVisible(oLocalModel,Iwerk,idWorkType);
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMTPEOQUALI")) {
			var oDataPer = oStorage.get("ZPMOFFLINE_SRV.ZPMTPEOQUALI");
    		var aFilterPer = [];
			for(var g=0;g<oDataPer.length;g++){
			    if(oDataPer[g].Ztype==idWorkType&&oDataPer[g].Quaid=="A"){
			        aFilterPer.push(oDataPer[g]);
			    }
			}
	        oLocalModel.setProperty("/ZPMTOPER",aFilterPer);
		}
		if (oStorage.get("ZPMOFFLINE_SRV.WorkType")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.WorkType");
			var Ztypedesc = "";
			for(var n=0;n<oData.length;n++){
			    if(oData[n].Ztype==idWorkType){
			        Ztypedesc = oData[n].Ztypedes;
			        break;
			    }
			}
		    oLocalModel.setProperty("/Title2",Ztypedesc);
		}
// 		console.log(oLocalModel.getData());
        }else{//过滤本地已经创建的票
            if (oStorage.get("ZPMOFFLINE_SRV.WorkInfos")) {
			    var oData1 = oStorage.get("ZPMOFFLINE_SRV.WorkInfos");
			    for(var i=0;i<oData1.length;i++){
    			    if(this.checkhelp(oData1[i].Iwerk,Iwerk)&&
                       this.checkhelp(oData1[i].Ztype,idWorkType)&&
                       this.checkhelp(oData1[i].Bname,Peoid)&&
                       this.checkhelp(oData1[i].Appdep,Appdep)&&
                       this.checkhelp(oData1[i].Crdate,createDate)&&
                       this.checkhelpIndex(oData1[i].Cplace,gongZuoDiDian)&&
                       this.checkhelpIndex(oData1[i].Ccontent,gongZuoNeiRong)
                       ){
                        aFilter.push(oData1[i]);
                    }
			    }
			    oLocalModel.setProperty("/ResultModel",aFilter);
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
        oLocalModel.setProperty("/queryResultCount", aFilter.length);
        oLocalModel.setProperty("/queryResultDate", Begda);
        oLocalModel.setProperty("/BiaoJi",BiaoJiQuery);
        sap.ui.getCore().setModel(oLocalModel);
        sap.ui.getCore().byId("idBillApp").app.to("idGongZuoPiaoQueryResultXml");
    },
    checkhelp :function(data,key){//过滤key
		    if(!key){
		        return true;
		    }else{
		        if(data==key){
		            return true
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
	onFengZhuang:function(Iwerk){
	    jQuery.sap.require("jquery.sap.storage");
	    jQuery.sap.require("sap.m.MessageToast");
	    var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var oLocalModel = new sap.ui.model.json.JSONModel();
		//工厂
		if (oStorage.get("ZPMOFFLINE_SRV.WERKS")) {
			var oDataWerk = oStorage.get("ZPMOFFLINE_SRV.WERKS");
			oLocalModel.setProperty("/WERKS",oDataWerk);
		}
		//工作票类型
        if (oStorage.get("ZPMOFFLINE_SRV.WorkType")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.WorkType");
			var aFilter = [];
			for(var n=0;n<oData.length;n++){
			    if(oData[n].Iwerk==Iwerk){
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
			    if(oDataDanWei[l].Werks==Iwerk){
			        aFilterDanWei.push(oDataDanWei[l]);
			    }
			}
		    oLocalModel.setProperty("/DanWei",aFilterDanWei);
		}
		//状态   ？？？？？
		//班组 ZPMT00283  ZPMT00228
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00228")) {
			var oDataBanZu = oStorage.get("ZPMOFFLINE_SRV.ZPMT00228");
			var aFilterBanZu = [];
			for(var m=0;m<oDataBanZu.length;m++){
			    if(oDataBanZu[m].Werks==Iwerk){
			        aFilterBanZu.push(oDataBanZu[m]);
			    }
			}
		    oLocalModel.setProperty("/BanZu",aFilterBanZu);
		}
        //运行区域 ZPMT00227
        if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00227")) {
			var oDataYunXingQuYu = oStorage.get("ZPMOFFLINE_SRV.ZPMT00227");
			var aFilterYunXingQuYu = [];
			for(var g=0;g<oDataYunXingQuYu.length;g++){
			    if(oDataYunXingQuYu[g].Werks==Iwerk){
			        aFilterYunXingQuYu.push(oDataYunXingQuYu[g]);
			    }
			}
		    oLocalModel.setProperty("/YunXingQuYu",aFilterYunXingQuYu);
		}
        //机组 ZPMV00005
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMV00005")) {
			var oDataJiZu = oStorage.get("ZPMOFFLINE_SRV.ZPMV00005");
			var aFilterJiZu = [];
			for(var f=0;f<oDataJiZu.length;f++){
			    if(oDataJiZu[f].Werks==Iwerk){
			        aFilterJiZu.push(oDataJiZu[f]);
			    }
			}
		    oLocalModel.setProperty("/JiZu",aFilterJiZu);
		}
		//部门
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00229")) {
			var oDataBuMen = oStorage.get("ZPMOFFLINE_SRV.ZPMT00229");
			var aFilterBuMen = [];
			for(var x=0;x<oDataBuMen.length;x++){
			    if(oDataBuMen[x].Werks==Iwerk){
			        aFilterBuMen.push(oDataBuMen[x]);
			    }
			}
		    oLocalModel.setProperty("/BuMen",aFilterBuMen);
		}
		//专业
		if(oStorage.get("ZPMOFFLINE_SRV.ZPMT00230")){
		    var oDatazhuanYe = oStorage.get("ZPMOFFLINE_SRV.ZPMT00230");
		    var oFilterZy = [];
		    for(var u=0;u<oDatazhuanYe.length;u++){
		        if(oDatazhuanYe[u].Werks==Iwerk){
			        oFilterZy.push(oDatazhuanYe[u]);
			    }
		    }
		    oLocalModel.setProperty("/ZhuanYe",oFilterZy);
		}
		return oLocalModel;
	},
	
	onInitializeAQCSData: function(Ztype){
    	//安全措施
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMTQPCDT")) {
			var AQCSDataX = new sap.ui.model.json.JSONModel();
			var AQCSDataY = new sap.ui.model.json.JSONModel();
			var AQCSDataYInfo = new sap.ui.model.json.JSONModel();
			var oDataPer = oStorage.get("ZPMOFFLINE_SRV.ZPMTQPCDT");
    		var aFilterPerX = [];
    		var aFilterPerY = [];
			for(var g=0;g<oDataPer.length;g++){
			    if(oDataPer[g].Ztype==Ztype&&oDataPer[g].Katalogart=="X"){
			        aFilterPerX.push(oDataPer[g]);
			    }
			    if(oDataPer[g].Ztype==Ztype&&oDataPer[g].Katalogart=="Y"){
			        aFilterPerY.push(oDataPer[g]);
			    }
			}
	        AQCSDataX.setData(aFilterPerX,false);
	        //检修提出安措数据列表
			sap.ui.getCore().setModel(AQCSDataX,"AQCSDataX");
			//补充运行安措数据列表
	        AQCSDataY.setData(aFilterPerY,false);
			sap.ui.getCore().setModel(AQCSDataY,"AQCSDataY");
			
			//安措标签页配置信息
			var oInfoJson={
			                "Xvisible":false,
			                "Yvisible":false,
			                "Xtitle":"检修提出安措",
			                "Ytitle":"运行补充安措",
			                "ZkghacVisible":false,
			};
			if(Ztype!="JXD"){
			    oInfoJson.Xvisible=true;
			}
			if(Ztype=="DH1"||Ztype=="DH2"){
			    oInfoJson.Xtitle="动火部门应采安措";
			    oInfoJson.Ytitle="运行部门应采安措";
			    oInfoJson.Yvisible=true;
			}
			if(Ztype=="JBP"){
			    oInfoJson.Ytitle="开工后安措";
			    oInfoJson.Yvisible=true;
			    oInfoJson.ZkghacVisible=true;
			}
			AQCSDataYInfo.setData(oInfoJson,false);
			sap.ui.getCore().setModel(AQCSDataYInfo,"AQCSDataYInfo");
/*			console.log("+++++++++++++++++++++++++++++++++++++++++++++");
			console.log(Ztype);
			console.log(oDataPer);
			console.log(AQCSDataY);
			console.log("+++++++++++++++++++++++++++++++++++++++++++++");*/
		}
	}


});