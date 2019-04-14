var util = require('./util.js');
var fs = require('fs');

module.exports = {

  createRestaurant : function(req, callback) {
    if(req.body.token == undefined || req.body.token.length == 0 || req.body.email == undefined || req.body.email.length == 0) {
      var error = {error : "Token and emails is necessary"};
      callback(error);
    }
    else if(req.body.name == undefined || req.body.name.length == 0) {
      var error = {error : "Restaurant name is necessary"};
      callback(error);
    }
    else if(req.body.address == undefined || typeof req.body.address.lat != "number" || typeof req.body.address.long != "number" || typeof req.body.address.direction != "string") {
      var error = {error : "Direction is necessary"};
      callback(error);
    }
    else {
      managerToken.checkToken(req.body.email, null, req.body.token, function(token) {
        if(token == null) {
          var error = {error : "It is not possible to generate the token"};
          callback(error);
        }
        else if(token == -1) {
          var status = {status : "Invalid token"};
          callback(status);
        }
        else if(req.body.foods != undefined && !util.checkArray(req.body.foods, "string")) {
          var error = {error : "Format in foods is not valid"};
          callback(error);
        }
        else if(req.body.schedules != undefined && !util.checkSchedules(req.body.schedules)) {
          var error = {error : "Format in schedules is not valid"};
          callback(error);
        }
        else {
          var restaurants = models['Restaurants'];
          var restaurant = new restaurants({
            name : req.body.name,
            calification : 0,
            price : 0,
            number : (typeof req.body.number != "number") ? null : req.body.number,
            webPage : (typeof req.body.webPage != 'string') ? null : req.body.webPage,
            foods : (req.body.foods != undefined) ? req.body.foods : null,
            opinions : [],
            address : req.body.address,
            schedules : (req.body.schedules != undefined) ? req.body.schedules : null,
            photos : []
          });
          restaurant.save(function(err, resp) {
            if(err) {
              var error = {error : "Error with database"};
              callback(error);
            }
            else {
              var status = {token : token, status : "Restaurant added"};
              callback(status);
            }
          });
        }
      });
    }
  },

  updateRestaurant : function(req, callback) {
    if(req.body.token == undefined || req.body.token.length == 0 || req.body.email == undefined || req.body.email.length == 0) {
      var error = {error : "Token and emails is necessary"};
      callback(error);
    }
    else if(req.body.id == undefined) {
      var error = {error : "Restaurant ID is necessary"};
      callback(error);
    }
    else {
      managerToken.checkToken(req.body.email, null, req.body.token, function(token) {
        if(token == null) {
          var error = {error : "It is not possible to generate the token"};
          callback(error);
        }
        else if(token == -1) {
          var status = {status : "Invalid token"};
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
              var error = {error : "Error with database"};
              callback(error);
            }
            else {
              var status = {status : "Restaurant's updated", token : token};
              callback(status);
            }
          });
        }
      });
    }
  },

  createOpinion : function(req, callback) {
    if(req.body.token == undefined || req.body.token.length == 0 || req.body.email == undefined || req.body.email.length == 0) {
      var error = {error : "Token and emails is necessary"};
      callback(error);
    }
    else if(req.body.id == undefined || req.body.id.length == 0) {
      var error = {error : "Restaurant ID is necessary"};
      callback(error);
    }
    else if(req.body.opinion == undefined) {
      var error = {error : "Opinion is necessary"};
      callback(error);
    }
    else {
      managerToken.checkToken(req.body.email, null, req.body.token, function(token) {
        if(token == null) {
          var error = {error : "It is not possible to generate the token"};
          callback(error);
        }
        else if(token == -1) {
          var status = {status : "Invalid token"};
          callback(status);
        }
        else {
          if(util.checkOpinion(req.body.opinion)) {
            var opinions = models['Opinions'];
            var opinion = new opinions({
              calification : req.body.opinion.calification,
              price : req.body.opinion.price,
              date : req.body.opinion.date,
              comment : (req.body.opinion.comment != undefined) ? req.body.opinion.comment : null,
              user : req.body.email
            });
            opinion.save(function(error, response) {
              if(error) {
                var error = {error : "Error with database"};
                callback(error);
              }
              else {
                var restaurants = models['Restaurants'];
                var values = {opinions : response["_id"]};
                restaurants.updateOne({"_id" : req.body.id}, {$push : values}, function(exc, restaurant) {
                  if(exc) {
                    var error = {error : "Error with database"};
                    callback(error);
                  }
                  else {
                    util.updateRestaurant(req.body.id, function(status) {
                      status['token'] = token;
                      callback(status);
                    });
                  }
                });
              }
            });
          }
          else {
            var error = {error : "Data format in opinion is invalid"};
            callback(error);
          }
        }
      });
    }
  },

  getOpinions : function(req, callback) {
    if(req.body.token == undefined || req.body.token.length == 0 || req.body.email == undefined || req.body.email.length == 0) {
      var error = {error : "Token and emails is necessary"};
      callback(error);
    }
    else if(req.body.id == undefined || req.body.id.length == 0){
      var error = {error : "Restaurant ID is necessary"};
      callback(error);
    }
    else {
      managerToken.checkToken(req.body.email, null, req.body.token, function(token) {
        if(token == null) {
          var error = {error : "It is not possible to generate the token"};
          callback(error);
        }
        else if(token == -1) {
          var status = {status : "Invalid token"};
          callback(status);
        }
        else {
          var restaurants = models['Restaurants'];
          var query = {'_id' : req.body.id};
          restaurants.findOne(query, function(err, result) {
            if(err) {
              var error = {error : "Error with database"};
              callback(error);
            }
            else {
              var array = result['opinions'];
              array = {$in : array};
              var opinions = models['Opinions'];
              var data = [];
              opinions.find({"_id" : array}).exec(function(err, values) {
                if(err) {
                  var error = {error : "Error with database"};
                  callback(error);
                }
                else {
                  var status = {token : token, opinions : values};
                  callback(status);
                }
              });
            }
          });
        }
      });
    }
  },

  addPhoto : function(req, callback) {
    if(req.body.token == undefined || req.body.token.length == 0 || req.body.email == undefined || req.body.email.length == 0) {
      var error = {error : "Token and emails is necessary"};
      callback(error);
    }
    else if(req.body.id == undefined || req.body.id.length == 0){
      var error = {error : "Restaurant ID is necessary"};
      callback(error);
    }
    else if(req.files == undefined || req.files.length == 0) {
      var error = {error : "At least one file is necessary"};
      callback(error);
    }
    else {
      managerToken.checkToken(req.body.email, null, req.body.token, function(token) {
        if(token == null) {
          var error = {error : "It is not possible to generate the token"};
          callback(error);
        }
        else if(token == -1) {
          var status = {status : "Invalid token"};
          callback(status);
        }
        else {
          var query = {"_id" : req.body.id};
          var restaurants = models['Restaurants'];
          var photos = [];
          for(i in req.files) {
            var photo = { contentType : req.files[i].mimetype };
            photo['photo'] = fs.readFileSync(req.files[i].path);
            photos.push(photo);
          }
          var values = {photos : photos};
          restaurants.updateOne(query, {$push : values}, function(err, restaurant) {
            if(err) {
              var error = {error : "Update the restaurant in the database is not possible"};
              callback(error);
            }
            else {
              for(i in req.files) {
                var photo = req.files[i];
                fs.unlink(photo.path, function(err) {
                  if(err) {
                    console.log("Error deleted photo: " + i);
                  }
                });
              }
              var status = {token : token, status : "Photos added"};
              callback(status);
            }
          });
        }
      });
    }
  },

  getPhotos : function(req, callback) {
    if(req.body.token == undefined || req.body.token.length == 0 || req.body.email == undefined || req.body.email.length == 0) {
      var error = {error : "Token and emails is necessary"};
      callback(error);
    }
    else if(req.body.id == undefined || req.body.id.length == 0){
      var error = {error : "Restaurant ID is necessary"};
      callback(error);
    }
    else {
      managerToken.checkToken(req.body.email, null, req.body.token, function(token) {
        if(token == null) {
          var error = {error : "It is not possible to generate the token"};
          callback(error);
        }
        else if(token == -1) {
          var status = {status : "Invalid token"};
          callback(status);
        }
        else {
          var restaurants = models['Restaurants'];
          restaurants.findOne({"_id" : req.body.id}, function(err, result) {
            if(err) {
              var error = {error : "Error with database"};
              callback(error);
            }
            else {
              var status = {token : token, photos : result['photos']};
              callback(status);
            }
          });
        }
      });
    }
  },

  getRestaurants : function(req, callback) {
    if(req.body.token == undefined || req.body.token.length == 0 || req.body.email == undefined || req.body.email.length == 0) {
      var error = {error : "Token and emails is necessary"};
      callback(error);
    }
    if(req.body.filters == undefined || !util.checkFilters(req.body.filters)) {
      var error = {error : "Error with filters"};
      callback(error);
    }
    else {
      managerToken.checkToken(req.body.email, null, req.body.token, function(token) {
        if(token == null) {
          var error = {error : "It is not possible to generate the token"};
          callback(error);
        }
        else if(token == -1) {
          var status = {status : "Invalid token"};
          callback(status);
        }
        else {
          var restaurants = models['Restaurants'];
          var fields = {name : 1, webPage : 1, number : 1, calification : 1, price : 1, foods: 1, address : 1, schedules : 1};
          restaurants.find({}, fields).exec(function(err, values) {
            if(err) {
              var error = {error : "Error with database"};
              callback(error);
            }
            else {
              var array = [];
              for(i in values) {
                var restaurant = values[i];
                if(util.checkRestaurant(restaurant, req.body.filters)) {
                  array.push(restaurant);
                }
              }
              var status = {token : token, restaurants : array};
              callback(status);
            }
          });
        }
      });
    }
  }

}
