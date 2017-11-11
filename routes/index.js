var express = require('express');
var validUrl = require('valid-url');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('(*)/:url', function(req, res, next) {
  var { url } = req.params;
  var fullUrl = "https://" + url;

  if (validUrl.isUri(fullUrl)) {
    res.render('index', { fullUrl });
  } else {
    res.json({ error: "Not a valid URL" });
  }
});

module.exports = router;

// localhost:30303/http://wwww.google.com
// wildcards for EXpress req params *
