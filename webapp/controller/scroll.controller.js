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
        },
        onUpload: function()
        {
            if (!that.upload) 
                {
                    that.upload = sap.ui.xmlfragment("scrollcontainer.fragments.upload", that);
                    that.getView().addDependent(that.upload);
                }
                that.upload.open();
        }, 
        onFileChange: function (oEvent) {
            var oModel = new JSONModel();
            var oTable = this.getView().byId("excelData");
            var excelData = {};
            var file = oEvent.getParameter("files")[0];
            oTable.removeAllColumns();
            oTable.removeAllItems();
            if (file && window.FileReader) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, {
                        type: 'array'
                    });
                    workbook.SheetNames.forEach(function (sheetName) {
                        excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    });
                    oModel.setData({ data: excelData });
                    oModel.refresh(true);
                    var inputArr = oModel.getData().data;
                    var objectKeys = Object.keys(inputArr[0]);
                    objectKeys.forEach(function (key) {
                        var oColumn = new sap.m.Column({
                            header: new sap.m.Label({
                                text: key
                            }),
                        });
                        oTable.addColumn(oColumn);
                    });
                    var tableModel = new JSONModel({ data: inputArr });
                    oTable.setModel(tableModel);
                    inputArr.forEach(function (row) {
                        var cells = [];
                        for (var i = 0; i < objectKeys.length; i++) {
                            var key = objectKeys[i];
                            var cellText = row[key];
                            cells.push(new sap.m.Text({
                                text: cellText
                            }));
                        }
                        var oColumnListItem = new sap.m.ColumnListItem({
                            cells: cells
                        });
                        oTable.addItem(oColumnListItem);
                    });
                };
                reader.readAsArrayBuffer(file);
            }
            that.close();
        },
        close: function(){
            that.upload.close();
        } 
    });
});



