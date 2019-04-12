//Dependencies
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//Global variables
models = require('./constants/schemas')(mongoose);
values = require('./constants/values');
managerToken = require('./scripts/token.js');

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

//Add foods
var foods = models['Foods'];
foods.deleteMany({}, function(err) {
  if(err) {
    console.log('Error deleting foods');
  }
  else {
    var array = values['foods'];
    for(i in array) {
      var food = new foods({type : array[i]});
      food.save(function(err, resp) {
        if(err) {
          console.log('Error adding: ' + array[i]);
        }
      });
    }
  }
});

//Routes
require('./routes/routes.js')(app);

//Init server
app.listen(values['port'], function() {
  console.log("Serving FoodCourtTec on port: " + values['port']);
});
