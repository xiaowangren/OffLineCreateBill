sap.ui.controller("com.zhenergy.bill.view.BillCreateInfoPage", {
    onPrintBillInfo:function(){
        var dianQiCaoZuoPiaoHao = this.getView().byId("dianQiCaoZuoPiaoHao").getValue();
        var dianQiGongChang = this.getView().byId("dianQiGongChang").getValue();
        var dianQiTianXieBuMen = this.getView().byId("dianQiTianXieBuMen").getSelectedKey();
        var dianQiBanZu = this.getView().byId("dianQiBanZu").getSelectedKey();
        var dianQiBuHeGe = this.getView().byId("dianQiBuHeGe").getChecked();
        var dianQiLeiXing = this.getView().byId("dianQiLeiXing").getValue();
        var dianQiCaozuoLeiXing = this.getView().byId("dianQiCaozuoLeiXing").getSelectedKey();
        var dianQiCaoZuoXingZhi = this.getView().byId("dianQiCaoZuoXingZhi").getSelectedKey();
        var dianQiXuYaoZhiZhangShenHe = this.getView().byId("dianQiXuYaoZhiZhangShenHe").getChecked();
        var dianQiYunXingQuYu = this.getView().byId("dianQiYunXingQuYu").getSelectedKey();
        var dianQiJiZu = this.getView().byId("dianQiJiZu").getSelectedKey();
        var dianQiZhiBie = this.getView().byId("dianQiZhiBie").getSelectedKey();
        var dianQiZhuangTai = this.getView().byId("dianQiZhuangTai").getValue();
        var dianQiKaiPiaoRen = this.getView().byId("dianQiKaiPiaoRen").getValue();
        var dianQiKaiPiaoRiQi = this.getView().byId("dianQiKaiPiaoRiQi").getValue();
        var dianQiCaoZuoRenWu = this.getView().byId("dianQiCaoZuoRenWu").getValue();
        var dianQiCaoZuoKaiShiShiJian = this.getView().byId("dianQiCaoZuoKaiShiShiJian").getValue();
        var dianQiCaoZuoJieShuShiJian = this.getView().byId("dianQiCaoZuoJieShuShiJian").getValue(); 
        //收集tab中的数据
        var tableId = sap.ui.getCore().byId("BillBaseInfoTab");
        var tableData = tableId.getModel().oData.modelData;
        var tableDataNew =[];
        for(var i=0;i<tableData.length;i++){
            if(tableData[i].DsCode.trim()!=""){
               tableDataNew.push(tableData[i]); 
            }
        }
        
    //     var i;
    //     var header1 = "<center><h3>"+dianQiCaoZuoPiaoHao+"</h3></center><br/>";
        
    //     var aData = [];
	   //     for(var i=0;i<150;i++){
	   //         aData.push({DsCode:"1",DsNameEn:"2",DsNameCn:"3",DsSubdomain:"顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶"});
	   //     }
	   // var oModel = new sap.ui.model.json.JSONModel();
    //     oModel.setData({modelData: aData});
    //     var data=oModel.getProperty("/modelData");
    //     var table="<table>";
    //     for(i=0;i<data.length;i++){
    //         console.log(data[i].DsSubdomain.length);
    //         table+="<tr><td style='border:1px solid black;'>"+i+"</td><td style='border:1px solid black;'>"+data[i].DsCode+"</td><td style='border:1px solid black;width:100px'><textarea rows='10' cols='50'>"+data[i].DsSubdomain+"</textarea></td></tr>";
    //     }
    //     table+="</table>";
    //     var wind = window.open("", "printWindow", "height=768,width=1024,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no");
    //     wind.document.write(header1+table);
    //     wind.print();
    //     wind.close();
    }
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf com.zhenergy.bill.view.BillCreateInfoPage
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf com.zhenergy.bill.view.BillCreateInfoPage
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf com.zhenergy.bill.view.BillCreateInfoPage
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf com.zhenergy.bill.view.BillCreateInfoPage
*/
//	onExit: function() {
//
//	}

});