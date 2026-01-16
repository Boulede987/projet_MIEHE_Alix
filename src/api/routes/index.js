module.exports = app => {  
  require("./pollution.routes")(app);
  require("./user.routes")(app);
}
