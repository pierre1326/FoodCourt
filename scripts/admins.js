module.exports = {

  createAdmin : function(req, callback) {
    if(req.body.user == undefined || req.body.user.length == 0 || req.body.password == undefined || req.body.password.length == 0) {
      var error = {error : "Data incompleted"};
      callback(error);
    }
    else {
      var query = {user : req.body.user};
      var admins = models['Admins'];
      admins.findOne(query, function(err, result) {
        if(err) {
          var error = {error : "Error with database"};
          callback(error);
        }
        if(result != null) {
          var status = {status : "Admin is already exists"};
          callback(status);
        }
        else {
          var admin = new admins({
            user : req.body.user,
            password : req.body.password
          });
          admin.save(function(err, resp) {
            if(err) {
              var error = {error : "Error with database"};
              callback(error);
            }
            else {
              var status = {status : "Admin created"};
              callback(status);
            }
          });
        }
      });
    }
  },

  loginAdmin : function(req, callback) {
    if(req.body.user == undefined || req.body.user.length == 0 || req.body.password == undefined || req.body.password.length == 0) {
      var error = {error : "Data incompleted", code : -1};
      callback(error);
    }
    else {
      var query = {user : req.body.user};
      var admins = models['Admins'];
      admins.findOne(query, function(err, result) {
        if(err) {
          var error = {error : "Error with database", code : -1};
          callback(error);
        }
        else if(result == null) {
          var status = {status : "Username does not exist", code : 0};
          callback(status);
        }
        else if(result['password'] == req.body.password) {
          var status = {status : "Session started", code : 1};
          callback(status);
        }
        else {
          var status = {status : "Password failed", code : 2};
          callback(status);
        }
      });
    }
  },

  logout : function(req, callback) {
    req.session.destroy(function(err) {
      if(err) {
        var status = {status : "Error with session"};
        callback(status);
      }
      else {
        var status = {status : "Done"};
        callback(status);
      }
    });
  },

  changeRestaurant : function(req, callback) {
    if(req.body.id == undefined || req.body.id.length == 0) {
      var status = {status : "Restaurant ID is necessary"};
      callback(status);
    }
    else {
      var restaurants = models['Restaurants'];
      var query = { "_id" : req.body.id };
      var values = {};
      if(req.body.name != undefined && req.body.name.length > 0) values['name'] = req.body.name;
      if(req.body.number != undefined) values['number'] = req.body.number;
      if(req.body.webPage != undefined) values['webPage'] = req.body.webPage;
      if(util.checkArray(req.body.foods, "string")) values['foods'] = req.body.foods;
      if(util.checkSchedules(req.body.schedules)) values['schedules'] = req.body.schedules;
      restaurants.updateOne(query, {$set : values}, function(err, restaurant) {
        if(err) {
          var status = {status : "Error with database"};
          callback(status);
        }
        else {
          var status = {status : "Restaurant's updated", token : token};
          callback(status);
        }
      });
    }
  }

}
