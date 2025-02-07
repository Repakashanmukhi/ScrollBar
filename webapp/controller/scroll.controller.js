sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("scrollcontainer.controller.scroll", {
        onInit() {
            var oModel= this.getOwnerComponent().getModel("sampleJSONModel")
            this.getView().setModel(oModel)
        }
    });
});