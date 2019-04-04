var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var models = require('./scripts/schemas')(mongoose);
var constants = require('./scripts/constants');
var nodemailer = require('nodemailer');
var uidGenerator = require('uid-generator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect(constants['mongoURI'], {useNewUrlParser : true}, function(err) {
  if(err) {
    console.log(err);
  }
  else {
    console.log('Connection successfull');
  }
});

app.post("/createUser", function(req, res) {
  if(req.body.email == undefined || req.body.email.length == 0 || req.body.name == undefined || req.body.name.length == 0 || req.body.password == undefined || req.body.password.length == 0) {
    var error = {error : "Data error"};
    res.send(error);
  }
  else {
    var users = models['Users'];
    users.findOne({email : req.body.email}, function(err, result) {
      if(err) {
        var error = {error : "Error with database"};
        res.send(error);
      }
      else if(result == null) {
        var user = new users({
          name : req.body.name,
          email : req.body.email,
          password : req.body.password,
          commonLogin : true,
          socialLogin : false,
          photo : req.body.photo,
          contentType : req.body.contentType
        });
        user.save(function(err, resp) {
          if(err) {
            var error = {error : "Save the user in database is not possible"};
            res.send(error);
          }
          else {
            var status = {status : "Successfully registered"};
            res.send(status);
          }
        });
      }
      else {
        if(result['commonLogin']) {
          var status = {status : "User is already exists"};
          res.send(status);
        }
        else {
          var values = {
            name : req.body.name,
            password : req.body.password,
            commonLogin : true,
            photo : req.body.photo,
            contentType : req.body.contentType
          };
          users.updateOne({email : req.body.email}, {$set : values}, function(err, user) {
            if(err) {
              var error = {error : "Update the user in the database is not possible"};
              res.send(error);
            }
            else {
              var status = {status : "The user's account was updated"};
              res.send(status);
            }
          });
        }
      }
    });
  }
});

app.post("/updateUser", function(req, res) {
  if(req.body.email == undefined || req.body.email.length == 0 || req.body.token == undefined || req.body.token.length == 0) {
    var error = {error : "All the information is necessary"};
    res.send(error);
  }
  else {
    checkToken(req.body.email, false, req.body.token, function(token) {
      if(token == null) {
        var error = {error : "It is not possible to generate the token"};
        res.send(error);
      }
      else if(token == -1) {
        var status = {status : "Invalid token"};
        res.send(status);
      }
      else {
        var values = {};
        if(req.body.name != undefined && req.body.name.length > 0) values['name'] = req.body.name;
        if(req.body.photo != undefined && req.body.contentType != undefined && req.body.contentType > 0) {
          values['photo'] = req.body.photo;
          values['contentType'] = req.body.contentType;
        }
        var users = models['Users'];
        users.updateOne({email : req.body.email}, {$set : values}, function(err, user) {
          if(err) {
            var error = {error : "Update the user in the database is not possible"};
            res.send(error);
          }
          else {
            var status = {status : "The user's account was updated", token : token};
            res.send(status);
          }
        });
      }
    });
  }
});

app.post("/loginUser", function(req, res) {
  if(req.body.email == undefined || req.body.email.length == 0) {
    var error = {error : "Email is necessary"};
    res.send(error);
  }
  else if(req.body.password != undefined && req.body.socialLogin != undefined || req.body.password == undefined && req.body.socialLogin == undefined) {
    var error = {error : "A unique login method is necessary"};
    res.send(error);
  }
  else if(req.body.password != undefined && req.body.password.length == 0) {
    var error = {error : "Valid password is require"};
    res.send(error);
  }
  else {
    var users = models['Users'];
    users.findOne({email : req.body.email}, function(err, result) {
      if(err) {
        var error = {error : "Error with database"};
        res.send(error);
      }
      else if(req.body.socialLogin) {
        checkToken(req.body.email, true, null, function(token) {
          if(token == null) {
            var error = {error : "It is not possible to generate the token"};
            res.send(error);
          }
          if(result == null) {
            var user = new users({
              name : null,
              email : req.body.email,
              password : null,
              commonLogin : false,
              socialLogin : true,
              photo : null,
              contentType : null
            });
            user.save(function(err, resp) {
              if(err) {
                var error = {error : "Save the user in database is not possible"};
                res.send(error);
              }
              else {
                var status = {token : token};
                res.send(status);
              }
            });
          }
          else {
            var response = {token : token};
            res.send(response);
          }
        });
      }
      else if(result == null) {
        var status = {status : "The user doesn't exists"};
        res.send(status);
      }
      else if(result['password'] == req.body.password) {
        checkToken(req.body.email, true, null, function(token) {
          if(token == null) {
            var error = {error : "It is not possible to generate the token"};
            res.send(error);
          }
          else {
            var response = {token : token, name : result['name'], photo : result['photo'], contentType : result['contentType']};
            res.send(response);
          }
        });
      }
      else {
        var status = {status : "Incorrect password"};
        res.send(status);
      }
    });
  }
});

app.post("/requestCode", function(req, res) {
  if(req.body.email == undefined || req.body.email.length == 0) {
    var error = {error : "Email is Invalid"};
    res.send(error);
  }
  else {
    var query = {email : req.body.email};
    var users = models['Users'];
    users.findOne(query, function(err, result) {
      if(err) {
        var error = {error : "Error with database"};
        res.send(error);
      }
      if(result == null) {
        var error = {error : "The user doesn't exists"};
        res.send(error);
      }
      else if(result['commonLogin']){
        var uidgen = new uidGenerator(uidGenerator.BASE10, 4);
        var token = uidgen.generateSync();
        var codes = models['Codes'];
        codes.deleteOne(query, function(err, result) {
          if(err) {
            var error = {error : "Error with database"};
            res.send(error);
          }
          else {
            var currentDate = new Date();
            var code = new codes({
              code : token,
              expiration : currentDate.setMinutes( currentDate.getMinutes() + constants['expirationCode'] ),
              email : req.body.email
            });
            code.save(function(err, response) {
              if(err) {
                var error = {error : "It is not possible to generate the code"};
                res.send(error);
              }
              else {
                var transporter = nodemailer.createTransport({
                  service: constants['service'],
                  auth: {
                    user: constants['user'],
                    pass: constants['pass']
                  }
                });
                var mailOptions = {
                  from: constants['user'],
                  to: req.body.email,
                  subject: 'Password recovery',
                  text: "The code is: " + token
                };
                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    var error = {error : "Error when sending mail"};
                    res.send(error);
                  } else {
                    var status = {status : "Email sent"};
                    res.send(status);
                  }
                });
              }
            });
          }
        });
      }
      else {
        var error = {error : "A valid account is required"};
        res.send(error);
      }
    });
  }
});

app.post("/resetPassword", function(req, res) {
  if(req.body.email == undefined || req.body.email.length == 0 || req.body.password == undefined || req.body.password.length == 0 || req.body.code == undefined || req.body.code.length != 4) {
    var error = {error : "Information not valid"};
    res.send(error);
  }
  else {
    var codes = models['Codes'];
    var query = {email : req.body.email};
    codes.findOne(query, function(err, result) {
      if(err) {
        var error = {error : "Error with database"};
        res.send(error);
      }
      else if(result == null) {
        var status = {status : "Invalid email"};
        res.send(status);
      }
      else if(result['code'] == req.body.code) {
        codes.deleteOne(query, function(err, resp) {
          if(err) {
            var error = {error : "Error with database"};
            res.send(error);
          }
          else {
            var currentDate = new Date();
            if(result['expiration'] <= currentDate) {
              var status = {status : "The code expired"};
              res.send(status);
            }
            else {
              var values = {password : req.body.password};
              var users = models['Users'];
              users.updateOne(query, {$set : values}, function(err, user) {
                if(err) {
                  var error = {error : "Update the user in the database is not possible"};
                  res.send(error);
                }
                else {
                  var status = {status : "The password has been changed"};
                  res.send(status);
                }
              });
            }
          }
        });
      }
      else {
        var status = {status : "Invalid code"};
        res.send(status);
      }
    });
  }
});

app.post("/createAdmin", function(req, res) {
  if(req.body.user == undefined || req.body.user.length == 0 || req.body.password == undefined || req.body.password.length == 0) {
    var error = {error : "Data incompleted"};
    res.send(error);
  }
  else {
    var query = {user : req.body.user};
    var admins = models['Admins'];
    admins.findOne(query, function(err, result) {
      if(err) {
        var error = {error : "Error with database"};
        res.send(error);
      }
      if(result != null) {
        var status = {status : "Admin is already exists"};
        res.send(status);
      }
      else {
        var admin = admins.create({
          user : req.body.user,
          password : req.body.password
        });
        admin.save(function(err, resp) {
          if(err) {
            var error = {error : "Error with database"};
            res.send(error);
          }
          else {
            var status = {status : "Admin created"};
            res.send(status);
          }
        });
      }
    });
  }
});

app.get("/", function(req, res) {
  res.render("index");
});

app.post("/home", function(req, res) {

});

function checkToken(email, login, actualToken, callback) {
  var currentDate = new Date();
  var query = {email : email};
  var tokens = models['Tokens'];
  var token;
  if(login) {
    createToken(email, function(result) {
      callback(result);
    });
  }
  else {
    tokens.findOne(query, function(err, result) {
      if(err) {
        callback(null);
      }
      else if(result == null) {
        createToken(email, function(result) {
          callback(result);
        });
      }
      else {
        if(result['code'] != actualToken) {
          callback(-1);
        }
        else if(result['expiration'] <= currentDate) {
          createToken(email, function(result) {
            callback(result);
          });
        }
        else {
          callback(result['code']);
        }
      }
    });
  }
}

function createToken(email, callback) {
  var currentDate = new Date();
  var query = {email : email};
  var tokens = models['Tokens'];
  tokens.deleteOne(query, function(err, result) {
    if(err) {
      callback(null);
    }
  });
  var uidgen = new uidGenerator(uidGenerator.BASE58, 10);
  var code = uidgen.generateSync();
  var token = new tokens({
    code : code,
    expiration : currentDate.setMinutes( currentDate.getMinutes() + constants['expirationLogin'] ),
    email : email
  });
  token.save(function(err, resp) {
    if(err) {
      callback(null);
    }
    else {
      callback(code);
    }
  });
}

app.listen(constants['port'], function() {
  console.log("Serving FoodCourtTec on port: " + constants['port']);
});
