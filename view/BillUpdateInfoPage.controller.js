sap.ui.controller("com.zhenergy.bill.view.BillUpdateInfoPage", {
    onFanHui:function(){
       sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage"); 
    },
    onUpdateBillInfoFirst:function(){
      var newBillDetailUpdateInfoPage = this.getView().getModel("newBillDetailUpdateInfoPage").getData(); 
        //校验数据合法性
        if(newBillDetailUpdateInfoPage.Appdep==""){
            sap.m.MessageBox.alert("填写部门必填",{title: "提示"});
            return;
        }
        if(newBillDetailUpdateInfoPage.Yxgroup==""){
            sap.m.MessageBox.alert("班组必填",{title: "提示"});
            return;
        }
        if(newBillDetailUpdateInfoPage.Otype==""){
            sap.m.MessageBox.alert("操作类型必填",{title: "提示"});
            return;
        }
        if(newBillDetailUpdateInfoPage.Zczfs==""){
            sap.m.MessageBox.alert("操作性质必填",{title: "提示"});
            return;
        }
        if(newBillDetailUpdateInfoPage.Rarea==""){
            sap.m.MessageBox.alert("运行区域必填",{title: "提示"});
            return;
        }
        if(newBillDetailUpdateInfoPage.Unity==""){
            sap.m.MessageBox.alert("机组必填",{title: "提示"});
            return;
        }
        if(newBillDetailUpdateInfoPage.Dunum==""){
            sap.m.MessageBox.alert("值别必填",{title: "提示"});
            return;
        }
        if(newBillDetailUpdateInfoPage.Cuser.trim()==""){
            sap.m.MessageBox.alert("开票人必填",{title: "提示"});
            return;
        }
        if(newBillDetailUpdateInfoPage.Ztask.trim()==""){
            sap.m.MessageBox.alert("操作任务必填",{title: "提示"});
            return;
        }
        newBillDetailUpdateInfoPage.Cuser = newBillDetailUpdateInfoPage.Cuser.trim().toUpperCase();                         
        var tableData = newBillDetailUpdateInfoPage.InfoTab;
        var BillInfoNew =[];
        for(var i=0;i<tableData.length;i++){
            tableData[i].Zxh = ""+tableData[i].Zxh;
            if((tableData[i].Zzysx.trim()=="")&&(tableData[i].Zxh=="")&&(tableData[i].Zcznr.trim()=="")){
            }else{
                BillInfoNew.push(tableData[i]); 
            }
        }
        newBillDetailUpdateInfoPage.InfoTab = BillInfoNew;
        var dangerousPointData = newBillDetailUpdateInfoPage.DangerousTab;
        var dangerousPointDataNew = [];
        for(var j=0;j<dangerousPointData.length;j++){
            if((dangerousPointData[j].Dangno=="")&&(dangerousPointData[j].Zztext.trim()=="")
                &&(dangerousPointData[j].Zzremark.trim()=="")&&(dangerousPointData[j].Zzpltxt.trim()=="")){
            }else{
                dangerousPointDataNew.push(dangerousPointData[j]); 
            }
        }
        newBillDetailUpdateInfoPage.DangerousTab=dangerousPointDataNew;
        //存储数据
        jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var getStorage = oStorage.get("ZPMOFFLINE_SRV.BillInfos");
        if(getStorage){
            for(var a=0;a<getStorage.length;a++){
                if(getStorage[a].Zczph==newBillDetailUpdateInfoPage.Zczph){
                    getStorage[a] = newBillDetailUpdateInfoPage;
                }
            }
            oStorage.put("ZPMOFFLINE_SRV.BillInfos",getStorage);
            //提示成功
            //根据票号查
            var getStorageNew = oStorage.get("ZPMOFFLINE_SRV.BillInfos");
            var newCaoZuoPiao = "";
            if(getStorageNew){
                for(var x=0;x<getStorageNew.length;x++){
                    if(getStorageNew[x].Zczph==newBillDetailUpdateInfoPage.Zczph){
                        newCaoZuoPiao = getStorageNew[x];
                    }
                }
            }
            //重新拼装InfoTab,DangerousTab
            var InfoDataNew = [];
            var InfoTab = newCaoZuoPiao.InfoTab; 
    		var InfoTabLength = newCaoZuoPiao.InfoTab.length;
    		for(var m=0;m<InfoTabLength;m++){
    		    //将编号字符串改为数字
    		    InfoDataNew.push(InfoTab[m]);
    		}
    // 		for(var n=0;n<250-InfoTabLength;n++){
    // 		    InfoDataNew.push({Zxh:"",Zcznr:"",Zzysx:""});
    // 		}
            newCaoZuoPiao.InfoTab=InfoDataNew;
            newCaoZuoPiao.DangerousTab=dangerousPointData;
            var oModel = new sap.ui.model.json.JSONModel(newCaoZuoPiao);
            sap.ui.getCore().byId("idBillApp").app.to("idBillUpdateInfoPage", newCaoZuoPiao);
        	var page = sap.ui.getCore().byId("idBillApp").app.getPage("idBillUpdateInfoPage");
    		page.setModel(oModel,"newBillDetailUpdateInfoPage");  
        }
    },
    onUpdateBillInfo:function(){
	    this.onUpdateBillInfoFirst();
        sap.m.MessageBox.alert("修改保存成功",{title: "提示"});

    },
    onCancleBillInfo:function(){
        //重新填充页面
        var newBillDetailUpdateInfoPage = this.getView().getModel("newBillDetailUpdateInfoPage").getData(); 
        var Zczph = newBillDetailUpdateInfoPage.Zczph;
        jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
        var getStorageNew = oStorage.get("ZPMOFFLINE_SRV.BillInfos");
        var newCaoZuoPiao = "";
        if(getStorageNew){
            for(var x=0;x<getStorageNew.length;x++){
                if(getStorageNew[x].Zczph==Zczph){
                    newCaoZuoPiao = getStorageNew[x];
                }
            }
        }
    
        var tableData=[];
        var InfoTab = newCaoZuoPiao.InfoTab;
        if(InfoTab){
            for(var i=0;i<InfoTab.length;i++){
                tableData.push(InfoTab[i]);
            }
            for(var j=0;j<250-InfoTab.length;j++){
                tableData.push({Zxh:"",Zcznr:"",Zzysx:""});
            }
        }
        newCaoZuoPiao.InfoTab=tableData;

        var dangerousPointData=[];
        var DangerousTab = newCaoZuoPiao.DangerousTab;
        if(DangerousTab){
            for(var m=0;m<DangerousTab.length;m++){
                dangerousPointData.push(DangerousTab[m]);
            }
            for(var n=0;n<250-DangerousTab.length;n++){
                dangerousPointData.push({Dangno:"",Zztext:"",Zzremark:"",Zzpltxt:""});
            }
        }
        newCaoZuoPiao.DangerousTab=dangerousPointData;
        var oModel = new sap.ui.model.json.JSONModel(newCaoZuoPiao);
        sap.ui.getCore().byId("idBillApp").app.to("idBillUpdateInfoPage", newCaoZuoPiao);
    	var page = sap.ui.getCore().byId("idBillApp").app.getPage("idBillUpdateInfoPage");
		page.setModel(oModel,"newBillDetailUpdateInfoPage");
        
        // sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");
        // sap.m.MessageBox.alert("取消成功");
    },
    onPrintBillInfo:function(){
        // console.log("显示页面打印操作票");
        var modelData = this.getView().getModel("newBillDetailUpdateInfoPage").getData();
        sap.ui.controller("com.zhenergy.bill.view.BillCreateInfoPage").onPDFPrintCZP(modelData);
    },
    onPrintDangerousPoint:function(){
        // console.log("显示页面打印危险点");
        var modelData = this.getView().getModel("newBillDetailUpdateInfoPage").getData();
        sap.ui.controller("com.zhenergy.bill.view.BillCreateInfoPage").onPDFPrintDangerous(modelData);
    },
    onDeleteInfo:function(oEvent){
        var index = this.onAddDaleteIndex(oEvent);
        var newBillDetailUpdateInfoPage = this.getView().getModel("newBillDetailUpdateInfoPage").getData(); 
        var InfoTab = newBillDetailUpdateInfoPage.InfoTab;
        if(InfoTab.length==1&&index==0){
            sap.m.MessageBox.alert("至少存在一行，无法进行删除",{title: "提示"});
            return;
        }
        Array.prototype.baoremove = function(dx) 
        { 
            if(isNaN(dx)||dx>this.length){return false;} 
            this.splice(dx,1); 
        } 
        InfoTab.baoremove(index);
        //刷新页面
        this.refreshUpdate(newBillDetailUpdateInfoPage); 
    },
    onAddInfo:function(oEvent){
        var index = this.onAddDaleteIndex(oEvent);
        var newBillDetailUpdateInfoPage = this.getView().getModel("newBillDetailUpdateInfoPage").getData(); 
        var InfoTab = newBillDetailUpdateInfoPage.InfoTab;
        //创建需要插入的对象
        var Info = {Zxh:"",Zcznr:"",Zzysx:""};
        Array.prototype.insert = function (index, item) {
            this.splice(index, 0, item);
        };
        InfoTab.insert(index+1, Info); 
        //刷新页面
        this.refreshUpdate(newBillDetailUpdateInfoPage); 
    },
    onAddDangerous:function(oEvent){
        //获取index
        var index = this.onAddDaleteIndex(oEvent);
        var newBillDetailUpdateInfoPage = this.getView().getModel("newBillDetailUpdateInfoPage").getData(); 
        var DangerousTab = newBillDetailUpdateInfoPage.DangerousTab;
        var dangerous = {Dangno:"",Zztext:"",Zzremark:"",Zzpltxt:""};
        Array.prototype.insert = function (index, item) {
            this.splice(index, 0, item);
        };
        DangerousTab.insert(index+1, dangerous);
        this.refreshUpdate(newBillDetailUpdateInfoPage);
    },
    onDeleteDangerous:function(oEvent){
        //获取index
        var index = this.onAddDaleteIndex(oEvent);
        var newBillDetailUpdateInfoPage = this.getView().getModel("newBillDetailUpdateInfoPage").getData(); 
        var DangerousTab = newBillDetailUpdateInfoPage.DangerousTab;
        if(DangerousTab.length==1&&index==0){
            sap.m.MessageBox.alert("至少存在一行，无法进行删除",{title: "提示"});
            return;
        }
        Array.prototype.baoremove = function(dx) 
        { 
            if(isNaN(dx)||dx>this.length){return false;} 
            this.splice(dx,1); 
        }
        DangerousTab.baoremove(index);
        this.refreshUpdate(newBillDetailUpdateInfoPage);
    },
    refreshUpdate:function(models){
       var oModel = new sap.ui.model.json.JSONModel(models);
        sap.ui.getCore().byId("idBillApp").app.to("idBillUpdateInfoPage", models);
        var page = sap.ui.getCore().byId("idBillApp").app.getPage("idBillUpdateInfoPage");
    	page.setModel(oModel,"newBillDetailUpdateInfoPage"); 
    },
    onAddDaleteIndex:function(oEvent){
        var source = oEvent.getSource();
        var sPath = source.oPropagatedProperties.oBindingContexts.newBillDetailUpdateInfoPage.sPath;
        var splits = sPath.split("/");
        var index = parseInt(splits[2]);
        return index;
    }
    

});