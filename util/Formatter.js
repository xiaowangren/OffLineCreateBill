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
        //using local storage
        // if(!KKSData){
        //     var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
        //     if (oStorage.get("ZPMOFFLINE_SRV.KKS")) {
        //     	var oDataKKS = oStorage.get("ZPMOFFLINE_SRV.KKS");
        //     	oJsonModelKKS.setData(oDataKKS)
        //     }else{
        //         oJsonModelKKS.setData([])
        //     }
        //     KKSData=oJsonModelKKS;
        //     sap.ui.getCore().setModel(oJsonModelKKS,"KKSData");
        // }

        //using indexed DB
 		//初始化KKS编码列表
		if(!KKSData){
            sap.ui.controller("com.zhenergy.bill.view.BillOverLookPage").onReadKKSIDB(function(items){
                var oJsonModelKKS = new sap.ui.model.json.JSONModel();
                oJsonModelKKS.setData(items);
                sap.ui.getCore().setModel(oJsonModelKKS,"KKSData");
                KKSData=oJsonModelKKS;
                for(var i=0;i<items.length;i++){
                    if(oDataPer[i].Tplnr==Tplnr){
                        Pltxt=oDataPer[i].Pltxt;
                        break;
                    }
                }
                return Pltxt;
            });
		}
        oDataPer=KKSData.getProperty("/");
        for(var i=0;i<oDataPer.length;i++){
            if(oDataPer[i].Tplnr==Tplnr){
                Pltxt=oDataPer[i].Pltxt;
                break;
            }
        }
        return Pltxt;
    },
    ZsfjdVisible: function(Ztype){
        var bVisible=false;
        if(Ztype=="DCC"||Ztype=="DQ1"||Ztype=="DQ2"||Ztype=="JBP"){
            bVisible=true;
        }
        return bVisible;
    },
}