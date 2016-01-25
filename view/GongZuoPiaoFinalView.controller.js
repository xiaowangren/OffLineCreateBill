sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoFinalView", {
    onFanHui:function(){
        sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");
    },
    onPrintInfo:function(){
        var oModel = this.getView().getModel("WorkModel");
        var WorkModel = oModel.getData(); 
        sap.ui.controller("com.zhenergy.bill.view.PDFPrint").handleGzpPrint(WorkModel.Ztype,WorkModel);
    },
    onPrintDangerous:function(){
        var oModel = this.getView().getModel("WorkModel");
        var WorkModel = oModel.getData(); 
        sap.ui.controller("com.zhenergy.bill.view.PDFPrint").onPrintGZPDanger(WorkModel);
    },
    onPrintAttached:function(){
        var oModel = this.getView().getModel("WorkModel");
        var WorkModel = oModel.getData(); 
        sap.ui.controller("com.zhenergy.bill.view.PDFPrint").onPrintGZPFuye(WorkModel);
    },
    onSubmit:function(){
        var oModel = this.getView().getModel("WorkModel");
        var WorkModel = oModel.getData(); 
        var booleans = this.onCheckData(WorkModel);
        if(!booleans){
            return;
        }
        //删除多余的元素
        // WorkModel = this.onDeleteElement(WorkModel);
        var GroupTab = WorkModel.GroupTab;
        if(GroupTab!=null){
            for(var i=0;i<GroupTab.length;i++){
                GroupTab[i].Seqc = GroupTab[i].Seqc+"";
            }
        }
        
        jQuery.sap.require("jquery.sap.storage");
    	var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
    	var getStorage = oStorage.get("ZPMOFFLINE_SRV.WorkInfos");
    	//封装Name
    	if (oStorage.get("ZPMOFFLINE_SRV.ZPMTPEOQUALI")) {
    		var oDataPer = oStorage.get("ZPMOFFLINE_SRV.ZPMTPEOQUALI");
			for(var l=0;l<oDataPer.length;l++){
			    if(oDataPer[l].Ztype==WorkModel.Ztype&&oDataPer[l].Quaid=="A"&&oDataPer[l].Peoid==WorkModel.Bname){
			        WorkModel.Name = oDataPer[l].Peonam;
			        break;
			    }
			}
        }
        if(WorkModel.Wcmno==""){//创建
            //创建工作票号
            var LiuShuiId = this.uuid(8,10);
            var Wcmno = WorkModel.Ztype+"_"+WorkModel.Iwerk+"_"+LiuShuiId;
            WorkModel.Wcmno = Wcmno;
            if(getStorage){
                getStorage.push(WorkModel);
                oStorage.put("ZPMOFFLINE_SRV.WorkInfos",getStorage);
            }else{
                var workInfoIn = [];
                workInfoIn.push(WorkModel);
                oStorage.put("ZPMOFFLINE_SRV.WorkInfos",workInfoIn);
            }
        }else{//修改
            //先查询出已经存在的，然后覆盖
            if(getStorage){
                for(var a=0;a<getStorage.length;a++){
                    if(getStorage[a].Wcmno==WorkModel.Wcmno){
                        getStorage[a] = WorkModel;
                    }
                }
                oStorage.put("ZPMOFFLINE_SRV.WorkInfos",getStorage);
            }
            
        }
        // oModel.setData(WorkModel);
        // console.log(WorkModels.Iwerk,WorkModels.Ztype);
        // oModel = sap.ui.controller("com.zhenergy.bill.view.GongzuoPiaoQueryPage").onFengZhuang(WorkModel.Iwerk);
        // oModel = sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoInitializePage").onDataVisible(oModel,WorkModel.Iwerk,WorkModel.Ztype);
        oModel.setProperty("/Title1","修改");
        if (oStorage.get("ZPMOFFLINE_SRV.WorkType")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.WorkType");
			var Ztypedesc = "";
			for(var n=0;n<oData.length;n++){
			    if(oData[n].Ztype==WorkModel.Ztype){
			        Ztypedesc = oData[n].Ztypedes;
			        break;
			    }
			}
		    oModel.setProperty("/Title2",Ztypedesc);
		}
// 		var oModel2=new sap.ui.model.json.JSONModel({Title1:"修改",Title2:Ztypedesc},true);
// 		this.byId("idFinalViewTitle").setModel(oModel2);
        oModel.setProperty("/Editable",true);
        // sap.ui.getCore().byId("idBillApp").app.to("idGongZuoPiaoFinalView", "");
    	var page = sap.ui.getCore().byId("idBillApp").app.getPage("idGongZuoPiaoFinalView");
		page.setModel(oModel,"WorkModel"); 
		sap.m.MessageBox.alert("保存成功",{title: "提示"});
    },
    onDeleteElement:function(WorkModel){
        delete WorkModel["WorkType"];
        delete WorkModel["BanZu"];
        delete WorkModel["BuMen"];
        delete WorkModel["DanWei"];
        delete WorkModel["JiZu"];
        delete WorkModel["Title1"];
        delete WorkModel["Title2"];
        delete WorkModel["WERKS"];
        delete WorkModel["YunXingQuYu"];
        delete WorkModel["ZPMTOPER"];
        delete WorkModel["Editable"];
        delete WorkModel["GztjVisible"];
        delete WorkModel["SqVisible"];
        delete WorkModel["DhfsVisible"];
        delete WorkModel["ZtcbhVisible"];
        delete WorkModel["Lx3Visible"];
        delete WorkModel["Lx32Visible"];
        delete WorkModel["FynumVisible"];
        delete WorkModel["GzbzcynumVisible"];
        delete WorkModel["RefWcmnoVisible"];
        delete WorkModel["JhgzfiVisible"];
        delete WorkModel["TableVisible"];
        delete WorkModel["SaveVisible"];
        return WorkModel;
    },
    uuid:function(len, radix){
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;
        if (len) {
          for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
        } else {
          var r;
          uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
          uuid[14] = '4';
          for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
              r = 0 | Math.random()*16;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
          }
        }
        return uuid.join('');
    },
    onCheckData:function(WorkModel){
        var WorkType = WorkModel.Ztype;
        var startWith = WorkType.substring(0,1);
        if(WorkModel.Crname.trim()==""){
            sap.m.MessageBox.alert("创建人必填",{title: "提示"});
            return false;
        }
        if(WorkModel.Tplnr==""){
            sap.m.MessageBox.alert("KKS编码必填",{title: "提示"});
            return false;
        }
        if(WorkType=="DCC"||WorkType=="DH1"||WorkType=="DH2"||WorkType=="DQ1"||WorkType=="DQ2"||WorkType=="JBP"||WorkType=="RJP"||WorkType=="RKP"){
            if(WorkModel.Wbbz==""){
                sap.m.MessageBox.alert("是否外包必填",{title: "提示"});
                return false;
            }
        }
        if(WorkModel.Cplace.trim()==""){
            sap.m.MessageBox.alert("工作地点必填",{title: "提示"});
            return false;
        }
        if(WorkModel.Ccontent.trim()==""){
            sap.m.MessageBox.alert("工作内容必填",{title: "提示"});
            return false;
        }
        if(startWith!="S"){
            if(WorkModel.Appdep==""){
                sap.m.MessageBox.alert("工作单位必填",{title: "提示"});
                return false;
            }
            if(WorkModel.Class==""){
                sap.m.MessageBox.alert("班组必填",{title: "提示"}); 
                return false;
            }
        }
        if(WorkModel.Prfty==""){
            sap.m.MessageBox.alert("专业必填",{title: "提示"});
            return false;
        }
        if(startWith!="S"){
            if(WorkModel.Rarea==""){
                sap.m.MessageBox.alert("运行区域必填",{title: "提示"});
                return false;
            }
            if(WorkModel.Unity==""){
                sap.m.MessageBox.alert("机组必填",{title: "提示"});
                return false;
            }
            if(WorkModel.Bname==""){
                sap.m.MessageBox.alert("工作负责人必填",{title: "提示"});
                return false;
            }
            if(WorkModel.Phone1==""){
                sap.m.MessageBox.alert("联系方式必填",{title: "提示"});
                return false;
            }
        }
        if(WorkType=="RKP"){
           if(WorkModel.Ztcbh==""){
                sap.m.MessageBox.alert("需退出保护或装置名称必填",{title: "提示"});
                return false;
            } 
        }
        if(startWith!="S"&&WorkType!="QXD"){    
            if(WorkModel.Jhgzbedate==""){
                sap.m.MessageBox.alert("开始日期必填",{title: "提示"});
                return false;
            }
            if(WorkModel.Jhgzbetime==""){
                sap.m.MessageBox.alert("开始时间必填",{title: "提示"});
                return false;
            }
            if(WorkModel.Jhgzfidate==""){
                sap.m.MessageBox.alert("完成日期必填",{title: "提示"});
                return false;
            }
            if(WorkModel.Jhgzfitime==""){
                sap.m.MessageBox.alert("完成时间必填",{title: "提示"});
                return false;
            }
        }
        if(WorkType=="DH1"&&WorkType=="DH2"){
            if(WorkModel.RefWcmno==""){
                sap.m.MessageBox.alert("工作票号数必填",{title: "提示"});
                return false;
            }
        }
        if(WorkType=="DCC"||WorkType=="DQ1"||WorkType=="DQ2"||WorkType=="JBP"||WorkType=="RJP"||WorkType=="RKP"){
            if(WorkModel.Fynum==""){
                sap.m.MessageBox.alert("附页张数必填",{title: "提示"});
                return false;
            }
        }
        
        return true;
    }


});