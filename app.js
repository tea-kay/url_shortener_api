var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var shortid = require('shortid');
var validUrl = require('valid-url');
var Url = require('./model/url');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/url-shortener-api', {
  useMongoClient: true
})

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// handle link get request

app.get('/:shortUrl', (req, res, next) => {
  var { shortUrl } = req.params;

  Url.findOne({ short_url: shortUrl }, (err, result) => {
    if (err) return res.send({ err })
    if (result) {
        return res.redirect(result.original_url)
    } else {
      return res.json({
        error: "Not a valid URL",
        input: shortUrl
      })
    }
  })
})

app.get('/*:url', (req, res, next) => {
  var { url } = req.params;
  var initialPath = req.param(0);
  var inputUrl = initialPath + url;

  if (validUrl.isUri(inputUrl)) {

    Url.findOne({ original_url: inputUrl }, (err, result) => {
      if (err) return res.send({ err })
      if (!result) {
        var newUrl = new Url({
          original_url: inputUrl,
          short_url: shortid.generate()
        });

        newUrl.save((err) => {
          if (err) return res.send({ err });
          return res.send({ newUrl })
        })
      } else {
        return res.send(result);
      }
    })
  } else {
    return res.json({
      error: "Not a valid URL",
      input: inputUrl
   });
  }
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
