module.exports = {

  createAdmin : function(req, models, callback) {
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

  loginAdmin : function(req, models, callback) {
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
  }

}
