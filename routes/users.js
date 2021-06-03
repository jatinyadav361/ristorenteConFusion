var express = require('express');
var bodyParser = require('body-parser');

var User = require('../models/user');

var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({})
  .then((users) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(users);
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.post('/signup', (req,res,next) => {
  User.findOne({username : req.body.username})
  .then((user) => {
    if(user != null) {
      var err = new Error('User '+ req.body.username+' already exists!');
      err.status = 403;
      return next(err);
    }
    else {
      return User.create({
        username : req.body.username,
        password : req.body.password
      });
    }
  })
  .then((user) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json({status : 'Registration Successful!', user : user});
  }, err => next(err))
  .catch((err) => next(err));
});

router.post('/login', (req,res,next) => {
  if(!req.session.user) {
    var authHeader = req.headers.authorization;
    if(!authHeader) {
      var error = new Error('You are not authorized to access this');
      error.status = 401;
      res.setHeader('WWW-Authenticate','Basic');
      return next(error);
    }
  
    var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];

    User.findOne({username : username})
    .then((user) => {
      if(user === null) {
        var error = new Error(`user ${username} not registered!`);
        error.status = 403;
        return next(error);
      }
      else if (password != user.password) {
        var error = new Error(`your password is incorrect`);
        error.status = 403;
        return next(error);
      }
      else if (user.username === username && user.password === password) {
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        res.end('You have been authenticated successfully!');
      }
    }, err => next(err))
    .catch((err) => next(err));
  }
  else {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.end('You are already authenticated');
  }
});

router.get('/logout', (req,res,next) => {
  if(req.session.user === 'authenticated') {
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

module.exports = router;
