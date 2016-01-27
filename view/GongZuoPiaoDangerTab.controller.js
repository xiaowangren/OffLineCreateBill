jQuery.sap.require("jquery.sap.storage");
sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoDangerTab", {
    onInit:function(){
        this.getView().byId("verticalLayOutHeight");
    },
    onAddDangerous:function(oEvent){
        //获取index 
        //sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoInitializePage");
        var index = sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoBaseInfo").onAddDaleteIndex(oEvent);
        var WorkModel = this.getView().getModel("WorkModel").getData(); 
        var DangerTab = WorkModel.DangerTab;
        Array.prototype.insert = function (index, item) {
            this.splice(index, 0, item);
        };
        var DangerElement = DangerTab[index];
        var Dangno="";
        var DangnoBefore = "";
        if(DangerElement.Dangno!=""){
            Dangno = parseInt(DangerElement.Dangno);
        }else{
            for(var g=index;g>=0;g--){
                if(DangerTab[g].Dangno!=0){
                   DangnoBefore =  DangerTab[g].Dangno;
                   break;
                }
            }
            Dangno = parseInt(DangnoBefore);
        } 
        var DangnoNum = Dangno+1;
        var Danger = {Zfxlx:"",Dangno:DangnoNum+"",Dangsnot:"",Zztext:"",Zzremark:"",Zzpltxt:""};
        DangerTab.insert(index+1, Danger);
        this.OnChangeDans();
        // for(var k=index+2;k<DangerTab.length;k++){
        //         if(DangerTab[k].Dangno!=""){
        //             var DangnoInt = parseInt(DangerTab[k].Dangno)+1;
        //             DangerTab[k].Dangno = DangnoInt+"";  
        //         }
                
            
        // }
        // sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoBaseInfo").onrefresh("idGongZuoPiaoFinalView", WorkModel);
    },
    onDeleteDangerous:function(oEvent){
        var index = sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoBaseInfo").onAddDaleteIndex(oEvent);
        var WorkModel = this.getView().getModel("WorkModel").getData(); 
        var DangerTab = WorkModel.DangerTab;
        if(DangerTab.length==1&&index==0){
            sap.m.MessageBox.alert("至少存在一行，无法进行删除",{title: "提示"});
            return;
        }
        var DangerElement = DangerTab[index];
        if(DangerElement.Dangno=="1"&&index==0){
            sap.m.MessageBox.alert("此行无法进行删除",{title: "提示"});
            return;
        }
        // if(DangerElement.Dangno!=""){
        //     for(var k=0;k<DangerTab.length;k++){
        //         if(k<=index){
        //             if(DangerTab[k].Dangno!=""){
        //                 DangerTab[k].Dangno = parseInt(DangerTab[k].Dangno)+"";
        //             }
        //         }else{
        //             if(DangerTab[k].Dangno!=""){
        //                 var DangnoInt = parseInt(DangerTab[k].Dangno)-1;
        //                 DangerTab[k].Dangno = DangnoInt+"";
        //             }
        //         }    
        //     }
        // }
        Array.prototype.baoremove = function(dx) 
        { 
            if(isNaN(dx)||dx>this.length){return false;} 
            this.splice(dx,1); 
        }
        
        DangerTab.baoremove(index);
        this.OnChangeDans();
        // sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoBaseInfo").onrefresh("idGongZuoPiaoFinalView", WorkModel);
    },
    OnChangeDans: function(){
        var WorkModel = this.getView().getModel("WorkModel").getData(); 
        var DangerTab = WorkModel.DangerTab;
        //更新序号
        var AQCSDict={};
        for(var i=0;i<DangerTab.length;i++){
            if(DangerTab[i].Zfxlx){
                if(AQCSDict[DangerTab[i].Zfxlx]){
                    AQCSDict[DangerTab[i].Zfxlx]++
                }else{
                    AQCSDict[DangerTab[i].Zfxlx]=1
                }
                DangerTab[i].Dangno=AQCSDict[DangerTab[i].Zfxlx]+"";
            }

        }
        this.onrefresh("idGongZuoPiaoFinalView", WorkModel);
    },
    onAddDaleteIndex:function(oEvent){
        var source = oEvent.getSource();
        var sPath = source.oPropagatedProperties.oBindingContexts.WorkModel.sPath;
        var splits = sPath.split("/");
        var index = parseInt(splits[2]);
        return index;
    },
    onrefresh:function(pageId,model){
        var oModel = new sap.ui.model.json.JSONModel(model);
        sap.ui.getCore().byId("idBillApp").app.to(pageId, model);
        var page = sap.ui.getCore().byId("idBillApp").app.getPage(pageId);
    	page.setModel(oModel,"WorkModel"); 
    },
    onSelect:function(oEvent){
        //获取index
        var index = this.onAddDaleteIndex(oEvent);
        var WorkModel = this.getView().getModel("WorkModel").getData(); 
        var DangerTab = WorkModel.DangerTab;
         
        //更新序号
        var AQCSDict={};
        for(var i=0;i<DangerTab.length;i++){
            if(DangerTab[i].Zfxlx){
                if(AQCSDict[DangerTab[i].Zfxlx]){
                    AQCSDict[DangerTab[i].Zfxlx]++
                }else{
                    AQCSDict[DangerTab[i].Zfxlx]=1
                }
                DangerTab[i].Dangno=AQCSDict[DangerTab[i].Zfxlx]+"";
            }

        }
        this.onrefresh("idGongZuoPiaoFinalView", WorkModel);
    }
    // onChangeDangno:function(oEvent){
    //     var WorkModel = this.getView().getModel("WorkModel").getData(); 
    //     var DangerTab = WorkModel.DangerTab;
    //     var sPath = oEvent.getSource().oParent.oBindingContexts.WorkModel.sPath;
    //     var splits = sPath.split("/");
    //     var index = parseInt(splits[2]);
    //     for(var k=0;k<DangerTab.length;k++){
    //         if(k<=index&&DangerTab[k].Dangno!=""){
    //             DangerTab[k].Dangno = parseInt(DangerTab[k].Dangno)+"";
    //         }else{
    //             if(DangerTab[k].Dangno!=""){
    //                 var DangnoInt = parseInt(DangerTab[k].Dangno)-1;
    //                 DangerTab[k].Dangno = DangnoInt+"";
    //             } 
    //         }    
    //     }
    // }

});