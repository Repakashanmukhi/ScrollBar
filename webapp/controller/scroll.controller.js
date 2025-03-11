sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem"
], function (Controller, JSONModel, FlattenedDataset, FeedItem) {
    "use strict";
    var that;
    return Controller.extend("scrollcontainer.controller.scroll", {
        onInit: function () {
            that=this;
            var oModel = this.getOwnerComponent().getModel("sampleJSONModel")
            this.getView().setModel(oModel);
            this._initializeChart();
        },
        _initializeChart: function () {
            var oVizFrame = this.byId("idVizFrame");
            var oModel = this.getView().getModel("sampleJSONModel");
            var oDataset = new FlattenedDataset({
                dimensions: [{
                    name: 'Product ID',
                    value: "{sampleJSONModel>PRODUCT_ID}"
                }],
                measures: [{
                    name: 'Quantity Units',
                    value: "{sampleJSONModel>QTY_UNITS}"
                }],
                data: {
                    path: "sampleJSONModel>/sampleCollection"
                }
            });
            oVizFrame.setDataset(oDataset);
            var oFeedCategory = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "categoryAxis",
                'type': "Dimension",
                'values': ["Product ID"]
            });
            var oFeedValue = new sap.viz.ui5.controls.common.feeds.FeedItem({
                'uid': "valueAxis",
                'type': "Measure",
                'values': ["Quantity Units"]
            });
            oVizFrame.addFeed(oFeedCategory);
            oVizFrame.addFeed(oFeedValue);
            oVizFrame.setVizType("stacked_column");
        },
        onUpload: function(){
            if (!that.upload) 
                {
                    that.upload = sap.ui.xmlfragment("scrollcontainer.fragments.upload", that);
                    that.getView().addDependent(that.upload);
                }
                that.upload.open();
        }
    });
});

