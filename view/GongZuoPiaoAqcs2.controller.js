jQuery.sap.require("jquery.sap.storage");

sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoAqcs2", {
    onSelect:function(oEvent){
        //获取index
        var index = this.onAddDaleteIndex(oEvent);
        var WorkModel = this.getView().getModel("WorkModel").getData(); 
        var GroupTab = WorkModel.AqcsTabY;
        //更新 Katalogart及 Codegruppe
        GroupTab[index].Katalogart="Y";
        GroupTab[index].Codegruppe=GroupTab[index].Code.substring(0,6);
         
        //更新序号
        var AQCSDict={};
        for(var i=0;i<GroupTab.length;i++){
            if(GroupTab[i].Code){
                if(AQCSDict[GroupTab[i].Code]){
                    AQCSDict[GroupTab[i].Code]++
                }else{
                    AQCSDict[GroupTab[i].Code]=1
                }
                GroupTab[i].Seqc=AQCSDict[GroupTab[i].Code]+"";
            }

        }
        console.log(WorkModel);
        this.onrefresh("idGongZuoPiaoFinalView", WorkModel);
    },
    OnChangeAqcs: function(){
        var WorkModel = this.getView().getModel("WorkModel").getData(); 
        var GroupTab = WorkModel.AqcsTabY;
        //更新序号
        var AQCSDict={};
        for(var i=0;i<GroupTab.length;i++){
            if(GroupTab[i].Code){
                if(AQCSDict[GroupTab[i].Code]){
                    AQCSDict[GroupTab[i].Code]++
                }else{
                    AQCSDict[GroupTab[i].Code]=1
                }
                GroupTab[i].Seqc=AQCSDict[GroupTab[i].Code]+"";
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
    onAddAqcs: function(oEvent){
        //获取index
        var index = this.onAddDaleteIndex(oEvent);
        var WorkModel = this.getView().getModel("WorkModel").getData(); 
        var GroupTab = WorkModel.AqcsTabY;
        Array.prototype.insert = function (index, item) {
            this.splice(index, 0, item);
        };
        var GroupElement = GroupTab[index];
        var Seqc="";
        var SeqcBefore = "";
        if(GroupElement.Seqc!=""){
            Seqc = parseInt(GroupElement.Seqc);
        }else{
            for(var g=index;g>=0;g--){
                if(GroupTab[g].Seqc!=0){
                   SeqcBefore =  GroupTab[g].Seqc;
                   break;
                }
            }
            Seqc = parseInt(SeqcBefore);
        }
        var Group = {Seqc:Seqc+1+""};
        var AQCSDataY= sap.ui.getCore().getModel("AQCSDataY").getData();        
        if(AQCSDataY){
                    if(AQCSDataY.length>0){
                        Group.Codegruppe=AQCSDataY[0].Codegruppe;
                        Group.Katalogart="Y"
                    }
                }
        GroupTab.insert(index+1, Group);
        this.OnChangeAqcs();
        //this.onrefresh("idGongZuoPiaoFinalView", WorkModel);
    },
    onDeleteAqcs: function(oEvent){
        //获取index
        var index = this.onAddDaleteIndex(oEvent);
        var WorkModel = this.getView().getModel("WorkModel").getData(); 
        var GroupTab = WorkModel.AqcsTabY;
        if(GroupTab.length==1&&index==0){
            sap.m.MessageBox.alert("至少存在一行，无法进行删除",{title: "提示"});
            return;
        }
        var GroupElement = GroupTab[index];
        if(GroupElement.Seqc=="1"&&index==0){
            sap.m.MessageBox.alert("此行无法进行删除",{title: "提示"});
            return;
        }
/*        if(GroupElement.Seqc!=""){
            for(var k=0;k<GroupTab.length;k++){
                if(k<=index){
                    if(GroupTab[k].Seqc!=""){
                        GroupTab[k].Seqc = parseInt(GroupTab[k].Seqc)+"";
                    }
                }else{
                    if(GroupTab[k].Seqc!=""){
                        var SeqcInt = parseInt(GroupTab[k].Seqc)-1;
                        GroupTab[k].Seqc = SeqcInt+"";
                    }
                }    
            }
        }*/
        Array.prototype.baoremove = function(dx) 
        { 
            if(isNaN(dx)||dx>this.length){return false;} 
            this.splice(dx,1); 
        }
        
        GroupTab.baoremove(index);
        this.OnChangeAqcs();
        //this.onrefresh("idGongZuoPiaoFinalView", WorkModel);
    },
});