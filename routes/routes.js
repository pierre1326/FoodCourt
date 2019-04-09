//Functions
var users = require('../scripts/users');
var admins = require('../scripts/admins');

var fs = require('fs');
var multer  = require('multer');
var upload = multer({dest : 'images/'});

module.exports = function(app) {

  //Backend

  app.post("/createUser", function(req, res) {
    users.createUser(req, function(result) {
      res.send(result);
    });
  });

  app.post("/updateName", function(req, res) {
    users.updateName(req, function(result) {
      res.send(result);
    });
  });

  app.post("/loginUser", function(req, res) {
    users.loginUser(req, function(result) {
      res.send(result);
    });
  });

  app.post("/updatePhoto", upload.single('avatar'), async function(req, res) {
    try {
      console.log(req.file);
      var response = {status : "Received"};
      res.send(response);
    }
    catch(err) {
      var response = {status : "Error"};
      res.send(response);
    }
  });

  app.post("/requestCode", function(req, res) {
    users.requestCode(req, function(result) {
      res.send(result);
    });
  });

  app.post("/resetPassword", function(req, res) {
    users.resetPassword(req, function(result) {
      res.send(result);
    });
  });

  app.post("/createAdmin", function(req, res) {
    admins.createAdmin(req, function(result) {
      res.send(result);
    });
  });

  app.post("/loginAdmin", function(req, res) {
    admins.loginAdmin(req, function(result) {
      res.send(result);
    });
  });

  //Backoffice

  app.get("/", function(req, res) {
    res.render("index");
  });

  app.get("/create", function(req, res) {
    res.render("create");
  });

  app.get("/home", function(req, res) {
    res.render("home");
  });

}
