/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("com.zhenergy.bill.util.SearchKKS");

com.zhenergy.bill.util.SearchKKS = (function() {
	var _oXmlView = null;
	
	return {
		open: function(fnStartSearch, fnCloseDlg, iNumberOfItems) {
			if (!_oXmlView) {
				_oXmlView = new sap.ui.view({
					id: 		"MIB_VIEW_FORWARD",
					viewName: 	"com.zhenergy.bill.view.SearchKKS.Forward",
					type:		sap.ui.core.mvc.ViewType.XML
				});
			}
			
			var oModel = new sap.ui.model.json.JSONModel({startSearch: fnStartSearch,
														  closeDlg: fnCloseDlg,
														  numberOfItems: iNumberOfItems});
			var oDialog = _oXmlView.byId("DLG_FORWARD");
			oDialog.setModel(oModel);
			_oXmlView.byId("LST_AGENTS").removeSelections(true);
			oDialog.open();
		},
		
		setAgents: function(aAgents) {
			var oDialog = _oXmlView.byId("DLG_FORWARD");
			oDialog.getModel().setProperty("/agents", aAgents);
			if (aAgents.length > 0) {
				oDialog.getModel().setProperty("/isPreloadedAgents", true);
			} else {
				oDialog.getModel().setProperty("/isPreloadedAgents", false);
			}
			
			oDialog.rerender();
		},
		
		setOrigin: function(sOrigin) {
			var oDialog = _oXmlView.byId("DLG_FORWARD");
			oDialog.getModel().setProperty("/origin", sOrigin);
		}		
	};
}());