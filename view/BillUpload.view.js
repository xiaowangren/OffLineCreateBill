sap.ui.jsview("com.zhenergy.bill.view.BillUpload", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf com.zhenergy.bill.view.BillUpload
	*/ 
	getControllerName : function() {
		return "com.zhenergy.bill.view.BillUpload";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf com.zhenergy.bill.view.BillUpload
	*/ 
	createContent : function(oController) {
	    var oButton1 = new sap.ui.commons.Button({
	        id: "idBackButton",
        	text : "返回主页",
        	icon:"sap-icon://nav-back",
        	press : oController.onBack
        });
        var oButton2 = new sap.ui.commons.Button({
            id:"idButtonUpload",
            icon:"sap-icon://upload",
        	text : "上传",
        	press: [oController.onUploadPressed,oController],          //JS view的controller要传第二个参数才能在controller中使用this.getView().byId();
        	visible:true
        });
	    var oTable2 = new sap.ui.table.Table(this.createId("idUploadListTable"),{
	       // id:"idUploadListTable",                 //JS view 的id 需要使用this.createId来保证唯一
	        title: "未上传操作票:共"+"{/queryResultModelCount}"+"张，查询日期:"+"{/queryResultModelDate}",
	        visibleRowCount: 10,
        	selectionMode: "MultiToggle",
        	navigationMode: sap.ui.table.NavigationMode.Paginator,
        	selectionBehavior: sap.ui.table.SelectionBehavior.RowSelector,
            fixedColumnCount: 3,
            enableColumnReordering: true
        }); 
        // oTable2.addColumn(new sap.ui.table.Column({
        // 	label: new sap.ui.commons.Label({text: "是否已上传"}),
        // 	template: new sap.ui.commons.TextView().bindProperty("text", "statusText"),
        // 	width: "100px",
        // 	hAlign: "Center"
        // }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "ECC票号"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "Zlybnum"),
        	width: "150px",
        	hAlign: "Center"
        }));    
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "离线票号"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "Zczph"),
        	width: "150px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "操作票类型"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "Ztypedes"),
        	width: "100px",
        	hAlign: "Center"
        }));

        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "开票日期"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "Cdata"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "开票人"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "Cuser"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "部门"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "Appdepdec"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "专业"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "Prtxt"),
        	width: "100px",
        	hAlign: "Center"
        }));
        // oTable2.addColumn(new sap.ui.table.Column({
        // 	label: new sap.ui.commons.Label({text: "操作类型"}),
        // 	template: new sap.ui.commons.TextView().bindProperty("text", "OtypeValue"),
        // 	width: "100px",
        // 	hAlign: "Center"
        // }));
        // oTable2.addColumn(new sap.ui.table.Column({
        // 	label: new sap.ui.commons.Label({text: "操作性质"}),
        // 	template: new sap.ui.commons.TextView().bindProperty("text", "ZczfsValue"),
        // 	width: "100px",
        // 	hAlign: "Center"
        // }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "运行区域"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "Rareadec"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "机组"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "Untxt"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "值别"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "Dutxt"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "班组"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "Yxgroupdec"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.bindRows("/queryResultModel");
        var oPanel = new sap.ui.commons.Panel();
        oPanel.addButton(oButton1);
        oPanel.addButton(oButton2);
        oPanel.addContent(oTable2);
        return oPanel;
	}

});