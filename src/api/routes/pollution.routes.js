

module.exports = app => {
  const pollution = require("../controllers/pollution.controllers.js");
  const auth = require('../middlewares/auth.middleware');

  var router = require("express").Router();


  // nos routes / urls
  router.get("/", pollution.get);
  router.get("/:id", pollution.getById);
  router.post("/", auth, pollution.post);
  router.put("/:id", auth, pollution.put);
  router.delete("/:id", auth, pollution.delete);

  app.use('/api/pollution', router);
};


  