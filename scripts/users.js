var uidGenerator = require('uid-generator');
var nodemailer = require('nodemailer');
var fs = require('fs');

module.exports = {

  createUser : function(req, callback) {
    if(req.body.email == undefined || req.body.email.length == 0 || req.body.name == undefined || req.body.name.length == 0 || req.body.password == undefined || req.body.password.length == 0) {
      var error = {status : "Data error"};
      callback(error);
    }
    else {
      var users = models['Users'];
      users.findOne({email : req.body.email}, function(err, result) {
        if(err) {
          var error = {status : "Error with database"};
          callback(error);
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
              var error = {status : "Save the user in database is not possible"};
              callback(error);
            }
            else {
              var status = {status : "Successfully registered"};
              callback(status);
            }
          });
        }
        else {
          if(result['commonLogin']) {
            var status = {status : "User is already exists"};
            callback(status);
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
                var error = {status : "Update the user in the database is not possible"};
                callback(status);
              }
              else {
                var status = {status : "The user's account was updated"};
                callback(status);
              }
            });
          }
        }
      });
    }
  },

  loginUser : function(req, callback) {
    if(req.body.email == undefined || req.body.email.length == 0) {
      var error = {status : "Email is necessary"};
      callback(error);
    }
    else if(req.body.password != undefined && req.body.socialLogin != undefined || req.body.password == undefined && req.body.socialLogin == undefined) {
      var error = {status : "A unique login method is necessary"};
      callback(error);
    }
    else if(req.body.password != undefined && req.body.password.length == 0) {
      var error = {status : "Valid password is require"};
      callback(error);
    }
    else {
      var users = models['Users'];
      users.findOne({email : req.body.email}, function(err, result) {
        if(err) {
          var error = {status : "Error with database"};
          callback(error);
        }
        else if(req.body.socialLogin) {
          managerToken.checkToken(req.body.email, true, null, function(token) {
            if(token == null) {
              var error = {status : "It is not possible to generate the token"};
              callback(error);
            }
            else if(result == null) {
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
                  var error = {status : "Save the user in database is not possible"};
                  callback(error);
                }
                else {
                  var status = {token : token};
                  callback(status);
                }
              });
            }
            else {
              var status = {token : token};
              callback(status);
            }
          });
        }
        else if(result == null) {
          var status = {status : "The user doesn't exists"};
          callback(status);
        }
        else if(result['password'] == req.body.password) {
          managerToken.checkToken(req.body.email, true, null, function(token) {
            if(token == null) {
              var error = {status : "It is not possible to generate the token"};
              callback(error);
            }
            else {
              var status = {token : token, name : result['name'], photo : result['photo'], contentType : result['contentType']};
              callback(status);
            }
          });
        }
        else {
          var status = {status : "Incorrect password"};
          callback(status);
        }
      });
    }
  },

  updateName : function(req, callback) {
    if(req.body.email == undefined || req.body.email.length == 0 || req.body.token == undefined || req.body.token.length == 0) {
      var error = {status : "All the information is necessary"};
      callback(error);
    }
    else {
      managerToken.checkToken(req.body.email, false, req.body.token, function(token) {
        if(token == null) {
          var error = {status : "It is not possible to generate the token"};
          callback(error);
        }
        else if(token == -1) {
          var status = {status : "Invalid token"};
          callback(status);
        }
        else {
          var values = {};
          if(req.body.name != undefined && req.body.name.length > 0) values['name'] = req.body.name;
          var users = models['Users'];
          users.updateOne({email : req.body.email}, {$set : values}, function(err, user) {
            if(err) {
              var error = {status : "Update the user in the database is not possible"};
              callback(error);
            }
            else {
              var status = {status : "The user's account was updated", token : token};
              callback(status);
            }
          });
        }
      });
    }
  },

  updatePhoto : function(req, callback) {
    if(req.file == undefined) {
      var error = {status : "A file is necessary"};
      callback(error);
    }
    else if(req.body.contentType == undefined || req.body.contentType.length == 0 || req.body.email == undefined || req.body.email.length == 0 || req.body.token == undefined || req.body.token.length == 0) {
      var error = {status : "Data is not completed"};
      callback(error);
    }
    else {
      managerToken.checkToken(req.body.email, false, req.body.token, function(token) {
        if(token == null) {
          var error = {status : "It is not possible to generate the token"};
          callback(error);
        }
        else if(token == -1) {
          var status = {status : "Invalid token"};
          callback(status);
        }
        else {
          var query = {email : req.body.email};
          var users = models['Users'];
          users.findOne(query, function(err, result) {
            if(err) {
              var error = {status : "Error with database"};
              callback(error);
            }
            else if(result == null) {
              var error = {status : "The user doesn't exists"};
              callback(error);
            }
            else {
              var users = models['Users'];
              var values = {contentType : req.body.contentType, photo : fs.readFileSync(req.file.path)};
              users.updateOne({email : req.body.email}, {$set : values}, function(err, user) {
                if(err) {
                  var error = {status : "Update the user in the database is not possible"};
                  callback(error);
                }
                else {
                  fs.unlink(req.file.path, function(err) {
                    if(err) {
                      var error = {status : "The server could not take the imgen"};
                      callback(error);
                    }
                    else {
                      var status = {status : "The user's account was updated", token : token};
                      callback(status);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  },

  requestCode : function(req, callback) {
    if(req.body.email == undefined || req.body.email.length == 0) {
      var error = {status : "Email is Invalid"};
      callback(error);
    }
    else {
      var query = {email : req.body.email};
      var users = models['Users'];
      users.findOne(query, function(err, result) {
        if(err) {
          var error = {status : "Error with database"};
          callback(error);
        }
        else if(result == null) {
          var error = {status : "The user doesn't exists"};
          callback(error);
        }
        else if(result['commonLogin']){
          var uidgen = new uidGenerator(uidGenerator.BASE10, 4);
          var token = uidgen.generateSync();
          var codes = models['Codes'];
          codes.deleteOne(query, function(err, result) {
            if(err) {
              var error = {status : "Error with database"};
              callback(error);
            }
            else {
              var currentDate = new Date();
              var code = new codes({
                code : token,
                expiration : currentDate.setMinutes( currentDate.getMinutes() + values['expirationCode'] ),
                email : req.body.email
              });
              code.save(function(err, response) {
                if(err) {
                  var error = {status : "It is not possible to generate the code"};
                  callback(error);
                }
                else {
                  var transporter = nodemailer.createTransport({
                    service: values['service'],
                    auth: {
                      user: values['user'],
                      pass: values['pass']
                    }
                  });
                  var mailOptions = {
                    from: values['user'],
                    to: req.body.email,
                    subject: 'Password recovery',
                    text: "The code is: " + token
                  };
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      var error = {status : "Error when sending mail"};
                      callback(error);
                    }
                    else {
                      var status = {status : "Email sent"};
                      callback(status);
                    }
                  });
                }
              });
            }
          });
        }
        else {
          var error = {status : "A valid account is required"};
          res.send(error);
        }
      });
    }
  },

  resetPassword : function(req, callback) {
    if(req.body.email == undefined || req.body.email.length == 0 || req.body.password == undefined || req.body.password.length == 0 || req.body.code == undefined || req.body.code.length != 4) {
      var error = {status : "Information not valid"};
      callback(error);
    }
    else {
      var codes = models['Codes'];
      var query = {email : req.body.email};
      codes.findOne(query, function(err, result) {
        if(err) {
          var error = {status : "Error with database"};
          callback(error);
        }
        else if(result == null) {
          var status = {status : "Invalid email"};
          callback(error);
        }
        else if(result['code'] == req.body.code) {
          codes.deleteOne(query, function(err, resp) {
            if(err) {
              var error = {status : "Error with database"};
              callback(error);
            }
            else {
              var currentDate = new Date();
              if(result['expiration'] <= currentDate) {
                var status = {status : "The code expired"};
                callback(status);
              }
              else {
                var values = {password : req.body.password};
                var users = models['Users'];
                users.updateOne(query, {$set : values}, function(err, user) {
                  if(err) {
                    var error = {status : "Update the user in the database is not possible"};
                    callback(error);
                  }
                  else {
                    var status = {status : "The password has been changed"};
                    callback(status);
                  }
                });
              }
            }
          });
        }
        else {
          var status = {status : "Invalid code"};
          callback(status);
        }
      });
    }
  }

}
