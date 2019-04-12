module.exports = {

  getFoods : function(req, callback) {
    if(req.body.token == undefined || req.body.token.length == 0 || req.body.email == undefined || req.body.email.length == 0) {
      var error = {error : "Token and email is necessary"};
      callback(error);
    }
    else {
      managerToken.checkToken(req.body.email, false, req.body.token, function(token) {
        if(token == null) {
          var error = {error : "It is not possible to generate the token"};
          callback(error);
        }
        else if(token == -1) {
          var status = {status : "Invalid token"};
          callback(status);
        }
        else {
          var foods = models['Foods'];
          foods.find({}).exec(function(err, values) {
            if(err) {
              var error = {error : "Error with database"};
              callback(error);
            }
            else {
              var array = [];
              for(i in values) {
                var x = values[i];
                array[i] = x['type'];
              }
              var status = {token : token, foods : array};
              callback(status);
            }
          });
        }
      });
    }
  }

}
