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
	    var oButton1 = new sap.ui.commons.Button({
        	text : "返回主页",
        	press : oController.onFanHui
        });
        var oButton2 = new sap.ui.commons.Button({
            id:"idBiaoZhiCaoZuoPiaoQuery",
        	text : "{/BiaoJi}",
        	visible:false
        });
        var oButton3 = new sap.ui.commons.Button({
            id:"idUpdateLog2",
        	text : "{/UpdateLog2}",
        	visible:false
        });
	    var oTable2 = new sap.ui.table.Table({
	        id:"caoZuoPiaoQueryResult",
	        title: "操作票查询:共"+"{/queryResultModelCount}"+"张，查询日期:"+"{/queryResultModelDate}",
	        visibleRowCount: 18,
        	selectionMode: sap.ui.table.SelectionMode.Single,
        // 	navigationMode: sap.ui.table.NavigationMode.Paginator,
        	fixedColumnCount: 0,
        	rowSelectionChange:function(oEvent){
        	    var rowContext = oEvent.getParameters().rowContext;
         	    var table = sap.ui.getCore().byId("caoZuoPiaoQueryResult");
         	    var idBiaoZhiCaoZuoPiaoQuery = sap.ui.getCore().byId("idBiaoZhiCaoZuoPiaoQuery").getText();
         	    var idUpdateLog2 = sap.ui.getCore().byId("idUpdateLog2").getText();
         	    var model = table.getModel(); 
         	    var data  = model.getProperty(rowContext.sPath);
         	    var Iwerk = data.Iwerk;
         	    var queryModel3 = new sap.ui.model.json.JSONModel();
                var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
                //填写部门
        		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00229")) {
        			var oData3 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00229");
        			var aFilter3 = [];
        			for(var m=0;m<oData3.length;m++){
        			    if(oData3[m].Werks==Iwerk){
        			        aFilter3.push(oData3[m]);
        			    }
        			}
        		    queryModel3.setProperty("/tianxieBuMenQuery3",aFilter3);
        		}
                
                //班组
        		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00283")) {
        			var oData2 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00283");
        			var aFilter2 = [];
        			for(var j=0;j<oData2.length;j++){
        			    if(oData2[j].Werks==Iwerk){
        			        aFilter2.push(oData2[j]);
        			    }
        			}
        		    queryModel3.setProperty("/banZuQuery3",aFilter2);
        		}
        		//运行区域
        		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00227")) {
        			var oData1 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00227");
        			var aFilter = [];
        			for(var i=0;i<oData1.length;i++){
        			    if(oData1[i].Werks==Iwerk){
        			        aFilter.push(oData1[i]);
        			    }
        			}
        		    queryModel3.setProperty("/yunXingQuYuQuery3",aFilter);
        		}
        		//机组
        		if (oStorage.get("ZPMOFFLINE_SRV.ZPMV00005")) {
        			var oData4 = oStorage.get("ZPMOFFLINE_SRV.ZPMV00005");
        			var aFilter4 = [];
        			for(var n=0;n<oData4.length;n++){
        			    if(oData4[n].Werks==Iwerk){
        			        aFilter4.push(oData4[n]);
        			    }
        			}
        		    queryModel3.setProperty("/jiZuQuery3",aFilter4);
        		}
        		//值别
        		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00204")) {
        			var oData = oStorage.get("ZPMOFFLINE_SRV.ZPMT00204");
        			queryModel3.setProperty("/ZhiBieQuery3",oData);
        		}
                sap.ui.getCore().setModel(queryModel3);
                
                var InfoTab = data.InfoTab;
            		var InfoDataNew = [];
            		var InfoTabLength = data.InfoTab.length;
            		for(var j=0;j<InfoTabLength;j++){
            		    InfoDataNew.push(InfoTab[j]);
            		}
            		for(var i=0;i<150-InfoTabLength;i++){
            		    InfoDataNew.push({Zxh:"",Zcznr:"",Zzysx:""});
            		}
            		data.InfoTab=InfoDataNew;
            		//危险点分析
            		var DangerousTab = data.DangerousTab;
            		var DangerousTabNew = [];
            		var DangerousTabLength = data.DangerousTab.length;
            		for(var m=0;m<DangerousTabLength;m++){
            		    DangerousTabNew.push(DangerousTab[m]);
            		}
            		for(var n=0;n<150-DangerousTabLength;n++){
            		    DangerousTabNew.push({Dangno:"",Zztext:"",Zzremark:"",Zzpltxt:""});
            		}
            		data.DangerousTab=DangerousTabNew;
              	    var oModel = new sap.ui.model.json.JSONModel(data);
              	    
         	    if(idBiaoZhiCaoZuoPiaoQuery=="update"){//模板创建
         	        sap.ui.getCore().byId("idBillApp").app.to("idBillCaoZuoPiaoMoBanCreate", rowContext);
            		var page = sap.ui.getCore().byId("idBillApp").app.getPage("idBillCaoZuoPiaoMoBanCreate");
    			    page.setModel(oModel,"newCaoZuoPiaoUpdateMuBan");
         	    }else if(idUpdateLog2!="UpdateLog"){//查询 idBillDetailQueryInfoPage
         	        sap.ui.getCore().byId("idBillApp").app.to("idBillDetailQueryInfoPage", rowContext);
            		var page = sap.ui.getCore().byId("idBillApp").app.getPage("idBillDetailQueryInfoPage");
    			    page.setModel(oModel,"newBillDetailQueryInfoPage");
         	    }else{//修改本地数据
         	        sap.ui.getCore().byId("idBillApp").app.to("idBillUpdateInfoPage", rowContext);
            		var page = sap.ui.getCore().byId("idBillApp").app.getPage("idBillUpdateInfoPage");
    			    page.setModel(oModel,"newBillDetailUpdateInfoPage");
         	        
         	    }
        	}
        }); 
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "操作票号"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "Zczph"),
        	width: "130px",
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
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "操作类型"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "OtypeValue"),
        	width: "100px",
        	hAlign: "Center"
        }));
        oTable2.addColumn(new sap.ui.table.Column({
        	label: new sap.ui.commons.Label({text: "操作性质"}),
        	template: new sap.ui.commons.TextView().bindProperty("text", "ZczfsValue"),
        	width: "100px",
        	hAlign: "Center"
        }));
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
        oPanel.addButton(oButton3);
        oPanel.addContent(oTable2);
        return oPanel;
	}

});