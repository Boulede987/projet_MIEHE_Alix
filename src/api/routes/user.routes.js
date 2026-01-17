

module.exports = app => {
  const user = require("../controllers/user.controllers.js");
  const auth = require('../middlewares/auth.middleware');
  
  var router = require("express").Router();

  router.get("/", auth, user.get);
  router.get("/:id", auth, user.getById);
  router.post("/", user.post);
  router.put("/:id", auth, user.put);
  router.delete("/:id", auth, user.delete);
  router.post('/login', user.login);

  app.use("/api/user", router);
};
