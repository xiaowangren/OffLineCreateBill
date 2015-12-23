sap.ui.jsview("com.zhenergy.bill.view.BillCaoZuoPiaoQueryResult", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf com.zhenergy.bill.view.BillCaoZuoPiaoQueryResult
	*/ 
	getControllerName : function() {
		return "com.zhenergy.bill.view.BillCaoZuoPiaoQueryResult";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf com.zhenergy.bill.view.BillCaoZuoPiaoQueryResult
	*/ 
	createContent : function(oController) {
	    
	    var oTable2 = new sap.ui.table.Table({
	        id:"caoZuoPiaoQueryResult",
	        title: "操作票查询:共"+"{/queryResultModelCount}"+"张，查询日期:"+"{/queryResultModelDate}",
	        visibleRowCount: 18,
        	selectionMode: sap.ui.table.SelectionMode.Single,
        	navigationMode: sap.ui.table.NavigationMode.Paginator,
        	fixedColumnCount: 0,
        	rowSelectionChange:function(oEvent){
        	    var rowContext = oEvent.getParameters().rowContext;
         	    var table = sap.ui.getCore().byId("caoZuoPiaoQueryResult");
         	    var idBiaoZhiCaoZuoPiaoQuery = sap.ui.getCore().byId("idBiaoZhiCaoZuoPiaoQuery").getText();
         	    var model = table.getModel(); 
         	    var data  = model.getProperty(rowContext.sPath);
         	    if(idBiaoZhiCaoZuoPiaoQuery=="update"){//修改
         	        sap.ui.getCore().byId("idBillApp").app.to("idBillUpdateInfoPage", rowContext);
            		var page = sap.ui.getCore().byId("idBillApp").app.getPage("idBillUpdateInfoPage");
              	    var oModel = new sap.ui.model.json.JSONModel(data);
    			    page.setModel(oModel,"newCaoZuoPiaoUpdate");
         	    }else{//查询 idBillDetailQueryInfoPage
         	        sap.ui.getCore().byId("idBillApp").app.to("idBillDetailQueryInfoPage", rowContext);
            		var page = sap.ui.getCore().byId("idBillApp").app.getPage("idBillDetailQueryInfoPage");
              	    var oModel = new sap.ui.model.json.JSONModel(data);
    			    page.setModel(oModel,"newBillDetailQueryInfoPage");

         	    }
        	}
        }); 
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "操作票号"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "a"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "操作票类型"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "a"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "开票日期"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "a"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "开票人"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "a"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "部门"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "a"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "专业"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "a"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "需要值长审核"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "a"),
        	width: "120px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "操作类型"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "a"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "操作性质"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "a"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "运行区域"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "a"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "机组"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "a"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "值别"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "a"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "班组"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "a"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "合格与否"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "a"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.bindRows("/queryResultModel");
        var oTextView = new sap.ui.commons.TextView({id:"idBiaoZhiCaoZuoPiaoQuery"});
        oTextView.setVisible(false);
        oTextView.bindProperty("text", "/BiaoJi");
        //布局
        var oLayout = new sap.ui.layout.VerticalLayout("LayoutQueryCaoZuoPiao", {
        	content: [oTable2, oTextView]
        });
        return oLayout;
	}

});