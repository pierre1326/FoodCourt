var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

var mongoURI = "mongodb://pierre1326:profesoR1@ds149875.mlab.com:49875/tec";
var PORT = 5000 | process.env.PORT;

mongoose.connect(mongoURI, { useNewUrlParser: true });



app.listen(PORT, function() {
  console.log("Serving FoodCourtTec on port" + PORT);
});
