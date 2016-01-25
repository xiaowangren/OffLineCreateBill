jQuery.sap.require("jquery.sap.storage");


jQuery.sap.declare("com.zhenergy.bill.util.Formatter");
com.zhenergy.bill.util.Formatter = {
    
    KKSText: function(Tplnr){
        var Pltxt="";
        var KKSData;
        var oDataPer;
        var oJsonModelKKS = new sap.ui.model.json.JSONModel();
        //load data from cache if any
        KKSData=sap.ui.getCore().getModel("KKSData");
        if(!KKSData){
            var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
            if (oStorage.get("ZPMOFFLINE_SRV.KKS")) {
            	var oDataKKS = oStorage.get("ZPMOFFLINE_SRV.KKS");
            	oJsonModelKKS.setData(oDataKKS)
            }else{
                oJsonModelKKS.setData([])
            }
            KKSData=oJsonModelKKS;
            sap.ui.getCore().setModel(oJsonModelKKS,"KKSData");
        }
        oDataPer=KKSData.getProperty("/");
        for(var i=0;i<oDataPer.length;i++){
            if(oDataPer[i].Tplnr==Tplnr){
                console.log(oDataPer[i].Tplnr);
                Pltxt=oDataPer[i].Pltxt;
                break;
            }
        }
        return Pltxt;
    }
}