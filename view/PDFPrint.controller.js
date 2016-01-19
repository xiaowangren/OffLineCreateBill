sap.ui.controller("com.zhenergy.bill.view.PDFPrint", {

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
        var textLength = this.getByteLen(text);
        for( var i=0;i<length-textLength;i++){
            text = text + " ";
        }
        return text;
    },
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
// SCC	电除尘专用典型工作票
// SD1	电气第一种典型工作票
// SD2	电气第二种典型工作票
// SJB	继电保护典型工作票
// SRJ	热力机械典型工作票
// SRK	热控典型工作票

    onPrintGzp_DCC:function(modelData){
        if(modelData == undefined){
            modelData = this.getView().getModel("BillCreateInfoPage").getData();
        }
        var payLoad = modelData;
        //console.log(payLoad);
        var dianQiGongChang = this.onGetIwerkText(payLoad.Iwerk);
        if(!(dianQiGongChang == undefined)){
            console.log(dianQiGongChang);
            dianQiGongChang = dianQiGongChang.replace(/物资工厂/, '');
        }
        var dianQiLeiXing = this.onGetTicketTypeText(payLoad.Ztype);
        var dianQiCaoZuoPiaoHao = payLoad.Zczph;
        if(payLoad.Otype=='1'){
            var caoZuoLeiXing ="单人操作";
        }else if(payLoad.Otype=='2'){
            var caoZuoLeiXing ="监护操作";
        }
        var Ztasktmp=payLoad.Ztask.replace(/\n/g,'');       //操作任务
        var taskLen = this.getByteLen(Ztasktmp);
        if(taskLen <= 62){
            Ztasktmp = Ztasktmp +"\n \n ";
        }else if(taskLen <= 134){
            Ztasktmp = Ztasktmp + "\n ";
        }
        //操作票内容
        var InfoTab = payLoad.InfoTab;
        var tableDataNew =[];
        for(var i=0;i<InfoTab.length;i++){
            InfoTab[i].Zxh = ""+InfoTab[i].Zxh;
            if((InfoTab[i].Zzysx.trim()=="")&&(InfoTab[i].Zxh.trim()=="")&&(InfoTab[i].Zcznr.trim()=="")){
            }else{
                tableDataNew.push(InfoTab[i]); 
            }
        }
        
        var oBody = [
        	[{ text: '√', style: 'tableHeader', alignment: 'center' },
			    { text: '序号', style: 'tableHeader', alignment: 'center' }, 
			    { text: '操作内容', style: 'tableHeader', alignment: 'center' },
			    { text: '注意事项', style: 'tableHeader', alignment: 'center' }
			]
	   ];
	   for(var i=0;i<tableDataNew.length;i++){
	       var l_seq = tableDataNew[i].Zxh.replace(/^0+/,'');            //操作票序号 去除前导零
	        var Zcznr = tableDataNew[i].Zcznr;
            var Zcznrtmp=Zcznr.replace(/\n/g,'');       //操作内容
            var Zzysx = tableDataNew[i].Zzysx;
            var Zzysxtmp=Zzysx.replace(/\n/g,'');       //注意事项
  		    var line = ['', {text:l_seq, alignment:'center'}, Zcznrtmp,Zzysxtmp];
		    oBody.push(line);
	   }
        var tableEnd = [{text:'备注:\n \n \n ',colSpan: 4},{},{},{}];
        oBody.push(tableEnd);
        
        //Document内容，主表在上方已经组装
        var docDefinition = {
            header: function(currentPage, pageCount) {
                // you can apply any logic and return any valid pdfmake element
                var Header = [{ text: dianQiGongChang+'\n'+dianQiLeiXing, style: 'header',alignment: 'center' }];
                
                if( currentPage == 1 ){
                    var line1 = {text:'  ',style:'subheader'};
                    Header.push(line1);
                }else{
                    var line1 = {text:'上接：'+dianQiCaoZuoPiaoHao+'-'+(currentPage-1),style:'subheader'};
                    Header.push(line1);
                }
                var line2 = {text:'编号：'+dianQiCaoZuoPiaoHao+'-'+currentPage,style:'subheader',alignment:'right'};
                Header.push(line2);
                // console.log(Header);
                var headTableBody = [];
                if(pageCount == 1){
                    var headTableLine1 = [{ text: '操作开始时间：     年     月     日     时     分\n操作结束时间：     年     月     日     时     分', style: 'tableHeader', alignment: 'left' }];
                    headTableBody.push(headTableLine1);
                }else if(currentPage == 1 && pageCount>1){
                    var headTableLine1 = [{ text: '操作开始时间：     年     月     日     时     分\n ', style: 'tableHeader', alignment: 'left' }];
                    headTableBody.push(headTableLine1);
                }else if(currentPage == pageCount && pageCount>1){
                    var headTableLine1 = [{ text: '操作结束时间：     年     月     日     时     分\n ', style: 'tableHeader', alignment: 'left' }];
                    headTableBody.push(headTableLine1);
                }else{
                    var headTableLine1 = [{ text: '  \n  ', style: 'tableHeader', alignment: 'left' }];
                    headTableBody.push(headTableLine1);
                }
                var headTableLine2 = [{ text: '操作任务：'+Ztasktmp, style: 'taskHeader',  alignment: 'left' }];
                headTableBody.push(headTableLine2);
                var table =  [               {
                    style: 'headTable',
					color: '#444',
					table: { 
					    	widths: ['100%'],
					    	body:headTableBody
					}
                }];
                Header.push(table);
                return Header;
                // return { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' };
              },
            footer: function(currentPage, pageCount) { 
                  if(currentPage < pageCount){
                      var footer = {text:'下接:'+dianQiCaoZuoPiaoHao+'-'+(currentPage+1),style:'subheader',alignment:'right'};
                  }
                  return footer; 
                 
            },
            pageMargins: [ 40, 187, 40, 60 ],        //页面边距，对Header不起作用
            content: [
                {
                    style: 'bodyTable',
					color: '#444',
					table: { 
					    	widths: ['16.67%','16.67%','16.67%','16.67%','16.67%','16.67%'],
					    	body:[  //发令人和操作类型两行，固定行
                                [{ text: '发令人\n  \n  ', style: 'tableHeader', alignment: 'left' },'',{text:'受令人'},'',{text:'发令时间'},{text:'________年\n___月___日\n___时___分',alignment:'right'}],
                                [{ text: '操作类型\n  \n  ', style: 'tableHeader', colSpan:3, alignment: 'left' },{},{},
                                 { text: caoZuoLeiXing, style: 'tableHeader',  colSpan:3, alignment: 'left' },{},{}
                                ]
                    		]
					}
                },
				{
					style: 'bodyTable',
					color: '#444',
					table: {
							widths: [20,25, 320, '*'],
							headerRows: 1,
							keepWithHeaderRows: 1,
							//dontBreakRows: true,
							body: oBody                     //动态组装主表内容
					}
				},
				{text:"操作人：          监护人：            值班负责人：            值长：(根据需要) "}
			],
			styles: {
        		header: {
        			fontSize: 18,
        			bold: false,
        			alignment: 'center',
        			color: 'black',
        			margin: [0, 40, 0, 10]
        		},
        		subheader: {
        			fontSize: 12,
        			bold: false,
        			margin: [40, 0, 40, 0]
        		},
        		headTable: {
        		    fontSize: 12,
        			margin: [40, 0,40, 0]
        		},
        		bodyTable: {
        		    fontSize: 12,
        			margin: [0, 0, 0, 0]
        		},
        		tableHeader: {
        			bold: false,
        			fontSize: 12,
        			color: 'black'
        		},
        		taskHeader: {
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
         window.pdfMake.createPdf(docDefinition).open();
        // print the PDF (not working in this version, will be added back in a couple of days)
        // pdfMake.createPdf(docDefinition).print();
        // download the PDF
        // window.pdfmake.createPdf(docDefinition).download();
    }
});