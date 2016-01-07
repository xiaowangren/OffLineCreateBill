sap.ui.controller("com.zhenergy.bill.view.BillCaoZuoPiaoQuery", {
    onFanHui:function(oEvent){
        sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");
//         jQuery.sap.require("jquery.sap.storage");
// 		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
// 		var oLocalModel = new sap.ui.model.json.JSONModel();
// 		//Check if there is data into the Storage
// 		if (oStorage.get("ZPMOFFLINE_SRV.WERKS")) {
// 			var oData = oStorage.get("ZPMOFFLINE_SRV.WERKS");
// 			oLocalModel.setProperty("/WERKS",oData);
// 		}
// 		sap.ui.getCore().setModel(oLocalModel);
    },
    onCaoZuoPiaoQuery1:function(){
        //获取页面数据
        var gongChangQuery = this.getView().byId("gongChangQuery").getSelectedKey();//工厂
        var caoZuoPiaoLeiXingQuery = this.getView().byId("caoZuoPiaoLeiXingQuery").getValue();//操作票类型
        var idTicketSelect = this.getView().byId("idTicketSelect").getValue();
        var zhuangTaiQueryStart = this.getView().byId("zhuangTaiQuery1").getSelectedKey();//状态
        // var tianXieBuMenQueryStart = this.getView().byId("tianXieBuMenQuery1").getSelectedKey();//填写部门
        var zhuanYeQueryStart = this.getView().byId("zhuanYeQuery1").getSelectedKey();//专业
        // var jiZuQueryStart = this.getView().byId("jiZuQuery1").getSelectedKey();//机组
        // var banZuQueryStart = this.getView().byId("banZuQuery1").getSelectedKey();//班组
        var kaiPiaoRiQiQueryStart = this.getView().byId("kaiPiaoRiQiQuery1").getValue();//开始日期
        var kaiPiaoRenQuery = this.getView().byId("kaiPiaoRenQuery").getValue();//开票人
        var caoZuoRenWuQuery = this.getView().byId("caoZuoRenWuQuery").getValue();//操作任务idUser2
        var idUser2 = this.getView().byId("idUser2").getValue();
        if(kaiPiaoRiQiQueryStart!=""){
            kaiPiaoRiQiQueryStart = kaiPiaoRiQiQueryStart.substr(0,4)+"-"+kaiPiaoRiQiQueryStart.substr(4,2)+"-"+kaiPiaoRiQiQueryStart.substr(6,2);
        }
        // console.log(gongChangQuery+";"+caoZuoPiaoLeiXingQuery+";"+zhuangTaiQueryStart+";"+tianXieBuMenQueryStart+";"+zhuanYeQueryStart+";"+jiZuQueryStart+";"+banZuQueryStart+";"+kaiPiaoRiQiQueryStart+";"+kaiPiaoRenQuery+";"+caoZuoRenWuQuery);
        //获取本地的数据，进行查询
        //取出工厂号
        var gongChangQueryId = gongChangQuery.substr(0,4);
        jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var aFilterData = [];
		//Check if there is data into the Storage   筛选数据
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMTOPER")) {
			var oData1 = oStorage.get("ZPMOFFLINE_SRV.ZPMTOPER");
			for(var i=0;i<oData1.length;i++){
                if(this.checkhelp(oData1[i].Iwerk,gongChangQueryId)&&
                   this.checkhelp(oData1[i].Ztype,caoZuoPiaoLeiXingQuery)&&
                   this.checkhelp(oData1[i].Estat,zhuangTaiQueryStart)&&
                //   this.checkhelp(oData1[i].Appdep,tianXieBuMenQueryStart)&&
                   this.checkhelp(oData1[i].Prfty,zhuanYeQueryStart)&&
                //   this.checkhelp(oData1[i].Unity,jiZuQueryStart)&&
                //   this.checkhelp(oData1[i].Yxgroup,banZuQueryStart)&&
                   this.checkhelp(oData1[i].Cdata,kaiPiaoRiQiQueryStart)&&
                   this.checkhelp(oData1[i].Cuser,kaiPiaoRenQuery)&&
                   this.checkhelpIndex(oData1[i].Ztask,caoZuoRenWuQuery)
                   ){
                    aFilterData.push(oData1[i]);
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
        var queryResultModel = new sap.ui.model.json.JSONModel();

        var Iwerk ="";
        if(gongChangQuery){
            Iwerk=gongChangQuery.substr(0 ,4);
        }
        //填写部门
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00229")) {
			var oData3 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00229");
			var aFilter3 = [];
			for(var m=0;m<oData3.length;m++){
			    if(oData3[m].Werks==Iwerk){
			        aFilter3.push(oData3[m]);
			    }
			}
		    queryResultModel.setProperty("/tianxieBuMenQuery3",aFilter3);
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
		    queryResultModel.setProperty("/banZuQuery3",aFilter2);
		}
		//运行区域
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00227")) {
			var oDatag = oStorage.get("ZPMOFFLINE_SRV.ZPMT00227");
			var aFilterg = [];
			for(var g=0;g<oDatag.length;g++){
			    if(oDatag[g].Werks==Iwerk){
			        aFilterg.push(oDatag[g]);
			    }
			}
		    queryResultModel.setProperty("/yunXingQuYuQuery3",aFilterg);
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
		    queryResultModel.setProperty("/jiZuQuery3",aFilter4);
		}
		//值别
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00204")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.ZPMT00204");
			queryResultModel.setProperty("/ZhiBieQuery3",oData);
		}
        //跳转至查询结果页面
        queryResultModel.setProperty("/queryResultModel",aFilterData);
        queryResultModel.setProperty("/queryResultModelCount",aFilterData.length);
        queryResultModel.setProperty("/BiaoJi","update");
        queryResultModel.setProperty("/queryResultModelDate",Begda);
        queryResultModel.setProperty("/queryGongChang",gongChangQuery);
        queryResultModel.setProperty("/queryLeiXing",idTicketSelect);
        queryResultModel.setProperty("/idUser", idUser2);
        sap.ui.getCore().setModel(queryResultModel);
        sap.ui.getCore().byId("idBillApp").app.to("idBillCaoZuoPiaoQueryResult");

    },
    checkhelp :function(data,key){
		    if(!key){
		        return true;
		    }else{
		        if(data==key){
		            return true
		        }
		    }
		    return false;
	},
	checkhelpIndex :function(data,key){
		    if(!key){
		        return true;
		    }else{
		        if(data.indexOf(key)>=0){
		            return true;
		        }
		    }
		    return false;
		}

});