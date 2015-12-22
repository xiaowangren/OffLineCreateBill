sap.ui.controller("com.zhenergy.bill.view.BillCaoZuoPiaoQuery", {
    onCaoZuoPiaoQuery1:function(){
        //获取页面数据
        var gongChangQuery = this.getView().byId("gongChangQuery").getValue();//工厂
        var caoZuoPiaoLeiXingQuery = this.getView().byId("caoZuoPiaoLeiXingQuery").getValue();//操作票类型
        var zhuangTaiQueryStart = this.getView().byId("zhuangTaiQuery1").getSelectedKey();//状态
        var tianXieBuMenQueryStart = this.getView().byId("tianXieBuMenQuery1").getSelectedKey();//填写部门
        var zhuanYeQueryStart = this.getView().byId("zhuanYeQuery1").getSelectedKey();//专业
        var jiZuQueryStart = this.getView().byId("jiZuQuery1").getSelectedKey();//机组
        var banZuQueryStart = this.getView().byId("banZuQuery1").getSelectedKey();//班组
        var kaiPiaoRenQuery = this.getView().byId("kaiPiaoRenQuery").getValue();//开票人
        var caoZuoRenWuQuery = this.getView().byId("caoZuoRenWuQuery").getValue();//操作任务
        console.log(gongChangQuery+"=="+caoZuoPiaoLeiXingQuery+"--"+caoZuoHaoBianHaoStart+"=="+caoZuoHaoBianHaoEnd);
        //获取本地的数据，进行查询
        var abc=["0001","0002","0003","0004","0005","0006"];
        var localStorageNew = [{a:'1'},{b:'2'}];
        //筛选数据
        for(var i=0;i<abc.length;i++){
            if((abc[i]>=jiZuQueryStart&&abc[i]<=jiZuQueryEnd)){
                localStorageNew.push(abc[i]);
            }
        }
        //转换时间
	    var now = new Date();
		var year = now.getFullYear(); 
        var month =(now.getMonth() + 1).toString(); 
        var day = (now.getDate()).toString(); 
        if (month.length == 1) { 
            month = "0" + month; 
        } 
        if (day.length == 1) { 
            day = "0" + day; 
        } 
        var Begda = year+"年" + month +"月"+  day +"日";
        //跳转至查询结果页面
        var queryResultModel = new sap.ui.model.json.JSONModel();
        queryResultModel.setProperty("/queryResultModel",localStorageNew);
        queryResultModel.setProperty("/queryResultModelCount",localStorageNew.length);
        queryResultModel.setProperty("/queryResultModelDate",Begda);
        sap.ui.getCore().setModel(queryResultModel);
        sap.ui.getCore().byId("idBillApp").app.to("idBillCaoZuoPiaoQueryResult");

        

    }
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf com.zhenergy.bill.view.BillCaoZuoPiaoQuery
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf com.zhenergy.bill.view.BillCaoZuoPiaoQuery
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf com.zhenergy.bill.view.BillCaoZuoPiaoQuery
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf com.zhenergy.bill.view.BillCaoZuoPiaoQuery
*/
//	onExit: function() {
//
//	}

});