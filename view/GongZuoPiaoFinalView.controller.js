sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoFinalView", {
    onFanHui:function(){
        sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");
    }


});