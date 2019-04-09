//Dependencies
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var models = require('./constants/schemas')(mongoose);
var values = require('./constants/values');
var managerToken = require('./scripts/token.js');

//Configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

//Database
mongoose.connect(values['mongoURI'], {useNewUrlParser : true}, function(err) {
  if(err) {
    console.log(err);
  }
  else {
    console.log('Connection successfull');
  }
});

//Routes
require('./routes/routes.js')(app, models, values, managerToken);

//Init server
app.listen(values['port'], function() {
  console.log("Serving FoodCourtTec on port: " + values['port']);
});
