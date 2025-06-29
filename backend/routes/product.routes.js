module.exports = app => {
    const products = require("../controller/product.controller");
    const verifyToken = require("../utility/commonFunctions");
  
    var router = require("express").Router();
  
    router.get("/", verifyToken, products.fetchAll);
    router.post("/create", verifyToken, products.create);
    router.post("/checkoutProducts", products.checkoutProducts);
    router.post("/verifyCheckout", products.verifyCheckout);


    app.use("/api/product", router);
};