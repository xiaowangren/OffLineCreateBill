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
        if(newCaoZuoPiaoUpdateMuBan.Cuser==undefined||newCaoZuoPiaoUpdateMuBan.Cuser.trim()==""){
            sap.m.MessageBox.alert("开票人账号必填",{title: "提示"});
            return;
        }
        if(newCaoZuoPiaoUpdateMuBan.CreateName==undefined||newCaoZuoPiaoUpdateMuBan.CreateName.trim()==""){
            sap.m.MessageBox.alert("开票人姓名必填",{title: "提示"});
            return;
        }
        if(newCaoZuoPiaoUpdateMuBan.Ztask==undefined||newCaoZuoPiaoUpdateMuBan.Ztask.trim()==""){
            sap.m.MessageBox.alert("操作任务必填",{title: "提示"});
            return;
        }
        newCaoZuoPiaoUpdateMuBan.Cuser = newCaoZuoPiaoUpdateMuBan.Cuser.trim().toUpperCase();
        var tableData = newCaoZuoPiaoUpdateMuBan.InfoTab;
        var BillInfoNew =[];
        for(var i=0;i<tableData.length;i++){
            tableData[i].Zxh = ""+tableData[i].Zxh;

            if((tableData[i].Zzysx.trim()=="")&&(tableData[i].Zxh=="")&&(tableData[i].Zcznr.trim()=="")){

            }else{
                BillInfoNew.push(tableData[i]); 
            }

        }
        newCaoZuoPiaoUpdateMuBan.InfoTab = BillInfoNew;
        var dangerousPointData = newCaoZuoPiaoUpdateMuBan.DangerousTab;
        var dangerousPointDataNew = [];
        for(var j=0;j<dangerousPointData.length;j++){
            if((dangerousPointData[j].Dangno=="")&&(dangerousPointData[j].Zztext.trim()=="")
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
        // newCaoZuoPiao.InfoTab=tableData;
        // newCaoZuoPiao.DangerousTab=dangerousPointData;

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
    },
    onAddInfo:function(oEvent){
        //获取index
        var index = this.onAddDaleteIndex(oEvent);
        var newCaoZuoPiaoUpdateMuBan = this.getView().getModel("newCaoZuoPiaoUpdateMuBan").getData(); 
        var InfoTab = newCaoZuoPiaoUpdateMuBan.InfoTab;
        Array.prototype.insert = function (index, item) {
            this.splice(index, 0, item);
        };
        var InfoElement = InfoTab[index];
        var Zxh="";
        var ZxhBefore = "";
        if(InfoElement.Zxh!=""){
            Zxh = parseInt(InfoElement.Zxh);
        }else{
            for(var g=index;g>=0;g--){
                if(InfoTab[g].Zxh!=0){
                   ZxhBefore =  InfoTab[g].Zxh;
                   break;
                }
            }
            Zxh = parseInt(ZxhBefore);
        }  
        var Info = {Zxh:Zxh+1,Zcznr:"",Zzysx:""};
        InfoTab.insert(index+1, Info);
        for(var k=index+2;k<InfoTab.length;k++){
                if(InfoTab[k].Zxh!=""){
                    var ZxhInt = parseInt(InfoTab[k].Zxh)+1;
                    InfoTab[k].Zxh = ZxhInt+"";  
                }
        }
        this.onrefresh("idBillCaoZuoPiaoMoBanCreate", newCaoZuoPiaoUpdateMuBan);
    },
    onDeleteInfo:function(oEvent){
        //获取index
        var index = this.onAddDaleteIndex(oEvent);
        var newCaoZuoPiaoUpdateMuBan = this.getView().getModel("newCaoZuoPiaoUpdateMuBan").getData(); 
        var InfoTab = newCaoZuoPiaoUpdateMuBan.InfoTab;
        if(InfoTab.length==1&&index==0){
            sap.m.MessageBox.alert("至少存在一行，无法进行删除",{title: "提示"});
            return;
        }
        var InfoElement = InfoTab[index];
        if(InfoElement.Zxh!=""){
            for(var k=0;k<InfoTab.length;k++){
                if(k<=index){
                    if(InfoTab[k].Zxh!=""){
                        InfoTab[k].Zxh = parseInt(InfoTab[k].Zxh)+"";
                    }
                }else{
                    if(InfoTab[k].Zxh!=""){
                        var ZxhInt = parseInt(InfoTab[k].Zxh)-1;
                        InfoTab[k].Zxh = ZxhInt+"";
                    }
                }    
            }
        }
        Array.prototype.baoremove = function(dx) 
        { 
            if(isNaN(dx)||dx>this.length){return false;} 
            this.splice(dx,1); 
        }
        InfoTab.baoremove(index);
        this.onrefresh("idBillCaoZuoPiaoMoBanCreate", newCaoZuoPiaoUpdateMuBan);
    },
    onAddDangerous:function(oEvent){
        //获取index
        var index = this.onAddDaleteIndex(oEvent);
        var newCaoZuoPiaoUpdateMuBan = this.getView().getModel("newCaoZuoPiaoUpdateMuBan").getData(); 
        var DangerousTab = newCaoZuoPiaoUpdateMuBan.DangerousTab;
        Array.prototype.insert = function (index, item) {
            this.splice(index, 0, item);
        };
        var DangerousElement = DangerousTab[index];
        var Dangno="";
        var DangnoBefore = "";
        if(DangerousElement.Dangno!=""){
            Dangno = parseInt(DangerousElement.Dangno);
        }else{
            for(var g=index;g>=0;g--){
                if(DangerousTab[g].Dangno!=0){
                   DangnoBefore =  DangerousTab[g].Dangno;
                   break;
                }
            }
            Dangno = parseInt(DangnoBefore);
        }
        // var dangerous = {Dangno:Dangno+1,Zztext:"",Zzremark:"",Zzpltxt:""};   //louweiwei 20160121
        var dangerous = {Dangno:(Dangno+1)+"",Zztext:"",Zzremark:"",Zzpltxt:""};
        DangerousTab.insert(index+1, dangerous);
        for(var k=index+2;k<DangerousTab.length;k++){
            if(DangerousTab[k].Dangno!=""){
                var DangnoInt = parseInt(DangerousTab[k].Dangno)+1;
                DangerousTab[k].Dangno = DangnoInt+"";
            }
            
        }
        this.onrefresh("idBillCaoZuoPiaoMoBanCreate", newCaoZuoPiaoUpdateMuBan);
    },
    onDeleteDangerous:function(oEvent){
        //获取index
        var index = this.onAddDaleteIndex(oEvent);
        var newCaoZuoPiaoUpdateMuBan = this.getView().getModel("newCaoZuoPiaoUpdateMuBan").getData(); 
        var DangerousTab = newCaoZuoPiaoUpdateMuBan.DangerousTab;
        if(DangerousTab.length==1&&index==0){
            sap.m.MessageBox.alert("至少存在一行，无法进行删除",{title: "提示"});
            return;
        }
        var DangerousElement = DangerousTab[index];
        if(DangerousElement.Dangno!=""){
            for(var k=0;k<DangerousTab.length;k++){
                if(k<=index){
                    if(DangerousTab[k].Dangno!=""){
                        DangerousTab[k].Dangno = parseInt(DangerousTab[k].Dangno)+"";
                    }
                }else{
                    if(DangerousTab[k].Dangno!=""){
                        var DangnoInt = parseInt(DangerousTab[k].Dangno)-1;
                        DangerousTab[k].Dangno = DangnoInt+"";
                    }
                }    
            }
        }
        Array.prototype.baoremove = function(dx) 
        { 
            if(isNaN(dx)||dx>this.length){return false;} 
            this.splice(dx,1); 
        }
        DangerousTab.baoremove(index);
        this.onrefresh("idBillCaoZuoPiaoMoBanCreate", newCaoZuoPiaoUpdateMuBan);
    },
    onAddDaleteIndex:function(oEvent){
        var source = oEvent.getSource();
        var sPath = source.oPropagatedProperties.oBindingContexts.newCaoZuoPiaoUpdateMuBan.sPath;
        var splits = sPath.split("/");
        var index = parseInt(splits[2]);
        return index;
    },
    onrefresh:function(pageId,model){
        var oModel = new sap.ui.model.json.JSONModel(model);
        sap.ui.getCore().byId("idBillApp").app.to(pageId, model);
        var page = sap.ui.getCore().byId("idBillApp").app.getPage(pageId);
    	page.setModel(oModel,"newCaoZuoPiaoUpdateMuBan"); 
    },
    onChangeZxh:function(oEvent){
        var newCaoZuoPiaoUpdateMuBan = this.getView().getModel("newCaoZuoPiaoUpdateMuBan").getData(); 
        var InfoTab = newCaoZuoPiaoUpdateMuBan.InfoTab;
        var sPath = oEvent.getSource().oParent.oBindingContexts.newCaoZuoPiaoUpdateMuBan.sPath;
        var splits = sPath.split("/");
        var index = parseInt(splits[2]);
        for(var k=0;k<InfoTab.length;k++){
            if(k<=index&&InfoTab[k].Zxh!=""){
                InfoTab[k].Zxh = parseInt(InfoTab[k].Zxh)+"";
            }else{
                if(InfoTab[k].Zxh!=""){
                    var ZxhInt = parseInt(InfoTab[k].Zxh)-1;
                    InfoTab[k].Zxh = ZxhInt+"";
                } 
            }    
        }
    },
    onChangeDangno:function(oEvent){
        var newCaoZuoPiaoUpdateMuBan = this.getView().getModel("newCaoZuoPiaoUpdateMuBan").getData(); 
        var DangerousTab = newCaoZuoPiaoUpdateMuBan.DangerousTab;
        var sPath = oEvent.getSource().oParent.oBindingContexts.newCaoZuoPiaoUpdateMuBan.sPath;
        var splits = sPath.split("/");
        var index = parseInt(splits[2]);
        for(var k=0;k<DangerousTab.length;k++){
            if(k<=index&&DangerousTab[k].Dangno!=""){
                DangerousTab[k].Dangno = parseInt(DangerousTab[k].Dangno)+"";
            }else{
                if(DangerousTab[k].Dangno!=""){
                    var DangnoInt = parseInt(DangerousTab[k].Dangno)-1;
                    DangerousTab[k].Dangno = DangnoInt+"";
                } 
            }    
        }
       
    }

});