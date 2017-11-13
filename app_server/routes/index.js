var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'express app', info: 'users-api app..sorry, no UI.' });
});

module.exports = router;
