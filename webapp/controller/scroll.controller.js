sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/ODataModel",  
    "sap/m/MessageBox",
    "sap/ui/table/Table"
], function (Controller, JSONModel, ODataModel, MessageBox,Table) {
    "use strict";
    var that;
    return Controller.extend("scrollcontainer.controller.scroll", {
        onInit: function () {
           that = this;
           var jQueryScript = document.createElement('script');
           jQueryScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.2/xlsx.full.min.js');
           document.head.appendChild(jQueryScript); 
        },
        onUpload: function () {
            if (!that.upload) {
                that.upload = sap.ui.xmlfragment("scrollcontainer.fragments.upload", that);
                that.getView().addDependent(that.upload);
            }      
            that.upload.open();
        },
        onFileChange: function (oEvent) {
            var oModel = new JSONModel();
            var oTable = this.getView().byId("Data");
            var excelData = {};
            var file = oEvent.getParameter("files")[0];
            oTable.removeAllColumns();
            oTable.setModel(); 
            if (file && window.FileReader) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: 'array' });
                    workbook.SheetNames.forEach(function (sheetName) {
                        excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    });
                    oModel.setData({ data: excelData });
                    oTable.setModel(oModel); 
                    var array = oModel.getData().data;
                    var objectKeys = Object.keys(array[0]);
                    // using sap.ui.table.Column
                    objectKeys.forEach(function (key) {
                        var oColumn = new sap.ui.table.Column({
                            label: new sap.m.Label({ text: key }),
                            template: new sap.m.Text({
                                text: "{" + key + "}" 
                            }),
                        });
                        oTable.addColumn(oColumn);
                    });
                    oTable.bindRows("/data"); 
                };
                //Using sap.m.Column(m.table)
                // objectKeys.forEach(function (key) {
                //     var oColumn = new sap.m.Column({
                //         header: new sap.m.Label({
                //             text: key
                //         }),
                //     });
                //     oTable.addColumn(oColumn); 
                // });
                // var tableModel = new JSONModel({ data: array });
                // oTable.setModel(tableModel);
                // array.forEach(function (row) {
                //     var cells = [];
                //     for (var i = 0; i < objectKeys.length; i++) {
                //         var key = objectKeys[i];
                //         var cellText = row[key];
                //         cells.push(new sap.m.Text({
                //             text: cellText
                //         }));
                //     }
                //     var oColumnListItem = new sap.m.ColumnListItem({
                //         cells: cells
                //     });
                //     oTable.addItem(oColumnListItem);
                // });
                reader.readAsArrayBuffer(file);  
            }
            that.close(); 
        },        
        close: function () {                      
            that.upload.close();
        },
        OnUrl: function () {
            if (!that.Url) {
                that.Url = sap.ui.xmlfragment("scrollcontainer.fragments.Url", that);
                that.getView().addDependent(that.Url); 
            }
            that.Url.open();
        },
        onSubmit: function () {
            var sUrl = sap.ui.getCore().byId("URL1").getValue();
            that.onFetchAndDisplayData(sUrl);
        },
        onFetchAndDisplayData: function (sUrl) {
            var oModel = new sap.ui.model.json.JSONModel();
            jQuery.ajax({
                url: sUrl,
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    oModel.setData(data);
                    var oTable = that.getView().byId("Data"); 
                    oTable.setModel(oModel);
                    var inputArr = data;
                    var objectKeys = Object.keys(inputArr[0]);
                    oTable.removeAllColumns();
                    oTable.removeAllRows();
                    // Using sap.ui.table.Column
                    objectKeys.forEach(function (key) {
                        var oColumn = new sap.ui.table.Column({
                            label: new sap.m.Label({
                                text: key
                            }),
                            template: new sap.m.Text({
                            text: "{" + key + "}" 
                            })
                        });
                        oTable.addColumn(oColumn);
                    });
                    oTable.bindRows("/"); 
                },
                // Using sap.m.Column(m.table)
                // objectKeys.forEach(function (key) 
                // {
                //     var oColumn = new sap.m.Column({
                //         header: new sap.m.Label({
                //                 text: key
                //             })
                //         });     
                //         oTable.addColumn(oColumn);
                //     });
                //     inputArr.forEach(function (row) {
                //         var cells = [];
                //         objectKeys.forEach(function (key) {
                //             var cellText = row[key];  
                //             cells.push(new sap.m.Text({
                //                 text: cellText
                //             }));
                //         });
                //         var oColumnListItem = new sap.m.ColumnListItem({
                //             cells: cells
                //         });
                //         oTable.addItem(oColumnListItem);
                //     });
            });
            that.Close();
        },
        Close: function () {
            that.Url.close();
        },
        Exit:function(oEvent){
            sap.m.MessageToast.show("Exit from page");        
        }
    });
});
