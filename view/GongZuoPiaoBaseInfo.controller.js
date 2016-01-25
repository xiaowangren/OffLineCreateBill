sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoBaseInfo", {
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
    onAddRow:function(oEvent){
        //获取index
        var index = this.onAddDaleteIndex(oEvent);
        var WorkModel = this.getView().getModel("WorkModel").getData(); 
        var GroupTab = WorkModel.GroupTab;
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
        var Group = {Seqc:Seqc+1,Pname:"",Opsno:""};
        GroupTab.insert(index+1, Group);
        for(var k=index+2;k<GroupTab.length;k++){
                if(GroupTab[k].Seqc!=""){
                    var SeqcInt = parseInt(GroupTab[k].Seqc)+1;
                    GroupTab[k].Seqc = SeqcInt+"";  
                }
                
            
        }
        this.onrefresh("idGongZuoPiaoFinalView", WorkModel);
    },
    onDeleteRow:function(oEvent){
        //获取index
        var index = this.onAddDaleteIndex(oEvent);
        var WorkModel = this.getView().getModel("WorkModel").getData(); 
        var GroupTab = WorkModel.GroupTab;
        if(GroupTab.length==1&&index==0){
            sap.m.MessageBox.alert("至少存在一行，无法进行删除",{title: "提示"});
            return;
        }
        var GroupElement = GroupTab[index];
        if(GroupElement.Seqc=="1"&&index==0){
            sap.m.MessageBox.alert("此行无法进行删除",{title: "提示"});
            return;
        }
        if(GroupElement.Seqc!=""){
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
        }
        Array.prototype.baoremove = function(dx) 
        { 
            if(isNaN(dx)||dx>this.length){return false;} 
            this.splice(dx,1); 
        }
        
        GroupTab.baoremove(index);
        this.onrefresh("idGongZuoPiaoFinalView", WorkModel);
    },
    onChangeSeqc:function(oEvent){
        var WorkModel = this.getView().getModel("WorkModel").getData(); 
        var GroupTab = WorkModel.GroupTab;
        var sPath = oEvent.getSource().oParent.oBindingContexts.WorkModel.sPath;
        var splits = sPath.split("/");
        var index = parseInt(splits[2]);
        for(var k=0;k<GroupTab.length;k++){
            if(k<=index&&GroupTab[k].Seqc!=""){
                GroupTab[k].Seqc = parseInt(GroupTab[k].Seqc)+"";
            }else{
                if(GroupTab[k].Seqc!=""){
                    var SeqcInt = parseInt(GroupTab[k].Seqc)-1;
                    GroupTab[k].Seqc = SeqcInt+"";
                } 
            }    
        }
    },
    onAddKKS: function(evt){
        
        //开始搜索KKS
		com.zhenergy.bill.util.SearchKKS.open(
			null,
			jQuery.proxy(this.onFinishAddKKS, this)
		);
    },
	onFinishAddKKS: function(oResult) {
	    var TplnrId = this.getView().byId("TplnrId");
	    /*
    	    搜索完范围选中的KKS结果:
            {
            	"Tplnr": "2081-40HTF14AP001",
            	"Pltxt": "#4D吸收塔再循环泵"
            }
            处理选中的KKS
	    */
        // console.log(oResult);
        TplnrId.setValue(oResult.Tplnr);
	}
});