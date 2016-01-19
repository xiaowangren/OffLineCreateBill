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
    onGetIwerkText:function(Iwerk){
        var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
        var werks = oStorage.get("ZPMOFFLINE_SRV.WERKS");
        for(var i=0;i<werks.length;i++){
            if(werks[i].Iwerk == Iwerk){
                return werks[i].Name1;
            }
        }
    },
    onGetTicketTypeText:function(Ztype){
        var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
        var oTickets = oStorage.get("ZPMOFFLINE_SRV.TicketType");
        for(var i=0;i<oTickets.length;i++){
            if(oTickets[i].Ztype == Ztype){
                return oTickets[i].Ztypedes;
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
        var docDefinition = {
            pageMargins: [ 40, 60, 40, 60 ],        //页面边距，对Header不起作用
            content: [
                {
					table: {
							widths: ['20%','60%','20%'],
							body: [
        							[ '', {text: "浙江浙能兰溪发电有限公司"+'\n'+"电除尘检修专用工作票\n ", style: 'header'},
        							    [
        							        {
                            					table: {
                            							body: [[{text:'盖 “已执行” 章',style:'smallText'}]]
                            					}
            							    },
            							    '\n',
            							    {
                            					table: {
                            							body: [[{text:'盖“全部结束”章',style:'smallText'}]]
                            					}
            							    }
        							    ]
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
							body: [
									[ '1.',{text:[ '工作单位：',{text: this.getUnderLineText("设备管理部", 28),style:'underLineText'}]}, {text:[ '帮组：',{text: this.getUnderLineText("集控运行", 34),style:'underLineText'}]} ],
									[ '', {text:[ '工作负责人：',{text: this.getUnderLineText("楼伟伟", 26),style:'underLineText'}]},{text:[ '联系方式：',{text: this.getUnderLineText("1234567890", 30),style:'underLineText'}]} ],
									[ '', {text:['工作班组成员（不包含工作负责人）',{text:this.getUnderLineText("A", 116),style:'underLineText'},
									        '等共',{text:this.getUnderLineText("2", 2),style:'underLineText'},'人，附页',{text:this.getUnderLineText("0", 2),style:'underLineText'},'张'],colSpan:2}, {} ],
									[ '2.', {text:[ '工作地点：',{text: this.getUnderLineText("ASDFASD", 73),style:'underLineText'}],colSpan:2}, {}],
									[ '', {text:[ '工作内容：',{text: this.getUnderLineText("ASDFASD", 73),style:'underLineText'}],colSpan:2}, {}],
									[ '3.', {text:[ '工作计划开始时间：',
									        {text: this.getUnderLineText("2015", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("12", 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText("03", 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText("08", 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText("05", 2),style:'underLineText'},'分'],colSpan:2}, {}],
									[ '', {text:[ '工作计划完成时间：',
									        {text: this.getUnderLineText("2015", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("12", 2),style:'underLineText'},'月',
        									{text: this.getUnderLineText("03", 2),style:'underLineText'},'日',
        									{text: this.getUnderLineText("11", 2),style:'underLineText'},'时',
        									{text: this.getUnderLineText("00", 2),style:'underLineText'},'分'],colSpan:2}, {}],
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
							body: [
									[ '一',{text:'必须采取的安全措施',style:'tableHeader',alignment:'center'}, {text: '安措执行情况',style:'tableHeader', alignment:'center'}],
									[ '1', {text:'asdfasdfasdf'},{text:'asdfasdfasdfasdf'} ],
									[ '二',{text:'应装接地线，应合接地闸刀（注明确实地点和名称）',style:'tableHeader',alignment:'center'}, {text: '安措执行情况\n（注明确实地点、名称及接地线编号）',style:'tableHeader', alignment:'center'}],
									[ '1', {text:'asdfasdfasdf'},{text:'asdfasdfasdfasdf'} ]
							]
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
									[ '1', {text:'asdfasdfasdf'},{text:'asdfasdfasdfasdf'} ]
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
							body: [
									[ '一',{text:'必须采取的安全措施',style:'tableHeader',alignment:'center'}, {text: '安措执行情况',style:'tableHeader', alignment:'center'}],
									[ '1', {text:'asdfasdfasdf'},{text:'asdfasdfasdfasdf'} ],
									[ '二',{text:'应装接地线，应合接地闸刀（注明确实地点和名称）',style:'tableHeader',alignment:'center'}, {text: '安措执行情况\n（注明确实地点、名称及接地线编号）',style:'tableHeader', alignment:'center'}],
									[ '1', {text:'asdfasdfasdf'},{text:'asdfasdfasdfasdf'} ]
							]
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
									[ '1', {text:'asdfasdfasdf'},{text:'asdfasdfasdfasdf'} ]
							]
					}
				},
				{
				    // style: 'bodyTable',
					table: {
							widths: ['2%','48%','50%'],
							body: [
        							[ '8.', {text:[ '工作票签发人：',{text: this.getUnderLineText("", 24),style:'underLineText'}]}, {text:[ '签发时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}],
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
        							[ '9.', {text:[ '值长：',{text: this.getUnderLineText("", 32),style:'underLineText'}]}, {text:[ '签字时间：',
									        {text: this.getUnderLineText("", 4),style:'underLineText'},'年',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'月',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'日',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'时',
        									{text: this.getUnderLineText("", 4),style:'underLineText'},'分']}]
							]
					},
					layout: 'noBorders'
				}
			],
			styles: {
        		header: {
        			fontSize: 18,
        			bold: false,
        			alignment: 'center',
        			color: 'black'
        // 			margin: [0, 10, 0, 15]
        		},
        		subheader: {
        			fontSize: 12,
        			bold: false,
        			margin: [40, 0, 10, 10]
        		},
        		bodyTable: {
        		    fontSize: 12,
        			margin: [0, 0, 0, 10]
        		},
        		tableHeader: {
        			bold: false,
        			fontSize: 14,
        			color: 'black'
        		},
        		smallText: {
        			bold: false,
        			fontSize: 10,
        			color: 'black'
        		},
        		underLineText: {
        			fontSize: 12,
        			bold: false,
        			margin: [0, 3, 0, 5],
        			decoration: 'underline'
        // 			width:'100px'
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
    onPrintPdfmake:function(){
       // playground requires you to assign document definition to a variable called dd

        var docDefinition = {
        	content: [
        				{ text: 'Tables', style: 'header' },
        				'Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine.',
        				{ text: 'A simple table (no headers, no width specified, no spans, no styling)', style: 'subheader' },
        				'The following table has nothing more than a body array',
        				{
        						style: 'tableExample',
        						table: {
        								body: [
        										['Column 1', 'Column 2', 'Column 3'],
        										['One value goes here', 'Another one here', 'OK?']
        								]
        						}
        				},
        				{ text: 'A simple table with nested elements', style: 'subheader' },
        				'It is of course possible to nest any other type of nodes available in pdfmake inside table cells',
        				{
        						style: 'tableExample',
        						table: {
        								body: [
        										['Column 1', 'Column 2', 'Column 3'],
        										[
        												{
        														stack: [
        																'Let\'s try an unordered list',
        																{
        																		ul: [
        																				'item 1',
        																				'item 2'
        																		]
        																}
        														]
        												},
        												[
        													'or a nested table',
        													{
        														table: {
        															body: [
        																[ 'Col1', 'Col2', 'Col3'],
        																[ '1', '2', '3'],
        																[ '1', '2', '3']
        															]
        														},
        													}
        												],
        												{ text: [
        														'Inlines can be ',
        														{ text: 'styled\n', italics: true },
        														{ text: 'easily as everywhere else', fontSize: 10 } ]
        												}
        										]
        								]
        						}
        				},
        				{ text: 'Defining column widths', style: 'subheader' },
        				'Tables support the same width definitions as standard columns:',
        				{
        						bold: true,
        						ul: [
        								'auto',
        								'star',
        								'fixed value'
        						]
        				},
        				{
        						style: 'tableExample',
        						table: {
        								widths: [100, '*', 200, '*'],
        								body: [
        										[ 'width=100', 'star-sized', 'width=200', 'star-sized'],
        										[ 'fixed-width cells have exactly the specified width', { text: 'nothing interesting here', italics: true, color: 'gray' }, { text: 'nothing interesting here', italics: true, color: 'gray' }, { text: 'nothing interesting here', italics: true, color: 'gray' }]
        								]
        						}
        				},
        				{ text: 'Headers', style: 'subheader' },
        				'You can declare how many rows should be treated as a header. Headers are automatically repeated on the following pages',
        				{ text: [ 'It is also possible to set keepWithHeaderRows to make sure there will be no page-break between the header and these rows. Take a look at the document-definition and play with it. If you set it to one, the following table will automatically start on the next page, since there\'s not enough space for the first row to be rendered here' ], color: 'gray', italics: true },
        				{
        						style: 'tableExample',
        						table: {
        								headerRows: 1,
        								// keepWithHeaderRows: 1,
        								// dontBreakRows: true,
        								body: [
        										[{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
        										[
        												'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        										]
        								]
        						}
        				},
        				{ text: 'Column/row spans', style: 'subheader' },
        				'Each cell-element can set a rowSpan or colSpan',
        				{
        						style: 'tableExample',
        						color: '#444',
        						table: {
        								widths: [ 200, 'auto', 'auto' ],
        								headerRows: 2,
        								// keepWithHeaderRows: 1,
        								body: [
        										[{ text: 'Header with Colspan = 2', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}, { text: 'Header 3', style: 'tableHeader', alignment: 'center' }],
        										[{ text: 'Header 1', style: 'tableHeader', alignment: 'center' }, { text: 'Header 2', style: 'tableHeader', alignment: 'center' }, { text: 'Header 3', style: 'tableHeader', alignment: 'center' }],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        										[ { rowSpan: 3, text: 'rowSpan set to 3\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor' }, 'Sample value 2', 'Sample value 3' ],
        										[ '', 'Sample value 2', 'Sample value 3' ],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        										[ 'Sample value 1', { colSpan: 2, rowSpan: 2, text: 'Both:\nrowSpan and colSpan\ncan be defined at the same time' }, '' ],
        										[ 'Sample value 1', '', '' ],
        								]
        						}
        				},
        				{ text: 'Styling tables', style: 'subheader' },
        				'You can provide a custom styler for the table. Currently it supports:',
        				{
        						ul: [
        								'line widths',
        								'line colors',
        								'cell paddings',
        						]
        				},
        				'with more options coming soon...\n\npdfmake currently has a few predefined styles (see them on the next page)',
        				{ text: 'noBorders:', fontSize: 14, bold: true, pageBreak: 'before', margin: [0, 0, 0, 8] },
        				{
        						style: 'tableExample',
        						table: {
        								headerRows: 1,
        								body: [
        										[{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader'}, { text: 'Header 3', style: 'tableHeader' }],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        								]
        						},
        						layout: 'noBorders'
        				},
        				{ text: 'headerLineOnly:', fontSize: 14, bold: true, margin: [0, 20, 0, 8] },
        				{
        						style: 'tableExample',
        						table: {
        								headerRows: 1,
        								body: [
        										[{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader'}, { text: 'Header 3', style: 'tableHeader' }],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        								]
        						},
        						layout: 'headerLineOnly'
        				},
        				{ text: 'lightHorizontalLines:', fontSize: 14, bold: true, margin: [0, 20, 0, 8] },
        				{
        						style: 'tableExample',
        						table: {
        								headerRows: 1,
        								body: [
        										[{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader'}, { text: 'Header 3', style: 'tableHeader' }],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        								]
        						},
        						layout: 'lightHorizontalLines'
        				},
        								{ text: 'but you can provide a custom styler as well', margin: [0, 20, 0, 8] },
        								{
        						style: 'tableExample',
        						table: {
        								headerRows: 1,
        								body: [
        										[{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader'}, { text: 'Header 3', style: 'tableHeader' }],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        										[ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
        								]
        						},
        						layout: {
        														hLineWidth: function(i, node) {
        																return (i === 0 || i === node.table.body.length) ? 2 : 1;
        														},
        														vLineWidth: function(i, node) {
        																return (i === 0 || i === node.table.widths.length) ? 2 : 1;
        														},
        														hLineColor: function(i, node) {
        																return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
        														},
        														vLineColor: function(i, node) {
        																return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
        														},
        														// paddingLeft: function(i, node) { return 4; },
        														// paddingRight: function(i, node) { return 4; },
        														// paddingTop: function(i, node) { return 2; },
        														// paddingBottom: function(i, node) { return 2; }
        						}
        				}
        	],
        	styles: {
        		header: {
        			fontSize: 18,
        			bold: true,
        			margin: [0, 0, 0, 10]
        		},
        		subheader: {
        			fontSize: 16,
        			bold: true,
        			margin: [0, 10, 0, 5]
        		},
        		tableExample: {
        			margin: [0, 5, 0, 15]
        		},
        		tableHeader: {
        			bold: true,
        			fontSize: 13,
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
    }
});