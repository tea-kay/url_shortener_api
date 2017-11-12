var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/url-shortener-api', {
  useMongoClient: true
})

module.exports = router;

// localhost:30303/http://wwww.google.com
// wildcards for EXpress req params *
