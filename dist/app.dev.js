"use strict";

require('./lib/db');

require('dotenv').config();

var express = require('express');

logger = require('morgan');
var app = express();

var accountRoute = require('./routes/index'); //middleware


app.use(logger('dev'));
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json()); // //api routes

app.use('/v1', accountRoute);
app.get("/", function (req, res) {
  res.json({
    message: "This is the main application entry point"
  });
});
app.use(function (error, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = error.message;
  res.locals.error = req.app.get("env") === "development" ? error : {};
  console.log(error); // render the error page

  if (!error.code) {
    return res.status(500).json({
      message: error.message || "Error processing request",
      status: false,
      data: null
    });
  }

  return res.status(error.code).json({
    message: error.message,
    status: false,
    data: null
  });
}); //server

app.listen(process.env.PORT, function (_) {
  console.log("Server running on PORT ".concat(process.env.PORT, " "));
});
if (function (err) {
  console.log("Error connecting to MongoDB: ".concat(err));
}) ;