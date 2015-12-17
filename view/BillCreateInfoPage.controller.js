sap.ui.controller("com.zhenergy.bill.view.BillCreateInfoPage", {
    onSubmitBillInfo:function(){
        var payLoad = this.collectData();
        // console.log(payLoad);
        jQuery.sap.require("jquery.sap.storage");
		var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var getStorage = oStorage.get("ZPMOFFLINE_SRV.BillInfos");
        if(getStorage){
            getStorage.push(payLoad);
            oStorage.put("ZPMOFFLINE_SRV.BillInfos",getStorage);
        }else{
            var dainQiBillIn = [];
            dainQiBillIn.push(payLoad);
            oStorage.put("ZPMOFFLINE_SRV.BillInfos",dainQiBillIn);
        }
    },
    //收集桌面数据
    collectData:function(){
        // var dianQiCaoZuoPiaoHao = this.getView().byId("dianQiCaoZuoPiaoHao").getValue();
        var dianQiGongChang = this.getView().byId("dianQiGongChang").getValue();
        // var dianQiTianXieBuMen = this.getView().byId("dianQiTianXieBuMen").getSelectedKey();
        var dianQiBanZu = this.getView().byId("dianQiBanZu").getSelectedKey();
        // var dianQiBuHeGe = this.getView().byId("dianQiBuHeGe").getChecked();
        var dianQiLeiXing = this.getView().byId("dianQiLeiXing").getValue();
        var dianQiCaozuoLeiXing = this.getView().byId("dianQiCaozuoLeiXing").getSelectedKey();
        var dianQiCaoZuoXingZhi = this.getView().byId("dianQiCaoZuoXingZhi").getSelectedKey();
        // var dianQiXuYaoZhiZhangShenHe = this.getView().byId("dianQiXuYaoZhiZhangShenHe").getChecked();
        var dianQiYunXingQuYu = this.getView().byId("dianQiYunXingQuYu").getSelectedKey();
        var dianQiJiZu = this.getView().byId("dianQiJiZu").getSelectedKey();
        var dianQiZhiBie = this.getView().byId("dianQiZhiBie").getSelectedKey();
        var dianQiZhuangTai = this.getView().byId("dianQiZhuangTai").getValue();
        var dianQiKaiPiaoRen = this.getView().byId("dianQiKaiPiaoRen").getValue();
        var dianQiKaiPiaoRiQi = this.getView().byId("dianQiKaiPiaoRiQi").getValue();
        var dianQiCaoZuoRenWu = this.getView().byId("dianQiCaoZuoRenWu").getValue();
        var dianQiCaoZuoKaiShiShiJian = this.getView().byId("dianQiCaoZuoKaiShiShiJian").getValue();
        var dianQiCaoZuoJieShuShiJian = this.getView().byId("dianQiCaoZuoJieShuShiJian").getValue(); 
        var dianQiBeiZhu = this.getView().byId("dianQiBeiZhu").getValue();
        //处理数据
        var gongChangId = dianQiGongChang.substr(0,4);
        var leiXingId = dianQiLeiXing.substr(0,2);
        var EstatId = dianQiZhuangTai.substr(0,2);
        var Sdate="";
        var Stime="";
        if(dianQiCaoZuoKaiShiShiJian!=""){
            var dateTime = dianQiCaoZuoKaiShiShiJian.split(" ");
            Sdate=dateTime[0];
            Stime=dateTime[1];
        }
        var Edate="";
        var Etime="";
        if(dianQiCaoZuoJieShuShiJian!=""){
            var dateTimeE = dianQiCaoZuoJieShuShiJian.split(" ");
            Edate=dateTimeE[0];
            Etime=dateTimeE[1];
        }
        //生成操作票号(流水号)
        var LiuShuiId = this.uuid(8,10);
        //获取当前计算机名称（获取不到）
        //收集操作内容tab中的数据
        var tableId = sap.ui.getCore().byId("BillBaseInfoTab");
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
            Ztype:leiXingId,//ZTYPE
            Otype:dianQiCaozuoLeiXing,//OTYPE
            Unity:dianQiJiZu,//UNITY
            Zduty:dianQiZhiBie,//ZDUTY
            Rarea:dianQiYunXingQuYu,//RAREA
            Bhgbz:gongChangId,//BHGBZ
            Sdate:Sdate,//SDATE操作开始日期
            Stime:Stime,//STIME操作开始时间
            Edate:Edate,//EDATE操作结束日期
            Etime:Etime,//ETIME操作结束时间
            Ztask:dianQiCaoZuoRenWu,//ZTASK操作任务
            Zczfs:dianQiCaoZuoXingZhi,//ZCZFS操作性质
            Znote:dianQiBeiZhu,//ZNOTE备注
            Yxgroup:dianQiBanZu,//YXGROUP运行班组编码
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
        
        var tableHead = "<table>";
        tableHead+="<tr>"+
                "<td width='80px'>操作票号:</td><td width='100px'>"+payLoad.Zczph+"</td><td width='80px'>工厂:</td><td width='200px'><textarea rows='2' cols='25'>"+dianQiGongChang+"</textarea></td><td width='100px'>填写部门:</td><td width='80px'><textarea rows='2' cols='20'>"+dianQiTianXieBuMen+"</textarea></td><td width='50px'>班组:</td><td width='100px'><textarea rows='2' cols='20'>"+dianQiBanZuValue+"</textarea></td>"
                +"</tr>"
                +"<tr>"
                +"<td>类型:</td><td>"+dianQiLeiXing+"</td><td>操作类型:</td><td>"+caoZuoLeiXing+"</td><td>操作性质:</td><td>"+dianQiCaoZuoXingZhi+"</td>"
                +"</tr>"
                +"<tr>"
                +"<td>运行区域:</td><td>"+dianQiYunXingQuYu+"</td><td>机组:</td><td>"+dianQiJiZu+"</td><td>值别:</td><td>"+dianQiZhiBie+"</td><td>状态:</td><td>"+dianQiZhuangTai+"</td>"
                +"</tr>"
                +"<tr>"
                +"<td>开票人:</td><td>"+payLoad.Cuser+"</td><td>开票日期:</td><td>"+payLoad.Cdata+"</td><td >操作任务:</td><td rowspan = '4' colspan='3'  ><textarea rows='5' cols='25'>"+Ztasktmp+"</textarea></td>"
                +"</tr>"
                +"<tr>"
                +"<td>操作开始时间:</td><td>"+payLoad.Sdate+" "+payLoad.Stime+"</td><td>操作结束时间:</td><td>"+payLoad.Edate+" "+payLoad.Etime+"</td>"
                +"</tr>"
                +"</table>";
        return tableHead;
        
    },
    onPrintBillInfo:function(){
        var tableHead1 = "<center><h3>创建电气操作票</h3></center><br/>";

        var tableHead = this.onPrintBillHead();
        var payLoad = this.collectData();
        var InfoTab = payLoad.InfoTab;
        var i;
        if(InfoTab.length!=0){
            var table="<table>";
            for(i=0;i<InfoTab.length;i++){
                var Zcznr = InfoTab[i].Zcznr;
                var Zcznrtmp=Zcznr.replace(/\n/g,'');
                var Zzysx = InfoTab[i].Zzysx;
                var Zzysxtmp=Zzysx.replace(/\n/g,'');
                table+="<tr><td style='border:1px solid black;width:50px;'>"+InfoTab[i].Zxh+"</td><td style='border:1px solid black;width:300px;'><textarea rows='5' cols='50'>"+Zcznrtmp+"</textarea></td><td style='border:1px solid black;width:300px'><textarea rows='5' cols='50'>"+Zzysxtmp+"</textarea></td></tr>";
            }
            table+="</table>";
        }
        var wind = window.open("", "printWindow", "height=768,width=1024,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no");
        if(table==undefined){
            wind.document.write(tableHead1+tableHead);
        }else{
            wind.document.write(tableHead1+tableHead+table);
        }
        wind.print();
        wind.close();
    },
    onPrintDangerousPoint:function(){
        var tableHead1 = "<center><h3>创建电气操作票--危险点</h3></center><br/>";
        var tableHead = this.onPrintBillHead();
        var payLoad = this.collectData();
        var DangerousTab = payLoad.DangerousTab;
        var i;
        if(DangerousTab.length!=0){
            var table="<table>";
            for(i=0;i<DangerousTab.length;i++){
                var Zztext = DangerousTab[i].Zztext;
                var Zztexttmp=Zztext.replace(/\n/g,'');
                var Zzremark = DangerousTab[i].Zzremark;
                var Zzremarktmp=Zzremark.replace(/\n/g,'');
                var Zzpltxt = DangerousTab[i].Zzpltxt;
                var Zzpltxttmp= Zzpltxt.replace(/\n/g,'');
                table+="<tr><td style='border:1px solid black;width:50px;'>"+DangerousTab[i].Dangno+"</td><td style='border:1px solid black;width:300px;'><textarea rows='5' cols='50'>"+Zztexttmp+"</textarea></td><td style='border:1px solid black;width:300px'><textarea rows='5' cols='50'>"+Zzremarktmp+"</textarea></td><td style='border:1px solid black;width:300px'><textarea rows='5' cols='50'>"+Zzpltxttmp+"</textarea></td></tr>";
            }
            table+="</table>";
        }
        var wind = window.open("", "printWindow", "height=768,width=1024,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no");
        if(table==undefined){
            wind.document.write(tableHead1+tableHead);
        }else{
            wind.document.write(tableHead1+tableHead+table);
        }
        wind.print();
        wind.close();
    }

});