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
        //将按错表按按错代码与序号排序
        function mySortBy(a,b){
            return (a.Code+a.Seqc)>(b.Code+b.Seqc)
                
        }
        var AqcsTabX=WorkModel.AqcsTabX;
        AqcsTabX.sort(mySortBy);
        var AqcsTabY=WorkModel.AqcsTabY;
        AqcsTabY.sort(mySortBy);
        //将危险单按危险单代码跟序号排序
        function mySortBy2(a,b){
            return (a.Zfxlx+a.Dangno+"")>(b.Zfxlx+b.Dangno+"")
                
        }
        
        var DangerTab=WorkModel.DangerTab;
        DangerTab.sort(mySortBy2);
        var booleans = this.onCheckData(WorkModel);
        if(!booleans){
            return;
        }
        //删除多余的元素
        WorkModel = this.onDeleteElement(WorkModel);
        WorkModel = this.onDeleteTableTitle(WorkModel);
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
        //将创建人改为大写
        WorkModel.Crname = WorkModel.Crname.trim().toUpperCase();
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
        oModel = this.onAddLieBiao(oModel, WorkModel.Iwerk,WorkModel.Ztype);
        oModel = sap.ui.controller("com.zhenergy.bill.view.GongZuoPiaoInitializePage").onTableTitle(oModel,WorkModel.Ztype);
        oModel.setProperty("/Title1","修改");
        oModel.setProperty("/Editable",true);
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
        delete WorkModel["ZhuanYe"];
        delete WorkModel["WERKS"];
        delete WorkModel["YunXingQuYu"];
        delete WorkModel["ZPMTOPER"];
        return WorkModel;
    },
    onAddLieBiao:function(oLocalModel,Iwerk,WorkType){
        jQuery.sap.require("jquery.sap.storage");
	    jQuery.sap.require("sap.m.MessageToast");
	    var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
	    //工厂
		if (oStorage.get("ZPMOFFLINE_SRV.WERKS")) {
			var oDataWerk = oStorage.get("ZPMOFFLINE_SRV.WERKS");
			oLocalModel.setProperty("/WERKS",oDataWerk);
		}
		//工作票类型
        if (oStorage.get("ZPMOFFLINE_SRV.WorkType")) {
			var oData = oStorage.get("ZPMOFFLINE_SRV.WorkType");
			var aFilter = [];
			for(var n=0;n<oData.length;n++){
			    if(oData[n].Iwerk==Iwerk){
			        aFilter.push(oData[n]);
			    }
			}
		    oLocalModel.setProperty("/WorkType",aFilter);
		}
		//工作单位 ZPMT00229C
        if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00229C")) {
			var oDataDanWei = oStorage.get("ZPMOFFLINE_SRV.ZPMT00229C");
			var aFilterDanWei = [];
			for(var l=0;l<oDataDanWei.length;l++){
			    if(oDataDanWei[l].Werks==Iwerk){
			        aFilterDanWei.push(oDataDanWei[l]);
			    }
			}
		    oLocalModel.setProperty("/DanWei",aFilterDanWei);
		}
		//班组 ZPMT00283 ZPMT00228
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00228")) {
			var oDataBanZu = oStorage.get("ZPMOFFLINE_SRV.ZPMT00228");
			var aFilterBanZu = [];
			for(var m=0;m<oDataBanZu.length;m++){
			    if(oDataBanZu[m].Werks==Iwerk){
			        aFilterBanZu.push(oDataBanZu[m]);
			    }
			}
		    oLocalModel.setProperty("/BanZu",aFilterBanZu);
		}
        //运行区域 ZPMT00227
        if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00227")) {
			var oDataYunXingQuYu = oStorage.get("ZPMOFFLINE_SRV.ZPMT00227");
			var aFilterYunXingQuYu = [];
			for(var g=0;g<oDataYunXingQuYu.length;g++){
			    if(oDataYunXingQuYu[g].Werks==Iwerk){
			        aFilterYunXingQuYu.push(oDataYunXingQuYu[g]);
			    }
			}
		    oLocalModel.setProperty("/YunXingQuYu",aFilterYunXingQuYu);
		}
        //机组 ZPMV00005
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMV00005")) {
			var oDataJiZu = oStorage.get("ZPMOFFLINE_SRV.ZPMV00005");
			var aFilterJiZu = [];
			for(var f=0;f<oDataJiZu.length;f++){
			    if(oDataJiZu[f].Werks==Iwerk){
			        aFilterJiZu.push(oDataJiZu[f]);
			    }
			}
		    oLocalModel.setProperty("/JiZu",aFilterJiZu);
		}
		//部门
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00229")) {
			var oDataBuMen = oStorage.get("ZPMOFFLINE_SRV.ZPMT00229");
			var aFilterBuMen = [];
			for(var x=0;x<oDataBuMen.length;x++){
			    if(oDataBuMen[x].Werks==Iwerk){
			        aFilterBuMen.push(oDataBuMen[x]);
			    }
			}
		    oLocalModel.setProperty("/BuMen",aFilterBuMen);
		}
		//专业
		if(oStorage.get("ZPMOFFLINE_SRV.ZPMT00230")){
		    var oDatazhuanYe = oStorage.get("ZPMOFFLINE_SRV.ZPMT00230");
		    var oFilterZy = [];
		    for(var u=0;u<oDatazhuanYe.length;u++){
		        if(oDatazhuanYe[u].Werks==Iwerk){
			        oFilterZy.push(oDatazhuanYe[u]);
			    }
		    }
		    oLocalModel.setProperty("/ZhuanYe",oFilterZy);
		}
		//封装部门负责人 ZPMTOPER
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMTPEOQUALI")) {
			var oDataPer = oStorage.get("ZPMOFFLINE_SRV.ZPMTPEOQUALI");
    		var aFilterPer = [];
			for(var e=0;e<oDataPer.length;e++){
			    if(oDataPer[e].Ztype==WorkType&&oDataPer[e].Quaid=="A"){
			        aFilterPer.push(oDataPer[e]);
			    }
			}
	        oLocalModel.setProperty("/ZPMTOPER",aFilterPer);
		}
		return oLocalModel;
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
        if(WorkModel.Crname==undefined|| WorkModel.Crname.trim()==""){
            sap.m.MessageBox.alert("开票人账号必填",{title: "提示"});
            return false;
        }
        if(WorkModel.CreateName==undefined||WorkModel.CreateName.trim()==""){
            sap.m.MessageBox.alert("开票人姓名必填",{title: "提示"});
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
        if(WorkModel.SPlace==undefined||WorkModel.SPlace.trim()==""){
            sap.m.MessageBox.alert("工作地点必填",{title: "提示"});
            return false;
        }
        if(WorkModel.SCont==undefined||WorkModel.SCont.trim()==""){
            sap.m.MessageBox.alert("工作内容必填",{title: "提示"});
            return false;
        }
        if(startWith!="S"){
            if(WorkModel.Appdep==""||WorkModel.Appdep==undefined){
                sap.m.MessageBox.alert("工作单位必填",{title: "提示"});
                return false;
            }
            if(WorkModel.Class==""||WorkModel.Class==undefined){
                sap.m.MessageBox.alert("班组必填",{title: "提示"}); 
                return false;
            }
        }
        if(WorkModel.Prfty==""||WorkModel.Prfty==undefined){
            sap.m.MessageBox.alert("专业必填",{title: "提示"});
            return false;
        }
        if(startWith!="S"){
            if(WorkModel.Rarea==""||WorkModel.Rarea==undefined){
                sap.m.MessageBox.alert("运行区域必填",{title: "提示"});
                return false;
            }
            if(WorkModel.Wbbz=="X"){//如果外包标记是“是”，必填
                if(WorkModel.Lxbm==undefined||WorkModel.Lxbm==""){
                    sap.m.MessageBox.alert("联系部门必填",{title: "提示"});
                    return false; 
                }
                if(WorkModel.Contact==undefined|| WorkModel.Contact.trim()==""){
                    sap.m.MessageBox.alert("联系人必填",{title: "提示"});
                    return false; 
                }
                if(WorkModel.Phone==undefined||WorkModel.Phone.trim()==""){
                    sap.m.MessageBox.alert("联系方式必填",{title: "提示"});
                    return false; 
                }
            }
            if(WorkModel.Unity==""||WorkModel.Unity==undefined){
                sap.m.MessageBox.alert("机组必填",{title: "提示"});
                return false;
            }
            if(WorkModel.Bname==""||WorkModel.Bname==undefined){
                sap.m.MessageBox.alert("工作负责人必填",{title: "提示"});
                return false;
            }
            if(WorkModel.Phone1==undefined||WorkModel.Phone1.trim()==""){
                sap.m.MessageBox.alert("联系方式必填",{title: "提示"});
                return false;
            }
        }
        if(WorkType=="RKP"){
           if(WorkModel.Xtcbh==""){
                sap.m.MessageBox.alert("需退出保护或装置名称必填",{title: "提示"});
                return false;
            } 
        }
        //判断GroupTab是否必填
        var GroupTab = WorkModel.GroupTab;
        var seqcs = [];
        if(GroupTab!=undefined&&GroupTab.length!=0){
            for(var i=0;i<GroupTab.length;i++){
                if(GroupTab[i].Seqc!=""&&GroupTab[i].Pname.trim()==""){
                    seqcs.push(GroupTab[i].Seqc);
                }
            }
            if(seqcs.length>0){
                sap.m.MessageBox.alert("序号为"+seqcs+"的"+WorkModel.TableTitle1+"不能为空",{title: "提示"});
                return;  
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
        if(WorkType=="DH1"||WorkType=="DH2"){
            if(WorkModel.RefWcmno==""){
                sap.m.MessageBox.alert("关联工作票号数必填",{title: "提示"});
                return false;
            }
        }
        if(WorkType=="DCC"||WorkType=="DQ1"||WorkType=="DQ2"||WorkType=="JBP"||WorkType=="JXD"||WorkType=="QXD"||WorkType=="RJP"||WorkType=="RKP"){
            if(WorkModel.Gzbzcynum.trim()==""){
                sap.m.MessageBox.alert("人数必填",{title: "提示"});
                return false;
            }
            if(WorkModel.Gzbzcynum.trim()!=""){
                var gbs = this.onCheckShuZi(WorkModel.Gzbzcynum);
                if(!gbs){
                   sap.m.MessageBox.alert("人数请输入合法数字",{title: "提示"});
                   return false;
                }
            }
        }
        if(WorkType=="DCC"||WorkType=="DQ1"||WorkType=="DQ2"||WorkType=="JBP"||WorkType=="RJP"||WorkType=="RKP"){
            if(WorkModel.Fynum.trim()==""){
                sap.m.MessageBox.alert("附页张数必填",{title: "提示"});
                return false;
            }
            var bs = this.onCheckShuZi(WorkModel.Fynum.trim());
            if(!bs){
               sap.m.MessageBox.alert("附页张数请输入合法数字",{title: "提示"});
               return false;
            }
        }
        
        var AQCSDataYInfo=sap.ui.getCore().getModel("AQCSDataYInfo").getData();
        console.log(AQCSDataYInfo);
        //检查Zsfjd是否填写
        var bZsfjd=true;
        if(WorkType=="DCC"||WorkType=="DQ1"||WorkType=="DQ2"||WorkType=="JBP"){
            //此时出现该字段
            bZsfjd=false;
            if(WorkModel.Zsfjd){
                if(WorkModel.Zsfjd.length>0)
                {
                    //此时该字段已被填写
                    bZsfjd=true;
                }
            }
        }
        if(!bZsfjd){
            sap.m.MessageBox.alert('“'+AQCSDataYInfo.Xtitle+'”标签下“是否需装接地线/接地闸刀”必填，请填写!',{title: "提示"});
           return false;
        } 
        //检查Zkghac是否填写
        var bZkghac=true;
        if(WorkType=="JBP"){
            //此时出现该字段
            bZkghac=false;
            if(WorkModel.Zkghac){
                if(WorkModel.Zkghac.length>0)
                {
                    //此时该字段已被填写
                    bZkghac=true;
                }
            }
        }
        if(!bZkghac){
            sap.m.MessageBox.alert('“'+AQCSDataYInfo.Ytitle+"”标签下“是否有开工后安措”必填，请填写。",{title: "提示"});
           return false;
        } 
        //检查 检修时提出按错表 是否每个代码组都填写了数据
        if(WorkType!="JXD"){
            var AQCSDataX=sap.ui.getCore().getModel("AQCSDataX").getData();
            var bAqcsTabX=true;
            var sInfoString="";
            var AqcsDictX={};
            if(WorkModel.AqcsTabX){
                if(WorkModel.AqcsTabX.length>0){
                    for(var i=0;i<WorkModel.AqcsTabX.length;i++){
                        if(WorkModel.AqcsTabX[i].Code){
                           if(WorkModel.AqcsTabX[i].Code.length>0){
                               //此时该安措代码在列表内
                               if(WorkModel.AqcsTabX[i].Actext){
                                   if(WorkModel.AqcsTabX[i].Actext.length>0){
                                       //此时该安措代码的实施内容不为空
                                       if(!AqcsDictX[WorkModel.AqcsTabX[i].Code]){
                                           AqcsDictX[WorkModel.AqcsTabX[i].Code]=true;
                                       }
                                   }else{
                                       //此时该安措代码的实施内容为空
                                       AqcsDictX[WorkModel.AqcsTabX[i].Code]=false;
                                   }
                               }else{
                                   //此时该安措代码的实施内容为空
                                   AqcsDictX[WorkModel.AqcsTabX[i].Code]=false;
                               }
                           } 
                        }
                    }
                }
            }
            for(var i=0;i<AQCSDataX.length;i++){
                if(!AqcsDictX[AQCSDataX[i].Code]){
                    bAqcsTabX=false;
                    sInfoString+=AQCSDataX[i].Code+"、"
                }
            }
            //console.log(WorkModel.AqcsTabX);
            if(!bAqcsTabX){
                sap.m.MessageBox.alert('“'+AQCSDataYInfo.Xtitle+"”标签下代码为"+sInfoString.substring(0,sInfoString.length-1)+"的安措必须填写安措内容，若无该安措请填“无”！",{title: "提示"});
               return false;
            }
        }

        //检查 运行时提出按错表 是否每个代码组都填写了数据
        if(WorkType=="JBP"||WorkType=="DH1"||WorkType=="DH2"){
            var AQCSDataY=sap.ui.getCore().getModel("AQCSDataY").getData();
            var bAqcsTabY=true;
            var sInfoString="";
            var AqcsDictY={};
            if(WorkModel.AqcsTabY){
                if(WorkModel.AqcsTabY.length>0){
                    for(var i=0;i<WorkModel.AqcsTabY.length;i++){
                        if(WorkModel.AqcsTabY[i].Code){
                           if(WorkModel.AqcsTabY[i].Code.length>0){
                               if(!AqcsDictY[WorkModel.AqcsTabY[i].Code]){
                                   AqcsDictY[WorkModel.AqcsTabY[i].Code]=true;
                               }
                           } 
                        }
                    }
                }
            }
            for(var i=0;i<AQCSDataY.length;i++){
                if(!AqcsDictY[AQCSDataY[i].Code]){
                    bAqcsTabY=false;
                    sInfoString+=AQCSDataY[i].Code+"、"
                }
            }
            //console.log(WorkModel.AqcsTabX);
            if(!bAqcsTabY){
                sap.m.MessageBox.alert('“'+AQCSDataYInfo.Ytitle+"”标签下代码为"+sInfoString.substring(0,sInfoString.length-1)+"的安措必须填写安措内容，若无该安措请填“无”！",{title: "提示"});
               return false;
            }
        }

        
        return true;
    },
    onCheckShuZi:function(str){
        var re = /^[0-9]+.?[0-9]*$/;
         if (!re.test(str))
        {
            return false;
        }
        return true;
    },
    onDeleteTableTitle:function(WorkModel){
        delete WorkModel["TableTitle1"];
        delete WorkModel["TableTitle2"];
        return WorkModel;
    }


});