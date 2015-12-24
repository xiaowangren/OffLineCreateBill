sap.ui.controller("com.zhenergy.bill.view.BillUpdateInfoPage", {
    onUpdateBillInfo:function(){
	    var newBillDetailUpdateInfoPage = this.getView().getModel("newBillDetailUpdateInfoPage").getData(); 
        var tableData = newBillDetailUpdateInfoPage.InfoTab;
        var BillInfoNew =[];
        for(var i=0;i<tableData.length;i++){
            if((tableData[i].Zzysx.trim()=="")&&(tableData[i].Zxh.trim()=="")&&(tableData[i].Zcznr.trim()=="")){
            }else{
                BillInfoNew.push(tableData[i]); 
            }
        }
        newBillDetailUpdateInfoPage.InfoTab = BillInfoNew;
        var dangerousPointData = newBillDetailUpdateInfoPage.DangerousTab;
        var dangerousPointDataNew = [];
        for(var j=0;j<dangerousPointData.length;j++){
            if((dangerousPointData[j].Dangno.trim()=="")&&(dangerousPointData[j].Zztext.trim()=="")
                &&(dangerousPointData[j].Zzremark.trim()=="")&&(dangerousPointData[j].Zzpltxt.trim()=="")){
            }else{
                dangerousPointDataNew.push(dangerousPointData[j]); 
            }
        }
        newBillDetailUpdateInfoPage.DangerousTab=dangerousPointDataNew;
        //文本更新 
        var Appdepdecs =this.getView().byId("dianQiTianXieBuMen4")._sTypedChars;//填写部门
        var Yxgroupdecs =this.getView().byId("dianQiBanZu4")._sTypedChars;//班组
        var OtypeValues =this.getView().byId("dianQiCaozuoLeiXing4")._sTypedChars;//操作类型
        var ZczfsValues =this.getView().byId("dianQiCaoZuoXingZhi4")._sTypedChars;//操作性质
        var Prtxts =this.getView().byId("dianQiZhuanYe4")._sTypedChars;//专业
        var Rareadecs =this.getView().byId("dianQiYunXingQuYu4")._sTypedChars;//运行区域
        var Untxts =this.getView().byId("dianQiJiZu4")._sTypedChars;//机组
        var Dutxts =this.getView().byId("dianQiZhiBie4")._sTypedChars;//值别
        var Appdepdec="";
        if(Appdepdecs!=undefined){
            Appdepdec = Appdepdecs.split(" ")[1];
        }
        var Yxgroupdec = "";
        if(Yxgroupdecs!=undefined){
            Yxgroupdec= Yxgroupdecs.split(" ")[1];
        }
        var OtypeValue = "";
        if(OtypeValues!=undefined){
            OtypeValue = OtypeValues.split(" ")[1];
        }
        var ZczfsValue = "";
        if(ZczfsValues!=undefined){
            ZczfsValue = ZczfsValues.split(" ")[1];
        }
        var Prtxt = "";
        if(Prtxts!=undefined){
            Prtxt = Prtxts.split(" ")[1];
        }
        var Rareadec="";
        if(Rareadecs!=undefined){
            Rareadec = Rareadecs.split(" ")[1];
        }
        var Untxt="";
        if(Untxts!=undefined){
            Untxt = Untxts.split(" ")[1];
        }
        var Dutxt="";
        if(Dutxts!=undefined){
            Dutxt = Dutxts.split(" ")[1];
        }
        //Appdepdec  填写部门
        //Yxgroupdec 班组
        //OtypeValue 操作类型
        //ZczfsValue 操作性质
        //Prtxt 专业
        //Rareadec 运行区域
        //Untxt 机组
        //Dutxt 值别
        newBillDetailUpdateInfoPage.Appdepdec=Appdepdec;
        newBillDetailUpdateInfoPage.Yxgroupdec=Yxgroupdec;
        newBillDetailUpdateInfoPage.OtypeValue=OtypeValue;
        newBillDetailUpdateInfoPage.ZczfsValue=ZczfsValue;
        newBillDetailUpdateInfoPage.Prtxt=Prtxt;
        newBillDetailUpdateInfoPage.Rareadec=Rareadec;
        newBillDetailUpdateInfoPage.Untxt=Untxt;
        newBillDetailUpdateInfoPage.Dutxt=Dutxt;
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
            //返回上一页，提示成功
            sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");
            sap.m.MessageBox.alert("修改保存成功");
        }

    }
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf com.zhenergy.bill.view.BillUpdateInfoPage
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf com.zhenergy.bill.view.BillUpdateInfoPage
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf com.zhenergy.bill.view.BillUpdateInfoPage
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf com.zhenergy.bill.view.BillUpdateInfoPage
*/
//	onExit: function() {
//
//	}

});