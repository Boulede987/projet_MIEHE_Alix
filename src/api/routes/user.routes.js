

module.exports = app => {
  const user = require("../controllers/user.controllers.js");
  const auth = require('../middlewares/auth.middleware');
  
  var router = require("express").Router();

  // User routes
  router.get("/", auth, user.get);          // GET all users
  router.get("/:id", auth, user.getById);   // GET user by ID
  router.post("/", user.post);        // CREATE new user
  router.put("/:id", auth, user.put);       // UPDATE user by ID
  router.delete("/:id", auth, user.delete); // DELETE user by ID
  router.post('/login', user.login);  // GIVE login info and get token

  // Prefix all routes with /api/user
  app.use("/api/user", router);
};
