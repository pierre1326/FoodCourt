var uidGenerator = require('uid-generator');

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
    else {
      var uidgen = new uidGenerator(uidGenerator.BASE58, 10);
      var code = uidgen.generateSync();
      var token = new tokens({
        code : code,
        expiration : currentDate.setMinutes( currentDate.getMinutes() + values['expirationLogin'] ),
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
  });
}

module.exports = { checkToken, createToken };
