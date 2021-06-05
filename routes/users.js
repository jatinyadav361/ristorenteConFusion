var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');
var cors = require('./cors');

var User = require('../models/user');

var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  User.find({})
  .then((users) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(users);
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.post('/signup', cors.corsWithOptions, (req,res,next) => {
  // register method is made available by passport-local-mongoose
  User.register(new User({username : req.body.username}),req.body.password, (err,user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type','application/json');
      res.json({err : err});
    }
    else {
      //used to authenticate the user if it successfully registers
      if(req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if(req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      user.save((err,user) => {
        if(err) {
          res.statusCode = 500;
          res.setHeader('Content-Type','application/json');
          res.json({err : err});
          return ;
        }
        else {
          passport.authenticate('local')(req,res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json({status : 'Registration Successful!', success : true});
          });
        }
      });
    }
  });
});

router.post('/login', cors.corsWithOptions, passport.authenticate('local') , (req,res) => {
  // This method or callback is called if the user is successfully authenticated and user is available as req.user
  var token = authenticate.getToken({_id : req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.json({success : true,token : token, status : "Logged in successfully!"});
});

router.get('/logout', (req,res,next) => {
  if(req.user) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    return next(err);
  }
});

router.get('/facebook/token', passport.authenticate('facebook-token'), (req,res) => {
  if(req.user) {
    var token = authenticate.getToken({_id : req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json({success : true, token : token, status : 'Logged in successfully!'});
  }
});

module.exports = router;
