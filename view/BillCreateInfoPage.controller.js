sap.ui.controller("com.zhenergy.bill.view.BillCreateInfoPage", {
    onSubmitBillInfo:function(){
        var payLoad = this.collectData();
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
        var dianQiGongChang = this.getView().byId("dianQiGongChang").getValue();
        var dianQiBanZu = this.getView().byId("dianQiBanZu").getSelectedKey();
        var dianQiLeiXing = this.getView().byId("dianQiLeiXing").getValue();
        var dianQiCaozuoLeiXing = this.getView().byId("dianQiCaozuoLeiXing").getSelectedKey();
        var dianQiCaoZuoXingZhi = this.getView().byId("dianQiCaoZuoXingZhi").getSelectedKey();
        var dianQiYunXingQuYu = this.getView().byId("dianQiYunXingQuYu").getSelectedKey();
        var dianQiJiZu = this.getView().byId("dianQiJiZu").getSelectedKey();
        var dianQiZhiBie = this.getView().byId("dianQiZhiBie").getSelectedKey();
        var dianQiZhuangTai = this.getView().byId("dianQiZhuangTai").getValue();
        var dianQiKaiPiaoRen = this.getView().byId("dianQiKaiPiaoRen").getValue();
        var dianQiKaiPiaoRiQi = this.getView().byId("dianQiKaiPiaoRiQi").getValue();
        var dianQiCaoZuoRenWu = this.getView().byId("dianQiCaoZuoRenWu").getValue();
        var dianQiBeiZhu = this.getView().byId("dianQiBeiZhu").getValue();
        //处理数据
        var gongChangId = dianQiGongChang.substr(0,4);
        var leiXingId = dianQiLeiXing.substr(0,2);
        var EstatId = dianQiZhuangTai.substr(0,2);
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
            Dunum:dianQiZhiBie,//ZDUTY
            Rarea:dianQiYunXingQuYu,//RAREA
            Iwerk:gongChangId,//BHGBZ
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
        var tableHead = this.onPrintBillHead();
        var payLoad = this.collectData();
        var InfoTab = payLoad.InfoTab;
        var i;
        if(InfoTab.length!=0){
            var Znote = payLoad.Znote;
            var Znotetmp=Znote.replace(/\n/g,'');
            var table="<table>";
            table+="<tr><td style='border:1px solid black;' colspan='12'>"
                    +"<h4>操作开始时间:<br/>操作结束时间:</h4>"
                    +"</td></tr>";
            table+="<tr><td style='border:1px solid black;' colspan='2' width='100px'>发令人:</td>"
                    +"<td style='border:1px solid black;' colspan='2'><textarea rows='3' cols='28'></textarea></td>"
                    +"<td style='border:1px solid black;' colspan='2' width='100px'>受令人:</td>"
                    +"<td style='border:1px solid black;' colspan='2'><textarea rows='3' cols='21'></textarea></td>"
                    +"<td style='border:1px solid black;' colspan='2' width='100px'>发令时间:</td>"
                    +"<td style='border:1px solid black;' colspan='2'><textarea rows='3' cols='22'></textarea></td>"
                    +"</tr>"
                    +"<tr>"
                    +"<td colspan='6' style='border:1px solid black;'><textarea rows='4' cols='56'>操作类型:</textarea></td><td colspan='6' style='border:1px solid black;'><textarea rows='4' cols='63'>单人操作:</textarea></td>"
                    +"</tr>"
            table+="<tr><td colspan='12' style='border:1px solid black;' colspan='3'><textarea rows='3' cols='125'>操作任务:"+Znotetmp+"</textarea></td></tr>";
            table+="<tr><td style='border:1px solid black;' width='40px'></td><td style='border:1px solid black;'><center>序号</center></td><td style='border:1px solid black;'  colspan='7'><center>操作内容</center></td><td style='border:1px solid black;'  colspan='3'><center>注意事项</center></td></tr>";

            for(i=0;i<InfoTab.length;i++){
                var Zcznr = InfoTab[i].Zcznr;
                var Zcznrtmp=Zcznr.replace(/\n/g,'');
                var Zzysx = InfoTab[i].Zzysx;
                var Zzysxtmp=Zzysx.replace(/\n/g,'');
                table+="<tr><td style='border:1px solid black;' width='40px'></td><td style='border:1px solid black;'><center>"+InfoTab[i].Zxh+"</center></td><td style='border:1px solid black;'  colspan='7'><textarea rows='4' cols='75'>"+Zcznrtmp+"</textarea></td><td style='border:1px solid black;'  colspan='3'><textarea rows='4' cols='31'>"+Zzysxtmp+"</textarea></td></tr>";
            }
            table+="<tr><td colspan='12' style='border:1px solid black;' colspan='3'><textarea rows='3' cols='125'>备注:"+Znotetmp+"</textarea></td></tr>";
            table+="</table>";
            table+="<div>"
            table+="<span>操作人:</span>"
            table+="<span style='margin-left:150px'>监护人:</span>"
            table+="<span style='margin-left:150px'>值班负责人:</span>"
            table+="<span style='margin-left:150px'>值长:</span>"
            table+="</div>";
        }
        var wind = window.open("", "printWindow", "height=768,width=1024,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no");
        if(table==undefined){
            wind.document.write(tableHead);
        }else{
            wind.document.write(tableHead+table);
        }
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
        var wind = window.open("", "printWindow", "height=768,width=1024,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no");
        if(table==undefined){
            wind.document.write(tableHead);
        }else{
            wind.document.write(tableHead+table);
        }
        wind.print();
        wind.close();
    }

});