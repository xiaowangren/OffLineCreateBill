sap.ui.controller("com.zhenergy.bill.view.PDFPrint", {
// DCC	电除尘专用工作票
// DH1	一级动火工作票
// DH2	二级动火工作票
// DQ1	电气第一种工作票
// DQ2	电气第二种工作票
// JBP	继电保护工作票
// JXD	检修作业通知单
// QXD	事故抢修单
// RJP	热力机械工作票
// RKP	热控工作票
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf com.zhenergy.bill.view.PDFPrint
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf com.zhenergy.bill.view.PDFPrint
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf com.zhenergy.bill.view.PDFPrint
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf com.zhenergy.bill.view.PDFPrint
*/
//	onExit: function() {
//
//	}
    //工厂文本
    onGetIwerkText:function(Iwerk){
        var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
        var werks = oStorage.get("ZPMOFFLINE_SRV.WERKS");
        for(var i=0;i<werks.length;i++){
            if(werks[i].Iwerk == Iwerk){
                return werks[i].Name1;
            }
        }
    },
    //工作票类型文本
    onGetTicketTypeText:function(Ztype){
        var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
        var oTickets = oStorage.get("ZPMOFFLINE_SRV.WorkType");
        for(var i=0;i<oTickets.length;i++){
            if(oTickets[i].Ztype == Ztype){
                return oTickets[i].Ztypedes;
            }
        }
    },
    //工作单位文本
    onGetAppdepText:function(Appdep){
        var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
        var oData = oStorage.get("ZPMOFFLINE_SRV.ZPMT00229C");
        for(var i=0;i<oData.length;i++){
            if(oData[i].Appdep == Appdep){
                return oData[i].Appdepdec;
            }
        }
    },
    //工作票班组文本
    onGetClassDec:function(Class){
        var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
        var oData = oStorage.get("ZPMOFFLINE_SRV.ZPMT00228");
        for(var i=0;i<oData.length;i++){
            if(oData[i].Class == Class){
                return oData[i].Classdec;
            }
        }
    },
    //工作票联系部门文本
    onGetLxbmText:function(Lxbm){
        var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
        var oData = oStorage.get("ZPMOFFLINE_SRV.ZPMT00229C");
        for(var i=0;i<oData.length;i++){
            if(oData[i].Appdep == Lxbm){
                return oData[i].Appdepdec;
            }
        }
    },
    //KKS文本
    onGetKksText:function(tplnr){
        // var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
        // var oData = oStorage.get("ZPMOFFLINE_SRV.KKS");
        // 改从IndexedDB 取数
        var KKSData =sap.ui.getCore().getModel("KKSData");
        var oData = KKSData.getProperty("/");
        for(var i=0;i<oData.length;i++){
            if(oData[i].Tplnr == tplnr){
                return oData[i].Pltxt;
            }
        }
    },
    getByteLen:function(val){ 
        //计算按半角为一个字符的长度，汉字算长度2
        var len = 0; 
        for (var i = 0; i < val.length; i++) { 
            if (val[i].match(/[^x00-xff]/ig) != null){ //全角2  半角1 
                len += 2; 
            }else{
                len += 1;
            }
        }
        return len; 
    },
    getUnderLineText:function(text,length){
        //根据总长，补充空格
        if(text){
            var textLength = this.getByteLen(text);
        }else{
            var textLength = 0;
            text="";
        }
        for( var i=0;i<length-textLength;i++){
            text = text + " ";
        }
        return text;
    },

    //打印通用方法（参数一：工作票类型，参数二：工作票Json）
    handleGzpPrint:function(gzpType,modelData){
        if(!modelData){
            return;
        }
        // console.log(modelData);
        var functionName = "this.onPrintGzp_" + gzpType;
        var printContent = eval(functionName+"(modelData);"); //动态调用函数
        
        var docDefinition = {
            pageMargins: [ 40, 60, 40, 60 ],        //页面边距
            content: printContent,
        	styles: {
        		header: {//大标题
        			fontSize: 18,
        			bold: false,
        			alignment: 'center',
        			color: 'black',
        			margin: [0, 10, 0, 15]      //表格里不生效
        		},
        		smallText: {//右上角印章文字
        			bold: false,
        			fontSize: 10,
        			color: 'black'
        		},
        		subheader: {//普通文本编号
        			fontSize: 12,
        			bold: false,
        			margin: [0, 0, 10, 10]
        		},
        		underLineText: {//下划线文本
        			fontSize: 12,
        			bold: false,
        // 			margin: [0, 3, 0, 5],
        			decoration: 'underline'
        		},
        		bodyTable: {//表格格式，主要是结束的margin
        		    fontSize: 12,
        			margin: [0, 0, 0, 10]
        		},
        		tableHeader: {//14号字的表格内容
        			bold: false,
        			fontSize: 12,
        			color: 'black'
        		}
        	},
            defaultStyle: {
                font: 'simfang'
            }
        };
	    pdfMake.fonts = {
           simfang: {
             normal: 'simfang.ttf',
             bold: 'simfang.ttf',
             italics: 'simfang.ttf',
             bolditalics: 'simfang.ttf'
           }
        };
        // open the PDF in a new window
         pdfMake.createPdf(docDefinition).open();
        // print the PDF (not working in this version, will be added back in a couple of days)
        // pdfMake.createPdf(docDefinition).print();
        // download the PDF
        // window.pdfmake.createPdf(docDefinition).download();
    },
    // DCC	电除尘专用工作票
    onPrintGzp_DCC:function(modelData){
        var iwerkText = this.onGetIwerkText(modelData.Iwerk);
        if(iwerkText){
            iwerkText = iwerkText.replace(/物资工厂/, '');
        }
        var ticketTypeText = this.onGetTicketTypeText(modelData.Ztype);
        var appDepdec = this.onGetAppdepText(modelData.Appdep);
        var classdec = this.onGetClassDec(modelData.Class);
        var lxbmText = this.onGetLxbmText(modelData.Lxbm);
        //全部结束章
        var qbjsPrintBody = [{
            					table: {
            							body: [[{text:'盖 “已执行” 章',style:'smallText'}]]
            					}
						    },'\n'];
        if(modelData.Zsfjd == '1'){
            qbjsPrintBody.push({
            					table: {
            							body: [[{text:'盖“全部结束”章',style:'smallText'}]]
            					}
						       });
        }
        //工作班组成员
        var groupPersons = "";
        for(var i=0;i<modelData.GroupTab.length;i++){
            if(i>0){
                groupPersons = groupPersons + "、";
            }
            groupPersons = groupPersons + modelData.GroupTab[i].Pname;
        }
        var groupPersonNum = modelData.GroupTab.length;
        var fuyeNum = modelData.KksTab.length;
        //安全措施
        var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
        var aqcsStorage = oStorage.get("ZPMOFFLINE_SRV.ZPMTQPCDT");
        var arrAqcs=[];
        for(var i=0;i<aqcsStorage.length;i++){
            if(aqcsStorage[i].Katalogart == 'X' && aqcsStorage[i].Ztype == modelData.Ztype ){
                arrAqcs.push([aqcsStorage[i].Code,aqcsStorage[i].Kurztext]);
            }
        }
        var aqcsBody1 = [];//集控部分
        var aqcsBody2 = [];//环保部分
        var currCode;
        var tmpNo1 = 0;
        var tmpNo2 = 0;
        var cn_no = ["一","二","三","四","五","六","七","八","九","十"];
        var aczxqk = "";
        for(var i=0;i<arrAqcs.length;i++){
            if(!currCode || currCode != arrAqcs[i][0]){
                currCode = arrAqcs[i][0];
            }
            if(tmpNo1 == 1 || tmpNo2 == 1){
                aczxqk = '安措执行情况\n(注明确实地点、名称及接地线编号)';
            }else{
                aczxqk = '安措执行情况';
            }
            for(var j=0;j<modelData.AqcsTabX.length;j++){
                if(currCode == modelData.AqcsTabX[j].Code){
                    if(modelData.AqcsTabX[j].Codegruppe == 'DCC001'){
                        if(modelData.AqcsTabX[j].Seqc == '1'){
                            //表头
                            aqcsBody1.push([ cn_no[tmpNo1],{text:arrAqcs[i][1],style:'tableHeader',alignment:'center'}, {text: aczxqk,style:'tableHeader', alignment:'center'}]);
                            tmpNo1 ++;
                        }
                        aqcsBody1.push([ modelData.AqcsTabX[j].Seqc, {text:modelData.AqcsTabX[j].Actext},{text:''} ]);
                    }else{
                        if(modelData.AqcsTabX[j].Seqc == '1'){
                            //表头
                            aqcsBody2.push([ cn_no[tmpNo2],{text:arrAqcs[i][1],style:'tableHeader',alignment:'center'}, {text: aczxqk,style:'tableHeader', alignment:'center'}]);
                            tmpNo2 ++;
                        }
                        aqcsBody2.push([ modelData.AqcsTabX[j].Seqc, {text:modelData.AqcsTabX[j].Actext},{text:''} ]);
                    }
                }
            }
        }
        // console.log(aqcsBody1);
        // console.log(aqcsBody2);
        //根据双签标识，生成第一项和第八项
        var formPart1 = [];
        var gzpqfr = [];
        formPart1.push([ '1.',{text:[ '工作单位：',{text: this.getUnderLineText(appDepdec, 28),style:'underLineText'}]}, 
									        {text:[ '班组：',{text: this.getUnderLineText(classdec, 34),style:'underLineText'}]} ]);
        formPart1.push([ '', {text:[ '工作负责人：',{text: this.getUnderLineText(modelData.Name, 26),style:'underLineText'}]},
									        {text:[ '联系方式：',{text: this.getUnderLineText(modelData.Phone1, 30),style:'underLineText'}]} ]);
        //双签标识
        if(modelData.Sqbz == true){
            formPart1.push([ '',{text:[ '联系部门：',{text: this.getUnderLineText(modelData.Lxbm, 16),style:'underLineText'},
							             '联系人：',{text: this.getUnderLineText(modelData.Contact, 20),style:'underLineText'},
        							     '联系方式：',{text: this.getUnderLineText(modelData.Phone, 18),style:'underLineText'}],colSpan:2}, {}]);
            gzpqfr.push([ '8.', {text:[ '外包单位签发人：',{text: this.getUnderLineText("", 22),style:'underLineText'}]}, {text:[ '签发时间：',
    									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
            gzpqfr.push([ '', {text:[ '业主签发人：',{text: this.getUnderLineText("", 26),style:'underLineText'}]}, {text:[ '签发时间：',
    									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
        }else{
            gzpqfr.push([ '8.', {text:[ '工作票签发人：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}, {text:[ '签发时间：',
    									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
        }
        formPart1.push([ '', {text:['工作班组成员（不包含工作负责人）',{text:this.getUnderLineText(groupPersons, 114),style:'underLineText'},
									        '等共',{text:this.getUnderLineText(groupPersonNum, 2),style:'underLineText'},'人，附页',
									        {text:this.getUnderLineText(fuyeNum, 2),style:'underLineText'},'张'],colSpan:2}, {} ]);
        var content = [
                {
					table: {
							widths: ['20%','60%','20%'],
							body: [
        							[ '', 
        							  {text: iwerkText+'\n'+ticketTypeText+"\n ", style: 'header'},
        							  qbjsPrintBody        //盖章标记
        							]
							]
					},
					layout: 'noBorders'
				},
                {text:'编号：DCC_2081_151203_001',style:'subheader',alignment:'right'},
                {
				// 	style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['2%','48%','50%'],
							body: formPart1
                    },
					layout: 'noBorders'
				},
				{
				// 	style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['2%','48%','50%'],
							body: [
									[ '2.', {text:[ '工作地点：',{text: this.getUnderLineText(modelData.SPlace, 73),style:'underLineText'}],colSpan:2}, {}],
									[ '', {text:[ '工作内容：',{text: this.getUnderLineText(modelData.SCont, 73),style:'underLineText'}],colSpan:2}, {}],
									[ '3.', {text:[ '工作计划开始时间：',
									        {text: this.getUnderLineText(modelData.Jhgzbedate.substring(0,4), 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText(modelData.Jhgzbedate.substring(5,7), 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText(modelData.Jhgzbedate.substring(8,10), 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText(modelData.Jhgzbetime.substring(0,2), 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText(modelData.Jhgzbetime.substring(3,5), 2),style:'underLineText'},'分'],colSpan:2}, {}],
									[ '', {text:[ '工作计划完成时间：',
									        {text: this.getUnderLineText(modelData.Jhgzfidate.substring(0,4), 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText(modelData.Jhgzfidate.substring(5,7), 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText(modelData.Jhgzfidate.substring(8,10), 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText(modelData.Jhgzfitime.substring(0,2), 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText(modelData.Jhgzfitime.substring(3,5), 2),style:'underLineText'},'分'],colSpan:2}, {}],
        							[ '4.', {text:'安全措施（集控部分）',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
                {
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['2%','58%','40%'],
							body: aqcsBody1
					}
				},
				{
				// 	style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ '5.', {text:'集控补充安全措施',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
				{
					style: 'bodyTable',
					table: {
							widths: ['2%','58%','40%'],
							body: [
									[ '序号',{text:'集控运行值班人员补充的安全措施',style:'tableHeader',alignment:'center'}, {text: '补充安措执行情况',style:'tableHeader', alignment:'center'}],
									[ '1', {text:''},{text:''} ]
							]
					}
				},
				{
				// 	style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ '6.', {text:'安全措施（环保部分）',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
                {
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['2%','58%','40%'],
							body: aqcsBody2
					}
				},
				{
				// 	style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ '7.', {text:'环保补充安全措施',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
				{
					style: 'bodyTable',
					table: {
							widths: ['2%','58%','40%'],
							body: [
									[ '序号',{text:'环保运行值班人员补充的安全措施',style:'tableHeader',alignment:'center'}, {text: '补充安措执行情况',style:'tableHeader', alignment:'center'}],
									[ '1', {text:''},{text:''} ]
							]
					}
				},
				{
				    // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: gzpqfr
					},
					layout: 'noBorders'
				},
				{
				    // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        						    [ '9.', {text:[ '集控接票人：',{text: this.getUnderLineText("", 26),style:'underLineText'}]}, {text:[ '接票时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        						    [ '', {text:[ '环保接票人：',{text: this.getUnderLineText("", 26),style:'underLineText'}]}, {text:[ '接票时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        							[ '', {text:[ '批准工作开始时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}],
									[ '', {text:[ '批准工作结束时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}],
        							[ '', {text:[ '值长：',{text: this.getUnderLineText("", 32),style:'underLineText'}]}, {text:[ '签字时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
									[ '10.', {text:[ '上述集控安全措施已全部执行完毕，核对无误，从',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分许可工作'],colSpan:2}, {}],
        							[ '',{text:[ '集控工作许可人：',{text: this.getUnderLineText("", 22),style:'underLineText'}]},
        							     {text:[ '工作负责人：',{text: this.getUnderLineText("", 28),style:'underLineText'}]}],
									[ '11.', {text:[ '上述环保安全措施已全部执行完毕，核对无误，从',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分许可工作'],colSpan:2}, {}],
        							[ '',{text:[ '环保工作许可人：',{text: this.getUnderLineText("", 22),style:'underLineText'}]},
        							     {text:[ '工作负责人：',{text: this.getUnderLineText("", 28),style:'underLineText'}]}],
        							[ '12.', {text:'确认工作负责人布置的工作任务和安全措施：',colSpan:2}, {}],
        							[ '', {text:[ '工作组成员签名：',{text: this.getUnderLineText("", 67),style:'underLineText'}],colSpan:2}, {}],
        							[ '13.', {text:'工作负责人变更：',colSpan:2}, {}],
        							[ '', {text:[ '自',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分原工作负责人',
        									{text: this.getUnderLineText("", 14),style:'underLineText'},'离去，变更',
        									{text: this.getUnderLineText("", 14),style:'underLineText'}],colSpan:2}, {}],
        						    [ '', {text:[ '为工作负责人，变更后工作负责人联系方式：',{text: this.getUnderLineText("", 43),style:'underLineText'}],colSpan:2}, {}],
							        [ '',{text:[ '工作票签发人：',{text: this.getUnderLineText("", 12),style:'underLineText'},
							             '环保工作许可人：',{text: this.getUnderLineText("", 12),style:'underLineText'},
        							     '集控工作许可人：',{text: this.getUnderLineText("", 12),style:'underLineText'}],colSpan:2}, {}],
        							[ '14.', {text:[ '工作人员变动情况（变动人员姓名、日期及时间）：',{text: this.getUnderLineText("", 37),style:'underLineText'}],colSpan:2}, {}],
        							[ '', {text:[ '工作负责人签名：',{text: this.getUnderLineText("", 67),style:'underLineText'}],colSpan:2}, {}],
        							[ '15.', {text:'工作票延期：',colSpan:2}, {}],
        							[ '', {text:[ '有效期延长到：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分      工作签发人：',
        									{text: this.getUnderLineText("", 14),style:'underLineText'}],colSpan:2}, {}],
        							[ '',{text:[ '值长：',{text: this.getUnderLineText("", 34),style:'underLineText'}]},
        							     {text:[ '工作负责人：',{text: this.getUnderLineText("", 28),style:'underLineText'}]}],
        							[ '16.', {text:'根据工作需要，工作票押回运行保管：',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
				{
					style: 'bodyTable',
					table: {
							widths: ['30%','18%','18%','18%','16%'],
							body: [
									[ {text:'工作票交回运行人员时间',alignment:'center'},
									  {text:'集控工作许可人',alignment:'center'},
									  {text: '环保工作许可人', alignment:'center'},
									  {text: '工作负责人', alignment:'center'},
									  {text: '押回原因', alignment:'center'}],
									[ '\n', {text:''},{text:''},'',''],
									[ '\n', {text:''},{text:''},'',''],
									[ '\n', {text:''},{text:''},'',''],
									[ '\n', {text:''},{text:''},'',''],
									[ '\n', {text:''},{text:''},'','']
							]
					}
				},
				{
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ '17.', {text:'根据工作需要，工作票所列安全措施已全部执行，可重新工作：',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
				{
					style: 'bodyTable',
					table: {
							widths: ['30%','18%','18%','18%','16%'],
							body: [
									[ {text:'允许恢复工作时间',alignment:'center'},
									  {text:'集控工作许可人',alignment:'center'},
									  {text: '环保工作许可人', alignment:'center'},
									  {text: '工作负责人', alignment:'center'},
									  {text: '工作重新许可原因', alignment:'center'}],
									[ '\n', {text:''},{text:''},'',''],
									[ '\n', {text:''},{text:''},'',''],
									[ '\n', {text:''},{text:''},'',''],
									[ '\n', {text:''},{text:''},'',''],
									[ '\n', {text:''},{text:''},'','']
							]
					}
				},
				{
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ '18.', {text:'工作终结：',colSpan:2}, {}],
        							[ '', {text:[ '全部工作于',
							        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
									{text: this.getUnderLineText("", 4),style:'underLineText'},'分结束，设备及安全措施已恢复至开工状态，'],colSpan:2}, {}],
									[ '', {text:'工作人员已全部撤离，材料工具已清理完毕，电除尘人孔门已全部关闭。',colSpan:2}, {}],
									[ '', {text:[ '工作负责人：',{text: this.getUnderLineText("", 26),style:'underLineText'}]}, {text:[ '时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        							[ '', {text:[ '环保工作许可人：',{text: this.getUnderLineText("", 22),style:'underLineText'}]}, {text:[ '时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
									[ '', {text:[ '集控工作许可人：',{text: this.getUnderLineText("", 22),style:'underLineText'}]}, {text:[ '时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        							[ '19.', {text:'工作票终结：',colSpan:2}, {}],
        							[ '', {text:[ '临时遮栏、标示牌已拆除，常设遮栏已恢复。已拆除（或已拉开）的接地线、接地闸刀（小车）共：',{text: this.getUnderLineText("", 8),style:'underLineText'},
        							              '副（台），已汇报值班负责人。'],colSpan:2}, {}],
        							[ '', {text:[ '拆除时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2},{}],
        							[ '',{text:[ '工作许可人：',{text: this.getUnderLineText("", 28),style:'underLineText'}]},
        							     {text:[ '值班负责人：',{text: this.getUnderLineText("", 28),style:'underLineText'}]}],
        							[ '20.', {text:'备注：',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				}
			];
        return content;
    },
    // DH1	一级动火工作票
    onPrintGzp_DH1:function(modelData){
        var iwerkText = this.onGetIwerkText(modelData.Iwerk);
        if(iwerkText){
            iwerkText = iwerkText.replace(/物资工厂/, '');
        }
        var ticketTypeText = this.onGetTicketTypeText(modelData.Ztype);
        var appDepdec = this.onGetAppdepText(modelData.Appdep);
        var classdec = this.onGetClassDec(modelData.Class);
        //动火执行人
        var dhzxr = [];
        for(var i=0;i<modelData.GroupTab.length;i++){
            dhzxr.push('动火执行人：');
            dhzxr.push({text: this.getUnderLineText(modelData.GroupTab[i].Pname, 26),style:'underLineText'});
            dhzxr.push('   动火执行人操作证编号：');
            dhzxr.push({text: this.getUnderLineText(modelData.GroupTab[i].Opsno, 18),style:'underLineText'});
        }
        // console.log(dhzxr);
        //动火描述
        var donghuoTxt = "";
        donghuoTxt += modelData.Rhhj ? "融化焊接、" : "";
        donghuoTxt += modelData.Qg ? "切割、" : "";
        donghuoTxt += modelData.Ylh ? "压力焊、" : "";
        donghuoTxt += modelData.Xh ? "軒焊、" : "";
        donghuoTxt += modelData.Px ? "喷枪、" : "";
        donghuoTxt += modelData.Pd ? "喷灯、" : "";
        donghuoTxt += modelData.Zk ? "钻孔、" : "";
        donghuoTxt += modelData.Dm ? "打磨、" : "";
        donghuoTxt += modelData.Cj ? "锤击、" : "";
        donghuoTxt += modelData.Ps ? "破碎、" : "";
        donghuoTxt += modelData.Qx ? "切削、" : "";
        donghuoTxt += modelData.Qt ? "其他、" : "";
        donghuoTxt = donghuoTxt.substring(0, donghuoTxt.length-1);
        //安全措施表
        var aqcsBodyX = [[ '序号',{text:'运行部门应采取的安全措施',style:'tableHeader',alignment:'center'}]];
        for(var i=0;i<modelData.AqcsTabX.length;i++){
            aqcsBodyX.push([modelData.AqcsTabX[i].Seqc,modelData.AqcsTabX[i].Actext]);
        }
        var aqcsBodyY = [[ '序号',{text:'动火部门应采取的安全措施',style:'tableHeader',alignment:'center'}]];
        for(var i=0;i<modelData.AqcsTabY.length;i++){
            aqcsBodyY.push([modelData.AqcsTabY[i].Seqc,modelData.AqcsTabY[i].Actext]);
        }
        //根据双签标识，生成第3项和第11项
        var delta = 0;
        var formPart1 = [];
        var gzpqfr = [];
        formPart1.push([ '1.',{text:[ '工作单位：',{text: this.getUnderLineText(appDepdec, 28),style:'underLineText'}]}, 
									        {text:[ '班组：',{text: this.getUnderLineText(classdec, 34),style:'underLineText'}]} ]);
        formPart1.push([ '2.', {text:[ '动火工作负责人：',{text: this.getUnderLineText(modelData.Name, 22),style:'underLineText'}]},
									        {text:[ '联系方式：',{text: this.getUnderLineText(modelData.Phone1, 30),style:'underLineText'}]} ]);
        //双签标识
        if(modelData.Sqbz == true){
            delta = 1;
            formPart1.push([ '3.',{text:[ '联系部门：',{text: this.getUnderLineText(modelData.Lxbm, 16),style:'underLineText'},
							             '联系人：',{text: this.getUnderLineText(modelData.Contact, 20),style:'underLineText'},
        							     '联系方式：',{text: this.getUnderLineText(modelData.Phone, 18),style:'underLineText'}],colSpan:2}, {}]);
            gzpqfr.push([ (10+delta)+'.', {text:[ '外包单位签发人：',{text: this.getUnderLineText("", 22),style:'underLineText'}]}, {text:[ '签发时间：',
    									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
            gzpqfr.push([ '', {text:[ '业主签发人：',{text: this.getUnderLineText("", 26),style:'underLineText'}]}, {text:[ '签发时间：',
    									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
        }else{
            gzpqfr.push([ (10+delta)+'.', {text:[ '动火工作票签发人：',{text: this.getUnderLineText("", 20),style:'underLineText'}]}, {text:[ '签发时间：',
    									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
        }

        var content = [
                {
					table: {
							widths: ['20%','60%','20%'],
							body: [
        							[ '', {text: iwerkText +'\n'+ticketTypeText+"\n ", style: 'header'},
        							    [
        							        {
                            					table: {
                            							body: [[{text:'盖 “已执行” 章',style:'smallText'}]]
                            					}
            							    }
        							    ]
        							]
							]
					},
					layout: 'noBorders'
				},
                {text:'编号：'+modelData.Wcmno,style:'subheader',alignment:'right'},
                {
				// 	style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['2%','48%','50%'],
							body: formPart1
					},
					layout: 'noBorders'
				},
                {
				// 	style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['2%','48%','50%'],
							body: [
								// 	 //动态内容									
									[(3+delta)+'.',{text:dhzxr,colSpan:2},{}],
								// 	[ '3.', {text:[ '动火执行人：',{text: this.getUnderLineText("楼伟伟", 26),style:'underLineText'},
								// 	                '   动火执行人操作证编号：',{text: this.getUnderLineText("1234567890", 18),style:'underLineText'}],colSpan:2},{}],
								// 	[ '', {text:[ '动火执行人：',{text: this.getUnderLineText("楼伟伟", 26),style:'underLineText'}]},
								// 	       {text:[ '动火执行人操作证编号：',{text: this.getUnderLineText("1234567890", 18),style:'underLineText'}]} ],
									[ (4+delta)+'.', {text:[ '动火地点及设备名称：',{text: this.getUnderLineText(modelData.SPlace, 147),style:'underLineText'}],colSpan:2}, {}],
									[ (5+delta)+'.', {text:[ '动火工作内容（必要时可附页绘图说明）：',{text: this.getUnderLineText(modelData.SCont, 129),style:'underLineText'}],colSpan:2}, {}],
									//动态内容
                                    [ (6+delta)+'.', {text:[ '动火方式：',{text: this.getUnderLineText(donghuoTxt, 73),style:'underLineText'}],colSpan:2}, {}],
                                    [ '', {text:'动火方式可填写熔化焊接、切割、压力焊、钎焊、喷灯、钻孔、打磨、锤击、破碎、切削等。',colSpan:2}, {}],
        							[ (7+delta)+'.', {text:'运行部门应采取的安全措施:',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
                {
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['4%','96%'],
							body: aqcsBodyX
					}
				},
				{
				// 	style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ (8+delta)+'.', {text:'动火部门应采取的安全措施',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
				{
					style: 'bodyTable',
					table: {
							widths: ['4%','96%'],
							body: aqcsBodyY
					}
				},
				{
				    // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
									[ (9+delta)+'.', {text:[ '申请动火开始时间：',
									        {text: this.getUnderLineText(modelData.Jhgzbedate.substring(0,4), 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText(modelData.Jhgzbedate.substring(5,7), 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText(modelData.Jhgzbedate.substring(8,10), 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText(modelData.Jhgzbetime.substring(0,2), 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText(modelData.Jhgzbetime.substring(3,5), 2),style:'underLineText'},'分'],colSpan:2}, {}],
									[ '', {text:[ '申请动火结束时间：',
									        {text: this.getUnderLineText(modelData.Jhgzfidate.substring(0,4), 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText(modelData.Jhgzfidate.substring(5,7), 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText(modelData.Jhgzfidate.substring(8,10), 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText(modelData.Jhgzfitime.substring(0,2), 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText(modelData.Jhgzfitime.substring(3,5), 2),style:'underLineText'},'分'],colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
				{
				    // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: gzpqfr
					},
					layout: 'noBorders'
				},
				{
				    // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
                                    [ (11+delta)+'.', {text:'审批：',colSpan:2}, {}],
                                    [ '', {text:[ '审核人：安键环部负责人签名：',{text: this.getUnderLineText("", 55),style:'underLineText'}],colSpan:2}, {}],
                                    [ '', {text:[ '批准人：分管生产的领导或技术负责人（总工程师）签名：',{text: this.getUnderLineText("", 31),style:'underLineText'}],colSpan:2}, {}],
        							[ '', {text:[ '批准动火开始时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}],
									[ '', {text:[ '批准动火结束时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}],
        							[ (12+delta)+'.', {text:[ '工作票接票人：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}, {text:[ '按票时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        							[ (13+delta)+'.', {text:'运行部门应采取的安全措施已全部执行完毕：',colSpan:2}, {}],
									[ '', {text:[ '运行许可动火时间',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}],
        							[ '',{text:[ '运行许可人签名：',{text: this.getUnderLineText("", 22),style:'underLineText'}],colSpan:2},{}],
									[ (14+delta)+'.', {text:[ '应配备的消防设施和采取的消防措施、安全措施已符合要求。可燃性、易爆气体含量或粉尘浓度合格（测定值',
        									{text: this.getUnderLineText("", 12),style:'underLineText'},'）。'],colSpan:2}, {}],
        							[ '',{text:[ '动火执行人签名：',{text: this.getUnderLineText("", 22),style:'underLineText'}]},
        							     {text:[ '消防监护人签名：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}],
        							[ '',{text:[ '动火工作负责人签名：',{text: this.getUnderLineText("", 18),style:'underLineText'}]},
        							     {text:[ '动火部门负责人签名：',{text: this.getUnderLineText("", 20),style:'underLineText'}]}],
        							[ '', {text:['单位安健环部门负责人签名：',{text: this.getUnderLineText("", 20),style:'underLineText'}],colSpan:2}, {}],
        							[ '', {text:[ '单位分管生产的领导或者技术负责人（总工程师）签名：',{text: this.getUnderLineText("", 33),style:'underLineText'}],colSpan:2}, {}],
        							[ '', {text:[ '允许动火时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}],
        							[ (15+delta)+'.', {text:'动火间断',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
				{
					style: 'bodyTable',
					table: {
							widths: ['30%','18%','18%','18%','16%'],
							body: [
									[ {text:'动火间断时间',alignment:'center'},
									  {text:'动火负责人',alignment:'center'},
									  {text: '动火执行人', alignment:'center'},
									  {text: '消防监护人', alignment:'center'},
									  {text: '安健环部负责人', alignment:'center'}],
									[ '\n', {text:''},{text:''},'',''],
									[ '\n', {text:''},{text:''},'',''],
									[ '\n', {text:''},{text:''},'',''],
									[ '\n', {text:''},{text:''},'',''],
									[ '\n', {text:''},{text:''},'','']
							]
					}
				},
				{
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ (16+delta)+'.', {text:'动火恢复',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
				{
					style: 'bodyTable',
					table: {
							widths: ['22%','13%','13%','13%','13%','13%','13%'],
							body: [
									[ {text:'动火恢复时间',alignment:'center'},
									  {text:'动火负责人',alignment:'center'},
									  {text: '动火执行人', alignment:'center'},
									  {text: '动火部门负责人', alignment:'center'},
									  {text: '安健环部门负责人', alignment:'center'},
									  {text: '消防监护人', alignment:'center'},
									  {text: '动火许可人', alignment:'center'}],
									[ '\n', {text:''},{text:''},'','','',''],
									[ '\n', {text:''},{text:''},'','','',''],
									[ '\n', {text:''},{text:''},'','','',''],
									[ '\n', {text:''},{text:''},'','','',''],
									[ '\n', {text:''},{text:''},'','','','']
							]
					}
				},
				{
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ (17+delta)+'.', {text:'动火工作终结：',colSpan:2}, {}],
        							[ '', {text:[ '动火工作于',
							        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
									{text: this.getUnderLineText("", 4),style:'underLineText'},'分结束，材料、工具已清理完毕，现场确无残留火种，参与现场动火工作的有关人员已全部撤离，动火工作已结束。'],colSpan:2}, {}],
								// 	[ '', {text:'火种，参与现场动火工作的有关人员已全部撤离，动火工作已结束。',colSpan:2}, {}],
									[ '', {text:[ '动火执行人签名：',{text: this.getUnderLineText("", 22),style:'underLineText'}]}, {text:[ '消防监护人签名：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}],
        							[ '', {text:[ '动火工作负责人签名：',{text: this.getUnderLineText("", 18),style:'underLineText'}]}, {text:[ '运行许可人签名：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}],
        							[ (18+delta)+'.', {text:'备注：',colSpan:2}, {}],
        							[ '', {text:[ '（1）对应的检修工作票、工作任务单或事故抢修单编号：（如无，填写“无”）',{text: this.getUnderLineText("", 96),style:'underLineText'}],colSpan:2}, {}],
        							[ '', {text:[ '（2）其它事项：',{text: this.getUnderLineText("", 152),style:'underLineText'}],colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				}
			];
// 		console.log(content);
		return content;
    },
    // DH2	二级动火工作票
    onPrintGzp_DH2:function(modelData){
        var iwerkText = this.onGetIwerkText(modelData.Iwerk);
        if(iwerkText){
            iwerkText = iwerkText.replace(/物资工厂/, '');
        }
        var ticketTypeText = this.onGetTicketTypeText(modelData.Ztype);
        var appDepdec = this.onGetAppdepText(modelData.Appdep);
        var classdec = this.onGetClassDec(modelData.Class);
        //动火执行人
        var dhzxr = [];
        for(var i=0;i<modelData.GroupTab.length;i++){
            dhzxr.push('动火执行人：');
            dhzxr.push({text: this.getUnderLineText(modelData.GroupTab[i].Pname, 26),style:'underLineText'});
            dhzxr.push('   动火执行人操作证编号：');
            dhzxr.push({text: this.getUnderLineText(modelData.GroupTab[i].Opsno, 18),style:'underLineText'});
        }
        // console.log(dhzxr);
        //动火描述
        var donghuoTxt = "";
        donghuoTxt += modelData.Rhhj ? "融化焊接、" : "";
        donghuoTxt += modelData.Qg ? "切割、" : "";
        donghuoTxt += modelData.Ylh ? "压力焊、" : "";
        donghuoTxt += modelData.Xh ? "軒焊、" : "";
        donghuoTxt += modelData.Px ? "喷枪、" : "";
        donghuoTxt += modelData.Pd ? "喷灯、" : "";
        donghuoTxt += modelData.Zk ? "钻孔、" : "";
        donghuoTxt += modelData.Dm ? "打磨、" : "";
        donghuoTxt += modelData.Cj ? "锤击、" : "";
        donghuoTxt += modelData.Ps ? "破碎、" : "";
        donghuoTxt += modelData.Qx ? "切削、" : "";
        donghuoTxt += modelData.Qt ? "其他、" : "";
        donghuoTxt = donghuoTxt.substring(0, donghuoTxt.length-1);
        //安全措施表
        var aqcsBodyX = [[ '序号',{text:'运行部门应采取的安全措施',style:'tableHeader',alignment:'center'}]];
        for(var i=0;i<modelData.AqcsTabX.length;i++){
            aqcsBodyX.push([modelData.AqcsTabX[i].Seqc,modelData.AqcsTabX[i].Actext]);
        }
        var aqcsBodyY = [[ '序号',{text:'动火部门应采取的安全措施',style:'tableHeader',alignment:'center'}]];
        for(var i=0;i<modelData.AqcsTabY.length;i++){
            aqcsBodyY.push([modelData.AqcsTabY[i].Seqc,modelData.AqcsTabY[i].Actext]);
        }
        //根据双签标识，生成第3项和第11项
        var delta = 0;
        var formPart1 = [];
        var gzpqfr = [];
        formPart1.push([ '1.',{text:[ '工作单位：',{text: this.getUnderLineText(appDepdec, 28),style:'underLineText'}]}, 
									        {text:[ '班组：',{text: this.getUnderLineText(classdec, 34),style:'underLineText'}]} ]);
        formPart1.push([ '2.', {text:[ '动火工作负责人：',{text: this.getUnderLineText(modelData.Name, 22),style:'underLineText'}]},
									        {text:[ '联系方式：',{text: this.getUnderLineText(modelData.Phone1, 30),style:'underLineText'}]} ]);
        //双签标识
        if(modelData.Sqbz == true){
            delta = 1;
            formPart1.push([ '3.',{text:[ '联系部门：',{text: this.getUnderLineText(modelData.Lxbm, 16),style:'underLineText'},
							             '联系人：',{text: this.getUnderLineText(modelData.Contact, 20),style:'underLineText'},
        							     '联系方式：',{text: this.getUnderLineText(modelData.Phone, 18),style:'underLineText'}],colSpan:2}, {}]);
            gzpqfr.push([ (10+delta)+'.', {text:[ '外包单位签发人：',{text: this.getUnderLineText("", 22),style:'underLineText'}]}, {text:[ '签发时间：',
    									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
            gzpqfr.push([ '', {text:[ '业主签发人：',{text: this.getUnderLineText("", 26),style:'underLineText'}]}, {text:[ '签发时间：',
    									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
        }else{
            gzpqfr.push([ (10+delta)+'.', {text:[ '动火工作票签发人：',{text: this.getUnderLineText("", 20),style:'underLineText'}]}, {text:[ '签发时间：',
    									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
        }
        var content = [
                {
					table: {
							widths: ['20%','60%','20%'],
							body: [
        							[ '', {text: iwerkText +'\n'+ticketTypeText+"\n ", style: 'header'},
        							    [
        							        {
                            					table: {
                            							body: [[{text:'盖 “已执行” 章',style:'smallText'}]]
                            					}
            							    }
        							    ]
        							]
							]
					},
					layout: 'noBorders'
				},
                {text:'编号：'+modelData.Wcmno,style:'subheader',alignment:'right'},
                {
				// 	style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['2%','48%','50%'],
							body: formPart1
					},
					layout: 'noBorders'
				},
                {
				// 	style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['2%','48%','50%'],
							body: [
								// 	 //动态内容									
									[(3+delta)+'.',{text:dhzxr,colSpan:2},{}],
								// 	[ '3.', {text:[ '动火执行人：',{text: this.getUnderLineText("楼伟伟", 26),style:'underLineText'},
								// 	                '   动火执行人操作证编号：',{text: this.getUnderLineText("1234567890", 18),style:'underLineText'}],colSpan:2},{}],
								// 	[ '', {text:[ '动火执行人：',{text: this.getUnderLineText("楼伟伟", 26),style:'underLineText'}]},
								// 	       {text:[ '动火执行人操作证编号：',{text: this.getUnderLineText("1234567890", 18),style:'underLineText'}]} ],
									[ (4+delta)+'.', {text:[ '动火地点及设备名称：',{text: this.getUnderLineText(modelData.SPlace, 147),style:'underLineText'}],colSpan:2}, {}],
									[ (5+delta)+'.', {text:[ '动火工作内容（必要时可附页绘图说明）：',{text: this.getUnderLineText(modelData.SCont, 129),style:'underLineText'}],colSpan:2}, {}],
									//动态内容
                                    [ (6+delta)+'.', {text:[ '动火方式：',{text: this.getUnderLineText(donghuoTxt, 73),style:'underLineText'}],colSpan:2}, {}],
                                    [ '', {text:'动火方式可填写熔化焊接、切割、压力焊、钎焊、喷灯、钻孔、打磨、锤击、破碎、切削等。',colSpan:2}, {}],
        							[ (7+delta)+'.', {text:'运行部门应采取的安全措施:',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
                {
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['4%','96%'],
							body: aqcsBodyX
					}
				},
				{
				// 	style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ (8+delta)+'.', {text:'动火部门应采取的安全措施',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
				{
					style: 'bodyTable',
					table: {
							widths: ['4%','96%'],
							body: aqcsBodyY
					}
				},
				{
				    // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
									[ (9+delta)+'.', {text:[ '申请动火开始时间：',
									        {text: this.getUnderLineText(modelData.Jhgzbedate.substring(0,4), 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText(modelData.Jhgzbedate.substring(5,7), 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText(modelData.Jhgzbedate.substring(8,10), 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText(modelData.Jhgzbetime.substring(0,2), 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText(modelData.Jhgzbetime.substring(3,5), 2),style:'underLineText'},'分'],colSpan:2}, {}],
									[ '', {text:[ '申请动火结束时间：',
									        {text: this.getUnderLineText(modelData.Jhgzfidate.substring(0,4), 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText(modelData.Jhgzfidate.substring(5,7), 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText(modelData.Jhgzfidate.substring(8,10), 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText(modelData.Jhgzfitime.substring(0,2), 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText(modelData.Jhgzfitime.substring(3,5), 2),style:'underLineText'},'分'],colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
				{
				    // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: gzpqfr
					},
					layout: 'noBorders'
				},
				{
				    // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
                                    [ (11+delta)+'.', {text:'审批：',colSpan:2}, {}],
                                    [ '', {text:[ '审核人：动火部门安监人员签名：',{text: this.getUnderLineText("", 53),style:'underLineText'}],colSpan:2}, {}],
                                    [ '', {text:[ '批准人：动火部门负责人或技术负责人签名：',{text: this.getUnderLineText("", 43),style:'underLineText'}],colSpan:2}, {}],
        							[ '', {text:[ '批准动火开始时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}],
									[ '', {text:[ '批准动火结束时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}],
        							[ (12+delta)+'.', {text:[ '工作票接票人：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}, {text:[ '按票时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        							[ (13+delta)+'.', {text:'运行部门应采取的安全措施已全部执行完毕：',colSpan:2}, {}],
									[ '', {text:[ '运行许可动火时间',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}],
        							[ '',{text:[ '运行许可人签名：',{text: this.getUnderLineText("", 22),style:'underLineText'}],colSpan:2},{}],
									[ (14+delta)+'.', {text:[ '应配备的消防设施和采取的消防措施、安全措施已符合要求。可燃性、易爆气体含量或粉尘浓度合格（测定值',
        									{text: this.getUnderLineText("", 12),style:'underLineText'},'）。'],colSpan:2}, {}],
        							[ '',{text:[ '动火执行人签名：',{text: this.getUnderLineText("", 22),style:'underLineText'}]},
        							     {text:[ '消防监护人签名：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}],
        							[ '',{text:[ '动火工作负责人签名：',{text: this.getUnderLineText("", 18),style:'underLineText'}]},
        							     {text:[ '动火部门安监人员签名：',{text: this.getUnderLineText("", 18),style:'underLineText'}]}],
        							[ '', {text:[ '允许动火时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}],
        							[ (15+delta)+'.', {text:'动火间断',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
				{
					style: 'bodyTable',
					table: {
							widths: ['34%','22%','22%','22%'],
							body: [
									[ {text:'动火间断时间',alignment:'center'},
									  {text:'动火负责人',alignment:'center'},
									  {text: '动火执行人', alignment:'center'},
									  {text: '消防监护人', alignment:'center'}],
									[ '\n', {text:''},{text:''},''],
									[ '\n', {text:''},{text:''},''],
									[ '\n', {text:''},{text:''},''],
									[ '\n', {text:''},{text:''},''],
									[ '\n', {text:''},{text:''},'']
							]
					}
				},
				{
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ (16+delta)+'.', {text:'动火恢复',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
				{
					style: 'bodyTable',
					table: {
							widths: ['22%','13%','13%','13%','13%','13%','13%'],
							body: [
									[ {text:'动火恢复时间',alignment:'center'},
									  {text:'动火负责人',alignment:'center'},
									  {text: '动火执行人', alignment:'center'},
									  {text: '动火部门安监人员', alignment:'center'},
									  {text: '动火部门负责人', alignment:'center'},
									  {text: '消防监护人', alignment:'center'},
									  {text: '动火许可人', alignment:'center'}],
									[ '\n', {text:''},{text:''},'','','',''],
									[ '\n', {text:''},{text:''},'','','',''],
									[ '\n', {text:''},{text:''},'','','',''],
									[ '\n', {text:''},{text:''},'','','',''],
									[ '\n', {text:''},{text:''},'','','','']
							]
					}
				},
				{
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ (17+delta)+'.', {text:'动火工作终结：',colSpan:2}, {}],
        							[ '', {text:[ '动火工作于',
							        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
									{text: this.getUnderLineText("", 4),style:'underLineText'},'分结束，材料、工具已清理完毕，现场确无残留火种，参与现场动火工作的有关人员已全部撤离，动火工作已结束。'],colSpan:2}, {}],
								// 	[ '', {text:'火种，参与现场动火工作的有关人员已全部撤离，动火工作已结束。',colSpan:2}, {}],
									[ '', {text:[ '动火执行人签名：',{text: this.getUnderLineText("", 22),style:'underLineText'}]}, {text:[ '消防监护人签名：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}],
        							[ '', {text:[ '动火工作负责人签名：',{text: this.getUnderLineText("", 18),style:'underLineText'}]}, {text:[ '运行许可人签名：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}],
        							[ (18+delta)+'.', {text:'备注：',colSpan:2}, {}],
        							[ '', {text:[ '（1）对应的检修工作票、工作任务单或事故抢修单编号：（如无，填写“无”）',{text: this.getUnderLineText("", 96),style:'underLineText'}],colSpan:2}, {}],
        							[ '', {text:[ '（2）其它事项：',{text: this.getUnderLineText("", 152),style:'underLineText'}],colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				}
			];
// 		console.log(content);
		return content;
    },
 // DQ1	电气第一种工作票 HX
    onPrintGzp_DQ1:function(modelData){
        var iwerkText = this.onGetIwerkText(modelData.Iwerk);
        if(iwerkText){
            iwerkText = iwerkText.replace(/物资工厂/, '');
        }
        var ticketTypeText = this.onGetTicketTypeText(modelData.Ztype);
        var appDepdec = this.onGetAppdepText(modelData.Appdep);
        var classdec = this.onGetClassDec(modelData.Class);
        var lxbmText = this.onGetLxbmText(modelData.Lxbm);
        //全部结束章
        var qbjsPrintBody = [{
            					table: {
            							body: [[{text:'盖 “已执行” 章',style:'smallText'}]]
            					}
						    },'\n'];
        if(modelData.Zsfjd == '1'){
            qbjsPrintBody.push({
            					table: {
            							body: [[{text:'盖“全部结束”章',style:'smallText'}]]
            					}
						       });
        }
        //工作班组成员
        var groupPersons = "";
        for(var i=0;i<modelData.GroupTab.length;i++){
            if(i>0){
                groupPersons = groupPersons + "、";
            }
            groupPersons = groupPersons + modelData.GroupTab[i].Pname;
        }
        var groupPersonNum = modelData.GroupTab.length;
        var fuyeNum = modelData.KksTab.length;
        //安全措施
        var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
        var aqcsStorage = oStorage.get("ZPMOFFLINE_SRV.ZPMTQPCDT");
        var arrAqcs=[];
        for(var i=0;i<aqcsStorage.length;i++){
            if(aqcsStorage[i].Katalogart == 'X' && aqcsStorage[i].Ztype == modelData.Ztype ){
                arrAqcs.push([aqcsStorage[i].Code,aqcsStorage[i].Kurztext]);
            }
        }
        // console.log(arrAqcs);
        var aqcsBody = [];
        var currCode;
        var tmpNo = 0;     
        var cn_no = ["一","二","三","四","五","六","七","八","九","十"];
        var aczxqk = "";
        for(var i=0;i<arrAqcs.length;i++){
            if(!currCode || currCode != arrAqcs[i][0]){
                currCode = arrAqcs[i][0];
            }
            // 根据行数 确定安全措施的输出表头
            if(tmpNo == 1){
                aczxqk = '安措执行情况\n(注明确实地点、名称及接地线编号)';
            }else if(tmpNo == 3){
                aczxqk = '补充工作地点保留带电部分和安全措施\n(由工作许可人填写)';
            }else{
                aczxqk = '安措执行情况';
            }

            for(var j=0;j<modelData.AqcsTabX.length;j++){
                if(currCode == modelData.AqcsTabX[j].Code){
                    if(modelData.AqcsTabX[j].Seqc == '1'){
                        //表头
                        aqcsBody.push([ cn_no[tmpNo],{text:arrAqcs[i][1],style:'tableHeader',alignment:'center'}, {text:aczxqk,style:'tableHeader', alignment:'center'}]);
                        tmpNo ++;
                    }
                    aqcsBody.push([ modelData.AqcsTabX[j].Seqc, {text:modelData.AqcsTabX[j].Actext},{text:''} ]);
                }
            }
        }
        
  //根据双签标识，生成行
        var Line1 = [];
        var Line2 = [];
        Line1.push([ '1.',{text:[ '工作单位：',{text: this.getUnderLineText(appDepdec, 28),style:'underLineText'}]}, 
						  {text:[ '班组：',{text: this.getUnderLineText(classdec, 36),style:'underLineText'}]} ]);
        Line1.push([ '', {text:[ '工作负责人（监护人）：',{text: this.getUnderLineText(modelData.Name, 16),style:'underLineText'}]},
						 {text:[ '联系方式：',{text: this.getUnderLineText(modelData.Phone1, 32),style:'underLineText'}]} ]);
        if(modelData.Sqbz == true){
            Line1.push([ '',{text:[ '联系部门：',{text: this.getUnderLineText(modelData.Lxbm, 16),style:'underLineText'},
							        '联系人：',{text: this.getUnderLineText(modelData.Contact, 20),style:'underLineText'},
        						    '联系方式：',{text: this.getUnderLineText(modelData.Phone, 18),style:'underLineText'}],colSpan:2}, {}]);
            Line2.push([ '5.', {text:[ '外包单位签发人：',{text: this.getUnderLineText("", 22),style:'underLineText'}]}, 
                               {text:[ '签发时间：',{text: this.getUnderLineText("", 4),style:'underLineText'},'年',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
                                			        {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
            Line2.push([ '', {text:[ '业主签发人：', {text: this.getUnderLineText("", 26),style:'underLineText'}]}, 
                             {text:[ '签发时间：', {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
                                				   {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
                                				   {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
                                				   {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
                                				   {text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
             }else{
            Line2.push([ '5', {text:[ '工作票签发人：', {text: this.getUnderLineText("", 24),style:'underLineText'}]}, 
                              {text:[ '签发时间：', {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
             }
        
        
        
        // console.log(aqcsBody);
        var content = [
                        //  抬头
                {                                  
                    table:{
                        widths: ['20%','60%','20%'],
                        	body: [
        							[ '', 
        							  {text: iwerkText +'\n'+ticketTypeText+"\n ", style: 'header'},
                                      qbjsPrintBody  //盖章标记
        							]
							]
                    },
					layout: 'noBorders'
                },
                {text:'编号：'+modelData.Wcmno,style:'subheader',alignment:'right'},
                
				{  // 添加双签标识
				    // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: Line1
					},
					layout: 'noBorders'
				},
                
                {       // 	style: 'bodyTable',
                  table:{
                      headerRows: 0,
                      widths: ['2%','48%','50%'],
                      body:[
								//     [ '1.',{text:[ '工作单位：',{text: this.getUnderLineText(appDepdec, 28),style:'underLineText'}]}, 
								//             {text:[ '班组：',{text: this.getUnderLineText(classdec, 36),style:'underLineText'}]} ],
								// 	[ '', {text:[ '工作负责人（监护人）：',{text: this.getUnderLineText(modelData.Name,16),style:'underLineText'}]},
								// 	      {text:[ '联系方式：',{text: this.getUnderLineText(modelData.Phone1, 32),style:'underLineText'}]} ],
									[ '', {text:['工作班组成员（不包含工作负责人）',{text:this.getUnderLineText(groupPersons, 112),style:'underLineText'},
									        '等共',{text:this.getUnderLineText(groupPersonNum, 2),style:'underLineText'},'人，附页',{text:this.getUnderLineText(fuyeNum, 2),style:'underLineText'},'张'],colSpan:2}, {} ],
									[ '2.', {text:[ '工作地点：',{text: this.getUnderLineText(modelData.SPlace, 73),style:'underLineText'}],colSpan:2}, {}],
									[ '', {text:[ '工作内容：',{text: this.getUnderLineText(modelData.SCont, 73),style:'underLineText'}],colSpan:2}, {}],
									[ '', {text:[ '检修设备双重命名：',{text: this.getUnderLineText("TODO", 65),style:'underLineText'}],colSpan:2}, {}],
									[ '3.', {text:[ '工作计划开始时间：',
									        {text: this.getUnderLineText(modelData.Jhgzbedate.substring(0,4), 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText(modelData.Jhgzbedate.substring(5,7), 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText(modelData.Jhgzbedate.substring(8,10), 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText(modelData.Jhgzbetime.substring(0,2), 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText(modelData.Jhgzbetime.substring(3,5), 2),style:'underLineText'},'分'],colSpan:2}, {}],
									[ '', {text:[ '工作计划完成时间：',
									        {text: this.getUnderLineText(modelData.Jhgzfidate.substring(0,4), 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText(modelData.Jhgzfidate.substring(5,7), 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText(modelData.Jhgzfidate.substring(8,10), 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText(modelData.Jhgzfitime.substring(0,2), 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText(modelData.Jhgzfitime.substring(3,5), 2),style:'underLineText'},'分'],colSpan:2}, {}],
        							[ '4.', {text:'安全措施（必要时可附页绘图说明）：',colSpan:2}, {}]
                          ]
                  },
                layout: 'noBorders'
                },            
              
                {  //  动态表输入安全措施
					style: 'bodyTable',
					table: {
					    headerRows: 0,
						widths: ['2%','58%','40%'],
						body: aqcsBody
					}
				},
				
				{  // 添加双签标识
				    // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: Line2
					},
					layout: 'noBorders'
				},
				
				{
			   // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        				// 			[ '5.', {text:[ '工作票签发人：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}, {text:[ '签发时间：',
									   //     {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        				// 					{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        				// 					{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        				// 					{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        				// 					{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        						    [ '6.', {text:[ '工作票接票人：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}, {text:[ '接票时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        							[ '',   {text:[ '批准工作开始时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}],
        							[ '',   {text:[ '批准工作结束时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}],
        							[ '', {text:['值长',this.getUnderLineText("", 32)],colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
				{
				  //style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							['7.',{text:['确认上述安全措施已全部执行完毕，核对无误，从',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'年',  
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'时',  
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'分许可工作'],colSpan:2},{} ],		
        							['',  {text:[ '工作许可人：',{text: this.getUnderLineText("", 26),style:'underLineText'}]}, {text:[ '工作负责人：',{text: this.getUnderLineText("", 30),style:'underLineText'}]} ],
                                  	['8.',{text:[ '确认工作负责人布置的工作任务和安全措施'],colSpan:2 },{} ],
                                  	['',  {text:[ '工作班组成员签名：',{text: this.getUnderLineText("", 65),style:'underLineText'}],colSpan:2}, {}],
								    ['9.',{text:[ '工作负责人变更：'],colSpan:2}, {}],
						            ['',  {text:['自',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'年',  
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'时',  
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'分原工作负责人',
        								  {text: this.getUnderLineText("", 12),style:'underLineText'},'离去，变更',
        								  {text: this.getUnderLineText("", 17),style:'underLineText'}],colSpan:2},{} ],
                                    ['', {text:['为工作负责人，变更后工作负责人联系方式：',
                                         {text: this.getUnderLineText("", 43),style:'underLineText'}],colSpan:2},{}],
        							[ '', {text:[ '工作票签发人：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}, {text:[ '时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        						    [ '', {text:[ '工作许可人：',{text: this.getUnderLineText("", 26),style:'underLineText'}]}, {text:[ '时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        						    ['10.', {text:['工作人员变动情况（变动人员姓名、日期及时间）：', {text: this.getUnderLineText("", 37),style:'underLineText'}],colSpan:2},{}],
                                    ['', {text:['工作负责人签名：', {text: this.getUnderLineText("", 67),style:'underLineText'}],colSpan:2},{}],
					            	['11.', {text:['工作票延期：'],colSpan:2},{}],
						            ['',  {text:['有效期延长到：',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'年',  
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'月', 
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'时',  
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'分     工作签发人：', 
        								  {text: this.getUnderLineText("", 22),style:'underLineText'}],colSpan:2},{} ],
                                    [ '', {text:[ '工作负责人：',{text: this.getUnderLineText("", 28),style:'underLineText'}]}, {text:[ '时间：',
									      {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        						    [ '', {text:[ '值长：',{text: this.getUnderLineText("", 34),style:'underLineText'}]}, {text:[ '时间：',
									      {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        						    [ '12.', {text:'根据工作需要，工作票押回运行保管：',colSpan:2}, {}]	  
							]
					},
					layout: 'noBorders'
				},
 
                {   //  动态表输入押回运行保管
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['30%','20%','20%','30%' ],
							body: [
									[ {text: '工作票交回运行人员时间',style:'tableHeader',alignment:'center'}, 
								      {text: '工作许可人',style:'tableHeader', alignment:'center'},
								      {text: '工作负责人',style:'tableHeader', alignment:'center'},
								      {text: '押回原因', style:'tableHeader', alignment:'center'}],
									[ {text: '\n'}, {text:''},{text:''},{text:''} ],
									[ {text: '\n'}, {text:''},{text:''},{text:''} ],
									[ {text: '\n'}, {text:''},{text:''},{text:''} ],
									[ {text: '\n'}, {text:''},{text:''},{text:''} ],
									[ {text: '\n'}, {text:''},{text:''},{text:''} ]
							]
					}
				},
				{
				//   style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
							    [ '13.', {text:'根据工作需要，工作票所列安全措施已全部执行，可以重新工作：',colSpan:2}, {}]	  
							]
					},
					layout: 'noBorders'
				},
               
                {   //  动态表输入
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['30%','20%','20%','30%' ],
							body: [
									[ {text: '允许恢复工作时间',style:'tableHeader',alignment:'center'}, 
								      {text: '工作许可人',style:'tableHeader', alignment:'center'},
								      {text: '工作负责人',style:'tableHeader', alignment:'center'},
								      {text: '工作重新许可原因', style:'tableHeader', alignment:'center'}],
									[ {text: '\n'}, {text:''},{text:''},{text:''} ],
									[ {text: '\n'}, {text:''},{text:''},{text:''} ],
									[ {text: '\n'}, {text:''},{text:''},{text:''} ],
									[ {text: '\n'}, {text:''},{text:''},{text:''} ],
									[ {text: '\n'}, {text:''},{text:''},{text:''} ]
							]
					}
				},

				{
				  //style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ '14.',{text: '工作终结：',colSpan:2}, {}],
							        [ '',   {text:[ '全部工作于：',
								            {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'月',
        						            {text: this.getUnderLineText("", 2),style:'underLineText'},'日',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'时',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'分结束，设备及安全措施已恢复至开工状态'],colSpan:2}, {}],
        					    	[ '',   {text:'工作人员已全部撤离，材料工具已清理完毕，工作已总结。',colSpan:2},{} ],
                                    [ '',   {text:[ '工作负责人：', 
        							        {text: this.getUnderLineText("", 28),style:'underLineText'},'  时间：',
        							        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        								    {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        							        {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        							        {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        								    {text: this.getUnderLineText("", 4),style:'underLineText'},'分' ],colSpan:2}, {}],
                                    [ '',   {text:[ '工作许可人：', 
        							        {text: this.getUnderLineText("", 28),style:'underLineText'},'  时间：',
        							        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        								    {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        							        {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        							        {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        								    {text: this.getUnderLineText("", 4),style:'underLineText'},'分' ],colSpan:2}, {}],
		          			        [ '15.',{text: '工作票终结：',colSpan:2}, {}],
							        [ '',   {text:[ '临时遮栏、标示牌已拆除，常设遮栏已恢复。已拆除（或已拉开）的接地线、接地闸刀（小车）共',
							                {text: this.getUnderLineText("", 8),style:'underLineText'},'副（台），已汇报值班分责人。'],colSpan:2}, {}],
                                    [ '',   {text:[ '拆除时间：',
								            {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'月',
        						            {text: this.getUnderLineText("", 2),style:'underLineText'},'日',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'时',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'分'],colSpan:2}, {}],
								    [ '',   {text:[ '工作许可人：', 
        							        {text: this.getUnderLineText("", 28),style:'underLineText'},'  值班负责人：',
        							        {text: this.getUnderLineText("", 28),style:'underLineText'}],colSpan:2}, {}],
        							[ '16.', {text:'备注：',colSpan:2}, {}],
        							[ '', {text:['（1）指定专责监护人',{text:this.getUnderLineText("", 10),style:'underLineText'},
        							             '负责监护（地点及具体工作）：'],colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:['（1）其它事项：'],colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				}
      ];
      return content;
    },
 // DQ2	电气第二种工作票HX
    onPrintGzp_DQ2:function(modelData){
        var iwerkText = this.onGetIwerkText(modelData.Iwerk);
        if(iwerkText){
            iwerkText = iwerkText.replace(/物资工厂/, '');
        }
        var ticketTypeText = this.onGetTicketTypeText(modelData.Ztype);
        var appDepdec = this.onGetAppdepText(modelData.Appdep);
        var classdec = this.onGetClassDec(modelData.Class);
        var lxbmText = this.onGetLxbmText(modelData.Lxbm);
        //全部结束章
        var qbjsPrintBody = [{
            					table: {
            							body: [[{text:'盖 “已执行” 章',style:'smallText'}]]
            					}
						    },'\n'];
        if(modelData.Zsfjd == '1'){
            qbjsPrintBody.push({
            					table: {
            							body: [[{text:'盖“全部结束”章',style:'smallText'}]]
            					}
						       });
        }
        //工作班组成员
        var groupPersons = "";
        for(var i=0;i<modelData.GroupTab.length;i++){
            if(i>0){
                groupPersons = groupPersons + "、";
            }
            groupPersons = groupPersons + modelData.GroupTab[i].Pname;
        }
        var groupPersonNum = modelData.GroupTab.length;
        var fuyeNum = modelData.KksTab.length;
        //安全措施
        var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
        var aqcsStorage = oStorage.get("ZPMOFFLINE_SRV.ZPMTQPCDT");
        var arrAqcs=[];
        for(var i=0;i<aqcsStorage.length;i++){
            if(aqcsStorage[i].Katalogart == 'X' && aqcsStorage[i].Ztype == modelData.Ztype ){
                arrAqcs.push([aqcsStorage[i].Code,aqcsStorage[i].Kurztext]);
            }
        }
        var aqcsBody = [];
        var qfrBody = [];   //第6点 工作票签发人填写表
        var currCode;
        var tmpNo = 0;
        var cn_no = ["一","二","三","四","五","六","七","八","九","十"];
        var aczxqk = "";
        for(var i=0;i<arrAqcs.length;i++){
            if(!currCode || currCode != arrAqcs[i][0]){
                currCode = arrAqcs[i][0];
            }
            //  根据输出行 确定表头
            if(tmpNo == 1){
                aczxqk = '安措执行情况\n(注明确实地点、名称及接地线编号)';
            }else{
                aczxqk = '安措执行情况';
            }
            
            for(var j=0;j<modelData.AqcsTabX.length;j++){
                if(currCode == modelData.AqcsTabX[j].Code){
                    if(modelData.AqcsTabX[j].Seqc == '1'){
                        //表头
                        if(tmpNo < 2){
                            aqcsBody.push([ cn_no[tmpNo],{text:arrAqcs[i][1],style:'tableHeader',alignment:'center'}, {text: aczxqk,style:'tableHeader', alignment:'center'}]);
                            tmpNo ++;
                        }else{
                            qfrBody.push([ '序号',{text:'工作地点保留带点部分或注意事项'+'\n'+'（工作票签发人填写）',style:'tableHeader',alignment:'center'}]);
                            tmpNo ++;
                        }
                    }
                    if(tmpNo < 3){
                        aqcsBody.push([ modelData.AqcsTabX[j].Seqc, {text:modelData.AqcsTabX[j].Actext},{text:''} ]);
                    }else{
                        qfrBody.push([ modelData.AqcsTabX[j].Seqc, {text:modelData.AqcsTabX[j].Actext}]);
                    }
                    
                }
            }
        }
        
  //根据双签标识，生成行
        var Line1 = [];
        var Line2 = [];
        Line1.push([ '1.',{text:[ '工作单位：',{text: this.getUnderLineText(appDepdec, 28),style:'underLineText'}]}, 
						  {text:[ '班组：',{text: this.getUnderLineText(classdec, 36),style:'underLineText'}]} ]);
        Line1.push([ '', {text:[ '工作负责人：',{text: this.getUnderLineText(modelData.Name, 26),style:'underLineText'}]},
						 {text:[ '联系方式：',{text: this.getUnderLineText(modelData.Phone1, 32),style:'underLineText'}]} ]);
        if(modelData.Sqbz == true){
            Line1.push([ '',{text:[ '联系部门：',{text: this.getUnderLineText(modelData.Lxbm, 16),style:'underLineText'},
							        '联系人：',{text: this.getUnderLineText(modelData.Contact, 20),style:'underLineText'},
        						    '联系方式：',{text: this.getUnderLineText(modelData.Phone, 18),style:'underLineText'}],colSpan:2}, {}]);
            Line2.push([ '8.', {text:[ '外包单位签发人：',{text: this.getUnderLineText("", 22),style:'underLineText'}]}, 
                               {text:[ '签发时间：',{text: this.getUnderLineText("", 4),style:'underLineText'},'年',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
                                			        {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
            Line2.push([ '', {text:[ '业主签发人：', {text: this.getUnderLineText("", 26),style:'underLineText'}]}, 
                             {text:[ '签发时间：', {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
                                				   {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
                                				   {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
                                				   {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
                                				   {text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
             }else{
            Line2.push([ '8', {text:[ '工作票签发人：', {text: this.getUnderLineText("", 24),style:'underLineText'}]}, 
                              {text:[ '签发时间：', {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
             }
        var content = [
                        //  抬头
                {                                  
                    table:{
                        widths: ['20%','60%','20%'],
                        	body: [
        							[ '', 
        							  {text: iwerkText +'\n'+ticketTypeText+"\n ", style: 'header'},
                                      qbjsPrintBody  //盖章标记
        							]
							]
                    },
					layout: 'noBorders'
                },
                {text:'编号：'+modelData.Wcmno,style:'subheader',alignment:'right'},
                
                {  // 添加双签标识
				    // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: Line1
					},
					layout: 'noBorders'
				},       
                       
                 // 内容1
               {       // 	style: 'bodyTable',
                   table:{
                       headerRows: 0,
                       widths: ['2%','48%','50%'],
                       body:[
								//     [ '1.',{text:[ '工作单位：',{text: this.getUnderLineText(appDepdec, 28),style:'underLineText'}]}, 
								//             {text:[ '班组：',{text: this.getUnderLineText(classdec, 36),style:'underLineText'}]} ],
								// 	[ '', {text:[ '工作负责人：',{text: this.getUnderLineText(modelData.Name, 26),style:'underLineText'}]},
								// 	      {text:[ '联系方式：',{text: this.getUnderLineText(modelData.Phone1, 32),style:'underLineText'}]} ],
									[ '', {text:['工作班组成员（不包含工作负责人）',{text:this.getUnderLineText(groupPersons, 114),style:'underLineText'},
									        '等共',{text:this.getUnderLineText(groupPersonNum, 2),style:'underLineText'},'人，附页',{text:this.getUnderLineText(fuyeNum, 2),style:'underLineText'},'张'],colSpan:2}, {} ],
									[ '2.', {text:[ '工作地点和地段：',{text: this.getUnderLineText(modelData.SPlace, 67),style:'underLineText'}],colSpan:2}, {}],
									[ '', {text:[ '工作内容：',{text: this.getUnderLineText(modelData.SCont, 73),style:'underLineText'}],colSpan:2}, {}],
									[ '3.', {text:[ '工作计划开始时间：',
									        {text: this.getUnderLineText(modelData.Jhgzbedate.substring(0,4), 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText(modelData.Jhgzbedate.substring(5,7), 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText(modelData.Jhgzbedate.substring(8,10), 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText(modelData.Jhgzbetime.substring(0,2), 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText(modelData.Jhgzbetime.substring(3,5), 2),style:'underLineText'},'分'],colSpan:2}, {}],
									[ '', {text:[ '工作计划完成时间：',
									        {text: this.getUnderLineText(modelData.Jhgzfidate.substring(0,4), 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText(modelData.Jhgzfidate.substring(5,7), 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText(modelData.Jhgzfidate.substring(8,10), 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText(modelData.Jhgzfitime.substring(0,2), 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText(modelData.Jhgzfitime.substring(3,5), 2),style:'underLineText'},'分'],colSpan:2}, {}],
        						    [ '4.', {text:[ '工作条件(停电或不停电)：',{text: this.getUnderLineText(modelData.Gztj, 59),style:'underLineText'}],colSpan:2}, {}],
        							[ '5.', {text:'安全措施（注意事项）：',colSpan:2}, {}]
                           ]
                   },
                layout: 'noBorders'
               },            
              
               {   //  动态表输入安全措施
					style: 'bodyTable',
					table: {
					    headerRows: 0,
						widths: ['2%','58%','40%'],
						body: aqcsBody
					}
				},
    
               {
			   // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ '6.', {text:'工作票签发人填写',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
			
			    {   //  动态表输入安全措施
					style: 'bodyTable',
					table: {
					    headerRows: 0,
						widths: ['2%','98%'],
						body: qfrBody
					}
				},
				
				{
			   // style: 'bodyTable',
					table: {
						//widths: ['2%','48%','50%'],
						body: [
        						[ '7.', {text:'工作票许可人填写',colSpan:2}, {}]
						]
					},
					layout: 'noBorders'
				},
			
			    {   //  动态表输入安全措施
					style: 'bodyTable',
					table: {
					    headerRows: 0,
						widths: ['2%','98%'],
						body: [
							  [ '序号',{text:'补充工作地点保留带点部分或注意事项'+'\n'+'（工作票许可人填写）',style:'tableHeader',alignment:'center'}]
						]
					}
				},
								{  // 添加双签标识
				    // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: Line2
					},
					layout: 'noBorders'
				},
				
				{
			   // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        				// 			[ '8.', {text:[ '工作票签发人：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}, {text:[ '签发时间：',
									   //     {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        				// 					{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        				// 					{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        				// 					{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        				// 					{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        						    [ '9.', {text:[ '工作票接票人：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}, {text:[ '接票时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        							[ '',   {text:[ '批准工作开始时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}], //
        							[ '',   {text:[ '批准工作结束时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}], //
        							[ '10.', {text:'补充安全措施',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
				
				{   //  动态表输入安全措施
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['2%','58%','40%'],
							body: [
									[ '序号',{text:'运行值班人员补充的安全措施',style:'tableHeader',alignment:'center'}, {text: '补充安措执行情况',style:'tableHeader', alignment:'center'}],
									[ '1', {text:'123'},{text:'321'} ]
							]
					}
				},
				
				{
				   //style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							['11.',{text:['确认上述安全措施已全部执行完毕，核对无误，从',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'年',  
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'时',  
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'分许可工作'],colSpan:2},{} ],		
        							['',  {text:[ '工作许可人：',{text: this.getUnderLineText("", 26),style:'underLineText'}]}, {text:[ '工作负责人：',{text: this.getUnderLineText("", 30),style:'underLineText'}]} ],
                                   	['12.',{text:[ '确认工作负责人布置的工作任务和安全措施'],colSpan:2 },{} ],
                                   	['',  {text:[ '工作班组成员签名：',{text: this.getUnderLineText("", 65),style:'underLineText'}],colSpan:2}, {}],
								    ['13.',{text:[ '工作负责人变更：'],colSpan:2}, {}],
						            ['',  {text:['自',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'年',  
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'时',  
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'分原工作负责人',
        								  {text: this.getUnderLineText("", 12),style:'underLineText'},'离去，变更',
        								  {text: this.getUnderLineText("", 17),style:'underLineText'}],colSpan:2},{} ],
                                    ['', {text:['为工作负责人，变更后工作负责人联系方式：',
                                         {text: this.getUnderLineText("", 43),style:'underLineText'}],colSpan:2},{}],
        							[ '', {text:[ '工作票签发人：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}, {text:[ '时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        						    [ '', {text:[ '工作许可人：',{text: this.getUnderLineText("", 26),style:'underLineText'}]}, {text:[ '时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        						    ['14.', {text:['工作人员变动情况（变动人员姓名、日期及时间）：', {text: this.getUnderLineText("", 37),style:'underLineText'}],colSpan:2},{}],
                                    ['', {text:['工作负责人签名：', {text: this.getUnderLineText("", 67),style:'underLineText'}],colSpan:2},{}],
					            	['15.', {text:['工作票延期：'],colSpan:2},{}],
						            ['',  {text:['有效期延长到：',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'年',  
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'月', 
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'时',  
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'分     工作签发人：', 
        								  {text: this.getUnderLineText("", 22),style:'underLineText'}],colSpan:2},{} ],
                                    [ '', {text:[ '工作负责人：',{text: this.getUnderLineText("", 28),style:'underLineText'}]}, {text:[ '时间：',
									      {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        						    [ '', {text:[ '值班负责人：',{text: this.getUnderLineText("", 28),style:'underLineText'}]}, {text:[ '时间：',
									      {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        						    [ '13.', {text:'根据工作需要，工作票押回运行保管：',colSpan:2}, {}]	  
							]
					},
					layout: 'noBorders'
				},
 
                {   //  动态表输入押回运行保管
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['30%','20%','20%','30%' ],
							body: [
									[ {text: '工作票交回运行人员时间',style:'tableHeader',alignment:'center'}, 
								      {text: '工作许可人',style:'tableHeader', alignment:'center'},
								      {text: '工作负责人',style:'tableHeader', alignment:'center'},
								      {text: '押回原因', style:'tableHeader', alignment:'center'}],
									[ {text: '123'}, {text:'123'},{text:'321'},{text:'321'} ]
							]
					}
				},
				{
				//   style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
							    [ '14.', {text:'根据工作需要，工作票所列安全措施已全部执行，可以重新工作：',colSpan:2}, {}]	  
							]
					},
					layout: 'noBorders'
				},
               
                {   //  动态表输入
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['30%','20%','20%','30%' ],
							body: [
									[ {text: '允许恢复工作时间',style:'tableHeader',alignment:'center'}, 
								      {text: '工作许可人',style:'tableHeader', alignment:'center'},
								      {text: '工作负责人',style:'tableHeader', alignment:'center'},
								      {text: '工作重新许可原因', style:'tableHeader', alignment:'center'}],
									[ {text: '123'}, {text:'123'},{text:'321'},{text:'321'} ]
							]
					}
				},

				{
				   //style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ '18.',{text: '工作终结：',colSpan:2}, {}],
							        [ '',   {text:[ '全部工作于：',
								            {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'月',
        						            {text: this.getUnderLineText("", 2),style:'underLineText'},'日',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'时',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'分结束，设备及安全措施已恢复至开工状态'],colSpan:2}, {}],
        					    	[ '',   {text:'工作人员已全部撤离，材料工具已清理完毕，工作已总结。',colSpan:2},{} ],
                                    [ '',   {text:[ '工作负责人：', 
        							        {text: this.getUnderLineText("", 28),style:'underLineText'},'  时间：',
        							        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        								    {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        							        {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        							        {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        								    {text: this.getUnderLineText("", 4),style:'underLineText'},'分' ],colSpan:2}, {}],
                                    [ '',   {text:[ '工作许可人：', 
        							        {text: this.getUnderLineText("", 28),style:'underLineText'},'  时间：',
        							        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        								    {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        							        {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        							        {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        								    {text: this.getUnderLineText("", 4),style:'underLineText'},'分' ],colSpan:2}, {}],
		          			        [ '19.',{text: '工作票终结：',colSpan:2}, {}],
							        [ '',   {text:[ '临时遮栏、标示牌已拆除，常设遮栏已恢复。已拆除（或已拉开）的接地线、接地闸刀（小车）共',
							                {text: this.getUnderLineText("", 8),style:'underLineText'},'副（台），已汇报值班分责人。'],colSpan:2}, {}],
                                    [ '',   {text:[ '拆除时间：',
								            {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'月',
        						            {text: this.getUnderLineText("", 2),style:'underLineText'},'日',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'时',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'分'],colSpan:2}, {}],
								    [ '',   {text:[ '工作许可人：', 
        							        {text: this.getUnderLineText("", 28),style:'underLineText'},'  工作负责人：',
        							        {text: this.getUnderLineText("", 28),style:'underLineText'}],colSpan:2}, {}],
        							[ '20.', {text:'备注：',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				}
      ];
      return content;
    },
    // JBP	继电保护工作票
    onPrintGzp_JBP:function(modelData){
        var iwerkText = this.onGetIwerkText(modelData.Iwerk);
        if(iwerkText){
            iwerkText = iwerkText.replace(/物资工厂/, '');
        }
        var ticketTypeText = this.onGetTicketTypeText(modelData.Ztype);
        var appDepdec = this.onGetAppdepText(modelData.Appdep);
        var classdec = this.onGetClassDec(modelData.Class);
        var lxbmText = this.onGetLxbmText(modelData.Lxbm);
        //全部结束章
        var qbjsPrintBody = [{
            					table: {
            							body: [[{text:'盖 “已执行” 章',style:'smallText'}]]
            					}
						    },'\n'];
        if(modelData.Zsfjd == '1'){
            qbjsPrintBody.push({
            					table: {
            							body: [[{text:'盖“全部结束”章',style:'smallText'}]]
            					}
						       });
        }
        //工作班组成员
        var groupPersons = "";
        for(var i=0;i<modelData.GroupTab.length;i++){
            if(i>0){
                groupPersons = groupPersons + "、";
            }
            groupPersons = groupPersons + modelData.GroupTab[i].Pname;
        }
        var groupPersonNum = modelData.GroupTab.length;
        var fuyeNum = modelData.KksTab.length;
        //安全措施
        var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
        var aqcsStorage = oStorage.get("ZPMOFFLINE_SRV.ZPMTQPCDT");
        var arrAqcs=[];
        for(var i=0;i<aqcsStorage.length;i++){
            if(aqcsStorage[i].Katalogart == 'X' && aqcsStorage[i].Ztype == modelData.Ztype ){
                arrAqcs.push([aqcsStorage[i].Code,aqcsStorage[i].Kurztext]);
            }
        }
        var aqcsBody = [];
        var currCode;
        var tmpNo = 0;
        var cn_no = ["一","二","三","四","五","六","七","八","九","十"];
        var aczxqk = "";//安措执行情况
        // console.log(arrAqcs);
        for(var i=0;i<arrAqcs.length;i++){
            if(!currCode || currCode != arrAqcs[i][0]){
                currCode = arrAqcs[i][0];
            }
            if(tmpNo == 2){
                aczxqk = '安措执行情况\n(注明确实地点、名称及接地线编号)';
            }else{
                aczxqk = '安措执行情况';
            }
            for(var j=0;j<modelData.AqcsTabX.length;j++){
                if(currCode == modelData.AqcsTabX[j].Code){
                    if(modelData.AqcsTabX[j].Seqc == '1'){
                        //表头
                        aqcsBody.push([ cn_no[tmpNo],{text:arrAqcs[i][1],style:'tableHeader',alignment:'center'}, {text: '安措执行情况',style:'tableHeader', alignment:'center'}]);
                        tmpNo ++;
                    }
                    aqcsBody.push([ modelData.AqcsTabX[j].Seqc, {text:modelData.AqcsTabX[j].Actext},{text:''} ]);
                }
            }
        }
        //开工后安全措施
        var aqcsBody2 = [];
        aqcsBody2.push([ '序号',{text:'开工后的安全措施',style:'tableHeader',alignment:'center'}, 
									         {text:'执行',style:'tableHeader', alignment:'center'},
									         {text:'恢复',style:'tableHeader', alignment:'center'}]);
        for(var j=0;j<modelData.AqcsTabY.length;j++){
            aqcsBody2.push([ modelData.AqcsTabY[j].Seqc, {text:modelData.AqcsTabY[j].Actext},{text:''},{text:''} ]);
        }
        //根据双签标识，生成第一项和第八项
        var formPart1 = [];
        var gzpqfr = [];
        formPart1.push([ '1.',{text:[ '工作单位：',{text: this.getUnderLineText(appDepdec, 28),style:'underLineText'}]}, 
									        {text:[ '班组：',{text: this.getUnderLineText(classdec, 34),style:'underLineText'}]} ]);
        formPart1.push([ '', {text:[ '工作负责人：',{text: this.getUnderLineText(modelData.Name, 26),style:'underLineText'}]},
									        {text:[ '联系方式：',{text: this.getUnderLineText(modelData.Phone1, 30),style:'underLineText'}]} ]);
        //双签标识
        if(modelData.Sqbz == true){
            formPart1.push([ '',{text:[ '联系部门：',{text: this.getUnderLineText(modelData.Lxbm, 16),style:'underLineText'},
							             '联系人：',{text: this.getUnderLineText(modelData.Contact, 20),style:'underLineText'},
        							     '联系方式：',{text: this.getUnderLineText(modelData.Phone, 18),style:'underLineText'}],colSpan:2}, {}]);
            gzpqfr.push([ '5.', {text:[ '外包单位签发人：',{text: this.getUnderLineText("", 22),style:'underLineText'}]}, {text:[ '签发时间：',
    									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
            gzpqfr.push([ '', {text:[ '业主签发人：',{text: this.getUnderLineText("", 26),style:'underLineText'}]}, {text:[ '签发时间：',
    									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
        }else{
            gzpqfr.push([ '5.', {text:[ '工作票签发人：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}, {text:[ '签发时间：',
    									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
        }
        formPart1.push([ '', {text:['工作班组成员（不包含工作负责人）',{text:this.getUnderLineText(groupPersons, 114),style:'underLineText'},
									        '等共',{text:this.getUnderLineText(groupPersonNum, 2),style:'underLineText'},'人，附页',
									        {text:this.getUnderLineText(fuyeNum, 2),style:'underLineText'},'张'],colSpan:2}, {} ]);
        var content = [
                {                                  
                    table:{
                        widths: ['20%','60%','20%'],
                        	body: [
        							[ '', 
        							  {text: iwerkText +'\n'+ticketTypeText+"\n ", style: 'header'},
                                      qbjsPrintBody
        							]
							]
                    },
					layout: 'noBorders'
                },
                {text:'编号：'+modelData.Wcmno,style:'subheader',alignment:'right'},
                
                // 内容1
               {       
                   // 	style: 'bodyTable',
                   table:{
                       headerRows: 0,
                       widths: ['2%','48%','50%'],
                       body:formPart1
                   },
                layout: 'noBorders'
               },   
               {
                   table:{
                       headerRows: 0,
                       widths: ['2%','48%','50%'],
                       body:[
									[ '2.', {text:[ '工作地点：',{text: this.getUnderLineText(modelData.SPlace, 73),style:'underLineText'}],colSpan:2}, {}],
									[ '', {text:[ '工作内容：',{text: this.getUnderLineText(modelData.SCont, 73),style:'underLineText'}],colSpan:2}, {}],
									[ '', {text:[ '检修设备双重命名：',{text: this.getUnderLineText("ASDFASD", 65),style:'underLineText'}],colSpan:2}, {}],
									[ '3.', {text:[ '工作计划开始时间：',
									        {text: this.getUnderLineText(modelData.Jhgzbedate.substring(0,4), 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText(modelData.Jhgzbedate.substring(5,7), 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText(modelData.Jhgzbedate.substring(8,10), 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText(modelData.Jhgzbetime.substring(0,2), 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText(modelData.Jhgzbetime.substring(3,5), 2),style:'underLineText'},'分'],colSpan:2}, {}],
									[ '', {text:[ '工作计划完成时间：',
									        {text: this.getUnderLineText(modelData.Jhgzfidate.substring(0,4), 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText(modelData.Jhgzfidate.substring(5,7), 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText(modelData.Jhgzfidate.substring(8,10), 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText(modelData.Jhgzfitime.substring(0,2), 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText(modelData.Jhgzfitime.substring(3,5), 2),style:'underLineText'},'分'],colSpan:2}, {}],
        							[ '4.', {text:'安全措施（必要时可附页绘图说明）：',colSpan:2}, {}]
                           ]
                   },
                layout: 'noBorders'
               },   
               {   //  动态表输入安全措施
					style: 'bodyTable',
					table: {
					    headerRows: 0,
						widths: ['2%','58%','40%'],
						body: aqcsBody
					}
				},
				{
			   // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: gzpqfr  //工作票签发人
					},
					layout: 'noBorders'
				},
				{
			   // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        						    [ '6.', {text:[ '工作票接票人：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}, {text:[ '接票时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        							[ '',   {text:[ '批准工作开始时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}], //
        							[ '',   {text:[ '批准工作结束时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}], //
        				        	['7', {text:['确认上述安全措施已全部执行完毕，核对无误，从',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'年',  
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'时',  
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'分许可工作'],colSpan:2},{} ],		
        							['',  {text:[ '工作许可人：',{text: this.getUnderLineText("", 26),style:'underLineText'}]}, {text:[ '工作负责人：',{text: this.getUnderLineText("", 30),style:'underLineText'}]} ],
						            [ '8.', {text:'开工后工作班做的安全措施（工作票负责人填写）：',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},

				{   //  动态表输入安全措施
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['2%','50%','24%','24%'],
							body: aqcsBody2
					}
				},

				{
			   // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        					      [ '',   {text:[ '上述安全措施在工作负责人监护下由：',
        					              {text: this.getUnderLineText("", 8),style:'underLineText'},'执行  时间',
									      {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}], //
							     [ '',   {text:[ '上述安全措施在工作负责人监护下由：',
        					              {text: this.getUnderLineText("", 8),style:'underLineText'},'恢复  时间',
									      {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}], //
						     	['9.',{text:[ '确认工作负责人布置的工作任务和安全措施'],colSpan:2 },{} ],
                                ['',  {text:[ '工作班组成员签名：',{text: this.getUnderLineText("", 65),style:'underLineText'}],colSpan:2}, {}],
							    ['10.',{text:[ '工作负责人变更：'],colSpan:2}, {}],
						        ['',  {text:['自',
        							  {text: this.getUnderLineText("", 4),style:'underLineText'},'年',  
        							  {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        							  {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        							  {text: this.getUnderLineText("", 4),style:'underLineText'},'时',  
        						      {text: this.getUnderLineText("", 4),style:'underLineText'},'分原工作负责人',
        						      {text: this.getUnderLineText("", 12),style:'underLineText'},'离去，变更',
        							  {text: this.getUnderLineText("", 17),style:'underLineText'}],colSpan:2},{} ],
							    ['', {text:['为工作负责人，变更后工作负责人联系方式：',
                                     {text: this.getUnderLineText("", 43),style:'underLineText'}],colSpan:2},{}],
        						[ '', {text:[ '工作票签发人：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}, {text:[ '时间：',
									  {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        							  {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        							  {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        							  {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        							  {text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        						[ '', {text:[ '工作许可人：',{text: this.getUnderLineText("", 26),style:'underLineText'}]}, {text:[ '时间：',
									  {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        							  {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        							  {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        							  {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        							  {text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        						['11.', {text:['工作人员变动情况（变动人员姓名、日期及时间）：', {text: this.getUnderLineText("", 37),style:'underLineText'}],colSpan:2},{}],
                                ['',    {text:['工作负责人签名：', {text: this.getUnderLineText("", 67),style:'underLineText'}],colSpan:2},{}],
					            ['12.', {text:['工作票延期：'],colSpan:2},{}],
						        ['',    {text:['有效期延长到：',
        							    {text: this.getUnderLineText("", 4),style:'underLineText'},'年',  
        							    {text: this.getUnderLineText("", 4),style:'underLineText'},'月', 
        							    {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        								{text: this.getUnderLineText("", 4),style:'underLineText'},'时',  
        								{text: this.getUnderLineText("", 4),style:'underLineText'},'分     工作签发人：', 
        								{text: this.getUnderLineText("", 22),style:'underLineText'}],colSpan:2},{} ],
                                [ '', {text:[ '工作负责人：',{text: this.getUnderLineText("", 28),style:'underLineText'}]}, {text:[ '时间：',
									  {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        							  {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        							  {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        							  {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        							  {text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        						[ '', {text:[ '值班负责人：',{text: this.getUnderLineText("", 28),style:'underLineText'}]}, {text:[ '时间：',
									  {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        							  {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        							  {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        							  {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        							  {text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        						[ '13.', {text:'根据工作需要，工作票押回运行保管：',colSpan:2}, {}]	  
							]
					},
					layout: 'noBorders'
				},

                {   //  动态表输入押回运行保管
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['30%','20%','20%','30%' ],
							body: [
									[ {text: '工作票交回运行人员时间',style:'tableHeader',alignment:'center'}, 
								      {text: '工作许可人',style:'tableHeader', alignment:'center'},
								      {text: '工作负责人',style:'tableHeader', alignment:'center'},
								      {text: '押回原因', style:'tableHeader', alignment:'center'}],
									[ {text: '\n'}, {text:''},{text:''},{text:''} ]
							]
					}
				},

               {
				//   style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
							    [ '14.', {text:'根据工作需要，工作票所列安全措施已全部执行，可以重新工作：',colSpan:2}, {}]	  
							]
					},
					layout: 'noBorders'
				},
               
                {   //  动态表输入
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['30%','20%','20%','30%' ],
							body: [
									[ {text: '允许恢复工作时间',style:'tableHeader',alignment:'center'}, 
								      {text: '工作许可人',style:'tableHeader', alignment:'center'},
								      {text: '工作负责人',style:'tableHeader', alignment:'center'},
								      {text: '工作重新许可原因', style:'tableHeader', alignment:'center'}],
									[ {text: '\n'}, {text:''},{text:''},{text:''} ]
							]
					}
				},

				{
				   //style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        					    	[ '15', {text:'工作结束后，向值班人员提请注意事项（更改或变动需写明设备异动申请报告编号及简要情',colSpan:2},{} ],
                                    ['', {text:['况）：', {text: this.getUnderLineText("", 67),style:'underLineText'}],colSpan:2},{}]
							]
					},
					layout: 'noBorders'
				},

				{
				   //style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ '16.',{text: '工作终结：',colSpan:2}, {}],
        						    [ '',   {text:'（1）保护及二次回路全部工作结束，定值无误，全部工作人员已撤离现场，安全措施已恢复',colSpan:2},{} ],
        						    [ '',   {text:'至许可工作时的状态。',colSpan:2},{} ],
        							
							        [ '',   {text:[ '（2）全部工作于',
								            {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'月',
        						            {text: this.getUnderLineText("", 2),style:'underLineText'},'日',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'时',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'分结束，工作人员已全部撤离，材料工具已清理完毕。'],colSpan:2}, {}],
                                    [ '',   {text:[ '工作负责人：', 
        							        {text: this.getUnderLineText("", 28),style:'underLineText'},'  时间：',
        							        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        								    {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        							        {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        							        {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        								    {text: this.getUnderLineText("", 4),style:'underLineText'},'分' ],colSpan:2}, {}],
                                    [ '',   {text:[ '工作许可人：', 
        							        {text: this.getUnderLineText("", 28),style:'underLineText'},'  时间：',
        							        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        								    {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        							        {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        							        {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        								    {text: this.getUnderLineText("", 4),style:'underLineText'},'分' ],colSpan:2}, {}],
		          			        [ '17.',{text: '工作票终结：',colSpan:2}, {}],
							        [ '',   {text:[ '临时遮栏、标示牌已拆除，常设遮栏已恢复。已拆除（或已拉开）的接地线、接地闸刀（小车）共',
							                {text: this.getUnderLineText("", 8),style:'underLineText'},'副（台），已汇报值班分责人。'],colSpan:2}, {}],
                                    [ '',   {text:[ '拆除时间：',
								            {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'月',
        						            {text: this.getUnderLineText("", 2),style:'underLineText'},'日',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'时',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'分'],colSpan:2}, {}],
								    [ '',   {text:[ '工作许可人：', 
        							        {text: this.getUnderLineText("", 28),style:'underLineText'},'  值班负责人：',
        							        {text: this.getUnderLineText("", 28),style:'underLineText'}],colSpan:2}, {}],
        							[ '18.', {text:'备注：',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				}
           ];
        return content;
    },
    // JXD	检修作业通知单lww
    onPrintGzp_JXD:function(modelData){
        var iwerkText = this.onGetIwerkText(modelData.Iwerk);
        if(iwerkText){
            iwerkText = iwerkText.replace(/物资工厂/, '');
        }
        var ticketTypeText = this.onGetTicketTypeText(modelData.Ztype);
        var appDepdec = this.onGetAppdepText(modelData.Appdep);
        //工作班组成员
        var groupPersons = "";
        for(var i=0;i<modelData.GroupTab.length;i++){
            if(i>0){
                groupPersons = groupPersons + "、";
            }
            groupPersons = groupPersons + modelData.GroupTab[i].Pname;
        }
        // var docDefinition = {
        //     pageMargins: [ 40, 60, 40, 60 ],        //页面边距
        var    content =  [
                {text: iwerkText+'\n'+ticketTypeText+"\n ", style: 'header'},
                {text:'编号：'+modelData.Wcmno,style:'subheader',alignment:'right'},
				{
					style: 'bodyTable',
					table: {
							widths: ['20%','30%','20%','30%'],
							body: [
									[ {text: '作业部门\n（单位）\n\n', alignment:'center'},{text: appDepdec,colSpan:3},{},{}],
									[ {text: '作业内容\n\n\n\n', alignment:'center'},{text: modelData.SCont,colSpan:3},{},{}],
									[ {text: '作业地点\n\n\n\n', alignment:'center'},{text: modelData.SPlace,colSpan:3},{},{}],
									[ {text: '计划作业时间\n\n\n', alignment:'center'},
									  {text: [{text: this.getUnderLineText(modelData.Jhgzbedate.substring(0,4), 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText(modelData.Jhgzbedate.substring(5,7), 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText(modelData.Jhgzbedate.substring(8,10), 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText(modelData.Jhgzbetime.substring(0,2), 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText(modelData.Jhgzbetime.substring(3,5), 2),style:'underLineText'},'分--',
									        {text: this.getUnderLineText(modelData.Jhgzfidate.substring(0,4), 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText(modelData.Jhgzfidate.substring(5,7), 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText(modelData.Jhgzfidate.substring(8,10), 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText(modelData.Jhgzfitime.substring(0,2), 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText(modelData.Jhgzfitime.substring(3,5), 2),style:'underLineText'},'分'],alignment:'center',colSpan:3},{},{}],
									[ {text: '工作负责人\n\n\n', alignment:'center'},{text: modelData.Name},
									  {text: '联系电话\n\n\n', alignment:'center'},{text: modelData.Phone1}],
									[ {text: '工作班成员\n\n\n\n', alignment:'center'},{text: groupPersons,colSpan:3},{},{}],
									[ {text: '值班负责人意见\n\n\n', alignment:'center'},
									  {text: ['\n签名           ',{text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:3},{},{}],
									[ {text: '运行许可意见\n\n\n', alignment:'center'},
									  {text: ['\n签名           ',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:3},{},{}],
        							[ {text: '终结时间', alignment:'center',rowSpan:2},
        							  {text: [{text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日\n',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'], alignment:'right',rowSpan:2},{text: '工作负责人'},{text: '陈超'}],
        							[ '','',{text: '运行许可人'},{text: '陈超'}],
        							[ {text: '检修遗留问题或其它需要说明事项\n\n\n\n\n\n', alignment:'center'},{text: '',colSpan:3},{},{}]
							]
					}
				}
        	];

        return content;
    },
    // QXD	事故抢修单lww
    onPrintGzp_QXD:function(modelData){
        var iwerkText = this.onGetIwerkText(modelData.Iwerk);
        if(iwerkText){
            iwerkText = iwerkText.replace(/物资工厂/, '');
        }
        var ticketTypeText = this.onGetTicketTypeText(modelData.Ztype);
        var appDepdec = this.onGetAppdepText(modelData.Appdep);
        var classdec = this.onGetClassDec(modelData.Class);
        //工作班组成员
        var groupPersons = "";
        for(var i=0;i<modelData.GroupTab.length;i++){
            if(i>0){
                groupPersons = groupPersons + "、";
            }
            groupPersons = groupPersons + modelData.GroupTab[i].Pname;
        }
        var groupPersonNum = modelData.GroupTab.length;
        var    content = [
                {
					table: {
							widths: ['20%','60%','20%'],
							body: [
        							[ '', {text: iwerkText +'\n'+ticketTypeText+"\n ", style: 'header'},'']
							]
					},
					layout: 'noBorders'
				},
                {text:'编号：'+modelData.Wcmno,style:'subheader'},
				{
				// 	style: 'bodyTable',
					table: {
							widths: ['51%','49%'],
							body: [
        							[ {text:['部门： ',{text: this.getUnderLineText(appDepdec, 36),style:'underLineText'}]}, 
        							 {text:[ '填写时间：',
									        {text: this.getUnderLineText(modelData.Crdate.substring(0,4), 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText(modelData.Crdate.substring(5,7), 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText(modelData.Crdate.substring(8,10), 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText(modelData.Crdate.substring(0,2), 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText(modelData.Crdate.substring(3,5), 2),style:'underLineText'},'分']}]
							]
					},
					layout: 'noBorders'
				},
                {
				// 	style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['2%','48%','50%'],
							body: [
									[ '1.',{text:['抢修工作负责人（监护人）：',{text: this.getUnderLineText(modelData.Name, 14),style:'underLineText'}]}, 
									       {text:[ '班组：',{text: this.getUnderLineText(classdec, 32),style:'underLineText'}]} ],
									[ '2.', {text: '抢修班人员（不包括工作负责人）', colSpan:2}, {}],
									[ '',{text:[{text: this.getUnderLineText(groupPersons, 74),style:'underLineText'},
							             '共',{text: this.getUnderLineText(groupPersonNum, 4),style:'underLineText'},'人'],colSpan:2}, {}],
									[ '3.', {text: '抢修任务（抢修地点和抢修内容，有二级动火的必须注明有二级动火）',colSpan:2}, {}],
									[ '', {text: this.getUnderLineText(modelData.SPlace+modelData.SCont, 167),style:'underLineText', colSpan:2}, {}],
        							[ '4.', {text:'安全措施（有动火的包括动火时的安措）:',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
                {
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['100%'],
							body: [
									[{text:'（1）\n（2）'}]
							]
					}
				},
				{
				// 	style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ '5.', {text:'抢修地点保留带电部分或注意事项',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
				{
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['100%'],
							body: [
									[{text:'（1）\n（2）'}]
							]
					}
				},
				{
				    // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ '6.',{text:[ '上述1~5项由抢修工作负责人',{text: this.getUnderLineText(modelData.Name, 14),style:'underLineText'},
							             '根据抢修任务布置人',{text: this.getUnderLineText("", 12),style:'underLineText'},
        							     '的布置填写'],colSpan:2}, {}],
        							[ '7.', {text:'经现场勘察，需补充下列安全措施',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
				{
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['100%'],
							body: [
									[{text:'（1）\n（2）'}]
							]
					}
				},
				{
					table: {
							widths: ['2%','48%','50%'],
							body: [
                                    [ '8.',  {text:[ '经值班负责人（值长）：',
                                            {text: this.getUnderLineText("林立卫", 8),style:'underLineText'},'同意，上述安全措施已',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 2),style:'underLineText'},'分执行'],colSpan:2},{}],
        							[ '9.', {text:'许可抢修时间',colSpan:2}, {}],
                                    [ '',  {text:['许可开工时间',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分 许可人', 
        									{text: this.getUnderLineText("林立卫", 8),style:'underLineText'},'抢修负责人',
                                            {text: this.getUnderLineText("雷春英", 8),style:'underLineText'}],colSpan:2},{}],
                                    [ '10.', {text:'抢修结束汇报',colSpan:2}, {}],
        							[ '', {text:[ '本抢修工作于',
							        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
									{text: this.getUnderLineText("", 4),style:'underLineText'},'分结束'],colSpan:2}, {}],
									[ '', {text:[ '现场设备状况及保留安全措施：',{text: this.getUnderLineText("", 223),style:'underLineText'}],colSpan:2}, {}],
        						    [ '', {text:[ '抢修班人员已全部撤离，材料工具已清理完毕。抢修工作负责人 ：',{text: this.getUnderLineText("", 10),style:'underLineText'},
        						          '许可人',{text: this.getUnderLineText("", 8),style:'underLineText'}],colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				}
			];
		return content;
    },
// RJP	热力机械工作票HX
    onPrintGzp_RJP:function(modelData){
        var iwerkText = this.onGetIwerkText(modelData.Iwerk);
        if(iwerkText){
            iwerkText = iwerkText.replace(/物资工厂/, '');
        }
        var ticketTypeText = this.onGetTicketTypeText(modelData.Ztype);
        var appDepdec = this.onGetAppdepText(modelData.Appdep);
        var classdec = this.onGetClassDec(modelData.Class);
        var lxbmText = this.onGetLxbmText(modelData.Lxbm);
        //工作班组成员
        var groupPersons = "";
        for(var i=0;i<modelData.GroupTab.length;i++){
            if(i>0){
                groupPersons = groupPersons + "、";
            }
            groupPersons = groupPersons + modelData.GroupTab[i].Pname;
        }
        var groupPersonNum = modelData.GroupTab.length;
        var fuyeNum = modelData.KksTab.length;
        //安全措施
        var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
        var aqcsStorage = oStorage.get("ZPMOFFLINE_SRV.ZPMTQPCDT");
        var arrAqcs=[];
        for(var i=0;i<aqcsStorage.length;i++){
            if(aqcsStorage[i].Katalogart == 'X' && aqcsStorage[i].Ztype == modelData.Ztype ){
                arrAqcs.push([aqcsStorage[i].Code,aqcsStorage[i].Kurztext]);
            }
        }
        var aqcsBody = [];
        var currCode;
        var tmpNo = 0;
        var cn_no = ["一","二","三","四","五","六","七","八","九","十"];
        for(var i=0;i<arrAqcs.length;i++){
            if(!currCode || currCode != arrAqcs[i][0]){
                currCode = arrAqcs[i][0];
            }
            for(var j=0;j<modelData.AqcsTabX.length;j++){
                if(currCode == modelData.AqcsTabX[j].Code){
                    if(modelData.AqcsTabX[j].Seqc == '1'){
                        //表头
                        aqcsBody.push([ cn_no[tmpNo],{text:arrAqcs[i][1],style:'tableHeader',alignment:'center'}, {text: '安措执行情况',style:'tableHeader', alignment:'center'}]);
                        tmpNo ++;
                    }
                    aqcsBody.push([ modelData.AqcsTabX[j].Seqc, {text:modelData.AqcsTabX[j].Actext},{text:''} ]);
                }
            }
        }

        //根据双签标识，生成行
        var Line1 = [];
        var Line2 = [];
        Line1.push([ '1.',{text:[ '工作单位：',{text: this.getUnderLineText(appDepdec, 28),style:'underLineText'}]}, 
						  {text:[ '班组：',{text: this.getUnderLineText(classdec, 34),style:'underLineText'}]} ]);
        Line1.push([ '', {text:[ '工作负责人：',{text: this.getUnderLineText(modelData.Name, 26),style:'underLineText'}]},
						 {text:[ '联系方式：',{text: this.getUnderLineText(modelData.Phone1, 30),style:'underLineText'}]} ]);
        if(modelData.Sqbz == true){
            Line1.push([ '',{text:[ '联系部门：',{text: this.getUnderLineText(modelData.Lxbm, 16),style:'underLineText'},
							        '联系人：',{text: this.getUnderLineText(modelData.Contact, 20),style:'underLineText'},
        						    '联系方式：',{text: this.getUnderLineText(modelData.Phone, 18),style:'underLineText'}],colSpan:2}, {}]);
            Line2.push([ '5.', {text:[ '外包单位签发人：',{text: this.getUnderLineText("", 22),style:'underLineText'}]}, 
                               {text:[ '签发时间：',{text: this.getUnderLineText("", 4),style:'underLineText'},'年',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
                                			        {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
            Line2.push([ '', {text:[ '业主签发人：', {text: this.getUnderLineText("", 26),style:'underLineText'}]}, 
                             {text:[ '签发时间：', {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
                                				   {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
                                				   {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
                                				   {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
                                				   {text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
             }else{
            Line2.push([ '5', {text:[ '工作票签发人：', {text: this.getUnderLineText("", 24),style:'underLineText'}]}, 
                              {text:[ '签发时间：', {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'时',
                                				    {text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
             }
             
        var content = [
                //  抬头
                {                                  
                    table:{
                        widths: ['20%','60%','20%'],
                        	body: [
        							[ '', {text: iwerkText+'\n'+ticketTypeText+"\n ", style: 'header'},
        							    [
        							        {
                            					table: {
                            							body: [[{text:'盖 “已执行” 章',style:'smallText'}]]
                            					}
            							    },
            							    '\n'
        							    ]
        							]
							]
                    },
					layout: 'noBorders'
                },
                {text:'编号：'+modelData.Wcmno,style:'subheader',alignment:'right'},
              
               // 内容1
        //       {       // 	style: 'bodyTable',
        //           table:{
        //               headerRows: 0,
        //               widths: ['2%','48%','50%'],
        //               body:[
								//     [ '1.',{text:[ '工作单位：',{text: this.getUnderLineText(appDepdec, 28),style:'underLineText'}]}, 
								//           {text:[ '班组：',{text: this.getUnderLineText(classdec, 36),style:'underLineText'}]} ],
								// 	[ '', {text:[ '工作负责人：',{text: this.getUnderLineText(modelData.Name, 26),style:'underLineText'}]},
								// 	      {text:[ '联系方式：',{text: this.getUnderLineText(modelData.Phone1, 32),style:'underLineText'}]} ],
        //                   ]
        //           },
        //         layout: 'noBorders'
        //       },
				{  // 添加双签标识
				    // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: Line1
					},
					layout: 'noBorders'
				},
				
               {       // 	style: 'bodyTable',
                   table:{
                       headerRows: 0,
                       widths: ['2%','48%','50%'],
                       body:[
									[ '', {text:['工作班组成员（不包含工作负责人）',{text:this.getUnderLineText(groupPersons, 114),style:'underLineText'},
									        '等共',{text:this.getUnderLineText(groupPersonNum, 2),style:'underLineText'},'人，附页',
									        {text:this.getUnderLineText(fuyeNum, 2),style:'underLineText'},'张'],colSpan:2}, {} ],
									[ '2.', {text:[ '工作地点：',{text: this.getUnderLineText(modelData.SPlace, 73),style:'underLineText'}],colSpan:2}, {}],
									[ '', {text:[ '工作内容：',{text: this.getUnderLineText(modelData.SCont, 73),style:'underLineText'}],colSpan:2}, {}],
									[ '3.', {text:[ '工作计划开始时间：',
									        {text: this.getUnderLineText(modelData.Jhgzbedate.substring(0,4), 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText(modelData.Jhgzbedate.substring(5,7), 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText(modelData.Jhgzbedate.substring(8,10), 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText(modelData.Jhgzbetime.substring(0,2), 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText(modelData.Jhgzbetime.substring(3,5), 2),style:'underLineText'},'分'],colSpan:2}, {}],
									[ '', {text:[ '工作计划完成时间：',
									        {text: this.getUnderLineText(modelData.Jhgzfidate.substring(0,4), 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText(modelData.Jhgzfidate.substring(5,7), 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText(modelData.Jhgzfidate.substring(8,10), 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText(modelData.Jhgzfitime.substring(0,2), 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText(modelData.Jhgzfitime.substring(3,5), 2),style:'underLineText'},'分'],colSpan:2}, {}],
        							[ '4.', {text:'安全措施',colSpan:2}, {}]
                           ]
                   },
                layout: 'noBorders'
               },
				
                {   //  动态表输入安全措施
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['2%','58%','40%'],
							body: aqcsBody
					}
				},
				
				{  // 添加双签标识
				    // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: Line2
					},
					layout: 'noBorders'
				},
				
				{
			   // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        				// 			[ '5.', {text:[ '工作票签发人：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}, {text:[ '签发时间：',
									   //     {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        				// 					{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        				// 					{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        				// 					{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        				// 					{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        						    [ '6.', {text:[ '工作票接票人：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}, {text:[ '接票时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        							[ '',   {text:[ '批准工作开始时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}], //
        							[ '',   {text:[ '批准工作结束时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}], //
        							[ '7.', {text:'补充安全措施',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
                {   //  动态表输入安全措施
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['2%','58%','40%'],
							body: [
									[ '序号',{text:'运行值班人员补充的安全措施',style:'tableHeader',alignment:'center'}, {text: '安措执行情况',style:'tableHeader', alignment:'center'}],
									[ '1', {text:''},{text:''} ]
							]
					}
				},
               
				{
				   //style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							['8.',{text:['确认上述安全措施已全部执行完毕，核对无误，从',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'年',  
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'时',  
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'分许可工作'],colSpan:2},{} ],
        							['',  {text:[ '工作许可人：',{text: this.getUnderLineText("", 26),style:'underLineText'}]}, {text:[ '工作负责人：',{text: this.getUnderLineText("", 30),style:'underLineText'}]} ],
                                   	['9.',{text:[ '确认工作负责人布置的工作任务和安全措施'],colSpan:2 },{}],
                                   	['',  {text:[ '工作班组成员签名：',{text: this.getUnderLineText("", 65),style:'underLineText'}],colSpan:2}, {}],
								    ['10.',{text:[ '工作负责人变更：'],colSpan:2}, {}],
						            ['',  {text:['自',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'年',  
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'时',  
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'分原工作负责人',
        								  {text: this.getUnderLineText("", 12),style:'underLineText'},'离去，变更',
        								  {text: this.getUnderLineText("", 17),style:'underLineText'}],colSpan:2},{} ],
                                    ['', {text:['为工作负责人，变更后工作负责人联系方式：',
                                         {text: this.getUnderLineText("", 43),style:'underLineText'}],colSpan:2},{}],
	                                ['', {text:[ '工作票签发人：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}, {text:[ '工作许可人：',  {text: this.getUnderLineText("", 30),style:'underLineText'}]}],
                                    ['11.', {text:['工作人员变动情况（变动人员姓名、日期及时间）：', {text: this.getUnderLineText("", 37),style:'underLineText'}],colSpan:2},{}],
                                    ['', {text:['工作负责人签名：', {text: this.getUnderLineText("", 67),style:'underLineText'}],colSpan:2},{}],
					            	['12.', {text:['工作票延期：'],colSpan:2},{}],
						            ['',  {text:['有效期延长到：',
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'年',  
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'月', 
        							      {text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'时',  
        								  {text: this.getUnderLineText("", 4),style:'underLineText'},'分     工作签发人：', 
        								  {text: this.getUnderLineText("", 22),style:'underLineText'}],colSpan:2},{} ],
                                    [ '',{text:[ '工作负责人：',{text: this.getUnderLineText("", 28),style:'underLineText'}]}, {text:[ '值班负责人：',{text: this.getUnderLineText("", 30),style:'underLineText'}]} ],
        							[ '13.', {text:'根据工作需要，工作票押回运行保管：',colSpan:2}, {}]	  
        								  
							]
					},
					layout: 'noBorders'
				},

                {   //  动态表输入押回运行保管
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['30%','20%','20%','30%' ],
							body: [
									[ {text: '工作票交回运行人员时间',style:'tableHeader',alignment:'center'}, 
								      {text: '工作许可人',style:'tableHeader', alignment:'center'},
								      {text: '工作负责人',style:'tableHeader', alignment:'center'},
								      {text: '押回原因', style:'tableHeader', alignment:'center'}],
									[ {text: '\n'}, {text:''},{text:''},{text:''} ]
							]
					}
				},
				{
				//   style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
							    [ '14.', {text:'根据工作需要，工作票所列安全措施已全部执行，可以重新工作：',colSpan:2}, {}]	  
							]
					},
					layout: 'noBorders'
				},
               
                {   //  动态表输入
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['30%','20%','20%','30%' ],
							body: [
									[ {text: '允许恢复工作时间',style:'tableHeader',alignment:'center'}, 
								      {text: '工作许可人',style:'tableHeader', alignment:'center'},
								      {text: '工作负责人',style:'tableHeader', alignment:'center'},
								      {text: '工作重新许可原因', style:'tableHeader', alignment:'center'}],
									[ {text: '\n'}, {text:''},{text:''},{text:''} ]
							]
					}
				},
               
				{
				   //style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ '15.',{text: '工作总结：',colSpan:2}, {}],
							        [ '',   {text:[ '全部工作于：',
								            {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'月',
        						            {text: this.getUnderLineText("", 2),style:'underLineText'},'日',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'时',
        							        {text: this.getUnderLineText("", 2),style:'underLineText'},'分结束，设备及安全措施已恢复至开工状态'],colSpan:2}, {}],
        					    	[ '',   {text:'工作人员已全部撤离，材料工具已清理完毕，工作已总结。',colSpan:2},{} ],
							        [ '',   {text:[ '工作负责人：', 
        							        {text: this.getUnderLineText("", 28),style:'underLineText'},'  工作许可人：',
        							        {text: this.getUnderLineText("", 28),style:'underLineText'}],colSpan:2}, {}],
        							
        							[ '20.', {text:'备注：',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}]
        						    
        								  
							]
					},
					layout: 'noBorders'
				}
            ];
        return content;
        },
    // RKP	热控工作票lww
    onPrintGzp_RKP:function(modelData){
        var iwerkText = this.onGetIwerkText(modelData.Iwerk);
        if(iwerkText){
            iwerkText = iwerkText.replace(/物资工厂/, '');
        }
        var ticketTypeText = this.onGetTicketTypeText(modelData.Ztype);
        var appDepdec = this.onGetAppdepText(modelData.Appdep);
        var classdec = this.onGetClassDec(modelData.Class);
        var lxbmText = this.onGetLxbmText(modelData.Lxbm);
        //工作班组成员
        var groupPersons = "";
        for(var i=0;i<modelData.GroupTab.length;i++){
            if(i>0){
                groupPersons = groupPersons + "、";
            }
            groupPersons = groupPersons + modelData.GroupTab[i].Pname;
        }
        var groupPersonNum = modelData.GroupTab.length;
        var fuyeNum = modelData.KksTab.length;
        //安全措施表
        var aqcsBodyX = [[ '序号',{text:'必须采取的安全措施',style:'tableHeader',alignment:'center'},{text:'安措执行情况',style:'tableHeader',alignment:'center'}]];
        for(var i=0;i<modelData.AqcsTabX.length;i++){
            aqcsBodyX.push([modelData.AqcsTabX[i].Seqc,modelData.AqcsTabX[i].Actext,'']);
        }
        var aqcsBodyY = [[ '序号',{text:'运行值班人员补充的安全措施',style:'tableHeader',alignment:'center'},{text:'补充安措执行情况',style:'tableHeader',alignment:'center'}]];
        for(var i=0;i<modelData.AqcsTabY.length;i++){
            aqcsBodyY.push([modelData.AqcsTabY[i].Seqc,modelData.AqcsTabY[i].Actext,'']);
        }
        
                //根据双签标识，生成第一项和第八项
        var formPart1 = [];
        var gzpqfr = [];
        formPart1.push([ '1.',{text:[ '工作单位：',{text: this.getUnderLineText(appDepdec, 28),style:'underLineText'}]}, 
									        {text:[ '班组：',{text: this.getUnderLineText(classdec, 34),style:'underLineText'}]} ]);
        formPart1.push([ '', {text:[ '工作负责人（监护人）：',{text: this.getUnderLineText(modelData.Name, 16),style:'underLineText'}]},
									      {text:[ '联系方式：',{text: this.getUnderLineText(modelData.Phone1, 30),style:'underLineText'}]} ]);
        //双签标识
        if(modelData.Sqbz == true){
            formPart1.push([ '',{text:[ '联系部门：',{text: this.getUnderLineText(modelData.Lxbm, 16),style:'underLineText'},
							             '联系人：',{text: this.getUnderLineText(modelData.Contact, 20),style:'underLineText'},
        							     '联系方式：',{text: this.getUnderLineText(modelData.Phone, 18),style:'underLineText'}],colSpan:2}, {}]);
            gzpqfr.push([ '6.', {text:[ '外包单位签发人：',{text: this.getUnderLineText("", 22),style:'underLineText'}]}, {text:[ '签发时间：',
    									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
            gzpqfr.push([ '', {text:[ '业主签发人：',{text: this.getUnderLineText("", 26),style:'underLineText'}]}, {text:[ '签发时间：',
    									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
        }else{
            gzpqfr.push([ '6.', {text:[ '工作票签发人：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}, {text:[ '签发时间：',
    									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
            									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]);
        }
        formPart1.push([ '', {text:['工作班组成员（不包含工作负责人）',{text:this.getUnderLineText(groupPersons, 114),style:'underLineText'},
									        '等共',{text:this.getUnderLineText(groupPersonNum, 2),style:'underLineText'},'人，附页',
									        {text:this.getUnderLineText(fuyeNum, 2),style:'underLineText'},'张'],colSpan:2}, {} ]);
        var content = [
                {
					table: {
							widths: ['20%','60%','20%'],
							body: [
        							[ '', {text: iwerkText+'\n'+ticketTypeText+'\n', style: 'header'},
        							    [
        							        {
                            					table: {
                            							body: [[{text:'盖 “已执行” 章',style:'smallText'}]]
                            					}
            							    }
        							    ]
        							]
							]
					},
					layout: 'noBorders'
				},
                {text:'编号：'+modelData.Wcmno,style:'subheader',alignment:'right'},
                {
				// 	style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['2%','48%','50%'],
							body: formPart1
					},
					layout: 'noBorders'
				},
                {
				// 	style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['2%','48%','50%'],
							body: [
									[ '', {text:['工作班组成员（不包含工作负责人）',{text:this.getUnderLineText(groupPersons, 114),style:'underLineText'},
									       '等共',{text:this.getUnderLineText(groupPersonNum, 2),style:'underLineText'},
									       '人，附页',{text:this.getUnderLineText(fuyeNum, 2),style:'underLineText'},'张'],colSpan:2}, {} ],
									[ '2.', {text:[ '工作地点：',{text: this.getUnderLineText(modelData.SPlace, 73),style:'underLineText'}],colSpan:2}, {}],
									[ '', {text:[ '工作内容：',{text: this.getUnderLineText(modelData.SCont, 73),style:'underLineText'}],colSpan:2}, {}],
									[ '3.', {text:[ '工作计划开始时间：',
									        {text: this.getUnderLineText(modelData.Jhgzbedate.substring(0,4), 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText(modelData.Jhgzbedate.substring(5,7), 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText(modelData.Jhgzbedate.substring(8,10), 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText(modelData.Jhgzbetime.substring(0,2), 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText(modelData.Jhgzbetime.substring(3,5), 2),style:'underLineText'},'分'],colSpan:2}, {}],
									[ '', {text:[ '工作计划完成时间：',
									        {text: this.getUnderLineText(modelData.Jhgzfidate.substring(0,4), 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText(modelData.Jhgzfidate.substring(5,7), 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText(modelData.Jhgzfidate.substring(8,10), 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText(modelData.Jhgzfitime.substring(0,2), 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText(modelData.Jhgzfitime.substring(3,5), 2),style:'underLineText'},'分'],colSpan:2}, {}],
        							[ '4.', {text:[ '需要退出热工作保护或自动装置名称：',{text: this.getUnderLineText(modelData.Xtcbh, 49),style:'underLineText'}],colSpan:2}, {}],
        							[ '5.', {text:'必须采取的安全措施:',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
                {
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['4%','56%','40%'],
							body: aqcsBodyX
					}
				},
                {
				// 	style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['2%','48%','50%'],
							body: gzpqfr
					},
					layout: 'noBorders'
				},
				{
				    // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        						    [ '7.', {text:[ '工作票接票人：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}, {text:[ '接票时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
        							[ '', {text:[ '批准工作开始时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}],
									[ '', {text:[ '批准工作结束时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],colSpan:2}, {}],
						
        							[ '8.', {text:[ '确认上述安全措施已全部执行完毕，核对无误，从',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分许可工作'],colSpan:2},{}],
        							[ '',{text:[ '工作许可人：',{text: this.getUnderLineText("", 14),style:'underLineText'},
							             '工作负责人：',{text: this.getUnderLineText("", 16),style:'underLineText'},
        							     '值班负责人：',{text: this.getUnderLineText("", 16),style:'underLineText'}],colSpan:2}, {}],
        							[ '9.', {text:'补充安全措施:',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
                {
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['4%','56%','40%'],
							body: aqcsBodyY
					}
				},
				{
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ '10.', {text:'确认工作负责人布置的工作任务和安全措施',colSpan:2}, {}],
        							[ '', {text:[ '工作班组成员签名：',{text: this.getUnderLineText("", 65),style:'underLineText'}],colSpan:2}, {}],
        							[ '11.', {text:'工作负责人变更：',colSpan:2}, {}],
        							[ '', {text:[ '自',
							        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
									{text: this.getUnderLineText("", 4),style:'underLineText'},'分原工作负责人',
									{text: this.getUnderLineText("", 10),style:'underLineText'},'离去，变更',
									{text: this.getUnderLineText("", 10),style:'underLineText'},'为工作负责人，变更后工作负责人联系方式：',
									{text: this.getUnderLineText("", 30),style:'underLineText'}],colSpan:2}, {}],
									[ '', {text:[ '工作票签发人：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}, {text:[ '工作许可人：',{text: this.getUnderLineText("", 28),style:'underLineText'}]}],
        							[ '12.', {text:[ '工作人员变动情况（变动人员姓名、日期及时间）：',{text: this.getUnderLineText("", 37),style:'underLineText'}],colSpan:2}, {}],
        						    [ '', {text:[ '工作负责人签名：',{text: this.getUnderLineText("", 67),style:'underLineText'}],colSpan:2}, {}],
        						    [ '13.', {text:'工作票延期：',colSpan:2}, {}],
        						    [ '',  {text:[ '有效期延长到：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 2),style:'underLineText'},'分']},
        									{text:[ '工作签发人：',{text: this.getUnderLineText("", 28),style:'underLineText'}]}],
        						    [ '', {text:[ '工作负责人：',{text: this.getUnderLineText("", 26),style:'underLineText'}]},
        									{text:[ '值班负责人：',{text: this.getUnderLineText("", 28),style:'underLineText'}]}],
        							[ '14.', {text:'根据工作需要，工作票押回运行保管：',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
				{
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['32%','18%','18%','32%'],
							body: [
									[ {text:'工作票交回运行人员时间',style:'tableHeader',alignment:'center'},
									  {text:'工作许可人',style:'tableHeader',alignment:'center'},
									  {text:'工作负责人',style:'tableHeader',alignment:'center'},
									  {text:'押回原因',style:'tableHeader',alignment:'center'}],
									[ '\n', {text:''},{text:''},''],
									[ '\n', {text:''},{text:''},''],
									[ '\n', {text:''},{text:''},''],
									[ '\n', {text:''},{text:''},''],
									[ '\n', {text:''},{text:''},'']
							]
					}
				},
				{
				// 	style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ '15.', {text:'根据工作需要，工作票所列安全措施已全部执行，可以重新工作：',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				},
				{
					style: 'bodyTable',
					table: {
							headerRows: 0,
							widths: ['32%','18%','18%','32%'],
							body: [
									[ {text:'允许恢复工作时间',style:'tableHeader',alignment:'center'},
									  {text:'工作许可人',style:'tableHeader',alignment:'center'},
									  {text:'工作负责人',style:'tableHeader',alignment:'center'},
									  {text:'工作重新许可原因',style:'tableHeader',alignment:'center'}],
									[ '\n', {text:''},{text:''},''],
									[ '\n', {text:''},{text:''},''],
									[ '\n', {text:''},{text:''},''],
									[ '\n', {text:''},{text:''},''],
									[ '\n', {text:''},{text:''},'']
							]
					}
				},
				{
				// 	style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ '16.', {text:'工作票终结：',colSpan:2}, {}],
        							[ '', {text:[ '全部工作于',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分结束，工作人员已全部撤离，现场已清理完毕。'],colSpan:2},{}],
        							[ '',{text:[ '工作负责人：',{text: this.getUnderLineText("", 28),style:'underLineText'}]},
        							     {text:[ '工作许可人：',{text: this.getUnderLineText("", 28),style:'underLineText'}]}],
        							[ '17.', {text:'备注：',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}],
        							[ '', {text:this.getUnderLineText("", 83),style:'underLineText',colSpan:2}, {}]
							]
					},
					layout: 'noBorders'
				}
			];
			return content;
    },
    //打印危险点
    onPrintGZPDanger:function(modelData){
    //工作票危险点
        var iwerkText = this.onGetIwerkText(modelData.Iwerk);
        if(iwerkText){
            iwerkText = iwerkText.replace(/物资工厂/, '');
        }
        var appDepdec = this.onGetAppdepText(modelData.Appdep);
        var classdec = this.onGetClassDec(modelData.Class);
        var boxZaqm = modelData.Zaqm ? '\u25a0' : '\u25a1';
        var boxZaqs = modelData.Zaqs ? '\u25a0' : '\u25a1';
        var boxZaqd = modelData.Zaqd ? '\u25a0' : '\u25a1';
        var boxZjyst = modelData.Zjyst ? '\u25a0' : '\u25a1';
        var boxZjyx = modelData.Zjyx ? '\u25a0' : '\u25a1';
        var boxZjyd = modelData.Zjyd ? '\u25a0' : '\u25a1';
        var boxZstzk = modelData.Zstzk ? '\u25a0' : '\u25a1';
        var boxZydq = modelData.Zydq ? '\u25a0' : '\u25a1';
        var boxZmhq = modelData.Zmhq ? '\u25a0' : '\u25a1';
        var boxZes = modelData.Zes ? '\u25a0' : '\u25a1';
        var boxZfhyj = modelData.Zfhyj ? '\u25a0' : '\u25a1';
        var boxZhjyj = modelData.Zhjyj ? '\u25a0' : '\u25a1';
        var boxZhjst = modelData.Zhjst ? '\u25a0' : '\u25a1';
        var boxZfcmz = modelData.Zfcmz ? '\u25a0' : '\u25a1';
        var boxZfhz = modelData.Zfhz ? '\u25a0' : '\u25a1';
        var boxZhxq = modelData.Zhxq ? '\u25a0' : '\u25a1';
        var boxZzl = modelData.Zzl ? '\u25a0' : '\u25a1';
        var boxZtz = modelData.Ztz ? '\u25a0' : '\u25a1';
        var boxZqt = modelData.Zqt ? '\u25a0' : '\u25a1';
        
        var oTableBody1 = [[{text:'部门',alignment:'center'},{text:appDepdec},
    						  {text: '班组', alignment:'center'},{text: classdec},
    						  {text: '工作负责人', alignment:'center'},{text: modelData.Name},
    						  {text: '关联工作票号', alignment:'center'},{text: 'DCC_2081_15\n1103_001'}],
    						[ {text:'工作\n内容',alignment:'center'}, {text:modelData.SCont,colSpan:7},{},{},{},{},{},{}],
    						[ {text:'一',alignment:'center'}, {text:'危险源及控制措施',alignment:'center',colSpan:7},{},{},{},{},{},{}],
    						[ {text:'序号',alignment:'center'},{text:'步骤或活动',alignment:'center'},
    						  {text:'危险点',alignment:'center'},{text:'伤害类型',alignment:'center'},
    						  {text:'控制措施',alignment:'center',colSpan:4},{},{},{}]
						];
        for(var i=0;i<modelData.DangerTab.length;i++){
            if(modelData.DangerTab[i].Zfxlx === '1'){
                var line = [{text:modelData.DangerTab[i].Dangno,alignment:'center'},modelData.DangerTab[i].Dangsnot,modelData.DangerTab[i].Zztext,modelData.DangerTab[i].Zzremark,{text:modelData.DangerTab[i].Zzpltxt,colSpan:4},{},{},{}];
                oTableBody1.push(line);
            }
        }
		oTableBody1.push([ {text:'二',alignment:'center'}, {text:'环境因素及控制措施',alignment:'center',colSpan:7},{},{},{},{},{},{}],
						[ {text:'序号',alignment:'center'},{text:'步骤或活动',alignment:'center'},
						  {text:'危险点',alignment:'center'},{text:'危害类型',alignment:'center'},
						  {text:'控制措施',alignment:'center',colSpan:4},{},{},{}]);
        for(var i=0;i<modelData.DangerTab.length;i++){
            if(modelData.DangerTab[i].Zfxlx === '2'){
                var line = [{text:modelData.DangerTab[i].Dangno,alignment:'center'},modelData.DangerTab[i].Dangsnot,modelData.DangerTab[i].Zztext,modelData.DangerTab[i].Zzremark,{text:modelData.DangerTab[i].Zzpltxt,colSpan:4},{},{},{}];
                oTableBody1.push(line);
            }
        }
// 		oTableBody1.push([ {text:'1',alignment:'center'},{text:'地方'},
// 						  {text:''},{text:''},
// 						  {text:'',colSpan:4},{},{},{}]);
// 		console.log(oTableBody1);
        var docDefinition = {
            pageMargins: [ 40, 60, 40, 60 ],        //页面边距
            content: [
                {text: iwerkText+'\n'+"风险预控措施交底单\n ", style: 'header'},
				{
					style: 'bodyTable',
					table: {
							widths: ['10%','15%','10%','15%','10%','15%','10%','15%'],
							body: oTableBody1
					}
				},
				{
				    style:'bodyTable',
				    table:{
				        widths: ['9%','91%'],
				        body:[
				               [ {text:'防护\n措施',alignment:'center'},
    							   {
                					table: {
                					    width:['10%','15%','10%','15%','10%','15%','*'],
                						body: [
                						    [{text:boxZaqm+'安全帽'},boxZaqs+'安全绳',boxZaqd+'安全带',boxZjyst+'绝缘手套',boxZjyx+'绝缘鞋',boxZjyd+'绝缘垫',boxZstzk+'手套钻孔'],
                						    [{text:boxZydq+'验电器'},boxZmhq+'灭火器',boxZes+'耳塞',boxZfhyj+'防护眼镜',boxZhjyj+'焊接眼镜',boxZhjst+'焊接手套',boxZfcmz+'防尘面罩'],
                						    [{text:boxZfhz+'防护罩'},boxZhxq+'呼吸器',boxZzl+'遮栏',boxZtz+'梯子',boxZqt+'其它（）','','']
                						]
                					},
                					layout: 'noBorders'
        						}
    						]
				        ]
				    }
				},
				{
				    style:'bodyTable',
				    table:{
				        widths: ['100%'],
				        body:[
				            [{
    				            table:{
    				                body:[[{text:'作业班组成员声明：我已经学习并认可上述风险预控措施，在作业中认真遵照执行。'}],
                                          [{text:'作业班组成员签名：\n \n \n \n \n '}],
                                          [{text:'工作负责人签名:_______________',alignment:'right'}],
                                          [{text:[{text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分'],alignment:'right'}]
                                    ]
    				            },
    				            layout:'noBorders'
    				        }]
				        ]
				    }
				}
        	],
			styles: {
        		header: {//大标题
        			fontSize: 18,
        			bold: false,
        			alignment: 'center',
        			color: 'black',
        			margin: [0, 10, 0, 10]      //表格里不生效
        		},
        		subheader: {//普通文本编号
        			fontSize: 12,
        			bold: false,
        			margin: [0, 0, 10, 10]
        		},
        		underLineText: {//下划线文本
        			fontSize: 12,
        			bold: false,
        // 			margin: [0, 3, 0, 5],
        			decoration: 'underline'
        		},
        		bodyTable: {//表格格式，主要是结束的margin
        		    fontSize: 12,
        			margin: [0, 0, 0, 0]
        		}
        	},
            defaultStyle: {
                font: 'simfang'
            }
        };
        pdfMake.fonts = {
           simfang: {
             normal: 'simfang.ttf',
             bold: 'simfang.ttf',
             italics: 'simfang.ttf',
             bolditalics: 'simfang.ttf'
           }
        };
        // open the PDF in a new window
         pdfMake.createPdf(docDefinition).open();
        // print the PDF (not working in this version, will be added back in a couple of days)
        // pdfMake.createPdf(docDefinition).print();
        // download the PDF
        // window.pdfmake.createPdf(docDefinition).download();
    },
    //打印附页
    onPrintGZPFuye:function(modelData){
    //工作票附页
        var iwerkText = this.onGetIwerkText(modelData.Iwerk);
        if(iwerkText){
            iwerkText = iwerkText.replace(/物资工厂/, '');
        }
        var ticketTypeText = this.onGetTicketTypeText(modelData.Ztype);
        var beginTime = modelData.Jhgzbedate.substring(0,4) + '月'+
                        modelData.Jhgzbedate.substring(5,7)+'月'+
                        modelData.Jhgzbedate.substring(8,10)+'日'+
                        modelData.Jhgzbetime.substring(0,2)+'时'+
                        modelData.Jhgzbetime.substring(3,5)+'分';
        var endTime = modelData.Jhgzfidate.substring(0,4)+'年'+
                        modelData.Jhgzfidate.substring(5,7)+'月'+
                        modelData.Jhgzfidate.substring(8,10)+'日'+
                        modelData.Jhgzfitime.substring(0,2)+'时'+
                        modelData.Jhgzfitime.substring(3,5)+'分';
        var oTableBody = [
			[ {text:'序号',alignment:'center',style:'tableHeader'},
			  {text:'KKS编码',alignment:'center',style:'tableHeader'},
			  {text:'检修设备名称',alignment:'center',style:'tableHeader'}]
		];
		for(var i=0;i<modelData.KksTab.length;i++){
		    var line = [{text:modelData.KksTab[i].Seqc,alignment:'center'},{text:modelData.KksTab[i].Tplnr},{text:this.onGetKksText(modelData.KksTab[i].Tplnr)}];
		    oTableBody.push(line);
		}
        var docDefinition = {
            pageMargins: [ 40, 60, 40, 60 ],        //页面边距
            content: [
                {text: iwerkText+'\n'+ticketTypeText+"电除尘专用工作票附页\n ", style: 'header'},
                {text:[ '工作票编号：',{text: this.getUnderLineText(modelData.Wcmno, 28),style:'underLineText'}],style:'subheader'},
                {text:[ '工作票内容：',{text: this.getUnderLineText(modelData.SCont, 71),style:'underLineText'}],style:'subheader'},
                {text:[ '工作负责人：',{text: this.getUnderLineText(modelData.Name, 8),style:'underLineText'},
                        '开始时间：',{text: this.getUnderLineText(beginTime, 22),style:'underLineText'},
                        '结束时间：',{text: this.getUnderLineText(endTime, 22),style:'underLineText'}],style:'subheader'},
                {text:'\n \n 检修设备：'},
				{
				    style:'bodyTable',
				    table:{
				        headerRows: 0,
				        widths: ['10%','30%','60%'],
				        body: oTableBody
				    }
				},
				{text:'补充说明：' + modelData.Zbcsm}
        	],
			styles: {
        		header: {//大标题
        			fontSize: 18,
        			bold: false,
        			alignment: 'center',
        			color: 'black',
        			margin: [0, 10, 0, 10]      //表格里不生效
        		},
        		subheader: {//普通文本编号
        			fontSize: 12,
        			bold: false,
        			margin: [0, 0, 0, 10]
        		},
        		underLineText: {//下划线文本
        			fontSize: 12,
        			bold: false,
        // 			margin: [0, 3, 0, 5],
        			decoration: 'underline'
        		},
        		bodyTable: {//表格格式，主要是结束的margin
        		    fontSize: 12,
        			margin: [0, 0, 0, 15]
        		},
        		tableHeader: {//14号字的表格内容
        			bold: false,
        			fontSize: 14,
        			color: 'black'
        		}
        	},
            defaultStyle: {
                font: 'simfang'
            }
        };
        pdfMake.fonts = {
           simfang: {
             normal: 'simfang.ttf',
             bold: 'simfang.ttf',
             italics: 'simfang.ttf',
             bolditalics: 'simfang.ttf'
           }
        };
        // open the PDF in a new window
         pdfMake.createPdf(docDefinition).open();
        // print the PDF (not working in this version, will be added back in a couple of days)
        // pdfMake.createPdf(docDefinition).print();
        // download the PDF
        // window.pdfmake.createPdf(docDefinition).download();
    }
});