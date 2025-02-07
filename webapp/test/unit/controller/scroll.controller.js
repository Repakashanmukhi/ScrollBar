/*global QUnit*/

sap.ui.define([
	"scrollcontainer/controller/scroll.controller"
], function (Controller) {
	"use strict";

	QUnit.module("scroll Controller");

	QUnit.test("I should test the scroll controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
