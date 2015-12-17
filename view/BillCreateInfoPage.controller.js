sap.ui.controller("com.zhenergy.bill.view.BillCreateInfoPage", {
    onSubmitBillInfo:function(){
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
        
        // oStorage.put("ZPMOFFLINE_SRV."+"_Info_"+payLoad.Zczph,tableDataNew);
        // var s=window.localStorage;
        // s.setItem("ZpmtOper001" objStr);//ZPMT_OPER
        // var oJsonModel = new sap.ui.model.json.JSONModel(oData);
        // oStorage.put(oJsonModel.getData().results[0].__metadata.type, oJsonModel.getData().results);
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
    },
    //收集桌面数据
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
    }

});