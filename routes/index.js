var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:url', function(req, res, next) {
  var newUrl = req.params.url;
  res.render('index', { url: newUrl });
});

module.exports = router;

// localhost:30303/http://wwww.google.com
// wildcards for EXpress req params *
