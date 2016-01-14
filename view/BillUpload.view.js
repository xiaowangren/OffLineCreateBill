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
        // oTable2.addColumn(new sap.ui.table.Column({
        // 	label: new sap.ui.commons.Label({text: "操作票类型"}),
        // 	template: new sap.ui.commons.TextView().bindProperty("text", "Ztypedes"),
        // 	width: "100px",
        // 	hAlign: "Center"
        // }));
        var zcpTypeBox = new sap.ui.commons.ComboBox().bindProperty("selectedKey", "Ztype");
        zcpTypeBox.setEditable(false);
        var zcpItem1 = new sap.ui.core.ListItem(this.createId("zcpItem1"),{key:"DQ",text:"电气操作票"});
        var zcpItem2 = new sap.ui.core.ListItem(this.createId("zcpItem2"),{key:"GL",text:"锅炉操作票"});
        var zcpItem3 = new sap.ui.core.ListItem(this.createId("zcpItem3"),{key:"HB",text:"环保操作票"});
        var zcpItem4 = new sap.ui.core.ListItem(this.createId("zcpItem4"),{key:"HX",text:"化学操作票"});
        var zcpItem5 = new sap.ui.core.ListItem(this.createId("zcpItem5"),{key:"QJ",text:"汽机操作票"});
        var zcpItem6 = new sap.ui.core.ListItem(this.createId("zcpItem6"),{key:"RK",text:"热控操作票"});
        var zcpItem7 = new sap.ui.core.ListItem(this.createId("zcpItem7"),{key:"RL",text:"燃料操作票"});
        var zcpItem8 = new sap.ui.core.ListItem(this.createId("zcpItem8"),{key:"ZS",text:"典型操作票"});
        zcpTypeBox.addItem(zcpItem1);
        zcpTypeBox.addItem(zcpItem2);
        zcpTypeBox.addItem(zcpItem3);
        zcpTypeBox.addItem(zcpItem4);
        zcpTypeBox.addItem(zcpItem5);
        zcpTypeBox.addItem(zcpItem6);
        zcpTypeBox.addItem(zcpItem7);
        zcpTypeBox.addItem(zcpItem8);
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "操作票类型"}),
        	template: zcpTypeBox,
        	width: "120px",
        	hAlign: "Center"
        }));

        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "开票日期"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "Cdata"),
        	width: "80px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "开票人"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "Cuser"),
        	width: "80px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "操作任务"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "Ztask"),
        	width: "300px",
        	hAlign: "Center"
        }));
        var bumenBox = new sap.ui.commons.ComboBox(this.createId("bumenBox"),{editable:false}); //,selectedKey:"Appdep"
        bumenBox.bindProperty("selectedKey", "Appdep");
        var bumenItemTemplate = new sap.ui.core.ListItem(this.createId("bumenItemTemplate"),{  
              text: "{Appdepdec}",  
              key: "{Appdep}"  
          });     
        bumenBox.bindItems("/tianxieBuMenQuery3",bumenItemTemplate);
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "部门"}),
        	template: bumenBox,//new sap.ui.commons.TextView().bindProperty("text", "Appdep"),
        	width: "150px",
        	hAlign: "Center"
        }));
        // oTable2.addColumn(new sap.ui.table.Column({
        // 	label: new sap.ui.commons.Label({text: "专业"}),
        // 	template: new sap.ui.commons.TextView().bindProperty("text", "Prtxt"),
        // 	width: "100px",
        // 	hAlign: "Center"
        // }));
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
        var rareaBox = new sap.ui.commons.ComboBox(this.createId("rareaBox"),{editable:false});
        rareaBox.bindProperty("selectedKey", "Rarea");
        var rareaItemTemplate = new sap.ui.core.ListItem(this.createId("rareaItemTemplate"),{  
            text: "{Rareadec}",  
            key: "{Rarea}"  
        }); 
        rareaBox.bindItems("/yunXingQuYuQuery3",rareaItemTemplate);
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "运行区域"}),
        	template: rareaBox,                                 //new sap.ui.commons.TextView().bindProperty("text", "Rareadec"),
        	width: "100px",
        	hAlign: "Center"
        }));
        var UnityBox = new sap.ui.commons.ComboBox().bindProperty("selectedKey", "Unity").setEditable(false);
        var UnityItemTemplate = new sap.ui.core.ListItem(this.createId("UnityItemTemplate"),{  
            text: "{Untxt}",  
            key: "{Unity}"  
        }); 
        UnityBox.bindItems("/jiZuQuery3",UnityItemTemplate);
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "机组"}),
        	template: UnityBox,                             //new sap.ui.commons.TextView().bindProperty("text", "Untxt"),
        	width: "100px",
        	hAlign: "Center"
        }));
        var DunumBox = new sap.ui.commons.ComboBox().bindProperty("selectedKey", "Dunum").setEditable(false);
        var DunumItemTemplate = new sap.ui.core.ListItem(this.createId("DunumItemTemplate"),{  
            text: "{Dutxt}",  
            key: "{Dunum}"  
        }); 
        DunumBox.bindItems("/ZhiBieQuery3",DunumItemTemplate);
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "值别"}),
        	template: DunumBox,                            //new sap.ui.commons.TextView().bindProperty("text", "Dutxt"),
        	width: "100px",
        	hAlign: "Center"
        }));
        var YxgroupBox = new sap.ui.commons.ComboBox().bindProperty("selectedKey", "Yxgroup").setEditable(false);
        var YxgroupItemTemplate = new sap.ui.core.ListItem(this.createId("YxgroupItemTemplate"),{  
            text: "{Yxgroupdec}",  
            key: "{Yxgroup}"  
        }); 
        YxgroupBox.bindItems("/banZuQuery3",YxgroupItemTemplate);
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "班组"}),
        	template: YxgroupBox,                          //new sap.ui.commons.TextView().bindProperty("text", "Yxgroupdec"),
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