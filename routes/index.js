var express = require('express');
const app = require('../app');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(`https://${req.hostname}/index.html`);
  res.redirect(`https://${req.hostname}/index.html`);
});

module.exports = router;
