var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Token = require('../models/Token');
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var expressJwt = require('express-jwt');

//fetches the secret from the app config
var secretCallback = function(req, payload, done) {
  var secret = req.app.get('superSecret');
  done(null, secret);
};

//retrieve token from headers
var getTokenFromHeaders = function (headers) {
  var t = headers.authorization.split(' ');
  return t[1];
};

//list paths that will not require authentication
var publicPaths = [
  '/api/users/deleteAll',
  '/api/users/signup',
  '/api/users/signin',
];

//verify JWT middleware
router.use(expressJwt({
    secret: secretCallback
  })
  .unless({
    path: publicPaths
}));

//middleware to make sure token has not been manually expired
router.use(function (req, res, next) {
  var requestedPath = req.originalUrl;
  //skip if requested path is public
  if (publicPaths.indexOf(requestedPath) >= 0) next();

  var token = getTokenFromHeaders(req.headers);
  Token.find({token: token}, function(err, tokens) {
    if (err) return console.error(err);

    if (tokens.length ===  0) {
      res.json({
        "status": false,
        "message": "Session Expired or Invalid"
      });
    }

    next();
  });
});

//  GET /api/users/list
router.get('/list', function(req, res) {
  User.find(function(err, users) {
    if (err) return console.error(err);
    res.json(users);
  });
});

//  GET /api/users/deleteAll
//test route for clearing junk users.
router.get('/deleteAll', function(req, res) {
  User.find(function(err, users) {
    if (err) return console.error(err);
    users.forEach(function(user, index, array) {
      user.remove();
    });
    res.json({
      'status': true
    });
  });
});

//  POST /api/users/signup
router.post('/signup', function(req, res) {
  var salt = bcrypt.genSaltSync(10);
  var pwd = req.body.password;
  //hashSync throws error if you pass undefined pwd
  var hash = pwd !== undefined ? bcrypt.hashSync(pwd, salt) : "";
  var newUser = new User();
  newUser.email = req.body.email;
  newUser.passwordHash = hash;

  //SAVE THE NEW USER
  newUser.save(function(err, user) {
    if (err) res.json(err);
    var token = jwt.sign(user, req.app.get('superSecret'));
    var tokenRec = new Token({token: token});
    tokenRec.save();
    res.json({
      token: token
    });
  });
});

//  POST /api/users/signin
router.post('/signin', function(req, res) {
  console.log('email', req.body.email);
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) {
      res.json({
        "status": false,
        "data": "Error occured: " + err
      });
    } else {
      if (user) {
        console.log('user found', user);
        //if password is correct, generate a token
        if (bcrypt.compareSync(req.body.password, user.passwordHash)) {
          var token = jwt.sign(user, req.app.get('superSecret'), {
            expiresInMinutes: 1440 // expires in 24 hours
          });

          res.json({
            "status": true,
            "email": user.email,
            "token": token,
          });
        }
        else {
          res.json({
            "status": false,
            "message": "Username or Password Incorrect"
          });
        }
      } else {
        res.json({
          "status": false,
          "data": "Incorrect email/password"
        });
      }
    }
  });
});

//  GET /api/users/signout
router.get('/signout', function(req, res) {

  var token = getTokenFromHeaders(req.headers);

  Token.find({token: token}, function (err, tokens) {
    tokens.forEach(function(token, index, array) {
      token.remove();
    });
    res.json({
      "status": true,
      "Message": "You have been successfully logged out"
    });
  });
});


module.exports = router;
