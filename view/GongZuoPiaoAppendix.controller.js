jQuery.sap.require("jquery.sap.storage");
jQuery.sap.require("com.zhenergy.bill.util.SearchKKS");
jQuery.sap.require("com.zhenergy.bill.util.Formatter");
sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoAppendix", {
    
    onInit: function(){
/*        var oModel= new sap.ui.model.json.JSONModel();
        oModel.setData({KksTab:[{Seqc:"1",Tplnr:"2081"},{Seqc:"2",Tplnr:"2081-40HTF14AA401"}]})
        this.getView().byId("idKKSTab").setModel(oModel);*/
    },
    
    onAddKKS: function(evt){
        //开始搜索KKS
		com.zhenergy.bill.util.SearchKKS.open(
			null,
			jQuery.proxy(this.onFinishAddKKS, this)
		);
    },
	onFinishAddKKS: function(oResult) {
	    /*
    	    搜索完范围选中的KKS结果:
            {
            	"Tplnr": "2081-40HTF14AP001",
            	"Pltxt": "#4D吸收塔再循环泵"
            }
            处理选中的KKS
	    */
        console.log(oResult);
	},
    onDeleteKKS:function(evt){
        alert("删除行")
    },
    
});