sap.ui.controller("com.zhenergy.bill.view.BillUpdateInfoPage", {
    onFanHui:function(){
       sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage"); 
    },
    onUpdateBillInfo:function(){
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
        // //文本更新 
        // var Appdepdecs =this.getView().byId("dianQiTianXieBuMen4")._sTypedChars;//填写部门
        // var Yxgroupdecs =this.getView().byId("dianQiBanZu4")._sTypedChars;//班组
        // var OtypeValues =this.getView().byId("dianQiCaozuoLeiXing4")._sTypedChars;//操作类型
        // var ZczfsValues =this.getView().byId("dianQiCaoZuoXingZhi4")._sTypedChars;//操作性质
        // var Prtxts =this.getView().byId("dianQiZhuanYe4")._sTypedChars;//专业
        // var Rareadecs =this.getView().byId("dianQiYunXingQuYu4")._sTypedChars;//运行区域
        // var Untxts =this.getView().byId("dianQiJiZu4")._sTypedChars;//机组
        // var Dutxts =this.getView().byId("dianQiZhiBie4")._sTypedChars;//值别
        // var Appdepdec="";
        // if(Appdepdecs!=undefined){
        //     Appdepdec = Appdepdecs.split(" ")[1];
        // }
        // var Yxgroupdec = "";
        // if(Yxgroupdecs!=undefined){
        //     Yxgroupdec= Yxgroupdecs.split(" ")[1];
        // }
        // var OtypeValue = "";
        // if(OtypeValues!=undefined){
        //     OtypeValue = OtypeValues.split(" ")[1];
        // }
        // var ZczfsValue = "";
        // if(ZczfsValues!=undefined){
        //     ZczfsValue = ZczfsValues.split(" ")[1];
        // }
        // var Prtxt = "";
        // if(Prtxts!=undefined){
        //     Prtxt = Prtxts.split(" ")[1];
        // }
        // var Rareadec="";
        // if(Rareadecs!=undefined){
        //     Rareadec = Rareadecs.split(" ")[1];
        // }
        // var Untxt="";
        // if(Untxts!=undefined){
        //     Untxt = Untxts.split(" ")[1];
        // }
        // var Dutxt="";
        // if(Dutxts!=undefined){
        //     Dutxt = Dutxts.split(" ")[1];
        // }
        //Appdepdec  填写部门
        //Yxgroupdec 班组
        //OtypeValue 操作类型
        //ZczfsValue 操作性质
        //Prtxt 专业
        //Rareadec 运行区域
        //Untxt 机组
        //Dutxt 值别
        // newBillDetailUpdateInfoPage.Appdepdec=Appdepdec;
        // newBillDetailUpdateInfoPage.Yxgroupdec=Yxgroupdec;
        // newBillDetailUpdateInfoPage.OtypeValue=OtypeValue;
        // newBillDetailUpdateInfoPage.ZczfsValue=ZczfsValue;
        // newBillDetailUpdateInfoPage.Prtxt=Prtxt;
        // newBillDetailUpdateInfoPage.Rareadec=Rareadec;
        // newBillDetailUpdateInfoPage.Untxt=Untxt;
        // newBillDetailUpdateInfoPage.Dutxt=Dutxt;
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
            
            // var InfoTabLength = newBillDetailUpdateInfoPage.InfoTab.length;
            // if(InfoTabLength<250){
            //     var InfoTabNews = [];
            // 	for(var q=0;q<InfoTabLength;q++){
            // 		   InfoTabNews.push(newBillDetailUpdateInfoPage.InfoTab[q]);
            // 	}
            // 	for(var w=0;w<250-InfoTabLength;w++){
            // 		   InfoTabNews.push({Zxh:"",Zcznr:"",Zzysx:""});
            // 	}
            // 	newCaoZuoPiao.InfoTab=InfoTabNews;
            // }
            
            // var DangerousTabLength = newBillDetailUpdateInfoPage.DangerousTab.length;
            // if(DangerousTabLength<250){
            //     var DangerousTabNews = [];
            // 	for(var e=0;e<DangerousTabLength;e++){
            // 		   DangerousTabNews.push(newBillDetailUpdateInfoPage.DangerousTab[e]);
            // 	}
            // 	for(var r=0;r<250-InfoTabLength;r++){
            // 		   DangerousTabNews.push({Dangno:"",Zztext:"",Zzremark:"",Zzpltxt:""});
            // 	}
            // 	newCaoZuoPiao.DangerousTab=DangerousTabNews;
            // }
            newCaoZuoPiao.InfoTab=tableData;
            newCaoZuoPiao.DangerousTab=dangerousPointData;
            var oModel = new sap.ui.model.json.JSONModel(newCaoZuoPiao);
            sap.ui.getCore().byId("idBillApp").app.to("idBillUpdateInfoPage", newCaoZuoPiao);
        	var page = sap.ui.getCore().byId("idBillApp").app.getPage("idBillUpdateInfoPage");
    		page.setModel(oModel,"newBillDetailUpdateInfoPage");
            sap.m.MessageBox.alert("修改保存成功",{title: "提示"});
        }

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
    }


});