sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoFinalView", {
    onFanHui:function(){
        sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");
    },
    onSubmit:function(){
        var WorkModel = this.getView().getModel("WorkModel").getData(); 
        //删除多余的元素
        WorkModel = this.onDeleteElement(WorkModel);
        
        console.log(WorkModel);
    },
    onDeleteElement:function(WorkModel){
        delete WorkModel["WorkType"];
        delete WorkModel["BanZu"];
        delete WorkModel["BuMen"];
        delete WorkModel["DanWei"];
        delete WorkModel["JiZu"];
        delete WorkModel["Title1"];
        delete WorkModel["Title2"];
        delete WorkModel["WERKS"];
        delete WorkModel["YunXingQuYu"];
        delete WorkModel["ZPMTOPER"];
        delete WorkModel["Editable"];
        return WorkModel;
    }


});