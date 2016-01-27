sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoInitializePage", {
    onFanHui:function(){
        sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");
    },
    onExecute:function(){
        var idIwerkInitialize = this.getView().byId("idIwerkInitialize").getSelectedKey();
        var idWorkTypeInitialize = this.getView().byId("idWorkTypeInitialize").getSelectedKey();
        if(idWorkTypeInitialize==""){
            sap.m.MessageBox.alert("请选择工作票类型",{title: "提示"});
            return;
        }
        //根据工作票类型查出工作票类型描述
       
		//创建今天日期：Crdate
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
        var Crdate = year+"-" + month +"-"+  day;
        //封装各Tab
        var DangerTab = [{Zfxlx:"",Dangno:"1",Dangsnot:"",Zztext:"",Zzremark:"",Zzpltxt:""}];
        var AqcsTabX=[{Code:"",Seqc:"1",Actext:"",Comzx:true}];
        var AqcsTabY=[{Code:"",Seqc:"1",Actext:"",Comzx:true}];
        var GroupTab =[{Seqc:"1",Pname:"",Opsno:""}];
        var KksTab = [{Seqc:"1",Tplnr:""}];
		var data={
		    Wcmno:"",//工作票编号
		    Ztype:idWorkTypeInitialize,//开票类型
		    Iwerk:idIwerkInitialize,//工厂
		    Crname:"",//创建人
		    Crdate:Crdate,//创建日期
		    Estat:"10",//用户状态
		    Sqbz:false,//双签标识
		    Tplnr:"",//功能位置 kks编码
		    Pltxt:"",
		    Wbbz:"",//外包标识  X是 N否 ""空
		    SPlace:"",//工作地点
		    SCont:"",//工作内容
		  //  Appdep:"",//申请部门 工作单位
		  //  Class:"",//班组编码
		  //  Prfty:"",//专业类型编码
		  //  Rarea:"",//运行区域编码
		  //  Lxbm:"",//联系部门
		    Contact:"",//联系人
		    Phone:"",//联系方式
		  //  Unity:"",//机组
		  //  Bname:"",//工作负责人账号
		    Name:"",//工作负责人
		    Phone1:"",//联系方式
		    Rhhj:false,//融化焊接
		    Qg:false,//切割
		    Ylh:false,//压力焊
		    Xh:false,//钎焊
		    Px:false,//喷枪
		    Pd:false,//喷灯
		    Zk:false,//钻孔
		    Dm:false,//打磨
		    Cj:false,//锤击
		    Ps:false,//破碎
		    Qx:false,//切削
		    Qt:false,//其他
		    Xtcbh:"",//需退出保护或装置名称
		    Gztj:"",//工作条件（停电/不停电）
		    Jhgzbedate:"",//开始日期
		    Jhgzbetime:"",//开始时间
		    Jhgzfidate:"",//结束日期
		    Jhgzfitime:"",//结束时间
		    Gzbzcynum:"",//工作班组成员人数
		    Fynum:"",//附页张数
		    RefWcmno:"",//关联操作票号
		    AqcsTabX:AqcsTabX,//检修时按措Tab
		    AqcsTabY:AqcsTabY,//运行时按措Tab
		    DangerTab:DangerTab,//危险点Tab
		    Zaqm:false,//安全帽
		    Zaqs:false,//安全绳
		    Zaqd:false,//安全带
		    Zjyst:false,//绝缘手套
		    Zjyx:false,//绝缘鞋
		    Zjyd:false,//绝缘垫
		    Zstzk:false,//手套钻孔
		    Zydq:false,//验电器
		    Zmhq:false,//灭火器
		    Zes:false,//耳塞
		    Zfhyj:false,//防护眼镜
		    Zhjyj:false,//焊接眼镜
		    Zhjst:false,//焊接手套
		    Zfcmz:false,//防尘面罩
		    Zfhz:false,//防护罩
		    Zhxq:false,//呼吸器
		    Zzl:false,//遮拦
		    Ztz:false,//梯子
		    Zqt:false,//其他
		    Zqtt:"",//其他安全措施
		    GroupTab:GroupTab,//
		    KksTab:KksTab,
		    Zbcsm:"",//附件的补充说明字段
		    statusText:"unCreated"
		};
		var oModel = new sap.ui.model.json.JSONModel();
		oModel = sap.ui.controller("com.zhenergy.bill.view.GongzuoPiaoQueryPage").onFengZhuang(idIwerkInitialize);
		//初始化安全措施下拉列表
		sap.ui.controller("com.zhenergy.bill.view.GongzuoPiaoQueryPage").onInitializeAQCSData(idWorkTypeInitialize);
        oModel.setProperty("/Title1","创建");
        oModel.setProperty("/Editable",true);
        oModel= this.onDataVisible(oModel,idIwerkInitialize,idWorkTypeInitialize);
        jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMTPEOQUALI")) {
			var oDataPer = oStorage.get("ZPMOFFLINE_SRV.ZPMTPEOQUALI");
    		var aFilterPer = [];
			for(var g=0;g<oDataPer.length;g++){
			    if(oDataPer[g].Ztype==idWorkTypeInitialize&&oDataPer[g].Quaid=="A"){
			        aFilterPer.push(oDataPer[g]);
			    }
			}
	        oModel.setProperty("/ZPMTOPER",aFilterPer);
		}
		if (oStorage.get("ZPMOFFLINE_SRV.WorkType")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.WorkType");
			var Ztypedesc = "";
			for(var n=0;n<oData.length;n++){
			    if(oData[n].Ztype==idWorkTypeInitialize){
			        Ztypedesc = oData[n].Ztypedes;
			        break;
			    }
			}
		    oModel.setProperty("/Title2",Ztypedesc);
		}
		oModel.setData(data,true);//合并数据，但是不替换
		sap.ui.getCore().setModel(oModel);
 	    sap.ui.getCore().byId("idBillApp").app.to("idGongZuoPiaoFinalView", "");
    	var page = sap.ui.getCore().byId("idBillApp").app.getPage("idGongZuoPiaoFinalView");
    	page.setModel(oModel,"WorkModel");
/*    	//安全措施
		//var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMTQPCDT")) {
			var AQCSDataX = new sap.ui.model.json.JSONModel();
			var AQCSDataY = new sap.ui.model.json.JSONModel();
			var oDataPer = oStorage.get("ZPMOFFLINE_SRV.ZPMTQPCDT");
    		var aFilterPerX = [];
    		var aFilterPerY = [];
			for(var g=0;g<oDataPer.length;g++){
			    if(oDataPer[g].Ztype==idWorkTypeInitialize&&oDataPer[g].Katalogart=="X"){
			        aFilterPerX.push(oDataPer[g]);
			    }
			    if(oDataPer[g].Ztype==idWorkTypeInitialize&&oDataPer[g].Katalogart=="Y"){
			        aFilterPerY.push(oDataPer[g]);
			    }
			}
	        AQCSDataX.setData(aFilterPerX,false);
	        //检修提出安措数据列表
			sap.ui.getCore().setModel(AQCSDataX,"AQCSDataX");
			//补充运行按错数据列表
	        AQCSDataY.setData(aFilterPerY,false);
			sap.ui.getCore().setModel(AQCSDataY,"AQCSDataY");
		}*/




    },
    onCanKaoDianXingPiao:function(){
        //获取页面上的工厂、工作票类型
        var idIwerkInitialize = this.getView().byId("idIwerkInitialize").getSelectedKey();
        var idWorkTypeInitialize = this.getView().byId("idWorkTypeInitialize").getSelectedKey();
        var biaoJiInitialize = this.getView().byId("BiaoJiInitialize").getText();
        //判断是否选择工作票类型
        if(idWorkTypeInitialize==""){
            sap.m.MessageBox.alert("请选择工作票类型",{title: "提示"});
            return;
        }
        jQuery.sap.require("jquery.sap.storage");
	    jQuery.sap.require("sap.m.MessageToast");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var oLocalModel = new sap.ui.model.json.JSONModel();
		//工厂
		if (oStorage.get("ZPMOFFLINE_SRV.WERKS")) {
			var oDataWerk = oStorage.get("ZPMOFFLINE_SRV.WERKS");
			oLocalModel.setProperty("/WERKS",oDataWerk);
		}
		//操作类型
		if (oStorage.get("ZPMOFFLINE_SRV.WorkType")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.WorkType");
			var aFilter = [];
			for(var n=0;n<oData.length;n++){
			    if(oData[n].Iwerk==idIwerkInitialize){
			        aFilter.push(oData[n]);
			    }
			}
		    oLocalModel.setProperty("/WorkType",aFilter);
		}
		//负责人
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMTPEOQUALI")) {
			var oDataPer = oStorage.get("ZPMOFFLINE_SRV.ZPMTPEOQUALI");
    		var aFilterPer = [];
			for(var g=0;g<oDataPer.length;g++){
			    if(oDataPer[g].Ztype==idWorkTypeInitialize&&oDataPer[g].Quaid=="A"){
			        aFilterPer.push(oDataPer[g]);
			    }
			}
	        oLocalModel.setProperty("/ZPMTOPER",aFilterPer);
		}
		//工作单位
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00229C")) {
			var oDataDanWei = oStorage.get("ZPMOFFLINE_SRV.ZPMT00229C");
			var aFilterDanWei = [];
			for(var l=0;l<oDataDanWei.length;l++){
			    if(oDataDanWei[l].Werks==idIwerkInitialize){
			        aFilterDanWei.push(oDataDanWei[l]);
			    }
			}
		    oLocalModel.setProperty("/DanWei",aFilterDanWei);
		}
		oLocalModel.setProperty("/Iwerk",idIwerkInitialize);
		oLocalModel.setProperty("/Ztype",idWorkTypeInitialize);
		oLocalModel.setProperty("/BiaoJi",biaoJiInitialize);
		oLocalModel.setProperty("/Peoid","");
		oLocalModel.setProperty("/Appdep","");
		oLocalModel.setProperty("/SPlace","");
		oLocalModel.setProperty("/SCont","");
		oLocalModel.setProperty("/Crdate","");
		sap.ui.getCore().setModel(oLocalModel);
        sap.ui.getCore().byId("idBillApp").app.to("idGongzuoPiaoQueryPage");
    },
    
    onDataVisible:function(oModel,iwerk,type){
        //是否显示双签
		if(type=="DCC"||type=="DH1"||type=="DH2"||type=="DQ1"||type=="DQ2"||type=="JBP"||type=="RJP"||type=="RKP"){
		    oModel.setProperty("/SqVisible",true);
		}else{//JXD QXD SCC SD1  SD2 SJB SRJ SRK   
		    oModel.setProperty("/SqVisible",false);
		}
// 		//是否显示外包
// 		if(type="QXD"||type=="JXD"||type=="SCC"||type=="SD1"||type=="SD2"||type=="SJB"||type=="SRJ"||type=="SRK"){
// 		    oModel.setProperty("/WbbzsVisible",false);
// 		}else{
// 		    oModel.setProperty("/WbbzsVisible",true);
// 		}
		//是否显示动火方式
		if(type=="DH1"||type=="DH2"){
		    oModel.setProperty("/DhfsVisible",true);
		}else{ 
		    oModel.setProperty("/DhfsVisible",false);
		}
		//是否显示需退出保护或装置名称
		if(type=="RKP"){
		    oModel.setProperty("/ZtcbhVisible",true);
		}else{ 
		    oModel.setProperty("/ZtcbhVisible",false);
		}
		//是否显示工作条件（停电/不停电）
		if(type=="DQ2"){
		    oModel.setProperty("/GztjVisible",true);
		}else{ 
		    oModel.setProperty("/GztjVisible",false);
		}
		//是否显示联系部门，联系人，联系方式 (JXD QXD) SCC SD1 SD2 SJB SRJ SRK
		if(type=="JXD"||type=="QXD"||type=="SCC"||type=="SD1"||type=="SD2"||type=="SJB"||type=="SRJ"||type=="SRK"){
		    oModel.setProperty("/Lx3Visible",false);
		}else{ 
		    oModel.setProperty("/Lx3Visible",true);
		}
		//是否显示机组，工作负责人，联系方式
		if(type=="SCC"||type=="SD1"||type=="SD2"||type=="SJB"||type=="SRJ"||type=="SRK"){
		    oModel.setProperty("/Lx32Visible",false);
		}else{ 
		    oModel.setProperty("/Lx32Visible",true);
		}
		//是否显示附页张数 FynumVisible
		if(type=="DCC"||type=="DQ1"||type=="DQ2"||type=="JBP"||type=="RJP"||type=="RKP"){
		    oModel.setProperty("/FynumVisible",true);
		}else{ 
		    oModel.setProperty("/FynumVisible",false);
		}
		//显示人数
		if(type=="DCC"||type=="DQ1"||type=="DQ2"||type=="JBP"||type=="JXD"||type=="QXD"||type=="RJP"||type=="RKP"){
		    oModel.setProperty("/GzbzcynumVisible",true);
		}else{ 
		    oModel.setProperty("/GzbzcynumVisible",false);
		}
		//是否显示关联操作票号
		if(type=="DH1"||type=="DH2"){
		    oModel.setProperty("/RefWcmnoVisible",true);
		}else{ 
		    oModel.setProperty("/RefWcmnoVisible",false);
		}
		//是否显示完成时间
		if(type=="QXD"||type=="SCC"||type=="SD1"||type=="SD2"||type=="SJB"||type=="SRJ"||type=="SRK"){
		    oModel.setProperty("/JhgzfiVisible",false);
		}else{ 
		    oModel.setProperty("/JhgzfiVisible",true);
		}
		//是否显示table   tableVisible
		if(type=="SCC"||type=="SD1"||type=="SD2"||type=="SJB"||type=="SRJ"||type=="SRK"){
		    oModel.setProperty("/TableVisible",false);
		}else{ 
		    oModel.setProperty("/TableVisible",true);
		}
		//是否显示 接地刀/接地闸
		if(type=="DCC"||type=="DQ1"||type=="DQ2"||type=="JBP"){
		    oModel.setProperty("/ZsfjdVisible",true);
		}else{ 
		    oModel.setProperty("/ZsfjdVisible",false);
		}		
		return oModel;
    }


});