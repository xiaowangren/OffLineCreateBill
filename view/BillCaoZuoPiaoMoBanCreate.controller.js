sap.ui.controller("com.zhenergy.bill.view.BillCaoZuoPiaoMoBanCreate", {
    onFanHui:function(){
        sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");//idBillOverLookPage 
    },
    onCreateBillInfo:function(){
        var newCaoZuoPiaoUpdateMuBan = this.getView().getModel("newCaoZuoPiaoUpdateMuBan").getData(); 
        //校验数据合法性
        if(newCaoZuoPiaoUpdateMuBan.Appdep==""){
            sap.m.MessageBox.alert("填写部门必填",{title: "提示"});
            return;
        }
        if(newCaoZuoPiaoUpdateMuBan.Yxgroup==""){
            sap.m.MessageBox.alert("班组必填",{title: "提示"});
            return;
        }
        if(newCaoZuoPiaoUpdateMuBan.Otype==""){
            sap.m.MessageBox.alert("操作类型必填",{title: "提示"});
            return;
        }
        if(newCaoZuoPiaoUpdateMuBan.Zczfs==""){
            sap.m.MessageBox.alert("操作性质必填",{title: "提示"});
            return;
        }
        if(newCaoZuoPiaoUpdateMuBan.Rarea==""){
            sap.m.MessageBox.alert("运行区域必填",{title: "提示"});
            return;
        }
        if(newCaoZuoPiaoUpdateMuBan.Unity==""){
            sap.m.MessageBox.alert("机组必填",{title: "提示"});
            return;
        }
        if(newCaoZuoPiaoUpdateMuBan.Dunum==""||newCaoZuoPiaoUpdateMuBan.Dunum=="0000"){
            sap.m.MessageBox.alert("值别必填",{title: "提示"});
            return;
        }
        if(newCaoZuoPiaoUpdateMuBan.Cuser.trim()==""){
            sap.m.MessageBox.alert("开票人必填",{title: "提示"});
            return;
        }
        if(newCaoZuoPiaoUpdateMuBan.Ztask.trim()==""){
            sap.m.MessageBox.alert("操作任务必填",{title: "提示"});
            return;
        }
        newCaoZuoPiaoUpdateMuBan.Cuser = newCaoZuoPiaoUpdateMuBan.Cuser.trim().toUpperCase();
        var tableData = newCaoZuoPiaoUpdateMuBan.InfoTab;
        var BillInfoNew =[];
        for(var i=0;i<tableData.length;i++){
            tableData[i].Zxh = ""+tableData[i].Zxh;
            if((tableData[i].Zzysx.trim()=="")&&(tableData[i].Zxh.trim()=="")&&(tableData[i].Zcznr.trim()=="")){
            }else{
                BillInfoNew.push(tableData[i]); 
            }
        }
        newCaoZuoPiaoUpdateMuBan.InfoTab = BillInfoNew;
        var dangerousPointData = newCaoZuoPiaoUpdateMuBan.DangerousTab;
        var dangerousPointDataNew = [];
        for(var j=0;j<dangerousPointData.length;j++){
            if((dangerousPointData[j].Dangno.trim()=="")&&(dangerousPointData[j].Zztext.trim()=="")
                &&(dangerousPointData[j].Zzremark.trim()=="")&&(dangerousPointData[j].Zzpltxt.trim()=="")){
            }else{
                dangerousPointDataNew.push(dangerousPointData[j]); 
            }
        }
        newCaoZuoPiaoUpdateMuBan.DangerousTab=dangerousPointDataNew;
        //生成操作票号
        var LiuShuiId = this.uuid(8,10);
        var Zczph = newCaoZuoPiaoUpdateMuBan.Ztype+"_"+newCaoZuoPiaoUpdateMuBan.Iwerk+"_"+LiuShuiId;
        newCaoZuoPiaoUpdateMuBan.Zczph = Zczph;
        //存入缓存
        jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var getStorage = oStorage.get("ZPMOFFLINE_SRV.BillInfos");
        if(getStorage){
            getStorage.push(newCaoZuoPiaoUpdateMuBan);
            oStorage.put("ZPMOFFLINE_SRV.BillInfos",getStorage);
        }else{
            var dainQiBillIn = [];
            dainQiBillIn.push(newCaoZuoPiaoUpdateMuBan);
            oStorage.put("ZPMOFFLINE_SRV.BillInfos",dainQiBillIn);
        }
        //提示成功
        //sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");
        //根据票号查
        var getStorageNew = oStorage.get("ZPMOFFLINE_SRV.BillInfos");
        var newCaoZuoPiao = "";
        if(getStorageNew){
            for(var x=0;x<getStorageNew.length;x++){
                if(getStorageNew[x].Zczph==Zczph){
                    newCaoZuoPiao = getStorageNew[x];
                }
            }
        }
        // console.log(newCaoZuoPiao);
        newCaoZuoPiao.InfoTab=tableData;
        newCaoZuoPiao.DangerousTab=dangerousPointData;

        var oModel = new sap.ui.model.json.JSONModel(newCaoZuoPiao);
        sap.ui.getCore().byId("idBillApp").app.to("idBillUpdateInfoPage", newCaoZuoPiao);
    	var page = sap.ui.getCore().byId("idBillApp").app.getPage("idBillUpdateInfoPage");
		page.setModel(oModel,"newBillDetailUpdateInfoPage");
        sap.m.MessageBox.alert("保存成功",{title: "提示"});
        
        
    },
    uuid:function(len, radix){
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;
        if (len) {
          for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
        } else {
          var r;
          uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
          uuid[14] = '4';
          for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
              r = 0 | Math.random()*16;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
          }
        }
        return uuid.join('');
    }
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf com.zhenergy.bill.view.BillCaoZuoPiaoMoBanCreate
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf com.zhenergy.bill.view.BillCaoZuoPiaoMoBanCreate
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf com.zhenergy.bill.view.BillCaoZuoPiaoMoBanCreate
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf com.zhenergy.bill.view.BillCaoZuoPiaoMoBanCreate
*/
//	onExit: function() {
//
//	}

});