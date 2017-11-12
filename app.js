var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var shortid = require('shortid');
var validUrl = require('valid-url');


var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// handle link get request

app.get('/*:url', function(req, res, next) {
  var { url } = req.params;
  var initialPath = req.param(0);
  var inputUrl = initialPath + url

  function generateShortId() {
    var newId = shortid.generate();
    return newId;
  }

  function createMongoRecord() {
    var newShortId = generateShortId();

  }

  if (validUrl.isUri(inputUrl)) {
    res.json({
      success: "Valid URL",
      input: inputUrl
   });
  } else {
    res.json({
      error: "Not a valid URL",
      input: inputUrl
   });
  }
});

// connect and listen to mongodb server

app.get('/fetch', (req, res) => {
  Item.find({}, (err, items) => {
    res.send({ success: true, items })
  })
})

app.post('/add', (req, res) => {
  const { item } = req.body
  const newItem = new Item({ item })

  newItem.save(err => {
    res.send({ success: true, item: newItem.item })
  })
})

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
