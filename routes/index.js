var express = require('express');
const app = require('../app');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(`https://${req.hostname}/index.html`);
  res.redirect(307,`https://${req.hostname}/index.html`);
});

router.get('/menu', function(req, res, next) {
  console.log(`https://${req.hostname}/index.html`);
  res.redirect(307,`https://${req.hostname}/index.html`);
});

router.get('/home', function(req, res, next) {
  console.log(`https://${req.hostname}/index.html`);
  res.redirect(307,`https://${req.hostname}/index.html`);
});

router.get('/cart', function(req, res, next) {
  console.log(`https://${req.hostname}/index.html`);
  res.redirect(307,`https://${req.hostname}/index.html`);
});

router.get('/contactus', function(req, res, next) {
  console.log(`https://${req.hostname}/index.html`);
  res.redirect(307,`https://${req.hostname}/index.html`);
});

router.get('/favorites', function(req, res, next) {
  console.log(`https://${req.hostname}/index.html`);
  res.redirect(307,`https://${req.hostname}/index.html`);
});

router.get('/orders', function(req, res, next) {
  console.log(`https://${req.hostname}/index.html`);
  res.redirect(307,`https://${req.hostname}/index.html`);
});

router.get('/aboutus', function(req, res, next) {
  console.log(`https://${req.hostname}/index.html`);
  res.redirect(307,`https://${req.hostname}/index.html`);
});

router.get('/menu/:id', function(req, res, next) {
  console.log(`https://${req.hostname}/index.html`);
  res.redirect(307,`https://${req.hostname}/index.html`);
});

module.exports = router;
