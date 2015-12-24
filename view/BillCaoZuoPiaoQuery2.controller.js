sap.ui.controller("com.zhenergy.bill.view.BillCaoZuoPiaoQuery2", {
    onFanHui:function(oEvent){
        sap.ui.getCore().byId("idBillApp").app.to("idQueryCaoZuoPiao2");
        jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var oLocalModelQuery2 = new sap.ui.model.json.JSONModel();
		//工厂
		if (oStorage.get("ZPMOFFLINE_SRV.WERKS")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.WERKS");
			oLocalModelQuery2.setProperty("/WERKSQuery2",oData);
		}
		sap.ui.getCore().setModel(oLocalModelQuery2);
    },
    onCaoZuoPiaoQuery2:function(){
        //收集数据
        var gongChangQuery2 = this.getView().byId("gongChangQuery2").getSelectedKey();//工厂
        var ricketTypeQuery2 = this.getView().byId("ricketTypeQuery2").getSelectedKey();//操作票类型
        var zhuangTaiQuery2 = this.getView().byId("zhuangTaiQuery2").getSelectedKey();//状态
        var tianXieBuMenQuery2 = this.getView().byId("tianXieBuMenQuery2").getSelectedKey();//填写部门
        var zhuanYeQuery2 = this.getView().byId("zhuanYeQuery2").getSelectedKey();//专业
        var jiZuQuery2 = this.getView().byId("jiZuQuery2").getSelectedKey();//机组
        var banZuQuery2 = this.getView().byId("banZuQuery2").getSelectedKey();//班组
        var kaiPiaoRiQiQuery2 = this.getView().byId("kaiPiaoRiQiQuery2").getValue();//开票日期
        var kaiPiaoRenQuery2 = this.getView().byId("kaiPiaoRenQuery2").getValue();//开票人
        var caoZuoRenWuQuery2 = this.getView().byId("caoZuoRenWuQuery2").getValue();//操作任务
        var UpdateLog2 = this.getView().byId("UpdateLog2").getText();
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
                   this.checkhelp(oData1[i].Estat,zhuangTaiQuery2)&&
                   this.checkhelp(oData1[i].Appdep,tianXieBuMenQuery2)&&
                   this.checkhelp(oData1[i].Prfty,zhuanYeQuery2)&&
                   this.checkhelp(oData1[i].Unity,jiZuQuery2)&&
                   this.checkhelp(oData1[i].Yxgroup,banZuQuery2)&&
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
        //跳转至查询结果页面
        var queryResultModel = new sap.ui.model.json.JSONModel();
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