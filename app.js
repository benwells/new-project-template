// Required Modules
var express    = require("express");
var morgan     = require("morgan");
var bodyParser = require("body-parser");
var jwt        = require("jsonwebtoken");
// var passport   = require("passport");
var mongoose   = require("mongoose");
var app        = express();

var port = process.env.PORT || 3001;

//require controllers
var routes = require('./app/controllers/index.js');

// Connect to DB
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost/cargodb");

//server config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type, Authorization');
    next();
});

//set secret for jwt
app.set('superSecret', "BE VEWY QUIET" || process.env.secret);

app.use('/api', routes);

process.on('uncaughtException', function(err) {
    console.log(err);
});

// Start Server
app.listen(port, function () {
    console.log( "Express server listening on port " + port);
});
