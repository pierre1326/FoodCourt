var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

module.exports = function(mongoose) {
  var Token = new Schema({
    code : String,
    expiration : String,
    email : String
  });
  var Code = new Schema({
    code : String,
    expiration : String,
    email : String
  });
  var Admin = new Schema({
    user : String,
    password : String
  });
  var Food = new Schema({
    type : String
  });
  var User = new Schema({
    name : String,
    email : String,
    password : String,
    commonLogin : Boolean,
    socialLogin : Boolean,
    photo : Buffer,
    contentType: String
  });
  var Opinion = new Schema({
    calification : Number,
    price : Number,
    date : Date,
    comment : String,
    user : String
  });
  var Restaurant = new Schema({
    name : String,
    number : Number,
    calification : Number,
    price : Number,
    webPage : String,
    foods : [String],
    opinions : [ObjectId],
    address : {lat : Number, long : Number, direction : String},
    schedules : [{day : String, open: Date, close: Date}],
    photos : [{photo : Buffer, contentType : String}]
  });
  var models = {
    Tokens : mongoose.model('Tokens', Token),
    Admins : mongoose.model('Admins', Admin),
    Foods : mongoose.model('Foods', Food),
    Users : mongoose.model('Users', User),
    Opinions: mongoose.model('Opinions', Opinion),
    Restaurants : mongoose.model('Restaurants', Restaurant),
    Codes : mongoose.model('Codes', Code)
  };
  return models;
}
