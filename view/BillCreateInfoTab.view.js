sap.ui.jsview("com.zhenergy.bill.view.BillCreateInfoTab", {
	getControllerName : function() {
		return "com.zhenergy.bill.view.BillCreateInfoTab";
	},
	createContent : function(oController) {
	    var oTabStrip1 = new sap.ui.commons.TabStrip("BillCreateInfoTabStrip01");
        oTabStrip1.setHeight("405px");
        //tab1
	    var oTable2 = new sap.ui.table.Table({
	        id:"BillBaseInfoTab",
	        visibleRowCount: 10,
            selectionMode: sap.ui.table.SelectionMode.Single,
            // navigationMode: sap.ui.table.NavigationMode.Paginator,
        	fixedColumnCount: 0
        	
        }); 
	    oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "序号"}),
        	template: new sap.ui.commons.TextField().bindProperty("value", "DsCode"),
        	width: "50px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "操作内容"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "DsNameEn"),
        	width: "240px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "注意事项"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "DsNameCn"),
        	width: "180px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "执行情况"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "DsDomain"),
        	width: "80px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "操作人"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "DsSubdomain"),
        	width: "80px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "监护人"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "DsSystem"),
        	width: "80px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "值班负责人"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "DsBusiness"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "值长"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "DsType"),
        	width: "80px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "值别"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "DsSecurityLevel"),
        	width: "80px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "班组"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "DsOwner"),
        	width: "80px",
        	hAlign: "Center"
        }));
         oTable2.bindRows("/mataModel");
        var tab = new sap.ui.commons.Tab({
            verticalScrolling:sap.ui.core.Scrolling.Hidden,
            horizontalScrolling:sap.ui.core.Scrolling.Hidden,
            text:"操作内容",
            content:oTable2
        }); 
        oTabStrip1.addTab(tab);
        //tab2
        var oTable3 = new sap.ui.table.Table({
	        id:"dangerousPointTab",
	        visibleRowCount: 10,
            selectionMode: sap.ui.table.SelectionMode.Single,
            // navigationMode: sap.ui.table.NavigationMode.Paginator,
        	fixedColumnCount: 0
        	
        }); 
	    oTable3.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "序号"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "DsCode"),
        	width: "50px",
        	hAlign: "Center"
        }));
        oTable3.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "危险点"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "DsNameEn"),
        	width: "240px",
        	hAlign: "Center"
        }));
        oTable3.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "危害后果"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "DsNameCn"),
        	width: "200px",
        	hAlign: "Center"
        }));
        oTable3.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "控制措施"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "DsDomain"),
        	width: "200px",
        	hAlign: "Center"
        }));
         oTable3.bindRows("/mataModel");
        var tab3 = new sap.ui.commons.Tab({
            verticalScrolling:sap.ui.core.Scrolling.Hidden,
            horizontalScrolling:sap.ui.core.Scrolling.Hidden,
            text:"危险点分析",
            content:oTable3
        }); 
        oTabStrip1.addTab(tab3);
		return oTabStrip1;
	}

});