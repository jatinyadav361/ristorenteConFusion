var express = require('express');
const app = require('../app');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(`https://${req.hostname}/index.html`);
  res.redirect(`https://${req.hostname}/index.html`);
  res.end('Redirected to homepage');
  return;
});

router.get('/menu', function(req, res, next) {
  console.log(`https://${req.hostname}/index.html`);
  res.redirect(`https://${req.hostname}/index.html`);
  res.end('Redirected to homepage');
});

router.get('/home', function(req, res, next) {
  console.log(`https://${req.hostname}/index.html`);
  res.redirect(`https://${req.hostname}/index.html`);
  res.end('Redirected to homepage');
});

router.get('/cart', function(req, res, next) {
  console.log(`https://${req.hostname}/index.html`);
  res.redirect(`https://${req.hostname}/index.html`);
  res.end('Redirected to homepage');
});

router.get('/contactus', function(req, res, next) {
  console.log(`https://${req.hostname}/index.html`);
  res.redirect(`https://${req.hostname}/index.html`);
  res.end('Redirected to homepage');
});

router.get('/favorites', function(req, res, next) {
  console.log(`https://${req.hostname}/index.html`);
  res.redirect(`https://${req.hostname}/index.html`);
  res.end('Redirected to homepage');
});

router.get('/orders', function(req, res, next) {
  console.log(`https://${req.hostname}/index.html`);
  res.redirect(`https://${req.hostname}/index.html`);
  res.end('Redirected to homepage');
});

router.get('/aboutus', function(req, res, next) {
  console.log(`https://${req.hostname}/index.html`);
  res.redirect(`https://${req.hostname}/index.html`);
  res.end('Redirected to homepage');
});

router.get('/menu/:id', function(req, res, next) {
  console.log(`https://${req.hostname}/index.html`);
  res.redirect(`https://${req.hostname}/index.html`);
  res.end('Redirected to homepage');
});

module.exports = router;
