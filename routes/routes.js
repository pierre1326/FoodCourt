//Functions
var users = require('../scripts/users');
var admins = require('../scripts/admins');
var foods = require('../scripts/foods');
var restaurants = require('../scripts/restaurants');

//Upload files
var multer  = require('multer');
var upload = multer({dest : 'images/'});

//Clean files
var cleaner = require('../scripts/cleaner').startCleaner();

module.exports = function(app) {

  //Foods Module

  app.post("/getFoods", function(req, res) {
    foods.getFoods(req, function(result) {
      res.send(result);
    });
  });

  //User Module

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
    users.updatePhoto(req, function(result) {
      res.send(result);
    });
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

  //Admin module

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

  //Restaurants module

  app.post("/createRestaurant", function(req, res) {
    restaurants.createRestaurant(req, function(result) {
      res.send(result);
    });
  });

  app.post("/updateRestaurant", function(req, res) {
    restaurants.updateRestaurant(req, function(result) {
      res.send(result);
    });
  });

  app.post("/createOpinion", function(req, res) {
    restaurants.createOpinion(req, function(result) {
      res.send(result);
    });
  });

  app.post("/getOpinions", function(req, res) {
    restaurants.getOpinions(req, function(result) {
      res.send(result);
    });
  });

  app.post("/addPhoto",  upload.array('photos', 5), function(req, res) {
    restaurants.addPhoto(req, function(result) {
      res.send(result);
    });
  });

  app.post("/getPhotos", function(req, res) {
    restaurants.getPhotos(req, function(result) {
      res.send(result);
    });
  });

  app.post("/getRestaurants", function(req, res) {
    restaurants.getRestaurants(req, function(result) {
      res.send(result);
    })
  })

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
