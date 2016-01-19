sap.ui.controller("com.zhenergy.bill.view.GongzuoPiaoQueryPage", {
    onFanHui:function(){
        sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");
    },
    onChangeWorkType:function(oEvent){
        var key = oEvent.getParameters().selectedItem.mProperties.key;
        if(key!=""){
            this.getView().byId("Peoid").setSelectedKey("");
            jQuery.sap.require("jquery.sap.storage");
            var oLocalModel = sap.ui.getCore().getModel();
		    var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		    if (oStorage.get("ZPMOFFLINE_SRV.ZPMTPEOQUALI")) {
        		var oDataPer = oStorage.get("ZPMOFFLINE_SRV.ZPMTPEOQUALI");
        		var aFilterPer = [];
    			for(var l=0;l<oDataPer.length;l++){
    			    if(oDataPer[l].Ztype==key&&oDataPer[l].Quaid=="A"){
    			        aFilterPer.push(oDataPer[l]);
    			    }
    			}
    			oLocalModel.setProperty("/ZPMTOPER",aFilterPer);
        	}
		    
        }
        
    },
    onCaoZuoPiaoQuery:function(){
        //收集桌面数据
        var BiaoJiQuery = this.getView().byId("BiaoJiQuery").getText();
        var Iwerk = this.getView().byId("gongChangQuery").getSelectedKey();
        var idWorkType = this.getView().byId("idWorkType").getSelectedKey();
        var Peoid = this.getView().byId("Peoid").getSelectedKey();
        var Appdep = this.getView().byId("Appdep").getSelectedKey();
        var gongZuoDiDian = this.getView().byId("gongZuoDiDian").getValue();
        var gongZuoNeiRong = this.getView().byId("gongZuoNeiRong").getValue();
        var createDate = this.getView().byId("createDate").getYyyymmdd();
        if(createDate!=""){
            createDate = createDate.substr(0,4)+"-"+createDate.substr(4,2)+"-"+createDate.substr(6,2);
        }
        if("Create"==BiaoJiQuery){//过滤典型票
            
        }else{//过滤本地已经创建的票
            
        }
        console.log(BiaoJiQuery+";"+Iwerk+";"+idWorkType+";"+Peoid+";"+Appdep+";"+gongZuoDiDian+";"+gongZuoNeiRong+";"+createDate);
        alert("调用getWay，返回结果在result页面展示");
    }
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf com.zhenergy.bill.view.GongzuoPiaoQueryPage
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf com.zhenergy.bill.view.GongzuoPiaoQueryPage
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf com.zhenergy.bill.view.GongzuoPiaoQueryPage
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf com.zhenergy.bill.view.GongzuoPiaoQueryPage
*/
//	onExit: function() {
//
//	}

});