module.exports = app => {
    const users = require("../controller/user.controller");
  
    var router = require("express").Router();
  
    router.get("/", users.fetchAll);
    router.post("/register", users.create);
    router.post("/login", users.validateUser);
    router.post("/validateToken", users.vaidateToken);

    app.use("/api/user", router);
};