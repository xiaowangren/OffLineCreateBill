sap.ui.jsview("com.zhenergy.bill.view.BillCreateInfoTab", {
	getControllerName : function() {
		return "com.zhenergy.bill.view.BillCreateInfoTab";
	},
	createContent : function(oController) {
	    var aData = [];
	    var dangerousPointData=[];
	    for(var i=0;i<150;i++){
	       aData.push({Zxh:"",Zcznr:"",Zzysx:""});
	    }
	    for(var j=0;j<100;j++){
	       dangerousPointData.push({Dangno:"",Zztext:"",Zzremark:"",Zzpltxt:""});//DANGNO  ZZTEXT ZZREMARK ZZPLTXT
	    }    
	    //Create a model and bind the table rows to this model
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData({modelData: aData});
        var jModel = new sap.ui.model.json.JSONModel();
        jModel.setData({dModelData:dangerousPointData});
	    var oTabStrip1 = new sap.ui.commons.TabStrip("BillCreateInfoTabStrip01");
        oTabStrip1.setHeight("380px");
        //tab1
	    var oTable2 = new sap.ui.table.Table({
	        id:"BillBaseInfoTab",
	        visibleRowCount: 9,
            selectionMode: sap.ui.table.SelectionMode.Single,
            // navigationMode: sap.ui.table.NavigationMode.Paginator,
        	fixedColumnCount: 0
        	
        }); 
	    oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "序号"}),
        	template: new sap.ui.commons.TextField().bindProperty("value", "Zxh"),
        	width: "50px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "操作内容"}),
        	template: new sap.ui.commons.TextArea({width:"100%"}).bindProperty("value", "Zcznr"),
        	width: "240px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "注意事项"}),
        	template: new sap.ui.commons.TextArea({width:"100%"}).bindProperty("value", "Zzysx"),
        	width: "180px",
        	hAlign: "Center"
        }));
        // oTable2.addColumn(new sap.ui.table.Column({
        // 	label: new sap.ui.commons.Label({text: "执行情况"}),
        // 	template: new sap.ui.commons.TextField().bindProperty("value", "DsDomain"),
        // 	width: "80px",
        // 	hAlign: "Center"
        // }));
        // oTable2.addColumn(new sap.ui.table.Column({
        // 	label: new sap.ui.commons.Label({text: "操作人"}),
        // 	template: new sap.ui.commons.TextField().bindProperty("value", "DsSubdomain"),
        // 	width: "80px",
        // 	hAlign: "Center"
        // }));
        // oTable2.addColumn(new sap.ui.table.Column({
        // 	label: new sap.ui.commons.Label({text: "监护人"}),
        // 	template: new sap.ui.commons.TextField().bindProperty("value", "DsSystem"),
        // 	width: "80px",
        // 	hAlign: "Center"
        // }));
        // oTable2.addColumn(new sap.ui.table.Column({
        // 	label: new sap.ui.commons.Label({text: "值班负责人"}),
        // 	template: new sap.ui.commons.TextField().bindProperty("value", "DsBusiness"),
        // 	width: "100px",
        // 	hAlign: "Center"
        // }));
        // oTable2.addColumn(new sap.ui.table.Column({
        // 	label: new sap.ui.commons.Label({text: "值长"}),
        // 	template: new sap.ui.commons.TextField().bindProperty("value", "DsType"),
        // 	width: "80px",
        // 	hAlign: "Center"
        // }));
        // oTable2.addColumn(new sap.ui.table.Column({
        // 	label: new sap.ui.commons.Label({text: "值别"}),
        // 	template: new sap.ui.commons.TextField().bindProperty("value", "DsSecurityLevel"),
        // 	width: "80px",
        // 	hAlign: "Center"
        // }));
        // oTable2.addColumn(new sap.ui.table.Column({
        // 	label: new sap.ui.commons.Label({text: "班组"}),
        // 	template: new sap.ui.commons.TextField().bindProperty("value", "DsOwner"),
        // 	width: "80px",
        // 	hAlign: "Center"
        // }));
        oTable2.setModel(oModel);
        oTable2.bindRows("/modelData");
        var tab = new sap.ui.commons.Tab({
            verticalScrolling:sap.ui.core.Scrolling.Hidden,
            horizontalScrolling:sap.ui.core.Scrolling.Hidden,
            text:"操作内容",
            content:oTable2
        }); 
        oTabStrip1.addTab(tab);
        //tab2
        var oTable3 = new sap.ui.table.Table({
	        id:"idDangerousPointTab",
	        visibleRowCount: 10,
            selectionMode: sap.ui.table.SelectionMode.Single,
            // navigationMode: sap.ui.table.NavigationMode.Paginator,
        	fixedColumnCount: 0
        }); 
	    oTable3.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "序号"}),
        	template: new sap.ui.commons.TextField().bindProperty("value", "Dangno"),
        	width: "50px",
        	hAlign: "Center"
        }));
        oTable3.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "危险点"}),
        	template: new sap.ui.commons.TextArea({width:"100%"}).bindProperty("value", "Zztext"),
        	width: "240px",
        	hAlign: "Center"
        }));
        oTable3.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "危害后果"}),
        	template: new sap.ui.commons.TextArea({width:"100%"}).bindProperty("value", "Zzremark"),
        	width: "200px",
        	hAlign: "Center"
        }));
        oTable3.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "控制措施"}),
        	template: new sap.ui.commons.TextArea({width:"100%"}).bindProperty("value", "Zzpltxt"),
        	width: "200px",
        	hAlign: "Center"
        }));
        oTable3.setModel(jModel);
        oTable3.bindRows("/dModelData");
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