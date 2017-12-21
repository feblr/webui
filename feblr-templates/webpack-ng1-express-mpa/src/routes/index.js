var url = require('url');
var querystring = require('querystring');
var express = require('express');
var router = express.Router();
var config = require('../config');

router.get('/', function(req, res, next) {
  res.render('index.html');
});

module.exports = router;
