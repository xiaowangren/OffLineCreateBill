sap.ui.controller("com.zhenergy.bill.view.BillCaoZuoPiaoQuery2", {
    onFanHui:function(oEvent){
        sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");
    },
    onCaoZuoPiaoQuery2:function(){
        //收集数据
        var gongChangQuery2 = this.getView().byId("gongChangQuery2").getSelectedKey();//工厂
        var ricketTypeQuery2 = this.getView().byId("ricketTypeQuery2").getSelectedKey();//操作票类型
        var zhuanYeQuery2 = this.getView().byId("zhuanYeQuery2").getSelectedKey();//专业
        var kaiPiaoRiQiQuery2 = this.getView().byId("kaiPiaoRiQiQuery2").getYyyymmdd();//开票日期
        var kaiPiaoRenQuery2 = this.getView().byId("kaiPiaoRenQuery2").getValue();//开票人
        var caoZuoRenWuQuery2 = this.getView().byId("caoZuoRenWuQuery2").getValue();//操作任务
        var UpdateLog2 = this.getView().byId("UpdateLog2").getText();
        if(kaiPiaoRiQiQuery2!=""){
            kaiPiaoRiQiQuery2 = kaiPiaoRiQiQuery2.substr(0,4)+"-"+kaiPiaoRiQiQuery2.substr(4,2)+"-"+kaiPiaoRiQiQuery2.substr(6,2);
        }
        
        //过滤数据
        //获取本地的数据，进行查询
        jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var aFilter = [];
		//Check if there is data into the Storage   筛选数据
		if (oStorage.get("ZPMOFFLINE_SRV.BillInfos")) {
			var oData1 = oStorage.get("ZPMOFFLINE_SRV.BillInfos");
			for(var i=0;i<oData1.length;i++){
                if(this.checkhelp(oData1[i].Iwerk,gongChangQuery2)&&
                   this.checkhelp(oData1[i].Ztype,ricketTypeQuery2)&&
                   this.checkhelp(oData1[i].Prfty,zhuanYeQuery2)&&
                   this.checkhelp(oData1[i].Cdata,kaiPiaoRiQiQuery2)&&
                   this.checkhelp(oData1[i].Cuser,kaiPiaoRenQuery2)&&
                   this.checkhelpIndex(oData1[i].Ztask,caoZuoRenWuQuery2)
                   ){
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
        var queryResultModel = new sap.ui.model.json.JSONModel();
        //填写部门
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00229")) {
			var oData3 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00229");
			var aFilter3 = [];
			for(var m=0;m<oData3.length;m++){
			    if(oData3[m].Werks==gongChangQuery2){
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
			    if(oData2[j].Werks==gongChangQuery2){
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
			    if(oDatag[g].Werks==gongChangQuery2){
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
			    if(oData4[n].Werks==gongChangQuery2){
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
        queryResultModel.setProperty("/queryResultModel",aFilter);
        queryResultModel.setProperty("/queryResultModelCount",aFilter.length);
        queryResultModel.setProperty("/BiaoJi","query");
        queryResultModel.setProperty("/UpdateLog2",UpdateLog2);
        queryResultModel.setProperty("/queryResultModelDate",Begda);
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