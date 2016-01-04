sap.ui.controller("com.zhenergy.bill.view.BillCreateInfoPage", {
    onFanHui:function(){
        sap.ui.getCore().byId("idBillApp").app.to("idBillOverLookPage");
    },
    onSubmitBillInfo:function(){
        // var payLoad = this.collectData();
        
        var newCaoZuoPiaoCreate = this.getView().getModel("newCaoZuoPiaoCreate").getData(); 
        console.log(newCaoZuoPiaoCreate);
        var tableData = newCaoZuoPiaoCreate.InfoTab;
        var BillInfoNew =[];
        for(var i=0;i<tableData.length;i++){
            if((tableData[i].Zzysx.trim()=="")&&(tableData[i].Zxh.trim()=="")&&(tableData[i].Zcznr.trim()=="")){
            }else{
                BillInfoNew.push(tableData[i]); 
            }
        }
        newCaoZuoPiaoCreate.InfoTab = BillInfoNew;
        var dangerousPointData = newCaoZuoPiaoCreate.DangerousTab;
        var dangerousPointDataNew = [];
        for(var j=0;j<dangerousPointData.length;j++){
            if((dangerousPointData[j].Dangno.trim()=="")&&(dangerousPointData[j].Zztext.trim()=="")
                &&(dangerousPointData[j].Zzremark.trim()=="")&&(dangerousPointData[j].Zzpltxt.trim()=="")){
            }else{
                dangerousPointDataNew.push(dangerousPointData[j]); 
            }
        }
        newCaoZuoPiaoCreate.DangerousTab=dangerousPointDataNew;
        //生成操作票号
        var LiuShuiId = this.uuid(8,10);
        var Zczph = "CZP"+newCaoZuoPiaoCreate.Iwerk+LiuShuiId;
        newCaoZuoPiaoCreate.Zczph = Zczph;
        //存入缓存
        jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var getStorage = oStorage.get("ZPMOFFLINE_SRV.BillInfos");
        if(getStorage){
            getStorage.push(newCaoZuoPiaoCreate);
            oStorage.put("ZPMOFFLINE_SRV.BillInfos",getStorage);
        }else{
            var dainQiBillIn = [];
            dainQiBillIn.push(newCaoZuoPiaoCreate);
            oStorage.put("ZPMOFFLINE_SRV.BillInfos",dainQiBillIn);
        }
        
        //根据票号查
        var getStorageNew = oStorage.get("ZPMOFFLINE_SRV.BillInfos");
        var newCaoZuoPiao = "";
        if(getStorageNew){
            for(var x=0;x<getStorageNew.length;x++){
                if(getStorageNew[x].Zczph==Zczph){
                    newCaoZuoPiao = getStorageNew[x];
                }
            }
        }
        //处理各操作项
        var queryModel3 = new sap.ui.model.json.JSONModel();

        //填写部门
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00229")) {
			var oData3 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00229");
			var aFilter3 = [];
			for(var m=0;m<oData3.length;m++){
			    if(oData3[m].Werks==newCaoZuoPiaoCreate.Iwerk){
			        aFilter3.push(oData3[m]);
			    }
			}
		    queryModel3.setProperty("/tianxieBuMenQuery3",aFilter3);
		}
		//班组
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00283")) {
			var oData2 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00283");
			var aFilter2 = [];
			for(var q=0;q<oData2.length;q++){
			    if(oData2[q].Werks==newCaoZuoPiaoCreate.Iwerk){
			        aFilter2.push(oData2[q]);
			    }
			}
		    queryModel3.setProperty("/banZuQuery3",aFilter2);
		}
		//运行区域
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMT00227")) {
			var oData1 = oStorage.get("ZPMOFFLINE_SRV.ZPMT00227");
			var aFilter = [];
			for(var w=0;w<oData1.length;w++){
			    if(oData1[w].Werks==newCaoZuoPiaoCreate.Iwerk){
			        aFilter.push(oData1[w]);
			    }
			}
		    queryModel3.setProperty("/yunXingQuYuQuery3",aFilter);
		}
		//机组
		if (oStorage.get("ZPMOFFLINE_SRV.ZPMV00005")) {
			var oData4 = oStorage.get("ZPMOFFLINE_SRV.ZPMV00005");
			var aFilter4 = [];
			for(var n=0;n<oData4.length;n++){
			    if(oData4[n].Werks==newCaoZuoPiaoCreate.Iwerk){
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
		//工厂
		if (oStorage.get("ZPMOFFLINE_SRV.WERKS")) {
			var oData5 = oStorage.get("ZPMOFFLINE_SRV.WERKS");
			queryModel3.setProperty("/WERKSQuery3",oData5);
		}
		//标题
		var Ztype = newCaoZuoPiaoCreate.Ztype;
  	    var ZtypeBiaoTi="";
		if(Ztype=="DQ"){
		    ZtypeBiaoTi = "电气操作票";
		}
		if(Ztype=="GL"){
		    ZtypeBiaoTi = "锅炉操作票";
		}
		if(Ztype=="HB"){
		    ZtypeBiaoTi = "环保操作票";
		}
		if(Ztype=="HX"){
		    ZtypeBiaoTi = "化学操作票";
		}
		if(Ztype=="QJ"){
		    ZtypeBiaoTi = "汽机操作票";
		}
		if(Ztype=="RK"){
		    ZtypeBiaoTi = "热控操作票";
		}
		if(Ztype=="RL"){
		    ZtypeBiaoTi = "燃料操作票";
		}
		if(Ztype=="ZS"){
		    ZtypeBiaoTi = "典型操作票";
		}
		queryModel3.setProperty("/biaoTi",ZtypeBiaoTi);
		sap.ui.getCore().setModel(queryModel3);
        newCaoZuoPiao.InfoTab=tableData;
        newCaoZuoPiao.DangerousTab=dangerousPointData;
        var oModel = new sap.ui.model.json.JSONModel(newCaoZuoPiao);
        sap.ui.getCore().byId("idBillApp").app.to("idBillUpdateInfoPage", newCaoZuoPiao);
    	var page = sap.ui.getCore().byId("idBillApp").app.getPage("idBillUpdateInfoPage");
		page.setModel(oModel,"newBillDetailUpdateInfoPage");
        sap.m.MessageBox.alert("保存成功");
    },
    //收集桌面数据
    collectData:function(){
        var dianQiGongChang = this.getView().byId("dianQiGongChang").getValue();
        var dianQiBanZu = this.getView().byId("dianQiBanZu").getSelectedKey();
        var dianQiLeiXing = this.getView().byId("dianQiLeiXing").getValue();
        var dianQiCaozuoLeiXing = this.getView().byId("dianQiCaozuoLeiXing").getSelectedKey();
        var dianQiCaoZuoXingZhi = this.getView().byId("dianQiCaoZuoXingZhi").getSelectedKey();
        var dianQiYunXingQuYu = this.getView().byId("dianQiYunXingQuYu").getSelectedKey();
        var dianQiJiZu = this.getView().byId("dianQiJiZu").getSelectedKey();
        var dianQiZhiBie = this.getView().byId("dianQiZhiBie").getSelectedKey();
        var dianQiZhuangTai = this.getView().byId("dianQiZhuangTai").getValue();
        var dianQiKaiPiaoRen = this.getView().byId("dianQiKaiPiaoRen").getText();
        var dianQiKaiPiaoRiQi = this.getView().byId("dianQiKaiPiaoRiQi").getText();
        var dianQiCaoZuoRenWu = this.getView().byId("dianQiCaoZuoRenWu").getValue();
        var dianQiBeiZhu = this.getView().byId("dianQiBeiZhu").getValue();
        var dianQiZhuanYe = this.getView().byId("dianQiZhuanYe").getSelectedKey();
        //key-----value
        var dianQiTianXieBuMen =this.getView().byId("dianQiTianXieBuMen")._sTypedChars;//填写部门
        var dianQiBanZus =this.getView().byId("dianQiBanZu")._sTypedChars;//班组
        var dianQiCaozuoLeiXings =this.getView().byId("dianQiCaozuoLeiXing")._sTypedChars;//操作类型
        var dianQiCaoZuoXingZhis =this.getView().byId("dianQiCaoZuoXingZhi")._sTypedChars;//操作性质
        var dianQiZhuanYes =this.getView().byId("dianQiZhuanYe")._sTypedChars;//专业
        var dianQiYunXingQuYus =this.getView().byId("dianQiYunXingQuYu")._sTypedChars;//运行区域
        var dianQiJiZus =this.getView().byId("dianQiJiZu")._sTypedChars;//机组
        var dianQiZhiBies =this.getView().byId("dianQiZhiBie")._sTypedChars;//值别
        //处理数据
        var gongChangId = dianQiGongChang.substr(0,4);
        var leiXingId = dianQiLeiXing.substr(0,2);
        var EstatId = dianQiZhuangTai.substr(0,2);
        var gongChangValue = dianQiGongChang.split(" ")[1];
        var leiXingValue = dianQiLeiXing.split(" ")[1];
        var EstatValue = dianQiZhuangTai.split(" ")[1];
        var buMenId="";
        var buMenValue="";
        if(dianQiTianXieBuMen!=undefined){
            buMenId = dianQiTianXieBuMen.split(" ")[0];
            buMenValue = dianQiTianXieBuMen.split(" ")[1];
        }
        var dianQiBanZuValue = "";
        if(dianQiBanZus!=undefined){
            dianQiBanZuValue= dianQiBanZus.split(" ")[1];
        }
        var CaozuoLeiXingValue = "";
        if(dianQiCaozuoLeiXings!=undefined){
            CaozuoLeiXingValue = dianQiCaozuoLeiXings.split(" ")[1];
        }
        var CaoZuoXingZhiValue = "";
        if(dianQiCaoZuoXingZhis!=undefined){
            CaoZuoXingZhiValue = dianQiCaoZuoXingZhis.split(" ")[1];
        }
        var ZhuanYesValue = "";
        if(dianQiZhuanYes!=undefined){
            ZhuanYesValue = dianQiZhuanYes.split(" ")[1];
        }
        var YunXingQuYuValue="";
        if(dianQiYunXingQuYus!=undefined){
            YunXingQuYuValue = dianQiYunXingQuYus.split(" ")[1];
        }
        var dianQiJiZuValue="";
        if(dianQiJiZus!=undefined){
            dianQiJiZuValue = dianQiJiZus.split(" ")[1];
        }
        var dianQiZhiBieValue="";
        if(dianQiZhiBies!=undefined){
            dianQiZhiBieValue = dianQiZhiBies.split(" ")[1];
        }
        //生成操作票号(流水号)
        var LiuShuiId = this.uuid(8,10);
        //获取当前计算机名称（获取不到）
        //收集操作内容tab中的数据
        var tableId = sap.ui.getCore().byId("BillCreateBaseInfoTab");
        var tableData = tableId.getModel().oData.modelData;
        var tableDataNew =[];
        for(var i=0;i<tableData.length;i++){
            if((tableData[i].Zzysx.trim()=="")&&(tableData[i].Zxh.trim()=="")&&(tableData[i].Zcznr.trim()=="")){
            }else{
                tableDataNew.push(tableData[i]); 
            }
        }
        //收集危险点
        var idDangerousPointTab = sap.ui.getCore().byId("idDangerousPointTab");
        var dangerousPointData = idDangerousPointTab.getModel().oData.dModelData;
        var dangerousPointDataNew = [];
        for(var j=0;j<dangerousPointData.length;j++){
            if((dangerousPointData[j].Dangno.trim()=="")&&(dangerousPointData[j].Zztext.trim()=="")
                &&(dangerousPointData[j].Zzremark.trim()=="")&&(dangerousPointData[j].Zzpltxt.trim()=="")){
            }else{
                dangerousPointDataNew.push(dangerousPointData[j]); 
            }
        }
        var payLoad ={
            Zczph:"CZP"+gongChangId+LiuShuiId,//ZCZPH
            Estat:EstatId,//ESTAT
            Cuser:dianQiKaiPiaoRen,//CUSER
            Cdata:dianQiKaiPiaoRiQi,//CDATA
            Appdep:buMenId,//填写部门
            Ztype:leiXingId,//ZTYPE
            Otype:dianQiCaozuoLeiXing,//OTYPE
            Unity:dianQiJiZu,//UNITY
            Dunum:dianQiZhiBie,//ZDUTY
            Rarea:dianQiYunXingQuYu,//RAREA
            Iwerk:gongChangId,//BHGBZ
            Ztask:dianQiCaoZuoRenWu,//ZTASK操作任务
            Zczfs:dianQiCaoZuoXingZhi,//ZCZFS操作性质
            Znote:dianQiBeiZhu,//ZNOTE备注
            Yxgroup:dianQiBanZu,//YXGROUP运行班组编码
            Prfty:dianQiZhuanYe,//专业
            statusText:"unCreated",
            Zlybnum:"",
            // Estxt:EstatValue,//状态value
            // Name1:gongChangValue,
            // Ztypedes:leiXingValue,
            // Appdepdec:buMenValue,
            // Yxgroupdec:dianQiBanZuValue,//班组Value
            // OtypeValue:CaozuoLeiXingValue,//操作类型value
            // ZczfsValue:CaoZuoXingZhiValue,//操作性质value
            // Prtxt:ZhuanYesValue,//专业Value
            // Rareadec:YunXingQuYuValue,//运行区域value
            // Untxt:dianQiJiZuValue,//机组Value
            // Dutxt:dianQiZhiBieValue,//值别Value
            InfoTab:tableDataNew,//InfoTab
            DangerousTab:dangerousPointDataNew//危险点分析
        };
        return payLoad;
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
    onPrintBillHead:function(){
        var payLoad = this.collectData();
        var dianQiGongChang = this.getView().byId("dianQiGongChang").getValue();//工厂
        var dianQiLeiXing = this.getView().byId("dianQiLeiXing").getValue();//类型
        var dianQiBanZuValue = this.getView().byId("dianQiBanZu")._sTypedChars;//班组
        var caoZuoLeiXing = this.getView().byId("dianQiCaozuoLeiXing")._sTypedChars;//操作类别
        var dianQiCaoZuoXingZhi = this.getView().byId("dianQiCaoZuoXingZhi")._sTypedChars;//操作性质
        var dianQiTianXieBuMen = this.getView().byId("dianQiTianXieBuMen")._sTypedChars;//填写部门
        var dianQiYunXingQuYu = this.getView().byId("dianQiYunXingQuYu")._sTypedChars;//运营区域
        var dianQiJiZu = this.getView().byId("dianQiJiZu")._sTypedChars;//机组
        var dianQiZhiBie = this.getView().byId("dianQiZhiBie")._sTypedChars;//值别
        var dianQiZhuangTai = this.getView().byId("dianQiZhuangTai").getValue();//状态
        var Ztask = payLoad.Ztask;
        var Ztasktmp=Ztask.replace(/\n/g,'');
        if(dianQiBanZuValue==undefined){
            dianQiBanZuValue="";
        }
        if(caoZuoLeiXing==undefined){
            caoZuoLeiXing="";
        }
        if(dianQiCaoZuoXingZhi==undefined){
            dianQiCaoZuoXingZhi="";
        }
        if(dianQiTianXieBuMen==undefined){
            dianQiTianXieBuMen="";
        }
        if(dianQiYunXingQuYu==undefined){
            dianQiYunXingQuYu="";
        }
        if(dianQiJiZu==undefined){
            dianQiJiZu="";
        }
        if(dianQiZhiBie==undefined){
            dianQiZhiBie="";
        }
        var dianQiGongChangSplit = "";
        if(dianQiGongChang){
            dianQiGongChangSplit = dianQiGongChang.split(" ")[1];
        }
        var dianQiLeiXingSplit = "";
        if(dianQiLeiXing){
            dianQiLeiXingSplit = dianQiLeiXing.split(" ")[1];
        }
        var tableHead = "<center><h1>"+dianQiGongChangSplit+"<br/>";
        tableHead+=dianQiLeiXingSplit+"</h1></center><br/>"; 
        tableHead+="<div style='margin-left:70%;'>编号:</div>";
        return tableHead;
        
    },
    onPrintBillInfo:function(){
        //var tableHead = this.onPrintBillHead();
        // var payLoad = this.collectData();
        // var InfoTab = payLoad.InfoTab;
        var dianQiGongChang = this.getView().byId("dianQiGongChang").getValue();//工厂
        var dianQiGongChangSplit = "";
        if(dianQiGongChang){
            dianQiGongChangSplit = dianQiGongChang.split(" ")[1];
        }
        var dianQiLeiXing = this.getView().byId("dianQiLeiXing").getValue();//类型
        var dianQiLeiXingSplit = "";
        if(dianQiLeiXing){
            dianQiLeiXingSplit = dianQiLeiXing.split(" ")[1];
        }
        // var tableHead = "<center><h1>"+dianQiGongChangSplit+"<br/>";
        // tableHead+=dianQiLeiXingSplit+"</h1></center><br/>"; 
        var table="<html><head><title>"+dianQiGongChangSplit+dianQiLeiXingSplit+"</title></head>";
        table+="<body><div style='margin-left:70%;'>编号:</div>";
        var payLoad = this.getView().getModel("newCaoZuoPiaoCreate").getData(); 
        var InfoTab = payLoad.InfoTab;
        var i;
        if(InfoTab.length!=0){
            var Znote = payLoad.Znote;
            var Znotetmp=Znote.replace(/\n/g,'');
            table+="<table width='900px'>";
            table+="<tr><td style='border:1px solid black;' colspan='12'>"
                    +"<h3>操作开始时间:<br/>操作结束时间:</h3>"
                    +"</td></tr>";
            table+="<tr><td style='border:1px solid black;' colspan='2' width='50px'><h3>发令人:</h3></td>"
                    +"<td style='border:1px solid black;' colspan='2' width='60px'></td>"
                    +"<td style='border:1px solid black;' colspan='2' width='50px'><h3>受令人:</h3></td>"
                    +"<td style='border:1px solid black;' colspan='2' width='60px'></td>"
                    +"<td style='border:1px solid black;' colspan='2' width='50px'><h3>发令时间:</h3></td>"
                    +"<td style='border:1px solid black;' colspan='2' width='60px'></td>"
                    +"</tr>"
                    +"<tr>"
                    +"<td colspan='6' style='border:1px solid black;'><h3>操作类型:</h3></td><td colspan='6' style='border:1px solid black;'><h3>单人操作</h3></td>"
                    +"</tr>"
            table+="<tr><td colspan='12' style='border:1px solid black;' colspan='3'><h3>操作任务:"+Znotetmp+"</h3></td></tr>";
            table+="<tr><td style='border:1px solid black;' width='40px' ><h3>√</h3></td><td style='border:1px solid black;'><center><h3>序号</h3></center></td><td style='border:1px solid black;'  colspan='7'><h3><center>操作内容</center></h3></td><td style='border:1px solid black;'  colspan='3'><h3><center>注意事项</center></h3></td></tr>";
            var tableDataNew =[];
            for(var i=0;i<InfoTab.length;i++){
                if((InfoTab[i].Zzysx.trim()=="")&&(InfoTab[i].Zxh.trim()=="")&&(InfoTab[i].Zcznr.trim()=="")){
                }else{
                    tableDataNew.push(InfoTab[i]); 
                }
            }
            for(i=0;i<tableDataNew.length;i++){
                var Zcznr = tableDataNew[i].Zcznr;
                var Zcznrtmp=Zcznr.replace(/\n/g,'');
                var Zzysx = tableDataNew[i].Zzysx;
                var Zzysxtmp=Zzysx.replace(/\n/g,'');
                table+="<tr><td style='border:1px solid black;' width='40px'></td><td style='border:1px solid black;'><center>"+tableDataNew[i].Zxh+"</center></td><td style='border:1px solid black;'  colspan='7'>"+Zcznrtmp+"</td><td style='border:1px solid black;'  colspan='3'>"+Zzysxtmp+"</td></tr>";
            }
            table+="<tr><td colspan='12' style='border:1px solid black;' colspan='3'><h3>备注:"+Znotetmp+"</h3></td></tr>";
            table+="</table>";
            table+="<div>"
            table+="<span>操作人:</span>"
            table+="<span style='margin-left:150px'>监护人:</span>"
            table+="<span style='margin-left:150px'>值班负责人:</span>"
            table+="<span style='margin-left:150px'>值长:</span>"
            table+="</div>";
            
        }
        table+"</body></html>";
        var wind = window.open();
        wind.document.write(table);
        wind.print();
        wind.close();
    },
    onPrintDangerousPoint:function(){
        var tableHead = this.onPrintBillHead();
        var payLoad = this.collectData();
        var DangerousTab = payLoad.DangerousTab;
        var i;
        if(DangerousTab.length!=0){
            var Ztask = payLoad.Ztask;
            var Ztasktmp=Ztask.replace(/\n/g,'');
            var Znote = payLoad.Znote;
            var Znotetmp=Znote.replace(/\n/g,'');
            var table="<table>";
            table+="<tr><td colspan='5' style='border:1px solid black;' colspan='3'><textarea rows='5' cols='116'>操作任务:"+Ztasktmp+"</textarea></td></tr>";
            table+="<tr><td colspan='5' style='border:1px solid black;'><center>危险点及预防控制措施</center></td></tr>";
            table+="<tr><td style='border:1px solid black;width:80px;'>序号</td><td style='border:1px solid black;width:190px;'>危险点</td><td style='border:1px solid black;width:190px'>危险后果</td><td style='border:1px solid black;width:250px'>预防控制措施</td><td width='100px' style='border:1px solid black;'>执行情况</td></tr>";

            for(i=0;i<DangerousTab.length;i++){
                var Zztext = DangerousTab[i].Zztext;
                var Zztexttmp=Zztext.replace(/\n/g,'');
                var Zzremark = DangerousTab[i].Zzremark;
                var Zzremarktmp=Zzremark.replace(/\n/g,'');
                var Zzpltxt = DangerousTab[i].Zzpltxt;
                var Zzpltxttmp= Zzpltxt.replace(/\n/g,'');
                table+="<tr><td style='border:1px solid black;'>"+DangerousTab[i].Dangno+"</td><td style='border:1px solid black;'><textarea rows='5' cols='24'>"+Zztexttmp+"</textarea></td>"+
                "<td style='border:1px solid black;'><textarea rows='5' cols='24'>"+Zzremarktmp+"</textarea></td><td style='border:1px solid black;'><textarea rows='5' cols='33'>"+Zzpltxttmp+"</textarea></td><td style='border:1px solid black;'></td></tr>";
            }
            table+="<tr><td colspan='5' style='border:1px solid black;' colspan='3'><textarea rows='3' cols='116'>备注:"+Znotetmp+"</textarea></td></tr>";
            table+="</table>";
            table+="<div>"
            table+="<span>操作人:</span>"
            table+="<span style='margin-left:150px'>监护人:</span>"
            table+="<span style='margin-left:150px'>值班负责人:</span>"
            table+="<span style='margin-left:150px'>值长:</span>"
            table+="</div>";
        }
        var wind = window.open();
        if(table==undefined){
            wind.document.write(tableHead);
        }else{
            wind.document.write(tableHead+table);
        }
        wind.print();
        wind.close();
    }

});